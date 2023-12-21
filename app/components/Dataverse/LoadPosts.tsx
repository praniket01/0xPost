'use client';
import { useState, useEffect } from 'react'
import { useStore } from '@dataverse/hooks'
import { RESOURCE, SYSTEM_CALL } from '@dataverse/dataverse-connector';
import { postModelId } from '@/output';
import Cards from '@/app/components/Cards';
import Link from 'next/link';
import { Button } from '@nextui-org/button';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const LoadPosts = () => {
  const [fileContents, setFileContents] = useState<Array<any>>([]);
  const { dataverseConnector } = useStore();
  const [visibleCards, setVisibleCards] = useState(3);

  const fetchPosts = async () => {
    try {
      const res = await dataverseConnector.runOS({
        method: SYSTEM_CALL.loadFilesBy,
        params: {
          modelId: postModelId,
        },
      });
      const contents = Object.keys(res).map(key => res[key].fileContent);
      const reversedContents = contents.reverse();
      setFileContents(reversedContents);

      console.log(contents);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // const controls = useAnimation();
  // const [ref, inView] = useInView({ triggerOnce: true });

  // useEffect(() => {
  //   if (inView) {
  //     controls.start({ x: 0, opacity: 1, transition: { duration: 0.5, } });
  //   }
  // }, [controls, inView]);



  return (
    <div className='bg-white rounded-md p-4'>
      <h2 className='text-2xl flex justify-center font-semibold '>Latest Posts:</h2>
      
      {fileContents.slice(0, visibleCards).map((item, index) => (
        <div key={index}>

        <div
        // ref={ref}
        // whileHover={{scale:1.02}}
        // whileTap={{ scale: 0.99 }}
        // initial={{ x: '100%', opacity: 0 }}
        // animate={controls}
        // transition={{ duration:0.5}}
        
        >
        <h1 className='text-white'>{item.content.title}</h1>
          <Cards title={item.content.title} content={item.content.content} description={item.content.description} image={item.content.image} fileId={item.file.fileId} createdAt={item.content.createdAt} />

        </div>
          
        </div>
      ))}


      <div className="flex justify-center items-center">
        <Link href='posts'>
          <Button className=' mt-5 mb-5' color='primary' variant='bordered'>
            View More
          </Button>
        </Link>

      </div>

    </div>
  )
}

export default LoadPosts