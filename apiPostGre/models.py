from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()



class RessourceLive(db.Model):
    __tablename__ = 'ressourcelive'
    id = db.Column(db.Integer, primary_key=True)
    id_module = db.Column(db.Integer)
    dateO = db.Column(db.Integer)
    dateF = db.Column(db.Integer)
    id_owner = db.Column(db.Integer)
    titre = db.Column(db.String(255))
    room = db.Column(db.String(255))


class RessourceLiveDetail(db.Model):
    __tablename__ = 'ressourceliveDetail'
    id = db.Column(db.Integer, primary_key=True)
    id_live=db.Column(db.Integer)
    id_module = db.Column(db.Integer)
    content = db.Column(db.String(255))
    option = db.Column(db.String(255))
    dateO = db.Column(db.Integer)
    dateF = db.Column(db.Integer)
    id_user=db.Column(db.Integer)
    def serialize(self):
        return {
            'id':self.id,
            'id_module':self.id_module,
            'id_user':self.id_user,
            'id_live':self.id_live,
            'content':self.content,
            'option': self.option,
            'dateO': self.dateO,
            'dateF': self.dateF,
        }


class RessourceLiveParticipation(db.Model):
    __tablename__ = 'ressourceliveParticipation'
    id = db.Column(db.Integer, primary_key=True)
    id_module = db.Column(db.Integer)
    id_user = db.Column(db.Integer)
    id_RessourceLiveDetail=db.Column(db.Integer)
    content = db.Column(db.String(255))
    dateO=db.Column(db.Integer)
    def serialize(self):
        return {
            'id':self.id,
            'id_module':self.id_module,
            'id_user':self.id_user,
            'id_RessourceLiveDetail':self.id_RessourceLiveDetail,
            'content':self.content,
            'dateO': self.dateO,

        }

class RessourceStat(db.Model):
    __tablename__ = 'ressourcestat'
    id = db.Column(db.Integer, primary_key=True)
    id_user = db.Column(db.Integer)
    id_ressource = db.Column(db.Integer)
    type_ressource = db.Column(db.Integer)
    id_module = db.Column(db.Integer)
    dateO = db.Column(db.Integer)
    dateF=db.Column(db.Integer)
    def serialize(self):
        return {
            'id':self.id,
            'id_user':self.id_user,
            'id_ressource':self.id_ressource,
            'type_ressource': self.type_ressource,
            'id_module': self.id_module,
            'dateO': self.dateO,
            'dateF': self.dateF,
        }

class RessourceText(db.Model):
    __tablename__ = 'ressourcetext'
    id = db.Column(db.Integer, primary_key=True)
    id_owner = db.Column(db.Integer)
    id_module = db.Column(db.Integer)
    groupes = db.Column(db.String(255))
    titre = db.Column(db.String(255))
    type = db.Column(db.String(255))
    content = db.Column(db.Text())
    dateO= db.Column(db.Integer)
    dateF = db.Column(db.Integer)
    def serialize(self):
        return {
            'id':self.id,
            'id_owner':self.id_owner,
            'id_module':self.id_module,
            'groupes': self.groupes,
            'titre': self.titre,
            'type': self.type,
            'content': self.content,
            'dateO': self.dateO,
            'dateF': self.dateF,
        }


class RessourceQestions(db.Model):
    __tablename__ = 'ressourceqestions'
    id = db.Column(db.Integer, primary_key=True)
    id_module = db.Column(db.Integer)
    titre = db.Column(db.String(255))
    type = db.Column(db.String(255))
    dateO = db.Column(db.Integer)
    groupes = db.Column(db.String(255))
    dateF = db.Column(db.Integer)
    nbQuestion = db.Column(db.Integer)
    questionAleatoire = db.Column(db.Integer)
    id_owner = db.Column(db.Integer)
    timer = db.Column(db.Integer)

    def serialize(self):
        return {
            'id':self.id,
            'id_owner':self.id_owner,
            'id_module':self.id_module,
            'groupes': self.groupes,
            'titre': self.titre,
            'type': self.type,
            'nbQuestion': self.nbQuestion,
            'questionAleatoire':self.questionAleatoire,
            'dateO': self.dateO,
            'dateF': self.dateF,
            'timer':self.timer,
        }


class Question(db.Model):
    __tablename__ = 'question'
    id = db.Column(db.Integer, primary_key=True)
    id_ressourceqestions = db.Column(db.Integer)
    question = db.Column(db.Text())
    type = db.Column(db.Integer)
    reponse = db.Column(db.Text())
    barem = db.Column(db.Integer)
    difficulte = db.Column(db.Integer)
    requis = db.Column(db.Integer)
    indice = db.Column(db.Text())
    order=db.Column(db.Integer)
    size = db.Column(db.Integer)
    choix = db.Column(db.Text())
    formats = db.Column(db.Text())
    def serialize(self):
        return {
            'id':self.id,
            'id_ressourceqestions':self.id_ressourceqestions,
            'question':self.question,
            'type': self.type,
            'reponse': self.reponse,
            'barem': self.barem,
            'difficulte': self.difficulte,
            'requis':self.requis,
            'indice': self.indice,
            'order': self.order,
            'size': self.size,
            'choix': self.choix,
            'formats': self.formats,
        }


class Evaluation(db.Model):
    __tablename__ = 'evaluation'
    id = db.Column(db.Integer, primary_key=True)
    id_ressourceqestions = db.Column(db.Integer)
    id_user = db.Column(db.Integer)
    id_module = db.Column(db.Integer)
    date_eval= db.Column(db.Integer)
    note = db.Column(db.Integer)
    barem_total = db.Column(db.Integer)
    auto_correction = db.Column(db.Integer)
    def serialize(self):
        return {
            'id':self.id,
            'id_ressourceqestions':self.id_ressourceqestions,
            'id_user':self.id_user,
            'id_module': self.id_module,
            'date_eval': self.date_eval,
            'note': self.note,
            'barem_total': self.barem_total,
            'auto_correction':self.auto_correction,

        }

class ReponseEvaluation(db.Model):
    __tablename__ = 'reponseevaluation'
    id = db.Column(db.Integer, primary_key=True)
    id_user = db.Column(db.Integer)
    id_question = db.Column(db.Integer)
    id_eval= db.Column(db.Integer)
    reponse = db.Column(db.Text())
    note = db.Column(db.Integer)
    type = db.Column(db.Integer)
    def serialize(self):
        return {
            'id':self.id,
            'id_user':self.id_user,
            'id_question':self.id_question,
            'id_eval': self.id_eval,
            'reponse': self.reponse,
            'note': self.note,
            'type': self.type
        }






class Media(db.Model):
    __tablename__ = 'media'
    id = db.Column(db.Integer, primary_key=True)
    type=db.Column(db.String(50))
    name=db.Column(db.String(50))
    url = db.Column(db.String(255))
    id_owner = db.Column(db.Integer)
    fullhash = db.Column(db.Text())

    def serialize(self):
        return {
            'id':self.id,
            'type':self.type,
            'name':self.name,
            'url':self.url
        }

class Formation(db.Model):
    __tablename__ = 'formation'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))

    def serialize(self):
        return {
            'id':self.id,
            'name':self.name,

        }

class Affectation(db.Model):
    __tablename__ = 'affectation'
    id = db.Column(db.Integer, primary_key=True)
    id_formation = db.Column(db.Integer)
    id_groupe = db.Column(db.Integer)
    id_module = db.Column(db.Integer)
    annee = db.Column(db.Integer)
    def serialize(self):
        return {
            'id':self.id,
            'id_formation':self.id_formation,
            'id_groupe':self.id_groupe,
            'id_module':self.id_module,
            'annee': self.annee
        }

class Groupe(db.Model):
    __tablename__ = 'groupe'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    subgroupe = db.Column(db.String(50))
    id_formation = db.Column(db.Integer)
    code = db.Column(db.String(50))
    def serialize(self):
        return {
            'id':self.id,
            'name':self.name,
            'subgroupe':self.subgroupe,
            'id_formation':self.id_formation
        }

class Module(db.Model):
    __tablename__ = 'module'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    id_formation = db.Column(db.Integer)
    id_owner = db.Column(db.Integer)
    intro = db.Column(db.Text())
    def serialize(self):
        return {
            'id':self.id,
            'name':self.name,
            'id_formation':self.id_formation,
            'id_owner':self.id_owner,
            'intro':self.intro
        }

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.String(50), unique=True)
    firstname = db.Column(db.String(50))
    lastname = db.Column(db.String(50))
    mail = db.Column(db.String(255))
    formation = db.Column(db.String(50))
    groupe = db.Column(db.String(50))
    password = db.Column(db.String(255))
    rank = db.Column(db.Integer)

    def serialize(self):
        return {
            'id':self.public_id,
            'firstname':self.firstname,
            'lastname':self.lastname,
            'mail':self.mail,
            'formation':self.formation,
            'groupe':self.groupe
        }

