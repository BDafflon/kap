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
import ReactMarkdown from "react-markdown";
import useMousePosition from "../../../../utils/unload"
import FormContent from './formcontent';

async function recodeActivity(data,startTime,endTime,token){

    const requestOptions = {
        method: "POST",
        mode: "cors",
        headers: {
          "x-access-token": token.token,
          Accept: 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({"startTime":startTime,"endTime":endTime,"data":data}),
      };
  
      
    
      const response = await fetch(
        ConfigData.SERVER_URL + "/ressources/stat",
        requestOptions
      );
      console.log(response);
      if (!response.ok) {
        console.log(response);
      }
      if (response.status == 401) {
        //localStorage.removeItem("token");
        //window.location.reload(false);
      }
      const result = await response.json();
      
}

function GetRessource({data,handleClose,token}){
    if(data.type<=3)
        return  <ReactMarkdown children={data.content} />
    else
        return <FormContent data={data} handleClose={handleClose} token={token}/>
    return <></>
}


export default function RessourceView({data,token,handleClose}){
    const [ressource, setRessource] = React.useState(data);
    const [startTime, setStartTime]=React.useState(Math.round(+new Date()/1000));
    const [mousePosition, setMousePosition] = useState({ x: null, y: null });
    const [activity,setActivity]= React.useState(0);
    const [mousePos,setMousePos]=React.useState({ x: null, y: null });
    const [timeDif, setTimeDif] = useState();
    const hasMovedCursor = typeof mousePosition.x === "number" && typeof mousePosition.y === "number";
 

 
    const IsAct = () => {
       
        console.log("hisActive",mousePos)
    }

    const updateMousePosition = ev => {
        setMousePosition({ x: ev.clientX, y: ev.clientY });
      };


    useEffect(() => {
        
        setRessource(data)
         console.log("RessourceView",startTime,data)
        
        return () => {
            async function saveStat () {
                
                window.removeEventListener("mousemove", updateMousePosition);
                console.log("QUIT",data,startTime,Math.round(+new Date()/1000))
                data.content.forEach(element => {
                  delete element.reponseuser
                  delete element.essais
                  
                });
                console.log("QUIT",data,startTime,Math.round(+new Date()/1000))

                await recodeActivity(data,startTime,Math.round(+new Date()/1000),token)
                
            }
            saveStat()
            
        }
      }, [data])

    if (ressource == undefined) return <></>

    return (
        <>
        <GetRessource data={ressource} handleClose={handleClose} token={token} />
        </>
    );
}