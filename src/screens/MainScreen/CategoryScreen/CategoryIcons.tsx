// components/CategoryIcons.tsx

import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { categories } from './CategoryData';

const CategoryIcons = () => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      {categories.map((category, index) => (
        <View key={index} style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Image source={category.icon} style={styles.icon} />
          </View>
          <Text style={styles.label}>{category.label}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 8,
  },
  iconContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  iconCircle: {
    backgroundColor: '#eee',
    borderRadius: 40,
    padding: 12,
    marginBottom: 6,
  },
  icon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  label: {
    fontSize: 12,
    color: '#444',
  },
});

export default CategoryIcons;
