import { useEffect } from 'react'
import * as React from 'react';
// material-ui
import { Avatar,Divider, Typography, Box, Button   } from '@mui/material';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import TextareaAutosize from '@mui/material/TextareaAutosize';
// project imports
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { green } from '@mui/material/colors';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import ConfigData from '../../../../../utils/configuration.json';
import GroupAddRoundedIcon from '@mui/icons-material/GroupAddRounded';
import CastForEducationIcon from '@mui/icons-material/CastForEducation';
import Grid from '@mui/material/Grid';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TimePicker from '@mui/lab/TimePicker';
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import InputLabel from '@mui/material/InputLabel'
import io from "socket.io-client";
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Alert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));



async function getCodeLive(module, token){
  const requestOptions = {
    method: 'GET',
    mode: 'cors',
    headers: {
      'x-access-token': token.token,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }
  const response = await fetch(
    ConfigData.SERVER_URL + '/live/'+module.id_module,
    requestOptions
  )
  if (!response.ok) {
    localStorage.removeItem('token')
    window.location.reload(false);
    console.log(response)
  }
  if (response.status == 401) {
    localStorage.removeItem('token')
    window.location.reload(false);
  }
  const result = await response.json()
  return result

}

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
charactersLength));
 }
 return result;
}
 
function GetErreur({erreur,erreurMsg}){
  if(erreur)
    return <Alert severity="error">{erreurMsg}</Alert>
  else
    return <></>
}
function GetForm({reponse,setReponse,question}){
  console.log("GetForm ",question)
  if(question.type==1){
  var options = question.option.split("§")

    return(
      <>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        value={reponse}
        onChange={(event) => {
          setReponse(event.target.value);
        }}
        fullWidth
         
      >
        {
          options.map((val,i)=>(
            <FormControlLabel value={val} control={<Radio />} label={val} />
          ))
        }
        
       
  
      </RadioGroup>
      </>
    )
  }
  else
  return(
  <TextareaAutosize
            aria-label="minimum height"
            minRows={3}
            value={reponse}
            placeholder="Reponse"
            style={{ width: "100%" }}
            onChange={(event) => {
                setReponse(event.target.value);
              }}
          />)
}

function  map(value, istart, istop, ostart, ostop){
    return ostart + (ostop - ostart) * ((value - istart) / (istop - istart))
}

 
export default function LiveUser({module,token}){
    const [questionList, setQList] = React.useState([])
    const [openLiveModal, setOpenLiveModal] = React.useState(false)
    const [streamID, setStreamID] = React.useState(makeid(5))
    const [socket , setSocket ] = React.useState(undefined)
    const [updater, setUpdater] = React.useState(0);
    const [option, setOption] = React.useState("");
    const [question, setQuestion] = React.useState();
    const [reponse, setReponse] = React.useState("");
    const [titre, setTitre] = React.useState("");
    const [erreur,setErreur] = React.useState(false)
    const [erreurMsg,setErreurMsg] = React.useState("")
    const [progress, setProgress] = React.useState(0);
    const [openModalCodeGroupe, setOpenModalCodeGroupe] = React.useState(false)
    const [sessions, setSession] = React.useState([])
    const [timerC, setTimer] = React.useState()


    useEffect(() => {
      setTimer(undefined)
      setQList([])
      setQuestion("")
      setReponse("")
      setErreur(false)
      setErreurMsg('')
      setProgress(0)

      if (socket == undefined){
        const sock =  io(ConfigData.SERVER_URL)
        sock.on('addQuestion', addQuestion); 
        sock.on('already', already); 
        setSocket(sock)
         
      }

      return(() => {
        
        clearInterval(timerC)
       
    })

      }, [module,updater]);

    
      const handleCloseCodeGroupe = async() => {
        setOpenModalCodeGroupe(false)
      }
 
      const handleCloseandJoin = () =>{
        setUpdater(updater+1)
        const sock =  io(ConfigData.SERVER_URL)
        sock.on('addQuestion', addQuestion); 
        sock.on('already', already); 
        setSocket(sock)

        console.log("join ",titre)
        socket.emit('join', {"name":"", "room":titre,"token":token,"module":module})
        setOpenModalCodeGroupe(false)
        setOpenLiveModal(true)

      }

    const handleSend =()=>{
        

        socket.emit('liveReponse',{"name":"", "room":titre,"token":token,"module":module,"question":question,"reponse":reponse})

    }

    const handleCloseLiveModal =()=>{
      console.log("close live")
      setOpenLiveModal(false)
      clearInterval(timerC);
      socket.disconnect()
    }
    
    const already=(e)=>{
      console.log("deja répondu")
      setErreur(true)
      setErreurMsg('Déja répondu')
    }
    const addQuestion=(e)=>{
      setProgress(0)
      
      setErreur(false)
      setQuestion(e)
      var t = questionList
      t.push(e)
      setQList([...t])
      console.log("question ",question,questionList)


      
       
      var t = setInterval(() => {
        
        setProgress((oldProgress) => {
          var e = questionList[questionList.length-1]
          console.log("map",Math.round(new Date().getTime()/1000),e.dateO,e.dateF,0,100)
          var x = parseFloat(map(Math.round(new Date().getTime()/1000),e.dateO,e.dateF,0,100))

          console.log("map",Math.round(new Date().getTime()/1000),e.dateO,e.dateF,0,100,"x",x)
          if(x>=100){
            console.log("Temps ecoulé ")
            setErreur(true)
            setErreurMsg("Temps ecoulé")
            console.log("--------------- clear ---------------")
            clearInterval(t);
          }
          return Math.min(x, 100);
        });
        console.log("progress ",progress)
        
      }, 1000);

      setTimer(t)


    }
   const handleStart =()=>{
    setUpdater(updater+1)
   
   }


      const handlLive = async()  => {
        var rep = await getCodeLive(module,token)
        console.log('live ',rep)
        setSession(rep)
        setOpenModalCodeGroupe(true)

      }
   
 

    return (

        <>
        
    <ListItemIcon>
            <IconButton onClick={handlLive}>
                <CastForEducationIcon />
            </IconButton>
        </ListItemIcon>

      <Dialog
        open={openLiveModal}
        onClose={handleCloseLiveModal}
        PaperProps={{
          sx: {
            maxHeight: '100vh'
          }
        }}
        maxWidth='xl'
        fullWidth={true}
      >
        <DialogTitle id="alert-dialog-title">
         Live session  {titre}
         
        </DialogTitle>
      
        <DialogContent dividers>
             
        <Grid container spacing={2}>
  <Grid item xs={4}>
    <Item>
    <DialogContentText id="alert-dialog-description">
          <Typography>Reponse :</Typography>
          <GetForm reponse={reponse} setReponse={setReponse} question={question}/>
          <GetErreur erreur={erreur} erreurMsg={erreurMsg} />
 
        <Box sx={{m:2}}>
          <Button variant="outlined" fullWidth onClick={handleSend} >Envoyer</Button>
          </Box>
          </DialogContentText>
    </Item>
  </Grid>
  <Grid item xs={8}>
    <Item>
    <Box sx={{ width: '100%' }}>
    {question!=undefined?<LinearProgress variant="determinate" value={progress} />:<></>}
      
    </Box>

      {question!=undefined?question.content:""}
       </Item>
  </Grid>
  </Grid>
          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLiveModal}>Fermer</Button>
        </DialogActions>
      </Dialog>


      <Dialog
        open={openModalCodeGroupe}
        onClose={handleCloseCodeGroupe}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Session live
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Box
            
            sx={{
              mx: 'auto',
              width: 400,
              p: 1,
              m: 1,
              bgcolor: (theme) =>
                theme.palette.mode === 'dark' ? '#101010' : 'grey.50',
              color: (theme) =>
                theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
              border: '1px solid',
              borderColor: (theme) =>
                theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
              borderRadius: 2,
              textAlign: 'center',
              fontSize: '0.875rem',
              fontWeight: '700',
            }}
            >
            Selectionner une session :  

            <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Session</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={titre}
          onChange={(event) => {
            setTitre(event.target.value);
          }}
          label="Session"
           
        >
         {
           sessions.map((i)=>(
            <MenuItem value={i.room}>{i.module.name} - {i.titre}</MenuItem>
           ))
         }
        </Select>
      </FormControl>

           
            </Box>
          </DialogContentText>
        </DialogContent>
        
        <DialogActions>
        <Button onClick={handleCloseandJoin}>Rejoindre</Button>

          <Button onClick={handleCloseCodeGroupe}>Fermer</Button>
        </DialogActions>
      </Dialog>

        </>
    )
}