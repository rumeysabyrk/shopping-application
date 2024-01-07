import React, { useState } from 'react'
import { Text, View, StyleSheet } from "react-native"
import TextBox from "../components/TextBox"
import Btn from "../components/Btn"
import {firebase} from '../firebase'
import { useUser } from '../UserContext';

const styles = StyleSheet.create({
    view: {
        flex: 1,
        width: "100%",
        justifyContent: "center",
        alignItems: "center"
    }
})

export default function Loginscreen({ navigation }) {
    const { uid, setUserId } = useUser();
    const [values, setValues] = useState({
        email: "",
        pwd: ""
    })

    function handleChange(text, eventName) {
        setValues(prev => {
            return {
                ...prev,
                [eventName]: text
            }
        })
    }

    const loginUser = async () => {
        const { email, pwd } = values
        try {
            const userCredential = await firebase.auth().signInWithEmailAndPassword(email, pwd);
      
      const uid = userCredential.user.uid;

      setUserId(uid);
      console.log(uid);
            
          } catch (error) {
            alert(error.message);
          }
    }

    return <View style={styles.view}>
        <Text style={{ fontSize: 34, fontWeight: "800", marginBottom: 20 }}>Giriş Yap</Text>
        <TextBox placeholder="Email Address" onChangeText={text => handleChange(text, "email")} />
        <TextBox placeholder="Password" onChangeText={text => handleChange(text, "pwd")} secureTextEntry={true} />
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "92%", }}>
            <Btn onClick={() => loginUser()} title="Login" style={{ width: "48%" }} />
            <Btn onClick={() => navigation.navigate("Register")} title="Register" style={{ width: "48%", backgroundColor: "#344869" }} />
        </View>
    </View>
}