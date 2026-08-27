import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface ProfileHeaderProps {
  name: string;
  email: string;
  phone: string;
}

export default function ProfileHeader({ name, email, phone }: ProfileHeaderProps) {
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'US';

  return (
    <View style={styles.headerCard}>
      <View style={styles.topRow}>
        {/* Avatar Ring */}
        <View style={styles.avatarRing}>
          <View style={styles.avatarBox}>
            <Text style={styles.avatarInitials}>{initials}</Text>
          </View>
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedBadgeIcon}>✓</Text>
          </View>
        </View>

        {/* User Info */}
        <View style={styles.infoWrapper}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {name || 'Corporate Resident'}
            </Text>
            <View style={styles.vipBadge}>
              <Text style={styles.vipBadgeText}>VIP</Text>
            </View>
          </View>

          <Text style={styles.email} numberOfLines={1}>
            {email || 'resident@township.com'}
          </Text>

          <View style={styles.phonePill}>
            <Text style={styles.phoneText}>📞 {phone || '+91 98765 43210'}</Text>
          </View>
        </View>
      </View>

      {/* Township Tag Banner */}
      <View style={styles.townshipBanner}>
        <Text style={styles.townshipIcon}>🏢</Text>
        <Text style={styles.townshipText}>
          JSW Vijayanagar Township Resident • Priority Delivery Active
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerCard: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#334155',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarRing: {
    position: 'relative',
    marginRight: 14,
  },
  avatarBox: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FACC15',
  },
  avatarInitials: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FACC15',
    letterSpacing: 1,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#0F172A',
  },
  verifiedBadgeIcon: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
  infoWrapper: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    marginRight: 8,
    flexShrink: 1,
  },
  vipBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  vipBadgeText: {
    color: '#B45309',
    fontSize: 9,
    fontWeight: '900',
  },
  email: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '500',
  },
  phonePill: {
    alignSelf: 'flex-start',
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  phoneText: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '700',
  },
  townshipBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  townshipIcon: {
    fontSize: 13,
    marginRight: 6,
  },
  townshipText: {
    color: '#FACC15',
    fontSize: 10,
    fontWeight: '800',
    flex: 1,
  },
});
