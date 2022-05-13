import * as React from "react";
import ConfigData from "./configuration.json";
import Divider from "@mui/material/Divider";
import getTimeToDate from "./timestamptodate";

async function getDevoir(token) {
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
    ConfigData.SERVER_URL + "/mesdevoirs",
    requestOptions
  );
  if (!response.ok) {
    localStorage.removeItem("token");
    window.location.reload(false);
    //console.log(response);
  }
  if (response.status == 401) {
    localStorage.removeItem("token");
    window.location.reload(false);
  }
  const result = await response.json();
  //console.log("getDevoir", result);
  return result;
}

function getOpen(ressource) {
  if (ressource.setting == undefined) return false

  console.log("getOpen", ressource);
  
  if (
    ressource.maxTry != 0 &&
    ressource.maxTry != null &&
    ressource.maxTry != undefined
  )
    if (ressource.maxTry <= ressource.try) return false;

  var today = Math.round(new Date().getTime() / 1000);

  for (const [key, value] of Object.entries(ressource.setting)) {
    console.log(key, value);
    return (
      (today <= value.dateF + 24 * 3600 && today >= value.dateO) ||
      value.dateO == 0
    );
  }
  
}


function getDate(ressource) {
  if (ressource.setting == undefined) return false

   
  var today = Math.round(new Date().getTime() / 1000);

  for (const [key, value] of Object.entries(ressource.setting)) {
    console.log(key, value);
    return [getTimeToDate(value.dateO),getTimeToDate(value.dateF)]
  }
  
}


async function getExam(token) {
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
    ConfigData.SERVER_URL + "/mesexams",
    requestOptions
  );
  if (!response.ok) {
    localStorage.removeItem("token");
    window.location.reload(false);
    //console.log(response);
  }
  if (response.status == 401) {
    localStorage.removeItem("token");
    window.location.reload(false);
  }
  const result = await response.json();
  //console.log("getExam", result);
  return result;
}

function GetDivider({ index, size }) {
  //console.log("Div", index, size);
  if (index == size) return <></>;
  return <Divider />;
}

export { getExam, getDevoir, getOpen, GetDivider,getDate };
