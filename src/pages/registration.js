import React, {useState} from 'react';
import {useEffect} from "react";
import { useFormik } from 'formik';
import { useNavigate  } from "react-router-dom";
import * as Yup from 'yup';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import ConfigData from '../utils/configuration.json';
import { Box, Button, Container, Grid, Link, TextField, Typography  } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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

 

function filtreGroupe(groupes,idFormation){
    let gr = []
    groupes.forEach(element => {
        if(element.id_formation == idFormation)
            gr.push(element)
    });
    return gr

}

  
export default function Registration({setToken}){
    const [formations, setData] = useState([]);
    const [groupes, setGroupes] = useState([]);
    const [groupesFiltre, setGroupesFiltre] = React.useState([]);
    const [formationSelected, setFormationSelected] = React.useState([]);
    const [groupeSelected, setGroupeSelected] = React.useState([]);
    const navigate = useNavigate();



    useEffect(() => {
        const getData = async () => {
            let response = await getFormation()
            console.log("rep",response)
            setData(response["formations"])

            response = await getGroupes()
            console.log("rep",response)
            setGroupes(response["groupes"])
        }
        getData()
    }, []);

    

    
  const handleFormationChange = (event) => {
    const {
      target: { value },
    } = event;
    console.log('se',value)

    let gr = filtreGroupe(groupes,value.id)
    setGroupesFiltre(gr)
    

    setFormationSelected(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleGroupeChange = (event) => {
    const {
      target: { value },
    } = event;
    console.log('se',value)
    setGroupeSelected(value)
    
 
  };

     
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
        <Box
        component="main"
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexGrow: 1,
          minHeight: '100%'
        }}
      >
        <Container maxWidth="sm">
           
            <Button
            href="/"
              component="a"
              startIcon={<ArrowBackIcon fontSize="small" />}
            >
              Accueil
            </Button>
           
          <form onSubmit={formik.handleSubmit}>
          
            <Box sx={{ my: 3 }}>
              <Typography
                color="textPrimary"
                variant="h4"
              >
                Inscription
              </Typography>
              <Typography
                color="textSecondary"
                gutterBottom
                variant="body2"
              >
                plateforme d'auto-evaluation
              </Typography>
            </Box>
             
            <Box  sx={{ my: 2 }}>
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
        </Box>
        <Box sx={{ my: 2 }}>
        <div>
      
         
    </div>
     


       
      </Box>
      <Box sx={{ my: 2 }}>
      <div>
      <Button
                color="primary"
                disabled={formik.isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Inscription
              </Button>
        </div>
        </Box>
        <Typography
              color="textSecondary"
              variant="body2"
            >
              Déjà inscrit ? 
              {' '}
              <Link href="/login" underline="none">
                {'Connexion'}
                </Link>
            </Typography>
    
            
          </form>
        </Container>
      </Box>
    </>
    );
}
 