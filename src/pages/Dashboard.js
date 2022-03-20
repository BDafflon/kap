import * as React from 'react';
import { useEffect } from 'react'

import CssBaseline from '@mui/material/CssBaseline';
import AppNavBar from './component/appBar';
import SidePanel from "./component/sidepanel/sidepanel";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useNavigate  } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Box, Button, Container, Grid, Link, TextField, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PropType from 'prop-types';
import ConfigData from '../utils/configuration.json';
import AdminContent from './component/content/adminContent';
import UserContent from './component/content/usercontent';
import useToken from "../utils/useToken";
 
 

function GetDashbord(props) {
    const token = props.token;
   
        console.log("GetDashbord",token)
          if(token.rank==0){
              return <AdminContent  module={props.module} token={token} dashboardType={props.dashboardType} />
          }
          else{
            return <UserContent module={props.module} token={token}  dashboardType={props.dashboardType}/>
          }
    
}
export default function Dashboard({token}){
  const [openModule, setOpenModule] = React.useState();
  const [dashboardType, setDashboardType] = React.useState();

  const handleModule = (param,index)=> {
    console.log('ckick',token, param, index)
    if(index!=null){
      setDashboardType(index)
    }
    setOpenModule(param)
  }


    return(
        <Box sx={{  ml:'240px', my:10, width:'auto' }}>
            <CssBaseline />       
            <AppNavBar />
            <Box>
            <SidePanel token={token} handle={handleModule} />
            </Box>
            <Box sx={{ my: 5,  width:'auto' }}>
              
            <GetDashbord token = {token} module={openModule} dashboardType={dashboardType}/>
            </Box>
            
        </Box>
    );
}