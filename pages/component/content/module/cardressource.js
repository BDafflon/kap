import { useEffect } from "react";
import * as React from "react";
// material-ui
import { Avatar, Divider, Box, Typography } from "@mui/material";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import RessourceView from "./ressourceview";
import ListSubheader from "@mui/material/ListSubheader";
// project imports
import TypeRessource from "../../../../utils/typeressources";
import * as ModuleUtile from "../../../../utils/moduleutile";
import ConfigData from "../../../../utils/configuration.json";
import ModalRessource from "./modalressource";

async function getRessources(module, token, limit) {
  //console.log("getRessources", module, limit);
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

  //console.log("getRe", result);
  result.forEach((element) => {
    data.push(element);
  });
  if (limit != undefined) return data.slice(0, limit);
  return data;
}

export default function CardRessource({ data, token, limit, handleUpdater }) {
  const [listRessource, setList] = React.useState([]);
  const [openRessource, setOpen] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [ressource, setRessource] = React.useState({ titre: "" });
  const [openAlert, setOpenAlert] = React.useState(false);
  const [updater, setUpdater] = React.useState(0);
  const [save, setSave] = React.useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (data != undefined) {
        //console.log("data", data);
        var rep = await getRessources(data, token, limit);
        setList(rep);
      }
    };

    fetchData();
  }, [data, updater]);

  const handleRessource = (param) => () => {
    //console.log("handleRessource", param);
    setRessource(param);
    //setOpen(true);
    setOpenModal(true);
    setUpdater((oldKey) => oldKey + 1);
  };

  const closeModal = (p) => (event, reason) => {
    console.log("close Modal ", p);
    if ((reason && reason == "backdropClick") || reason == "escapeKeyDown")
      return;

    setUpdater((oldKey) => oldKey + 1);
    handleUpdater(null);

    if (p == undefined || p == false) setOpenAlert(true);
    else setOpenModal(false);
  };

  return (
    <>
      <Box sx={{ boxShadow: 1 }}>
        <List
          sx={{ width: "100%", bgcolor: "background.paper" }}
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Ressource
            </ListSubheader>
          }
        >
          {listRessource.map((item, index) => (
            <Box>
              <ListItemButton
                disabled={!ModuleUtile.getOpen(item)}
                alignItems="flex-start"
                onClick={handleRessource(item)}
              >
                <ListItemAvatar>
                  <Avatar
                    alt={TypeRessource(item.type)}
                    src="/static/images/avatar/1.jpg"
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={"[" + TypeRessource(item.type) + "]: " + item.titre}
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        du {ModuleUtile.getDate(item)[0]} au {ModuleUtile.getDate(item)[1]}
                      </Typography>{" "}
                    </React.Fragment>
                  }
                />
              </ListItemButton>
              <ModuleUtile.GetDivider
                index={index + 1}
                size={listRessource.length}
              />
            </Box>
          ))}
        </List>
      </Box>

      <ModalRessource
        openP={openModal}
        data={ressource}
        updater={updater}
        token={token}
        save={save}
        closeModal={closeModal}
      />
    </>
  );
}
