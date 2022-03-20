import React, { useState } from 'react'
import { useEffect } from 'react'
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import ConfigData from '../../../../utils/configuration.json';
import DocImage from './img/doc.png'


function parseMedia(medias){
  var itemData=[]
  medias.forEach(element => {
    var imgPath =DocImage
    var typeFile = "Document"
    
    if(element.type.includes("image")){
      
      imgPath=ConfigData.SERVER_URL+"/media/"+element.id
      typeFile=element.type
    }
     
    var item = {
      id: element.id,
      img: imgPath,
      title: element.name,
      type: typeFile,
    }
    itemData.push(item)
  });
  return itemData

}
export default function Media({handleMedia,updater,medias,token}) {
   

  const [listMedia, setListMedia] = useState(medias)


  useEffect(() => { 
    setListMedia([...parseMedia(medias)])
  }, [medias,updater])



  return (
    <ImageList sx={{ height: 300 }}>
      <ImageListItem key="Subheader" cols={2}>
        <ListSubheader component="div">Media disponible</ListSubheader>
      </ImageListItem>
      {listMedia.map((item) => (
        <ImageListItem key={item.img}
        onClick={handleMedia(item)}
        >
          <img
            src={`${item.img}`}
            srcSet={`${item.img}`}
            alt={item.title}
            loading="lazy"
          />
          <ImageListItemBar
            title={item.title}
            subtitle={item.type}
            
            actionIcon={
              <IconButton
                sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                aria-label={`info about ${item.title}`}
              >
                <InfoIcon />
              </IconButton>
            }
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}
 