import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Modal, Button, TextInput } from 'react-native';
import { useUser } from '../UserContext';
import { firebase } from '../firebase';
import Icon from 'react-native-vector-icons/FontAwesome';

const FavoriteScreen = () => {
  const { uid } = useUser();
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  useEffect(() => {
    const fetchFavoriteBooks = async () => {
      try {
        const favoritesRef = firebase.firestore().collection('favorites');
        const userFavoritesSnapshot = await favoritesRef.where('uid', '==', uid).get();

        const userFavoritesData = await Promise.all(
          userFavoritesSnapshot.docs.map(async (doc) => {
            const bookId = doc.data().bookId;
            const bookSnapshot = await firebase.firestore().collection('books').doc(bookId).get();
            return {
              id: bookSnapshot.id,
              ...bookSnapshot.data(),
            };
          })
        );

        setBooks(userFavoritesData);
      } catch (error) {
        console.error('Error fetching favorite books:', error);
      }
    };

    fetchFavoriteBooks();
  }, [uid, isAddedToCart]);

  const addToFavorites = async (bookId) => {
    try {
      const userFavoritesRef = firebase.firestore().collection('favorites').doc(`${uid}_${bookId}`);
      const userFavoritesDoc = await userFavoritesRef.get();

      if (userFavoritesDoc.exists) {
        // Koleksiyonda varsa, kaldır.
        await userFavoritesRef.delete();
      } else {
        // Koleksiyonda yoksa, ekle.
        await userFavoritesRef.set({
          uid,
          bookId,
        });
      }

      // Favori kitapları güncelle
      setIsAddedToCart(false); // Favoriye eklendiği durumda sepete eklenme durumunu sıfırla
    } catch (error) {
      console.error('Error adding/removing from favorites:', error);
    }
  };

  const addToCart = async () => {
    try {
      const { id, stock } = selectedBook;

      // Stok miktarını kontrol et
      if (stock < quantity) {
        console.warn('Yetersiz stok! Sepete eklemek istediğiniz miktar stoktan fazla.');
        return;
      }

      // Eğer stok yeterliyse sepete ekle
      const cartRef = firebase.firestore().collection('cart');
      await cartRef.add({
        uid,
        bookId: id,
        quantity,
      });

      // Modal'ı kapat
      setSelectedBook(null);
      setQuantity(1);
      setIsAddedToCart(true); // Favoriye eklendiği durumu güncelle
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const openModal = (book) => {
    setSelectedBook(book);
  };

  const closeModal = () => {
    setSelectedBook(null);
    setQuantity(1);
  };

  const renderBookItem = ({ item }) => (
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
        <Icon name="heart" size={20} color={'red'} />
      </TouchableOpacity>
      <Image style={{ width: 100, height: 150, marginBottom: 8 }} source={{ uri: item.image }} />
      <Text>{item.bookName}</Text>
      <Text>{item.author}</Text>
      <Text>Yayın Yılı: {item.date}</Text>
      <Text>Fiyat: {item.price}</Text>
      <TouchableOpacity style={{ backgroundColor: 'green', padding: 8, borderRadius: 5, marginTop: 8 }} onPress={() => openModal(item)}>
        <Text style={{ color: 'white' }}>{isAddedToCart ? 'Sepete Eklendi' : 'Sepete Ekle'}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View>
      <FlatList
        data={books}
        renderItem={renderBookItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ padding: 8 }}
      />

      <Modal visible={!!selectedBook} animationType="slide" transparent>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 16, borderRadius: 10, width: 300 }}>
            {selectedBook && (
              <>
                <Image style={{ width: 100, height: 150, marginBottom: 8 }} source={{ uri: selectedBook.image }} />
                <Text>{selectedBook.bookName}</Text>
                <Text>{selectedBook.author}</Text>
                <Text>Yayın Yılı: {selectedBook.date}</Text>
                <Text>Fiyat: {selectedBook.price}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                  <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))} style={{ padding: 8, backgroundColor: 'gray', borderRadius: 5, marginRight: 8 }}>
                    <Text style={{ color: 'white' }}>-</Text>
                  </TouchableOpacity>
                  <TextInput
                    value={quantity.toString()}
                    onChangeText={(text) => setQuantity(Math.max(1, parseInt(text) || 1))}
                    keyboardType="numeric"
                    style={{ padding: 8, backgroundColor: 'white', borderRadius: 5, marginRight: 8, width: 50 }}
                  />
                  <TouchableOpacity onPress={() => setQuantity(quantity + 1)} style={{ padding: 8, backgroundColor: 'gray', borderRadius: 5, marginLeft: 8 }}>
                    <Text style={{ color: 'white' }}>+</Text>
                  </TouchableOpacity>
                </View>
                <Button title="Sepete Ekle" onPress={addToCart} />
              </>
            )}
            <TouchableOpacity onPress={closeModal} style={{ position: 'absolute', top: 5, right: 5 }}>
              <Icon name="close" size={20} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FavoriteScreen;
