import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  getUserAddressApi,
  getAllDeliveryPointsApi,
  saveUserAddressApi,
  DeliveryPointDto,
  UserAddressDto,
} from '../../Utility/userAddressApi';

export default function ManageAddressScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [deliveryPoints, setDeliveryPoints] = useState<DeliveryPointDto[]>([]);
  const [selectedPointId, setSelectedPointId] = useState<number | null>(null);
  const [roomNumber, setRoomNumber] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [currentAddress, setCurrentAddress] = useState<UserAddressDto | null>(null);

  // Dropdown modal & search state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const pointsRes = await getAllDeliveryPointsApi();
      const points = pointsRes?.data || [];
      setDeliveryPoints(points);

      const addrRes = await getUserAddressApi();
      if (addrRes?.success && addrRes?.data) {
        const addr = addrRes.data;
        setCurrentAddress(addr);
        setSelectedPointId(addr.deliveryPointId);
        setRoomNumber(addr.roomNumber || '');
      } else if (points.length > 0) {
        setSelectedPointId(points[0].id);
      }
    } catch (err: any) {
      console.error('Error loading address data:', err);
      Alert.alert('Error', 'Failed to load delivery points. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedPointId) {
      Alert.alert('Required', 'Please select an authorized delivery point.');
      return;
    }

    if (!roomNumber.trim()) {
      Alert.alert('Required', 'Please enter your Quarter / Room number.');
      return;
    }

    setSaving(true);
    try {
      const response = await saveUserAddressApi({
        deliveryPointId: selectedPointId,
        roomNumber: roomNumber.trim(),
        additionalInfo: additionalInfo.trim(),
      });

      if (response.success) {
        Alert.alert('Address Saved', 'Township delivery location saved successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('Failed', response.message || 'Failed to save address.');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'An unexpected error occurred.');
    } finally {
      setSaving(false);
    }
  };

  const selectedPoint = deliveryPoints.find((p) => p.id === selectedPointId);

  const filteredPoints = deliveryPoints.filter((point) => {
    const q = searchQuery.toLowerCase();
    return (
      point.name.toLowerCase().includes(q) ||
      (point.address && point.address.toLowerCase().includes(q))
    );
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#059669" />
          <Text style={styles.loadingText}>Loading township delivery locations...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header Bar */}
        <View style={styles.topHeaderBar}>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Text style={styles.headerBackIcon}>←</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Manage Delivery Location</Text>

          <View style={{ width: 36 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Section 1: Allowed Delivery Point */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>1. Authorized Township Delivery Point *</Text>
            <Text style={styles.sectionSubtitle}>
              Select your township sector or central campus delivery point.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.dropdownTrigger}
            onPress={() => {
              setSearchQuery('');
              setIsDropdownOpen(true);
            }}
            activeOpacity={0.85}
          >
            <View style={{ flex: 1 }}>
              {selectedPoint ? (
                <>
                  <Text style={styles.dropdownSelectedName}>{selectedPoint.name}</Text>
                  {selectedPoint.address ? (
                    <Text style={styles.dropdownSelectedAddress}>{selectedPoint.address}</Text>
                  ) : null}
                </>
              ) : (
                <Text style={styles.dropdownPlaceholder}>Select Delivery Point...</Text>
              )}
            </View>
            <Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>

          {/* Section 2: Quarter / Room Number */}
          <View style={[styles.sectionHeader, { marginTop: 24 }]}>
            <Text style={styles.sectionTitle}>2. Quarter / Room / Flat Number *</Text>
            <Text style={styles.sectionSubtitle}>
              Specify your exact Quarter / Flat number (e.g. Qtr B-202).
            </Text>
          </View>

          <TextInput
            style={styles.textInput}
            placeholder="e.g. Qtr B-202 / Flat 405"
            value={roomNumber}
            onChangeText={setRoomNumber}
            placeholderTextColor="#94A3B8"
          />

          {/* Section 3: Delivery Notes */}
          <View style={[styles.sectionHeader, { marginTop: 20 }]}>
            <Text style={styles.sectionTitle}>3. Delivery Instructions (Optional)</Text>
          </View>

          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="e.g. Leave at Quarter security gate desk"
            value={additionalInfo}
            onChangeText={setAdditionalInfo}
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={3}
          />

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveButton, saving && { opacity: 0.7 }]}
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.9}
          >
            {saving ? (
              <ActivityIndicator color="#FACC15" />
            ) : (
              <Text style={styles.saveButtonText}>SAVE DELIVERY LOCATION</Text>
            )}
          </TouchableOpacity>
        </ScrollView>

        {/* Searchable Dropdown Modal */}
        <Modal
          visible={isDropdownOpen}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsDropdownOpen(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Delivery Location</Text>
                <TouchableOpacity
                  onPress={() => setIsDropdownOpen(false)}
                  style={styles.modalCloseButton}
                >
                  <Text style={styles.modalCloseText}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.searchContainer}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search sector or location..."
                  placeholderTextColor="#94A3B8"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus={true}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Text style={styles.clearSearchText}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>

              <FlatList
                data={filteredPoints}
                keyExtractor={(item) => item.id.toString()}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => {
                  const isSelected = selectedPointId === item.id;
                  return (
                    <TouchableOpacity
                      style={[
                        styles.modalItem,
                        isSelected && styles.modalItemSelected,
                      ]}
                      onPress={() => {
                        setSelectedPointId(item.id);
                        setIsDropdownOpen(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={{ flex: 1 }}>
                        <Text
                          style={[
                            styles.modalItemName,
                            isSelected && styles.modalItemNameSelected,
                          ]}
                        >
                          {item.name}
                        </Text>
                        {item.address ? (
                          <Text style={styles.modalItemAddress}>{item.address}</Text>
                        ) : null}
                      </View>
                      {isSelected && <Text style={styles.checkmark}>✓</Text>}
                    </TouchableOpacity>
                  );
                }}
                ListEmptyComponent={
                  <View style={styles.emptyList}>
                    <Text style={styles.emptyText}>No matching delivery points found.</Text>
                  </View>
                }
              />
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  centerContainer: {
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
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionHeader: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 16,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  dropdownSelectedName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  dropdownSelectedAddress: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  dropdownPlaceholder: {
    fontSize: 14,
    color: '#94A3B8',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 10,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
  },
  textArea: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#0F172A',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: {
    color: '#FACC15',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    minHeight: '50%',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalCloseText: {
    fontSize: 18,
    color: '#64748B',
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
    padding: 0,
  },
  clearSearchText: {
    fontSize: 14,
    color: '#64748B',
    paddingHorizontal: 4,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    borderRadius: 8,
  },
  modalItemSelected: {
    backgroundColor: '#ECFDF5',
  },
  modalItemName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  modalItemNameSelected: {
    color: '#059669',
    fontWeight: '900',
  },
  modalItemAddress: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  checkmark: {
    fontSize: 16,
    color: '#059669',
    fontWeight: '900',
    marginLeft: 8,
  },
  emptyList: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  emptyText: {
    color: '#64748B',
    fontSize: 13,
  },
});
