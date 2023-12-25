import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { useState,useEffect } from "react";
import { firebase } from "./firebase";


import Login from "./screens/LoginScreen";
import Register from "./screens/RegisterScreen";
import Home from "./screens/HomeScreen";
import Header from "./components/Header";


const Stack = createNativeStackNavigator();


function App(){
  const [initializing,setInitializing]=useState(true);
  const [user,setUser]=useState();

  function onAuthStateChanged(user){
    setUser(user);
    if(initializing) setInitializing(false);
  }

  useEffect(()=>{
    const subscriber=firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber

  },[]);

  if(initializing) return null;
  if(!user){
    return(
      <Stack.Navigator>
        <Stack.Screen 
          name="Login"
          component={Login}
          options={{
            headerTitle:()=> <Header name ="rumeysa"/>,
            headerStyle:{
              height:150,
              borderBottomLeftRadius:50,
              borderBottomRightRadius:50,
              backgroundColor:"#00e4d0",
              shadowColor:"#000",
              elevation:25
            }
          }}
        />
        <Stack.Screen 
          name="Register"
          component={Register}
          options={{
            headerTitle:()=> <Header name ="rumeysa"/>,
            headerStyle:{
              height:150,
              borderBottomLeftRadius:50,
              borderBottomRightRadius:50,
              backgroundColor:"#00e4d0",
              shadowColor:"#000",
              elevation:25
            }
          }}
        />
      </Stack.Navigator>
    );
    
  }

  return(
    <Stack.Navigator>
      <Stack.Screen 
          name="Home"
          component={Home}
          options={{
            headerTitle:()=> <Header name ="Home"/>,
            headerStyle:{
              height:150,
              borderBottomLeftRadius:50,
              borderBottomRightRadius:50,
              backgroundColor:"#00e4d0",
              shadowColor:"#000",
              elevation:25
            }
          }}
        />
    </Stack.Navigator>
  );

}



export default()=>{
  return(
    <NavigationContainer>
      <App/>
    </NavigationContainer>
  )
}