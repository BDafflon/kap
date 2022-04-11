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
import EditorContext from './editor/editor'
import { MarkedInput } from './editor/markedInput'
import { Result } from './editor/result'
import * as Yup from 'yup'
import Media from './editor/media'
import Button from '@mui/material/Button'
import ConfigData from '../../../utils/configuration.json'
import QuestionEditor from './editor/questioneditor'
import { type } from '@testing-library/user-event/dist/type'

async function getMedia (token) {
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
    ConfigData.SERVER_URL + '/medias',
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

async function editionRessource (
  token,
  module,
  formControl,
  markdownText,
  type,
  questionList,
  nbQuestion,
  questionAleatoire,
  ressourceIdEdition
) {

  var url = '/ressource/evaluation/edit'
  if (type <= 3) {
    url = '/ressource/edit'
  }
  const requestOptions = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'x-access-token': token,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      module: module,
      data: formControl,
      text: markdownText,
      type: type,
      questionList:questionList,
      nbQuestion:nbQuestion,
      questionAleatoire:questionAleatoire,
      ressourceIdEdition:ressourceIdEdition
    })
  }

  const response = await fetch(
    ConfigData.SERVER_URL + url,
    requestOptions
  )
  
  if (!response.ok) {
    localStorage.removeItem('token')
    window.location.reload(false);
  }
  if (response.status == 401) {
    localStorage.removeItem('token')
    window.location.reload(false);
  }
  const result = await response.json()
  //console.log(result)
  return result
}

async function registrationRessource (
  token,
  module,
  formControl,
  markdownText,
  type,
  questionList,
  nbQuestion,
  questionAleatoire
) {

  var url = '/ressource/evaluation/registration'
  if (type <= 3) {
    url = '/ressource/registration'
  }
  const requestOptions = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'x-access-token': token,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      module: module,
      data: formControl,
      text: markdownText,
      type: type,
      questionList:questionList,
      nbQuestion:nbQuestion,
      questionAleatoire:questionAleatoire
    })
  }

  const response = await fetch(
    ConfigData.SERVER_URL + url,
    requestOptions
  )
  
  if (!response.ok) {
    localStorage.removeItem('token')
    window.location.reload(false);
  }
  if (response.status == 401) {
    localStorage.removeItem('token')
    window.location.reload(false);
  }
  const result = await response.json()
  //console.log(result)
  return result
}

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary
}))



function save (question,nbQuestion,randomQuestion) {
  //console.log('save', question)
  localStorage.setItem('questionSave', JSON.stringify(question))
  localStorage.setItem('nbQuestion', JSON.stringify(nbQuestion))
  localStorage.setItem('randomQuestion', JSON.stringify(randomQuestion))

}

function GetForm (typeForm) {
   if (typeForm.typeForm <= 3) {
    return (
      <EditorContext.Provider value={typeForm.contextValue}>
        <Box>
          <MarkedInput
            size={300}
            handleLastFocus={typeForm.handleLastFocus}
            handle={typeForm.handleMediaRefresh}
            token={typeForm.token}
            content={typeForm.ressourceIdEdition.content}
          />
          <Result />
        </Box>
      </EditorContext.Provider>
    )
  }
 
   
  return (
    <QuestionEditor
      token={typeForm.token}
      handleLastFocus={typeForm.handleLastFocus}
      savehandle={save}
      type={typeForm.typeForm}
      
      
    />
  )
}

export default function CreationRessource ({ token, module, groupe, ressourceIdEdition }) {
   
 
  
  const [markdownText, setMarkdownText] = useState("")
  var actionTxt="Editer"
  if(ressourceIdEdition == undefined){
    var ressourceIdEdition={}
    ressourceIdEdition["update"]=false
    ressourceIdEdition.code= "0"
    var newValue = new Date();
    ressourceIdEdition.dateF= new Date(newValue.getFullYear(), newValue.getMonth(), newValue.getDate())/1000
    ressourceIdEdition.dateO= new Date(newValue.getFullYear(), newValue.getMonth(), newValue.getDate())/1000
    ressourceIdEdition.groupe=[]
    ressourceIdEdition.idModule=-1
    ressourceIdEdition.name=""
    ressourceIdEdition.visible=true
    actionTxt="Ajouter"
    ressourceIdEdition.content=""

  }
  else{
    ressourceIdEdition["update"]=true
    //console.log("code",ressourceIdEdition.content)
    if(ressourceIdEdition.code >3){
      for(var i=0; i<ressourceIdEdition.content.length;i++){
        ressourceIdEdition.content[i]["iddb"]=ressourceIdEdition.content["id"]
        ressourceIdEdition.content[i]["id"]=i
      }
      
    }
    //console.log("code",ressourceIdEdition.content)
  }

  


  //console.log("ressourceIdEdition",ressourceIdEdition)
 
  const [editionStat, setEdition] = useState(ressourceIdEdition)
  const [lastFocus, setLastFocus] = useState()
  const [medias, setMedia] = useState([])
  const [data, setData] = useState(module)
  const [updater, setUpdater] = useState(0)
  const [dataGroupe, setDataGroupe] = useState(groupe)
  const [action, setAction] = useState(actionTxt)

  const contextValue = {
    markdownText,
    setMarkdownText
  }

  const [formControl, setFormControl] = useState({
    titre: { value: ressourceIdEdition.name , touched: false },
    dateO: ressourceIdEdition.dateO,
    dateF: ressourceIdEdition.dateF,
    groupes: ressourceIdEdition.groupe
  })

  useEffect(() => {
    async function load () {
      setData(module)
      setDataGroupe(groupe)
      setMedia(await getMedia(token))
    }
    load()
  }, [module, groupe,updater])

  const [typeForm, setTypeForm] = React.useState(ressourceIdEdition.code)

  const handleLastFocus = param => e => {
    //console.log('handleLastFocus', param)
    
    setLastFocus(param)
  }

  const handleMediaRefresh = async m => {
    setMedia(await getMedia(token))
    //console.log('handleMediaRefresh :', medias)
  }
  const handleType = event => {
    const {
      target: { value }
    } = event

    setTypeForm(value)
    //console.log('handleType', formControl)
  }

  const handleSubmit = async event => {
    var questionList=JSON.parse(localStorage.getItem('questionSave'))
    
    var nbQ = (localStorage.getItem('nbQuestion')==null)  ?  0 : localStorage.getItem('nbQuestion')
    var qA = JSON.parse(localStorage.getItem('randomQuestion'))  
    nbQ = 0; //nbQ==undefined?0:nbQ

    //console.log('submit', module, formControl, markdownText,typeForm,questionList)
    
    if(ressourceIdEdition["update"]){
      var rep = await editionRessource(
      token,
      module,
      formControl,
      markdownText,
      typeForm,
      questionList,
      nbQ,
      qA,
      ressourceIdEdition)
    }
    else{
    var rep = await registrationRessource(
      token,
      module,
      formControl,
      markdownText,
      typeForm,
      questionList,
      nbQ,
      qA
    )
    }
    //console.log(rep)
    localStorage.removeItem('questionSave')
    window.location.reload(false);
  }

  const handleGroupeSelection = param => (e, val) => {
    //console.log('ckick Groupe', param, e, val)
    formControl.groupes = val
    setFormControl(formControl)
  }
  const handleForm = param => e => {
    const {
      target: { value }
    } = e

    formControl[param]['value'] = value
    setFormControl(formControl)
  }

  const handleFormBlur = param => e => {
    const {
      target: { value }
    } = e

    formControl[param]['touched'] = true
    setFormControl(formControl)
  }

  const handleMedia = param => e => {
    var f = ''
    //console.log("typeForm.typeForm ",typeForm )
    if (param.type == 'Document') {
      f = '[Document](' + ConfigData.SERVER_URL + '/media/' + param.id + ')'
    } else {
      f = '![img](' + ConfigData.SERVER_URL + '/media/' + param.id + ')'
    }
    if (typeForm <= 3) {
      //console.log("handleMedia",markdownText)
      setMarkdownText(markdownText + '\n' + f + '\n')
    } else {
       if(lastFocus[1]=='question'){
        lastFocus[2](f,"question")
       }else{
        lastFocus[2](f,"reponse")
       }
    }
   
  }

  return (
    <>
      <Box>
        <form>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <TextField
                error={Boolean(
                  formControl.titre.touched && formControl.titre.value == ''
                )}
                helperText={
                  formControl.titre.touched && formControl.titre.value == ''
                    ? 'Titre is required'
                    : ' '
                }
                onBlur={handleFormBlur('titre')}
                onChange={handleForm('titre')}
                label='Titre'
                margin='normal'
                defaultValue={formControl.titre.value}
                name='titre'
                fullWidth
                type='text'
                variant='outlined'
              />
              <Box sx={{ my: 2 }}>
                <GetForm
                  typeForm={typeForm}
                  handleLastFocus={handleLastFocus}
                  handleMediaRefresh={handleMediaRefresh}
                  token={token}
                  contextValue={contextValue}
                  ressourceIdEdition={ressourceIdEdition}
                />
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Select
                    defaultValue={typeForm}
                    sx={{ my: 2 }}
                    label='Type'
                    id='demo-multiple-name'
                    placeholder='Type'
                    onChange={e => {
                      handleType(e)
                    }}
                    fullWidth
                  >
                    <MenuItem key='0' value='0'>
                      CM
                    </MenuItem>
                    <MenuItem key='1' value='1'>
                      TD
                    </MenuItem>
                    
                    <MenuItem key='3' value='3'>
                      Devoir
                    </MenuItem>
                    <MenuItem key='5' value='5'>
                      TP/Compte rendu
                    </MenuItem>
                    <MenuItem key='4' value='4'>
                      Evaluation
                    </MenuItem>
                    
                    <MenuItem key='6' value='6'>
                      Auto-Evaluation
                    </MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    size='medium'
                    sx={{ my: 2 }}
                    variant='contained'
                    onClick={handleSubmit}
                  >
                    {action}
                  </Button>
                </Grid>
              </Grid>

              <Stack direction='row' spacing={2}>
                <Item>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      fullWidth
                      label='Date Ouverture'
                      inputFormat="dd/MM/yyyy"
                      value={formControl.dateO*1000}
                      onChange={newValue => {

                        var t = new Date(newValue.getFullYear(), newValue.getMonth(), newValue.getDate())/1000
                        formControl.dateO = t
                        setFormControl(formControl)
                        setUpdater(oldKey => oldKey + 1)
                      }}
                      renderInput={params => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </Item>
                <Item>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                       fullWidth
                       label='Date Fermeture'
                       inputFormat="dd/MM/yyyy"
                       value={formControl.dateF*1000}
                       onChange={newValue => {
 
                         var t = new Date(newValue.getFullYear(), newValue.getMonth(), newValue.getDate())/1000
                         formControl.dateF = t
                         setFormControl(formControl)
                         setUpdater(oldKey => oldKey + 1)
                       }}
                       renderInput={params => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </Item>
              </Stack>
              <Autocomplete
                sx={{ my: 2 }}
                multiple
                defaultValue={formControl.groupes}
                options={dataGroupe}
                onChange={handleGroupeSelection('new')}
                limitTags={2}
                id='multiple-limit-tags'
                renderInput={params => <TextField {...params} label='Groupe' />}
              />
              <Media
                handleMedia={handleMedia}
                updater={updater}
                medias={medias}
                token={token}
              />
            </Grid>
          </Grid>
        </form>
      </Box>
    </>
  )
}
