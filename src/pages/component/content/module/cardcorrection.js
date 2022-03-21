import { useEffect } from 'react'
import * as React from 'react';
// material-ui
import { Avatar,Divider, Box, Typography } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import ListSubheader from '@mui/material/ListSubheader';
import { typography } from '@mui/system';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
// project imports
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { green, pink } from '@mui/material/colors';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CorrectionContent from './correctioncontent';

function getDate(d){
    if(d==0) return <span>&#8734;</span> 
    var date_not_formatted = new Date(d);

    var formatted_string = date_not_formatted.getFullYear() + "-";

    if (date_not_formatted.getMonth() < 9) {
    formatted_string += "0";
    }
    formatted_string += (date_not_formatted.getMonth() + 1);
    formatted_string += "-";

    if(date_not_formatted.getDate() < 10) {
    formatted_string += "0";
    }
    formatted_string += date_not_formatted.getDate(); 
    return formatted_string
}

function getType(type){
    if (type == 0) return 'CM'
    if (type == 1) return 'TD'
    if (type == 2) return 'TP'
    if (type == 3) return 'Devoir'
    if (type == 4) return 'Evaluation'
    if (type == 5) return 'Auto-Evaluation'
  
    return 'undefined'
}

function GetDivider({index, size}){
    console.log("Div",index, size)
    if(index == size) return <></>
    return <Divider/>
}

export default function CardCorrection({data,token,handleUpdate}){
    const [listRessource, setList] = React.useState([])
    const [openRessource, setOpen] = React.useState(false)
    const [ressource, setRessource] = React.useState({'titre':""})
    const [reponses ,setReponses]=React.useState({})
    const [openAlert, setOpenAlert] = React.useState(false);
    const [openColapse, setOpenColaps] = React.useState([]);
    const [indexCorrection, setIntexCorrection] = React.useState();
    const [updater, setUpdate] = React.useState(0);

    useEffect(() => {
      if(data != undefined){
        var d = []
        var c=[]
        Object.keys(data).forEach(e =>{
          console.log("Object",e,data[e]);
          d.push(data[e])
          c.push(false)
          
      })
      console.log("CardC",d)
      setList(d)
      setOpenColaps(c)
    }
      }, [data,updater]);

    const handleCorrection = (param,ressource,index) => e => {
        console.log("handleRessource", param,ressource)
        setRessource(ressource)
        setReponses(param)
        setIntexCorrection(index)
        setOpen(true);
    }

    const closeModal=()=>{
        setOpen(false);
    }

    const handleClickOpenAlert = () => {
        setOpenAlert(true);
      };
    
      const handleNextCorrection=()=>{
         
        console.log("handleNextCorrection",indexCorrection,listRessource[indexCorrection])
        var find=false
        var dossier=undefined
        for(var i=0;i<listRessource[indexCorrection].data.length && !find;i++){
          if(listRessource[indexCorrection].data[i].note==undefined){
            find=true
            dossier=listRessource[indexCorrection].data[i]
          }

        }

        
          console.log("handleNextCorrection",dossier)
          if(dossier==undefined)
            setOpen(false);
          else{
          setReponses(dossier)
          setUpdate(oldKey => oldKey + 1)
          }

      }
      const handleCloseAlert = () => {
        setOpenAlert(false);
      };

      const handleCloseAndQuitAlert= () => {
        setOpenAlert(false);
        setOpen(false);
      };

      const handleDL =  (item) =>async(e)=> {
        console.log("DL",item)
        var csv="data:text/csv;charset=utf-8,Ressource;\n"
        csv+="Nom;"+item.ressource.titre+";\n"
        csv+="Type;"+item.ressource.type+";\n"
        csv+="Date ouverture;"+item.ressource.dateO+";Date fermeture;"+item.ressource.dateF+";\n"
        csv+="id_user;prenom_user;nom_user;mail_user;"
        var idQuestion=[]
        item.ressource.questions.forEach(element => {
          csv+=element.question.replace("\n"," ")+";"
          idQuestion.push(element)
        });
        csv+="\n"

        console.log("idQ",idQuestion)
        item.data.forEach(element => {
          csv+=element.id_user+";"+element.user.firstname+";"+element.user.lastname+";"+element.user.mail+";"
          for(var i=0; i<idQuestion.length;i++){
            var r=""
            for(var j=0; j<element.reponse.length;j++){
              console.log("forEach",idQuestion[i].id,element.reponse[j].id_question)
              if(idQuestion[i].id===parseInt(element.reponse[j].id_question)){
                if(idQuestion[i].type==2){
                    var rep = element.reponse[j].reponse.split("§")
                    var label = idQuestion[i].choix.split("§")
                    for(var k=0;k<rep.length;k++){
                      if(parseInt(rep[k])==1)
                        r+=label[k]
                    }
                }else{
                  r=element.reponse[j].reponse.replace("\n"," ")
                }
                console.log("r",r)
              }
            }
            csv+=r+";"
        }
        csv+="\n"
          
        });
        var universalBOM = "\uFEFF";

        var a = window.document.createElement('a');
        a.setAttribute('href', 'data:text/csv; charset=utf-8,' + encodeURIComponent(universalBOM+csv));
        a.setAttribute('download', 'example.csv');
        window.document.body.appendChild(a);
        a.click();


      }

      const handleClose=  (event, reason) => {
        console.log(reason)
        if (reason && reason == "backdropClick" || reason == "escapeKeyDown") 
        return;
        console.log("data",ressource)
         
        setOpen(false);
        setUpdate(oldKey => oldKey + 1)
        handleUpdate()

       
      };

    return (

        <>
         <Typography variant="button" display="block" gutterBottom>Correction</Typography>
         
        {listRessource.map((item, index) => (<>
          
         <Accordion>
         <AccordionSummary
           expandIcon={<ExpandMoreIcon />}
           aria-controls="panel1a-content"
           id="panel1a-header"
         >
           <Typography>{item.ressource.titre}</Typography>
         </AccordionSummary>
         <AccordionDetails>
         <List dense={true}>
         <ListItem
              >
          
              <ListItemIcon>
          <IconButton onClick={handleDL(item)}>
            <FileDownloadIcon />
            </IconButton>
        </ListItemIcon>
        <ListItemIcon>
            <IconButton>
                <DeleteIcon />
            </IconButton>
        </ListItemIcon>
        <ListItemIcon>
            <IconButton>
                <ShuffleIcon />
            </IconButton>
        </ListItemIcon>
                  </ListItem>
                  <Divider/>
           {item.data.map((i,j)=>(
              <ListItem
              
              >
              <ListItemAvatar>
                <Avatar>
                  {i.note==null?<FolderIcon />:<Avatar sx={{ bgcolor: green[500] }}>{i.note}</Avatar>}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={i.user.firstname+" "+i.user.lastname}
                
              />
              <ListItemIcon>
        <IconButton onClick={handleCorrection(i,item.ressource,index)}>
            <ZoomInIcon />
            </IconButton>
        </ListItemIcon>
        <ListItemIcon>
            <IconButton>
                <DeleteIcon />
            </IconButton>
        </ListItemIcon>
                  </ListItem>
           ))

           }
           </List>
         </AccordionDetails>
       </Accordion>
       </>
        ))
        }
        
        <Dialog
        fullWidth={true}
        maxWidth="lg"
        open={openRessource}
        onClose={handleClose}
        disableBackdropClick 
      >
        <DialogTitle>{ressource.titre}</DialogTitle>
        
        <DialogContent dividers>
         <CorrectionContent dataReponse={reponses} dataQuestion={ressource} token={token} handleClose={closeModal} handleNextCorrection={handleNextCorrection}/>
           
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Fermer</Button>
          <Button onClick={handleNextCorrection}>Copîe suivante</Button>
        </DialogActions>
      </Dialog>
        </>
    )
}