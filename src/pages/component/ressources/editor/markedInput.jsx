import React, { useContext } from "react";
import editorContext from "./editor";
import Box from "@mui/material/Box";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import DragAndDrop from "./drag";
import useToken from "../../../../utils/useToken";
import ConfigData from "../../../../utils/configuration.json";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useEffect } from 'react'


const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

async function upload(file, token, handle, name) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("name", name);

  const requestOptions = {
    method: "POST",
    mode: "cors",
    headers: {
      "x-access-token": token,
    },
    body: formData,
  };

  const response = await fetch(
    ConfigData.SERVER_URL + "/uploader",
    requestOptions
  );
  console.log(response);
  if (!response.ok) {
    console.log(response);
  }
  if (response.status == 401) {
    localStorage.removeItem("token");
    window.location.reload(false);
  }
  const result = await response.json();
  handle(true);

  if (result.type.includes("image")) {
    return "![name](" + ConfigData.SERVER_URL + result.path + ")";
  }
  return "[name](" + ConfigData.SERVER_URL + result.path + ")";
}

export function MarkedInput(props) {
 
  const token = props.token;
  const { setMarkdownText } = useContext(editorContext);
  const { markdownText } = useContext(editorContext);
  const [nameRessource, setNameRessource] = React.useState("");

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const onInputChange = (e) => {
    const newValue = e.currentTarget.value;
    setMarkdownText(newValue);
  };

  const handleChange = (event) => {
    setNameRessource(event.target.value);
  };
  
  const handleDrop = async (files, e) => {
    for (var i = 0; i < files.length; i++) {
      if (!files[i].name) return;

      let f = await upload(files[i], token, props.handle, nameRessource);

      setMarkdownText(markdownText + f);
    }
  };

  useEffect(() => {
    setMarkdownText(props.content)
  }, []);

  return (
    <Box>
      <React.Fragment>
        <Modal
          hideBackdrop
          open={open}
          onClose={handleClose}
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
        >
          <Box sx={{ ...style, width: 400 }}>
            <h2 id="child-modal-title">Media</h2>
            <p id="child-modal-description">
              <TextField
                fullWidth
                value={nameRessource}
                id="standard-basic"
                label="Titre"
                variant="standard"
                onChange={handleChange}
              />
            </p>
            <Button onClick={handleClose}>Valider</Button>
          </Box>
        </Modal>
      </React.Fragment>
      <DragAndDrop handleDrop={handleDrop}>
        <TextareaAutosize
          value={markdownText}
          onFocus={props.handleLastFocus("markdownText")}
          style={{ width: "100%", height: props.size }}
          onChange={onInputChange}
        />
      </DragAndDrop>
    </Box>
  );
}
