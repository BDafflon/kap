import React, { useState } from "react";
import { useFormik } from "formik";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PropType from "prop-types";
import ConfigData from "../../../utils/configuration.json";
import { useEffect } from "react";
import CardRessource from "./module/cardressource";
import CardCorrection from "./module/cardcorrection";
import Groupe from "./module/groupe";
import CastForEducationIcon from "@mui/icons-material/CastForEducation";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Live from "./module/live/live";

function GetModuleAdmin({
  module,
  token,
  listRessource,
  listeExam,
  handleUpdate,
}) {
  console.log("GetModuleAdmin");
  return (
    <>
      {" "}
      <h1>Administration</h1>
      <h2>
        {module.label} <Live module={module} token={token} />
      </h2>
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item lg={4} md={12} sm={12} xs={12}>
                <Typography variant="button" display="block" gutterBottom>
                  Ressources
                </Typography>
                <CardRessource data={module} token={token} />
              </Grid>
              <Grid item lg={4} md={12} sm={12} xs={12}>
                <CardCorrection
                  data={listeExam}
                  token={token}
                  handleUpdate={handleUpdate}
                />
              </Grid>
              <Grid item lg={4} md={12} sm={12} xs={12}>
                <Typography variant="button" display="block" gutterBottom>
                  Groupes
                </Typography>
                <Groupe data={module} token={token} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid sx={{ my: 2 }} container spacing={3}>
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item lg={8} md={8} sm={8} xs={12}></Grid>
              <Grid item lg={4} md={6} sm={6} xs={12}>
                <Grid container spacing={3}>
                  <Grid item sm={6} xs={12} md={6} lg={12}></Grid>
                  <Grid item sm={6} xs={12} md={6} lg={12}></Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

async function getRessources(token, module) {
  console.log("getRessources", module);
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
    ConfigData.SERVER_URL + "/ressources/" + module.id_module,
    requestOptions
  );
  if (!response.ok) {
    localStorage.removeItem("token");
    window.location.reload(false);
    console.log(response);
  }
  if (response.status == 401) {
    localStorage.removeItem("token");
    window.location.reload(false);
  }
  const result = await response.json();
  var data = [];
  result.forEach((element) => {
    console.log("element", element);
    data.push(element);
  });
  return data;
}

async function getCorrection(token, module) {
  console.log("getRessources", module);
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
    ConfigData.SERVER_URL + "/ressource/evaluation/" + module.id_module,
    requestOptions
  );
  if (!response.ok) {
    localStorage.removeItem("token");
    window.location.reload(false);
    console.log(response);
  }
  if (response.status == 401) {
    localStorage.removeItem("token");
    window.location.reload(false);
  }
  const result = await response.json();

  return result;
}

export default function AdminContent({ module, token, type }) {
  console.log("GetModuleAdmin");
  const [listRessource, setListRessource] = React.useState();
  const [listeExam, setListExam] = React.useState();
  const [updater, setUpdate] = React.useState(0);

  useEffect(() => {
    async function load() {
      if (module != undefined) {
        console.log("Module", module);
        var res = await getRessources(token, module);
        setListRessource(res);
        var ex = await getCorrection(token, module);
        setListExam(ex);
      }
    }
    load();
  }, [module]);

  const handleUpdate = () => {
    console.log("update adin key");
    setUpdate((oldKey) => oldKey + 1);
  };
  if (module != undefined && listRessource != undefined) {
    return (
      <GetModuleAdmin
        module={module}
        token={token}
        listRessource={listRessource}
        listeExam={listeExam}
        handleUpdate={handleUpdate}
      />
    );
  }

  return (
    <>
      <h1>Administration</h1>
    </>
  );
}
