import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';

export default function LogoutButton({ onLogout }: { onLogout: () => void }) {
  const handleConfirmLogout = () => {
    Alert.alert(
      'Logout Confirmation',
      'Are you sure you want to log out of your GroCart account?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', style: 'destructive', onPress: onLogout },
      ]
    );
  };

  return (
    <TouchableOpacity
      style={styles.logoutBtn}
      onPress={handleConfirmLogout}
      activeOpacity={0.85}
    >
      <Text style={styles.logoutIcon}>🚪</Text>
      <Text style={styles.logoutText}>LOG OUT OF ACCOUNT</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  logoutBtn: {
    width: '100%',
    borderRadius: 14,
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  logoutIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  logoutText: {
    color: '#DC2626',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 0.5,
  },
});
