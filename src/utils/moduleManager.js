import ConfigData from "./configuration.json";

async function share(token,module,admin) {
   console.log("share",token,module,admin)
   const requestOptions = {
    method: "GET",
    mode: "cors",
    headers: {
      "x-access-token": token.token,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  const response = await fetch(
    ConfigData.SERVER_URL + "/share/"+module.id+"/"+admin.id,
    requestOptions
  );
  if (!response.ok) {
    //localStorage.removeItem("token");
    //window.location.reload(false);
    //console.log(response);
  }
  if (response.status == 401) {
    //localStorage.removeItem("token");
    //window.location.reload(false);
  }
  const result = await response.json();

}


async function stopShare(token,share) {
  const requestOptions = {
    method: "GET",
    mode: "cors",
    headers: {
      "x-access-token": token.token,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  const response = await fetch(
    ConfigData.SERVER_URL + "/stopshare/"+share.module.id+"/"+share.user.id,
    requestOptions
  );
  if (!response.ok) {
    //localStorage.removeItem("token");
    //window.location.reload(false);
    //console.log(response);
  }
  if (response.status == 401) {
    //localStorage.removeItem("token");
    //window.location.reload(false);
  }
  return await getShare(token) 
}
  

async function getShare(token) {
  
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: {
        "x-access-token": token.token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(
      ConfigData.SERVER_URL + "/share",
      requestOptions
    );
    if (!response.ok) {
      //localStorage.removeItem("token");
      //window.location.reload(false);
      //console.log(response);
    }
    if (response.status == 401) {
      //localStorage.removeItem("token");
      //window.location.reload(false);
    }
    const result = await response.json();
    
    result.forEach((element) => {
        element.label = element.module.name+" : "+element.user.firstname + " - " + element.user.lastname;
      });

    
    return result;
  }
 

export { share, getShare, stopShare };
