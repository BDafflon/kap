import React, {useState} from 'react';
import { useEffect } from 'react'

import { useFormik } from 'formik';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useNavigate  } from "react-router-dom";
import * as Yup from 'yup';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Box, Button, Container, Grid, Link, TextField, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PropType from 'prop-types';
import ConfigData from '../../../utils/configuration.json';
import Module from './module/module';
import MyAccount from "./myaccount";
import LiveUser from './module/live/liveuser';

export default function UserContent({module,token, dashboardType}){
    const [m, setModule] = React.useState()

    useEffect(() => {
      if(module!=undefined){
        setModule(module)
        console.log("UserContent",token,module)
      }
      }, [module]);

    if(module==undefined){
      if(dashboardType==1){
        return(<MyAccount token={token} dashboardType={dashboardType}/>)
      }
      if(dashboardType==0){
        return(<h1>Tableau de bord</h1>)
      }

      return <></>
      
    }
    return(
        <>
          <h1>Tableau de bord</h1>
          <h2>Module : {module.label}
          <LiveUser module={module} token={token} />
          </h2>
          
        
     
          <Module module={module} token={token} />
        </>
    );
}

 