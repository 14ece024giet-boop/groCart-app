import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import ProfileHeader from './ProfileHeader';
import ProfileOptionItem from './ProfileOptionItem';
import LogoutButton from './LogoutButton';


export default function ProfileScreen({ navigation }) {
  const handleNavigate = (screen: string) => {
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ProfileHeader
          name="Akshay Syal"
          email="syalfreelance@gmail.com"
          phone="+91 999990XXXX"
        />

        <ProfileOptionItem title="Profile Edit" icon="account-edit" onPress={() => handleNavigate('EditProfile')} />
        <ProfileOptionItem title="My Orders" icon="clipboard-list" onPress={() => handleNavigate('Orders')} />
        <ProfileOptionItem title="Coupons" icon="ticket-percent" onPress={() => handleNavigate('Coupons')} />
        <ProfileOptionItem title="Manage Addresses" icon="map-marker-radius" onPress={() => handleNavigate('Addresses')} />
        <ProfileOptionItem title="Manage Card" icon="credit-card-outline" onPress={() => handleNavigate('Cards')} />
        <ProfileOptionItem title="Change Password" icon="lock-reset" onPress={() => handleNavigate('ChangePassword')} />
        <ProfileOptionItem title="Setting" icon="cog-outline" onPress={() => handleNavigate('Settings')} />

        <LogoutButton onLogout={() => navigation.replace('Login')} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
});
