import React from 'react'
import {Image} from '@nextui-org/react'
import Link from 'next/link';

interface CardSubscribedProp{
    name: string,
    image: string,
    fileId : string,
    }


const CardSubscribed:React.FC<CardSubscribedProp> = ({
    name,image,fileId

}) => {
  return (
    <div>
        <Link 
    href={{pathname:`/profiles/${fileId}`,query: {fileId: fileId}}}
    className='flex flex-row gap-y-5 shadow-md justify-between rounded-lg border p-2 bg-white border-gray-200 m-5'
  >
     
       
      <div className='flex'>
      <Image
      className="rounded-full object-cover"
      width={40}
      height={40}
      src={image}
      alt="Image"
    />
    <h1 className='text-xl font-serif pl-5 pt-2'>{name}</h1>
    </div>
    </Link>
    </div>
  )
}
export default CardSubscribed;