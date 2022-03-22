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
 

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

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
 
 
export default function LiveUser({module,token}){
    const [questionList, setQList] = React.useState([])
    const [openLiveModal, setOpenLiveModal] = React.useState(false)
    const [streamID, setStreamID] = React.useState(makeid(5))
    const [socket , setSocket ] = React.useState()
    const [timer, setTimer] = React.useState(new Date());
    const [option, setOption] = React.useState("");
    const [question, setQuestion] = React.useState("");
    const [reponse, setReponse] = React.useState("");
    const [titre, setTitre] = React.useState("");


    useEffect(() => {
      
      }, [module]);

    
 
 
    const handleSend =()=>{
        

        socket.emit('liveReponse',{"name":"", "room":titre,"token":token,"module":module,"question":question,"reponse":reponse})
    }

    const handleCloseLiveModal =()=>{
      setOpenLiveModal(false)
      socket.disconnect()
    }
    
    const already=(e)=>{
      console.log("deja répondu")
    }
    const addQuestion=(e)=>{
      
       
      setQuestion(e)
      var t = questionList
      t.push(e)
      setQList([...t])
      console.log("question ",question,questionList)
    }
   const handleStart =()=>{
    
    const sock =  io(ConfigData.SERVER_URL)
    sock.emit('join', {"name":"", "room":titre,"token":token,"module":module})
    sock.on('addQuestion', addQuestion); 
    sock.on('already', already); 
    
    setSocket(sock)
   }


      const handlLive = e => {
          
          setOpenLiveModal(true)

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
         Live session  
         <TextField id="standard-basic" label="ID?" variant="standard" sx={{width:"95%"}} 
          value={titre}
          onChange={(event) => {
            setTitre(event.target.value);
          }}
           />
           <Button variant="outlined"  onClick={handleStart} sx={{width:"10%"}}>Start</Button>
        </DialogTitle>
      
        <DialogContent dividers>
             
        <Grid container spacing={2}>
  <Grid item xs={4}>
    <Item>
    <DialogContentText id="alert-dialog-description">
          <Typography>Reponse :</Typography>
          <TextareaAutosize
            aria-label="minimum height"
            minRows={3}
            value={reponse}
            placeholder="Reponse"
            style={{ width: "100%" }}
            onChange={(event) => {
                setReponse(event.target.value);
              }}
          />
 
        <Box sx={{m:2}}>
          <Button variant="outlined" fullWidth onClick={handleSend} >Envoyer</Button>
          </Box>
          </DialogContentText>
    </Item>
  </Grid>
  <Grid item xs={8}>
    <Item>{question!=undefined?question.content:""} </Item>
  </Grid>
  </Grid>
          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLiveModal}>Fermer</Button>
        </DialogActions>
      </Dialog>
        </>
    )
}
