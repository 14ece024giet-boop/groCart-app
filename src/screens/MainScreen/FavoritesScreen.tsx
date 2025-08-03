import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { FavoriteItem, FavoritesItems } from './FavoritesData'; // Dummy favorites data

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(FavoritesItems);

  const handleMoveToCart = (id: string) => {
    // TODO: Add item to cart
    setFavorites(prev => prev.filter(item => item.id !== id));
  };

  const renderItem = ({ item }: { item: FavoriteItem }) => (
    <View style={styles.card}>
      <View style={styles.imageBox}>
        <Image
          source={
            item.image
              ? { uri: item.image }
              : require('../../../assets/grocery-banner.png') // Placeholder image
          }
          style={styles.image}
        />
      </View>

      <View style={styles.info}>
        <Text style={styles.weight}>{item.weight}</Text>
        <Text style={styles.title}>{item.title}</Text>

        <View style={styles.priceRow}>
          <Text style={styles.originalPrice}>${item.price}</Text>
          <Text style={styles.salePrice}>${item.salePrice}</Text>
        </View>

        <TouchableOpacity
          style={styles.moveBtn}
          onPress={() => handleMoveToCart(item.id)}
        >
          <Text style={styles.moveText}>Move to cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.heading}>Favourites</Text>
        <Text style={styles.countText}>Total {favorites.length}</Text>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image
            source={require('../../../assets/grocery-banner.png')}
            style={styles.emptyImage}
          />
          <Text style={styles.emptyText}>No item in your favourites</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    paddingTop: 48,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  countText: {
    fontSize: 14,
    color: '#555',
  },
  card: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#fafafa',
    padding: 12,
    borderRadius: 8,
    elevation: 1,
  },
  imageBox: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#eaeaea',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  weight: {
    fontSize: 12,
    color: '#FF0000',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    color: '#999',
    marginRight: 8,
  },
  salePrice: {
    color: '#FF0000',
    fontWeight: 'bold',
  },
  moveBtn: {
    backgroundColor: '#FF0000',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  moveText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#888',
  },
});
