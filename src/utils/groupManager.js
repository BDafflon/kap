import ConfigData from "./configuration.json";

async function getGroupes(token){
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
    ConfigData.SERVER_URL + '/groupes',
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
 
async function getGroupesByModule(token,module){
  if(module == undefined) return []
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
    ConfigData.SERVER_URL + '/groupesbymodule/'+module.id,
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
  console.log("GManager",result)
  return result
}

export { getGroupes,getGroupesByModule};
