import React, { createContext, useContext, useState } from 'react';

const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [subscriber, setSubscriber] = useState('No Subscriber');

  return (
    <MyContext.Provider value={{ subscriber, setSubscriber }}>
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => {
  return useContext(MyContext);
};
