import * as React from "react";
import { useEffect } from "react";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import { Avatar, Typography, Divider } from "@mui/material";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import CardRessource from "./module/cardressource";
import ModalRessource from "./module/modalressource";
import CardActivity from "./module/cardactivity";
import Ranking from "./module/ranking";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import ConfigData from "../../../utils/configuration.json";
import ListItemIcon from "@mui/material/ListItemIcon";

function getDate(d) {
  if (d == 0) return <span>&#8734;</span>;
  var a = new Date(d * 1000);
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Avr",
    "Mai",
    "Jui",
    "Juil",
    "Aou",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + " " + month + " " + year;
  return time;
}

async function getModules(token) {
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
    ConfigData.SERVER_URL + "/mesmodules",
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
  result.modules.forEach((element) => {
    //console.log("element", element);
    if (element.id_owner == token.id) {
      var item = {
        label: element.name,
        open: true,
        id_formation: element.id_formation,
        id_module: element.id,
      };
    } else {
      var item = {
        label: element.name,
        open: true,
        id_formation: element.id_formation,
        id_module: element.id,
        intro: element.intro,
      };
    }
    data.push(item);
  });
  return data;
}

async function getDevoir(token) {
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
    ConfigData.SERVER_URL + "/mesdevoirs",
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
  //console.log("getDevoir", result);
  return result;
}

function getOpen(ressource) {
  var today = Math.round(new Date().getTime() / 1000);
  //console.log(
    "getOpen",
    ressource,
    today,
    today >= ressource.dateO,
    today <= ressource.dateF + 24 * 3600
  );

  return (
    (today <= ressource.dateF + 24 * 3600 && today >= ressource.dateO) ||
    ressource.dateO == 0
  );
}

async function getExam(token) {
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
    ConfigData.SERVER_URL + "/mesexams",
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
  //console.log("getExam", result);
  return result;
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function GetDivider({ index, size }) {
  //console.log("Div", index, size);
  if (index == size) return <></>;
  return <Divider />;
}

export default function DashboardUser({ token }) {
  const [modules, setModules] = React.useState([]);
  const [devoirs, setDevoirs] = React.useState();
  const [exam, setExam] = React.useState();
  const [ressource, setRessource] = React.useState({ titre: "" });
  const [updater, setUpdater] = React.useState(0);
  const [openModal, setOpenModal] = React.useState(false);

  useEffect(() => {
    async function load() {
      setModules(await getModules(token));
      setDevoirs(await getDevoir(token));
      setExam(await getExam(token));
    }
    load();
  }, [updater]);

  const handleUpdater = () => {
    //console.log("update dash");
    setUpdater((oldKey) => oldKey + 1);
  };

  const closeModal = () => {
    //console.log("close dash");
  };

  const handleRessource = (p) => (e) => {
    //console.log("update dash", p);

    setRessource(p);
    setOpenModal(true);
    setUpdater((oldKey) => oldKey + 1);
  };
  if (modules.length == 0) return <></>;

  return (
    <>
      <h1>Tableau de bord</h1>
      <Box sx={{ width: "100%" }}>
        <Stack spacing={2}>
          {modules.map((module, i) => (
            <Item>
              <Typography
                align="left"
                variant="button"
                display="block"
                gutterBottom
              >
                Module - {module.label}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <Ranking
                    data={module}
                    token={token}
                    limit={3}
                    handleUpdater={handleUpdater}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <CardActivity data={module} token={token} limit={3} />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={2}>
                  <Item>
                    <List
                      sx={{ width: "100%", bgcolor: "background.paper" }}
                      subheader={
                        <ListSubheader
                          component="div"
                          id="nested-list-subheader"
                        >
                          Devoirs
                        </ListSubheader>
                      }
                    >
                      {devoirs == undefined ? (
                        <></>
                      ) : (
                        devoirs[module.id_module]
                          .slice(0, 1)
                          .map((devoir, i) => (
                            <Box>
                              <ListItemButton
                                onClick={handleRessource(devoir)}
                                disabled={
                                  !(
                                    (devoir.dateO <
                                      new Date().getTime() / 1000 &&
                                      devoir.dateF >
                                        new Date().getTime() / 1000) ||
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
                              <GetDivider
                                index={i + 1}
                                size={
                                  devoirs[module.id_module].slice(0, 5).length
                                }
                              />
                            </Box>
                          ))
                      )}
                    </List>
                  </Item>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={2}>
                  <Item>
                    <List
                      sx={{ width: "100%", bgcolor: "background.paper" }}
                      subheader={
                        <ListSubheader
                          component="div"
                          id="nested-list-subheader"
                        >
                          Exam
                        </ListSubheader>
                      }
                    >
                      {exam == undefined ? (
                        <></>
                      ) : (
                        exam[module.id_module].slice(0, 1).map((devoir, i) => (
                          <Box>
                            <ListItemButton
                              onClick={handleRessource(devoir.ressource)}
                              disabled={!getOpen(devoir.ressource)}
                              alignItems="flex-start"
                            >
                              <ListItemIcon>
                                <HomeWorkIcon />
                              </ListItemIcon>
                              <ListItemText
                                primary={devoir.ressource.titre}
                                secondary={
                                  <React.Fragment>
                                    <Typography
                                      sx={{ display: "inline" }}
                                      component="span"
                                      variant="body2"
                                      color="text.primary"
                                    >
                                      {getDate(devoir.ressource.dateF)}
                                    </Typography>{" "}
                                  </React.Fragment>
                                }
                              />
                            </ListItemButton>
                            <GetDivider
                              index={i + 1}
                              size={
                                devoirs[module.id_module].slice(0, 1).length
                              }
                            />
                          </Box>
                        ))
                      )}
                    </List>
                  </Item>
                </Grid>
              </Grid>
            </Item>
          ))}
        </Stack>
      </Box>

      <ModalRessource
        openP={openModal}
        data={ressource}
        updater={updater}
        token={token}
        handleClose={closeModal}
      />
    </>
  );
}
