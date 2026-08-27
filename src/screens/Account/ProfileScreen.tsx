import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, Text, Alert } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/navigation';
import ProfileHeader from './ProfileHeader';
import ProfileOptionItem from './ProfileOptionItem';
import LogoutButton from './LogoutButton';
import BottomTabBar from '../MainScreen/BottomTabNavigatorScreen/BottomTabBar';
import { getUserProfileApi, UserProfileDto } from '../../Utility/userProfileApi';
import { clearAuthTokens } from '../../Utility/tokenStorage';

import { useDispatch } from 'react-redux';
import { resetCartOnLogout } from '../../store/slices/cartSlice';
import { resetFavoritesOnLogout } from '../../store/slices/favoritesSlice';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

export default function ProfileScreen({ navigation }: Props) {
  const dispatch = useDispatch();
  const [profile, setProfile] = useState<UserProfileDto | null>(null);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchProfile = async () => {
      if (isFocused) {
        setLoading(true);
        try {
          const response = await getUserProfileApi();
          if (response.success && response.data) {
            setProfile(response.data);
          }
        } catch (error) {
          Alert.alert('Error', 'Could not load your profile. Please try again later.');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProfile();
  }, [isFocused]);

  const handleLogout = async () => {
    try {
      await clearAuthTokens();
      dispatch(resetCartOnLogout());
      dispatch(resetFavoritesOnLogout());
      navigation.replace('SignIn');
    } catch (error) {
      console.error("Failed to logout:", error);
      Alert.alert("Logout Failed", "An error occurred while logging out.");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color="#059669" style={{ marginVertical: 100 }} />
        ) : profile ? (
          <ProfileHeader name={profile.name} email={profile.email} phone={profile.phoneNumber} />
        ) : (
          <View style={{ alignItems: 'center', marginVertical: 100 }}>
            <Text style={{ color: '#64748B' }}>Could not load profile.</Text>
          </View>
        )}

        <ProfileOptionItem title="Profile Edit" icon="account-edit" onPress={() => navigation.navigate('EditProfile')} />
        <ProfileOptionItem title="Manage Addresses" icon="map-marker-radius" onPress={() => navigation.navigate('ManageAddress')} />
        <ProfileOptionItem title="My Orders" icon="clipboard-list" onPress={() => navigation.navigate('Orders')} />

        <LogoutButton onLogout={handleLogout} />
      </ScrollView>

      {/* Persistent Bottom Tab Bar */}
      <BottomTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 45,
    paddingBottom: 110,
  },
});
