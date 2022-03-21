import { useEffect } from 'react'
import * as React from 'react';
// material-ui
import { Avatar,Divider, Box, Typography } from '@mui/material';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import RessourceView from './ressourceview';
import ListSubheader from '@mui/material/ListSubheader';
// project imports
import TypeRessource from '../../../../utils/typeressources';
import ConfigData from '../../../../utils/configuration.json';

 
 


async function getRessources (module,token) {
  console.log("getRessources",module)
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
    ConfigData.SERVER_URL + '/ressources/'+module.id_module,
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
  var data=[]
  console.log("getRe",result)
  result.forEach(element => {
    data.push(element)
  });
  return data
}

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
 
function GetDivider({index, size}){
    console.log("Div",index, size)
    if(index == size) return <></>
    return <Divider/>
}

export default function CardRessource({data,token}){
    const [listRessource, setList] = React.useState([])
    const [openRessource, setOpen] = React.useState(false)
    const [ressource, setRessource] = React.useState({'titre':""})
    const [openAlert, setOpenAlert] = React.useState(false);

    useEffect(() => {
      const fetchData = async () => {
        if(data!= undefined){
          console.log("data",data)
          var rep = await getRessources(data,token)   
          setList(rep)    
        } 

      }

      fetchData()
      }, [data]);

    const handleRessource = param => e => {
        console.log("handleRessource", param)
        setRessource(param)
        setOpen(true);
    }

    const closeModal=(p)=>(event, reason)=>{
      console.log('close Modal ',p)
      if (reason && reason == "backdropClick" || reason == "escapeKeyDown") 
        return;
        if(p==undefined || p==false)
          setOpenAlert(true);
        else
          setOpen(false);
    }

    const handleClickOpenAlert = () => {
        setOpenAlert(true);
      };
    
      const handleCloseAlert = () => {
        setOpenAlert(false);
        
      };

      const handleCloseAndQuitAlert= () => {
        setOpenAlert(false);
        setOpen(false);
      };

      const handleClose=  (event, reason) => {
          console.log(reason)
        if (reason && reason == "backdropClick" || reason == "escapeKeyDown") 
        return;
        console.log("data",ressource)
        if(ressource.type >3 )
          setOpenAlert(true);
        else
          setOpen(false);

       
      };

    return (

        <>
        <Box sx={{ boxShadow: 1 }}>

        <List sx={{ width: '100%',  bgcolor: 'background.paper' }}
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">Ressource
          </ListSubheader>
        }>
            {
                listRessource.map((item, index) => (
                    <Box >
                    <ListItemButton disabled={!((item.dateO < Date() && item.dateF > Date()) || item.dateO == 0) } alignItems="flex-start" onClick={handleRessource(item)}>
                            <ListItemAvatar>
                            <Avatar alt={TypeRessource(item.type)} src="/static/images/avatar/1.jpg" />
                            </ListItemAvatar>
                            <ListItemText
                            primary={"["+TypeRessource(item.type)+"]: "+item.titre}
                            secondary={
                                <React.Fragment>
                                <Typography
                                    sx={{ display: 'inline' }}
                                    component="span"
                                    variant="body2"
                                    color="text.primary"
                                >
                                    du {getDate(item.dateO)} au {getDate(item.dateF)}
                                </Typography>
                                {" "}
                                </React.Fragment>
                            }
                            />
                           
                        </ListItemButton>
                        <GetDivider index={index+1} size={listRessource.length} />
                        </Box>
                        
                        
                ))
            }
      
      
       
    </List>

        </Box>
        
        <Dialog
        fullWidth={true}
        maxWidth="lg"
        open={openRessource}
        onClose={handleClose}
        disableBackdropClick 
      >
        <DialogTitle>{ressource.titre}</DialogTitle>
        
        <DialogContent dividers>
         <RessourceView data={ressource} token={token} handleClose={closeModal} />
           
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Fermer</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openAlert} onClose={handleCloseAlert}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Le contenu du formulaire ne sera pas sauvegardé
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlert}>Revenir</Button>
          <Button onClick={handleCloseAndQuitAlert}>Quitter</Button>
        </DialogActions>
      </Dialog>

        </>
    )
}