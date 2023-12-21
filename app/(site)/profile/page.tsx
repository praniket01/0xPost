'use client';
import React, {  useEffect, useState } from 'react';
import { SYSTEM_CALL } from '@dataverse/dataverse-connector';
import { useStore } from '@dataverse/hooks';
import {  profileModelId } from '@/output';
import LoadProfiles from '@/app/components/Dataverse/LoadProfiles';
const Profile = () => {
  const { dataverseConnector,pkh } = useStore();
  const [profiles,setProfiles]=useState<Array<any>>([])

  const fetchProfiles = async () => {
    try {
      const res = await dataverseConnector.runOS({
        method: SYSTEM_CALL.loadFilesBy,
        params: {
          modelId: profileModelId,
        },
      });  
      const contents = Object.keys(res).map(key => res[key].fileContent);
      const reversedContents =contents.reverse();
      setProfiles(reversedContents);
      console.log(contents);

    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  
 return (
    <div className='rounded-lg bg-white h-full overflow-y-auto px-4'>
      <h2 className='flex justify-center text-2xl font-bold text-neutral-500 mt-4'>Profiles</h2>
       <LoadProfiles />

  </div>
  )
}

export default Profile;