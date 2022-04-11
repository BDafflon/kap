import React from "react";
import { useEffect } from "react";
import QuestionRapideForm from "./question/questionrapideform";
import QuestionLongueForm from "./question/questionlongueform";
import QuestionQCMForm from "./question/questionQCMform";
import QuestionListForm from "./question/questionlistform";
import QuestionFileForm from "./question/questionfileform";
import QuestionSansQuestionForm from "./question/questionsansquestionform";
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import ConfigData from "../../../../utils/configuration.json";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function getTimer(timeStart, timer) {
  //console.log("getTimer", timeStart, timer);

  if (timer == "") return " --:--:--";
  var sec = timeStart + timer * 60 - Math.round(new Date() / 1000);

  let hours = Math.floor(sec / 3600); // get hours
  let minutes = Math.floor((sec - hours * 3600) / 60); // get minutes
  let seconds = sec - hours * 3600 - minutes * 60; //  get seconds
  // add 0 if value < 10; Example: 2 => 02
  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  return " " + hours + ":" + minutes + ":" + seconds;
}

async function uploadFile(name, file, token) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("name", name);

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
  //console.log(response);
  if (!response.ok) {
    //console.log(response);
  }
  if (response.status == 401) {
    localStorage.removeItem("token");
    window.location.reload(false);
  }
  const result = await response.json();
  return result.path;
}

async function sendQuestionsList(data, questionsListe, token, timeLeft) {
  var d = [];

  questionsListe.forEach((element, i) => {
    element.questions.forEach(async (question, i) => {
      if (question.reponseuser == undefined) {
        question.reponseuser = "";
      }
      if (question.type == 3) {
        if (question.tabRep != undefined) {
          var t = [];
          question.tabRep.forEach((e) => {
            if (e != undefined) t.push(e.data);
          });
          question.tabRep = t;
        }
      }

      d.push(question);
    });
  });
  //console.log("sendQuestionsList", d);

  const requestOptions = {
    method: "POST",
    mode: "cors",
    headers: {
      "x-access-token": token.token,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ questionList: d, ressource: data, timer: timeLeft }),
  };

  //console.log(
    "sendQuestionsList stringify",
    JSON.stringify({ questionList: d, ressource: data })
  );

  const response = await fetch(
    ConfigData.SERVER_URL + "/evaluation/participation",
    requestOptions
  );
  //console.log(response);
  if (!response.ok) {
    //console.log(response);
  }
  if (response.status == 401) {
    localStorage.removeItem("token");
    window.location.reload(false);
  }
  const result = await response.json();
}
function GetForm({
  data,
  handleChild,
  index,
  token,
  type,
  correction,
  autoCorrection,
}) {
  //console.log("GetForm", data);
  if (data.type == "0") {
    return (
      <QuestionRapideForm
        data={data}
        handleChild={handleChild}
        index={index}
        type={type}
        autoCorrection={autoCorrection}
        correction={correction}
      />
    );
  }
  if (data.type == "1") {
    return (
      <QuestionLongueForm
        data={data}
        handleChild={handleChild}
        index={index}
        type={type}
        autoCorrection={autoCorrection}
        correction={correction}
      />
    );
  }
  if (data.type == "2") {
    return (
      <QuestionQCMForm
        data={data}
        handleChild={handleChild}
        index={index}
        type={type}
        autoCorrection={autoCorrection}
        correction={correction}
      />
    );
  }
  if (data.type == "3") {
    return (
      <QuestionListForm
        data={data}
        handleChild={handleChild}
        index={index}
        type={type}
        autoCorrection={autoCorrection}
        correction={correction}
      />
    );
  }
  if (data.type == "4") {
    return (
      <QuestionFileForm
        data={data}
        handleChild={handleChild}
        index={index}
        token={token}
        autoCorrection={autoCorrection}
        type={type}
      />
    );
  }

  if (data.type == "6") {
    return (
      <QuestionSansQuestionForm
        data={data}
        handleChild={handleChild}
        index={index}
        token={token}
        autoCorrection={autoCorrection}
        type={type}
      />
    );
  }

  return <h1>Error </h1>;
}

function getSeverity(data, timer) {
  if (data.timer == "" || data.timer == undefined) return "info";
  if (
    data.timer != "" &&
    parseInt(timer.split(":")[0] == 0) &&
    parseInt(timer.split(":")[1]) < 0
  )
    return "error";
  if (
    data.timer != "" &&
    parseInt(timer.split(":")[0] == 0) &&
    parseInt(timer.split(":")[1]) < 10
  )
    return "warning";
}
export default function FormContent({ data, handleClose, token }) {
  const [questionsListe, setQuestion] = React.useState([]);
  const [activeStep, setActiveStep] = React.useState(0);
  const [correction, setCorrection] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const [openTimer, setOpenTimer] = React.useState(true);
  const [timeStart, setTimeStart] = React.useState(
    Math.round(new Date() / 1000)
  );
  const [timeLeft, setTimeLeft] = React.useState();

  const handleNext = async () => {
    if (activeStep === questionsListe.length - 1) {
      //console.log("handleNext", questionsListe);

      await sendQuestionsList(data, questionsListe, token, timeLeft);
      setQuestion([]);
      setSent(true);
      handleClose(true);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  useEffect(() => {
    let interval = null;

    //console.log("FormContent", data);
    if (data.timer != undefined) {
      setTimeLeft(Math.round(+new Date() / 1000) + data.timer * 60);
      setTimeLeft(getTimer(timeStart, data.timer));
      interval = setInterval(
        () => setTimeLeft(getTimer(timeStart, data.timer)),
        1000
      );
    }
    if (timeLeft == undefined) setTimeLeft("--:--:--");
    var pages = [];

    var item = { name: "", questions: [] };
    data.content.forEach((element) => {
      if (data.type == 6) {
        if (element.type == 2) {
          // QCM
          element.tabChoix = element.choix.split("§");
          element.tabRep = Array.apply(
            null,
            Array(element.tabChoix.length)
          ).map(function (x, i) {
            return false;
          });
        }
        if (element.type == 3) {
          // Liste a ordonner
          element.tabChoix = element.reponse.split("§");
          element.tabRep = Array.apply(
            null,
            Array(element.tabChoix.length)
          ).map(function (x, i) {
            return "";
          });
        }

        pages.push({ name: element.question, questions: [element] });
      } else {
        if (element.type == -1) {
          if (item.questions.length == 0) {
            item = { name: element.question, questions: [] };
          } else {
            pages.push(item);
            item = { name: element.question, questions: [] };
          }
        } else {
          if (element.type == 2) {
            // QCM
            element.tabChoix = element.choix.split("§");
            element.tabRep = Array.apply(
              null,
              Array(element.tabChoix.length)
            ).map(function (x, i) {
              return false;
            });
          }
          if (element.type == 3) {
            // Liste a ordonner
            element.tabChoix = element.reponse.split("§");
            element.tabRep = Array.apply(
              null,
              Array(element.tabChoix.length)
            ).map(function (x, i) {
              return "";
            });
          }
          item.questions.push(element);
        }
      }
    });
    if (data.type != 6) {
      pages.push(item);
    }
    pages.push({ name: "Fin", questions: [] });

    setQuestion([...pages]);
    //console.log("FormContent questionsListe", questionsListe);

    return () => {
      clearInterval(interval);
    };
  }, [data]);

  const handCorrection = () => {
    setCorrection(true);
    setActiveStep(0);
  };
  const handleChild = (data, index, type, field) => (e) => {
    //console.log("handleChildForm", data, index, type, field, e);

    if (type == "QCM") {
      //console.log("handleChildFormQCM", data, index, type, field, e);
      questionsListe[activeStep].questions[index].tabRep[field] =
        e.target.checked;
    } else {
      if (type == "LIST") {
        //console.log("handleChildFormLIST", data, index, type, field, e);
        questionsListe[activeStep].questions[index].tabRep = field;
      } else {
        if (type == "FILE") {
          //console.log("handleChildFormLIST", data, index, type, field, e);
          questionsListe[activeStep].questions[index].media = field;
        } else {
          var {
            target: { value },
          } = e;

          questionsListe[activeStep].questions[index].reponseuser = value;
        }
      }
    }

    //console.log("handleChild - questionsListe", questionsListe);
  };

  if (questionsListe.length == 0) return <></>;
  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Stepper activeStep={activeStep}>
          {questionsListe.map((label, index) => {
            const stepProps = {};
            const labelProps = {};
            if (data.type == 6) {
              if (label.questions.length > 0) {
                if (label.questions[0].essais != undefined) {
                  if (label.questions[0].essais <= 0) {
                    labelProps.error = true;
                    //console.log("-----------", label);
                  }
                }
              }
            }

            return (
              <Step key={label.name} {...stepProps}>
                <StepLabel {...labelProps}></StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === questionsListe.length ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1, ml: 1 }}>
              Evaluation Envoyée
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Retour
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />

              <Button onClick={handleNext}>
                {activeStep === questionsListe.length - 1
                  ? correction
                    ? "Fermer"
                    : "Envoyer"
                  : "Suivant"}
              </Button>
            </Box>
          </React.Fragment>
        )}
      </Box>

      {activeStep < questionsListe.length ? (
        questionsListe[activeStep].questions.map((page, index) => (
          <Box sx={{ my: 2 }}>
            <GetForm
              data={page}
              handleChild={handleChild}
              index={index}
              token={token}
              autoCorrection={data.type == 6}
              correction={correction}
              type={data.type}
            />
          </Box>
        ))
      ) : (
        <></>
      )}
      {activeStep === questionsListe.length - 1 && !correction
        ? "Valider votre evaluation en cliquant sur "
        : ""}
      {activeStep === questionsListe.length - 1 && !correction ? (
        <Button onClick={handleNext}> Envoyer </Button>
      ) : (
        ""
      )}

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openTimer}
      >
        <Alert severity={getSeverity(data, timeLeft)} sx={{ width: "100%" }}>
          {//console.log("timeLeft", timeLeft)}
          {"Timer :" + timeLeft}
        </Alert>
      </Snackbar>
    </>
  );
}
