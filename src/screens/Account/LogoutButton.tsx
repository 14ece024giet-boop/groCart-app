import React from 'react';
import MultiTaskButton from '../../components/Components/shared/MultiTaskButton';

export default function LogoutButton({ onLogout }: { onLogout: () => void }) {
  return (
    <MultiTaskButton
      title="Logout"
      onPress={onLogout}
      style={{
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
      }}
    />
  );
}
