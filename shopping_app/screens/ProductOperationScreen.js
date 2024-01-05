import { View, Text, StyleSheet, TextInput, Image, FlatList, TouchableOpacity, Keyboard, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react';
import { firebase } from "../firebase";

import BookItem from '../components/BookItem';
import { useNavigation } from '@react-navigation/native';
const ProductOperationScreen = () => {
  const [books, setBooks] = useState([]);
  const [bookName, setBookName] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [stock, setStock] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState('');
  const [image, setImage] = useState('');
  const ref = firebase.firestore().collection("books");
  const navigation = useNavigation();
  useEffect(() => {
    ref.onSnapshot(
      querySnapshot => {
        const books = [];
        querySnapshot.forEach(doc => {
          const { bookName, author, genre, stock, price, date, image } = doc.data();
          books.push({
            id: doc.id,
            bookName,
            author,
            genre,
            stock,
            price,
            date,
            image,
          });
        });
        setBooks(books);
      }
    );
  }, []);
  const editBook = (book) => {
    // Book verilerini UpdateBookScreen'e göndermek için navigation.navigate kullanılır
    navigation.navigate("EditBookScreen");
  };
  const deleteBook = (bookId) => {
    // Silme işlemini gerçekleştir
    ref
      .doc(bookId)
      .delete()
      .then(() => {
        console.log('Kitap başarıyla silindi!');
      })
      .catch(error => {
        console.error('Kitap silinirken bir hata oluştu: ', error);
      });
    };
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
      })
      .catch((error) => {
        alert(error);
      })
  };

  const renderItem = ({ item }) => (
    <BookItem
      book={item}
      onDelete={() => deleteBook(item.id)}
      //onEdit={() => navigation.navigate("EditBookScreen")}
    />
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
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

      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.flatlist}
        nestedScrollEnabled={true}
      />
    </ScrollView>
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
  flatlist: {
    width: '100%',
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
    backgroundColor: '#E9E8E8',
    padding: 8,
    borderRadius: 5,
  },
  image: {
    width: 50,
    height: 90,
    marginRight: 8,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  iconContainer: {
    flexDirection: 'column', // Yatay yerine dikey
    justifyContent: 'center', 
  },
  flatIcon:{
    marginBottom:15,
  },
  scrollContainer: {
    padding: 16,
    alignItems: 'center',
  },
});

export default ProductOperationScreen;
