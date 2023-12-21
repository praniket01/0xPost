'use client';
import {useState,useEffect} from 'react'
import { useStore } from '@dataverse/hooks'
import {RESOURCE,SYSTEM_CALL} from '@dataverse/dataverse-connector';
import { postModelId } from '@/output';
import Cards from '@/app/components/Cards';
import { motion, useScroll } from 'framer-motion';

const Posts = () => {

  const { scrollYProgress } = useScroll();
  const [fileContents,setFileContents]=useState<Array<any>>([]);
    const { dataverseConnector } = useStore();
    const fetchPosts = async () => {
      try {
        const res = await dataverseConnector.runOS({
          method: SYSTEM_CALL.loadFilesBy,
          params: {
            modelId: postModelId,
          },
        });  
        const contents = Object.keys(res).map(key => res[key].fileContent);
        const reversedContents =contents.reverse();
        setFileContents(reversedContents);
  
        console.log(contents);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
  
    useEffect(() => {
      fetchPosts();
    }, []);
    
  

  return (
    
    <div 
    className='bg-white rounded-md p-4'>
      <motion.div style={{ scaleX: scrollYProgress }} />
       <h2 className='text-2xl flex justify-center font-semibold '>All Posts :</h2>
       <div></div>
       
       {fileContents.map((item, index) => (
        <div key={index}>
        <div 
        key={index}>
          <h1 className='text-white'>{item.content.text}</h1>
          <Cards title={item.content.title} content={item.content.content} description={item.content.description} image={item.content.image} fileId={item.file.fileId} createdAt={item.content.createdAt} />
        </div>
        
        </div>
      ))}
       
      
        <div className='mt-20'></div>
    </div>
  )
}

export default Posts