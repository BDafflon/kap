import React, { useState } from "react";
import { useEffect } from "react";
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
  Divider,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PropType from "prop-types";
import ConfigData from "../../../../utils/configuration.json";
import * as ModuleUtile from "../../../../utils/moduleutile";
import getDate from "../../../../utils/timestamptodate";
import CardWrapper from "./cardwrapper";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { styled } from "@mui/material/styles";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ImageIcon from "@mui/icons-material/Image";
import WorkIcon from "@mui/icons-material/Work";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import CardRessource from "./cardressource";
import Paper from "@mui/material/Paper";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import CardActivity from "./cardactivity";
import Stack from "@mui/material/Stack";
import ListSubheader from "@mui/material/ListSubheader";
import ListItemButton from "@mui/material/ListItemButton";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import ListItemIcon from "@mui/material/ListItemIcon";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(3),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

async function getActivity(data, token) {
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
    ConfigData.SERVER_URL + "/ressources/stat/" + data.id_module + "/5",
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
  //console.log("getActivity", result);
  return result;
}

async function getNotes(data, token) {
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
    ConfigData.SERVER_URL + "/ressources/notes/" + data.id_module,
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
  //console.log("getNotes", result);
  return result;
}

async function getRessources(token, module) {
  //console.log("getRessources", module);
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
    //console.log(response);
  }
  if (response.status == 401) {
    localStorage.removeItem("token");
    window.location.reload(false);
  }
  const result = await response.json();
  var data = [];
  result.forEach((element) => {
    //console.log("element", element);
    data.push(element);
  });
  return data;
}

export default function Module({ module, token }) {
  //console.log("Module", module);
  const [ressource, setRessource] = React.useState([]);
  const [prochainDevoir, setDevoir] = React.useState([]);
  const [exam, setExam] = React.useState([]);
  const [devoirs, setDevoirs] = React.useState();

  const [intro, setIntro] = React.useState({
    type: "text",
    size: "l",
    label: "",
    titre: " ",
    data: "",
    icon: (
      <ArrowUpwardIcon
        fontSize="inherit"
        sx={{ transform: "rotate3d(0, 0, 1, 45deg)" }}
      />
    ),
  });
  useEffect(() => {
    async function load() {
      //console.log("Module", module);
      setIntro({
        type: "text",
        size: "l",
        label: module.intro,
        titre: "",
        data: "",
        icon: (
          <ArrowUpwardIcon
            fontSize="inherit"
            sx={{ transform: "rotate3d(0, 0, 1, 45deg)" }}
          />
        ),
      });
      var res = await getRessources(token, module);
      setRessource(res);
      var pDevoir = { data: undefined };
      var minD = 10000000;

      var pExam = { data: undefined };
      var minE = 10000000;

      res.forEach((element) => {
        if (element.type == 3) {
          var elapse = Date.now() - element.dateO;
          if (elapse > 0 && elapse < minD) {
            pDevoir = element;
            minD = elapse;
          }
        }

        if (element.type == 4) {
          var elapse = Date.now() - element.dateO;
          if (elapse > 0 && elapse < minE) {
            pExam = element;
            minE = elapse;
          }
        }
      });
      setDevoirs(await ModuleUtile.getDevoir(token));
      setExam(await ModuleUtile.getExam(token));

      var act = await getActivity(module, token);
      //console.log("act", act);
      var notes = await getNotes(module, token);
    }
    load();
  }, []);

  const handleUpdater = () => {
    console.log("module handleUpdater");
  };
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={8}>
          <CardWrapper data={intro} />
        </Grid>
        <Grid item xs={4}>
          <Stack spacing={3}>
            <List
              sx={{ width: "100%", bgcolor: "background.paper", boxShadow: 1 }}
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  Devoirs
                </ListSubheader>
              }
            >
              {devoirs == undefined ||
              devoirs[module.id_module] == undefined ? (
                <></>
              ) : (
                devoirs[module.id_module].slice(0, 1).map((devoir, i) => (
                  <Box>
                    <ListItemButton
                      disabled={
                        !(
                          (devoir.dateO < new Date().getTime() / 1000 &&
                            devoir.dateF > new Date().getTime() / 1000) ||
                          devoir.dateO == 0
                        )
                      }
                      alignItems="flex-start"
                    >
                      <ListItemIcon>
                        <HomeWorkIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={devoir.titre}
                        secondary={
                          <React.Fragment>
                            <Typography
                              sx={{ display: "inline" }}
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {getDate(devoir.dateF)}
                            </Typography>{" "}
                          </React.Fragment>
                        }
                      />
                    </ListItemButton>
                    <ModuleUtile.GetDivider
                      index={i + 1}
                      size={devoirs[module.id_module].slice(0, 5).length}
                    />
                  </Box>
                ))
              )}
            </List>

            <List
              sx={{ width: "100%", bgcolor: "background.paper", boxShadow: 1 }}
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  Exam
                </ListSubheader>
              }
            >
              {exam == undefined || exam[module.id_module] == undefined ? (
                <></>
              ) : (
                exam[module.id_module].slice(0, 1).map((ex, i) => (
                  <Box>
                    {console.log("ex", ex)}
                    <ListItemButton
                      disabled={!ModuleUtile.getOpen(ex.ressource)}
                      alignItems="flex-start"
                    >
                      <ListItemIcon>
                        <HomeWorkIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={ex.ressource.titre}
                        secondary={
                          <React.Fragment>
                            <Typography
                              sx={{ display: "inline" }}
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {getDate(ex.ressource.dateF)}
                            </Typography>{" "}
                          </React.Fragment>
                        }
                      />
                    </ListItemButton>
                    <ModuleUtile.GetDivider
                      index={i + 1}
                      size={exam[module.id_module].slice(0, 5).length}
                    />
                  </Box>
                ))
              )}
            </List>

            <CardRessource
              data={module}
              token={token}
              handleUpdater={handleUpdater}
            />

            <CardActivity data={module} token={token} />
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
