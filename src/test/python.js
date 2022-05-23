import React from 'react';
import { useEffect,useState  } from 'react'
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Button from '@mui/material/Button';
import ConfigData from "../utils/configuration.json"
import CodeEditor from '@uiw/react-textarea-code-editor';
import Alert from '@mui/material/Alert';
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";
import "./style.css";


export default function Python(){
const [spaces , setSpace] = useState(4);
const [text, setText] = useState({value: '', caret: -1, target: null});
const [updater,setUpdater]= useState(4);
const [rep, setRep]= useState();

const hightlightWithLineNumbers = (input, language) =>{
  console.log("hightlightWithLineNumbers",input,language)
  var hcode =  highlight(input, language)
    console.log("hcode",hcode)
    return hcode.split("\n")
    .map((line, i) => `<span class='editorLineNumber'>${i + 1}</span>${line}`)
    .join("\n");
}
useEffect(() => {
      if(text.caret >= 0){
        text.target.setSelectionRange(text.caret + spaces, text.caret + spaces);
      }
   
  }, [text]);

  const handlePy = async (e)=>{
    const requestOptions = {
      method: 'POST',
      mode: 'cors',
      headers: {
 
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code: text.value })
    }
    const response = await fetch(ConfigData.SERVER_URL + '/runcode', requestOptions)
    if (!response.ok) {
      
      //console.log(response)
    }
    if (response.status == 401) {
      
    }
    const result = await response.json()
    console.log(result)
    setRep(result)
  }
  const handleTab = (e) => {

    let content = e.target.value;
    let caret   = e.target.selectionStart;

    if(e.key === 'Tab'){
     
      e.preventDefault();
      let newText = content.substring(0, caret) + '    ' + content.substring(caret);
      setText({value: newText, caret: caret, target: e.target});
      console.log("tab ",newText)
      setUpdater(updater+1)
    }
  }

    return( <>
 

 <Editor
      value={text.value}
      onValueChange={code => setText({value: code})}
      highlight={code => hightlightWithLineNumbers(code, languages.js)}
      padding={10}
      textareaId="codeArea"
      className="editor"
      style={{
        fontFamily: '"Fira code", "Fira Mono", monospace',
        fontSize: 18,
        outline: 0
      }}
    />

     
    <Button
  onClick={handlePy}
>
  Run
</Button>
<br></br>
Output :<br/> 
<div style={{whiteSpace: "pre-wrap"}}>
{
 rep!=undefined&&rep.output!=null?<Alert severity={rep.reponse}>{rep.output}</Alert>:<></>
}
</div>

    </> );
}
 
