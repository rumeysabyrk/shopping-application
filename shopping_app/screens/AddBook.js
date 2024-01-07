import { View, Text, StyleSheet, TextInput,TouchableOpacity, Keyboard } from 'react-native'
import React, { useState } from 'react';
import { firebase } from "../firebase";

const ProductOperationScreen = () => {
  const [bookName, setBookName] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [stock, setStock] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState('');
  const [image, setImage] = useState('');
  const ref = firebase.firestore().collection("books");
  const addBook = async () => {
    const data = {
      bookName: bookName,
      author: author,
      genre: genre,
      stock: stock,
      price: price,
      date: date,
      image: image,
    };
    ref
      .add(data)
      .then(() => {
        setBookName("");
        setAuthor("");
        setGenre("");
        setStock("");
        setPrice("");
        setDate("");
        setImage("");
        Keyboard.dismiss();
      }).then(()=>{
        alert("Kitap başarıyla eklendi")
      })
      .catch((error) => {
        alert(error);
      })
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder='Kitap Adı'
        placeholderTextColor="#aaaaaa"
        onChangeText={(text) => setBookName(text)}
        value={bookName}
        underlineColorAndroid="transparent"
      />

      <TextInput
        style={styles.input}
        placeholder='Yazar'
        placeholderTextColor="#aaaaaa"
        onChangeText={(text) => setAuthor(text)}
        value={author}
        underlineColorAndroid="transparent"
      />

      <TextInput
        style={styles.input}
        placeholder='Tür'
        placeholderTextColor="#aaaaaa"
        onChangeText={(text) => setGenre(text)}
        value={genre}
        underlineColorAndroid="transparent"
      />
      <TextInput
        style={styles.input}
        placeholder='Stok sayısı'
        placeholderTextColor="#aaaaaa"
        onChangeText={(text) => setStock(text)}
        value={stock}
        underlineColorAndroid="transparent"
      />

      <TextInput
        style={styles.input}
        placeholder='Fiyat'
        placeholderTextColor="#aaaaaa"
        onChangeText={(text) => setPrice(text)}
        value={price}
        underlineColorAndroid="transparent"
      />

      <TextInput
        style={styles.input}
        placeholder='Yayın Tarihi'
        placeholderTextColor="#aaaaaa"
        onChangeText={(text) => setDate(text)}
        value={date}
        underlineColorAndroid="transparent"
      />
      <TextInput
        style={styles.input}
        placeholder='Resim url'
        placeholderTextColor="#aaaaaa"
        onChangeText={(text) => setImage(text)}
        value={image}
        underlineColorAndroid="transparent"
      />
      <TouchableOpacity style={styles.button} onPress={addBook}>
        <Text style={styles.buttonText}>Ekle</Text>
      </TouchableOpacity>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  input: {
    height: 48,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "white",
    paddingLeft: 16,
    marginBottom: 16,
    width: '80%',
  },
  button: {
    height: 47,
    borderRadius: 5,
    backgroundColor: "green",
    width: 80,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
  },
});

export default ProductOperationScreen;
