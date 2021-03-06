import { useEffect } from "react";
import * as React from "react";
// material-ui
import { useParams } from "react-router-dom";

import { Typography, Box, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import TextareaAutosize from "@mui/material/TextareaAutosize";
// project imports
import { yellow, grey } from "@mui/material/colors";
import ConfigData from "../../../../../utils/configuration.json";
import * as LiveManager from "../../../../../utils/liveManager";

import CastForEducationIcon from "@mui/icons-material/CastForEducation";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import InputLabel from "@mui/material/InputLabel";
import io from "socket.io-client";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Alert from "@mui/material/Alert";
import LinearProgress from "@mui/material/LinearProgress";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MarkdownPreview from "@uiw/react-markdown-preview";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const sock = io(ConfigData.SERVER_URL, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 1000,
});

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

async function getCodeLive(module, token) {
  const requestOptions = {
    method: "GET",
    mode: "cors",
    headers: {
      "x-access-token": token.token,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  const response = await fetch(
    ConfigData.SERVER_URL + "/live/" + module.id_module,
    requestOptions
  );
  if (!response.ok) {
    localStorage.removeItem("token");
    window.location.reload(false);
    //console.log(response);
  }
  if (response.status == 401) {
    localStorage.removeItem("token");
    window.location.reload(false);
  }
  const result = await response.json();
  return result;
}

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function makeidInt(length) {
  var result = "";
  var characters = "123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return parseInt(result);
}

function GetErreur({ erreur, erreurMsg }) {
  if (erreur) return <Alert severity="error">{erreurMsg}</Alert>;
  else return <></>;
}
function GetForm({ reponse, setReponse, question }) {
  if (question.type == 1) {
    var options = question.option.split("??");

    return (
      <>
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          value={reponse}
          onChange={(event) => {
            setReponse(event.target.value);
          }}
          fullWidth
        >
          {options.map((val, i) => (
            <FormControlLabel value={val} control={<Radio />} label={val} />
          ))}
        </RadioGroup>
      </>
    );
  } else
    return (
      <TextareaAutosize
        aria-label="minimum height"
        minRows={3}
        value={reponse}
        placeholder="Reponse"
        style={{ width: "100%" }}
        onChange={(event) => {
          setReponse(event.target.value);
        }}
      />
    );
}

function map(value, istart, istop, ostart, ostop) {
  return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
}

function ShowReward({ item, reponseReward }) {
  var max = item.reward;
   

  var colorReward = grey[900];

  if (max == 1) colorReward = yellow[900];
  if (max == 2) colorReward = grey[200];
  if (max >= 3) colorReward = yellow[400];

  if (max == 0) return <></>;

  return (
    <IconButton
      sx={{ color: colorReward }}
      aria-label="upload picture"
      component="span"
    >
      {" "}
      <EmojiEventsIcon />{" "}
    </IconButton>
  );
}

export default function LiveUser({ module, token }) {
  const [questionList, setQList] = React.useState([]);
  const [openLiveModal, setOpenLiveModal] = React.useState(false);
  const [streamID, setStreamID] = React.useState(makeid(5));
  const [socket, setSocket] = React.useState(undefined);
  const [updater, setUpdater] = React.useState(0);
  const [option, setOption] = React.useState("");
  const [question, setQuestion] = React.useState("");
  const [reponse, setReponse] = React.useState("");
  const [titre, setTitre] = React.useState("");
  const [sessionIndex, setSessionIndex] = React.useState();
  const [erreur, setErreur] = React.useState(false);
  const [erreurMsg, setErreurMsg] = React.useState("");
  const [progress, setProgress] = React.useState(0);
  const [openModalCodeGroupe, setOpenModalCodeGroupe] = React.useState(false);
  const [sessions, setSession] = React.useState([]);
  const [timerC, setTimer] = React.useState();
  const [visiteurID, setVisiteurID] = React.useState("");
  const [reponseList, setReponseList] = React.useState([]);
  const [reponseListUser, setReponseListUser] = React.useState([]);
  const [reponseReward, setReponseReward] = React.useState([]);

  const { publickey } = useParams();

  useEffect(() => {
    setTimer(undefined);
    setQList([]);

    setErreur(false);
    setErreurMsg("");
    setProgress(0);

    if (publickey != undefined) {
      sock.on("joinpublic", joinPublic);
      sock.on("addQuestion", addQuestion);
      sock.on("reponseValide", addReponse);
      sock.on("already", already);
      sock.on("getReward", getReward);

      //console.log("join public", publickey);
      if(visiteurID==""){
      var id = makeidInt(5);
      setVisiteurID(id);
      sock.emit("joinpublic", { name: id, publickey: publickey });
      }
      //else
       // sock.emit("joinpublic", { name: visiteurID, publickey: publickey });
      

      setOpenModalCodeGroupe(false);
      setOpenLiveModal(true);
    }

    return () => {
      clearInterval(timerC);
    };
  }, [module, updater,reponseListUser]);

  const handleCloseCodeGroupe = async () => {
    setOpenModalCodeGroupe(false);
  };

  const addReponse = async (e) => {
    
    
     

    console.log("addReponse",visiteurID, new Date().getTime(),e,reponseListUser);
    if(token == undefined){
      if(visiteurID == "") return
      if(visiteurID==e.id_user){
        setReponseListUser(await LiveManager.getResponse(visiteurID,e.question.id_live,e.question.id));
      }
    }
    else{
      if (e.id_user == token.id) {
        setReponseListUser(await LiveManager.getResponse(token.id,e.question.id_live,e.question.id));
        
      }
    }
    

    
  };

  const getReward = async(e) => {
     console.log("getReward", e);
    if(token == undefined){
      if(visiteurID == "") return
      if(visiteurID==e.id_user){
        setReponseListUser(await LiveManager.getResponse(visiteurID,e.id_live,e.id_RessourceLiveDetail));
      }
    }
    else{
      if (e.id_user == token.id) {
        await setReponseListUser(await LiveManager.getResponse(token.id,e.id_live,e.id_RessourceLiveDetail));
        
      }
    }
  };

  const handleCloseandJoin = () => {
    sock.on("addQuestion", addQuestion);
    sock.on("reponseValide", addReponse);
    sock.on("already", already);
    sock.on("getReward", getReward);

    //console.log("join ", streamID);
    sock.emit("join", {
      name: "",
      room: streamID,
      token: token,
      module: module,
    });
    setOpenModalCodeGroupe(false);
    setOpenLiveModal(true);
    setUpdater((oldKey) => oldKey + 1);
  };

  const handleSend = () => {
    sock.emit("liveReponse", {
      name: "",
      room: streamID,
      token: token,
      module: module,
      question: question,
      reponse: reponse,
      visiteurID: visiteurID,
    });
  };

  const handleCloseLiveModal = () => {
    //console.log("close live");
    sock.emit("leave", {
      name: "",
      room: streamID,
      token: token,
      module: module,
      question: question,
      reponse: reponse,
      visiteurID: visiteurID,
    });
    setOpenLiveModal(false);
    clearInterval(timerC);
    setReponseList([]);
    setUpdater((oldKey) => oldKey + 1);
  };

  const joinPublic = (e) => {
    console.log(e)
   
      //console.log("reponse join ", e);
      setTitre(e.titre);
      setStreamID(e.room);
   
  };
  const already = (e) => {
    console.log("already",e,visiteurID)
    if(token == undefined){
      if(visiteurID==e.id){
        setErreur(true);
        setErreurMsg("D??ja r??pondu");
      }
    }
    else{
    if (e.id == token.id) {
      //console.log("already", e);
      //console.log("Deja r??pondu", reponseList);

      setErreur(true);
      setErreurMsg("D??ja r??pondu");
    }
  }
  };

  const clearList = async () => {
    //console.log("clearlistrep");
   await setReponseListUser([]);
    setUpdater((oldKey) => oldKey + 1);
    //console.log("clear", reponseList);
  };
  const addQuestion = async (e) => {
    setProgress(0);

    setErreur(false);
    setQuestion(e);
    var t = questionList;
    t.push(e);
    setQList([...t]);
    await clearList();
    setUpdater((oldKey) => oldKey + 1);
    //console.log("question ->", updater, question, questionList, reponseList);

    var t = setInterval(() => {
      setProgress((oldProgress) => {
        var e = questionList[questionList.length - 1];
        var x = parseFloat(
          map(Math.round(new Date().getTime() / 1000), e.dateO, e.dateF, 0, 100)
        );

        if (x >= 100) {
          //console.log("Temps ecoul?? ");
          setErreur(true);
          setErreurMsg("Temps ecoul??");
          //console.log("--------------- clear ---------------");

          clearInterval(t);
        }
        return Math.min(x, 100);
      });
    }, 1000);

    setTimer(t);
  };
  const handleStart = () => {
    setUpdater(updater + 1);
  };

  const handlLive = async () => {
    var rep = await getCodeLive(module, token);
    //console.log("live ", rep);
    setSession(rep);
    setOpenModalCodeGroupe(true);
  };

  return (
    <>
      <ListItemIcon>
        <IconButton onClick={handlLive}>
          <CastForEducationIcon />
        </IconButton>
      </ListItemIcon>

      <Dialog
        open={openLiveModal}
        onClose={handleCloseLiveModal}
        PaperProps={{
          sx: {
            maxHeight: "100vh",
          },
        }}
        maxWidth="xl"
        fullWidth={true}
      >
        <DialogTitle id="alert-dialog-title">
          Live session : {titre}
        </DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={2}>
           
            <Grid item xs={12} md={8}>
              <Item>
                <Box sx={{ width: "100%" }}>
                  {question != undefined ? (
                    <LinearProgress variant="determinate" value={progress} />
                  ) : (
                    <></>
                  )}
                </Box>
                {question != undefined ? (
                  <>
                    <Typography>Question :</Typography>{" "}
                    <MarkdownPreview source={question.content} />
                  </>
                ) : (
                  "En attente..."
                )}
                <Box>
                  {reponseListUser.map((rep, i) => (
                    <>
                      <Typography align="right">
                        <Box sx={{ boxShadow: 2, my: 2 }}>
                          {rep.content}{" "}
                          <ShowReward
                            item={rep}
                            reponseReward={reponseReward}
                          />
                        </Box>
                      </Typography>
                    </>
                  ))}
                </Box>
              </Item>
            </Grid>
            <Grid item xs={12} md={4}>
              <Item>
                <DialogContentText id="alert-dialog-description">
                  <Typography>Reponse :</Typography>
                  <GetForm
                    reponse={reponse}
                    setReponse={setReponse}
                    question={question}
                  />
                  <GetErreur erreur={erreur} erreurMsg={erreurMsg} />

                  <Box sx={{ m: 2 }}>
                    <Button variant="outlined" fullWidth onClick={handleSend}>
                      Envoyer
                    </Button>
                  </Box>
                </DialogContentText>
              </Item>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLiveModal}>Fermer</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openModalCodeGroupe}
        onClose={handleCloseCodeGroupe}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Session live</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Box
              sx={{
                mx: "auto",
                width: 400,
                p: 1,
                m: 1,
                bgcolor: (theme) =>
                  theme.palette.mode === "dark" ? "#101010" : "grey.50",
                color: (theme) =>
                  theme.palette.mode === "dark" ? "grey.300" : "grey.800",
                border: "1px solid",
                borderColor: (theme) =>
                  theme.palette.mode === "dark" ? "grey.800" : "grey.300",
                borderRadius: 2,
                textAlign: "center",
                fontSize: "0.875rem",
                fontWeight: "700",
              }}
            >
              Selectionner une session :
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Session</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={sessionIndex}
                  onChange={(event) => {
                    //console.log(sessions[event.target.value]);
                    setTitre(sessions[event.target.value].titre);
                    setStreamID(sessions[event.target.value].room);
                    setSessionIndex(event.target.value);
                  }}
                  label="Session"
                >
                  {sessions.map((i, index) => (
                    <MenuItem name={i.titre} value={index}>
                      {i.module.name} - {i.titre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseandJoin}>Rejoindre</Button>

          <Button onClick={handleCloseCodeGroupe}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
