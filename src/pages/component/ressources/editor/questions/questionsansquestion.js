import FormControlLabel from '@mui/material/FormControlLabel';
import React, { useState } from 'react'
import { useEffect } from 'react'
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Checkbox from '@mui/material/Checkbox';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import { Container, Draggable } from 'react-smooth-dnd';
import ConfigData from '../../../../../utils/configuration.json';
import { Button } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InputAdornment from '@mui/material/InputAdornment';  
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import IsoIcon from '@mui/icons-material/Iso';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Rating from '@mui/material/Rating';
import DragAndDrop from "../drag";
import { eachDayOfInterval } from 'date-fns';



async function upload(file,token) {
  const formData = new FormData()
  formData.append('file', file)

  const requestOptions = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'x-access-token': token,
      
    },
    body:formData
  }

  const response = await fetch(ConfigData.SERVER_URL + '/uploader', requestOptions);

  if (!response.ok) {
    localStorage.removeItem('token')
    window.location.reload(false);
  }
  if(response.status==401){
    localStorage.removeItem('token')
    window.location.reload(false);
  }
  const result = await response.json()
  if(result.type.includes("image")){
    return "![img]("+ConfigData.SERVER_URL+result.path+")";
  }
  return "[Document]("+ConfigData.SERVER_URL+result.path+")";
}



 


export default function QuestionSansQuestion (props) {
    const [question , setQuestion] = React.useState(props.props.typeQuestion) 
    const [checked, setChecked] = React.useState(question.Requis);
    const [markdownText, setmarkdownText] = React.useState("Question ?");
 
    const accordionProps = {
         
        expandIcon: (
          <ExpandMoreIcon
            sx={{
              pointerEvents: "auto"
            }}
          />
        )
      };

      const updateMedia = (param,t) =>{
        if(t=="question")
            question.question=question.question+"\n"+param
          if(t=="reponse")
          question.reponse=question.reponse+"\n"+param
          setQuestion(question)
      
          props.props.handle(props.props.index,question,"upload","question")(null)
      }

      const handleDrop = async (files,e) => { 
    
        for (var i = 0; i < files.length; i++) {
          if (!files[i].name) return
          
          let f = await upload(files[i],props.props.token)
          if(e.target.id=="question")
            question.question=question.question+"\n"+f
          if(e.target.id=="reponse")
          question.reponse=question.reponse+"\n"+f
          setQuestion(question)
          console.log("handleDrop ",e.target.id)
          props.props.handle(props.props.index,question,"upload","question")(null)
          
          
        }
         
      } 

    
    return (
        <Accordion>
                  
                  <AccordionSummary
                  {...accordionProps}
                  
                   
                >
                  <Typography>{props.props.index+"# Texte :"}</Typography> 
                   
                </AccordionSummary>
                <AccordionDetails>
                <DragAndDrop handleDrop={handleDrop}  id="q">
                <TextareaAutosize onFocus={props.props.handleLastFocus([question,"question",updateMedia])} id="question" value={question.question} style={{ 'width': '100%', 'height':200}} onChange={props.props.handle(props.props.index,question,"onchange","question")} />
                </DragAndDrop>
                 
                  
                   
                  <Box style={{"margin-left": "100px"  }} >
                  <Box
                      sx={{
                        width: 200,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                       
                       
                      <Button sx={{ ml: 4 }}  startIcon={<DeleteIcon /> } onClick={props.props.handle(props.props.index,question,"sup","")}>
                        Supprimer
                        </Button>
                  </Box>
                  </Box>
                  
                </AccordionDetails>
                </Accordion>
    )

}