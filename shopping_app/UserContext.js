import React, { createContext, useContext, useState,useEffect } from 'react';
import { firebase } from "./firebase";
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [uid, setUid] = useState(null);

  const setUserId = (newUid) => {
    setUid(newUid);
  };
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe(); // Clean-up function
  }, []);
  return (
    <UserContext.Provider value={{ uid, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
