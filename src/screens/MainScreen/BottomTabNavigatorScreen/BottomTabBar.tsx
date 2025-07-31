// components/BottomTabBar.tsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TAB_ICONS = {
  Home: 'home',
  Search: 'magnify',
  Favorites: 'heart-outline',
  Cart: 'cart-outline',
  Profile: 'account-outline',
};

type TabName = keyof typeof TAB_ICONS;

const tabs: TabName[] = ['Home', 'Search', 'Favorites', 'Cart', 'Profile'];

export default function BottomTabBar() {
  const navigation = useNavigation();
   const insets = useSafeAreaInsets();

  // you might want to track active tab state here (or get from navigation state)
  const [activeTab, setActiveTab] = React.useState<TabName>('Home');

  const onPressTab = (tab: TabName) => {
    setActiveTab(tab);
    navigation.navigate(tab as never);
  };

  return (
    <View style={[styles.tabBar, { paddingBottom: insets.bottom || 16 }]}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={styles.tabItem}
          onPress={() => onPressTab(tab)}
          activeOpacity={0.7}
        >
          <Icon
            name={TAB_ICONS[tab]}
            size={28}
            color={activeTab === tab ? '#FF0000' : '#999'}
          />
          <Text style={[styles.label, activeTab === tab && styles.activeLabel]}>
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
tabBar: {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: 70,
  backgroundColor: 'white',
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  elevation: 20,
  borderTopWidth: 2,
  borderTopColor: '#eee',
  paddingBottom: 8,
  paddingTop: -16,
},


  tabItem: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: '#999',
  },
  activeLabel: {
    color: '#FF0000',
    fontWeight: 'bold',
  },
});
