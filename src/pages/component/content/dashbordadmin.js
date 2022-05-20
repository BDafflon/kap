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
import * as UserManager from "../../../utils/userManager";
import ListItemIcon from "@mui/material/ListItemIcon";
import PanToolIcon from "@mui/icons-material/PanTool";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { getOptionGroupUnstyledUtilityClass } from "@mui/base";
import FolderIcon from "@mui/icons-material/Folder";
import ListItem from "@mui/material/ListItem";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

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
  data.unshift({ label: "Tous", id: -1 });
  return data;
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

async function getGroupes(token) {
  var data = await fetch(ConfigData.SERVER_URL + "/groupes", {
    method: "GET",
    mode: "cors",
    headers: {
      "x-access-token": token.token,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());

  data.groupes.forEach((element) => {
    element.label = element.formation.name + " - " + element.name;
  });

  data.groupes.sort((a, b) =>
    a.label > b.label ? 1 : b.name > a.name ? -1 : 0
  );
  //console.log("data ", data.groupes);
  data.groupes.unshift({ label: "Tous", id: -1 });
  return data.groupes;
}

async function getFormations(token) {
  var data = await fetch(ConfigData.SERVER_URL + "/formations", {
    method: "GET",
    mode: "cors",
    headers: {
      "x-access-token": token.token,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());

  data.formations.forEach((element) => {
    element.label =  element.name;
  });

  data.formations.sort((a, b) =>
    a.label > b.label ? 1 : b.name > a.name ? -1 : 0
  );
  //console.log("data ", data.groupes);
  data.formations.unshift({ label: "Toutes", id: -1 });
  return data.formations;
}

async function getUser(token) {
  var data = await  UserManager.getAllUsers(token)
  //console.log("data user", data);

  data.forEach((element) => {
    element.label = element.firstname + " - " + element.lastname;
  });

  data.sort((a, b) => (a.label > b.label ? 1 : b.name > a.name ? -1 : 0));
  //console.log("data ", data.users);
  return data;
}

export default function DashboardAdmin({ token }) {
  const [modules, setModules] = React.useState([]);
  const [formations, setFormations ] = React.useState([]);
  const [groupes, setGroupe] = React.useState([]);
  const [updater, setUpdater] = React.useState(0);
  const [valueGroupe, setValueGroup] = React.useState();
  const [users, setUser] = React.useState([]);
  const [usersSubList, setUserSubList] = React.useState([]);
  const [modulesSubList, setModulesSubList] = React.useState([]);

  useEffect(() => {
    async function load() {
      setModules(await getModules(token));
      setGroupe(await getGroupes(token));
      setFormations(await getFormations(token));
      var x = await getUser(token);
      setUser(x);
      setUserSubList(x);
    }
    load();
  }, [updater]);

  const handleAdmin =  (p) =>  async(e) =>{
    console.log(p)
    var r = UserManager.switchRank(token,p)
    if (r!= undefined)
      setUpdater(updater+1)
  }
  const handleTrashUser =(p)=>async(e)=>{
    console.log(p)
    var r = UserManager.trashUser(token,p)
    if (r!= undefined)
      setUpdater(updater+1)
  }

  if (modules.length == 0) return <></>;
  if (token.rank != 0) return <></>;
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={6} lg={4}>
          <Stack spacing={2}>
            <Typography>
              Etudiants{" "}
            </Typography>

            <Autocomplete
              fullWidth
              onChange={(event, newInputValue) => {
                if (newInputValue == null) newInputValue = groupes[0];
                setValueGroup(newInputValue);
                if (newInputValue.id == -1) {
                  setUserSubList(users);
                  return;
                }
                var data = [];
                users.forEach((element) => {
                  if (element.groupe != null && element.groupe != undefined) {
                    if (
                      element.groupe
                        .split(";")
                        .includes(newInputValue.id.toString())
                    )
                      data.push(element);
                  }
                });
                setUserSubList(data);
                //console.log("setValueGroup", newInputValue.id, data);
              }}
              disablePortal
              id="combo-box-demo"
              options={groupes}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Groupe" />}
            />
            <Autocomplete
              fullWidth
              onChange={(event, newInputValue) => {
                
                if (newInputValue == null) {
                  setUserSubList(users);
                  return;
                }
                var data = [];
                usersSubList.forEach((element) => {
                  if (element.label != null && element.label != undefined) {
                    if (
                      element.label.includes(newInputValue.label)
                    )
                      data.push(element);
                  }
                });
                setUserSubList(data);
                //console.log("setValueGroup", newInputValue.id, data);
              }}
              disablePortal
              id="combo-box-demo"
              options={usersSubList}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Nom/Prenom" />}
            />
            <List dense>
              {usersSubList.map((user, i) => (
                <ListItem>
                  <ListItemIcon>
                    
                    <IconButton onClick={handleAdmin(user)}>
                      <AdminPanelSettingsIcon   color={user.rank==0?"success":"disabled"} />
                    </IconButton>
                     
                  </ListItemIcon>
                  <ListItemIcon>
                     
                    <IconButton onClick={handleTrashUser(user)}>
                      <DeleteForeverIcon />
                    </IconButton>
                  </ListItemIcon>
                  <ListItemText  primary={user.label} />
                  
                </ListItem>
              ))}
            </List>
          </Stack>
        </Grid>

        <Grid item xs={12} sm={12} md={6} lg={4}>
          <Stack spacing={2}>
            <Typography>Modules</Typography>
            <Autocomplete
              fullWidth
              onChange={(event, newInputValue) => {
                console.log(modules,newInputValue)
                if (newInputValue == null) newInputValue = modules[0];
                 
                if (newInputValue.id == -1) {
                  setModulesSubList(modules);
                  return;
                }
                var data = [];
                modules.forEach((element) => {
                  if (element.id_formation != null && element.id_formation != undefined) {
                     
                      data.push(element);
                  }
                });
                setModulesSubList(data);
                //console.log("setValueGroup", newInputValue.id, data);
              }}
              disablePortal
              id="combo-box-demo"
              options={formations}
              sx={{ width: 300 }}
              
              renderInput={(params) => (
                <TextField {...params} label="Formations" />
              )}
            />
            <List dense>
              {modulesSubList.map((module, i) => (
                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <ListItemText primary={module.label} />
                </ListItem>
              ))}
            </List>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}
