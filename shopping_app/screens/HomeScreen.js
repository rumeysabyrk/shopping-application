import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { firebase } from '../firebase';
import Icon from 'react-native-vector-icons/FontAwesome';


const HomeScreen = () => {
  const [books, setBooks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const ref = firebase.firestore().collection("favorites");
  useEffect(() => {
    const fetchBooks = async () => {
      const booksRef = firebase.firestore().collection('books');
      const snapshot = await booksRef.get();

      const booksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setBooks(booksData);
    };
      fetchBooks();
  }, []);

  const addToFavorites = (bookId) => {
    const data = {
      bookId:bookId,
    };
    ref.add(data)
    if (isFavorite) {
      setFavorites(favorites.filter(favorite => favorite !== bookId));
    } else {
      setFavorites([...favorites, bookId]);
    }
  };

  const isBookFavorite = (bookId) => {
    return favorites.includes(bookId);
  };

  const renderItem = ({ item }) => (
    <View style={{ margin: 8, padding: 16, backgroundColor: '#E9E8E8', borderRadius: 10, position: 'relative' }}>
      <TouchableOpacity
        style={{
          position: 'absolute',
          right:5,
          top: 8,
          backgroundColor: '#E8E8E8',
          borderRadius: 8,
          padding: 8,
          zIndex: 2,
        }}
        onPress={() => addToFavorites(item.id)}
      >
        <Icon name="heart" size={20} color={isBookFavorite(item.id) ? 'red' : 'white'} />
      </TouchableOpacity>
      <Image style={{ width: 100, height: 150, marginBottom: 8 }} source={{ uri: item.image }} />
      <Text>{item.bookName}</Text>
      <Text>{item.author}</Text>
      <Text>Yayın Yılı: {item.date}</Text>
      <Text>Fiyat: {item.price}</Text>
      <TouchableOpacity style={{ backgroundColor: 'green', padding: 8, borderRadius: 5, marginTop: 8 }}>
        <Text style={{ color: 'white' }}>Sepete Ekle</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={books}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      numColumns={2}
      contentContainerStyle={{ padding: 8 }}
    />
  );
};

export default HomeScreen;
