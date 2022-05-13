import ConfigData from "./configuration.json";

async function getMyRessource(token){
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
    //console.log(response)
  }
  if (response.status == 401) {
    localStorage.removeItem('token')
    window.location.reload(false)
  }
  const result = await response.json()
  return result
}

async function getRessourceShare(token){
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
    ConfigData.SERVER_URL + '/ressourceshare',
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
 
async function updateRessourceSetting(token,ressource,groupe,value,type){
  const requestOptions = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'x-access-token': token,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ressource: ressource, value:value, type:type, groupe:groupe })
  }
  const response = await fetch(
    ConfigData.SERVER_URL + '/ressource/updatesetting',
    requestOptions
  )
  if (!response.ok) {
    //localStorage.removeItem('token')
    //window.location.reload(false)
    //console.log(response)
  }
  if (response.status == 401) {
    //localStorage.removeItem('token')
    //window.location.reload(false)
  }

  const result = await response.json()
  return result
}

async function updateRessource(token,ressource,value,type){
  const requestOptions = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'x-access-token': token,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ressource: ressource, value:value, type:type})
  }
  const response = await fetch(
    ConfigData.SERVER_URL + '/ressource/update',
    requestOptions
  )
  if (!response.ok) {
    //localStorage.removeItem('token')
    //window.location.reload(false)
    //console.log(response)
  }
  if (response.status == 401) {
    //localStorage.removeItem('token')
    //window.location.reload(false)
  }

  const result = await response.json()
  return result
}


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
      //console.log(response)
    }
    if (response.status == 401) {
      localStorage.removeItem('token')
      window.location.reload(false)
    }
    const result = await response.json()
    return result
}


export { getMyRessource,trash,getRessourceShare, updateRessource, updateRessourceSetting };
