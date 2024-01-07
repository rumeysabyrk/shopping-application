import React, { useState, useEffect,useContext } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity,Modal } from 'react-native';
import { firebase } from '../firebase';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useUser } from '../UserContext';

const HomeScreen = () => {
  const { uid, setUserId } = useUser();
  const [books, setBooks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const favoritesRef = firebase.firestore().collection("favorites");
  const [selectedBook, setSelectedBook] = useState(null);
  const [quantity, setQuantity] = useState(1); 
  const [cartItems, setCartItems] = useState([]);
  const cartRef = firebase.firestore().collection("cart");
  const [sepeteEklendiMap, setSepeteEklendiMap] = useState({});

  useEffect(() => {
    const checkIfInCart = async (bookId) => {
      try {
        const cartRef = firebase.firestore().collection('cart');
        const cartSnapshot = await cartRef.where('uid', '==', uid).where('bookId', '==', bookId).get();
    
        return !cartSnapshot.empty;
      } catch (error) {
        console.error('Error checking if book is in cart:', error);
        return false;
      }
    };
    
    const fetchBooks = async () => {
      const booksRef = firebase.firestore().collection('books');
      const snapshot = await booksRef.get();
    
      const booksData = snapshot.docs.map(async (doc) => {
        const bookId = doc.id;
        const bookData = doc.data();
    
        // Sepette olup olmadığını kontrol et
        const isInCart = await checkIfInCart(bookId);
    
        return {
          id: bookId,
          isInCart,
          ...bookData,
        };
      });
    
      Promise.all(booksData).then((resolvedBooks) => {
        setBooks(resolvedBooks);
    
        // Sepete eklendi haritasını güncelle
        const sepeteEklendiMap = {};
        resolvedBooks.forEach(book => {
          sepeteEklendiMap[book.id] = book.isInCart || false;
        });
        setSepeteEklendiMap(sepeteEklendiMap);
      });
    };
    
    fetchBooks();
    
    
  }, []);
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const favoritesSnapshot = await favoritesRef.where('uid', '==', uid).get();
        const favoritesData = favoritesSnapshot.docs.map(doc => doc.data().bookId);
        setFavorites(favoritesData);
      } catch (error) {
        console.error('Favorileri getirirken hata oluştu:', error.message);
      }
    };
    fetchFavorites();

    const fetchCartItems = async () => {
      try {
        const cartSnapshot = await cartRef.where('uid', '==', uid).get();
        const cartData = cartSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCartItems(cartData);
      } catch (error) {
        console.error('Sepet ürünlerini getirirken hata oluştu:', error.message);
      }
    };
    fetchCartItems();
  }, [uid]); // uid değiştiğinde favorileri güncelle

  const addToFavorites = async (bookId) => {
    try {
      const userFavoritesRef = favoritesRef.doc(`${uid}_${bookId}`);
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
      const updatedFavoritesSnapshot = await favoritesRef.where('uid', '==', uid).get();
      const updatedFavoritesData = updatedFavoritesSnapshot.docs.map(doc => doc.data().bookId);
      setFavorites(updatedFavoritesData);
    } catch (error) {
      console.error('Favorilere eklerken hata oluştu:', error.message);
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

      // Koleksiyonda varsa, güncelle.
      const cartItemDoc = await cartRef.where('uid', '==', uid).where('bookId', '==', id).get();

      if (!cartItemDoc.empty) {
        const existingCartItem = cartItemDoc.docs[0];
        const existingCartItemData = existingCartItem.data();
        const newQuantity = existingCartItemData.quantity + quantity;

        // Stok miktarını kontrol et
        if (stock < newQuantity) {
          console.warn('Yetersiz stok! Sepete eklemek istediğiniz miktar stoktan fazla.');
          return;
        }

        await cartRef.doc(existingCartItem.id).update({
          quantity: newQuantity,
        });
      } else {
        // Koleksiyonda yoksa, ekle.
        // Stok miktarını kontrol et
        if (stock < quantity) {
          console.warn('Yetersiz stok! Sepete eklemek istediğiniz miktar stoktan fazla.');
          return;
        }

        await cartRef.add({
          uid,
          bookId: id,
          quantity,
        });
      }

      // Sepet ürünlerini güncelle
      const updatedCartSnapshot = await cartRef.where('uid', '==', uid).get();
      const updatedCartData = updatedCartSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCartItems(updatedCartData);

      setSepeteEklendiMap((prevMap) => ({
        ...prevMap,
        [id]: true,
      }));
      // Modal'ı kapat
      setSelectedBook(null);
      setQuantity(1);
    } catch (error) {
      console.error('Sepete eklerken hata oluştu:', error.message);
    }
  };

  const openModal = (book) => {
    setSelectedBook(book);
  };

  const closeModal = () => {
    setSelectedBook(null);
    setQuantity(1);
  };

  const renderItem = ({ item }) => (
    <View style={{ margin: 8, padding: 16, backgroundColor: '#E9E8E8', borderRadius: 10, position: 'relative' }}>
      <TouchableOpacity
        style={{
          position: 'absolute',
          right: 5,
          top: 8,
          backgroundColor: '#E8E8E8',
          borderRadius: 8,
          padding: 8,
          zIndex: 2,
        }}
        onPress={() => addToFavorites(item.id)}
      >
        <Icon
          name="heart"
          size={20}
          color={favorites.includes(item.id) ? 'red' : 'white'}
        />
      </TouchableOpacity>
      
      <Image style={{ width: 100, height: 150, marginBottom: 8 }} source={{ uri: item.image }} />
      <Text>{item.bookName}</Text>
      <Text>{item.author}</Text>
      <Text>Yayın Yılı: {item.date}</Text>
      <Text>Fiyat: {item.price}</Text>
      <TouchableOpacity
        style={{ backgroundColor: 'green', padding: 8, borderRadius: 5, marginTop: 8 }}
        onPress={() => openModal(item)}
      >
        <Text style={{ color: 'white' }}>
          {sepeteEklendiMap[item.id] ? 'Sepete Eklendi' : 'Sepete Ekle'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View>
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={item => item.id}
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
                  <TouchableOpacity
                    onPress={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{ padding: 8, backgroundColor: 'gray', borderRadius: 5, marginRight: 8 }}
                  >
                    <Text style={{ color: 'white' }}>-</Text>
                  </TouchableOpacity>
                  <Text>{quantity}</Text>
                  <TouchableOpacity
                    onPress={() => setQuantity(quantity + 1)}
                    style={{ padding: 8, backgroundColor: 'gray', borderRadius: 5, marginLeft: 8 }}
                  >
                    <Text style={{ color: 'white' }}>+</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={{ backgroundColor: 'green', padding: 8, borderRadius: 5, marginTop: 8 }}
                                  onPress={addToCart}>
                  <Text style={{ color: 'white' }}>
                    {sepeteEklendiMap[selectedBook.id] ? 'Sepete Eklendi' : 'Sepete Ekle'}
                  </Text>
                </TouchableOpacity>
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

export default HomeScreen;
