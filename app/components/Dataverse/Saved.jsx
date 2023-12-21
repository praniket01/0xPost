import { SYSTEM_CALL } from '@dataverse/dataverse-connector';
import { useStore } from '@dataverse/hooks';
import { Button } from '@nextui-org/react'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

const Saved = ({postFileId,profile}) => {

    const {dataverseConnector,pkh}=useStore();
    const[isSaved,setIsSaved]=useState(false);
    const [savedData,setSavedData]=useState([]);

    const checkIsSaved=async()=>{
      try {
         if(profile.content.saved.includes(postFileId)){
          setIsSaved(true)
         }
       
      } catch (error) {
        console.log(error)
      }

    }

    useEffect(() => {
    setSavedData(profile.content.saved)
    checkIsSaved();
    console.log(profile)

    }, [])


    const SavePost=async()=>{

      const data=[...savedData,postFileId]
      console.log(data)
        try {
            const move = await dataverseConnector.runOS({
              method: SYSTEM_CALL.updateIndexFile,
              params: {
                fileId: profile.file.fileId,
                fileName: "profile",
                fileContent:{
                  name:profile.content.name,
                  description:profile.content.description,
                  image:profile.content.image,
                  subscribed:profile.content.subscribed,
                  address:profile.content.address,
                  backgroundImage:profile.content.backgroundImage,
                  socialMedia: profile.content.socialMedia,
                  saved: data,

                }
              }
            });

            setIsSaved(true);
            toast.success('Post Saved');
            console.log(move);
          } 
        catch (error) {
            toast.error('An Error occured');
            console.log(error)
          }
    }


    const UnSavePost=async()=>{
      const data=savedData.filter((savedPost)=>savedPost!==postFileId)
      try {
        const move = await dataverseConnector.runOS({
          method: SYSTEM_CALL.updateIndexFile,
          params: {
            fileId: profile.file.fileId,
            fileName: "profile",
            fileContent:{
              name:profile.content.name,
              description:profile.content.description,
              image:profile.content.image,
              subscribed:profile.content.subscribed,
              address:profile.content.address,
              backgroundImage:profile.content.backgroundImage,
              socialMedia: profile.content.socialMedia,
              saved: data,

            }
          }
        });

        setIsSaved(false);
        toast.success('Post UnSaved');
        console.log(move);
      } 
    catch (error) {
        toast.error('An Error occured');
        console.log(error)
      }

    }
    
  return (
    <div>
    {isSaved?
          <BookmarkCheck onClick={UnSavePost} color='blue' className='cursor-pointer' />
        :
          <Bookmark  onClick={SavePost} className='cursor-pointer' />
    }
    </div>
  )
}

export default Saved