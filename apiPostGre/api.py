import os
import shutil

from flask import Flask, render_template, request, jsonify, make_response, send_file
from flask_migrate import Migrate
from flask_socketio import SocketIO, send, join_room, leave_room, emit, rooms
from sqlalchemy import func
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
import jwt
import datetime
from functools import wraps
from werkzeug.utils import secure_filename
from werkzeug.datastructures import  FileStorage
import random
import string
import hashlib
import json

from id import getid
from live import LiveData
from models import db, User, Formation, Affectation, Groupe, RessourceStat, RessourceText, RessourceQestions, \
    Evaluation, Module, Question, Media, ReponseEvaluation, RessourceLive, RessourceLiveDetail, \
    RessourceLiveParticipation, RessourceSetting
from engineio.payload import Payload



from RestrictedPython import safe_builtins, compile_restricted, PrintCollector

Payload.max_decode_packets = 5000

app = Flask(__name__)
app.config['CORS_HEADERS'] = '*'

CORS(app, origins="*", allow_headers="*")
app.config['SECRET_KEY'] = 'thisissecret'
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://"+getid()[0]+":"+getid()[1]+"@localhost:5432/kap"
app.config['SQLALCHEMY_COMMIT_ON_TEARDOWN'] = True
app.config['CORS_HEADERS'] = 'Content-Type'

ALLOWED_EXTENSIONS = {'txt', 'doc', 'dox', 'jpg', 'jpeg', 'png', 'xls', 'xlsx', 'zip', 'rar', 'csv'}

db.init_app(app)
migrate = Migrate(app, db)

socketio = SocketIO(app, cors_allowed_origins="*",ping_timeout=5, ping_interval=5)

liveUser = {}


@app.route('/')
def home():
    return "[/configuration pour une premiere utilisation]"

#----------------------------------------- SECURITY ------------------------------
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        print("Valide Token")

        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']

        print("token ",token)
        if not token:
            print('Token is missing! ',request.headers)
            return jsonify({'message' : 'Token is missing!'}), 401

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'],algorithms=["HS256"])
            print(data)
            current_user = User.query.filter_by(id=data['id']).first()
        except  Exception as exc:
            print(exc)
            return jsonify({'message' : 'Token is invalid!'}), 401

        if current_user is None:
            return jsonify({'message': 'User is invalid!'}), 401
        return f(current_user, *args, **kwargs)

    return decorated


@socketio.on('join')
def on_join(data):
    print("Joining!",request)
    print('on_join!', data)
    token = data["token"]["token"]
    dataId = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
    print('on_join',dataId)
    current_user = User.query.filter_by(id=dataId['id']).first()
    if current_user.rank == 0:
        live = RessourceLive(titre=data["titre"])
        live.id_module=data["module"]["id_module"]
        live.dateO=datetime.datetime.now().timestamp()
        live.id_owner=dataId["id"]
        live.room = data["room"]
        db.session.add(live)
        db.session.commit()
        liveUser[current_user.id]=LiveData()
        join_room(liveUser[current_user.id].roomProf)
        print("j",live,liveUser)

    if current_user.rank != 0:
        live = RessourceLive.query.filter_by(room=data["room"]).first()
        print("live ? ",live.serialize(),liveUser)
        if live is None:
            print("live is None")
            return
        if live.id_owner not in liveUser.keys():
            print("live owner error",liveUser)
            return
        if current_user.id not in liveUser[live.id_owner].listEtu:
            liveUser[live.id_owner].listEtu.append(current_user.id)
            print("emit ", current_user.firstname + " " + current_user.lastname)
            emit('addClient', {'name': current_user.firstname + " " + current_user.lastname, 'id': dataId['id']},
                 broadcast=True, room=liveUser[live.id_owner].roomProf)

        join_room(current_user.id)





@socketio.on('reward')
def on_reward(data):
    print("reward",data)
    for d in data['reponsesList']:
        reponse = RessourceLiveParticipation.query.filter_by(content=d['content'],id_RessourceLiveDetail=d["id_RessourceLiveDetail"],id_user=d['id_user']).first()
        if reponse is not None:
            liveDetail = RessourceLiveDetail.query.filter_by(id=reponse.id_RessourceLiveDetail).first()
            live = RessourceLive.query.filter_by(id=liveDetail.id_live).first()
            reponse.reward=d["reward"]
            db.session.commit()
            rs = reponse.serialize()
            rs["id_live"]=d["question"]["id_live"]
            print("r",rs)
            for c in liveUser[live.id_owner].listEtu:
                emit('getReward',rs,broadcast=True, room=c)



@socketio.on('joinpublic')
def on_join_public(data):
    print("Joining public !",liveUser)
    print('on_join!', data)
    pkey = data["publickey"]
    live = RessourceLive.query.filter_by(public_key=pkey).first()
    if live is not None:
        if data["name"] not in liveUser[live.id_owner].listEtu:
            liveUser[live.id_owner].listEtu.append(data["name"])
            join_room(data["name"])
            emit("joinpublic",{"titre":live.titre, "room":data["name"]})
            emit('addClient',{'name':"visiteur "+str(data["name"])},broadcast=True, room=liveUser[live.id_owner].roomProf)







@socketio.on('leaving')
def on_leave():
    print('disconnection!')

@socketio.on('liveReponse')
def on_liveReponse(data):
    print("liveReponse",data)
    dataId={}
    current_user=None
    if data["visiteurID"]!="":
        print("public rep",liveUser[2].listEtu)
        dataId['id']=data["visiteurID"]
    else:
        token = data["token"]["token"]
        dataId = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
        current_user = User.query.filter_by(id=dataId['id']).first()
        if current_user is None:
            return jsonify({"msg":"Erreur user"})
    detail = RessourceLiveDetail.query.filter_by(id=data["question"]['id']).first()
    if detail is not None:
        if detail.dateF > datetime.datetime.now().timestamp():
            live = RessourceLive.query.filter_by(id=detail.id_live).first()
            if live is not None:
                if detail.reponseunique==1:
                    print("rep unique ",data["question"])
                    rep = RessourceLiveParticipation.query.filter_by(id_RessourceLiveDetail=data["question"]['id'],id_user=dataId['id']).all()
                    print("rep unique ",len(rep),dataId['id'])
                    if len(rep)!=0:
                        emit("already", {'id':dataId['id']},  room=dataId['id'])
                        return

                rep = RessourceLiveParticipation.query.filter_by(id_RessourceLiveDetail=data["question"]['id'],id_user=dataId['id'],content=data["reponse"]).all()
                if len(rep)!=0 :
                    print("spam",rep)
                    emit("already", {'id': dataId['id']}, room=dataId['id'])
                    return


                reponse = RessourceLiveParticipation(id_RessourceLiveDetail=data["question"]['id'])
                reponse.id_module = data["question"]['id_module']
                reponse.content = data["reponse"]
                reponse.id_user = dataId['id']
                reponse.dateO=datetime.datetime.now().timestamp()
                reponse.reward=0
                db.session.add(reponse)
                db.session.commit()

                rs = reponse.serialize()
                rs["question"] = data["question"]

                if current_user is not None:
                    rs["user"]=current_user.serialize()
                print("send rép",dataId['id'],rs)
                emit("addReponse", rs, broadcast=True, room=liveUser[live.id_owner].roomProf)
                emit('reponseValide',rs,broadcast=True, room=dataId['id'])





@socketio.on('liveQuestion')
def on_liveQuestion(data):
    print('liveQuestion!',data)

    token = data["token"]["token"]
    dataId = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
    current_user = User.query.filter_by(id=dataId['id']).first()
    if current_user.rank == 0:
        live = RessourceLive.query.filter_by(room=data["room"]).first()
        if live is not None:
            detail = RessourceLiveDetail(id_module=data["module"]["id_module"])
            detail.content=data["question"]
            detail.id_live=live.id
            detail.option=data["option"]
            detail.type = data["type"]
            detail.reponseunique = data["reponseunique"]
            detail.public_id = data["randomID"]
            detail.dateO=datetime.datetime.now().timestamp()
            detail.dateF=datetime.datetime.now().timestamp()+data["timer"]
            db.session.add(detail)
            db.session.commit()
            for c in liveUser[current_user.id].listEtu:
                emit("addQuestion",detail.serialize(),broadcast=True,room=c)



@app.route('/login')
def login():
    auth = request.authorization

    if not auth or not auth.username or not auth.password:
        return make_response('Could not verify', 401, {'WWW-Authenticate' : 'Basic realm="Login required!"'})

    user = User.query.filter_by(mail=auth.username).first()

    if not user:
        return make_response('Could not verify', 401, {'WWW-Authenticate' : 'Basic realm="Login required!"'})

    if check_password_hash(user.password, auth.password):
        if user.rank==0:
            elapseTime=3000
        else:
            elapseTime = 250
        token = jwt.encode({'id' : user.id, 'exp' : datetime.datetime.utcnow() + datetime.timedelta(minutes=elapseTime)}, app.config['SECRET_KEY'],algorithm="HS256")

        print("log",token,user.rank)
        try:
            token = token.decode()
        except:
            print("error decode")
        return jsonify({'token' : token, 'rank':user.rank, 'id':user.id})

    return make_response('Could not verify', 401, {'WWW-Authenticate' : 'Basic realm="Login required!"'})

#----------------------------------------- CODE -------------------------
@app.route('/runcode', methods=['POST'])
def run_code():
    reponses = request.json.get("code")
    if reponses=="":
        return jsonify({"reponse":"info", "output": ""})
    print("runcode")
    try:
        _print_ = PrintCollector
        source_code = reponses

        loc = {'_print_': PrintCollector, '_getattr_': getattr,"__builtins__": safe_builtins}
        compiled_code = compile_restricted(source_code, '<string>', 'exec')

        rep = exec(compiled_code, loc)
        try:
            rep,r = loc['_print'](),'info'
        except:
            rep, r = None, 'info'

    except Exception as err:
        rep,r = err.args[0],"error"

    print(rep)
    return jsonify({"reponse":r,"output":rep})
#----------------------------------------- FORMATION -------------------------
@app.route('/formations', methods=['GET'])
def get_all_formation():
    formations = Formation.query.all()
    output = []
    for f in formations:
        output.append(f.serialize())

    return jsonify({'formations' : output})

@app.route('/evaluation/correction', methods=['POST'])
@token_required
def ressource_evaluation_correction(current_user):
    if current_user.rank != 0:
        return make_response('Could not verify', 405, {'WWW-Authenticate': 'Basic realm="Admin required!"'})
    print(current_user, request.json)
    reponses = request.json.get("dataReponse")
    noteVF=0
    if reponses is not None:
        if "reponse" in reponses.keys():
            for r in reponses["reponse"]:
                rep = ReponseEvaluation.query.filter_by(id=r["id"]).first()
                if "note" in r.keys():
                    if r["note"] is not None:
                        rep.note = r["note"]
                        noteVF+=float(r["note"])
                        db.session.commit()
        eval = Evaluation.query.filter_by(id=reponses["id"]).first()
        if eval is not None:
            if eval.barem_total is not None:
                eval.note = min(noteVF,eval.barem_total)
            else:
                eval.note = noteVF
            db.session.commit()

    return jsonify({})


@app.route('/evaluation/participation', methods=['POST'])
@token_required
def ressource_evaluation_participation(current_user):
    print(current_user,request.json)

    eval = Evaluation(id_ressourceqestions=request.json.get("ressource")["id"])
    eval.id_user=current_user.id
    eval.id_module=request.json.get("ressource")["id_module"]
    eval.date_eval= datetime.datetime.now().timestamp()
    db.session.add(eval)
    db.session.commit()

    for q in request.json.get("questionList"):
        rep = ReponseEvaluation(id_eval=eval.id)
        rep.id_user = current_user.id
        rep.id_question=q["id"]
        rep.type=q["type"]
        if q["type"]==0 or q["type"]==1:
            rep.reponse = q["reponseuser"]
        if q["type"]==2:
            rep.reponse = 'ยง'.join(["1" if i else "0" for i in q["tabRep"]])
        if q["type"]==3 :
            rep.reponse = 'ยง'.join([str(i) for i in q["tabRep"]])
        if q["type"]==4 and "media" in q.keys():
            rep.reponse = q["media"]
        db.session.add(rep)
        db.session.commit()



    return jsonify({"message":"ok"})





@app.route('/openlive', methods=['POST'])
@token_required
def openLive(current_user):
    print("openlive",request.json)
    if current_user.rank != 0:
        return make_response('Could not verify', 405, {'WWW-Authenticate': 'Basic realm="Admin required!"'})


    live = RessourceLive.query.filter_by(room=request.json.get("live")).first()
    print(live)
    if live is not None:
        if bool(request.json.get("open")):
            live.public_key=request.json.get("publickey")
        else:
            live.public_key = ""
        db.session.commit()
        return jsonify(live.serialize())
    return jsonify({})


@app.route('/liveresponse/<int:iduser>/<int:idLive>/<int:idQ>', methods=['GET'])
def live_rep(iduser,idLive,idQ):

    live = RessourceLive.query.filter_by(id=idLive).first()
    data = []
    if live is not None:
        rep = RessourceLiveParticipation.query.filter_by(id_user=iduser,id_RessourceLiveDetail=idQ).all()
        for r in rep:
            data.append(r.serialize())


    return jsonify(data)
@app.route('/live/close/<id>', methods=['GET'])
@token_required
def close_live(current_user,id):
    if current_user.rank != 0:
        return make_response('Could not verify', 405, {'WWW-Authenticate': 'Basic realm="Admin required!"'})

    live = RessourceLive.query.filter_by(room=id).all()
    for l in live:
        l.dateF=datetime.datetime.now().timestamp()
        db.session.commit()


    return jsonify({})

@app.route('/live/<int:id>', methods=['GET'])
@token_required
def get_live(current_user,id):
    lives = RessourceLive.query.filter_by(id_module=id).all()
    data=[]
    for l in lives:
        if l.dateF is None:
            affectation = Affectation.query.filter_by(id_module=id).all()
            for a in affectation:
                if str(a.id_groupe) in current_user.groupe.split(";"):
                    ls = l.serialize()
                    ls["module"]=Module.query.filter_by(id=l.id_module).first().serialize()
                    data.append(ls)

    return jsonify(data)

@app.route('/ressource/evaluation/<int:id>', methods=['GET'])
@token_required
def get_ressource_evaluation(current_user,id):
    print(current_user)
    if current_user.rank != 0:
        return make_response('Could not verify', 405, {'WWW-Authenticate': 'Basic realm="Admin required!"'})
    eval = Evaluation.query.filter_by(id_module=id).all()
    data={}
    for e in eval:
        es = e.serialize()

        user = User.query.filter_by(id=e.id_user).first()
        es["user"]=user.serialize()
        reponses = ReponseEvaluation.query.filter_by(id_user=user.id,id_eval=e.id).all()
        repData=[]
        for r in reponses:
            repData.append(r.serialize())
        es["reponse"]=repData
        if e.id_ressourceqestions in data.keys():
            data[e.id_ressourceqestions]["data"].append(es)
        else:
            ressource = RessourceQestions.query.filter_by(id=e.id_ressourceqestions).first()
            rs = ressource.serialize()
            questions = Question.query.filter_by(id_ressourceqestions=e.id_ressourceqestions).all()
            questData=[]
            for q in questions:
                questData.append(q.serialize())
            rs["questions"]=questData
            data[e.id_ressourceqestions]={"ressource":rs,"data":[es]}
    print("data",data)

    return jsonify(data)


@app.route('/ressource/evaluation/registration', methods=['POST'])
@token_required
def ressource_evaluation_registration(current_user):
    if current_user.rank != 0:
        return make_response('Could not verify', 405, {'WWW-Authenticate': 'Basic realm="Admin required!"'})
    print(request.json)
    id_owner = current_user.id
    id_module = request.json.get('module')["id"]
    groupes = str(request.json.get('data')['groupes'])
    titre = request.json.get('data')['titre']["value"]
    type = int(request.json.get('type'))
    maxTry = int(request.json.get('maxTry'))
    dateO = request.json.get('data')["dateO"]
    dateF = request.json.get('data')["dateF"]

    if id_module is None or titre is None :
        return make_response('Could not verify', 200, {'Error': 'parameters missing'})
    if type > 3:
        ressource = RessourceQestions(id_owner=id_owner)
        ressource.id_module = id_module
        ressource.groupes = groupes
        ressource.type = type
        ressource.titre = titre
        ressource.maxTry=maxTry
        ressource.dateO = dateO
        ressource.dateF = dateF
        ressource.questionAleatoire = 0
        if bool(request.json.get('questionAleatoire')):
            ressource.questionAleatoire = 1
        ressource.nbQuestion = request.json.get('nbQuestion')
        ressource.timer=0

        db.session.add(ressource)
        db.session.commit()
        keysList = request.json.keys()
        print(keysList)
        if "questionList" in keysList:
            qList = request.json.get('questionList')
            for q in  qList:
                keysListquestion = q.keys()
                question = Question(id_ressourceqestions=ressource.id)
                question.question = q["question"]
                question.type=q["type"]
                question.order = q["id"]
                question.reponse = q["reponse"]
                question.indice = q["indice"]
                question.barem = q["barem"]
                question.rating = q["rating"]
                question.requis = 0
                if q["Requis"]:
                    question.requis = 1
                if "formats" in keysListquestion:
                    question.formats = q["formats"]
                if "size" in keysListquestion:
                    question.size = q["size"]
                if "choix" in keysListquestion:
                    question.choix = q["choix"]
                db.session.add(question)
                db.session.commit()
    return jsonify(ressource.serialize())



@app.route('/ressources/notes/<int:id>', methods=['GET'])
@token_required
def get_ressource_notes(current_user,id):
    eval = Evaluation.query.order_by(Evaluation.date_eval.asc()).filter_by(id_user=current_user.id,id_module=id).all()
    data=[]
    for e in eval:
        data.append(e.serialize())

    return jsonify(data)


@app.route('/ressources/stat/<int:id>/<int:limit>', methods=['GET'])
@token_required
def get_ressource_stats(current_user,id,limit):
    stats = RessourceStat.query.filter_by(id_user=current_user.id,id_module=id).all()
    data=[]
    eval=[]
    for s in stats[:min(limit,len(stats))]:
        ss = s.serialize()

        if s.type_ressource <= 3:
            ressource = RessourceText.query.filter_by(id=s.id_ressource).first()
        else:
            ressource = RessourceQestions.query.filter_by(id=s.id_ressource).first()
            eval = Evaluation.query.filter(Evaluation.date_eval>=s.dateO,Evaluation.date_eval<=s.dateF, Evaluation.id_ressourceqestions==ressource.id,Evaluation.id_user==current_user.id).first()
            if eval is not None:
                if eval.note is not None:
                    ss["eval"]=eval.serialize()
        ss["titre"] = ressource.titre
        data.append(ss)

    data.sort(key=lambda x: x["dateO"], reverse=True)

    return jsonify(data)

@app.route('/ressources/stat', methods=['POST'])
@token_required
def recode_stat(current_user):
    print(request.json)
    r = RessourceStat(id_ressource=request.json.get("data")["id"])
    r.id_user=current_user.id
    r.dateO=request.json.get("startTime")
    r.dateF = request.json.get("endTime")
    r.type_ressource=request.json.get("data")["type"]
    r.id_module=request.json.get("data")["id_module"]
    db.session.add(r)
    db.session.commit()
    return jsonify({})

@app.route('/ressources/groupe/<int:id>', methods=['GET'])
@token_required
def get_ressource_groupe(current_user,id):
    data = []
    ressources = RessourceText.query.filter_by(id_owner=current_user.id).all()
    for r in ressources:
        rs = r.serialize()
        rs["module"] = "undefined"
        m = Module.query.filter_by(id=r.id_module).first()
        if m is not None:
            rs["module"] = m.name

        groupes=json.loads(r.groupes)
        add=False
        for g in groupes:
            if g["id"]==current_user.groupe:
                add=True

        if add:
            data.append(rs)

    ressources = RessourceQestions.query.filter_by(id_owner=current_user.id).all()
    for r in ressources:
        rs = r.serialize()
        rs["module"] = "undefined"
        m = Module.query.filter_by(id=r.id_module).first()
        questions = Question.query.filter_by(id_ressourceqestions=r.id).all()
        content = []
        for q in questions:
            content.append(q.serialize())
        rs["content"] = content
        if m is not None:
            rs["module"] = m.name

        groupes = json.loads(r.groupes)
        add = False
        for g in groupes:
            if g["id"] == current_user.groupe:
                add = True

        if add:
            data.append(rs)
    print(data)
    return jsonify(data)

@app.route('/mesressources', methods=['GET'])
@token_required
def get_ressource(current_user):
    if current_user.rank != 0:
        return make_response('Could not verify', 405, {'WWW-Authenticate': 'Basic realm="Admin required!"'})
    data=[]
    ressources = RessourceText.query.filter_by(id_owner=current_user.id).all()
    for r in ressources:
        rs = r.serialize()
        rs["module"] = "undefined"
        m = Module.query.filter_by(id=r.id_module).first()
        if m is not None:
            rs["module"] = m.name
        rs["setting"]={}

        groupes = json.loads(rs["groupes"].replace("\'", "\""))
        for g in groupes:
            print("g",g)
            rs["setting"][g["id"]]={'id_ressource': r.id,
                            'id_type_ressource': r.type,
                            "dateO": 0,
                            'dateF': 0,
                            'id_groupe': int(g["id"])}
            settings = RessourceSetting.query.filter_by(id_groupe=int(g["id"]),id_ressource=r.id,id_type_ressource=r.type).first()
            if settings is not None:
                rs["setting"][g["id"]]=settings.serialize()

        data.append(rs)

    ressources = RessourceQestions.query.filter_by(id_owner=current_user.id).all()
    for r in ressources:
        rs = r.serialize()
        rs["module"] ="undefined"
        m=Module.query.filter_by(id=r.id_module).first()
        questions=Question.query.filter_by(id_ressourceqestions=r.id).all()
        content=[]
        for q in questions:
            content.append(q.serialize())
        rs["content"]=content
        if m is not None:
            rs["module"]=m.name
        rs["setting"] = {}

        groupes = json.loads(rs["groupes"].replace("\'", "\""))
        print(groupes)
        for g in groupes:
            print("g", g)
            rs["setting"][g["id"]] = {'id_ressource': r.id,
                                      'id_type_ressource': r.type,
                                      "dateO": 0,
                                      'dateF': 0,
                                      'id_groupe': int(g["id"])}
            settings = RessourceSetting.query.filter_by(id_groupe=int(g["id"]), id_ressource=r.id,
                                                        id_type_ressource=r.type).first()
            if settings is not None:
                rs["setting"][g["id"]] = settings.serialize()

        data.append(rs)
    print(data)
    return jsonify(data)


@app.route('/ressourceshare', methods=['GET'])
@token_required
def get_ressource_share(current_user):
    if current_user.rank != 0:
        return make_response('Could not verify', 405, {'WWW-Authenticate': 'Basic realm="Admin required!"'})
    data=[]

    modulesShare=Module.query.filter(Module.id_owner!=current_user.id).all()
    for m in modulesShare:
        if str(current_user.id) in m.share_with.spl(';'):
            ressourceTxt = RessourceText.query.filter_by(id_module = m.id).all()
            for r in ressourceTxt:
                rs = r.serialize()
                rs["module"] =  m.name
                m = Module.query.filter_by(id=r.id_module).first()
                data.append(rs)

            ressources = RessourceQestions.query.filter_by(id_module=m.id).all()
            for r in ressources:
                rs = r.serialize()
                rs["module"] =  m.name

                questions = Question.query.filter_by(id_ressourceqestions=r.id).all()
                content = []
                for q in questions:
                    content.append(q.serialize())
                rs["content"] = content

                data.append(rs)


    return jsonify(data)



@app.route('/ressource/updatesetting', methods=['POST'])
@token_required
def update_ressource_setting(current_user):
    if current_user.rank != 0:
        return make_response('Could not verify', 405, {'WWW-Authenticate': 'Basic realm="Admin required!"'})

    ressourcePOST = request.json.get('ressource')
    print(request.json)
    setting = RessourceSetting.query.filter_by(id_groupe=request.json.get('groupe')["groupe"]["id"],id_ressource=request.json.get('ressource')["idRessource"],id_type_ressource=request.json.get('ressource')["code"]).first()
    if setting is not None:
        if hasattr(setting, request.json.get("type") ):
            setattr(setting, request.json.get("type"), request.json.get("value"))
            db.session.commit()
    else:
        setting= RessourceSetting(id_groupe=request.json.get('groupe')["groupe"]["id"],id_ressource=request.json.get('ressource')["idRessource"],id_type_ressource=request.json.get('ressource')["code"])
        print(type(setting),request.json.get("type"))
        if hasattr(setting, request.json.get("type")):
            setattr(setting, request.json.get("type"),request.json.get("value"))
            db.session.add(setting)
            db.session.commit()

    return  jsonify(setting.serialize())



@app.route('/ressource/update', methods=['POST'])
@token_required
def update_ressource(current_user):
    if current_user.rank != 0:
        return make_response('Could not verify', 405, {'WWW-Authenticate': 'Basic realm="Admin required!"'})

    ressourcePOST = request.json.get('ressource')
    print(request.json)
    if ressourcePOST.code <= 3:
        ressource = RessourceText.query.filter_by(id=s.id_ressource).first()
    else:
        ressource = RessourceQestions.query.filter_by(id=s.id_ressource).first()

    if ressource is not None:
        if hasattr(ressource, request.json.get("type") ):
            setattr(ressource, request.json.get("type"), request.json.get("value"))
            db.session.commit()
    else:
        return jsonify({})

    return  jsonify(ressource.serialize())

@app.route('/ressources/<int:id>', methods=['GET'])
@token_required
def get_ressource_module(current_user,id):

    data=[]
    ressources = RessourceText.query.filter_by(id_module=id).all()
    for r in ressources:
        nbTry = RessourceStat.query.filter_by(id_user=current_user.id,id_ressource=r.id,type_ressource=r.type).all()

        rs = r.serialize()
        rs["setting"] = {}
        rs["try"]=len(nbTry)
        rs["module"] = "undefined"
        m = Module.query.filter_by(id=r.id_module).first()
        if m is not None:
            rs["module"] = m.name
        res = json.loads(rs["groupes"].replace("\'", "\""))
        for g in res:
            print("g",g)
            if current_user.id==rs["id_owner"] or str(g["id"]) in current_user.groupe.split(";") :
                rs["setting"][g["id"]]={'id_ressource': r.id,
                                'id_type_ressource': r.type,
                                "dateO": 0,
                                'dateF': 0,
                                'id_groupe': int(g["id"])}
                settings = RessourceSetting.query.filter_by(id_groupe=int(g["id"]),id_ressource=r.id,id_type_ressource=r.type).first()
                if settings is not None:
                    rs["setting"][g["id"]]=settings.serialize()

        find = False
        for g in res:
            if current_user.rank == 0 or g["id"] in current_user.groupe.split(";") :
                for d in data:
                    if d["id"] == rs["id"]:
                        find = True

        if not find:
            print("groupe add")
            data.append(rs)

    ressources = RessourceQestions.query.filter_by(id_module=id).all()
    for r in ressources:
        nbTry = RessourceStat.query.filter_by(id_user=current_user.id, id_ressource=r.id, type_ressource=r.type).all()
        rs = r.serialize()
        rs["setting"] = {}
        rs["try"] = len(nbTry)
        rs["module"] ="undefined"
        m=Module.query.filter_by(id=r.id_module).first()
        questions=Question.query.order_by(Question.order.asc()).filter_by(id_ressourceqestions=r.id).all()
        content=[]
        for q in questions:
            content.append(q.serialize())
        rs["content"]=content
        if m is not None:
            rs["module"]=m.name

        res = json.loads(rs["groupes"].replace("\'", "\""))
        for g in res:
            print("g",g)
            if current_user.id==rs["id_owner"] or str(g["id"]) in current_user.groupe.split(";") :
                rs["setting"][g["id"]]={'id_ressource': r.id,
                                'id_type_ressource': r.type,
                                "dateO": 0,
                                'dateF': 0,
                                'id_groupe': int(g["id"])}
                settings = RessourceSetting.query.filter_by(id_groupe=int(g["id"]),id_ressource=r.id,id_type_ressource=r.type).first()
                if settings is not None:
                    rs["setting"][g["id"]]=settings.serialize()

        for g in res:
            if current_user.rank==0 or g["id"] in current_user.groupe.split(";") :
                find=False
                for d in data:
                    if d["id"]==rs["id"]:
                        find=True

        if not find:
            print("groupe add")
            data.append(rs)

    print("data",data)
    return jsonify(data)



@app.route('/ressource/del/<int:code>/<int:id>', methods=['DELETE'])
@token_required
def del_ressource(current_user,code,id):
    if current_user.rank != 0:
        return make_response('Could not verify', 405, {'WWW-Authenticate': 'Basic realm="Admin required!"'})

    if code<=3:
        ressource=RessourceText.query.filter_by(id=id,id_owner=current_user.id).delete()
    else:
        ressource=RessourceQestions.query.filter_by(id=id,id_owner=current_user.id).delete()

    print(ressource)
    db.session.commit()

    return jsonify({"id":id})


@app.route('/ressource/registration', methods=['POST'])
@token_required
def ressource_registration(current_user):
    if current_user.rank != 0:
        return make_response('Could not verify', 405, {'WWW-Authenticate': 'Basic realm="Admin required!"'})

    print(request.json)
    id_owner = current_user.id
    id_module = request.json.get('module')["id"]
    groupes = str(request.json.get('data')['groupes'])
    titre = request.json.get('data')['titre']["value"]
    type = int(request.json.get('type'))
    content = request.json.get('text')
    dateO = request.json.get('data')["dateO"]
    dateF = request.json.get('data')["dateF"]

    if id_module is None or titre is None or content is None:
        return make_response('Could not verify', 200, {'Error': 'parameters missing'})
    if type <= 3:
        ressource = RessourceText(id_owner=id_owner)
        ressource.id_module=id_module
        ressource.groupes=groupes
        ressource.type=str(type)
        ressource.titre=titre
        ressource.content = content
        ressource.dateO=dateO
        ressource.dateF=dateF
        db.session.add(ressource)
        db.session.commit()

        print(ressource.serialize())

        return jsonify(ressource.serialize())

    return jsonify({})



@app.route('/ressource/evaluation/edit', methods=['POST'])
@token_required
def ressource_edit_eval(current_user):
    if current_user.rank != 0:
        return make_response('Could not verify', 405, {'WWW-Authenticate': 'Basic realm="Admin required!"'})

    print(request.json)
    id_ressourceQ = request.json.get('ressourceIdEdition')["idRessource"]
    ressource = RessourceQestions.query.filter_by(id_owner=current_user.id,id=id_ressourceQ).first()
    if ressource is not None:
        ressource.groupes = str(request.json.get('data')['groupes'])
        ressource.type = int(request.json.get('type'))
        ressource.maxTry = int(request.json.get('maxTry'))
        ressource.titre = request.json.get('data')['titre']["value"]
        ressource.dateO = request.json.get('data')["dateO"]
        ressource.dateF = request.json.get('data')["dateF"]
        ressource.questionAleatoire = bool(request.json.get('questionAleatoire'))
        ressource.nbQuestion = request.json.get('nbQuestion')
        db.session.commit()
        keysList = request.json.keys()
        print(keysList)
        questionList=Question.query.filter_by(id_ressourceqestions=ressource.id).all()






    return jsonify({})


@app.route('/ressource/edit', methods=['POST'])
@token_required
def ressource_edit(current_user):
    if current_user.rank != 0:
        return make_response('Could not verify', 405, {'WWW-Authenticate': 'Basic realm="Admin required!"'})

    print(request.json)
    id_ressourcetxt = request.json.get('ressourceIdEdition')["idRessource"]
    print(id_ressourcetxt)
    ressources = RessourceText.query.filter_by(id_owner=current_user.id,id=id_ressourcetxt).first()

    if ressources is not None:
        ressources.titre=request.json.get('data')['titre']["value"]
        ressources.groupes=str(request.json.get('data')['groupes'])
        ressources.type = int(request.json.get('type'))
        ressources.content = request.json.get('text')
        ressources.dateO = request.json.get('data')["dateO"]
        ressources.dateF = request.json.get('data')["dateF"]
        db.session.commit()
        return jsonify(ressources.serialize())

    return jsonify({})


@app.route('/formation/registration', methods=['POST'])
@token_required
def formation_registration(current_user):
    if current_user.rank!=0:
        return make_response('Could not verify', 405, {'WWW-Authenticate': 'Basic realm="Admin required!"'})
    else :
        name = request.json.get('name')
        formations = Formation.query.filter_by(name=name).first()
        if formations is None:
            f = Formation(name=name)
            db.session.add(f)
            db.session.commit()
        else:
            f=formations.serialize()
        return jsonify(f.serialize())



#----------------------------------------- FORMATION -------------------------


@app.route('/groupesbymodule/<int:id>', methods=['GET'])
@token_required
def get_groupes_by_module(current_user,id):
    if current_user.rank != 0:
        return make_response('Could not verify', 405, {'WWW-Authenticate': 'Basic realm="Admin required!"'})

    affectation = Affectation.query.filter_by(id_module=id).all()
    output = []
    for a in affectation:
        item={}
        groupe = Groupe.query.filter_by(id=a.id_groupe).first()

        item["formation"]=Formation.query.filter_by(id=a.id_formation).first().serialize()
        item["groupe"]=groupe.serialize()
        item["affectation"]=a.serialize()
        output.append(item)

    return jsonify(output)



@app.route('/groupes/module/<int:id>', methods=['GET'])
@token_required
def get_all_groupes_module(current_user,id):
    if current_user.rank != 0:
        return make_response('Could not verify', 405, {'WWW-Authenticate': 'Basic realm="Admin required!"'})

    affectation = Affectation.query.filter_by(id_module=id).all()
    output = []
    for a in affectation:
        item={}
        groupe = Groupe.query.filter_by(id=a.id_groupe).first()
        users = User.query.all()
        userData=[]
        for u in users:
            if u.groupe is not None:
                print(" groupe ",a.id_groupe,u.groupe.split(";"),str(a.id_groupe) in u.groupe.split(";"))
                if str(a.id_groupe) in u.groupe.split(";"):
                    userData.append(u.serialize())
        item["users"]=userData
        item["formation"]=Formation.query.filter_by(id=a.id_formation).first().serialize()
        item["groupe"]=groupe.serialize()
        item["affectation"]=a.serialize()
        output.append(item)

    return jsonify(output)


@app.route('/groupe/del', methods=['POST'])
@token_required
def del_group_user(current_user):
    print("trash")
    print("trash groupe",request.json.get('groupe'), current_user.groupe)
    if request.json.get('groupe') is not None:
        print("split")
        groupesId = [int(i) for i in current_user.groupe.split(';') if len(i)>0]

        print("groupesId ", groupesId)
        if int(request.json.get('groupe')["id"]) in groupesId:
            print('->',groupesId)
            groupesId.remove(int(request.json.get('groupe')["id"]))
            groupesStr = ';'.join(groupesId)
            print('-->',groupesStr)
            current_user.groupe = groupesStr
            db.session.commit()
    return jsonify({})



@app.route('/groupe/affectation', methods=['POST'])
@token_required
def groupe_affectation_user(current_user):
    print("groupe_affectation_user")
    print("r",request.json)
    if request.json.get('code') is not None:
        ref = request.json.get('code').split("-")
        if len(ref) == 2 :
            id = ref[0]
            code = ref[1]
            group = Groupe.query.filter_by(id=id,code=code).first()
            if group is not None:
                if current_user.groupe is None:
                    current_user.groupe = str(id) + ";"
                    db.session.commit()
                else :
                    if id not in current_user.groupe.split(";"):
                        current_user.groupe=current_user.groupe+id+";"
                        db.session.commit()




    return jsonify()

@app.route('/groupe/code/<int:id>', methods=['GET'])
@token_required
def groupe_registration_code(current_user,id):
    if current_user.rank!=0:
        return make_response('Could not verify', 405, {'WWW-Authenticate': 'Basic realm="Admin required!"'})
    letters = string.ascii_uppercase
    result_str = ''.join(random.choice(letters) for i in range(6))

    groupe = Groupe.query.filter_by(id=id).first()
    groupe.code=result_str
    db.session.commit()

    return jsonify(str(groupe.id)+"-"+result_str)

@app.route('/groupe/code/<int:id>', methods=['DELETE'])
@token_required
def groupe_delete_code(current_user,id):
    if current_user.rank!=0:
        return make_response('Could not verify', 405, {'WWW-Authenticate': 'Basic realm="Admin required!"'})

    groupe = Groupe.query.filter_by(id=id).first()
    groupe.code=""
    db.session.commit()

    return jsonify({})


@app.route('/groupes', methods=['GET'])
def get_all_groupes():
    groupes = Groupe.query.all()
    output = []
    for g in groupes:
        gs = g.serialize()
        gs['formation'] = Formation.query.filter_by(id=g.id_formation).first().serialize()
        output.append(gs)

    return jsonify({'groupes' : output})

@app.route('/groupe/registration', methods=['POST'])
@token_required
def groupe_registration(current_user):
    if current_user.rank!=0:
        return make_response('Could not verify', 405, {'WWW-Authenticate': 'Basic realm="Admin required!"'})
    else :
        name = request.json.get('name')
        id_formation = request.json.get('id_formation')
        groupe = Groupe.query.filter_by(name=name,id_formation=id_formation).first()
        if groupe is None:
            g = Groupe(name=name)
            g.id_formation=id_formation
            db.session.add(g)
            db.session.commit()
        else:
            g=groupe
        return jsonify(g.serialize())

#----------------------------------------- MODULES -------------------------
@app.route('/modules/<int:id>', methods=['GET'])
@token_required
def get_all_modules(current_user,id):
    print(id)
    modules = Module.query.filter_by(id_formation=id).all()
    output = []
    for m in modules:
        output.append(m.serialize())

    return jsonify({'modules' : output})

@app.route('/share',  methods=['GET'])
@token_required
def get_share(current_user):
    if current_user.rank != 0:
        return make_response('Could not verify', 405, {'WWW-Authenticate': 'Basic realm="Admin required!"'})

    modules = Module.query.filter_by(id_owner=current_user.id).all()
    data=[]
    for m in modules:
        if m.share_with is not None:
            for s in m.share_with.split(";"):
                if s != '':
                    user = User.query.filter_by(id=s).first().serialize()
                    data.append({"module":m.serialize(),"user":user})

    return jsonify(data)



@app.route('/stopshare/<int:module>/<int:id>', methods=['GET'])
@token_required
def stop_share_module(current_user,module,id):
    if current_user.rank != 0:
        return make_response('Could not verify', 405, {'WWW-Authenticate': 'Basic realm="Admin required!"'})

    modules = Module.query.filter_by(id_formation=module,id_owner=current_user.id).first()

    if modules is not None:
        if modules.share_with is not None:
            modules.share_with=modules.share_with.replace(str(id)+";","")
            print("modules.share_with",modules.share_with)

        db.session.commit()

    return jsonify({'module' : modules.serialize()})




@app.route('/share/<int:module>/<int:id_admin>', methods=['GET'])
@token_required
def share_module(current_user,module,id_admin):
    if current_user.rank != 0:
        return make_response('Could not verify', 405, {'WWW-Authenticate': 'Basic realm="Admin required!"'})

    modules = Module.query.filter_by(id=module,id_owner=current_user.id).first()
    output = []
    if modules is not None:
        print(modules.share_with)
        share=modules.share_with
        if modules.share_with is not None:
            if str(id_admin) not in modules.share_with.split(";") and id_admin != current_user.id:
                share = modules.share_with + str(id_admin)+";"
        else:
            share = str(id_admin)+";"
        modules.share_with = share
        db.session.commit()

    return jsonify({'module' : modules.serialize()})



@app.route('/mesexams', methods=['GET'])
@token_required
def get_my_exam(current_user):
    data = {}
    if current_user.groupe is not None:
        groupesId = [int(i) for i in current_user.groupe.split(';') if len(i)>0]

        for g in groupesId:
            affectations = Affectation.query.filter_by(id_groupe=g).all()
            for a in affectations:
                item = []
                ressurces = RessourceQestions.query.order_by(RessourceQestions.dateO.desc()).filter_by(id_module=a.id_module,type="4").all()
                for r in ressurces:
                    d = {}
                    rs = r.serialize()

                    questions = Question.query.order_by(Question.order.asc()).filter_by(id_ressourceqestions=r.id).all()
                    content = []
                    for q in questions:
                        content.append(q.serialize())
                    rs["content"] = content

                    d["ressource"] = rs

                    evaluation = Evaluation.query.filter_by(id_user=current_user.id,id_ressourceqestions=r.id).first()
                    if evaluation is not None:
                        d["evaluation"] = evaluation.serialize()

                    item.append(d)
                data[a.id_module]=item

    return jsonify(data)


@app.route('/mesdevoirs', methods=['GET'])
@token_required
def get_my_homeworks(current_user):
    data = {}
    if current_user.groupe is not None:
        groupesId = [int(i) for i in current_user.groupe.split(';') if len(i)>0]

        for g in groupesId:
            affectations = Affectation.query.filter_by(id_groupe=g).all()
            for a in affectations:
                item = []
                ressurces = RessourceText.query.order_by(RessourceText.dateF.desc()).filter_by(id_module=a.id_module,type="3").all()
                for r in ressurces:

                    if r.dateF+(3600*24) >= datetime.datetime.now().timestamp():
                        item.append(r.serialize())
                data[a.id_module]=item

    return jsonify(data)

@app.route('/mesmodules', methods=['GET'])
@token_required
def get_my_modules(current_user):
    data = []
    if current_user.groupe is not None:
        groupesId = [int(i) for i in current_user.groupe.split(';') if len(i)>0]

        for g in groupesId:
            affectation = Affectation.query.filter_by(id_groupe=g).all()

            for a in affectation:
                modules = Module.query.filter_by(id=a.id_module).all()
                for m in modules:
                    data.append(m.serialize())

    modules = Module.query.filter_by(id_owner=current_user.id).all()
    for m in modules:
        data.append(m.serialize())



    return jsonify({'modules' : data})

@app.route('/sharewithme', methods=['GET'])
@token_required
def get_share_modules(current_user):
    data = []


    modules = Module.query.all()
    for m in modules:
        if m.share_with is not None:
            if str(current_user.id) in m.share_with.split(";"):
                data.append(m.serialize())

    return jsonify({'modules' : data})


@app.route('/mesmodules/<int:id>', methods=['GET'])
@token_required
def get_my_modules_id(current_user,id):
    data = []
    if current_user.groupe is not None:
        groupesId = [int(i) for i in current_user.groupe.split(';') if len(i)>0]

        for g in groupesId:
            affectation = Affectation.query.filter_by(id_groupe=g).all()

            for a in affectation:
                modules = Module.query.filter_by(id=a.id_module).all()
                for m in modules:
                    if m.id==id:
                        data.append(m.serialize())

    return jsonify({'modules' : data})


@app.route('/module/registration', methods=['POST'])
@token_required
def modules_registration(current_user):
    if current_user.rank != 0:
        return make_response('Could not verify', 405, {'WWW-Authenticate': 'Basic realm="Admin required!"'})
    else:
        print("r",request.json)
        name = request.json.get('name')
        id_formation = request.json.get('id_formation')
        resume=request.json.get('moduleResume')
        module = Module.query.filter_by(name=name, id_formation=id_formation,id_owner=current_user.id).first()
        if module is None:
            m = Module(name=name)
            m.id_owner = current_user.id
            m.id_formation = id_formation
            m.intro = resume
            db.session.add(m)
            db.session.commit()
        else:
            m = module

        print("m",m.serialize())
        return jsonify(m.serialize())

@app.route('/module/update', methods=['POST'])
@token_required
def modules_update(current_user):
    if current_user.rank != 0:
        return make_response('Could not verify', 405, {'WWW-Authenticate': 'Basic realm="Admin required!"'})
    else:
        print("Update",request.json)
        name = request.json.get('name')
        id_module = request.json.get('id_module')
        module = Module.query.filter_by(id=id_module,id_owner=current_user.id).first()
        if module is not None:
            module.name=name
            db.session.commit()
            return jsonify(module.serialize())
        return jsonify({})




@app.route('/rank/<int:id>', methods=['GET'])
@token_required
def get_Rank(current_user,id):
    print("rank")
    if id is not None:
        dataEval={}
        dataAutoEval={}
        user=[]
        data=[]
        evals = db.session.query(Evaluation.id_user, Evaluation.id_ressourceqestions, Evaluation.id_module, func.sum(Evaluation.note)).filter_by(id_module=id).group_by(Evaluation.id_user,Evaluation.id_ressourceqestions, Evaluation.id_module).all()
        for e in evals:
            ressource = RessourceQestions.query.filter_by(id=e.id_ressourceqestions).first()
            print("ressource",ressource)
            if ressource is not None:
                user.append(e[0])
                if ressource.type=="4":
                    dataEval[e.id_user]=e[3]
                else:
                    dataAutoEval[e.id_user]=e[3]

        print(dataEval,dataAutoEval)
        user = list(dict.fromkeys(user))
        for u in user:
            r=[0,0]
            if u in dataEval.keys():
                if dataEval[u] is None:
                    r[0]=0
                else :
                    r[0]=dataEval[u]
            if u in dataAutoEval.keys():
                if dataAutoEval[u] is None:
                    r[1]=0
                else:
                    r[1]=dataAutoEval[u]
            print(r)
            item={"rank":sum(r),"auto-eval":r[1],'eval':r[0],"user":User.query.filter_by(id=u).first().serialize()}
            data.append(item)

        print(data)
        data.sort(key=lambda x: x["rank"], reverse=True)
        for index, item in enumerate(data):
            if item["user"]["id"] == current_user.id:
                break
        else:
            index = -1
        print(data)

    return jsonify({"data":data,"index":index})

@app.route('/affectation/del/<int:id>', methods=['DELETE'])
@token_required
def del_affectation(current_user,id):
    if current_user.rank != 0:
        return make_response('Could not verify', 405, {'WWW-Authenticate': 'Basic realm="Admin required!"'})


    ressource=Affectation.query.filter_by(id=id).delete()

    print(ressource)
    db.session.commit()

    return jsonify({"id":id})


@app.route('/module/affectation', methods=['GET'])
@token_required
def get_affectation(current_user):
    affectations = Affectation.query.all()

    data=[]
    for a in affectations:
        groupe = Groupe.query.filter_by(id=a.id_groupe).first()
        formation = Formation.query.filter_by(id=a.id_formation).first()
        module= Module.query.filter_by(id=a.id_module).first()
        af =a.serialize()
        af["groupe"]=groupe.serialize()
        af["formation"] = formation.serialize()
        af["module"] = module.serialize()

        data.append(af)

    return jsonify(data)


@app.route('/module/affectation', methods=['POST'])
@token_required
def modules_affectation(current_user):
    if current_user.rank != 0:
        return make_response('Could not verify', 405, {'WWW-Authenticate': 'Basic realm="Admin required!"'})
    else:
        print("r",request.json)
        id_module = request.json.get('id_module')
        id_groupe = request.json.get('id_groupe')
        groupe = Groupe.query.filter_by(id=id_groupe).first()
        id_formation=groupe.id_formation

        todays_date = datetime.date.today()
        year = todays_date.year
        affectation = Affectation.query.filter_by(id_module=id_module, id_groupe=id_groupe, annee=year).first()
        if affectation is None:
            a = Affectation(id_module=id_module)
            a.id_groupe = id_groupe
            a.id_formation=id_formation
            a.annee=year
            db.session.add(a)
            db.session.commit()
        else:
            a = affectation

        print("m",a.serialize())
        return jsonify(a.serialize())

#----------------------------------------- USER ------------------------------



@app.route('/updaterank/<int:id>', methods=['GET'])
@token_required
def update_rank(current_user,id):
    if current_user.rank!=0:
        return jsonify({'erreur' : 'Cannot perform that function!'})
    if id == current_user.id:
        return jsonify({'erreur' : 'Cannot perform that function!'})
    user = User.query.filter_by(id=id).first()
    if user is not None:
        user.rank = 0 if user.rank==1 else 1
        db.session.commit()
    return jsonify(user.serialize())

@app.route('/user/trash/<int:id>', methods=['GET'])
@token_required
def trash_user(current_user,id):
    if current_user.rank!=0:
        return jsonify({'erreur' : 'Cannot perform that function!'})
    if id == current_user.id:
        return jsonify({'erreur' : 'Cannot perform that function!'})
    User.query.filter_by(id=id).delete()
    db.session.commit()
    return jsonify({})

@app.route('/user', methods=['GET'])
@token_required
def get_user(current_user):
    user = current_user.serialize()
    groupes=[]
    if current_user.groupe is not None:
        for g in current_user.groupe.split(';'):
            print("groupe ",g,current_user.groupe.split(';'))
            if len(g)>0:
                groupe = Groupe.query.filter_by(id=int(g)).first()
                groupes.append(groupe.serialize())
    user["groupes"]=groupes
    return jsonify(user)


@app.route('/user/registration', methods=['POST'])
def user_registration():
    print(request.json)
    firstname = request.json.get('firstname')
    lastname = request.json.get('lastname')
    mail = request.json.get('email')
    formation = request.json.get('formation')
    groupe = request.json.get('groupe')
    password = generate_password_hash(request.json.get('password'))
    rank = 1

    if  lastname is None or firstname is None or password is None or mail is None:
        return make_response(jsonify(errors='missing parameters'), 400)

    if User.query.filter_by(mail=mail).first() is not None:
        print("existing")
        return make_response(jsonify(errors='User already existing'), 400)

    u = User(mail=mail)
    u.password = password
    u.lastname = lastname
    u.firstname = firstname
    u.formation = formation
    u.groupe = groupe
    u.rank = rank
    db.session.add(u)
    db.session.commit()
    return jsonify(u.serialize())


@app.route('/media/<int:id>', methods = ['GET', 'POST'])
def get_Media(id):
    m = Media.query.filter_by(id=id).first()
    if m is not None:
        print(m.url)
        return send_file(m.url,mimetype=m.type,as_attachment=True)

@app.route('/medias', methods = ['GET'])
@token_required
def get_Medias(current_user):
    media = Media.query.filter_by(id_owner=current_user.id).all()
    data = []
    for m in media:
        data.append(m.serialize())

    return jsonify(data)


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/uploader', methods = ['GET', 'POST'])
@token_required
def upload_file(current_user):
    if request.method == 'POST':
        f = request.files['file']



        letters = string.ascii_lowercase
        idFile= ''.join(random.choice(letters) for i in range(10))
        os.makedirs(os.path.dirname("./tmp/"), exist_ok=True)
        f.save("./tmp/"+str(current_user.id)+idFile+secure_filename(f.filename))


        BLOCKSIZE = 65536
        hasher = hashlib.sha1()
        with open("./tmp/"+str(current_user.id)+idFile+secure_filename(f.filename), 'rb') as tmp:
            buf = tmp.read(BLOCKSIZE)
            while len(buf) > 0:
                hasher.update(buf)
                buf = tmp.read(BLOCKSIZE)

        hash = hasher.hexdigest()
        media = Media.query.filter_by(fullhash=hash, id_owner=current_user.id).first()
        if media is not None:
            return jsonify({'path': "/media/" + str(media.id), 'type': media.type})

        os.makedirs(os.path.dirname("./media/" + str(current_user.id) + "/" + idFile + "/" + secure_filename(f.filename)),exist_ok=True)
        shutil.copy2("./tmp/"+str(current_user.id)+idFile+secure_filename(f.filename),"./media/"+str(current_user.id)+"/"+idFile+"/"+secure_filename(f.filename))
        os.remove("./tmp/"+str(current_user.id)+idFile+secure_filename(f.filename))
        m = Media(url="./media/"+str(current_user.id)+"/"+idFile+"/"+secure_filename(f.filename))
        m.fullhash=hash
        m.type=f.content_type
        m.id_owner = current_user.id
        db.session.add(m)
        db.session.commit()

        return jsonify({'path':"/media/"+str(m.id),'type':m.type})

@app.route('/users/',defaults={'rank': None}, methods=['GET'])
@app.route('/users/<int:rank>', methods=['GET'])
@token_required
def get_all_users(current_user,rank):

    if current_user.rank!=0:
        return jsonify({'message' : 'Cannot perform that function!',"users":[]})

    if rank is not None:
        users = User.query.filter_by(rank=rank).all()
    else:
        users = User.query.all()

    output = []

    for user in users:
        output.append(user.serialize())
    print(output)
    return jsonify({'users' : output})

@app.route('/configuration')
def configuration():
    user = User.query.filter_by(rank=0).all()
    if user is not None and len(user)!=0:
        data=[]
        for u in user:
            data.append({"name":u.lastname,"mail":u.mail})
        return jsonify(data)
    u = User(mail="bd@gmp.fr")
    u.password = generate_password_hash("azerty")
    u.rank = 0
    db.session.add(u)

    u2 = User(mail="etu@gmp.fr")
    u2.password = generate_password_hash("azerty")
    u2.rank = 0
    db.session.add(u2)
    db.session.commit()
    return jsonify({"message":"ok"})


if __name__ == '__main__':
    #powershell  : $env:FLASK_APP = api.py
    #CMD set FLASK_APP=api.py
    #error : flask db revision --rev-id c555609ffc5c
    socketio.run(app, debug=True,host="0.0.0.0", port=8126)
