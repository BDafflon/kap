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
import LinearProgress from '@mui/material/LinearProgress';
import PropTypes from 'prop-types';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '90%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} sx={{height:15}}/>
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="button" color="text.secondary">{props.label}</Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and buffer variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};

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

 
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

 
function  map(value, istart, istop, ostart, ostop){
  return ostart + (ostop - ostart) * ((value - istart) / (istop - istart))
}

function GetReponseForm({index,item}){
  if(item == undefined){
    console.log("GetReponseForm undef")
    return <></>
  }
  console.log("GetReponseForm",item)
  let renderLabel = function(entry) {
    return entry.name;
}

 

  if(item.question=="")
    return <></>
   
    var data=[]
    // x 100
    // v total
    Object.keys(item.occurence).forEach(key => {
      var d = {name:key, value:item.occurence[key], normalizeValue:item.occurence[key]*100/item.reponses.length}
      data.push(d)
    });

    
  if(item.type==1){//QCM
    
    
    console.log("data",data)
    return (
      <>
      <Typography>Question {index}: {item.question}</Typography>
     
      <ResponsiveContainer width="99%" aspect={3}>
      <PieChart width={400} height={400}>
          <Pie
            dataKey="value"
            isAnimationActive={false}
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            label={renderLabel}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      </>
    )


  }
  if(item.type==2){
    if(data.length==0)
    return <Typography>Question {index}: {item.question}</Typography>

    data.sort(function(a, b) {
      return parseFloat(b.normalizeValue) - parseFloat(a.normalizeValue);
  });
  
    for(var i=0;i<data.length;i++){
      data[i].normalizeValue2=map(data[i].normalizeValue, 0, data[0].normalizeValue, 0, 100)
    }
    console.log(data)
    
     
    //x nb
    //y 100
    return(
      <>
      <Typography>Question {index}: {item.question}</Typography>
      {
        data.map((i)=>(
            <Box sx={{ width: '100%' }}>
            <LinearProgressWithLabel value={i.normalizeValue2} label={i.name} />
          </Box>
        ))
      }

      </>
    )

  }
  return <></>
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
    const [refreshKey, setRefreshKey] = React.useState(0)


    const handleChange = (event) => {
      setChecked(event.target.checked);
    };

    const handleChangeQCM = (event) => {
      setValue(event.target.value);
    };

    useEffect(() => {
      if(socket==undefined){      
        if(titre!=""){
        const sock =  io(ConfigData.SERVER_URL)
        sock.emit('join', {"name":"Prof", "room":streamID,"titre":titre,"token":token,"module":module})
        sock.on('addReponse', addReponse2); 
        setSocket(sock)
        console.log("start sock")
        }
      }

      }, [module,refreshKey]);

    
 
    const addReponse2=(e)=>{
       

        console.log("addReponse",e)
        console.log("addReponse list" ,currentQuestion, questionList)

        const newIds = questionList
        newIds[0].reponses.unshift({reponse:e.content,user:e.user})
        if(newIds[0].occurence[e.content]==undefined)
          newIds[0].occurence[e.content]=1
        else
          newIds[0].occurence[e.content]+=1

       setQuestionList(newIds)

       console.log("addReponse list" , questionList)
       setRefreshKey(oldKey => oldKey + 1)

    }
    const addReponse=(sta)=>(e)=>{
      console.log("addReponse list" ,currentQuestion, questionList,sta)
    }

    const handleSend =()=>{
        console.log("click ",timer,option,question)
        var datum = new Date;
        datum.setTime(timer);
        var seconds = datum.getSeconds();
        var minutes = datum.getMinutes();
        var hour = 0;
        var t = seconds+minutes*60+hour*3600
        
       
        console.log("click",questionList)
        var qc = {}
        

        qc.question=question
        qc.type=value
        qc.option=option
        qc.reponses=[]
        qc.occurence={}

   
         
        const data = questionList;
        data.unshift({...qc});
        setQuestionList(data);

       
        console.log("click2",questionList)
        socket.emit('liveQuestion',{"timer":t,"reponseunique":checked?1:0,"type":value,"option":option,"question":question,"token":token,"module":module,"room":streamID})
        console.log("click3",questionList)
        setCurrentQuestion({...qc})
        setRefreshKey(oldKey => oldKey + 1)
        addReponse(questionList)

      }
    const handleCloseLiveModal =()=>{
      setOpenLiveModal(false)
      setQuestionList([])
      setCurrentQuestion()
      socket.disconnect()
      setSocket(undefined)
    }
  
   const handleStart =()=>{
    console.log("live",module)
    setQuestionList([])
    setRefreshKey(oldKey => oldKey + 1)

     
    
   }
      const handlLive = e => {
        setStreamID(module.id_module+"-"+makeid(5))
          setOpenLiveModal(true)

      }
   
 
    console.log("questionListMap",questionList)
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
           {
             socket==undefined?<Button variant="outlined"  onClick={handleStart} sx={{width:"10%"}}>Start</Button>:<Button variant="outlined"  onClick={handleStart} sx={{width:"10%"}}>Stop</Button>
           }
           
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
    <Item>
    <Stack spacing={2}> 
    
    {
      
      questionList.map((item,index)=>(
       
        <Box>
            <GetReponseForm index={index} item={item}/>
        </Box>

      ))

    }
      
    </Stack>
    </Item>
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