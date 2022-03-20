import React, { useContext } from "react";
import ReactMarkdown from 'react-markdown';
import ReactDom from 'react-dom';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import editorContext from "./editor";
import Box from "@mui/material/Box";
import TextareaAutosize from '@mui/material/TextareaAutosize';
import rehypeHighlight from 'rehype-highlight'
 
import 'katex/dist/katex.min.css' // `rehype-katex` does not import the CSS for you

export function Result(props) {
  const { markdownText } = useContext(editorContext);
  

  return (
    <Box style={{ 'width': '100%', 'height':300 }}>
     <div>
        
     </div>
      
        <ReactMarkdown children={markdownText} 
         
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeKatex]}
        
        />
     
    </Box>
  );
}
