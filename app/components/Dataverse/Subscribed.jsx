import { profileModelId } from '@/output';
import { SYSTEM_CALL } from '@dataverse/dataverse-connector';
import { useStore } from '@dataverse/hooks';
import { Button } from '@nextui-org/react';
import { User, UserCheck } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useMyContext } from '../SubscriberContext';

const Subscribed = ({profileId}) => {

    const {dataverseConnector,pkh}=useStore();
    const[isSubscribed,setIsSubscribed]=useState(false);
    const [SubscribedData,setSubscribedData]=useState([]);
    const[profile,setProfile]=useState();
    const  {  setSubscriber } = useMyContext();

    const fetchProfile=async()=>
    { 
      console.log(pkh)
      const res = await dataverseConnector.runOS({
        method: SYSTEM_CALL.loadFilesBy,
        params: {
          modelId: profileModelId,
          pkh,
        },
      });  

      const data=Object.keys(res).map(key => res[key])
      const finalContents = data.filter((value) => value.pkh === pkh);
      console.log(finalContents[0].fileContent)

      const contents = Object.keys(res).map(key => res[key].fileContent);
      console.log(contents[0])
      setProfile(finalContents?finalContents[0].fileContent:contents[0])
      setSubscribedData(finalContents?finalContents[0].fileContent.content.subscribed:contents[0].content.subscribed)
    }
  

    const checkIsSubscribed=async()=>{
      console.log(profile);
      try {
         if(profile.content.subscribed.includes(profileId)){
          setIsSubscribed(true)
         }
       
      } catch (error) {
        console.log(error)
      }

    }

    useEffect(() => {
    fetchProfile();
    console.log(profileId);
    }, [])

    useEffect(()=>{
      checkIsSubscribed();
    },[SubscribedData])


    const Subscribe=async()=>{

      const data=[...SubscribedData,profileId]
      setSubscriber(data)
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
                  subscribed: data,
                  address:profile.content.address,
                  backgroundImage:profile.content.backgroundImage,
                  socialMedia: profile.content.socialMedia,
                  saved: profile.content.saved ,

                }
              }
            });

            setIsSubscribed(true);
            toast.success(' Subscribed');
            console.log(move);
          } 
        catch (error) {
            toast.error('An Error occured');
            console.log(error)
          }
    }


    const Unsubscribe=async()=>{
      const data=SubscribedData.filter((SubscribedPost)=>SubscribedPost!==profileId)
      setSubscriber(data)
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
              saved:profile.content.saved,
              address:profile.content.address,
              backgroundImage:profile.content.backgroundImage,
              socialMedia: profile.content.socialMedia,
              subscribed: data,

            }
          }
        });

        setIsSubscribed(false);
        toast.success(' UnSubscribed');
        console.log(move);
      } 
    catch (error) {
        toast.error('An Error occured');
        console.log(error)

      }

    }
    
  return (
    <div>
    {isSubscribed?
    <Button className='flex gap-1' color='success' onClick={Unsubscribe} variant='solid' radius='full'>
          <UserCheck  color='white' />
          UnSubscribe
    </Button>
        :
      <Button className='flex gap-1' color='primary' onClick={Subscribe} variant='solid' radius='full'>
          <User   />
          Subscribed
      </Button>
    }
    </div>
  )
}

export default Subscribed