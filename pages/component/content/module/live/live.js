import { useEffect } from "react";
import * as React from "react";
// material-ui
import { Typography, Box, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Checkbox from "@mui/material/Checkbox";
// project imports
import { yellow, grey, green } from "@mui/material/colors";
import ConfigData from "../../../../../utils/configuration.json";
import CastForEducationIcon from "@mui/icons-material/CastForEducation";
import Grid from "@mui/material/Grid";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import TimePicker from "@mui/lab/TimePicker";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import io from "socket.io-client";
import Stack from "@mui/material/Stack";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import LinearProgress from "@mui/material/LinearProgress";
import PropTypes from "prop-types";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ReactWordcloud from "react-wordcloud";
import DragAndDrop from "../../../ressources/editor/drag";
import MarkdownPreview from "@uiw/react-markdown-preview";
import Switch from "@mui/material/Switch";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import StreamIcon from "@mui/icons-material/Stream";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import { SignalCellularConnectedNoInternet3BarSharp } from "@mui/icons-material";
import QRCode from "react-qr-code";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import { FullScreen } from "@chiragrupani/fullscreen-react";
import Fab from '@mui/material/Fab';
import FullScreenComponent from 'react-easyfullscreen'
import FullscreenIcon from "@mui/icons-material/Fullscreen"



const socket = io(ConfigData.SERVER_URL, {
  reconnection: true,
  reconnectionDelay: 500,
  reconnectionAttempts: 10,
});

async function openLive(open, live, token, pKeys) {
  const requestOptions = {
    method: "POST",
    mode: "cors",
    headers: {
      "x-access-token": token.token,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ open: open, live: live, publickey: pKeys }),
  };

  const response = await fetch(
    ConfigData.SERVER_URL + "/openlive",
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
  //console.log(result);
}

async function upload(file, token) {
  const formData = new FormData();
  formData.append("file", file);

  const requestOptions = {
    method: "POST",
    mode: "cors",
    headers: {
      "x-access-token": token.token,
    },
    body: formData,
  };

  const response = await fetch(
    ConfigData.SERVER_URL + "/uploader",
    requestOptions
  );

  if (!response.ok) {
    localStorage.removeItem("token");
    window.location.reload(false);
  }
  if (response.status == 401) {
    localStorage.removeItem("token");
    window.location.reload(false);
  }
  const result = await response.json();
  if (result.type.includes("image")) {
    return "![img](" + ConfigData.SERVER_URL + result.path + ")";
  }
  return "[Document](" + ConfigData.SERVER_URL + result.path + ")";
}

async function closeLive(streamID, token) {
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
    ConfigData.SERVER_URL + "/live/close/" + streamID,
    requestOptions
  );
}
function LinearProgressWithLabel(props) {
  var colorReward = grey[900];
  if (props.rewardvalue != undefined)
    if (props.rewardvalue == 1) colorReward = yellow[900];
  if (props.rewardvalue == 2) colorReward = grey[200];
  if (props.rewardvalue >= 3) colorReward = yellow[400];
  //console.log("LinearProgressWithLabel", props.reward);

  return (
    <Grid
      container
      spacing={0}
      alignItems="center"
      justify="space-between"
      style={{}}
    >
      <Grid item xs={3}>
        <Typography align="right" variant="button" sx={{ fontSize: 20 }}>
          {props.label}{" "}
        </Typography>
      </Grid>
      <Grid item xs={8}>
        <LinearProgress variant="determinate" {...props} sx={{ height: 10 }} />
      </Grid>
      <Grid item xs={1}>
        <IconButton
          sx={{ color: colorReward, boxShadow: 2 }}
          aria-label="upload picture"
          component="span"
          onClick={() => {
            props.handleReward(props.reward, props.label);
          }}
        >
          {" "}
          <EmojiEventsIcon />{" "}
        </IconButton>
      </Grid>
    </Grid>
  );
}

LinearProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and buffer variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

function map(value, istart, istop, ostart, ostop) {
  return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
}

function GetReponseForm({ handleReward, index, item }) {
  //console.log("GetReponseForm", item);
  if (item == undefined) {
    //console.log("GetReponseForm undef");
    return <></>;
  }

  let renderLabel = function (entry) {
    return entry.name;
  };

  if (item.question == "") return <></>;

  var data = [];
  // x 100
  // v total
  //console.log("GetReponseForm occurence ", item.occurence);
  Object.keys(item.occurence).forEach((key) => {
    var d = {
      name: key,
      value: item.occurence[key],
      normalizeValue: (item.occurence[key] * 100) / item.reponses.length,
      item: item,
      text: key,
    };

    item.reponses.forEach((e, i) => {
      //console.log("item.reponses ", e);
      if (e.reponse.content == d.name) d.reward = e.reponse.reward;
    });
    data.push(d);
  });

  if (item.type == 1) {
    //QCM

    //console.log("data", data);
    return (
      <>
        <>
          {" "}
          <Typography>Question {index}: </Typography>{" "}
          <MarkdownPreview source={"#"+item.question} />{" "}
        </>

        <ResponsiveContainer width="99%" aspect={3}>
          <PieChart width={400} height={400}>
            <Pie
              style={{
                fontSize: "1.8rem",
                fontFamily: "Arial",
              }}
              dataKey="value"
              isAnimationActive={false}
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              label={renderLabel}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </>
    );
  }
  if (item.type == 2) {
    if (data.length == 0)
      return (
        <>
          {" "}
          <Typography>Question {index}: </Typography>{" "}
          <MarkdownPreview source={"# "+item.question} />{" "}
        </>
      );

    data.sort(function (a, b) {
      return parseFloat(b.normalizeValue) - parseFloat(a.normalizeValue);
    });

    for (var i = 0; i < data.length; i++) {
      data[i].normalizeValue2 = map(
        data[i].normalizeValue,
        0,
        data[0].normalizeValue,
        0,
        100
      );
    }

    //x nb
    //y 100
    return (
      <>
        <>
          {" "}
          <Typography>Question {index}: </Typography>{" "}
          <MarkdownPreview source={"# "+item.question} />{" "}
        </>
        {data.map((i) => (
          <Box sx={{ width: "100%" }}>
            <LinearProgressWithLabel
              handleReward={handleReward}
              value={i.normalizeValue2}
              label={i.name}
              rewardvalue={i.reward}
              reward={item}
            />
          </Box>
        ))}
      </>
    );
  }
  if (item.type == 4) {
    const size = [600, 400];
    const options = {
      enableTooltip: true,
      deterministic: false,
      fontFamily: "impact",
      fontSizes: [40, 100],
      fontStyle: "normal",
      fontWeight: "normal",
      padding: 1,
      rotations: 2,
      rotationAngles: [0, 90],
      scale: "sqrt",
      spiral: "archimedean",
      transitionDuration: 1000,
    };
    return (
      <>
        <>
          {" "}
          <Typography>Question {index}: </Typography>{" "}
          <MarkdownPreview source={item.question} />{" "}
        </>

        <div style={{ width: "100%", height: "100%" }}>
          <ReactWordcloud words={data} options={options} size={size} />
        </div>
      </>
    );
  }
  return <></>;
}

function GetAllReponseForm({ reponsesList, questionList, handleReward ,setFullScreen,isFullScreen}) {
  {
    //console.log("GetAllReponseForm", reponsesList, questionList);

    let data = JSON.parse(JSON.stringify(questionList));

    data.forEach((element) => {
      reponsesList.forEach((e) => {
        if (e.question.public_id === element.public_id) {
          element.reponses.unshift({ reponse: e, user: e.user });
          if (element.occurence[e.content] == undefined)
            element.occurence[e.content] = 1;
          else element.occurence[e.content] += 1;
        }
      });

      //console.log("GetAllReponseForm data", data);
    });
    return (
      <>
        {data.map((item, index) => (
          <Box>
            {
            index==0?
            <FullScreenComponent sx={{my:3}}>
              {({ ref, onToggle }) => (
                <Box ref={ref} height={isFullScreen?"100vh":""} sx={{backgroundColor: 'white'}} >
      <Fab  sx={{
        position: "fixed",
        bottom: (theme) => theme.spacing(2),
        right: (theme) => theme.spacing(2)
      }}  aria-label="edit"  onClick={() =>{ onToggle()}}>
        
      <FullscreenIcon  />
      </Fab>
            <GetReponseForm
              handleReward={handleReward}
              index={index}
              item={item}
            /></Box>)}
</FullScreenComponent>:<GetReponseForm
              handleReward={handleReward}
              index={index}
              item={item}
            />
            }
          </Box>
        ))}
      </>
    );
  }
}

export default function Live({ module, token }) {
  const [currentQuestion, setCurrentQuestion] = React.useState({
    question: "",
    reponses: [],
  });
  const [questionList, setQuestionList] = React.useState([]);
  const [openLiveModal, setOpenLiveModal] = React.useState(false);
  const [streamID, setStreamID] = React.useState(makeid(5));
  const [timer, setTimer] = React.useState(new Date());
  const [option, setOption] = React.useState("");
  const [question, setQuestion] = React.useState("");
  const [titre, setTitre] = React.useState("");
  const [checked, setChecked] = React.useState(true);
  const [value2, setValue2] = React.useState(2);
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [publicLive, setPublic] = React.useState(false);
  const [publicKey, setPublicKey] = React.useState(makeid(10));
  const [clients, setClients] = React.useState([]);
  const [openQrCode, setModalQrCode] = React.useState(false);
  const [clearQL, setClearQL] = React.useState("start");
  const [inLive, setInLive] = React.useState(false);
  const [reponsesList, setReponsesList] = React.useState([]);
  const [rewardList, setRewardList] = React.useState([]);
  const [isFullScreen,setFullScreen]= React.useState(false);

  const handleCloseQr = () => {
    setModalQrCode(false);
  };
  const handleReward = (param, label) => {
    //console.log("handleReward", param, label);
    const newIds = reponsesList;

    newIds.forEach((element, i) => {
      if (element.question.public_id == param.public_id) {
        if (element.content == label)
          if (element.reward == undefined) element.reward = 1;
          else element.reward += 1;
      }
    });

    socket.emit("reward", { reponsesList: reponsesList, room: streamID });
    setReponsesList(newIds);

    //console.log("handleReward list", reponsesList);
    setRefreshKey((oldKey) => oldKey + 1);
  };

  const handleChange = (event) => {
    //console.log("handleChange");
    setChecked(event.target.checked);
  };

  const handleChangeQCM = (event) => {
    //console.log("handleChangeQCM");
    setValue2(event.target.value);
  };

  const handleChangePublic = async (event) => {
    setPublic(event.target.checked);
    var pk = makeid(5)
    setPublicKey(pk)
    await openLive(event.target.checked, streamID, token, pk);
  };

  useEffect(() => {
    return () => {
      if (inLive) {
        //console.log("leaving room");
      }
    };
  }, [inLive]);

  useEffect(() => {
    clients.sort((a, b) =>
      a.reward > b.reward ? 1 : b.client.name > a.client.name ? -1 : 0
    );
    socket.on("addClient", addClient);
    socket.on("removeClient", removeClient);
    socket.on("disconnect", () => {
      //console.log(socket.connected); // undefined
    });
    socket.on("connect", () => {
      //console.log(socket.connected); // true
    });
    //The socket is a module that exports the actual socket.io socket
    const addMessage = (msg) => {
      setReponsesList((prevMessages) => [...prevMessages, msg]);
    };
    socket.on("addReponse", addMessage);
  }, []);

  const addClient = (e) => {
    setClients((prevMessages) => [...prevMessages, { client: e, reward: 0 }]);
  };

  const removeClient = (e) => {
    //console.log("removeClient", e);
  };

  const handleSend = () => {
    
    var datum = new Date();
    datum.setTime(timer);
    var seconds = datum.getSeconds();
    var minutes = datum.getMinutes();
    var hour = 0;
    var t = seconds + minutes * 60 + hour * 3600;

    var qc = {};
    qc.question = question;
    qc.type = value2;
    qc.option = option;
    qc.reponses = [];
    qc.occurence = {};
    qc.public_id = makeid(5);

    setCurrentQuestion(qc);
    setQuestionList([qc, ...questionList]);
    socket.emit("liveQuestion", {
      timer: t,
      reponseunique: checked ? 1 : 0,
      type: value2,
      option: option,
      question: question,
      token: token,
      module: module,
      room: streamID,
      randomID: qc.public_id,
    });
  };
  const handleErase = () => {
    //console.log("handleErase", clearQL, questionList);
    setQuestionList([questionList[0]]);
  };

  const handleCloseLiveModal = async () => {
    //console.log("handleCloseLiveModal");
    setOpenLiveModal(false);
    setPublic(false);
    setQuestionList([]);
    setTitre("");
    setCurrentQuestion();
    setQuestion("");
    setInLive(false);

    closeLive(streamID, token);
    setRefreshKey((oldKey) => oldKey + 1);
  };

  const handleStart = () => {
    //console.log("live", module);
    setClearQL("live");
    setInLive(true);

    socket.emit("join", {
      name: "Prof",
      room: streamID,
      titre: titre,
      token: token,
      module: module,
    });
  };
  const handlLive = (e) => {
    //console.log("handlLive");
    setStreamID(module.id_module + "-" + makeid(5));
    setOpenLiveModal(true);
  };

  const handleDrop = async (files, e) => {
    for (var i = 0; i < files.length; i++) {
      if (!files[i].name) return;

      let f = await upload(files[i], token);
      var q = question;
      q = q + "\n" + f;
      setQuestion(q);
    }
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
          Live session [ID: {streamID}]
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={8}>
              <Item sx={{ height: "100%" }}>
                <TextField
                  id="standard-basic"
                  label="Titre"
                  sx={{ width: "90%" }}
                  value={titre}
                  onChange={(event) => {
                    setTitre(event.target.value);
                  }}
                />
              </Item>
            </Grid>
            <Grid item xs={3}>
              <Item sx={{ height: "100%" }}>
                <Typography component="span">
                  Public :
                  <Switch
                    disabled={inLive == false}
                    checked={publicLive}
                    onChange={handleChangePublic}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                </Typography>
                {publicLive ? (
                  <Typography component="span">
                    {" "}
                    lien :
                    <IconButton disabled={inLive == false} component="span">
                      {" "}
                      <ContentCopyIcon
                        onClick={() => {
                          navigator.clipboard.writeText(
                            window.location.href + "live/" + publicKey
                          );
                        }}
                      />{" "}
                    </IconButton>{" "}
                  </Typography>
                ) : (
                  <> </>
                )}
                {publicLive ? (
                  <Typography component="span">
                    {" "}
                    :
                    <IconButton disabled={inLive == false} component="span">
                      {" "}
                      <QrCode2Icon
                        onClick={() => {
                          setModalQrCode(true);
                        }}
                      />{" "}
                    </IconButton>{" "}
                  </Typography>
                ) : (
                  <> </>
                )}
              </Item>
            </Grid>
            <Grid item xs={1}>
              <Item sx={{ height: "100%" }}>
                {inLive == false ? (
                  <Button
                    variant="outlined"
                    onClick={handleStart}
                    sx={{ width: "10%" }}
                  >
                    Start
                  </Button>
                ) : (
                  <StreamIcon sx={{ color: green[500] }} />
                )}
              </Item>
            </Grid>
          </Grid>
        </DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Item>
                <DialogContentText id="alert-dialog-description">
                  <Typography>Question :</Typography>
                  <DragAndDrop handleDrop={handleDrop} id="q">
                    <TextareaAutosize
                      id="question"
                      placeholder="Question"
                      style={{ width: "100%" }}
                      onChange={(event) => {
                        //console.log("onChange question");
                        setQuestion(event.target.value);
                      }}
                      aria-label="minimum height"
                      minRows={3}
                      value={question}
                    />
                  </DragAndDrop>

                  <Box style={{ width: "100%" }} s>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      value={value2}
                      onChange={handleChangeQCM}
                      fullWidth
                    >
                      <FormControlLabel
                        value="1"
                        control={<Radio />}
                        label="QCM"
                      />
                      <FormControlLabel
                        value="2"
                        control={<Radio />}
                        label="Occurrence"
                      />
                      <FormControlLabel
                        value="3"
                        control={<Radio />}
                        label="Stream"
                      />
                      <FormControlLabel
                        value="4"
                        control={<Radio />}
                        label="Cloud"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            defaultChecked
                            checked={checked}
                            onChange={handleChange}
                          />
                        }
                        label="Reponse unique"
                      />
                    </RadioGroup>
                  </Box>

                  <TextField
                    id="standard-basic"
                    label="Option"
                    variant="standard"
                    fullWidth
                    value={option}
                    onChange={(event) => {
                      //console.log("onChange option");
                      setOption(event.target.value);
                    }}
                  />
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Stack spacing={3}>
                      <TimePicker
                        ampmInClock
                        views={["minutes", "seconds"]}
                        inputFormat="mm:ss"
                        mask="__:__"
                        label="Minutes and seconds"
                        value={timer}
                        onChange={(newValue) => {
                          //console.log("onChange timer");
                          setTimer(newValue);
                        }}
                        renderInput={(params) => (
                          <TextField {...params} variant="standard" />
                        )}
                      />
                    </Stack>
                  </LocalizationProvider>
                  <Box sx={{ m: 2 }}>
                    <Button variant="outlined" fullWidth onClick={handleSend}>
                      Envoyer
                    </Button>
                  </Box>
                  <Box sx={{ m: 2 }}>
                    <Button variant="outlined" fullWidth onClick={handleErase}>
                      Effacer
                    </Button>
                  </Box>
                  <Box
                    sx={{
                      width: "100%",
                      height: 300,
                      maxWidth: "100%",
                      bgcolor: "background.paper",
                    }}
                  >
                    <List
                      sx={{
                        width: "100%",
                        bgcolor: "background.paper",
                        position: "relative",
                        overflow: "auto",
                        maxHeight: 300,
                        "& ul": { padding: 0 },
                      }}
                      subheader={
                        <ListSubheader
                          component="div"
                          id="nested-list-subheader"
                        >
                          Connectés
                        </ListSubheader>
                      }
                    >
                      {clients.map((client) => (
                        <ListItem>
                          <ListItemText
                            primary={
                              "[" + client.reward + "] " + client.client.name
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </DialogContentText>
              </Item>
            </Grid>
            <Grid item xs={8}>
              <Item>
                <Stack spacing={2}>
                  <GetAllReponseForm
                    reponsesList={reponsesList}
                    questionList={questionList}
                    handleReward={handleReward}
                    isFullScreen={isFullScreen}
                    setFullScreen={setFullScreen}
                  />
                </Stack>
              </Item>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLiveModal}>Fermer</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openQrCode}
        onClose={handleCloseQr}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
      >
        <DialogTitle id="alert-dialog-title">{"Qr Code :" + titre}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <QRCode value={window.location.href + "live/" + publicKey} />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseQr} autoFocus>
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
