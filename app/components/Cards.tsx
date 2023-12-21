import React, { useEffect } from 'react'
import {Image} from "@nextui-org/react";
import Link from 'next/link';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface CardProp{
  title: string,
  description:string,
  content:string,
  createdAt: string,
  image: string,
  fileId: string,
}

const Cards:React.FC<CardProp> = ({title,description,content,createdAt,image,fileId}) => {

  const truncateText = (text: string, limit: number) => {
    const words = text?.split(' ')||[];
    if (words.length > limit) {
      return words.slice(0, limit).join(' ') + '...';
    }
    return text;
  };

  const truncatedContent = truncateText(content, 50); 
  const truncatedTitle = truncateText(title,10);

  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true });

  useEffect(() => {
    if (inView) {
      controls.start({ y: 0, opacity: 1, transition: { duration: 0.5, } });
    }
  }, [controls, inView]);
 

  return (
   <motion.div className='p-4'
   ref={ref}
   whileHover={{scale:1.02}}
   whileTap={{ scale: 0.99 }}
   initial={{ y: '100%', opacity: 0 }}
   animate={controls}
   >
    <Link 
    href={{pathname:`/posts/${fileId}`,query: {fileId: fileId}}}
    className='flex flex-row gap-1 shadow-md justify-between rounded-xl border p-2 border-gray-200'
    
    >
      <div className='flex flex-col justify-between items-start p-2' >
        <h3 className='text-2xl font-bold '>{truncatedTitle}</h3>
        <p className='font-sans text-md text-neutral-400 '>{description}</p>
        <h3 className='text-neutral-400 text-xs flex justify-end'> 
            {new Date(createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
        </h3>
      </div>
      <div className=''>
      <Image
      className="min-w-[200px] h-48 object-cover"
      width={200}
      height={150}
      src={image}
      alt="Image"
    />
    </div>
    
    </Link>
    </motion.div> 
   
  )
}

export default Cards