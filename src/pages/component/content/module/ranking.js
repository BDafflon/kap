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
import ConfigData from "../../../../utils/configuration.json";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import IconButton from "@mui/material/IconButton";
import { green, yellow, grey } from "@mui/material/colors";
import ListItemIcon from "@mui/material/ListItemIcon";

function GetReward(props) {
  var index = props.index + 1;
  console.log("GetReward", index);
  if (index > 3) return <Avatar>{index}</Avatar>;

  var colorReward = grey[900];

  if (index == 3) colorReward = yellow[900];
  if (index == 2) colorReward = grey[200];
  if (index == 1) colorReward = yellow[400];

  return <EmojiEventsIcon sx={{ color: colorReward }} />;
}

async function getRank(module, token, limit) {
  if (limit == undefined) limit = 5;
  console.log("getRank", module, limit);
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
    ConfigData.SERVER_URL + "/rank/" + module.id_module,
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
  console.log("getRank res", result);
  if (result.index < limit) {
    data = result.data.slice(0, limit);
  } else {
    data = result.data.slice(0, limit - 2);
    data.push({
      "auto-eval": "",
      eval: "",
      rank: "",
      user: { firstname: "...", lastname: "..." },
    });
    data.push(result.data[result.index]);
  }

  return data;
}

function GetDivider({ index, size }) {
  console.log("Div", index, size);
  if (index == size) return <></>;
  return <Divider />;
}

export default function Ranking({ data, token, limit, handleUpdater }) {
  const [listRank, setRank] = React.useState([]);
  const [updater, setUpdater] = React.useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (data != undefined) {
        console.log("data", data);
        var rep = await getRank(data, token, limit);
        setRank(rep);
      }
    };

    fetchData();
  }, [data, updater]);

  return (
    <>
      <Box sx={{ boxShadow: 1 }}>
        <List
          sx={{ width: "100%", bgcolor: "background.paper" }}
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Classement
            </ListSubheader>
          }
        >
          {listRank.map((item, index) => (
            <Box>
              <ListItemButton>
                <ListItemIcon>
                  <GetReward index={index} />
                </ListItemIcon>
                <ListItemText
                  primary={item.user.firstname + " " + item.user.lastname}
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: "inline", fontWeight: 800 }}
                        component="span"
                        variant="button"
                        display="block"
                        gutterBottom
                      >
                        {item.eval + item["auto-eval"]}
                      </Typography>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {" [Evaluation: " +
                          item.eval +
                          " / Auto-Evaluation: " +
                          item["auto-eval"] +
                          "]"}
                      </Typography>{" "}
                    </React.Fragment>
                  }
                />
              </ListItemButton>
              <GetDivider index={index + 1} size={listRank.length} />
            </Box>
          ))}
        </List>
      </Box>
    </>
  );
}
