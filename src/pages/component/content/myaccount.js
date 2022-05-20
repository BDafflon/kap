import React, { useState } from "react";
import { useEffect } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import {
  Avatar,
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
import ConfigData from "../../../utils/configuration.json";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from "@mui/icons-material/Delete";
// project imports
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import { green } from "@mui/material/colors";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import GroupAddRoundedIcon from "@mui/icons-material/GroupAddRounded";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import GroupIcon from "@mui/icons-material/Group";

async function affectationGroupe(token, code) {
  //console.log("affectationGroupe", code, token);
  const formData = new FormData();
  formData.append("code", code);

  const requestOptions = {
    method: "POST",
    mode: "cors",
    headers: {
      "x-access-token": token.token,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code: code }),
  };
  const response = await fetch(
    ConfigData.SERVER_URL + "/groupe/affectation",
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
}

async function registerUser(values) {
  const requestOptions = {
    method: "POST",
    mode: "cors",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(values),
  };
  fetch(ConfigData.SERVER_URL + "/user/registration", requestOptions).then(
    (response) => response.json()
  );
}

async function getFormation() {
  return fetch(ConfigData.SERVER_URL + "/formations", {
    method: "GET",
    mode: "cors",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());
}

async function getGroupes() {
  return fetch(ConfigData.SERVER_URL + "/groupes", {
    method: "GET",
    mode: "cors",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());
}

async function trashGroup(token, groupe) {
  //console.log("trashGroup", groupe, token);
  const formData = new FormData();
  formData.append("groupe", groupe);

  const requestOptions = {
    method: "POST",
    mode: "cors",
    headers: {
      "x-access-token": token.token,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ groupe: groupe }),
  };
  const response = await fetch(
    ConfigData.SERVER_URL + "/groupe/del",
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
  return response;
}

async function getUser(token) {
  //console.log("token ? ", token);
  return fetch(ConfigData.SERVER_URL + "/user", {
    method: "GET",
    mode: "cors",
    headers: {
      "x-access-token": token.token,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());
}

function filtreGroupe(groupes, idFormation) {
  let gr = [];
  groupes.forEach((element) => {
    if (element.id_formation == idFormation) gr.push(element);
  });
  return gr;
}

export default function MyAccount({ token, dashboardType }) {
  const [formations, setData] = useState([]);
  const [groupes, setGroupes] = useState([]);
  const [groupesFiltre, setGroupesFiltre] = React.useState([]);
  const [formationSelected, setFormationSelected] = React.useState([]);
  const [groupeSelected, setGroupeSelected] = React.useState([]);
  const [openGroupModal, setOpenGroupModal] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [user, setUser] = React.useState();
  const [updater, setUpdater] = React.useState(0);
   

  useEffect(() => {
    const getData = async () => {
      let response = await getFormation();
      //console.log("rep", response);
      setData(response["formations"]);

      response = await getGroupes();
      //console.log("rep", response);
      setGroupes(response["groupes"]);

      response = await getUser(token);

      //console.log("user", response);
      setUser(response);
    };
    getData();
  }, [dashboardType, updater]);

  const handleValideAndClose = async () => {
    await affectationGroupe(token, code);
    setCode("");
    setOpenGroupModal(false);
    setUpdater((oldKey) => oldKey + 1);
  };
  const handleClose = () => {
    setOpenGroupModal(false);
    setUpdater((oldKey) => oldKey + 1);
  };

  const handleTrashGroup = (groupe) => async (e) => {
    var x = await trashGroup(token, groupe);
    setUpdater((oldKey) => oldKey + 1);
  };
  const handleChangeCode = (event) => {
    const {
      target: { value },
    } = event;

    setCode(value);
  };

  const handleAddGroupe = () => {
    setOpenGroupModal(true);
  };

  const handleChangeAccount = (p) => (e) =>{
    console.log("handleChangeAccount",user,p,e)
    var u = user
    u[p]=e.target.value
    setUser({...u})
    
  }
  if(user==undefined) return <></>

  
  return (
    <>
      <h1>Mon compte</h1>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={6} lg={6}>
        <Box >
            <Typography color="textPrimary" variant="h4">
              Mes informations
            </Typography>
          </Box>
          <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6} lg={6}>
          <TextField

fullWidth 
              id="outlined-name"
              label="Prenom"
              value={user.firstname}
              onChange={handleChangeAccount("firstname")}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
          <TextField
          fullWidth
              id="outlined-name"
              label="Nom"
              value={user.lastname}
              onChange={handleChangeAccount("lastname")}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
          <TextField
          fullWidth
              id="outlined-name"
              label="Email"
              value={user.mail}
              onChange={handleChangeAccount("mail")}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6}>
          <TextField

fullWidth 
type="password"
              id="outlined-name"
              label="Mots de passe"
              value={user.password}
              onChange={handleChangeAccount("password")}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
          <TextField
          fullWidth
          type="password"
              id="outlined-name"
              label="Confirmation"
              value={user.password2}
              onChange={handleChangeAccount("password2")}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
          <Button variant="contained">Mise a jour</Button>
          </Grid>

          </Grid>
          
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <Box >
            <Typography color="textPrimary" variant="h4">
              Mes Groupes
              <IconButton component="span" onClick={handleAddGroupe}>
                <GroupAddRoundedIcon />
              </IconButton>
            </Typography>
          </Box>

          <List dense={true} sx={{ p: 2.25, boxShadow: 1 }}>
            {user == undefined ? (
              <></>
            ) : (
              user.groupes.map((groupe, j) => (
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <GroupIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={groupe.name} />

                  <ListItemIcon>
                    <IconButton onClick={handleTrashGroup(groupe)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemIcon>
                </ListItem>
              ))
            )}
          </List>
        </Grid>
      </Grid>

      <Dialog open={openGroupModal} onClose={handleClose}>
        <DialogTitle>Rejoindre un groupe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Entrer le code pour rejoindre un groupe
          </DialogContentText>
          <TextField
            autoFocus
            onChange={handleChangeCode}
            margin="dense"
            id="name"
            label="code"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button onClick={handleValideAndClose}>Rejoindre</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
