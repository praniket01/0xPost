"use client";
import { useStore } from '@dataverse/hooks';
import { SYSTEM_CALL } from '@dataverse/dataverse-connector';
import { useEffect, useState } from 'react';
import { profileModelId } from '@/output';
import SubscriberCard from '@/app/components/SubscriberCard'
import { User } from 'lucide-react';
import { useMyContext } from './SubscriberContext';
import { Image } from '@nextui-org/react';
const Subscribers = () => {
    const [subscribers,setSubscribers]=useState([]);
    const[subscriberData,setSubscriberData]=useState()

    const {dataverseConnector,pkh}=useStore();
    const { subscriber } = useMyContext();
    
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
      console.log(finalContents[0].fileContent)

      const contents = Object.keys(res).map(key => res[key].fileContent);
      console.log(contents)
      setSubscribers(finalContents[0]?finalContents[0].fileContent.content.subscribed:contents[0].content.subscribed)
    }

    const fetchSubscriber=async()=>{
        try {
            const fetchedData = await Promise.all(
                subscribers.map(async (fileId) => {
                const data = await dataverseConnector.runOS({
                  method: SYSTEM_CALL.loadFile,
                  params: fileId,
                });
                return data; 
              })
            );
            console.log(fetchedData)
            setSubscriberData(fetchedData);
          } catch (error) {
            console.error('Error fetching saved files:', error);
          }
        
    }
    useEffect(() => { 
      if(pkh){
        fetchProfile();
      }
    },[subscriber,pkh])


    useEffect(()=>{
      fetchSubscriber()
    },[subscribers]);
    

 

    return(
        <div className="p-2 flex flex-col place-content-between ">
          {subscriberData?
          <div>
            <h2 className='flex justify-center font-semibold items-center border-b-1 p-2'> <User height={18} /> Subscription</h2>
            
            {subscriberData.map((profile,index)=>(
            <div key={index}>
            <SubscriberCard name={profile.fileContent.content.name} image={profile.fileContent.content.image} pkhWallet={profile.pkh} />
            </div>
            ))}
          </div>
          :
          <div>
            No Subscriber
          </div>
          }

      </div>
    )
}

export default Subscribers;