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
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Container, Draggable } from 'react-smooth-dnd'
import DragHandleIcon from '@mui/icons-material/DragHandle';
import Alert from '@mui/material/Alert';


const commonStyles = {
  bgcolor: 'background.paper',
  border: 1,
  my: 1,
  p:2
}

const applyDrag = (arr, dragResult,handleChild, index,data,correction) => {
  if(correction)
    return arr
  console.log('drag', arr)
  const { removedIndex, addedIndex, payload } = dragResult
  if (removedIndex === null && addedIndex === null) return arr

  const result = [...arr]
  let itemToAdd = payload

  if (removedIndex !== null) {
    itemToAdd = result.splice(removedIndex, 1)[0]
  }

  if (addedIndex !== null) {
    result.splice(addedIndex, 0, itemToAdd)
  }
  console.log('resDrag', result)
  handleChild(data,index,"LIST",result)(null)
  return result
}



function GetAlert({data,essais,handleEssai,erreur}){
  console.log("getalert",data,data.essais,erreur)
  if(data.essais==undefined) return <></>

  if(!erreur){
    return <Alert severity="success">Bonne réponse</Alert>
  }
  if(data.essais == 0){
    var rep = data.reponse.split("§")
    var repS ="\n"
    rep.forEach(element => {
      repS+=' ['+element+"] "
    });
    console.log("---",rep,repS)
    return <Alert severity="error">Erreur. La réponse est :{repS}</Alert>
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
function GetCorrection({data,correction}){
  if(!correction) return <></>

  return (
    <>
    
    <Button sx={{ my: 2, "margin-left": "10px" }}   variant="outlined">
                    Juste
                  </Button>
                  <Button sx={{ my: 2, "margin-left": "10px" }}  variant="outlined">
                    Faux
                  </Button>
                  <TextField
                     sx={{ my: 2, "margin-left": "10px" }}
                      placeholder='Note custom?'
                      variant="standard"
                  />
                  </>
                  
  )
}

function GetIndice({data,id,open,anchorEl,handleClose, handleClick}){

  if(data.indice == undefined || data.indice=="") return <></>
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

export default function QuestionListForm ({data,handleChild, index,type, correction, autoCorrection}) {
  
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [showCorrection, setShowCorrection] = React.useState(false)
  const [autoC, setAutoCorrection] = React.useState(autoCorrection)
  const [essais, setEssais] = React.useState(3)
  const [erreur, setErreur] = React.useState(true)

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const [reponsesUser, setReponsesUser]= React.useState([]);


  
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
     
      setAutoCorrection(false)
    }
    var ok=true
    var rep = data.reponse.split('§')
    console.log('-----',rep,data.tabRep)
    if(rep.lenght == data.tabRep.lenght){
      rep.forEach((element,i) => {
        if(element != data.tabRep[i].data)
          ok=false
          
        });
      }
    if(!ok){
      if(data.essais > 0)
        delete data.reponseuser
      setErreur(true)
    }
    else{
      setErreur(false)
    }
  }

  useEffect(() => {
    
    var t = []
    data.tabChoix.forEach((element,i) => {
      t.push({id:i,data:element})
    });

    setReponsesUser(t)

    if(autoCorrection){
      if(data.essais == undefined)
        data.essais=3
    }

}, [data])



  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = param =>event=>{
    console.log(param,reponsesUser,event)
     
  }

    console.log("QuestionListForm",data)
    return(
        <>
        {console.log("QuestionListForm",data)}
        <Box sx={{  p: 2.25, boxShadow: 1 }}>
         
                  <Typography >{"Question N°:"+data.order} (Barem :{data.barem} / difficulté:{data.difficulte}) </Typography> 
                  <Typography variant='button' gutterBottom>{data.question} </Typography> 
                  <Container
                    lockAxis='y'
                    onDrop={e => setReponsesUser(applyDrag(reponsesUser, e, handleChild, index,data,correction))}
                  > 

                    {reponsesUser.map((rep, index) => (
                      <Draggable key={rep.id}>
                      <Box sx={{ ...commonStyles, borderColor: 'grey.500' }}>
                          <Typography variant='button' gutterBottom>{reponsesUser[index].data}  <DragHandleIcon  sx={{float:"right"}} /></Typography>
                          {
                            correction?<Typography variant='button' gutterBottom color={data.reponseuser.split("§")[index]==data.reponse.split("§")[index]?"green":"red"}>{data.reponse.split("§")[index]} </Typography>:<></>
                          }
                      </Box>
                      </Draggable>
                    ))

                    }
                  
                  
                  </Container>
                              
                  <GetIndice data={data} id={id} open={open} anchorEl={anchorEl} handleClose={handleClose} handleClick={handleClick} />
                  <GetCorrection data={data} correction={correction} />
                  <GetAutoCorrection showCorrection={showCorrection} data={data} essais={essais} correction={correction} handleShowCorrection={handleShowCorrection} autoCorrection={autoC} index={index}   />
                  <GetAlert data={data} essais={essais} handleEssai={handleEssai} erreur={erreur}/>
                

                  
                
                <Box>
                     
                
                 
                  </Box>
            
                  
         
             
        </Box>
        </>
    )

}