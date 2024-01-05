import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';

const OrderScreen = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [orderStatuses, setOrderStatuses] = useState({
    'Ask ve Gurur': 'Sipariş Alındı',
    'Hayvanlardan Tanırlara': 'Sipariş Alındı',
    'Rüyaların Gizli Dili': 'Sipariş Alındı',
  });

  const handleStatusChange = (bookName, status) => {
    setOrderStatuses((prevStatuses) => ({
      ...prevStatuses,
      [bookName]: status,
    }));
    setIsMenuOpen(false);
  };

  // Kitap Bilgileri
  const books = [
    {
      bookName: 'Ask ve Gurur',
      author: 'Jane Austen',
      date: '2018',
      genre: 'Roman',
      image: 'https://img.kitapyurdu.com/v1/getImage/fn:3095891/wh:true/wi:800',
      price: '150',
      stock: '5',
    },
    {
      bookName: 'Hayvanlardan Tanırlara',
      author: 'Yuval Noah Harari',
      date: '10-03-2000',
      genre: 'Tarih',
      image: 'https://i.dr.com.tr/cache/500x400-0/originals/0000000633872-1.jpg',
      price: '300',
      stock: '5',
    },
    {
      bookName: 'Rüyaların Gizli Dili',
      author: 'Berrin Türkoglu',
      date: '2014',
      genre: 'Parapsikoloji',
      image: 'https://img.kitapyurdu.com/v1/getImage/fn:134737/wh:true/wi:800',
      price: '100',
      stock: '3',
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.heading}>Sipariş Detayları</Text>

        {/* Kitap Bilgileri */}
        {books.map((book, index) => (
          <View key={index} style={styles.bookContainer}>
            <View style={styles.bookImageContainer}>
              <Image style={styles.bookImage} source={{ uri: book.image }} />
            </View>
            <View style={styles.bookInfoContainer}>
              <Text style={styles.bookTitle}>{book.bookName}</Text>
              <Text style={styles.bookAuthor}>{book.author}</Text>
              <Text style={styles.bookDetails}>{`Yayın Yılı: ${book.date}`}</Text>
              <Text style={styles.bookDetails}>{`Tür: ${book.genre}`}</Text>
              <Text style={styles.bookDetails}>{`Fiyat: ${book.price}`}</Text>
              <Text style={styles.bookDetails}>{`Stok: ${book.stock}`}</Text>
              <Text style={styles.orderStatus}>{`Sipariş Durumu: ${orderStatuses[book.bookName]}`}</Text>
            </View>
            <TouchableOpacity
              style={styles.statusContainer}
              onPress={() => setIsMenuOpen((prev) => (prev === index ? null : index))}
            >
              <Text style={styles.statusText}>Durumu Değiştir</Text>
            </TouchableOpacity>
            {isMenuOpen === index && (
              <View style={styles.menuContainer}>
                <TouchableOpacity onPress={() => handleStatusChange(book.bookName, 'Sipariş Alındı')}>
                  <Text style={styles.menuItem}>Sipariş Alındı</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleStatusChange(book.bookName, 'Hazırlanıyor')}>
                  <Text style={styles.menuItem}>Hazırlanıyor</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleStatusChange(book.bookName, 'Teslim Edildi')}>
                  <Text style={styles.menuItem}>Teslim Edildi</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  bookContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    position: 'relative',
  },
  bookImageContainer: {
    marginRight: 12,
  },
  bookImage: {
    width: 80,
    height: 120,
    borderRadius: 8,
  },
  bookInfoContainer: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookAuthor: {
    fontSize: 14,
    color: 'gray',
  },
  bookDetails: {
    fontSize: 14,
    marginVertical: 2,
  },
  orderStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statusContainer: {
    position: 'absolute',
    right: 0,
    top: 60,
    backgroundColor: '#009900',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    color:"white",
    fontSize: 14,
    fontWeight: 'bold',
  },
  menuContainer: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    top:80,
    borderRadius: 8,
    marginTop: 8,
  },
  menuItem: {
    fontSize: 14,
    marginVertical: 4,
  },
});

export default OrderScreen;
