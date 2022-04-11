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
import getDate from "../../../utils/timestamptodate";
import { useEffect } from "react";
import CardRessource from "./module/cardressource";
import CardCorrection from "./module/cardcorrection";
import Groupe from "./module/groupe";
import CastForEducationIcon from "@mui/icons-material/CastForEducation";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Live from "./module/live/live";
import DashboardAdmin from "./dashbordadmin";
import PanToolIcon from "@mui/icons-material/PanTool";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Autocomplete from "@mui/material/Autocomplete";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import FolderIcon from "@mui/icons-material/Folder";
import ListItem from "@mui/material/ListItem";
import Stack from '@mui/material/Stack';
import CoPresentIcon from '@mui/icons-material/CoPresent';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import LogoutIcon from '@mui/icons-material/Logout';

async function getGroupes(token, module) {
  var data = await fetch(ConfigData.SERVER_URL + "/groupes/module/" + module.id_module, {
    method: "GET",
    mode: "cors",
    headers: {
      "x-access-token": token.token,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());

  //console.log("data ", data);

  data.forEach((element) => {
    element.label = element.formation.name + " - " + element.groupe.name;
  });

  data.sort((a, b) =>
    a.label > b.label ? 1 : b.name > a.name ? -1 : 0
  );
  //console.log("data ", data);
  data.unshift({ label: "Tous", id: -1 });
  return data;
}

function getUser(id,users){
  
  var result = users.filter(obj => {
    return obj.id === id
  })
  //console.log('getUser',users,id,result)
  if(result.length == 0) return ""
  return result[0].label
}

async function getUsers(token) {
  var data = await fetch(ConfigData.SERVER_URL + "/users", {
    method: "GET",
    mode: "cors",
    headers: {
      "x-access-token": token.token,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());

  //console.log("data user", data);

  data.users.forEach((element) => {
    element.label = element.firstname + " - " + element.lastname;
    element.absence=0
  });

  data.users.sort((a, b) => (a.label > b.label ? 1 : b.name > a.name ? -1 : 0));
  //console.log("data ", data.users);
  data.users.unshift({ label: "Tous", id: -1 });
  return data.users;
}


export default function Call({ module, groupe, token }) {
  const [callOpen, setCallOpen]=React.useState(false)
  const [groupes, setGroupes]=React.useState(false)
  const [users, setUsers] = React.useState([]);
  const [usersSubList, setUserSubList] = React.useState([]);
  const [valueGroupe, setValueGroup] = React.useState();
  const [updater, setUpdater] = React.useState(0);
  const [user,setUser] = React.useState();
  const [motifOpen, setMotifOpen]=React.useState(false)

  useEffect(() => {
    async function load() {
        var res = await getGroupes(token, module);
        //console.log("Call", module);
        setGroupes(res);

        var x = await getUsers(token);
      setUsers(x);
      setUserSubList(x)
    
    }
    load();
  }, [module]);

  const handleClickOpen = () => {
    setCallOpen(true);
  };

  const handleClose = () => {
    setCallOpen(false);
  };

  const handleCloseMotif = () => {
    setMotifOpen(false);
  };

  const handleCloseAndValideMotif = () => {
    setMotifOpen(false);
  };

  const handleAbs=(user,absence)=>e=>{
    //console.log('handle abs',user,absence)
    var d = usersSubList
    d[user].absence = absence
    setUser(user)
    setUserSubList(d)
    setUpdater(updater+1)
    if(absence==2)
      setMotifOpen(true)
  }

  return (<>
  <ListItemIcon>
        <IconButton onClick={handleClickOpen}>
          <PanToolIcon />
        </IconButton>
      </ListItemIcon>

      <Dialog
        fullWidth 
        maxWidth="lg"
        open={callOpen}
        onClose={handleClose}
      >
        <DialogTitle>Gestion des absences</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Module  :{module.label} <br/>
            Date : {getDate(Math.round(new Date().getTime() / 1000))} <br />
            Prof : {getUser(token.id,users)}
          </DialogContentText>
          <Grid container spacing={2} sx={{my:2}}>
              <Grid item xs={12} md={6} lg={4}>
              <Stack spacing={2}>
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
                        .includes(newInputValue.groupe.id.toString())
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
                 if(newInputValue==null || newInputValue==undefined) {
                  setUserSubList(users)
                  return
                 }
                setUserSubList([newInputValue]);
                //console.log("setValueGroup", newInputValue);
              }}
              disablePortal
              id="combo-box-demo"
              options={usersSubList}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Etudiant" />}
            />
            </Stack>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                
<List dense sx={{width: "100%",
                        bgcolor: "background.paper",
                        position: "relative",
                        overflow: "auto",
                        maxHeight: 300,
                        minHeight:300,
                        "& ul": { padding: 0 }}}>
              {usersSubList.map((user, i) => (
                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <ListItemText primary={user.label} />
                  <ListItemIcon>
                  <IconButton onClick={handleAbs(i,0)} >
                    <CoPresentIcon color={user.absence!=0?"disabled":"primary"} />
                  </IconButton>
                  <IconButton  onClick={handleAbs(i,1)} >
                    < CancelPresentationIcon  color={user.absence!=1?"disabled":"error"} />
                  </IconButton>
                  <IconButton  onClick={handleAbs(i,2)} >
                    <LogoutIcon  color={user.absence!=2?"disabled":"error"}  />
                  </IconButton>
                </ListItemIcon>
                </ListItem>
              ))}
            </List>
              </Grid>
              </Grid>
          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Fermer</Button>
        </DialogActions>
      </Dialog>



      <Dialog open={motifOpen} onClose={handleCloseMotif}>
        <DialogTitle>Exclusion {usersSubList[user].label}</DialogTitle>
        <DialogContent>
          <DialogContentText>
             
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Motif"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAndValideMotif}>Valider</Button>
          <Button onClick={handleCloseMotif}>Fermer</Button>
        </DialogActions>
      </Dialog>

  </>);
}
