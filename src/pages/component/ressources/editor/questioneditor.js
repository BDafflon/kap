import React, { useState } from 'react'
import { useEffect } from 'react'
import { useFormik } from 'formik'
import Paper from '@mui/material/Paper'
import DatePicker from '@mui/lab/DatePicker'
import TextField from '@mui/material/TextField'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import EditorContext from './editor'
import { MarkedInput } from './markedInput'
import { Result } from './result'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Container, Draggable } from 'react-smooth-dnd'
import ConfigData from '../../../../utils/configuration.json'
import { Button } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import InputAdornment from '@mui/material/InputAdornment'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import VisibilityIcon from '@mui/icons-material/Visibility'
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck'
import IsoIcon from '@mui/icons-material/Iso'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import Rating from '@mui/material/Rating'
import QuestionRapide from './questions/questionrapide'
import QuestionLongue from './questions/questionlongue'
import QuestionQCM from './questions/questionqcm'
import QuestionList from './questions/questionlist'
import QuestionFile from './questions/questionFile'
import QuestionSansQuestion from "./questions/questionsansquestion";
import Switch from '@mui/material/Switch'

const commonStyles = {
  bgcolor: 'background.paper',
  border: 1,
  my: 2
}

const applyDrag = (arr, dragResult) => {
  console.log('drag', arr)
  const { removedIndex, addedIndex, payload } = dragResult
  if (removedIndex === null && addedIndex === null) return arr

  const result = [...arr]
  let itemToAdd = payload

  if (removedIndex !== null) {
    itemToAdd = result.splice(removedIndex, 1)[0]
  }

  if (addedIndex !== null) {
    result.splice(addedIndex, 0, itemToAdd)
  }
  console.log('resDrag', result)
  return result
}

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  boxShadow:"none",
  color: theme.palette.text.secondary
}))

function GetQuestion (props) {
  if (props.typeQuestion.type == '-1') {
    return (
      <Box fullWidt sx={{ p:2,  textAlign: 'center'}}>
         <Stack direction="row" spacing={0} alignItems="center">
        <Item>Nouvelle page :</Item>
        <Item> 
          <TextField
            onChange={props.handle(
              props.index,
              props.typeQuestion.question,
              'onchange',
              'question'
            )}
            id='input-with-icon-textfield'
            label='Nom de la page'
            size='small'
            variant='outlined'
          />
          </Item>
        <Item>
        <FormControlLabel control={
            <Checkbox 
              checked={props.typeQuestion.checked}
             
              inputProps={{ 'aria-label': 'controlled' }}
            />} label="Question aleatoire" />
        </Item>
        <Item>
        <TextField
              value={props.typeQuestion.nbQuestion}
                
              id='standard-number'
              label='Nombre de question mini'
              type='number'
              InputLabelProps={{
                shrink: true
              }}
              variant='standard'
            />
        </Item>
        <Item>
        <Button
            sx={{ ml: 0 }}
            onClick={props.handle(
              props.index,
              props.typeQuestion.question,
              'sup',
              ''
            )}
            startIcon={<DeleteIcon />}
          >
            Supprimer
          </Button>
        </Item>
      </Stack>
 
          
      </Box>
    )
  }

  if (props.typeQuestion.type == '0') {
    return <QuestionRapide props={props} />
  }
  if (props.typeQuestion.type == '1') {
    return <QuestionLongue props={props} />
  }
  if (props.typeQuestion.type == '2') {
    return <QuestionQCM props={props} />
  }
  if (props.typeQuestion.type == '3') {
    return <QuestionList props={props} />
  }
  if (props.typeQuestion.type == '4') {
    return <QuestionFile props={props} />
  }
  if (props.typeQuestion.type == '6') {
    return <QuestionSansQuestion props={props} />
  }

  return <h1>Error </h1>
}

function reload () {
  console.log('reload', JSON.parse(localStorage.getItem('questionSave')))
  var q = JSON.parse(localStorage.getItem('questionSave'))
  if (q == null)
    return []
  return q
}

export default function QuestionEditor ({
  token,
  handleLastFocus,
  savehandle,
  type
}) {
  const [listQuestion, setListQuestion] = React.useState([...reload()])
  const [typeQuestion, setTypeQuestion] = React.useState(0)
  const [updatekey, setRefreshKey] = React.useState(0)
  const [nbQuestion, setNbQuestion] = React.useState()
  const [checked, setChecked] = React.useState(true)
  const [markdownText, setMarkdownText] = useState('')

  const contextValue = {
    markdownText,
    setMarkdownText
  }

  console.log('QuestionEditor', listQuestion)

  const handleAddQuestion = param => e => {
    var item = {
      id: listQuestion.length,
      type: typeQuestion,
      question: '',
      reponse: '',
      indice: '',
      barem: '',
      rating: '',
      Requis: true
    }
    setListQuestion([...listQuestion, item])
    console.log('listQuestion', listQuestion)
  }
  const handleType = event => {
    const {
      target: { value }
    } = event

    setTypeQuestion(value)
  }

  const handleQuestionChild = (index, target, action, field) => e => {
    console.log('handle child ->', index, ' ', listQuestion[index][field])

    if (action == 'sup') {
      console.log('listQuestion', listQuestion)
      var listeQ = [...listQuestion]
      listeQ.splice(index, 1)
      console.log('listQuestion', listeQ)
      setListQuestion(listeQ)
      return
    } else {
      if (action == 'upload') {
        value = listQuestion[index][field]
      } else {
        if (field == 'Requis') {
          var value = !listQuestion[index][field]
        } else {
          var {
            target: { value }
          } = e
        }
      }
    }

    listQuestion[index][field] = value
    setListQuestion(listQuestion)
    console.log('handle child', listQuestion[index][field])

    savehandle(listQuestion, nbQuestion, checked)
    setRefreshKey(oldKey => oldKey + 1)
  }

  const handleChange = event => {
    var a = event.target.checked
   
    console.log('handleChange', checked, a)
    setChecked(a)
    savehandle(listQuestion,nbQuestion,a)
  }

  const handleNBChange = event => {
    var a = event.target.value
    
    setNbQuestion(event.target.value)
    console.log('handleNBChange', nbQuestion, a)

    savehandle(listQuestion,event.target.value,checked)
  }

  return (
    <>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Select
              onChange={e => {
                handleType(e)
              }}
              label='Type'
              id='demo-multiple-name'
              placeholder='Type de question'
              fullWidth
            >
               
              <MenuItem key='-1' value='-1' disabled={type==6}>
                Pagination
              </MenuItem>
              <MenuItem key='0' value='0'>
                Question / réponse courte
              </MenuItem>
              <MenuItem key='1' value='1'>
                Question / réponse longue
              </MenuItem>
              <MenuItem key='2' value='2'>
                QCM
              </MenuItem>
              <MenuItem key='3' value='3'>
                Liste a ordonner
              </MenuItem>
              <MenuItem key='4' value='4'>
                Fichier a rendre
              </MenuItem>
              
              <MenuItem key='6' value='6'>
                Texte (sans question)
              </MenuItem>
            </Select>
          </Grid>

          <Grid item xs={3}>
            <Button
              fullWidth
              size='medium'
              variant='contained'
              onClick={handleAddQuestion('new')}
            >
              Ajouter une question{' '}
            </Button>
          </Grid>
          <Grid item xs={2}>
          
          </Grid>
        </Grid>
      </Box>
      <Box>
        <Container
          lockAxis='y'
          onDrop={e => setListQuestion(applyDrag(listQuestion, e))}
        >
          {listQuestion.map((item, index) => (
            <Draggable key={item.id}>
              <Box sx={{ ...commonStyles, borderColor: 'grey.500' }}>
                <GetQuestion
                  typeQuestion={item}
                  handleLastFocus={handleLastFocus}
                  token={token}
                  index={index}
                  updatekey={updatekey}
                  handle={handleQuestionChild}
                  updatekey={updatekey}
                />
              </Box>
            </Draggable>
          ))}
        </Container>
      </Box>
    </>
  )
}
