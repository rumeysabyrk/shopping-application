import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons'; 

import ProductOperation from '../screens/ProductOperationScreen';
import Order from '../screens/OrderScreen';


const Tab = createBottomTabNavigator();

const AdminNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Ürün İşlemleri"
        component={ProductOperation}
        options={{
          
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="pluscircleo" size={24} color="black" />
          ),
        }}
      />
      <Tab.Screen
        name="Siparişler"
        component={Order}
        options={{
          tabBarLabel: 'Order',
          tabBarIcon: ({ color, size }) => (
            <Feather name="shopping-cart" size={24} color="black" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AdminNavigator;