import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { firebase } from '../firebase';
import Icon from 'react-native-vector-icons/FontAwesome';

const FavoriteScreen = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const booksRef = firebase.firestore().collection('books');
        const snapshot = await booksRef.limit(2).get();

        const booksData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setBooks(booksData);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  const addToFavorites = (bookId) => {
    // Favorilere ekleme işlemini gerçekleştir
    // Bu kısmı ihtiyacınıza göre Firebase veya başka bir veritabanı işlemi ile değiştirebilirsiniz
    console.log('Favorilere eklendi:', bookId);
  };

  const addToCart = (bookId) => {
    // Sepete ekleme işlemini gerçekleştir
    // Bu kısmı ihtiyacınıza göre Firebase veya başka bir veritabanı işlemi ile değiştirebilirsiniz
    console.log('Sepete eklendi:', bookId);
  };

  const renderItem = ({ item }) => (
    <View style={{ margin: 8, padding: 16, backgroundColor: '#E9E8E8', borderRadius: 10, position: 'relative' }}>
      <TouchableOpacity
        style={{
          position: 'absolute',
          left: 8,
          top: 8,
          backgroundColor: '#E8E8E8',
          borderRadius: 8,
          padding: 8,
          zIndex: 2,
        }}
        onPress={() => addToFavorites(item.id)}
      >
        <Icon name="heart" size={20} color="red" />
      </TouchableOpacity>
      <Image style={{ width: 100, height: 150, marginBottom: 8 }} source={{ uri: item.image }} />
      <Text>{item.bookName}</Text>
      <Text>{item.author}</Text>
      <Text>Yayın Yılı: {item.date}</Text>
      <Text>Fiyat: {item.price}</Text>
      <TouchableOpacity style={{ backgroundColor: 'green', padding: 8, borderRadius: 5, marginTop: 8 }} onPress={() => addToCart(item.id)}>
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

export default FavoriteScreen;
