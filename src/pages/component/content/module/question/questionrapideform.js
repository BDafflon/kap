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
import Alert from '@mui/material/Alert';
 

function GetAlert({data,essais,handleEssai,erreur}){
  console.log("getalert",data,data.essais,erreur)
  if(data.essais==undefined) return <></>

  if(!erreur){
    return <Alert severity="success">Bonne réponse</Alert>
  }
  if(data.essais == 0){
    return <Alert severity="error">Erreur. La réponse est :{data.reponse}</Alert>
  }else{
    
    return <Alert severity="warning">Encore {data.essais} essai(s)</Alert>
  }

}
function GetAutoCorrection({showCorrection,data,correction,autoCorrection,handleShowCorrection,index,essais}){
  if(correction) return <></>
if(data.essais==0) return <></>
  
return(
  <>
  <Button sx={{ my: 2, "margin-left": "10px" }}    variant="outlined" color={data.barem==data.note?"success":"primary"} onClick={handleShowCorrection}>
                    {
                      showCorrection?essais==0?"Erreur":"Nouvel essai":"Valider"
                    }
                  </Button>
                 
                  </>
)
}

function GetCorrection({data,correction,handleChild,index}){
  if(!correction) return <></>

  return (
    <>
    <TextField
                  required={data.requis==1}
                  fullWidth
                  focused 
                  placeholder='Reponse?'
                  value={data.reponse}
                    id="input-with-icon-textfield"
                    label="Correction"
                    color="success" 
                    style={{"margin-top":6  , "margin-left": "10px", Width:"80%" }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PlaylistAddCheckIcon />
                        </InputAdornment>
                      ),
                    }}
                     
                  />  
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
function GetIndice({data,id,open,anchorEl,handleClose, handleClick, correction}){

  if(data.indice == undefined || data.indice=="" || correction) return <></>

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

export default function QuestionRapideForm ({data,handleChild, index, type, correction, autoCorrection}) {
  
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [showCorrection, setShowCorrection] = React.useState(false)
  const [autoC, setAutoCorrection] = React.useState(autoCorrection)
  const [essais, setEssais] = React.useState(3)
  const [erreur, setErreur] = React.useState(true)
   const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
 
  useEffect(() => {
    if(autoCorrection){
      if(data.essais == undefined)
        data.essais=3
    }
  })
  const handleEssai=(val)=>{
    setEssais(val)
  }
  
  const handleShowCorrection = () =>{
    if(showCorrection==false){
      setShowCorrection(!showCorrection)
    }
    setEssais(essais-1)
    data.essais=data.essais-1

    if(data.essais <=0){
      data.essais=0
      setAutoCorrection(false)
    }
    if(!data.reponseuser.includes(data.reponse)){
      if(data.essais > 0)
        delete data.reponseuser
      setErreur(true)
    }
    else{
      setErreur(false)
    }
      
    

  }
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };



    return(
        <>
        {console.log("QuestionRapideForm",data)}
        <Box sx={{  p: 2.25, boxShadow: 1 }}>
         
                  <Typography >{"Question N°:"+data.order} (Barem :{data.barem} / difficulté:{data.difficulte}) </Typography> 
                  <Typography variant='button' gutterBottom>{data.question} </Typography> 
                  <TextField
                  required={data.requis==1}
                  fullWidth
                  focused 
                   disabled={correction}
                  placeholder='Reponse?'
                  value={data.reponseuser}
                    id="input-with-icon-textfield"
                    label="Réponse?"
                    onChange={handleChild(data,index,"onchange","reponseuser")}
                    style={{"margin-left": "10px", Width:"80%" }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PlaylistAddCheckIcon />
                        </InputAdornment>
                      ),
                    }}
                    variant="standard"
                  />  
                  <GetIndice data={data} id={id} open={open} anchorEl={anchorEl} handleClose={handleClose} handleClick={handleClick} correction={correction}/>
                  <GetCorrection data={data} correction={correction} handleChild={handleChild} index={index}   />
                  <GetAutoCorrection showCorrection={showCorrection} data={data} essais={essais} correction={correction} handleShowCorrection={handleShowCorrection} autoCorrection={autoC} index={index}   />
                  <GetAlert data={data} essais={essais} handleEssai={handleEssai} erreur={erreur}/>
                
                <Box>
                     
                
                 
                  </Box>
            
                  
         
             
        </Box>
        </>
    )

}