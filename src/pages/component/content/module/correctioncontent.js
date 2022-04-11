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

async function sendReponseList(
  data,
  dataReponse,
  reponseList,
  questionsListe,
  token
) {
  var d = [];
  //console.log("sendReponseList dataReponse", data, dataReponse);
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
    body: JSON.stringify({
      questionList: d,
      ressource: data,
      dataReponse: dataReponse,
      reponseList: reponseList,
    }),
  };

  //console.log(
    "sendQuestionsList stringify",
    JSON.stringify({ questionList: d, ressource: data })
  );

  const response = await fetch(
    ConfigData.SERVER_URL + "/evaluation/correction",
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
function GetForm({ data, handleChild, index, token, type, correction }) {
  //console.log("GetForm", data);
  if (type == "0") {
    return (
      <QuestionRapideForm
        data={data}
        handleChild={handleChild}
        index={index}
        type={type}
        correction={correction}
      />
    );
  }
  if (type == "1") {
    return (
      <QuestionLongueForm
        data={data}
        handleChild={handleChild}
        index={index}
        type={type}
        correction={correction}
      />
    );
  }
  if (type == "2") {
    return (
      <QuestionQCMForm
        data={data}
        handleChild={handleChild}
        index={index}
        type={type}
        correction={correction}
      />
    );
  }
  if (type == "3") {
    return (
      <QuestionListForm
        data={data}
        handleChild={handleChild}
        index={index}
        type={type}
        correction={correction}
      />
    );
  }
  if (type == "4") {
    return (
      <QuestionFileForm
        data={data}
        handleChild={handleChild}
        index={index}
        token={token}
        type={type}
        correction={correction}
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
        type={type}
      />
    );
  }

  return <h1>Error </h1>;
}

export default function CorrectionContent({
  dataQuestion,
  dataReponse,
  handleClose,
  token,
  handleNextCorrection,
}) {
  const [questionsListe, setQuestion] = React.useState([]);
  const [reponseList, setReponses] = React.useState([]);
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = async () => {
    if (activeStep === questionsListe.length - 1) {
      //console.log("handleNext", questionsListe);
      await sendReponseList(
        dataQuestion,
        dataReponse,
        reponseList,
        questionsListe,
        token
      );
      setActiveStep(0);
      handleNextCorrection();
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  useEffect(() => {
    //console.log("FormContent", dataQuestion, dataReponse);
    var pages = [];

    var item = { name: "", questions: [] };
    dataQuestion.questions.forEach((element) => {
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
        element.reponseuser = "";
        dataReponse.reponse.forEach((e) => {
          if (element.id == e.id_question) element.reponseuser = e.reponse;
        });

        item.questions.push(element);
      }
    });
    pages.push(item);

    pages.push({ name: "Fin", questions: [] });

    setQuestion([...pages]);
    setReponses(dataReponse);
    //console.log("FormContent questionsListe", questionsListe);
  }, [dataQuestion, dataReponse]);

  const handleChild = (data, index, field, v) => (e) => {
    //console.log("handleChildForm", data, index, field, v, e, reponseList);
    let newArr = [...questionsListe];
    let newArrRep = reponseList;

    //console.log("handleChild - questionsListe", newArr[activeStep].questions);
    if (field == "update") {
      const {
        target: { value },
      } = e;
      //console.log(value);
      newArr[activeStep].questions[index].note = value;
    } else {
      if (field == "note") newArr[activeStep].questions[index].note = v;
    }
    //console.log(
      "handleChild - questionsListe",
      newArr[activeStep].questions[index].note
    );

    setQuestion(newArr);
    newArrRep.reponse.forEach((element, i) => {
      if (element.id_question == newArr[activeStep].questions[index].id)
        newArrRep.reponse[i].note = newArr[activeStep].questions[index].note;
    });
    setReponses(newArrRep);
    //console.log("newArr", newArrRep);
    //console.log(
      "handleChild - questionsListe",
      questionsListe[activeStep].questions[index].note
    );
  };

  if (questionsListe.length == 0) return <></>;
  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Stepper activeStep={activeStep}>
          {questionsListe.map((label, index) => {
            const stepProps = {};
            const labelProps = {};

            return (
              <Step key={label.name} {...stepProps}>
                <StepLabel {...labelProps}>{label.name}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === questionsListe.length ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1, ml: 1 }}>
              Correction Envoyée
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
                  ? "Fermer"
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
              correction={true}
              type={page.type}
            />
          </Box>
        ))
      ) : (
        <></>
      )}
      {activeStep === questionsListe.length - 1
        ? "Enregistrer la correction "
        : ""}
      {activeStep === questionsListe.length - 1 ? (
        <Button onClick={handleNext}> Envoyer </Button>
      ) : (
        ""
      )}
    </>
  );
}
