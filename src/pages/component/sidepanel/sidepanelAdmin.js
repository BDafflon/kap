import React, { useState } from 'react'
import { useEffect } from 'react'
import Box from '@mui/material/Box'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import People from '@mui/icons-material/People'
import PermMedia from '@mui/icons-material/PermMedia'
import Dns from '@mui/icons-material/Dns'
import ListItemButton from '@mui/material/ListItemButton'
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown'
import useToken from '../../../utils/useToken'
import * as UsersManager from '../../../utils/userManager'
import * as ModuleManager from '../../../utils/moduleManager'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import InputLabel from '@mui/material/InputLabel'
import Autocomplete from '@mui/material/Autocomplete'
import Snackbar from '@mui/material/Snackbar'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import MuiAlert from '@mui/material/Alert'
import ConfigData from '../../../utils/configuration.json'
import { Navigate } from 'react-router-dom'
import RessourcesTable from '../ressources/ressourcetable'
import CreationRessource from '../ressources/creationressource'
import { height } from '@mui/system'
import TextareaAutosize from '@mui/material/TextareaAutosize';
import GroupAddRoundedIcon from '@mui/icons-material/GroupAddRounded';
import IconButton from '@mui/material/IconButton';
import { Typography } from '@mui/material'


const data = [
  { icon: <People />, label: 'Formations', onclick: 'handleClickOpenModal' },
  { icon: <Dns />, label: 'Groupes' },
  { icon: <PermMedia />, label: 'Modules' },
  { icon: <PermMedia />, label: 'Ressources' }
]

async function generateCode(token, groupeSelected){

    const requestOptions = {
        method: 'GET',
        mode: 'cors',
        headers: {
          'x-access-token': token,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      }
      const response = await fetch(
        ConfigData.SERVER_URL + '/groupe/code/'+groupeSelected.id,
        requestOptions
      )
      if (!response.ok) {
        localStorage.removeItem('token')
        window.location.reload(false)
        //console.log(response)
      }
      if (response.status == 401) {
        localStorage.removeItem('token')
        window.location.reload(false)
      }
      const result = await response.json()
      return result
}

async function deleteCodeGroupe(token, groupeSelected){
  const requestOptions = {
    method: 'DELETE',
    mode: 'cors',
    headers: {
      'x-access-token': token,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }
  const response = await fetch(
    ConfigData.SERVER_URL + '/groupe/code/'+groupeSelected.id,
    requestOptions
  )
  if (!response.ok) {
    localStorage.removeItem('token')
    window.location.reload(false)
    //console.log(response)
  }
  if (response.status == 401) {
    localStorage.removeItem('token')
    window.location.reload(false)
  }
}
async function trashAffectation(token,value){
  //console.log("trash",value)
  const requestOptions = {
    method: 'DELETE',
    mode: 'cors',
    headers: {
      'x-access-token': token,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }
  const response = await fetch(
    ConfigData.SERVER_URL + '/affectation/del/'+value.data.id,
    requestOptions
  )
  if (!response.ok) {
    localStorage.removeItem('token')
    window.location.reload(false)
    //console.log(response)
  }
  if (response.status == 401) {
    localStorage.removeItem('token')
    window.location.reload(false)
  }
  const result = await response.json()
  return result
}


async function registerFormation (token, value) {
  const requestOptions = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'x-access-token': token,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name: value })
  }
  fetch(ConfigData.SERVER_URL + '/formation/registration', requestOptions)
    .then(response => response.json())
    .catch(error => {
      //console.log('error', error)
    })
}

async function addGroupeToModule (token, groupe, module) {
  const requestOptions = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'x-access-token': token,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id_module: module.id, id_groupe: groupe.id })
  }
  fetch(ConfigData.SERVER_URL + '/module/affectation', requestOptions)
    .then(response => response.json())
    .catch(error => {
      //console.log('error', error)
    })
}

async function registerGroupe (token, value, formation) {
  const requestOptions = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'x-access-token': token,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name: value, id_formation: formation.id })
  }
  
  fetch(ConfigData.SERVER_URL + '/groupe/registration', requestOptions)
    .then(response => {
      if (response.status == 401) {
        localStorage.removeItem('token')
      } else {
        return response.json()
      }
    })
    .then(response => response.json())
    .catch(error => {
      //console.log('error', error)
    })
}

async function updateModule (token, value, module) {
  const requestOptions = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'x-access-token': token,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name: value, id_module: module.id })
  }
  fetch(ConfigData.SERVER_URL + '/module/update', requestOptions)
    .then(response => {
      if (response.status == 401) {
        localStorage.removeItem('token')
      } else {
        return response.json()
      }
    })
    .catch(error => {
      //console.log('error', error)
    })
}

async function registerModule (token, value,moduleResume, formation) {
  const requestOptions = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'x-access-token': token,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name: value, id_formation: formation.id,moduleResume:moduleResume })
  }
  fetch(ConfigData.SERVER_URL + '/module/registration', requestOptions)
    .then(response => {
      if (response.status != 200) {
        localStorage.removeItem('token')
      } else {
        return response.json()
      }
    })
    .catch(error => {
      //console.log('error', error)
    })
}


//------------------------------------------------------------------------------------------------------
 


async function getModules (token, formation) {
  if (formation.id == undefined) return { modules: [] }

  const requestOptions = {
    method: 'GET',
    mode: 'cors',
    headers: {
      'x-access-token': token,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }
  const response = await fetch(
    ConfigData.SERVER_URL + '/modules/' + formation.id,
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
  //console.log('getMedia', result)
  return result
}


async function getAffectation (token) {
  
  const requestOptions = {
    method: 'GET',
    mode: 'cors',
    headers: {
      'x-access-token': token,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }
  const response = await fetch(
    ConfigData.SERVER_URL + '/module/affectation',
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
  //console.log('getMedia', result)
  return result
}

// ---------------------------------------------------------------------------------------
async function getFormation () {
  const requestOptions = {
    method: 'GET',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }
  const response = await fetch(
    ConfigData.SERVER_URL + '/formations',
    requestOptions
  ).catch((error) => {
    //console.log(error)
  });
  
  if(response == undefined)
  {
    localStorage.removeItem('token')
    window.location.reload(false);
  }
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
  //console.log('getFormation', result)
  return result
}

// ---------------------------------------------------------------------------------------

async function getGroupes () {
  return fetch(ConfigData.SERVER_URL + '/groupes', {
    method: 'GET',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(response => response.json())
}



const Alert = React.forwardRef(function Alert (props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
})

export default function SidePanelAdmin ({props}) {

  
  
  //console.log("props SAdmin", props)
  const [openConfig, setOpenConfig] = React.useState(true)
  const token = props.token;
  const [openModalFormation, setOpenModalFormation] = React.useState(false)
  const [openModalModule, setOpenModalModule] = React.useState(false)
  const [openModalRessource, setOpenModalRessource] = React.useState(false)
  const [openModalGroupe, setOpenModalGroupe] = React.useState(false)
  const [formations, setDataFormation] = useState([])
  const [GroupeFiltre, setDataGroupeFiltre] = useState([])
  const [groupes, setDataGroupe] = useState([])
  const [affectation, setDataAffectation] = useState([])
  const [affectationSelected, setDataSelectedAffectation] = useState([])
  const [formationName, setFormationName] = useState([])
  const [moduleName, setModuleName] = useState([])
  const [moduleResume, setModuleResume] = useState([])
  const [groupeName, setGroupeName] = useState([])
  const [refreshKey, setRefreshKey] = useState(0)
  const [dataModules, setdataModules] = useState([])
  const [dataModulesFiltred, setdataModulesFiltred] = useState([])
  const [formationSelected, setDataFormationSelected] = useState(null)
  const [moduleSelected, setDataModuleSelected] = useState()
  const [groupeSelected, setDataGroupeSelected] = useState(null)
  const [moduleAdded, setOpenSnackbarsModule] = React.useState(false)
  const [shareModule, setOpenSnackbarsShare] = React.useState(false)
  const [groupeAdded, setOpenSnackbarsGroupe] = React.useState(false)
  const [formationAdded, setOpenSnackbarsFormation] = React.useState(false)
  const [tabValue, setTabValue] = React.useState('1')
  const [tabRessourcesValue, setTabRessourceValue] = React.useState('1')
  const [ressourceIdEdition, setressourceIdEdition] = React.useState()
  const [openModalCodeGroupe, setOpenModalCodeGroupe] = React.useState(false)
  const [codeGroupe, setCodeGroupe] = React.useState("")
  const [adminUser, setAdminUser] = useState([])
  const [share, setShare] = useState([])
  const [selectedAdmin, setSelectedAdmin] = React.useState()
  const [selecteShare, setSelectedShare] = React.useState()
 


  const handleClickOpenModal = param => e => {
    if (param == 'Formations') setOpenModalFormation(true)
    if (param == 'Groupes') setOpenModalGroupe(true)
    if (param == 'Modules') setOpenModalModule(true)
    if (param == 'Ressources') setOpenModalRessource(true)
  }

  const handleAddGroupeCode = async() =>{
    
    var code = await generateCode(token, groupeSelected)
    setCodeGroupe(code)
    setOpenModalCodeGroupe(true)


  }

  const handleCloseAndValidateModalFormation = async () => {
    setOpenModalFormation(false)
    await registerFormation(token, formationName)
    setRefreshKey(oldKey => oldKey + 1)
    setOpenSnackbarsFormation(true)
  }

  const handleCloseAndValidateModalModule = async () => {
    setOpenModalModule(false)
    await registerModule(token, moduleName, moduleResume, formationSelected)
    setRefreshKey(oldKey => oldKey + 1)
    setOpenSnackbarsModule(true)
  }

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue)
  }
  const handleChangeTabRessources = (event, newValue) => {
    setTabRessourceValue(newValue)
  }

  const handleCloseAndValidateModalGroupe = async () => {
    setOpenModalGroupe(false)
    await registerGroupe(token, groupeName, formationSelected)
    setRefreshKey(oldKey => oldKey + 1)
    setOpenSnackbarsGroupe(true)
  }

  const handleCloseAndValidateModalAffectation = async () => {
    setOpenModalModule(false)
    await addGroupeToModule(token, groupeSelected, moduleSelected)
    setRefreshKey(oldKey => oldKey + 1)
    setOpenSnackbarsModule(true)
  }

  const handleCloseModalUpdateModule = async () => {
    setOpenModalModule(false)
    await updateModule(token, moduleName, moduleSelected)
    setRefreshKey(oldKey => oldKey + 1)
    setOpenSnackbarsModule(true)
  }

  const handleCloseModalAddRessource = async () => {
    setOpenModalRessource(false)

    setRefreshKey(oldKey => oldKey + 1)
  }

  const handleCloseCodeGroupe = async() => {
    await deleteCodeGroupe(token,groupeSelected)
    setOpenModalCodeGroupe(false)
  }

  const handleCloseModalRessource = () => {
    setOpenModalRessource(false)
  }

  const handleCloseModalFormation = () => {
    setOpenModalFormation(false)
  }

  const handleCloseModalRessources = () => {
    setOpenModalRessource(false)
  }

  const handleCloseModalModule = () => {
    setOpenModalModule(false)
  }
  const handleCloseandDelModalModule =async ()=>{
    setOpenModalModule(false)
    await trashAffectation(token, affectationSelected)
    setDataAffectation([])
    setRefreshKey(oldKey => oldKey + 1)
  }

  const handleCloseModalGroupe = () => {
    setOpenModalGroupe(false)
    setDataFormationSelected(null)
  }


  const handleModuleResumeChange=  event => {
    const {
      target: { value }
    } = event

    setModuleResume(value)
  }

  const handleAdminShare = (event, newValue) => {
     
    console.log(newValue)
    setSelectedAdmin(newValue)
  }

  const handleStopShare= async() =>{

    var rep = await ModuleManager.stopShare({token:token},selecteShare)
    setShare(rep)
    setSelectedShare()
    setRefreshKey(oldKey => oldKey + 1)
    setOpenSnackbarsShare(true)
     
  }

  const handleCloseandShareModule = async() =>{

    var rep = await ModuleManager.share({token:token},moduleSelected,selectedAdmin)
    setRefreshKey(oldKey => oldKey + 1)
    setOpenSnackbarsShare(true)
     
  }

  const handleModuleNameChange = event => {
    const {
      target: { value }
    } = event

    setModuleName(value)
  }

  const handleFormationNameChange = event => {
    const {
      target: { value }
    } = event

    setFormationName(value)
  }

  const handleGroupeNameChange = event => {
    const {
      target: { value }
    } = event

    setGroupeName(value)
  }

  const handleEdition  = (e) => {
    setressourceIdEdition(e)
    //console.log("e",ressourceIdEdition)
    setTabRessourceValue("2")
    setRefreshKey(oldKey => oldKey + 1)
    
    
   
    
  }

  const handleSelectedAffectation = async (event, newValue) => {
    //console.log('handle', newValue, event)
    setDataSelectedAffectation(newValue)
    setRefreshKey(oldKey => oldKey + 1)
  }

  const handleSelectedgroupe = async (event, newValue) => {
    //console.log('handle', newValue, event)
    setDataGroupeSelected(newValue)
  }

  const handleSelectedShare= async (event, newValue) => {
    //console.log('handle', newValue, event)
      setSelectedShare(newValue)
  }

  const handleSelectedModule = async (event, newValue) => {
    //console.log('handle', newValue, event)
    setDataModuleSelected(newValue)
  }
  

  const handleSelectedFormation = async (event, newValue) => {
    if (newValue == null){
      setDataGroupeFiltre([])
      setdataModulesFiltred([])
    }
    else{
      
      //console.log('handle', newValue, event)
      setDataFormationSelected(newValue)
      let listGroupe = []
      groupes.forEach(element => {
        if (element.id_formation == newValue.id)
          listGroupe.push({ label: element.name, id: element.id })
      })
      setDataGroupeFiltre(listGroupe)
  
      let response = await getModules(token, newValue)
  
      let listModules = []
      //console.log('MF', formationSelected)
      response.modules.forEach(element => {
        if (element.id_formation == newValue.id)
          listModules.push({ label: element.name, id: element.id })
      })
  
      setdataModulesFiltred(listModules)
      setDataModuleSelected(undefined)
    }
    setRefreshKey(oldKey => oldKey + 1)

    
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setOpenSnackbarsGroupe(false)
    setOpenSnackbarsFormation(false)
    setOpenSnackbarsModule(false)
    setOpenSnackbarsShare(false)
  }

  useEffect(() => {
    const getData = async () => {
      let response = await getFormation()
      let formationsList = []
      response.formations.forEach(element => {
        formationsList.push({ label: element.name, id: element.id })
      })
      //console.log('rep', formationsList)
      setDataFormation(formationsList)
    

      response = await getGroupes()
      //console.log('rep', response.groupes)
      setDataGroupe(response.groupes)

      if(formationSelected != null){
      response = await getModules(token, formationSelected)

      let modules = []
      response.modules.forEach(element => {
        modules.push({
          icon: <People />,
          label: element.name,
          id: element.id,
          id_formation: element.id_formation
        })
      })
      //console.log('rep M', modules)
      setdataModules(modules)
    }

    response = await getAffectation(token)
    //console.log('affectation',response)
    let aff=[]
    response.forEach(element => {
      var item = {data:element, label:"["+element.formation.name+"] "+element.groupe.name+" : "+element.module.name}
      aff.push(item)
    });
    setDataAffectation(aff)

    setAdminUser(await UsersManager.getUsers({token:token},0))
    setShare(await ModuleManager.getShare({token:token}))


    }
    if (props.rank == 0)
      getData()
  }, [refreshKey])

  if (props.rank != 0) return <></>

  return (
    <>
    <Snackbar
        open={shareModule}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity='success' sx={{ width: '100%' }}>
          Module partagé
        </Alert>
      </Snackbar>
      <Snackbar
        open={groupeAdded}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity='success' sx={{ width: '100%' }}>
          Groupe Ajouté
        </Alert>
      </Snackbar>
      <Snackbar
        open={formationAdded}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity='success' sx={{ width: '100%' }}>
          Formation Ajoutée
        </Alert>
      </Snackbar>
      <Snackbar
        open={moduleAdded}
        autoHideDuration={600}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity='success' sx={{ width: '100%' }}>
          Module Ajouté
        </Alert>
      </Snackbar>
      <Box sx={{ display: 'flex' }}>
        <Box
          sx={{
            pb: openConfig ? 2 : 0
          }}
        >
          <ListItemButton
            alignItems='flex-start'
            onClick={() => setOpenConfig(!openConfig)}
            sx={{
              px: 3,
              pt: 2.5,
              pb: openConfig ? 0 : 2.5,
              '&:hover, &:focus': {
                '& svg': { opacity: openConfig ? 1 : 0 }
              }
            }}
          >
            <ListItemText
              primary='Gestion'
              primaryTypographyProps={{
                fontSize: 15,
                fontWeight: 'large',
                lineHeight: '20px',
                mb: '2px'
              }}
              secondary='Formation Modules Evaluation...'
              secondaryTypographyProps={{
                noWrap: true,
                fontSize: 12,
                lineHeight: '16px',
                color: openConfig ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0.5)'
              }}
              sx={{ my: 0 }}
            />
            <KeyboardArrowDown
              sx={{
                transform: openConfig ? 'rotate(-180deg)' : 'rotate(0)',
                transition: '0.2s'
              }}
            />
          </ListItemButton>
          {openConfig &&
            data.map(item => (
              <ListItemButton
                key={item.label}
                sx={{ py: 0, minHeight: 32 }}
                onClick={handleClickOpenModal(item.label)}
              >
                <ListItemIcon sx={{ color: 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: 'medium'
                  }}
                />
              </ListItemButton>
            ))}
        </Box>
      </Box>
      <Dialog
        open={openModalFormation}
        onClose={handleCloseModalFormation}
        fullWidth
      >
        <DialogTitle>Formation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Avant d'ajouter une formation, assurez vous que celle-ci n'exite pas
            deja.
          </DialogContentText>
          <InputLabel id='demo-simple-select-helper-label' sx={{ my: 2 }}>
            Formation existante:
          </InputLabel>
          <Autocomplete
            disablePortal
            id='combo-box-demo'
            options={formations}
            sx={{ width: 300 }}
            renderInput={params => <TextField {...params} label='Formation' />}
          />
          <DialogContentText sx={{ my: 2 }}>
            Si vous n'avez pas trouvé la formation voulu, vous pouvez la créer:
          </DialogContentText>
          <Box sx={{ my: 2 }}>
            <TextField
              autoFocus
              margin='dense'
              id='name'
              name='formationName'
              label='Formation:'
              type='text'
              fullWidth
              onChange={handleFormationNameChange}
              variant='standard'
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModalFormation}>Annuler</Button>
          <Button onClick={handleCloseAndValidateModalFormation}>
            Valider
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openModalGroupe} onClose={handleCloseModalGroupe} fullWidth>
        <DialogTitle>Groupe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Avant d'ajouter un groupe, assurez vous que celui-ci n'exite pas
            deja.
          </DialogContentText>

          <InputLabel id='demo-simple-select-helper-label' sx={{ my: 2 }}>
            Formation existante:
          </InputLabel>
          <div>
            <Autocomplete
              sx={{ my: 2 }}
              fullWidth
              id='combo-box-demo'
              options={formations}
              
              onChange={handleSelectedFormation}
              variant='outlined'
              renderInput={params => (
                <TextField {...params} label='Formation' />
              )}
            />
            <Autocomplete
              sx={{ my: 2 }}
              fullWidth
              disablePortal
              id='combo-box-demo'
              onChange={handleSelectedgroupe}
              options={GroupeFiltre}
              variant='outlined'
              renderInput={params => <TextField {...params} label='Groupe' />}
            />
          </div>

          <Box sx={{ my: 2 }}>
            <DialogContentText sx={{ my: 4 }}>
              Générer un code d'adhésion :
              {
                groupeSelected==null?"Selectionner un groupe": <IconButton     component="span" onClick={handleAddGroupeCode}> <GroupAddRoundedIcon /> </IconButton>
              }
             
            </DialogContentText>
             
          </Box>

          <Box sx={{ my: 2 }}>
            <DialogContentText sx={{ my: 4 }}>
              Si vous n'avez pas trouvé le groupe voulu, vous pouvez le créer:
            </DialogContentText>
            <TextField
              autoFocus
              margin='dense'
              id='name'
              name='groupeName'
              disabled={Boolean(formationSelected == null)}
              label={formationSelected == null ? 'Séléctionner une formation ' : 'Nouveau groupe pour ' + formationSelected.label}
              type='text'
              fullWidth
              onChange={handleGroupeNameChange}
              variant='standard'
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModalGroupe}>Annuler</Button>
          <Button onClick={handleCloseAndValidateModalGroupe}>Valider</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openModalModule} onClose={handleCloseModalModule} fullWidth>
        <DialogTitle>Modules</DialogTitle>

        <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={tabValue}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList
                onChange={handleChangeTab}
                aria-label='lab API tabs example'
              >
                <Tab label='Nouveau Module' value='1' />
                <Tab label='Affectation' value='2' />
                <Tab label='Gestion' value='3' />
                <Tab label='Partager' value='4' />
              </TabList>
            </Box>
            <TabPanel value='1'>
              <DialogContent>
                <DialogContentText>
                  Avant d'ajouter un module, assurez vous que celui-ci n'exite
                  pas deja.
                </DialogContentText>

                <InputLabel id='demo-simple-select-helper-label' sx={{ my: 2 }}>
                  Formation existantes:
                </InputLabel>
                <div>
                  <Autocomplete
                    sx={{ my: 2 }}
                    fullWidth
                    id='combo-box-demo'
                    options={formations}
                    value={formationSelected}
                    onChange={handleSelectedFormation}
                    variant='outlined'
                    renderInput={params => (
                      <TextField {...params} label='Formation' />
                    )}
                  />
                  <InputLabel
                    id='demo-simple-select-helper-label'
                    sx={{ my: 2 }}
                  >
                    Modules existants:
                  </InputLabel>
                  <Autocomplete
                    sx={{ my: 2 }}
                    fullWidth
                    disablePortal
                    id='combo-box-demo'
                    value={moduleSelected}
                    options={dataModulesFiltred}
                    variant='outlined'
                    renderInput={params => (
                      <TextField {...params} label='Modules' />
                    )}
                  />
                </div>

                <Box sx={{ my: 2 }}>
                  <DialogContentText sx={{ my: 4 }}>
                    Si vous n'avez pas trouvé le groupe voulu, vous pouvez le
                    créer:
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin='dense'
                    id='name'
                    name='moduleName'
                    disabled={Boolean(formationSelected == null)}
                    label={formationSelected == null ? 'Selectionner une formation ' : 'Nouveau module pour ' + formationSelected.label}
                    type='text'
                    fullWidth
                    onChange={handleModuleNameChange}
                    variant='standard'
                  />
                  <TextareaAutosize
                    minRows={3}
                    disabled={formationSelected == null}
                    placeholder="Résumé"
                    fullWidth
                    onChange={handleModuleResumeChange}
                    style={{ width: "100%" }}
                  />
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseModalModule}>Annuler</Button>
                <Button onClick={handleCloseAndValidateModalModule}>
                  Valider
                </Button>
              </DialogActions>
            </TabPanel>
            <TabPanel value='2'>
              <DialogContent>
                <DialogContentText>
                  Ajouter un groupe a un module :
                </DialogContentText>

                <Autocomplete
                  sx={{ my: 2 }}
                  fullWidth
                  id='combo-box-demo'
                  options={formations}
                  
                  onChange={handleSelectedFormation}
                  variant='outlined'
                  renderInput={params => (
                    <TextField {...params} label='Formation' />
                  )}
                />
                <Autocomplete
                  sx={{ my: 2 }}
                  fullWidth
                  disablePortal
                  id='combo-box-demo'
                  value={groupeSelected}
                  onChange={handleSelectedgroupe}
                  options={GroupeFiltre}
                  variant='outlined'
                  renderInput={params => (
                    <TextField {...params} label='Groupe' />
                  )}
                />
                <Autocomplete
                  sx={{ my: 2 }}
                  fullWidth
                  disablePortal
                  id='combo-box-demo'
                  value={moduleSelected}
                  options={dataModulesFiltred}
                  onChange={handleSelectedModule}
                  variant='outlined'
                  renderInput={params => (
                    <TextField {...params} label='Modules' />
                  )}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseModalModule}>Annuler</Button>
                <Button onClick={handleCloseAndValidateModalAffectation}>
                  Valider
                </Button>
              </DialogActions>
            </TabPanel>
            <TabPanel value='3'>
              <DialogContent>
                <DialogContentText>
                  Supprimer une affectation:
                </DialogContentText>

                <Autocomplete
                  sx={{ my: 2 }}
                  fullWidth
                  id='combo-box-demo'
                  options={affectation}
                  value={affectationSelected}
                  onChange={handleSelectedAffectation}
                  variant='outlined'
                  renderInput={params => (
                    <TextField {...params} label='Affectation' />
                  )}
                />
                <DialogActions>
                  <Button onClick={handleCloseandDelModalModule}>Supprimer</Button>
                </DialogActions>
                <DialogContentText>Renomer un module</DialogContentText>
                <Autocomplete
                  sx={{ my: 2 }}
                  fullWidth
                  id='combo-box-demo'
                  options={formations}
                  
                  onChange={handleSelectedFormation}
                  variant='outlined'
                  renderInput={params => (
                    <TextField {...params} label='Formation' />
                  )}
                />
                <Autocomplete
                  sx={{ my: 2 }}
                  fullWidth
                  disablePortal
                  id='combo-box-demo'
                  
                  options={dataModulesFiltred}
                  onChange={handleSelectedModule}
                  variant='outlined'
                  renderInput={params => (
                    <TextField {...params} label='Modules' />
                  )}
                />
                <TextField
                  autoFocus
                  margin='dense'
                  id='name'
                  name='moduleName'
                  disabled={Boolean(moduleSelected == null)}
                  label={moduleSelected == null ? 'Selectionner un module ' : 'Nouveau module pour ' + moduleSelected.label}
                  type='text'
                  fullWidth
                  onChange={handleModuleNameChange}
                  variant='standard'
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseModalUpdateModule}>Modifier</Button>
              </DialogActions>
              <DialogActions>
                <Button onClick={handleCloseModalModule}>Fermer</Button>
              </DialogActions>
            </TabPanel>
            <TabPanel value='4'>
              <DialogContent>
                <DialogContentText>
                  Partager le module:
                </DialogContentText>
                <Autocomplete
                  sx={{ my: 2 }}
                  fullWidth
                  id='combo-box-demo'
                  options={formations}
                  
                  onChange={handleSelectedFormation}
                  variant='outlined'
                  renderInput={params => (
                    <TextField {...params} label='Formation' />
                  )}
                />
                <Autocomplete
                  sx={{ my: 2 }}
                  fullWidth
                  disablePortal
                  id='combo-box-demo'
                  
                  options={dataModulesFiltred}
                  onChange={handleSelectedModule}
                  variant='outlined'
                  renderInput={params => (
                    <TextField {...params} label='Modules' />
                  )}
                />
                <Autocomplete
                  sx={{ my: 2 }}
                  fullWidth
                  id='combo-box-demo'
                  options={adminUser}
                  onChange={handleAdminShare}
                  variant='outlined'
                  renderInput={params => (
                    <TextField {...params} label='Utilisateur...' />
                  )}
                />
                <DialogActions>
                  <Button onClick={handleCloseandShareModule}>Partager</Button>
                </DialogActions>
                <DialogContentText>Arreter un partage</DialogContentText>
                <Autocomplete
                  sx={{ my: 2 }}
                  fullWidth
                  id='combo-box-demo'
                  options={share}
                  inputValue={selecteShare}
                  onChange={handleSelectedShare}
                  variant='outlined'
                  renderInput={params => (
                    <TextField {...params} label='Partage...' />
                  )}
                />
                
              </DialogContent>
              <DialogActions>
                <Button onClick={handleStopShare}>Arreter</Button>
                <Button onClick={handleStopShare}>Arreter tous les partages</Button>
              </DialogActions>

              <DialogActions>
                <Button onClick={handleCloseModalModule}>Fermer</Button>
              </DialogActions>
            </TabPanel>
          </TabContext>
        </Box>
      </Dialog>

      <Dialog
        PaperProps={{
          sx: {
            maxHeight: '100vh'
          }
        }}
        maxWidth='xl'
        open={openModalRessource}
        onClose={handleCloseModalRessources}
        fullWidth
      >
        <DialogTitle>Ressources</DialogTitle>

        <Box>
          <TabContext value={tabRessourcesValue}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList
                onChange={handleChangeTabRessources}
                aria-label='lab API tabs example'
              >
                <Tab label='Ressources existantes' value='1' />
                <Tab label='Edition' value='2' disabled={ressourceIdEdition==null} />
                <Tab label='Nouvelle ressource' value='3' />
                <Tab label='Media' value='4' />
              </TabList>
            </Box>
            <TabPanel value='1'>
              <DialogContent>
                <DialogContentText>
                  Liste des ressources disponible
                </DialogContentText>
                <Box style={{ display: 'flex' }}>
                  <Autocomplete
                    style={{ width: '4O%', flex: '1', 'margin-right': '20px' }}
                    id='combo-box-demo'
                    options={formations}
                 
                    onChange={handleSelectedFormation}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Formation'
                        variant='standard'
                      />
                    )}
                  />

                  <Autocomplete
                  
                    style={{ width: '40%', float: 'right', flex: '1' }}
                    disablePortal
                    id='combo-box-demo'
                    options={dataModulesFiltred}
                    onChange={handleSelectedModule}
                    variant='outlined'
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Modules'
                        variant='standard'
                      />
                    )}
                  />
                </Box>
                <Box>
                  <RessourcesTable token={token} groupes={groupes} handleEdition={handleEdition} formation={formationSelected} module={moduleSelected}/>
                </Box>

                <Box sx={{ my: 2 }}></Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseModalRessources}>Fermer</Button>
              </DialogActions>
            </TabPanel>
            <TabPanel value='2'>
            <DialogContent>
                <Box>
                <Box style={{ display: 'flex', width: '50%', float:"left" }}>
                  <Autocomplete
                    style={{ width: '300px', flex: '1', 'margin-right': '20px' }}
                    id='combo-box-demo'
                    options={formations}
                 
                    onChange={handleSelectedFormation}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Formation'
                        variant='standard'
                      />
                    )}
                  />

                  <Autocomplete
                    style={{ width: '30%', float: 'right', flex: '1' }}
                    disablePortal
                    id='combo-box-demo'
                    options={dataModulesFiltred}
                    onChange={handleSelectedModule}
                    variant='outlined'
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Modules'
                        variant='standard'
                      />
                    )}
                  />
                  
                </Box>
                                </Box>

                <CreationRessource token={token} module={moduleSelected} groupe={GroupeFiltre} ressourceIdEdition={ressourceIdEdition} />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseModalRessource}>Annuler</Button>
              </DialogActions>
            </TabPanel>
            <TabPanel value='3'>
              <DialogContent>
                <Box>
                <Box style={{ display: 'flex', width: '50%', float:"left" }}>
                  <Autocomplete
                    style={{ width: '300px', flex: '1', 'margin-right': '20px' }}
                    id='combo-box-demo'
                    options={formations}
                 
                    onChange={handleSelectedFormation}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Formation'
                        variant='standard'
                      />
                    )}
                  />

                  <Autocomplete
                    style={{ width: '30%', float: 'right', flex: '1' }}
                    disablePortal
                    id='combo-box-demo'
                    options={dataModulesFiltred}
                    onChange={handleSelectedModule}
                    variant='outlined'
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Modules'
                        variant='standard'
                      />
                    )}
                  />
                  
                </Box>
                                </Box>
                       
                <CreationRessource token={token} module={moduleSelected} groupe={GroupeFiltre} />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseModalRessource}>Annuler</Button>
              </DialogActions>
            </TabPanel>
            <TabPanel value='4'>
              <DialogContent>
                <DialogContentText>Medias</DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseModalRessource}>Fermer</Button>
              </DialogActions>
            </TabPanel>
          </TabContext>
        </Box>
      </Dialog>


      <Dialog
        open={openModalCodeGroupe}
        onClose={handleCloseCodeGroupe}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Code d'affectation
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Box
            
            sx={{
              mx: 'auto',
              width: 400,
              p: 1,
              m: 1,
              bgcolor: (theme) =>
                theme.palette.mode === 'dark' ? '#101010' : 'grey.50',
              color: (theme) =>
                theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
              border: '1px solid',
              borderColor: (theme) =>
                theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
              borderRadius: 2,
              textAlign: 'center',
              fontSize: '0.875rem',
              fontWeight: '700',
            }}
            >
            Entrer le code 

            <Typography sx={{fontSize: '0.975rem', fontWeight: '800',}} variant="button" display="block" gutterBottom>{codeGroupe} </Typography>
            

            dans "Mon Compte" / "Mes groupes"
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCodeGroupe}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
