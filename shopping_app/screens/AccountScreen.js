import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { firebase } from '../firebase';
import { useUser } from '../UserContext';

const AccountScreen = () => {
  const { uid } = useUser();
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRef = firebase.firestore().collection('users').doc(uid);
        const userDoc = await userRef.get();

        if (userDoc.exists) {
          const userData = userDoc.data();
          setUser(userData);
          setUserName(userData.name);
          setEmail(userData.email);
        } else {
          console.error('User not found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [uid]);

  const handleEdit = async () => {
    try {
      const userRef = firebase.firestore().collection('users').doc(uid);
      await userRef.update({
        userName,
        email,
      });
        
      console.log('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleChangePassword = async () => {
    try {
      await firebase.auth().currentUser.updatePassword(newPassword);
      setNewPassword('');
      Alert.alert('Success', 'Password changed successfully');
    } catch (error) {
      console.error('Error changing password:', error);
      Alert.alert('Error', 'Could not change password');
    }
  };

  const handleLogout = async () => {
    try {
      await firebase.auth().signOut();
      console.log('Logout successful');
    } catch (error) {
      console.error('Error during logout:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.userIconContainer}>
        <FontAwesome5 name="user-circle" size={100} color="black" />
      </View>
      <View style={styles.userInfoContainer}>
        <Text style={styles.label}>Kullanıcı Adı:</Text>
        <TextInput
          style={styles.input}
          value={userName}
          onChangeText={(text) => setUserName(text)}
          editable={true}
        />
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={(text) => setEmail(text)}
          editable={true}
        />
        <Text style={styles.label}>Yeni Şifre:</Text>
        <TextInput
          style={styles.input}
          value={newPassword}
          onChangeText={(text) => setNewPassword(text)}
          secureTextEntry={true}
          editable={true}
        />
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Text style={styles.editButtonText}>Düzenle</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.changePasswordButton} onPress={handleChangePassword}>
          <Text style={styles.editButtonText}>Şifre Değiştir</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userIconContainer: {
    marginBottom: 10,
  },
  userInfoContainer: {
    width: '80%',
  },
  label: {
    marginTop: 10,
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: '#0080FF',
    padding: 10,
    marginTop: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changePasswordButton: {
    backgroundColor: '#FFA500',
    padding: 10,
    marginTop: 10,
    marginBottom:15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
  },
  logoutButton: {
    position: 'absolute',
    bottom: 10,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default AccountScreen;
