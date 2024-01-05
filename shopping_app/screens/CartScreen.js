import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, Button } from 'react-native';
import { firebase } from '../firebase';

const CartScreen = () => {
  const [books, setBooks] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const booksRef = firebase.firestore().collection('books');
        const snapshot = await booksRef.limit(3).get();

        const booksData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          quantity: 1,
        }));

        setBooks(booksData);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  const incrementQuantity = (bookId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((cartItem) =>
        cartItem.id === bookId ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
      );
      return updatedCart;
    });
  };

  const decrementQuantity = (bookId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((cartItem) =>
        cartItem.id === bookId && cartItem.quantity > 1 ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem
      );
      return updatedCart;
    });
  };

  const calculateTotalPrice = () => {
    return cart.reduce((total, cartItem) => total + cartItem.price * cartItem.quantity, 0);
  };

  const renderItem = ({ item }) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 8, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image style={{ width: 50, height: 75, marginRight: 8 }} source={{ uri: item.image }} />
        <View>
          <Text>{item.bookName}</Text>
          <Text>Yazar: {item.author}</Text>
          <Text>Fiyat: {item.price} TL</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => decrementQuantity(item.id)}>
          <Text style={{ fontSize: 20, marginRight: 8 }}>-</Text>
        </TouchableOpacity>
        <Text>{item.quantity}</Text>
        <TouchableOpacity onPress={() => incrementQuantity(item.id)}>
          <Text style={{ fontSize: 20, marginLeft: 8 }}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
      <View style={{ marginTop: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Toplam Tutar: 550 TL</Text>
      </View>
      <Button title="Ödeme Yap" onPress={() => alert('Ödeme işlemi yapılacak')} />
    </View>
  );
};

export default CartScreen;
