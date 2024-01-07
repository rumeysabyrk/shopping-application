import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons'; 

import ProductOperation from '../screens/AddBook';
import EditBook from '../screens/EditBookScreen';
import SignOutScreen from '../screens/SignOutScreen'
const Tab = createBottomTabNavigator();



const AdminNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Ürün Ekleme"
        component={ProductOperation}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="pluscircleo" size={24} color="black" />
          ),
        }}
      />
      <Tab.Screen
        name="Ürün Düzenleme"
        component={EditBook}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Entypo name="open-book" size={24} color="black" />
          ),
        }}
      />
      <Tab.Screen
        name="Çıkış Yap"
        component={SignOutScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Entypo name="log-out" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AdminNavigator;
