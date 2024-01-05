import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'; 
const AccountScreen = () => {
  const [userName, setUserName] = useState('Rumeysa');
  const [email, setEmail] = useState('rumeysa@gmail.com');
  const [password, setPassword] = useState('•••••••');

  const handleEdit = () => {
    // Kullanıcı bilgilerini düzenleme işlemleri burada gerçekleştirilebilir.
    // Örneğin bir modale yönlendirilebilir.
    console.log('Kullanıcı bilgileri düzenleme işlemi...');
  };

  const handleLogout = () => {
    // Çıkış yapma işlemi burada gerçekleştirilebilir.
    console.log('Çıkış yapma işlemi...');
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
          editable={false} // Kullanıcı adının editleme durumu
        />
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={(text) => setEmail(text)}
          editable={false} // Email'in editleme durumu
        />
        <Text style={styles.label}>Şifre:</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={true}
          editable={false} // Şifrenin editleme durumu
        />
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Text style={styles.editButtonText}>Düzenle</Text>
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
    marginTop:20,
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
