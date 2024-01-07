import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, Button, Alert } from 'react-native';
import { firebase } from '../firebase';
import { useUser } from '../UserContext';
import Icon from 'react-native-vector-icons/FontAwesome';

const CartScreen = () => {
  const { uid } = useUser();
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const cartRef = firebase.firestore().collection('cart');
        const booksRef = firebase.firestore().collection('books');

        const cartSnapshot = await cartRef.where('uid', '==', uid).get();

        const cartData = await Promise.all(cartSnapshot.docs.map(async (doc) => {
          const bookId = doc.data().bookId;
          const bookSnapshot = await booksRef.doc(bookId).get();
          const bookData = bookSnapshot.data();

          return {
            id: doc.id,
            bookId,
            quantity: doc.data().quantity,
            ...bookData,
          };
        }));

        setCart(cartData);
        calculateTotalPrice(cartData);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  });

  const removeFromCart = async (itemId) => {
    try {
      const cartRef = firebase.firestore().collection('cart');
      await cartRef.doc(itemId).delete();

      setCart((prevCart) => prevCart.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error removing book from cart:', error);
    }
  };

  const calculateTotalPrice = (cartData) => {
    if (!cart || cart.length === 0) {
      return 0;
    }
    let total = 0;
    for (const cartItem of cartData) {
      total += cartItem.price * cartItem.quantity;
    }
    setTotalPrice(total);
  };

  const handleOrder = async () => {
    try {
      const ordersRef = firebase.firestore().collection('orders');
      const orderItems = cart.map(cartItem => ({ bookId: cartItem.bookId, quantity: cartItem.quantity }));

      await ordersRef.add({
        uid,
        items: orderItems,
        total: totalPrice,
        status: 'Siparişiniz hazırlanıyor',
      });

      const cartRef = firebase.firestore().collection('cart');
      await Promise.all(cart.map(cartItem => cartRef.doc(cartItem.id).delete()));

      setCart([]);
      setTotalPrice(0);

      Alert.alert('Başarılı', 'Siparişiniz alındı. Teşekkür ederiz!');
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 8, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image style={{ width: 50, height: 75, marginRight: 8 }} source={{ uri: item.image }} />
        <View>
          <Text>{item.bookName}</Text>
          <Text>Yazar: {item.author}</Text>
          <Text>Fiyat: {item.price} TL</Text>
          <Text>Adet: {item.quantity}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => removeFromCart(item.id)}>
        <Icon name="trash" size={20} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={cart}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
      <View style={{ marginTop: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Toplam Tutar: {totalPrice} TL</Text>
      </View>
      <Button title="Ödeme Yap" onPress={handleOrder} />
    </View>
  );
};

export default CartScreen;
