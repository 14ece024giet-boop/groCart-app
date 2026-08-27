import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

interface Props {
  title: string;
  icon: string;
  onPress: () => void;
}

const ICON_MAP: Record<string, string> = {
  'account-edit': '👤',
  'map-marker-radius': '📍',
  'clipboard-list': '📦',
  'credit-card-outline': '💳',
  'lock-reset': '🔑',
  'cog-outline': '⚙️',
};

export default function ProfileOptionItem({ title, icon, onPress }: Props) {
  const displayIcon = ICON_MAP[icon] || icon || '📌';

  return (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.left}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconEmoji}>{displayIcon}</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.arrowText}>→</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  iconEmoji: {
    fontSize: 16,
  },
  title: {
    marginLeft: 12,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '800',
  },
  arrowText: {
    fontSize: 16,
    color: '#94A3B8',
    fontWeight: '900',
  },
});
