import { Image } from '@nextui-org/react'
import Link from 'next/link'
import React from 'react'

const SubscriberCard = ({name,image,pkhWallet}) => {
  return (
    <Link href={{pathname:`/profile/${pkhWallet}`,query: {pkhWallet: pkhWallet}}} className='flex gap-1 items-center justify-start p-1'>
        <Image src={image} height={20} radius='full' width={20} />
        <h2>{name}</h2>
    </Link>
  )
}

export default SubscriberCard