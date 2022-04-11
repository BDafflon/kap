import * as React from "react";
import ConfigData from "./configuration.json";
import Divider from "@mui/material/Divider";

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
  var today = Math.round(new Date().getTime() / 1000);
   

  return (
    (today <= ressource.dateF + 24 * 3600 && today >= ressource.dateO) ||
    ressource.dateO == 0
  );
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

export { getExam, getDevoir, getOpen, GetDivider };
