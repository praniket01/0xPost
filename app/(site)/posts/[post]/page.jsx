'use client';
import React, { useState } from 'react'
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useStore } from '@dataverse/hooks';
import { SYSTEM_CALL } from '@dataverse/dataverse-connector';
import { Button, Image,ScrollShadow } from '@nextui-org/react';
import Saved from '@/app/components/Dataverse/Saved';

import { profileModelId } from '@/output';
import Link from 'next/link';
import DeletePost from '@/app/components/Dataverse/DeletePost'

const Post = () => {
  const [postData,SetPostData]=useState();
  const[pkhWallet,setpkhWallet]=useState();

   const [profile,setProfile]=useState();
  const [postOwner,setPostOwner]=useState();

  const router=useSearchParams();
    const fileId=router.get('fileId');
    const {dataverseConnector,pkh}=useStore();

    const fetchPost=async()=>
    {
       const res=await dataverseConnector.runOS({
      method: SYSTEM_CALL.loadFile,
      params: fileId,
    });
    console.log(res)
      setpkhWallet(res.pkh);
      SetPostData(res.fileContent.content)


    }

    const fetchProfile=async()=>
    { 
      console.log(pkh)
     
      const res = await dataverseConnector.runOS({
        method: SYSTEM_CALL.loadFilesBy,
        params: {
          modelId: profileModelId,
        },
      });  
      const data=Object.keys(res).map(key => res[key])
      const finalContents = data.filter((value) => value.pkh === pkh);
      console.log(finalContents)
      const contents = Object.keys(res).map(key => res[key].fileContent);
      console.log(contents)
      console.log(finalContents[0])
      setProfile(finalContents[0]?finalContents[0].fileContent:contents[0].fileContent)
    }
  
  useEffect(() => {
    if (fileId) {
      fetchPost(); 
    }
  }, [fileId]);

  useEffect(() => {
    if(pkhWallet){
      fetchProfile(); 
      fetchPostOwner();
    }
  }, [pkhWallet]);

  const fetchPostOwner=async()=>{
    const owner = await dataverseConnector.runOS({
      method: SYSTEM_CALL.loadFilesBy,
      params: {
        modelId: profileModelId,
        pkhWallet,
      },
    }); 
    console.log(owner)
    const data=Object.keys(owner).map(key => owner[key])
    const finalContents = data.filter((value) => value.pkh === pkhWallet); 
    console.log(finalContents[0].fileContent);
    setPostOwner(finalContents[0].fileContent)
  }

 

  return (
    <div className='bg-white overflow-y-auto mb-4 p-6 h-full rounded-lg'>
      {postData&&postOwner&&(
      <div className='flex flex-col pb-4 mb-4 gap-4 '>
        <div>
          <div className='flex justify-between'>

            <div className='flex items-center m-2 gap-4'>
              <Image width={50} height={50} src={postOwner.content.image} />
              <div className='flex flex-col gap-1'>
              <h1>{postOwner.content.name}</h1>
              <h3 className='text-neutral-500 text-sm font-light'>{pkhWallet}</h3>
              </div>
              <Link href={{pathname:`/profile/${pkhWallet}`,query: {pkhWallet: pkhWallet}}} >

              <Button size="sm" radius='full' color="primary" variant='ghost'>View Profile</Button>
              </Link>
            </div>
            <div className='flex flex-row gap-2 items-center'>
              <Saved postFileId={fileId} profile={profile}/>
              {pkh==pkhWallet&& <DeletePost fileId={fileId}/> }
            </div>
            
          </div>
        </div>
        <hr />
        
      <h2 className='text-2xl  font-bold pl-4 flex justify-center'>{postData.title}</h2>
      <h3 className='text-xl font-semibold text-center'>{postData.description}</h3>
      <h3 className='text-neutral-400 text-xs flex justify-end'> 
            {new Date(postData.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
            </h3>
      <div className='flex justify-center'>
      <Image
     
      src={postData.image}
      alt="Image"
      className='min-w-[500px] h-[300px] object-cover'
      />
      </div>
      <p className='text-neutral-500 p-2 '>{postData.content}</p>
      <hr>
      </hr>
      </div>

      )}
      <div className='h-20'></div>
    </div>
  )
}

export default Post