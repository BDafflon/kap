import React, { useState } from 'react'
import { useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import People from '@mui/icons-material/People'
import PermMedia from '@mui/icons-material/PermMedia'
import Dns from '@mui/icons-material/Dns'
import ListItemButton from '@mui/material/ListItemButton'
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown'
import TextField from '@mui/material/TextField'
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import InputAdornment from '@mui/material/InputAdornment';  
import TextareaAutosize from '@mui/material/TextareaAutosize';
import ReactMarkdown from "react-markdown";


 

export default function QuestionSansQuestionForm ({data,handleChild, index,type,correction}) {
 
    return(
        <>
        {console.log("QuestionLongueForm",data)}
        <Box sx={{  p: 2.25, boxShadow: 1 }}>
         
                  <Typography > </Typography> 
                  <ReactMarkdown children={data.question} />

        </Box>
        </>
    )

}