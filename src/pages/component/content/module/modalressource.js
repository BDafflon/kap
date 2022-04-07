import { useEffect } from 'react'
import * as React from 'react';
// material-ui
import { Avatar, Divider, Box, Typography } from '@mui/material';
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

 


export default function ModalRessource({data,openP,updater,token,closeModal}) {
  const [open, setOpen] = React.useState(openP);
  const [openAlert, setOpenAlert] = React.useState(false);

  useEffect(() => {
    setOpen(openP)
  },[openP,updater])

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCloseM =  (event, reason) => {
    console.log(reason)
    if (reason && reason == "backdropClick" || reason == "escapeKeyDown") 
    return;
    console.log("data",data)
    if(data.type >3 )
      setOpenAlert(true);
    else
      setOpen(false);
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
    
  };

  const handleCloseAndQuitAlert= () => {
    setOpenAlert(false);
    setOpen(false);
  };


  return (
    <div>
       
      <Dialog
      fullWidth={true}
      maxWidth="lg"
        open={open}
        onClose={handleCloseM}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
       <DialogTitle>{data.titre}</DialogTitle>
        
        <DialogContent dividers>
         <RessourceView data={data} token={token} handleClose={closeModal}   />
           
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseM}>Fermer</Button>
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
    </div>
  );
}