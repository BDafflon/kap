import React, { useState } from 'react'
import { useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import People from '@mui/icons-material/People'
import PermMedia from '@mui/icons-material/PermMedia'
import Dns from '@mui/icons-material/Dns'
import ListItemButton from '@mui/material/ListItemButton'
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown'
import TextField from '@mui/material/TextField'
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import InputAdornment from '@mui/material/InputAdornment';  
import TextareaAutosize from '@mui/material/TextareaAutosize';
import ReactMarkdown from "react-markdown";
import MarkdownPreview from '@uiw/react-markdown-preview';

function GetCorrection({data,correction,handleChild,index}){
  if(!correction) return <></>

  return (
    <>
    <TextareaAutosize  value={data.reponse} color="sucess" placeholder='Correction' fullWidth id="reponse" style={{ 'width': '100%', 'height':200}}  />
    <Button sx={{ my: 2, "margin-left": "10px" }}    variant="outlined" color={data.barem==data.note?"success":"primary"} onClick={handleChild(data,index,"note",data.barem)}>
                    Juste
                  </Button>
                  <Button sx={{ my: 2, "margin-left": "10px" }}  variant="outlined" color={0==data.note?"error":"primary"} onClick={handleChild(data,index,"note",0)}>
                    Faux
                  </Button>
                  <TextField
                     sx={{ my: 2, "margin-left": "10px" }}
                      placeholder='Note custom?'
                      variant="standard"
                      value={data.note}
                      onChange={handleChild(data,index,"update",0)}
                  />
                  </>
                  
  )
}

function GetIndice({data,id,open,anchorEl,handleClose, handleClick, correction, autoCorrection}){

  if(correction || data.indice == undefined || data.indice=="") return <></>
  return(<>
                <Button sx={{ my: 2, "margin-left": "10px" }} aria-describedby={id} variant="outlined" onClick={handleClick}>
                    Indice
                  </Button>
                  <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: 'center',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'center',
                      horizontal: 'left',
                    }}
                  >
                    <Typography sx={{ p: 2 }}>{data.indice}</Typography>
                  </Popover>
                  </>
  )

}

export default function QuestionLongueForm ({data,handleChild, index,type,correction}) {
  
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;



  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };



    return(
        <>
  
        <Box sx={{  p: 2.25, boxShadow: 1 }}>
         
                  <Typography >{"Question N°:"+data.order} (Barem :{data.barem} / difficulté:{data.difficulte}) </Typography> 
                  <MarkdownPreview  source={data.question}/>
                  <TextareaAutosize disabled={correction} value={data.reponseuser} placeholder='Reponse?' fullWidth required={data.requis==1} id="reponse" style={{ 'width': '100%', 'height':200}} onChange={handleChild(data,index,"onchange","reponseuser")} />
                  
                  <GetIndice data={data} id={id} open={open} anchorEl={anchorEl} handleClose={handleClose} handleClick={handleClick}  correction={correction} />
                  <GetCorrection data={data} correction={correction} handleChild={handleChild} index={index}   />
                  
                
                <Box>
                     
                
                 
                  </Box>
            
                  
         
             
        </Box>
        </>
    )

}