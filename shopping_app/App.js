import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState, useEffect } from "react";
import { firebase } from "./firebase";
import { UserProvider } from './UserContext';

import AppNavigator from "./components/AppNavigator"; 
import AdminNavigator from "./components/AdminNavigator";
import Login from "./screens/LoginScreen";
import Register from "./screens/RegisterScreen";


const Stack = createNativeStackNavigator();

function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [isAdmin, setIsAdmin] = useState(false);
  const [a,setA]=useState('');
  function onAuthStateChanged(user) {
    
    const fetchData = async () => {
      if (user) {
        try {
          const userRef = firebase.firestore().collection('users').doc(user.uid);
          const doc = await userRef.get();
  
          if (doc.exists) {
            const userData = doc.data();
            setIsAdmin(userData.role === 'admin');
          }
        } catch (error) {
          console.error("Kullanıcı bilgilerini alırken hata oluştu:", error.message);
        }
      }
      setA(user);
    };
    fetchData();
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    
    return () => subscriber();
  }, []);

  if (initializing) return null;

  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator
        >
          {!user ? (
            <>
              <Stack.Screen
                name="Login"
                component={Login}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="Register"
                component={Register}
                options={{
                  headerShown: false,
                }}
              />
            </>
          ) : (<>
            {isAdmin ? (
              <Stack.Screen
                name="AdminNavigator"
                component={AdminNavigator}
                options={{ headerShown: false }}
              />
            ) : (
              <Stack.Screen
                name="AppNavigator"
                component={AppNavigator}
                options={{ headerShown: false }}
              />
            )}
          </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
      </UserProvider>
  );
}

export default App;