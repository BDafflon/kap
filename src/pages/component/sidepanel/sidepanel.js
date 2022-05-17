import React, { useState } from 'react'
import { useEffect } from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import SettingsIcon from '@mui/icons-material/Settings'
import SpeedIcon from '@mui/icons-material/Speed'
import ListItemButton from '@mui/material/ListItemButton'
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown'
import SnippetFolderIcon from '@mui/icons-material/SnippetFolder'
import useToken from '../../../utils/useToken'
import SidePanelAdmin from './sidepanelAdmin'
import People from '@mui/icons-material/People'
import PermMedia from '@mui/icons-material/PermMedia'
import Dns from '@mui/icons-material/Dns'
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import ConfigData from '../../../utils/configuration.json'
import DescriptionIcon from '@mui/icons-material/Description';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import CoPresentIcon from '@mui/icons-material/CoPresent';

const drawerWidth = 240


async function getModules (token) {
  
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
    ConfigData.SERVER_URL + '/mesmodules',
    requestOptions
  )
  if (!response.ok) {
    localStorage.removeItem('token')
    window.location.reload(false);
    //console.log(response)
  }
  if (response.status == 401) {
    localStorage.removeItem('token')
    window.location.reload(false);
  }
  const result = await response.json()
  var data=[]
  result.modules.forEach(element => {
    //console.log("element",element)
    if (element.id_owner == token.id){
    var item = {icon:<ContentPasteSearchIcon/>, label:element.name, open:true, id_formation:element.id_formation, id_module:element.id}

    }else{
    var item = {icon:<DescriptionIcon/>, label:element.name, open:true, id_formation:element.id_formation, id_module:element.id, intro:element.intro }
    }
    data.push(item)
  });


  const requestOptions2 = {
    method: 'GET',
    mode: 'cors',
    headers: {
      'x-access-token': token.token,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }
  const response2 = await fetch(
    ConfigData.SERVER_URL + '/sharewithme',
    requestOptions2
  )
  if (!response.ok) {
    localStorage.removeItem('token')
    window.location.reload(false);
    //console.log(response)
  }
  if (response.status == 401) {
    localStorage.removeItem('token')
    window.location.reload(false);
  }
  const result2 = await response2.json()
  result2.modules.forEach(element => {
    //console.log("element",element)
    if (element.id_owner == token.id){
    var item = {icon:<ContentPasteSearchIcon/>, label:element.name, open:true, id_formation:element.id_formation, id_module:element.id}

    }else{
      if(token.rank==0)
        var item = {icon:<CoPresentIcon/>, label:element.name, open:true, id_formation:element.id_formation, id_module:element.id}
      else
        var item = {icon:<DescriptionIcon/>, label:element.name, open:true, id_formation:element.id_formation, id_module:element.id, intro:element.intro }
    }
    data.push(item)
  });

  return data
}


 
export default function SidePanel (props) {
  const [dataRessources, setDataRessources] = React.useState([])
  const [openModules, setOpenModules] = React.useState(true)
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  
  useEffect(() => {
    async function load () {
      setDataRessources(await getModules(props.token))
    }
    load()
  }, [])


  const handleListItemClick = (event, index,item) => {
    setSelectedIndex(index);
    props.handle(item,index)
  };

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box'
        }
      }}
      variant='permanent'
      anchor='left'
    >
      <Toolbar />
      <Divider />
      <List>
        <ListItem button  selected={selectedIndex === 0} onClick={(event) => handleListItemClick(event, 0,null)}>
          <ListItemIcon>
            <SpeedIcon />
          </ListItemIcon>
          <ListItemText primary='Tableau de bord' />
        </ListItem>
        <ListItem button selected={selectedIndex === 1} onClick={(event) => handleListItemClick(event, 1,null) }>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary='Mon compte' />
        </ListItem>
      </List>
      <Divider />
      <SidePanelAdmin props={props.token}/>

      <Divider />
      <List>
        <ListItem button>
          <ListItemIcon>
            <SpeedIcon />
          </ListItemIcon>
          <ListItemText primary='Ressources' />
        </ListItem>
        </List>
      <Box>
      <List component="nav" aria-label="main mailbox folders">
      {
        dataRessources.map((item, index) => (
        <ListItemButton
          sx={{ ml: 2 }}
          selected={selectedIndex === 2+index}
          onClick={(event) => handleListItemClick(event, 2+index,item )}
        >
          <ListItemIcon>
            {item.icon}
          </ListItemIcon>
          <ListItemText primary={item.label} />
        </ListItemButton>
                ))}
         
      </List>
      <Divider />
       

         
       
      </Box>
    </Drawer>
  )
}
