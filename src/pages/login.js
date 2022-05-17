import React, {useState} from 'react';
import { useFormik } from 'formik';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useNavigate  } from "react-router-dom";
import * as Yup from 'yup';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Box, Button, Container, Grid, Link, TextField, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PropType from 'prop-types';
import ConfigData from '../utils/configuration.json';

async function loginUser(credentials) {
    return fetch(ConfigData.SERVER_URL+'/login', {
      method: 'GET',
      mode: "cors",
      headers: {
        'Authorization': 'Basic ' + btoa(`${credentials.email}:${credentials.password}`),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(data => data.json())
      .catch(error => {
        //console.log("error")
         

      })
   }

   const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  

export default function Login({setToken}){
  const [open, setOpen] = React.useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
          email: 'prenom.nom@etu-univ-lyon1.fr',
          password: 'Password123'
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
              'Password is required')
        }),
        onSubmit:async  (values) => {
          //console.log(values)
          const token = await loginUser(values);
           //console.log(token)
          if(token != undefined){
            setToken(token);
          }
          else
            setOpen(true)
          navigate("/",{ replace: true });

        }
      });

    return(
        <>
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                  <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    Login error
                  </Alert>
          </Snackbar>
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
                Connexion
              </Typography>
              <Typography
                color="textSecondary"
                gutterBottom
                variant="body2"
              >
                plateforme d'auto-evaluation
              </Typography>
            </Box>
             
            
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
            <Box sx={{ py: 2 }}>
              <Button
                color="primary"
                disabled={formik.isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Connexion
              </Button>
            </Box>
            <Typography
              color="textSecondary"
              variant="body2"
            >
              Pas de compte?
              {' '}
              <Link href="/registration" underline="none">
                {'Inscription'}
                </Link>
            </Typography>
            <Typography
              color="textSecondary"
              variant="body2"
            >
              Mots de passe oublié ?
              {' '}
              <Link href="/forget" underline="none">
                {'Renouvèlement'}
                </Link>
            </Typography>
            
          </form>
        </Container>
      </Box>
    </>
    );
}

Login.PropType ={
    setToken : PropType.func.isRequired
}