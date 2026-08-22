import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/navigation';
import MultiTaskButton from '../../components/Components/shared/MultiTaskButton';
import { getUserProfileApi, updateUserProfileApi } from '../../Utility/userProfileApi';

type EditProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'EditProfile'
>;

type Props = {
  navigation: EditProfileScreenNavigationProp;
};

export default function EditProfileScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const isValid = (text: string) => text.length > 3;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getUserProfileApi();
        if (response.success && response.data) {
          setName(response.data.name);
          setEmail(response.data.email);
          setPhone(response.data.phoneNumber);
        } else {
          Alert.alert('Error', response.message || 'Could not load profile.');
        }
      } catch (error) {
        Alert.alert('Error', 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const response = await updateUserProfileApi({ name, email, phoneNumber: phone });
      if (response.success) {
        Alert.alert('Profile Updated', 'Your profile has been successfully saved.');
        navigation.goBack();
      } else {
        Alert.alert('Update Failed', response.message || 'Could not save profile.');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred while saving.');
    } finally {
      setSaving(false);
    }
  }, [name, email, phone, navigation]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF6347" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        {/* Close Button */}
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => navigation.goBack()}
        >
          <Icon name="close" size={24} color="#333" />
        </TouchableOpacity>

        {/* Profile Picture */}
        <View style={styles.avatarContainer}>
          <Image
            source={require('../../../assets/grocery-banner.png')}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.cameraIcon}>
            <Icon name="camera" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Input Fields */}
        <View style={styles.form}>
          {/* Name */}
          <Text style={styles.label}>Name</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
            />
            {isValid(name) && <Icon name="check-circle" size={20} color="#FF6347" />}
          </View>

          {/* Email */}
          <Text style={styles.label}>Email ID</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {isValid(email) && <Icon name="check-circle" size={20} color="#FF6347" />}
          </View>

          {/* Phone */}
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
            {isValid(phone) && <Icon name="check-circle" size={20} color="#FF6347" />}
          </View>
        </View>

        {/* Save Button */}
        <MultiTaskButton
          title="SAVE"
          onPress={handleSave}
          style={styles.saveBtn}
          loading={saving}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  closeBtn: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  avatarContainer: {
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: 20,
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF6347',
    borderRadius: 12,
    padding: 5,
  },
  form: {
    marginTop: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 12,
    height: 45,
    borderRadius: 10,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#000',
  },
  saveBtn: {
        width: '100%',
        borderRadius: 8,
        backgroundColor: '#FF5A4D',
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        shadowColor: '#FF5A4D',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
  },
});
