
import ConfigData from "./configuration.json";

async function getResponse (idUer,idLive,idQuestion) {
  
    const requestOptions = {
      method: 'GET',
      mode: 'cors',
      headers: {
      
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }
    const response = await fetch(
      ConfigData.SERVER_URL + '/liveresponse/'+idUer+'/'+idLive+"/"+idQuestion,
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
   
    return result
  }

  export { getResponse };
