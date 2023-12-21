import Link from 'next/link';
import React, { useEffect } from 'react'
import {Image} from "@nextui-org/react";
import { useInView } from 'react-intersection-observer';
import { motion, useAnimation } from 'framer-motion';

interface CardProfileProp{
    name: string,
    image: string,
    pkhWallet : string,
    }

const CardProfile:React.FC<CardProfileProp> = ({name,image,pkhWallet}) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true });

  useEffect(() => {
    if (inView) {
      controls.start({ y: 0, opacity: 1, transition: { duration: 0.5, } });
    }
  }, [controls, inView]);
 
  return (
    <motion.div
    ref={ref}
   whileHover={{scale:1.02}}
   whileTap={{ scale: 0.99 }}
   initial={{ y: '100%', opacity: 0 }}
   animate={controls}
   transition={{duration : 0.75}}
    >
      <Link 
    href={{pathname:`/profile/${pkhWallet}`,query: {pkhWallet: pkhWallet}}}
    className='flex flex-row gap-y-5 shadow-md justify-between rounded-2xl border p-2 bg-white border-gray-200 m-5'
  >
     
 
      <div className='flex rounded-lg'>
      <Image
      className="rounded-full object-cover"
      width={50}
      height={50}
      src={image}
      alt="Image"
    />
    <h1 className='text-xl font-serif pl-5 pt-2'>{name}</h1>
    </div>
    </Link>
    </motion.div>
    
  )
}
export default CardProfile;