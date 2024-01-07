
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { firebase } from '../firebase';

const SignOutScreen = ({ navigation }) => {
  const handleLogout = async () => {
    try {
      await firebase.auth().signOut();
      console.log('Logout successful');
      navigation.navigate('Login'); // Çıkış yapıldıktan sonra yönlendirilecek sayfa
    } catch (error) {
      console.error('Error during logout:', error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Çıkış yapmak istediğinizden emin misiniz?</Text>
      <TouchableOpacity onPress={handleLogout} style={{ marginTop: 20 }}>
        <Text style={{ color: 'blue' }}>Çıkış Yap</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignOutScreen;
