import React, { useState } from 'react';
import {
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Image,
} from "@nextui-org/react";
import toast from 'react-hot-toast';
import Web3 from 'web3'; 

import { useStore } from '@dataverse/hooks';
import { CoffeeABI } from '@/output';

const Donate = ({ coffeeContractAddress }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [walletConnected, setWalletConnected] = useState(false);
  const [message, setMessage] = useState('');
  const [amount, setAmount] = useState();
  const [name, setName] = useState('');
  const { address } = useStore();

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletConnected(true);
        toast.success('Connected Address');
      } else {
        toast.error('Web3 not detected. Please install MetaMask or another Ethereum wallet.');
      }
    } catch (error) {
      toast.error('Error connecting wallet:', error.message || error);
    }
  };

  const handleBuyCoffee = async () => {
    try {
      if (!window.ethereum) {
        toast.error('Web3 not detected. Please install MetaMask or another Ethereum wallet.');
        return;
      }

      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.requestAccounts();
      const currentAccount = accounts[0];

      const coffeeContract = new web3.eth.Contract(CoffeeABI, coffeeContractAddress);

      const tx = await coffeeContract.methods.buycoffee(name, message).send({
        from: currentAccount,
        value: web3.utils.toWei('0.01', 'ether'),
      });

      console.log('Transaction Hash:', tx.transactionHash);
      toast.success(`Donated Successfully`);
    } catch (error) {
      toast.error('Transaction error:', error.message || error);
    }
  };

  return (
    <div>
      <Button color="success" radius="full" variant="solid" onPress={onOpen}>
        Donate
      </Button>

      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="md"
        className="p-4"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <Button
                  color="primary"
                  variant="solid"
                  onClick={connectWallet}
                >
                  {walletConnected ? 'Connected' : 'Connect Wallet'}
                </Button>
                <p className='text-sm text-neutral-400'>{coffeeContractAddress}</p>
              </ModalHeader>
              <ModalBody>
                <div  className='flex flex-row align-middle justify-center gap-2'>
                    <p className='text-md font-semibold  '>Doation amount: 0.01 </p>
                    <Image src='/ethereum-eth-logo.png' height={20} width={20} alt='ETH logo' />
                </div>
                <Input
                  value={message}
                  onValueChange={setMessage}
                  label="Comments"
                />
                <Input value={name} onValueChange={setName} label="Name" />
              </ModalBody>
              <ModalFooter className="flex justify-center">
                <Button
                  className="flex justify-center"
                  variant="solid"
                  color="primary"
                  onClick={handleBuyCoffee}
                >
                  Donate
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Donate;
