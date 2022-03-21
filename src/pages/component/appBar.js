import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 240;

export default function AppNavBar() {

  const handlelogout =  e =>{
    localStorage.removeItem('token')
    window.location.reload(false);
  }
    return (   
    <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`, backgroundColor: '#eeeeee' }}
      >
        <Toolbar>
    <Typography type="title" color="inherit" style={{ flex: 1 }}>
      
    </Typography>
    <div>
    <IconButton aria-label="delete" onClick={handlelogout} >
      <LogoutIcon />
    </IconButton>
    </div>
  </Toolbar>
      </AppBar>
    );
}