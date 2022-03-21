import React, {useState} from 'react';
import { useEffect } from 'react'
import { useFormik } from 'formik';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useNavigate  } from "react-router-dom";
import * as Yup from 'yup';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Box, Button, Container, Divider, Grid, Link, TextField, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PropType from 'prop-types';
import ConfigData from '../../../../utils/configuration.json';
import CardWrapper from './cardwrapper';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { styled } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import CardRessource from "./cardressource";
import Paper from '@mui/material/Paper';
import { LineChart, Line, CartesianGrid, XAxis, YAxis,ResponsiveContainer ,ReferenceLine} from 'recharts';
import CardActivity from './cardactivity';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  async function getActivity(data,token){
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
      ConfigData.SERVER_URL + '/ressources/stat/'+data.id_module+"/5",
      requestOptions
    )
    if (!response.ok) {
      //localStorage.removeItem('token')
      //window.location.reload(false)
      console.log(response)
    }
    if (response.status == 401) {
      //localStorage.removeItem('token')
      //window.location.reload(false)
    }
    const result = await response.json()
    console.log("getActivity",result)
    return result;
  
  }

  async function getNotes(data,token){
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
      ConfigData.SERVER_URL + '/ressources/notes/'+data.id_module,
      requestOptions
    )
    if (!response.ok) {
      //localStorage.removeItem('token')
      //window.location.reload(false)
      console.log(response)
    }
    if (response.status == 401) {
      //localStorage.removeItem('token')
      //window.location.reload(false)
    }
    const result = await response.json()
    console.log("getNotes",result)
    return result;
  
  }
  
  async function getRessources (token,module) {
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
    result.forEach(element => {
      console.log("element",element)
      data.push(element)
    });
    return data
  }

  const obj=""//Une entreprise conçoit et fabrique des systèmes de transmission de puissance. Elle envisage de faire évoluer son offre de motoréducteurs. Pour planifier cette évolution, elle souhaite avoir une vision objective de la performance de ses 2 lignes actuelles d’assemblage sur les 12 derniers mois."
  

const metrics=[
  undefined,
  {type:"graph", size:"m", label:"Temps passé",ref:<></>, data:[{name: '', data: 10},{name: '', data: 8},{name: '', data: 9},{name: '', data: 10},{name: '', data: 8},{name: '', data: 9}], icon:<ArrowUpwardIcon fontSize="inherit" sx={{ transform: 'rotate3d(0, 0, 1, 45deg)'  }} />},
  {type:"graph", size:"m", label:"Moyenne", ref:<ReferenceLine y={10} label="10/20" stroke="red" />, data:[{name: '10/01', data: 10},{name: '17/01', data: 8},{name: '24/01', data: 9}], icon:<ArrowUpwardIcon fontSize="inherit" sx={{ transform: 'rotate3d(0, 0, 1, 45deg)'  }} />},
    {type:"rappel",label:"Prochain DM", data:"10/03/2022", icon:<ArrowUpwardIcon fontSize="inherit" sx={{ transform: 'rotate3d(0, 0, 1, 45deg)'  }} />},
    {type:"rappel",label:"Prochain Exam", data:"10/03/2022" , icon:<ArrowUpwardIcon fontSize="inherit" sx={{ transform: 'rotate3d(0, 0, 1, 45deg)' }} />},
    {type:"graph",size:"l",label:"Evolution", data:"10/03/2022" , icon:<ArrowUpwardIcon fontSize="inherit" sx={{ transform: 'rotate3d(0, 0, 1, 45deg)' }} />},
    {type:"text",size:"l",label:obj, titre:" ", data:"10/03/2022" , icon:<ArrowUpwardIcon fontSize="inherit" sx={{ transform: 'rotate3d(0, 0, 1, 45deg)' }} />},

]

export default function Module({module,token}){
    const [ressource, setRessource] = React.useState([]);
    const [prochainDevoir, setDevoir] = React.useState([]);
    const [prochainExam, setExam] = React.useState([]);
    const [intro, setIntro] = React.useState({type:"text",size:"l",label:"", titre:" ", data:"" , icon:<ArrowUpwardIcon fontSize="inherit" sx={{ transform: 'rotate3d(0, 0, 1, 45deg)' }} />})
    useEffect(() => {
        async function load () {
            console.log("Module",module)
            setIntro({type:"text",size:"l",label:module.intro, titre:"", data:"" , icon:<ArrowUpwardIcon fontSize="inherit" sx={{ transform: 'rotate3d(0, 0, 1, 45deg)' }} />})
            var res = await getRessources(token,module)
            setRessource(res)
            var pDevoir = {data:undefined}
            var minD = 10000000

            var pExam = {data:undefined}
            var minE = 10000000

            res.forEach(element => {
              
              if(element.type==3){
                var elapse = Date.now() - element.dateO
                  if(elapse>0 && elapse<minD)
                  {
                    pDevoir=element
                    minD=elapse
                  }
              }

              if(element.type==4){
                var elapse = Date.now() - element.dateO
                  if(elapse>0 && elapse<minE)
                  {
                    pExam=element
                    minE=elapse
                  }
              }
            });
            setDevoir({type:"rappel",label:"Prochain DM", data:pDevoir.dateO, icon:<ArrowUpwardIcon fontSize="inherit" sx={{ transform: 'rotate3d(0, 0, 1, 45deg)'  }} />})
            setExam({type:"rappel",label:"Prochain Exam", data:pExam.dateO, icon:<ArrowUpwardIcon fontSize="inherit" sx={{ transform: 'rotate3d(0, 0, 1, 45deg)'  }} />})
        
            var act = await getActivity(module,token)
            console.log("act",act)
            var notes = await getNotes(module,token)
          }
        load()
      }, [])
    return (
        <Box  >
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Grid container spacing={3}>
                <Grid item lg={8} md={8} sm={8} xs={12} >
                        <CardWrapper data={intro}  />
                    </Grid>
                    <Grid item lg={4} md={12} sm={12} xs={12}>
                        <Grid container spacing={3}>
                            <Grid item sm={6} xs={12} md={6} lg={12} >
                            <CardWrapper data={prochainDevoir} />
                            </Grid>
                            <Grid item sm={6} xs={12} md={6} lg={12}>
                            <CardWrapper data={prochainExam} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
        <Grid  sx={{ my: 2}} container spacing={3}>
            <Grid item xs={12}>
                <Grid container spacing={3}>
                    <Grid item lg={8} md={8} sm={8} xs={12} >
                        <CardWrapper data={metrics[0]}  />
                    </Grid>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        
                        <Grid container spacing={3}>
                            <Grid item sm={6} xs={12} md={6} lg={12} >
                            <CardRessource data={module} token={token} />
                            </Grid>
                            <Grid item sm={6} xs={12} md={6} lg={12}>
                            <CardActivity data={module} token={token} />  
                            </Grid>
                        </Grid>
                         
                    </Grid>
                     
                </Grid>
            </Grid>
        </Grid>
        
        </Box>
    )


}