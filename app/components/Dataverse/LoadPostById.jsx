'use client';
import {useState,useEffect} from 'react'
import { useStore } from '@dataverse/hooks'
import {RESOURCE,SYSTEM_CALL} from '@dataverse/dataverse-connector';
import { postModelId } from '@/output';
import Cards from '@/app/components/Cards';

const LoadPostById = ({phkwallet}) => {
  const [fileContents,setFileContents]=useState([]);
    const { dataverseConnector } = useStore();
    const fetchPosts = async () => {
      try {
        const res = await dataverseConnector.runOS({
          method: SYSTEM_CALL.loadFilesBy,
          params: {
            modelId: postModelId,
            phkwallet
          },
        });  
        console.log(res);
        const contents = Object.keys(res).map((key) => res[key]);
        const reversedContents = contents.reverse();
    
        const finalContents = reversedContents.filter((value) => value.pkh === phkwallet);
        console.log(finalContents);
    
        setFileContents(finalContents);
        console.log(contents);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
  
    useEffect(() => {
      fetchPosts();
      console.log(phkwallet)
    }, []);
  return (
    <div className='bg-white rounded-md '>
{fileContents?
      <div>
          {fileContents.map((item, index) => (
            <div key={index} className=''>        
          <Cards title={item.fileContent.content.title} description={item.fileContent.content.description} image={item.fileContent.content.image} fileId={item.fileContent.file.fileId} createdAt={item.fileContent.content.createdAt} />
        </div>
      ))} 
      </div>
    :
    <div>No Post Available</div>
    }       
    </div>
  )
  }

export default LoadPostById;