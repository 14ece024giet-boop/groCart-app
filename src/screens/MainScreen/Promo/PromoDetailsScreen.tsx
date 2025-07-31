// screens/PromoDetailsScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

const PromoDetailsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🔥 Hot Grocery Deals</Text>
      
      <Image
        source={require('../../../../assets/grocery-banner.png')} 
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.description}>
        Get up to 70% OFF on fresh groceries this week only! Don't miss out on:
      </Text>

      <View style={styles.list}>
        <Text style={styles.item}>• Fresh fruits and vegetables</Text>
        <Text style={styles.item}>• Organic staples</Text>
        <Text style={styles.item}>• Daily kitchen essentials</Text>
        <Text style={styles.item}>• Bulk offers</Text>
      </View>

      <Text style={styles.note}>Offers valid until Sunday midnight!</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#444',
    marginBottom: 12,
  },
  list: {
    marginBottom: 16,
  },
  item: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  note: {
    fontSize: 12,
    color: '#999',
    marginTop: 20,
  },
});

export default PromoDetailsScreen;
