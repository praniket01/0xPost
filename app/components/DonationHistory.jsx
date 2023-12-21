import { CoffeeABI } from '@/output';
import React, { useState, useEffect } from 'react';
import Web3 from 'web3'; // Assuming you've installed web3.js using npm or yarn

const DonationHistory = ({ coffeeContractAddress }) => {
  const [pastEvents, setPastEvents] = useState([]);
  const [contract, setContract] = useState(null);

  const initializeContract = async () => {
    try {
      const web3 = new Web3('https://eth-goerli.g.alchemy.com/v2/6ls7UbYyRKU_dCr0JXyfV6QXd-VplZyW');  
      const contractABI = CoffeeABI; // Replace with your actual ABI
      const coffeeContract = new web3.eth.Contract(contractABI, coffeeContractAddress);
      setContract(coffeeContract);
    } catch (error) {
      console.error('Error initializing contract:', error);
    }
  };

  const fetchPastEvents = async () => {
    try {
      const events = await contract.getPastEvents('boughtcoffe', {
        fromBlock: 0,
        toBlock: 'latest',
      });

      

      const parsedEvents = events.map((event) => {
        return {
          name: event.returnValues._name,
          timestamp: event.returnValues.timestamp,
          message: event.returnValues.message,
          user: event.returnValues.user,
        };
      });
      setPastEvents(parsedEvents.reverse());
      console.log(parsedEvents);
    } catch (error) {
      console.error('Error fetching past events:', error);
    }
  };

 

  useEffect(() => {
    initializeContract();
  }, []);

  useEffect(() => {
    if (contract) {
      fetchPastEvents();
      
    }
  }, [contract]);

  return (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4 flex justify-center">Message History </h2>
        <div className="grid gap-4">
          {pastEvents.filter((event) => event.message !== undefined)
    .map((event, index) => (
            <div
              key={index}
              className="p-4  border-2 rounded-md shadow-md bg-white dark:bg-gray-800"
            >
             <p className="text-neutral-600 dark:text-neutral-400 text-md font-sans font-bold ">User: {event.user}</p>
              <p className="text-gray-600 dark:text-gray-400 text-md font-semibold ">Message: {event.message}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm ">
                Timestamp: {new Date(Number(event.timestamp) * 1000).toLocaleString()}
              </p>
              
            </div>
          ))}
        </div>
      </div>
    
  );
};

export default DonationHistory;
