import { SYSTEM_CALL } from '@dataverse/dataverse-connector';
import { useStore } from '@dataverse/hooks';
import React, { useEffect, useState } from 'react'
import Cards from '../Cards';
import { Image } from '@nextui-org/react';

const LoadSavedFile = ({saved}) => {
    const[saveData,setSaveData]=useState();
    const {dataverseConnector}=useStore();
    const[isSaved,setIsSaved]=useState(false);
   
    useEffect(()=>{
      console.log(saved)
      const fetchSavedData = async () => {
        try {
          const fetchedData = await Promise.all(
            saved.map(async (fileId) => {
              const data = await dataverseConnector.runOS({
                method: SYSTEM_CALL.loadFile,
                params: fileId,
              });
              return data; 
            })
          );
          console.log(fetchedData)
          setSaveData(fetchedData);
        } catch (error) {
          console.error('Error fetching saved files:', error);
        }
      };
  
      fetchSavedData();
    }, [saved, dataverseConnector]);
 

  

   
  return (
    <div>
    {saveData
    ?
    <div>
      {saveData.map((savedPost, index)=>(
        <div key={index}>
          <Cards title={savedPost.fileContent.content.title} description={savedPost.fileContent.content.description}
           image={savedPost.fileContent.content.image} content={savedPost.fileContent.content.content} createdAt={savedPost.fileContent.content.createdAt} 
           fileId={savedPost.fileContent.file.fileId}
           />
        </div>
      ))}

    </div>  
    :
    <div className='flex items-center pt-2 mt-6 font-semibold flex-col justify-center'>
        <h2 className='text-2xl text-neutral-500 '>No saved post</h2>
      <Image src='/post.png' height={300} width={300} />
    </div>  
    }
    </div>
  )
}

export default LoadSavedFile