import FormControlLabel from '@mui/material/FormControlLabel';
import React, { useState } from 'react'
import { useEffect } from 'react'

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



export default function QuestionRapide (props) {
    //console.log("QuestionRapide",props)
    const [question , setQuestion] = React.useState(props.props.typeQuestion) 
    const [checked, setChecked] = React.useState(props.props.typeQuestion.Requis);
  

    const accordionProps = {
         
        expandIcon: (
          <ExpandMoreIcon
            sx={{
              pointerEvents: "auto"
            }}
          />
        )
      };

      const handleCheck = (val) => {
        //console.log(val)
        setChecked(val)
    }
      

      
   

      useEffect(() => {
          //console.log("useEffect QR",props)
            setQuestion(props.props.typeQuestion)
             
      }, [props.props.updatekey])
    
    return (
        <Accordion>
                  
                  <AccordionSummary
                  {...accordionProps}
                  
                   
                >
                  <Typography>{props.props.index+"# Question Rapide :"}</Typography> 
                  
                </AccordionSummary>
                <AccordionDetails>
                    <TextField
                 fullWidth
                    value={question.question}
                    placeholder='Question?'
                    id="input-with-icon-textfield"
                    label={"Question "+props.props.index}
                    onChange={props.props.handle(props.props.index,question,"onchange","question")}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <HelpOutlineIcon />
                        </InputAdornment>
                      ),
                    }}
                    variant="standard"
                  />
                <TextField
                  fullWidth
                  placeholder='Reponse?'
                  value={question.reponse}
                    id="input-with-icon-textfield"
                    label="Réponse?"
                    onChange={props.props.handle(props.props.index,question,"onchange","reponse")}
                    style={{"margin-left": "100px", Width:"80%" }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PlaylistAddCheckIcon />
                        </InputAdornment>
                      ),
                    }}
                    variant="standard"
                  />  
                  <TextField
                  fullWidth
                    id="input-with-icon-textfield"
                    label="Indice?"
                    placeholder='Indice?'
                    value={question.indice}
                    onChange={props.props.handle(props.props.index,question,"onchange","indice")}
                    style={{"margin-left": "100px", Width:"50%" }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <VisibilityIcon />
                        </InputAdornment>
                      ),
                    }}
                    variant="standard"
                  />  
                  <TextField
                  fullWidth
                  value={question.barem}
                    id="input-with-icon-textfield"
                    label="Barem  ?"
                    placeholder='Barem?'
                    style={{"margin-left": "100px", Width:"80%" }}
                    onChange={props.props.handle(props.props.index,question,"onchange","barem")}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <IsoIcon />
                        </InputAdornment>
                      ),
                    }}
                    variant="standard"
                  />  
                  <Box style={{"margin-left": "100px"  }} >
                  <Box
                      sx={{
                        width: 200,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                       <Box sx={{ mr: 2 }}>Difficlté</Box>
                      <Rating
                        name="text-feedback"
                        value={question.rating}
                        
                        onChange={props.props.handle(props.props.index,question,"onchange","rating")}
                        precision={0.5}
                         
                      />
                     <FormControlLabel sx={{ ml: 2 }}   control={<Checkbox checked={question.Requis} onChange={props.props.handle(props.props.index,question,"onchange","Requis",handleCheck)}/>} label="Requis" />
                     <Button sx={{ ml: 4 }}  startIcon={<DeleteIcon /> } onClick={props.props.handle(props.props.index,question,"sup","")}>
                        Supprimer
                        </Button>
                  </Box>
                  </Box>
                  
                </AccordionDetails>
                </Accordion>
    )

}