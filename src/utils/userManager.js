import ConfigData from "./configuration.json";

async function getUsers(token,rank) {
  console.log("getUsers",token, rank)
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
    ConfigData.SERVER_URL + "/users/"+rank,
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
 
  result.users.forEach((element) => {
    element.label = element.firstname + " - " + element.lastname;
  });
  
  console.log("getUsers",result.users)
  return result.users;
}


async function getAllUsers(token) {
  
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
      ConfigData.SERVER_URL + "/users/",
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
    
    result.users.forEach((element) => {
        element.label = element.firstname + " - " + element.lastname;
      });

    
    return result.users;
  }
 

export { getUsers, getAllUsers };
