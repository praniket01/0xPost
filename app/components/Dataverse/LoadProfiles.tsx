import { profileModelId } from '@/output';
import { SYSTEM_CALL } from '@dataverse/dataverse-connector';
import { useStore } from '@dataverse/hooks';
import React, { useEffect, useState } from 'react'
import CardProfile from '@/app/components/CardProfile';
import Link from 'next/link';
import { Button } from '@nextui-org/button';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const LoadProfiles = () => {
    const [fileContents,setFileContents]=useState<Array<any>>([]);
    const { dataverseConnector } = useStore();
    const [pkhWallet,setPkhWallet]=useState();

    const fetchProfile = async () => {
        try {
          const res = await dataverseConnector.runOS({
            method: SYSTEM_CALL.loadFilesBy,
            params: {
              modelId: profileModelId,
            },
          });

          
          const contents = Object.keys(res).map(key => res[key]);
          console.log(contents)
          setFileContents(contents);
    
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      };
      useEffect(() => {
        fetchProfile();
      }, []);

      const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true });

  useEffect(() => {
    if (inView) {
      controls.start({ x: 0, opacity: 1, transition: { duration: 0.5, } });
    }
  }, [controls, inView]);

  return (
    <div className='p-2'>
        
        {fileContents.map((item, index) => (
            
        <motion.div 
        ref={ref}
        whileHover={{scale:1.03}}
        whileTap={{scale:0.99}}
        initial={{ x: '100%', opacity: 0 }}
        animate={controls}
        key={index}>
          <CardProfile name={item.fileContent.content.name} image={item.fileContent.content.image} pkhWallet={item.pkh}/>
        </motion.div>
    ))}
      
    </div>
  )
}

export default LoadProfiles;