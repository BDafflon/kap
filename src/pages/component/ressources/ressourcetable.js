import * as React from 'react'
import { useEffect } from 'react'

import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import Switch from '@mui/material/Switch'
import DatePicker from '@mui/lab/DatePicker'
import TextField from '@mui/material/TextField'
import { ViewArray } from '@mui/icons-material'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import Autocomplete from '@mui/material/Autocomplete'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import Button from '@mui/material/Button'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import ConfigData from '../../../utils/configuration.json'
import typeRessource from '../../../utils/typeressources'
import * as RessourcesManager from "../../../utils/ressourceManager"
import * as GroupManager from "../../../utils/groupManager"
import SettingsIcon from '@mui/icons-material/Settings';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Typography } from '@mui/material'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import WifiIcon from '@mui/icons-material/Wifi';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';

function parseGroup (groupes) {
   
  groupes.forEach(element => {
    console.log("element",element)
    element.label= element.groupe.name 
  })
  return groupes
}

const columns = [
  { id: 'action', label: 'Action', minWidth: 50, align: 'left' },
  { id: 'name', label: 'Nom', minWidth: 200, align: 'left' },
  { id: 'code', label: 'Type', minWidth: 50, align: 'left' },
  { id: 'module', label: 'Module', minWidth: 50, align: 'left' },
  {
    id: 'groupes',
    label: 'Groupes',
    minWidth: 310,
    align: 'left',
    format: value => value.toFixed(2)
  },
  { id: 'action', label: 'Gestion permission', minWidth: 30, align: 'left' },

]
 

function createData (
  name,
  code,
  module,
  
  groupe,
  idModule,
  idRessource,
  content,
  setting
) {
  return {
    name,
    code,
    module,
    
    groupe,
    idModule,
    idRessource,
    content,
    setting
  }
}

function loadGroupe (groupes) {
  var g = {}
  g['12'] = [
    { name: '1A02', idGroupe: 1 },
    { name: '1A03', idGroupe: 2 }
  ]
  g['33'] = [
    { name: '1A02', idGroupe: 1 },
    { name: '1A03', idGroupe: 2 }
  ]
  return g
}

function convertType (type) {
  //console.log('type', type)
  return typeRessource(type)
}

export default function RessourcesTable ({ token, groupes, handleEdition, formation, module }) {
  //console.log('RessourcesTable', handleEdition)

  const [openSettingRessource, setOpenSettingRessource] = React.useState(false)
  const [currentRessource, setCurrentRessource] = React.useState()
  const [updater, setUpdater] = React.useState(0)
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [selectedGroupe, setGroupeSelected] = React.useState([])
  const [allGroupe, setAllGroupe] = React.useState([])
  const [rows, setRows] = React.useState([])
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }
 


  useEffect(() => {

    const fetchData = async () => {
      console.log("ressource tab",module)
      const result1 = await RessourcesManager.getMyRessource(token)
      const result2 = await RessourcesManager.getRessourceShare(token)
      const result = result1.concat(result2);
      var data = []
      result.forEach(element => {
        var dataGroupe = []
        if (element.groupes == null) element.groupes = []
        else {
          element.groupes = JSON.parse(element.groupes.replace(/'/g, '"'))

          element.groupes.forEach(e => {
            //console.log('eee', e,element)
            var item = {
              label: e.label,
              id: e.id
            }
            dataGroupe.push(item)
          })
        }

        var item = createData(
          element.titre,
          element.type,
          element.module,
          
          dataGroupe,
          element.id_module,
          element.id,
          element.content,
          element.setting
        )

        
        if(module != undefined){
          if(module.id==element.id_module){
            data.push(item)
          }
        }else{
          data.push(item)
        }
        
      })
      console.log('useEffectTable', data)
      if(module != undefined)
        setAllGroupe(parseGroup(await GroupManager.getGroupesByModule(token,module)))
      setRows(data)
    }

    // call the function
    fetchData()
      // make sure to catch any error
      .catch(console.error)
  }, [updater,module])

  const setDateOuverture = (idRessource, newDate) => {
    //console.log(idRessource, newDate)
  }
  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const handleDetail = param => e => {
    //console.log('ckickD', param, e)
    handleEdition(param)
  }

  const permisson = param => e=>{
    console.log(param)
    setCurrentRessource(param)
    setOpenSettingRessource(true)
  }
  const handleTrash =  param => async e =>  {
    //console.log('ckickD', param, e)
    await RessourcesManager.trash(param["code"],param["idRessource"],token)
    setUpdater(oldKey => oldKey + 1)

  }

  const handleChangeVisibility = param => e => {
    //console.log('ckick', param, e)
  }

  const handleSelectedGroupe = param => async(e, val) => {
    console.log('ckick Groupe', param,  val)

    await RessourcesManager.updateRessource(token,param,undefined,val,"groupes")
  }


  const handleClose = () => {
    setOpenSettingRessource(false);
  };

  const handleDate = (p,type) => async e => {
    
    var t =
      new Date(
        e.getFullYear(),
        e.getMonth(),
        e.getDate()
      ) / 1000;
      console.log(e,t,p)       
      
      var rep = await RessourcesManager.updateRessourceSetting(token,currentRessource,p,t,type)    
      console.log("currentRessource",currentRessource,rep)  
      currentRessource.setting[rep.id_groupe].dateO = rep.dateO
      currentRessource.setting[rep.id_groupe].dateF = rep.dateF
      setUpdater(oldKey => oldKey + 1)      
  }

  return (
    <>
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(row => {
                //console.log('row', row)
                return (
                  <TableRow hover role='checkbox' tabIndex={-1} key={row.code}>
                    <TableCell align={row['align']}>
                      <Button onClick={handleDetail(row)}>
                        <ZoomInIcon />
                      </Button>

                      <Button onClick={handleTrash(row)}>
                        <DeleteForeverIcon />
                      </Button>
                    </TableCell>
                    <TableCell key={columns[0].id} align={row['align']}>
                      {row['name']}
                    </TableCell>
                    <TableCell align={row['align']}>
                      {convertType(row['code'])}
                    </TableCell>
                    <TableCell align={row['align']}>{row['module']}</TableCell>
                    
                     
                    <TableCell>
                      <Autocomplete
                        multiple
                        limitTags={2}
                        id='multiple-limit-tags'
                        options={allGroupe}
                        onChange={handleSelectedGroupe(row)}
                        getOptionLabel={option => option.label}
                        defaultValue={row['groupe']}
                        renderInput={params => (
                          <TextField {...params} label='Groupe' />
                        )}
                      />
                    </TableCell>
                    <TableCell align={row['align']}>
                      

                      <Button >
                        <SettingsIcon  onClick={permisson(row)}/>
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>


    <Dialog
        open={openSettingRessource}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
      >
        <DialogTitle id="alert-dialog-title">
          {currentRessource!=undefined?currentRessource.name:"Erreur"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          <List
      sx={{ width: '100%', maxWidth: 750, bgcolor: 'background.paper' }}
      subheader={<ListSubheader>Permission</ListSubheader>}
    >
      {console.log("allGroupe",allGroupe,currentRessource)}
      {allGroupe==undefined?"Aucun groupe affecté":allGroupe.map((g, i) => (
             
             
              <Stack
  direction="row"
  divider={<Divider orientation="vertical" flexItem />}
  spacing={2}
>
{console.log("currentRessource.setting[g.groupe.id]",currentRessource!=undefined?currentRessource.setting[g.groupe.id]:"")}
<AccessTimeIcon /> 
<ListItemText id="switch-list-label-wifi" primary={"["+g.formation.name+"] "+g.groupe.name}  />
<LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      fullWidth
                      label="Date Ouverture"
                      inputFormat="dd/MM/yyyy"
                      value={currentRessource!=undefined?currentRessource.setting[g.groupe.id].dateO * 1000:0}
                      onChange={handleDate(g,"dateO")}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      fullWidth
                      value={currentRessource!=undefined?currentRessource.setting[g.groupe.id].dateF * 1000:0}
                      label="Date Fermeture"
                      onChange={handleDate(g,"dateF")}
                      inputFormat="dd/MM/yyyy"
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
</Stack>
             
              
            
            ))}
      
       
    </List>

            
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
