import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { useUser } from '../UserContext';
import { firebase } from '../firebase';

const MyOrderScreen = () => {
  const { uid } = useUser();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersRef = firebase.firestore().collection('orders');
        const userOrdersSnapshot = await ordersRef.where('uid', '==', uid).get();

        const userOrdersData = await Promise.all(
          userOrdersSnapshot.docs.map(async (doc) => {
            const orderData = doc.data();

            const orderItemsWithDetails = await Promise.all(
              orderData.items.map(async (orderItem) => {
                const bookSnapshot = await firebase.firestore().collection('books').doc(orderItem.bookId).get();
                const bookData = bookSnapshot.data();
                return {
                  ...orderItem,
                  bookData,
                };
              })
            );

            return {
              id: doc.id,
              ...orderData,
              items: orderItemsWithDetails,
            };
          })
        );

        setOrders(userOrdersData);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [uid]);

  const renderItem = ({ item }) => (
    <View style={styles.orderContainer}>
      <Image style={styles.image} source={{ uri: item.items[0].bookData.image }} />
      <View style={styles.detailsContainer}>
        <Text style={styles.bookName}>{item.items[0].bookData.bookName}</Text>
        <Text style={styles.author}>{item.items[0].bookData.author}</Text>
        <Text style={styles.info}>Yayın Yılı: {item.items[0].bookData.date}</Text>
        <Text style={styles.info}>Tür: {item.items[0].bookData.genre}</Text>
        <Text style={styles.status}>Sipariş Durumu: {item.status}</Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={orders}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  orderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomColor: '#ccc',
  },
  image: {
    width: 100,
    height: 150,
    marginRight: 16,
  },
  detailsContainer: {
    flex: 1,
  },
  bookName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  author: {
    color: '#777',
  },
  info: {
    marginTop: 4,
    color: '#555',
  },
  status: {
    marginTop: 8,
    color: 'green',
  },
});

export default MyOrderScreen;
