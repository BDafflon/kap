

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
    return data
  }