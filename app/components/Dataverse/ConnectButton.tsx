'use client';
import { Button } from '@nextui-org/react';
import React, { useCallback, useState } from 'react'
import { useApp, useStore } from '@dataverse/hooks';
import { appId } from '@/output';


const ConnectButton = () => {

    const { connectApp } = useApp({
        appId: appId,
        autoConnect: true,
        onSuccess: result => {
          console.log("[connect]connect app success, result:", result);
        },
      });
      const {pkh}=useStore();

  

    
      const connect = useCallback(async () => {
        connectApp();
      }, [connectApp]);

      
  return (
    <div>
    {pkh?
    <Button color="success" variant="solid">{pkh}</Button>
    :
    <Button color="primary" variant="solid" onClick={connect}>Connect wallet</Button>
  }
        

    </div>
  )
}

export default ConnectButton