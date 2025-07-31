// components/PromoBanner.tsx

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

type PromoBannerProps = {
  title: string;
  discount: string;
  buttonText: string;
  image: any;
  onPress: () => void;
  isActive: boolean;
  index: number;
  total: number;
};


const PromoBanner = ({ title, discount, buttonText, image, onPress , total,index }: PromoBannerProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.textContainer}>
        <Text style={styles.discount}>{discount}</Text>
        <Text style={styles.headline}>{title}</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      </View>
      <Image source={image} style={styles.image} resizeMode="contain" />
      <View style={styles.cornerRibbon} />
      <View style={styles.paginationContainer}>
      {[...Array(total)].map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i === index ? styles.activeDot : null,
          ]}
    />
  ))}
</View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    flexDirection: 'row',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    position: 'relative',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  discount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF5A4D',
  },
  headline: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    marginVertical: 4,
  },
  button: {
    backgroundColor: '#FF5A4D',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  image: {
    width: 100,
    height: 100,
  },
  cornerRibbon: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 50,
    height: 50,
    backgroundColor: '#f9c5c5',
    borderBottomLeftRadius: 50,
  },
  paginationContainer: {
  flexDirection: 'row',
  justifyContent: 'center',
  position: 'absolute',
  bottom: 8,
  left: 0,
  right: 0,
},
dot: {
  width: 6,
  height: 6,
  borderRadius: 3,
  backgroundColor: '#ddd',
  marginHorizontal: 3,
},
activeDot: {
  backgroundColor: '#FF5A4D',
  width: 8,
  height: 8,
},
  
});

export default PromoBanner;
