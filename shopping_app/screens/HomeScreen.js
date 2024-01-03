import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, FlatList } from "react-native"
import Btn from "../components/Btn"
import {firebase} from '../firebase';

const styles = StyleSheet.create({
    view: {
        width: "100%",
        height: "100%",
        padding: 25
    }
})

export default function HomeScreen({ navigation }) {
    return <View>
        <Text>Home</Text>
    </View>
}