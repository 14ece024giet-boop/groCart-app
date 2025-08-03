import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function ProfileHeader({ name, email, phone }) {
  return (
    <View style={styles.container}>
      {/* Background wave shape */}
      <View style={styles.wave} />

      {/* Profile content */}
      <View style={styles.profileContent}>
        <Image
          source={require('../../../../assets/grocery-banner.png')}
          style={styles.avatar}
        />
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{email}</Text>
        <View style={styles.phoneWrapper}>
          <Text style={styles.phoneText}>📞 {phone}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  wave: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height: 180,
    backgroundColor: '#FFECEC',
    borderBottomRightRadius: 100,
    borderBottomLeftRadius: 100,
  },
  profileContent: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ccc',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 12,
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  phoneWrapper: {
    marginTop: 8,
    backgroundColor: '#FFD6D6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  phoneText: {
    color: '#FF6347',
    fontSize: 13,
  },
});
