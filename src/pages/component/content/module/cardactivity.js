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
import ConfigData from "../../../../utils/configuration.json";
import TypeRessource from "../../../../utils/typeressources";
import { green, pink } from "@mui/material/colors";

// project imports

function getDate(d) {
  if (d == 0) return <span>&#8734;</span>;
  var a = new Date(d * 1000);
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
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

function GetDivider({ index, size }) {
  //console.log("Div", index, size);
  if (index == size) return <></>;
  return <Divider />;
}

async function getActivity(data, token, limit) {
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
    ConfigData.SERVER_URL + "/ressources/stat/" + data.id_module + "/50",
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
  if (limit != undefined) return result.slice(0, limit);
  return result;
}

export default function CardActivity({ data, token, limit }) {
  const [listActivity, setList] = React.useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (data != undefined) {
        //console.log("data", data);
        var rep = await getActivity(data, token, limit);
        setList(rep);
      }
    };

    fetchData();
  }, [data]);

  return (
    <>
      <Box sx={{ boxShadow: 1 }}>
        <List
          sx={{ width: "100%", bgcolor: "background.paper" }}
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Activité
            </ListSubheader>
          }
        >
          {listActivity.map((item, index) => (
            <Box>
              {//console.log(
                "item",
                item.eval == undefined ? "" : item.eval.note
              )}
              <ListItemButton alignItems="flex-start">
                <ListItemAvatar>
                  {item.eval == undefined ? (
                    <Avatar
                      alt={TypeRessource(item.type_ressource)}
                      src="/static/images/avatar/1.jpg"
                    />
                  ) : (
                    <Avatar
                      sx={{ bgcolor: green[500] }}
                      alt={item.eval.note + ""}
                      src="/static/images/avatar/1.jpg"
                    />
                  )}
                </ListItemAvatar>
                <ListItemText
                  primary={
                    "[" +
                    TypeRessource(item.type_ressource) +
                    "]: " +
                    item.titre
                  }
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        le {getDate(item.dateO)} :{" "}
                        {((item.dateF - item.dateO) / 60).toFixed(2)} min
                      </Typography>{" "}
                    </React.Fragment>
                  }
                />
              </ListItemButton>
              <GetDivider index={index + 1} size={listActivity.length} />
            </Box>
          ))}
        </List>
      </Box>
    </>
  );
}
