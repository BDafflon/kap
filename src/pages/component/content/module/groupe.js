import { useEffect } from "react";
import * as React from "react";
// material-ui
import { Avatar, Divider, Typography, Box, Button } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from "@mui/icons-material/Delete";
import TextareaAutosize from "@mui/material/TextareaAutosize";
// project imports
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import { green } from "@mui/material/colors";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import ConfigData from "../../../../utils/configuration.json";
import GroupAddRoundedIcon from "@mui/icons-material/GroupAddRounded";
import CastForEducationIcon from "@mui/icons-material/CastForEducation";

import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import InputLabel from "@mui/material/InputLabel";
import io from "socket.io-client";

async function generateCode(token, groupeSelected) {
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
    ConfigData.SERVER_URL + "/groupe/code/" + groupeSelected.id,
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

async function deleteCodeGroupe(token, groupeSelected) {
  const requestOptions = {
    method: "DELETE",
    mode: "cors",
    headers: {
      "x-access-token": token.token,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  const response = await fetch(
    ConfigData.SERVER_URL + "/groupe/code/" + groupeSelected.id,
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

function GetDivider({ index, size }) {
  //console.log("Div", index, size);
  if (index == size) return <></>;
  return <Divider />;
}

async function getGroupes(token, module) {
  return fetch(ConfigData.SERVER_URL + "/groupes/module/" + module.id_module, {
    method: "GET",
    mode: "cors",
    headers: {
      "x-access-token": token.token,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());
}

export default function Groupe({ data, token }) {
  const [listRessource, setList] = React.useState([]);
  const [openRessource, setOpen] = React.useState(false);
  const [ressource, setRessource] = React.useState({ titre: "" });
  const [openAlert, setOpenAlert] = React.useState(false);
  const [openColapse, setOpenColaps] = React.useState([]);
  const [openModalCodeGroupe, setOpenModalCodeGroupe] = React.useState(false);
  const [codeGroupe, setCodeGroupe] = React.useState("");
  const [groupeSelected, setDataGroupeSelected] = React.useState(null);

  useEffect(() => {
    if (data != undefined) {
      async function load() {
        var res = await getGroupes(token, data);
        //console.log("Groupe", res);
        setList(res);
      }

      load();
    }
  }, [data]);

  const handleAddGroupeCode = (item) => async () => {
    //console.log(item);
    setDataGroupeSelected(item);
    var code = await generateCode(token, item);
    setCodeGroupe(code);
    setOpenModalCodeGroupe(true);
  };

  const handleRessource = (param) => (e) => {
    //console.log("handleRessource", param);
    setRessource(param);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };
  const handleCloseCodeGroupe = async () => {
    await deleteCodeGroupe(token, groupeSelected);
    setOpenModalCodeGroupe(false);
  };

  const handleClickOpenAlert = () => {
    setOpenAlert(true);
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const handleCloseAndQuitAlert = () => {
    setOpenAlert(false);
    setOpen(false);
  };

  const handleClose = (event, reason) => {
    //console.log(reason);
    if ((reason && reason == "backdropClick") || reason == "escapeKeyDown")
      return;
    //console.log("data", ressource);
    if (ressource.type == 4) setOpenAlert(true);
    else setOpen(false);
  };

  return (
    <>
      {listRessource.map((item, index) => (
        <>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>{item.groupe.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List dense={true}>
                <ListItem>
                  <ListItemIcon>
                    <IconButton>
                      <FileDownloadIcon />
                    </IconButton>
                  </ListItemIcon>
                  <ListItemIcon>
                    <IconButton>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemIcon>
                  <ListItemIcon>
                    <IconButton onClick={handleAddGroupeCode(item.groupe)}>
                      <GroupAddRoundedIcon />
                    </IconButton>
                  </ListItemIcon>
                </ListItem>
                {item.users.map((i, j) => (
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        {i.note == null ? (
                          <FolderIcon />
                        ) : (
                          <Avatar sx={{ bgcolor: green[500] }}>{i.note}</Avatar>
                        )}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={i.firstname + " " + i.lastname} />
                    <ListItemIcon>
                      <IconButton>
                        <ZoomInIcon />
                      </IconButton>
                    </ListItemIcon>
                    <ListItemIcon>
                      <IconButton>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemIcon>
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        </>
      ))}

      <Dialog
        open={openModalCodeGroupe}
        onClose={handleCloseCodeGroupe}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Code d'affectation</DialogTitle>
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
              Entrer le code
              <Typography
                sx={{ fontSize: "0.975rem", fontWeight: "800" }}
                variant="button"
                display="block"
                gutterBottom
              >
                {codeGroupe}{" "}
              </Typography>
              dans "Mon Compte" / "Mes groupes"
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCodeGroupe}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
