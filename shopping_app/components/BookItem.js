// components/BookItem.js

import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const BookItem = ({ book, onDelete, /*onEdit*/ }) => (
  <View style={styles.itemContainer}>
    <Image style={styles.image} source={{ uri: book.image }} />
    <View style={styles.textContainer}>
      <Text style={styles.title}>{book.bookName}</Text>
      <Text>{book.author}</Text>
      <Text>{book.genre}</Text>
      <Text>Fiyat: {book.price}</Text>
      <Text>Yayın Tarihi: {book.date}</Text>
    </View>
    <View style={styles.iconContainer}>
      <TouchableOpacity onPress={onDelete} style={styles.flatIcon}>
        <Icon name="trash" size={20} color="red" />
      </TouchableOpacity>
      <TouchableOpacity /*onPress={onEdit}*/>
        <Icon name="edit" size={20} color="blue" />
      </TouchableOpacity>
    </View>
  </View>
);

const styles = {
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
  flatIcon: {
    marginBottom: 15,
  },
};

export default BookItem;
