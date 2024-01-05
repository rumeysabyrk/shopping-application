import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';

const MyOrderScreen = () => {
  const orders = [
    {
      id: 1,
      bookName: 'Ask ve Gurur',
      author: 'Jane Austen',
      date: '2018',
      genre: 'Roman',
      image: 'https://img.kitapyurdu.com/v1/getImage/fn:3095891/wh:true/wi:800',
      price: '150',
      stock: '5',
      status: 'Sipariş Alındı',
    },
    {
      id: 2,
      bookName: 'Hayvanlardan Tanırlara',
      author: 'Yuval Noah Harari',
      date: '10-03-2000',
      genre: 'Tarih',
      image: 'https://i.dr.com.tr/cache/500x400-0/originals/0000000633872-1.jpg',
      price: '300',
      stock: '5',
      status: 'Hazırlanıyor',
    },
    {
      id: 3,
      bookName: 'Rüyaların Gizli Dili',
      author: 'Berrin Türkoğlu',
      date: '2014',
      genre: 'Parapsikoloji',
      image: 'https://img.kitapyurdu.com/v1/getImage/fn:134737/wh:true/wi:800',
      price: '100',
      stock: '3',
      status: 'Teslim Edildi',
    },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.orderContainer}>
      <Image style={styles.image} source={{ uri: item.image }} />
      <View style={styles.detailsContainer}>
        <Text style={styles.bookName}>{item.bookName}</Text>
        <Text style={styles.author}>{item.author}</Text>
        <Text style={styles.info}>Yayın Yılı: {item.date}</Text>
        <Text style={styles.info}>Tür: {item.genre}</Text>
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
    color: 'green', // Sipariş Durumu rengini dilediğiniz gibi değiştirebilirsiniz
  },
});

export default MyOrderScreen;
