import React, { useState } from "react";
import { useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import People from "@mui/icons-material/People";
import PermMedia from "@mui/icons-material/PermMedia";
import Dns from "@mui/icons-material/Dns";
import ListItemButton from "@mui/material/ListItemButton";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import TextField from "@mui/material/TextField";
import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import InputAdornment from "@mui/material/InputAdornment";
import ConfigData from "../../../../../utils/configuration.json";

async function uploadFile(name, file, token) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("name", name);

  const requestOptions = {
    method: "POST",
    mode: "cors",
    headers: {
      "x-access-token": token.token,
    },
    body: formData,
  };

  const response = await fetch(
    ConfigData.SERVER_URL + "/uploader",
    requestOptions
  );
  //console.log(response);
  if (!response.ok) {
    //console.log(response);
  }
  if (response.status == 401) {
    localStorage.removeItem("token");
    window.location.reload(false);
  }
  const result = await response.json();
  return result.path;
}

function GetIndice({ data, id, open, anchorEl, handleClose, handleClick }) {
  if (data.indice == undefined || data.indice == "") return <></>;
  return (
    <>
      <Button
        sx={{ my: 2, "margin-left": "10px" }}
        aria-describedby={id}
        variant="outlined"
        onClick={handleClick}
      >
        Indice
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
      >
        <Typography sx={{ p: 2 }}>{data.indice}</Typography>
      </Popover>
    </>
  );
}

function GetCorrection({ data, correction }) {
  if (!correction) return <></>;

  return (
    <>
      <Button sx={{ my: 2, "margin-left": "10px" }} variant="outlined">
        Juste
      </Button>
      <Button sx={{ my: 2, "margin-left": "10px" }} variant="outlined">
        Faux
      </Button>
      <TextField
        sx={{ my: 2, "margin-left": "10px" }}
        placeholder="Note custom?"
        variant="standard"
        value={data.note}
      />
    </>
  );
}

export default function QuestionFileForm({
  data,
  handleChild,
  index,
  token,
  correction,
  autoCorrection,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedFile, setSelectedFile] = React.useState();
  const [isFile, setIsSelected] = React.useState(false);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const changeHandler = async (event) => {
    setSelectedFile(event.target.files[0]);
    setIsSelected(true);
    var rep = await uploadFile(
      "file-" + data.id + "-" + data.id_module,
      event.target.files[0],
      token
    );

    handleChild(data, index, "FILE", rep)(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box sx={{ p: 2.25, boxShadow: 1 }}>
        <Typography>
          {"Question N°:" + data.order} (Barem :{data.barem} / difficulté:
          {data.difficulte}){" "}
        </Typography>
        <Typography variant="button" gutterBottom>
          {data.question}{" "}
        </Typography>

        <Box>
          <Button
            disabled={correction}
            variant="outlined"
            component="label"
            onChange={changeHandler}
          >
            Choisir un fichier
            <input type="file" hidden />
          </Button>
          <Typography variant="button" gutterBottom>
            {" "}
            Fichier :{" "}
          </Typography>
          <Typography variant="button" display="inline" gutterBottom>
            {isFile ? selectedFile.name : ""}{" "}
            {isFile ? "(" + selectedFile.type + ")" : ""}{" "}
          </Typography>
        </Box>
        <Box>
          <Typography variant="button" gutterBottom>
            {" "}
            Format autorisés :{" "}
          </Typography>
          <Typography variant="caption" display="inline" gutterBottom>
            {data.formats}
          </Typography>
        </Box>
        <Box>
          <Typography variant="button" gutterBottom>
            {" "}
            Taille max :{" "}
          </Typography>
          <Typography variant="caption" display="inline" gutterBottom>
            {data.size}Mo
          </Typography>
        </Box>
        <GetIndice
          data={data}
          id={id}
          open={open}
          anchorEl={anchorEl}
          handleClose={handleClose}
          handleClick={handleClick}
        />
        <GetCorrection data={data} correction={correction} />

        <Box></Box>
      </Box>
    </>
  );
}
