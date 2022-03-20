import React, {useState} from 'react';
import {useEffect} from "react";
import { useFormik } from 'formik';
import { useNavigate  } from "react-router-dom";
import * as Yup from 'yup';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import {Avatar, Box, Button, Container, Divider, Grid, Link, TextField, Typography  } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ConfigData from '../../../utils/configuration.json';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
// project imports
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { green } from '@mui/material/colors';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import GroupAddRoundedIcon from '@mui/icons-material/GroupAddRounded';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

async function affectationGroupe(token,code){
  console.log("affectationGroupe",code,token)
  const formData = new FormData();
  formData.append("code", code);

  const requestOptions = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'x-access-token': token.token,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({code:code})
  }
  const response = await fetch(
    ConfigData.SERVER_URL + '/groupe/affectation',
    requestOptions
  )
  if (!response.ok) {
    //localStorage.removeItem('token')
    //window.location.reload(false);
    console.log(response)
  }
  if (response.status == 401) {
    //localStorage.removeItem('token')
    //window.location.reload(false);
  }
}

async function registerUser(values){
    const requestOptions = {
        method: 'POST',
        mode: "cors",
        headers: { 'Accept': 'application/json','Content-Type': 'application/json' },
        body: JSON.stringify(values)
    };
    fetch(ConfigData.SERVER_URL+'/user/registration', requestOptions)
        .then(response => response.json())
}

async function getFormation() {
    return fetch(ConfigData.SERVER_URL+'/formations', {
        method: 'GET',
        mode: "cors",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            }
        }).then(response => response.json())
   }

   async function getGroupes() {
    return fetch(ConfigData.SERVER_URL+'/groupes', {
        method: 'GET',
        mode: "cors",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            }
        }).then(response => response.json())
   }

 
function getUser(token){
  return fetch(ConfigData.SERVER_URL+'/user', {
    method: 'GET',
    mode: "cors",
    headers: {
      'x-access-token': token.token,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        }
    }).then(response => response.json())

}   

function filtreGroupe(groupes,idFormation){
    let gr = []
    groupes.forEach(element => {
        if(element.id_formation == idFormation)
            gr.push(element)
    });
    return gr

}


export default function MyAccount({token}){
    const [formations, setData] = useState([]);
    const [groupes, setGroupes] = useState([]);
    const [groupesFiltre, setGroupesFiltre] = React.useState([]);
    const [formationSelected, setFormationSelected] = React.useState([]);
    const [groupeSelected, setGroupeSelected] = React.useState([]);
    const [openGroupModal, setOpenGroupModal] = React.useState(false);
    const [code, setCode]=React.useState("");
    const [user, setUser]=React.useState();

    const navigate = useNavigate();



    useEffect(() => {
        const getData = async () => {
            let response = await getFormation()
            console.log("rep",response)
            setData(response["formations"])

            response = await getGroupes()
            console.log("rep",response)
            setGroupes(response["groupes"])

            response = await getUser(token)
            setUser(response)

            console.log("user",user)
        }
        getData()
    }, []);

    

  const handleValideAndClose = async () =>{
    await affectationGroupe(token,code)
    setCode("")
    setOpenGroupModal(false)
  }
  const handleClose = () =>{
    setOpenGroupModal(false)
  }

 
  const handleChangeCode = event => {
    const {
      target: { value }
    } = event

    setCode(value)
  }

  const handleAddGroupe = ()=>{
    setOpenGroupModal(true)
  }

    const formik = useFormik({
        initialValues: {
          firstname:'',
          lastname:'',
          email: '',
          password: '',
          formation:null,
          groupe:null
        },
        validationSchema: Yup.object({
          email: Yup
            .string()
            .email(
              'Must be a valid email')
            .max(255)
            .required(
              'Email is required'),
          password: Yup
            .string()
            .max(255)
            .required(
              'Password is required'),
              password2: Yup
            .string()
            .max(255)
            .required(
              'Password is required'),
              firstname: Yup
            .string()
            .max(255)
            .required(
              'firstname is required'),
              lastname: Yup
            .string()
            .max(255)
            .required(
              'lastname is required')
            
        }),
        onSubmit:async  (values) => {
            values.formation = formationSelected.id
            values.groupe = groupeSelected.id
            console.log("val",values)

            await registerUser(values);
              
           
            navigate("/das",{ replace: true });
  
          }
      });
    return(
        <>
        <h1>Mon compte</h1>
        <Grid container spacing={3}>
            <Grid item xs={12} >
                <Grid container spacing={3}>
                <Grid item lg={4} md={4} sm={8} xs={12} >
                <Box >
        <form onSubmit={formik.handleSubmit} sx={{ p: 2.25, boxShadow: 1}}>
          
        <Box sx={{ my: 3 }}>
            <Typography
            color="textPrimary"
            variant="h4"
            >
            Mes informations
            </Typography>
            
        </Box>
        <Box sx={{p: 2.25, boxShadow: 1}}>
             
            <Box  sx={{ my: 2,}}>
      <div>
        <TextField
          error={Boolean(formik.touched.firstname && formik.errors.firstname)}
          helperText={formik.touched.firstname && formik.errors.firstname}

          id="outlined-error"
          label="Prenom"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          defaultValue=""
          name="firstname"
          type="text"
          style ={{width: '48%'}}
          variant="outlined"
        />
        <TextField
          error={Boolean(formik.touched.lastname && formik.errors.lastname)}
          id="outlined-error-helper-text"
          label="Nom"
          type="text"
          name="lastname"
          style ={{width: '48%','float':'right'}}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          defaultValue=""
          variant="outlined"
        />
      </div>
      </Box>
      <Box sx={{ my: 2 }}>
      <div>
        <TextField
          error={Boolean(formik.touched.email && formik.errors.email)}
          fullWidth
          helperText={formik.touched.email && formik.errors.email}
          label="Email Address"
          margin="normal"
          name="email"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="email"
          value={formik.values.email}
          variant="outlined"
     
        />
        </div>
        </Box>
        <Box sx={{ my: 2 }}>
      <div>
        <TextField
          error={Boolean(formik.touched.password && formik.errors.password)}
              fullWidth
              helperText={formik.touched.password && formik.errors.password}
              label="Password"
              margin="normal"
              name="password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="password"
              value={formik.values.password}
              variant="outlined"
     
        />
        </div>
        <div>
        <TextField
          error={Boolean(formik.touched.password2 && formik.errors.password2)}
              fullWidth
              helperText={formik.touched.password2 && formik.errors.password2}
              label="Password Confirmation"
              margin="normal"
              name="password2"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="password"
              value={formik.values.password2}
              variant="outlined"
     
        />
        </div>
        </Box>
        <Box sx={{ my: 2 }}>
        <div>
      
         
       
    </div>
     


       
      </Box>
      <Box sx={{ my: 2 }}>
      <div>
      <Button
            disabled
                color="primary"
                 
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Mise a jour
              </Button>
        </div>
        </Box>
         
    
        </Box>
          </form>
          </Box>
                    </Grid>
                    <Grid item lg={4} md={12} sm={12} xs={12}>
                    <Box sx={{ my: 3 }}>
                      <Typography
                      color="textPrimary"
                      variant="h4"
                      >
                      Mes Groupes
                      <IconButton     component="span" onClick={handleAddGroupe}>
                      <GroupAddRoundedIcon />
                    </IconButton>
                      </Typography>
                     

                      
                  </Box>
                        
                      <List dense={true} sx={{p: 2.25, boxShadow: 1}}> 
                       
                         
                            <ListItem>
                            <ListItemAvatar>
                              <Avatar>
                               <FolderIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary="Groupe"
                              
                            />
                             
                      <ListItemIcon>
                          <IconButton>
                              <DeleteIcon />
                          </IconButton>
                      </ListItemIcon>
                                </ListItem>
                              
                        
                        </List>
                       
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
        
        <Dialog open={openGroupModal} onClose={handleClose}>
        <DialogTitle>Rejoindre un groupe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Entrer le code pour rejoindre un groupe
          </DialogContentText>
          <TextField
            autoFocus
            onChange={handleChangeCode}
            margin="dense"
            id="name"
            label="code"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button onClick={handleValideAndClose}>Rejoindre</Button>
        </DialogActions>
      </Dialog>

        </>
    )
}