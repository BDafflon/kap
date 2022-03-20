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

async function trash(code,id,token){
  
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
      ConfigData.SERVER_URL + '/ressource/del/'+code+"/"+id,
      requestOptions
    )
    if (!response.ok) {
      localStorage.removeItem('token')
      window.location.reload(false)
      console.log(response)
    }
    if (response.status == 401) {
      localStorage.removeItem('token')
      window.location.reload(false)
    }
    const result = await response.json()
    return result
}

function parseGroup (groupes) {
  var groupeList = []
  groupes.forEach(element => {
    var item = { label: element.name, id: element.id }
    groupeList.push(item)
  })
  console.log('groupes', groupes, groupeList)
  return groupeList
}

const columns = [
  { id: 'action', label: 'Action', minWidth: 30, align: 'center' },
  { id: 'name', label: 'Nom', minWidth: 170, align: 'left' },
  { id: 'code', label: 'Type', minWidth: 50, align: 'center' },
  { id: 'module', label: 'Module', minWidth: 50, align: 'center' },
  {
    id: 'visible',
    label: 'Visible',
    minWidth: 30,
    align: 'center'
  },
  {
    id: 'dateOuverture',
    label: 'Date\u00a0Ouverture',
    minWidth: 100,
    align: 'center'
  },
  {
    id: 'dateFermeture',
    label: 'Date\u00a0Fermeture',
    minWidth: 100,
    align: 'center'
  },
  {
    id: 'groupes',
    label: 'Groupes',
    minWidth: 310,
    align: 'center',
    format: value => value.toFixed(2)
  }
]

function createDate (date) {
  let d = new Date(date * 1000)
  return d
}

function createData (
  name,
  code,
  module,
  visible,
  dateO,
  dateF,
  groupe,
  idModule,
  idRessource,
  content
) {
  return {
    name,
    code,
    module,
    visible,
    dateO,
    dateF,
    groupe,
    idModule,
    idRessource,
    content
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
  console.log('type', type)
  if (type == 0) return 'CM'
  if (type == 1) return 'TD'
  if (type == 2) return 'TP'
  if (type == 3) return 'Devoir'
  if (type == 4) return 'Evaluation'
  if (type == 5) return 'Auto-Evaluation'

  return 'undefined'
}

export default function RessourcesTable ({ token, groupes,handleEdition, formation, module }) {
  console.log('RessourcesTable', handleEdition)
  const [updater, setUpdater] = React.useState(0)
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [selectedGroupe, setGroupeSelected] = React.useState(
    parseGroup(groupes)
  )
  const [allGroupe, setAllGroupe] = React.useState(parseGroup(groupes))
  const [rows, setRows] = React.useState([])
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }
  console.log('RessourcesTable', allGroupe)
  useEffect(() => {

    const fetchData = async () => {
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
        ConfigData.SERVER_URL + '/mesressources',
        requestOptions
      )
      if (!response.ok) {
        localStorage.removeItem('token')
        window.location.reload(false)
        console.log(response)
      }
      if (response.status == 401) {
        localStorage.removeItem('token')
        window.location.reload(false)
      }
      const result = await response.json()

      // set state with the result

      var data = []
      result.forEach(element => {
        var dataGroupe = []
        if (element.groupes == null) element.groupes = []
        else {
          element.groupes = JSON.parse(element.groupes.replace(/'/g, '"'))

          element.groupes.forEach(e => {
            console.log('eee', e,element)
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
          true,
          element.dateO,
          element.dateF,
          dataGroupe,
          element.id_module,
          element.id,
          element.content
        )

        console.log("module",module,element)
        if(module != undefined){
          if(module.id==element.id_module){
            data.push(item)
          }
        }else{
          data.push(item)
        }
        
      })
      console.log('useEffectTable', result)
      setRows(data)
    }

    // call the function
    fetchData()
      // make sure to catch any error
      .catch(console.error)
  }, [updater,module])

  const setDateOuverture = (idRessource, newDate) => {
    console.log(idRessource, newDate)
  }
  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const handleDetail = param => e => {
    console.log('ckickD', param, e)
    handleEdition(param)
  }

  const handleTrash =  param => async e =>  {
    console.log('ckickD', param, e)
    await trash(param["code"],param["idRessource"],token)
    setUpdater(oldKey => oldKey + 1)

  }

  const handleChangeVisibility = param => e => {
    console.log('ckick', param, e)
  }

  const handleSelectedGroupe = param => (e, val) => {
    console.log('ckick Groupe', param, e, selectedGroupe[param], val)
  }

  return (
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
                console.log('row', row)
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
                    <TableCell align={row['align']}>
                      <Switch
                        checked={row['visible']}
                        onChange={handleChangeVisibility(row['idRessource'])}
                      />
                    </TableCell>
                    <TableCell align={row['align']}>
                      {console.log('Do', row['dateO'])}
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label='Date ouverture'
                          inputFormat='dd/MM/yyyy'
                          value={row['dateO']}
                          onChange={newValue => {
                            setDateOuverture(row['idRessource'], newValue)
                          }}
                          renderInput={params => <TextField {...params} />}
                        />
                      </LocalizationProvider>
                    </TableCell>
                    <TableCell>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          inputFormat='dd/MM/yyyy'
                          label='Date fermeture'
                          value={row['dateF']}
                          onChange={newValue => {
                            setDateOuverture(row['idRessource'], newValue)
                          }}
                          renderInput={params => <TextField {...params} />}
                        />
                      </LocalizationProvider>
                    </TableCell>
                    <TableCell>
                      <Autocomplete
                        multiple
                        limitTags={2}
                        id='multiple-limit-tags'
                        options={allGroupe}
                        onChange={handleSelectedGroupe(row['idRessource'])}
                        getOptionLabel={option => option.label}
                        defaultValue={row['groupe']}
                        renderInput={params => (
                          <TextField {...params} label='Groupe' />
                        )}
                      />
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
  )
}
