import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Modal, TextInput, Button } from 'react-native';
import { firebase } from '../firebase';
import Icon from 'react-native-vector-icons/FontAwesome';

const EditBookScreen = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [updatedBookName, setUpdatedBookName] = useState('');
  const [updatedAuthor, setUpdatedAuthor] = useState('');
  const [updatedGenre, setUpdatedGenre] = useState('');
  const [updatedStock, setUpdatedStock] = useState('');
  const [updatedPrice, setUpdatedPrice] = useState('');
  const [updatedDate, setUpdatedDate] = useState('');

  const ref = firebase.firestore().collection('books');

  useEffect(() => {
    const unsubscribe = ref.onSnapshot(querySnapshot => {
      const bookList = [];
      querySnapshot.forEach(doc => {
        const {
          bookName,
          author,
          genre,
          stock,
          price,
          date,
          image,
        } = doc.data();
        bookList.push({
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
      setBooks(bookList);
    });

    return () => unsubscribe();
  }, []);

  const deleteBook = async (bookId) => {
    try {
      await ref.doc(bookId).delete();
      alert('Kitap başarıyla silindi!');
    } catch (error) {
      console.error('Kitap silinirken bir hata oluştu: ', error);
    }
  };

  const openEditModal = (book) => {
    setSelectedBook(book);
    setUpdatedBookName(book.bookName);
    setUpdatedAuthor(book.author);
    setUpdatedGenre(book.genre);
    setUpdatedStock(book.stock);
    setUpdatedPrice(book.price);
    setUpdatedDate(book.date);
    setModalVisible(true);
  };

  const updateBook = async () => {
    try {
      await ref.doc(selectedBook.id).update({
        bookName: updatedBookName,
        author: updatedAuthor,
        genre: updatedGenre,
        stock: updatedStock,
        price: updatedPrice,
        date: updatedDate,
      });
      setModalVisible(false);
      alert('Kitap başarıyla güncellendi!');
    } catch (error) {
      console.error('Kitap güncellenirken bir hata oluştu: ', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.bookName}</Text>
        <Text>{`Yazar: ${item.author}`}</Text>
        <Text>{`Tür: ${item.genre}`}</Text>
        <Text>{`Stok Miktarı: ${item.stock}`}</Text>
        <Text>{`Fiyat: ${item.price}`}</Text>
        <Text>{`Yayın Yılı: ${item.date}`}</Text>
      </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => deleteBook(item.id)}>
          <Icon name="trash" size={20} color="red" style={styles.flatIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openEditModal(item)}>
          <Icon name="edit" size={20} color="blue" style={styles.flatIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />

      {}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Kitap Bilgilerini Düzenle</Text>
            <TextInput
              style={styles.input}
              placeholder='Kitap Adı'
              value={updatedBookName}
              onChangeText={(text) => setUpdatedBookName(text)}
            />
            <TextInput
              style={styles.input}
              placeholder='Yazar'
              value={updatedAuthor}
              onChangeText={(text) => setUpdatedAuthor(text)}
            />
            <TextInput
              style={styles.input}
              placeholder='Tür'
              value={updatedGenre}
              onChangeText={(text) => setUpdatedGenre(text)}
            />
            <TextInput
              style={styles.input}
              placeholder='Stok sayısı'
              value={updatedStock}
              onChangeText={(text) => setUpdatedStock(text)}
            />
            <TextInput
              style={styles.input}
              placeholder='Fiyat'
              value={updatedPrice}
              onChangeText={(text) => setUpdatedPrice(text)}
            />
            <TextInput
              style={styles.input}
              placeholder='Yayın Tarihi'
              value={updatedDate}
              onChangeText={(text) => setUpdatedDate(text)}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.updateButton} onPress={updateBook}>
                <Text style={styles.buttonText}>Güncelle</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>İptal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
  flatIcon: {
    marginBottom: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    elevation: 5,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  updateButton: {
    backgroundColor: 'green',
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 5,
    flex: 1,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'red',
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 5,
    flex: 1,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  input: {
    height: 40,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});

export default EditBookScreen;
