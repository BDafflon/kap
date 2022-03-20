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
import Alert from '@mui/material/Alert';




function GetAlert({data,essais,handleEssai,erreur}){
  console.log("getalert",data,data.essais,erreur)
  if(data.essais==undefined) return <></>

  if(!erreur){
    return <Alert severity="success">Bonne réponse</Alert>
  }
  if(data.essais == 0){
    
    return <Alert severity="error">Erreur. La réponse est :</Alert>
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

export default function QuestionQCMForm ({data,handleChild, index,type,correction, autoCorrection}) {
  
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const [reponsesPossible, setReponsesPossible]= React.useState([]);
  const [reponsesUser, setReponsesUser]= React.useState([]);

  const [showCorrection, setShowCorrection] = React.useState(false)
  const [autoC, setAutoCorrection] = React.useState(autoCorrection)
  const [essais, setEssais] = React.useState(3)
  const [erreur, setErreur] = React.useState(true)


  useEffect(() => {
    
    setReponsesPossible(data.choix.split("§"))
    var t = []
    data.choix.split(";").forEach(element => {
      t.push(false)
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
    console.log(param,reponsesUser,event.target.checked)
    let items = [...reponsesUser];
    let item = {...items[param]};
    item = event.target.checked
    items[param] = item;
    setReponsesUser(items)
    handleChild(data,index,"QCM",param)(event)


 
  }

  
  const handleEssai=(val)=>{
    setEssais(val)
  }
  
  const handleShowCorrection = () =>{
    if(showCorrection==false){
      setShowCorrection(!showCorrection)
    }
   

    if(data.essais <=0){
      
      setAutoCorrection(false)
    }
    var ok=true
    var rep = data.reponse.split('§')
    var RepUser =[]
    data.tabRep.forEach((element,i) => {
      if(element)
        RepUser.push(data.tabChoix[i])
    });
    
    console.log("--------",RepUser,rep,RepUser.length,rep.length)
    if(RepUser.length==rep.length)
    {
      const filteredArray = RepUser.filter(value => rep.includes(value));
      console.log("-------->",RepUser,rep,filteredArray)
      if(filteredArray.length==rep.length)
        ok=true
      else
        ok=false
    }
    else{
      ok=false
    }
    
    
    if(!ok){
      setEssais(essais-1)
      data.essais=data.essais-1
      if(data.essais > 0)
        delete data.reponseuser
      setErreur(true)
    }
    else{
      setErreur(false)
    }
  }


    console.log("QuestionQCMForm",data)
    return(
        <>
        {console.log("QuestionRapideForm",data)}
        <Box sx={{  p: 2.25, boxShadow: 1 }}>
         
                  <Typography >{"Question N°:"+data.order} (Barem :{data.barem} / difficulté:{data.difficulte}) </Typography> 
                  <Typography variant='button' gutterBottom >{data.question} </Typography> 
                  <FormGroup>

                    {reponsesPossible.map((rep, index) => (
                     
                      <FormControlLabel   control={<Checkbox   checked={correction?data.reponseuser.split('§')[index]==1:reponsesUser[index]==true} onChange={handleChange(index)}    />}  label={rep} color={correction?data.reponseuser.split('§')[index]==data.tabRep[index]?"success":"error":"default"} />
                    ))

                    }
                  
                  
                </FormGroup>
                              
                  <GetIndice data={data} id={id} open={open} anchorEl={anchorEl} handleClose={handleClose} handleClick={handleClick} />
                  <GetCorrection data={data} correction={correction} handleChild={handleChild} index={index}   />
                  <GetAutoCorrection showCorrection={showCorrection} data={data} essais={essais} correction={correction} handleShowCorrection={handleShowCorrection} autoCorrection={autoC} index={index}   />
                  <GetAlert data={data} essais={essais} handleEssai={handleEssai} erreur={erreur}/>
                
                
                <Box>
                     
                
                 
                  </Box>
            
                  
         
             
        </Box>
        </>
    )

}