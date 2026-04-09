import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
  title: string;
  icon: string;
  onPress: () => void;
}

export default function ProfileOptionItem({ title, icon, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={styles.left}>
        <View style={styles.iconCircle}>
          <Icon name={icon} size={20} color="#fff" />
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>
      <Icon name="chevron-right" size={22} color="#aaa" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FF6347',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
});
