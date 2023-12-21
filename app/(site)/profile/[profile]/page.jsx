'use client';
import { SYSTEM_CALL } from '@dataverse/dataverse-connector';
import { useStore } from '@dataverse/hooks';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Image, Input } from "@nextui-org/react";
import { ABI, CoffeeABI, contractAddress, profileModelId } from '@/output';
import { Tabs, Tab } from "@nextui-org/react";
import Post from '../../../components/Dataverse/Post';
import LoadPostById from '@/app/components/Dataverse/LoadPostById';
import Donate from '@/app/components/Dataverse/Donate';
import LoadSavedFile from '@/app/components/Dataverse/LoadSavedFile'
import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import DonationHistory from "@/app/components/DonationHistory";
import Subscribed from '@/app/components/Dataverse/Subscribed'
import { motion,useScroll } from 'framer-motion';
import { Card, CardBody } from "@nextui-org/react";


const Profile = () => {

  const { scrollYProgress } = useScroll();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [profile, setProfile] = useState();

  const { dataverseConnector, pkh, address } = useStore();
  const router = useSearchParams();
  const pkhWallet = router.get('pkhWallet');

  const [walletConnected, setWalletConnected] = useState(false);
  const [profileId, setprofileId] = useState();
  const [coffeeContractAddress, setCoffeeContractAddress] = useState(null);
  const [hasDeployedContract, setHasDeployedContract] = useState(false);
  const [contractBalance, setContractBalance] = useState();



    const fetchProfile=async()=>
    { console.log(pkhWallet)
      const res = await dataverseConnector.runOS({
        method: SYSTEM_CALL.loadFilesBy,
        params: {
          modelId: profileModelId,
        },
      });
      const data=Object.keys(res).map(key => res[key])
      const finalContents = data.filter((value) => value.pkh === pkhWallet);
     
     
      console.log(finalContents[0].fileContent);
      setProfile(finalContents[0].fileContent.content)
      setprofileId(finalContents[0].fileContent.file.fileId);
      
   
      
    }
  
  useEffect(() => {
    fetchProfile();
    checkDeployedContract();
  }, []);

  useEffect(() => {
    if (hasDeployedContract) {
      const fetchContractBalance = async () => {
        try {
          const provider = new ethers.providers.JsonRpcProvider('https://eth-goerli.g.alchemy.com/v2/6ls7UbYyRKU_dCr0JXyfV6QXd-VplZyW');

          const contractABI = CoffeeABI;
          const contract = new ethers.Contract(coffeeContractAddress, contractABI, provider);

          const balance = await provider.getBalance(coffeeContractAddress);

          const balanceInEther = ethers.utils.formatEther(balance);

          setContractBalance(balanceInEther);
        } catch (error) {
          console.error('Error fetching contract balance:', error);
        }
      };

      fetchContractBalance();
    }
  }, [coffeeContractAddress, contractBalance])

  const handleClaim = async () => {

    try {
      if (!walletConnected) {
        toast.error('Please connect your wallet first.');
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const signer = provider.getSigner();

      const coffeeContract = new ethers.Contract(
        coffeeContractAddress,
        CoffeeABI,
        signer,
      );

      const transaction = await coffeeContract.withdraw();
      await transaction.wait();
      toast.success('Claimed')
    } catch (error) {
      toast.error('error while withdrawing')
    }
  }

  const checkDeployedContract = async () => {
    const res = pkhWallet.split(':')[4];

    const provider = new ethers.providers.JsonRpcProvider('https://eth-goerli.g.alchemy.com/v2/6ls7UbYyRKU_dCr0JXyfV6QXd-VplZyW');
    const coffeeFactoryContract = new ethers.Contract(
      contractAddress,
      ABI,
      provider
    );

    try {
      const deployedContractAddress = await coffeeFactoryContract.getCoffeeContract(res);
      if (deployedContractAddress !== '0x0000000000000000000000000000000000000000') {

        setHasDeployedContract(true);
        setCoffeeContractAddress(deployedContractAddress);
      }

      console.log('deployed conytract', deployedContractAddress)
    } catch (error) {
      console.error('Error checking deployed contract:', error);
    }
  };

  const deployContract = async () => {

    try {
      if (!walletConnected) {
        toast.error('Please connect your wallet first.');
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const signer = provider.getSigner();

      const coffeeFactoryContract = new ethers.Contract(
        contractAddress,
        ABI,
        signer,

      );

      const transaction = await coffeeFactoryContract.deployCoffeeContract();
      await transaction.wait();
      toast.success('Donation Enabled')

      const deployedContractAddress = await coffeeFactoryContract.getCoffeeContract(address);
      setCoffeeContractAddress(deployedContractAddress);
      setHasDeployedContract(true)
    } catch (error) {
      console.error('Error deploying Coffee contract:', error);
    }


  }

  const connectWallet = async () => {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      toast.success('Connected Address');
      setWalletConnected(true);
    } catch (error) {
      toast.error('Error connecting wallet:', error);
    }
  };



  return (
    <div className='h-screen bg-white overflow-y-auto no-scrollbar rounded-lg p-4 '>
      {profile ?
        <div className='rounded-lg '>

          <div
            className='  '
          >
            <div className='
        rounded-sm
        w-full
        flex
        flex-col
        '>

              <div className='flex py-2 px-6 my-2 justify-between'>
                <div className='flex gap-4 align-middle'>
                  <Image
                    isZoomed
                    width={80}
                    alt="Profile Image"
                    src={profile.image}
                    className='rounded-full'
                  />
                  <div>
                  <h2 className='font-semibold text-xl text-neutral-500 '>
                    {profile.name}
                  </h2>
                  <h2 className='text-sm text-neutral-500 '>
                    {pkhWallet}
                  </h2>
                  <a href={`https://twitter.com/${profile.socialMedia}`} target='_blank' className='flex align-bottom  '>
                  <Image height={15} width={15} src='/twitter.jpg' className='mt-1'/>
                  <h2 className='text-sm text-neutral-400 '>{profile.socialMedia}</h2>
                  </a> 

                  </div>
                </div>
                {pkhWallet == pkh ?
                  <div>
                    <Button color='primary' radius="full" variant='solid' onPress={onOpen} >
                      {hasDeployedContract ? 'Check Donation' : 'Enabale Donation'}
                    </Button>
                  </div>
                  :
                  <div className='flex gap-4 items-center'>
                    <Subscribed profileId={profileId} />
                    <Donate coffeeContractAddress={coffeeContractAddress} />
                  </div>
                }

              </div>
              <hr className='bg-gray-500 m-2'></hr>

            </div>
            <div className="flex w-full flex-col">
              <Tabs aria-label="Options">
                <Tab key="Home" title="Home">
                  <div className='flex flex-col gap-4'>
                    
                    <Card>
                      <CardBody  
                      className='h-[150px]'
                      >
                      <h2>Description:</h2>
                        <motion.p
                          className='overflow-hidden'
                          whileTap={{
                            scale: 0.99,
                          }}
                        >{profile.description}</motion.p>
                      </CardBody>
                    </Card>
                     <div className='border-b-1 '></div>
                      {hasDeployedContract ? <DonationHistory coffeeContractAddress={coffeeContractAddress} /> :
                     
                       <div className="flex flex-col items-center">
                        <h1 className='text-2xl text-neutral-500'>No Messages Received</h1>
                       <Image
                       width={300}
                       height={300}
                       alt="NextUI hero Image"
                       src='/newsletter-3.png'
                     />
                        </div>
                        
                      }
                  <div className='h-10'></div>
                  </div>
                </Tab>
                <Tab key="Posts" title="Posts">                
                <LoadPostById phkwallet={pkhWallet}/>           
            </Tab>
            
            {pkhWallet==pkh&&
            <Tab key="Saved" title="Saved">
              <LoadSavedFile saved={profile.saved} />
            </Tab>}

              </Tabs>
            </div>
            {pkhWallet == pkh && <Post />}
            {hasDeployedContract ?
              (
                <Modal backdrop='blur' isOpen={isOpen} onOpenChange={onOpenChange} size='md' className='p-4'>
                  <ModalContent>
                    {(onClose) => (
                      <>
                        <ModalHeader className="flex flex-col gap-1">
                          <Button color='primary' variant='solid' onClick={connectWallet}>{walletConnected ? 'Connected' : 'Connect Wallet'}</Button>
                        </ModalHeader>
                        <ModalBody className=''>

                          {contractBalance !== null ? (
                            <div className='flex flex-row align-middle justify-center gap-2'>

                              <h2 className='font-semibold '>Total Donation: {contractBalance} </h2>
                              <Image src='/ethereum-eth-logo.png' height={20} width={20} alt='ETH logo' />

                            </div>
                          ) : (
                            <p>Loading...</p>
                          )}




                        </ModalBody>
                        <ModalFooter className='flex justify-center'>
                          <Button className='flex justify-center' variant='solid' color='primary' onClick={handleClaim} >Claim</Button>

                        </ModalFooter>
                      </>
                    )}
                  </ModalContent>
                </Modal>
              ) :
              (<Modal backdrop='blur' isOpen={isOpen} onOpenChange={onOpenChange} size='md' className='p-4'>
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader className="flex flex-col gap-1">
                        <Button color='primary' variant='solid' onClick={connectWallet}>{walletConnected ? address : 'Connect Wallet'}</Button>
                      </ModalHeader>
                      <ModalBody>
                        <h2 className='font-sm text-neutral-500'>Donation offers direct financial support, fostering community engagement, recognizing contributors,
                          and providing creators with sustainable income, fostering content creation.</h2>


                      </ModalBody>
                      <ModalFooter className='flex justify-center'>
                        <Button onClick={deployContract} variant='solid' color='primary'>Enable Donatation</Button>

                      </ModalFooter>
                    </>
                  )}
                </ModalContent>
              </Modal>)
            }


          </div>
        </div>

        :
        <div>
          NO profile created
        </div>
      }
    </div>
  )
};

export default Profile