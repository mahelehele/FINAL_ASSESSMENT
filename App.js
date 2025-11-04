import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RootNavigator from "./src/navigation/RootNavigator";
import { auth } from './src/firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function App() {
  const [firstLaunch, setFirstLaunch] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLaunch = async () => {
      try {
        const value = await AsyncStorage.getItem("alreadyLaunched");
        if (value == null) {
          // first time ever opening the app on this device
          await AsyncStorage.setItem("alreadyLaunched", "true");
          setFirstLaunch(true);
        } else {
          setFirstLaunch(false);
        }
      } catch (e) {
        console.error('Error checking launch or user', e);
        setFirstLaunch(false);
        setIsLoggedIn(false);
      }
    };
    checkLaunch();
  }, []);

  // Subscribe to Firebase auth state so the UI updates automatically
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return unsubscribe;
  }, []);

  if (firstLaunch === null) return null;

  return (
    <NavigationContainer>
      <RootNavigator firstLaunch={firstLaunch} isLoggedIn={isLoggedIn} />
    </NavigationContainer>
  );
}
