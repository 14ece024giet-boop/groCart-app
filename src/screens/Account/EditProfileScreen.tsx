import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/navigation';
import { getUserProfileApi, updateUserProfileApi } from '../../Utility/userProfileApi';

type EditProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'EditProfile'
>;

type Props = {
  navigation: EditProfileScreenNavigationProp;
};

export default function EditProfileScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const isValid = (text: string) => text.trim().length > 3;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getUserProfileApi();
        if (response.success && response.data) {
          setName(response.data.name || '');
          setEmail(response.data.email || '');
          setPhone(response.data.phoneNumber || '');
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
    if (!isValid(name)) {
      Alert.alert('Required', 'Please enter a valid full name.');
      return;
    }

    setSaving(true);
    try {
      const response = await updateUserProfileApi({ name, email, phoneNumber: phone });
      if (response.success) {
        Alert.alert('Profile Updated', 'Your profile details have been saved successfully.', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
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
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#059669" />
          <Text style={styles.loadingText}>Loading profile details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'US';

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        {/* Top Header Bar */}
        <View style={styles.topHeaderBar}>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Text style={styles.headerBackIcon}>←</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Edit Profile Details</Text>

          <View style={{ width: 36 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Avatar Ring Header */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatarRing}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <Text style={styles.avatarSubText}>Township Resident Account</Text>
          </View>

          {/* Input Fields */}
          <View style={styles.form}>
            {/* Name */}
            <Text style={styles.label}>Full Name *</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter full name"
                placeholderTextColor="#94A3B8"
              />
              {isValid(name) && <Text style={styles.checkIcon}>✓</Text>}
            </View>

            {/* Email */}
            <Text style={styles.label}>Corporate Email Address</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter email address"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {isValid(email) && <Text style={styles.checkIcon}>✓</Text>}
            </View>

            {/* Phone */}
            <Text style={styles.label}>Mobile Phone Number</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter phone number"
                placeholderTextColor="#94A3B8"
                keyboardType="phone-pad"
              />
              {isValid(phone) && <Text style={styles.checkIcon}>✓</Text>}
            </View>
          </View>

          {/* Save CTA */}
          <TouchableOpacity
            style={[styles.saveBtn, saving && { opacity: 0.7 }]}
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.9}
          >
            {saving ? (
              <ActivityIndicator color="#FACC15" />
            ) : (
              <Text style={styles.saveBtnText}>SAVE PROFILE DETAILS</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  topHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 45,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  headerBackIcon: {
    fontSize: 18,
    color: '#0F172A',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FACC15',
    marginBottom: 8,
  },
  avatarText: {
    color: '#FACC15',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 1,
  },
  avatarSubText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  form: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 6,
    color: '#0F172A',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 12,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
  },
  checkIcon: {
    fontSize: 16,
    color: '#059669',
    fontWeight: '900',
  },
  saveBtn: {
    backgroundColor: '#0F172A',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  saveBtnText: {
    color: '#FACC15',
    fontWeight: '900',
    fontSize: 15,
    letterSpacing: 0.5,
  },
});
