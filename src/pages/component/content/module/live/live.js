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
import Checkbox from '@mui/material/Checkbox';
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
 
 
export default function Live({module,token}){
    const [currentQuestion, setCurrentQuestion] = React.useState({question:"",reponses:[]})
    const [questionList, setQuestionList] = React.useState([])
    const [openLiveModal, setOpenLiveModal] = React.useState(false)
    const [streamID, setStreamID] = React.useState(makeid(5))
    const [socket , setSocket ] = React.useState()
    const [timer, setTimer] = React.useState(new Date());
    const [option, setOption] = React.useState("");
    const [question, setQuestion] = React.useState("");
    const [titre, setTitre] = React.useState("");
    const [checked, setChecked] = React.useState(true);
    const [value, setValue] = React.useState(2);

    const handleChange = (event) => {
      setChecked(event.target.checked);
    };

    const handleChangeQCM = (event) => {
      setValue(event.target.value);
    };

    useEffect(() => {
        setStreamID(module.id_module+"-"+makeid(5))
      }, [module]);

    
 
    const addReponse=(e)=>{

        console.log(e,currentQuestion)
        if(currentQuestion.question==""){
          currentQuestion.question=e.question.content
          currentQuestion.type=e.question.type
          currentQuestion.option=e.question.option
          currentQuestion.reponses=[{reponse:e.content,user:e.user}]
          setCurrentQuestion({...currentQuestion});
        }else{
          currentQuestion.reponses.unshift({reponse:e.content,user:e.user})
          setCurrentQuestion({...currentQuestion});
        }
         
          
      
        console.log("addReponse",currentQuestion)
       

    }

    const handleSend =()=>{
        console.log("click ",timer,option,question)
        var datum = new Date;
        datum.setTime(timer);
        var seconds = datum.getSeconds();
        var minutes = datum.getMinutes();
        var hour = 0;
        var t = seconds+minutes*60+hour*3600
        
       
        console.log("click",currentQuestion,questionList)
        currentQuestion.question=""
        currentQuestion.reponses=[]
        setCurrentQuestion({...currentQuestion});
        socket.emit('liveQuestion',{"timer":t,"reponseunique":checked?1:0,"type":value,"option":option,"question":question,"token":token,"module":module,"room":streamID})
    }
    const handleCloseLiveModal =()=>{
      setOpenLiveModal(false)
      socket.disconnect()
    }
  
   const handleStart =()=>{
    console.log("live",module)
    setQuestionList([])
    var id = module.id_module+"-"+makeid(5)
    setStreamID(id)
    const sock =  io(ConfigData.SERVER_URL)
    sock.emit('join', {"name":"Prof", "room":id,"titre":titre,"token":token,"module":module})
    sock.on('addReponse', addReponse); 
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
         Live session [ID: {streamID}]
         <TextField id="standard-basic" label="Titre" variant="standard" sx={{width:"90%"}} 
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
          <Typography>Question :</Typography>
          <TextareaAutosize
            aria-label="minimum height"
            minRows={3}
            value={question}
            placeholder="Question"
            style={{ width: "100%" }}
            onChange={(event) => {
                setQuestion(event.target.value);
              }}
          />
          <Box style={{ width: "100%" }}s>
          <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        value={value}
        onChange={handleChangeQCM}
        fullWidth
         
      >
        <FormControlLabel value="1" control={<Radio />} label="QCM" />
        <FormControlLabel value="2" control={<Radio />} label="Occurrence" />
        <FormControlLabel value="3" control={<Radio />} label="Stream" />
        <FormControlLabel control={
            <Checkbox defaultChecked checked={checked}
                      onChange={handleChange} />
              } label="Reponse unique" />
      </RadioGroup>
      </Box>
      

        <TextField id="standard-basic" label="Option" variant="standard" fullWidth 
          value={option}
          onChange={(event) => {
            setOption(event.target.value);
          }}
           />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack spacing={3}>
        
        <TimePicker
          ampmInClock
          views={['minutes', 'seconds']}
          inputFormat="mm:ss"
          mask="__:__"
          label="Minutes and seconds"
          value={timer}
          onChange={(newValue) => {
            setTimer(newValue);
          }}
          renderInput={(params) => <TextField {...params} variant="standard" />}
        />
      </Stack>
    </LocalizationProvider>
        <Box sx={{m:2}}>
          <Button variant="outlined" fullWidth onClick={handleSend} >Envoyer</Button>
          </Box>
          </DialogContentText>
    </Item>
  </Grid>
  <Grid item xs={8}>
    <Item>xs=4</Item>
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
