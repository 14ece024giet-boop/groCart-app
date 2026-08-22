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
      // 1. Fetch system-defined allowed delivery points
      const pointsRes = await getAllDeliveryPointsApi();
      const points = pointsRes?.data || [];
      setDeliveryPoints(points);

      // 2. Fetch current user saved address
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
      Alert.alert('Required', 'Please select an allowed delivery point.');
      return;
    }

    if (!roomNumber.trim()) {
      Alert.alert('Required', 'Please enter your room / flat / cabin number.');
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
        Alert.alert('Success', 'Delivery address saved successfully!', [
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

  // Filter delivery points by search query
  const filteredPoints = deliveryPoints.filter((point) => {
    const q = searchQuery.toLowerCase();
    return (
      point.name.toLowerCase().includes(q) ||
      (point.address && point.address.toLowerCase().includes(q))
    );
  });

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF5A4D" />
        <Text style={styles.loadingText}>Loading delivery points...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backArrow}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Address</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Section 1: Searchable Dropdown for Allowed Delivery Points */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>1. Allowed Delivery Point</Text>
          <Text style={styles.sectionSubtitle}>
            Select an authorized campus pickup location from the dropdown.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.dropdownTrigger}
          onPress={() => {
            setSearchQuery('');
            setIsDropdownOpen(true);
          }}
          activeOpacity={0.8}
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

        {/* Section 2: User Custom Room / Room Address */}
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <Text style={styles.sectionTitle}>2. Room / Flat / Cabin Number *</Text>
          <Text style={styles.sectionSubtitle}>
            Specify your room or flat number for delivery arrival notification.
          </Text>
        </View>

        <TextInput
          style={styles.textInput}
          placeholder="e.g. Room 402, Block A / Cabin 12"
          value={roomNumber}
          onChangeText={setRoomNumber}
          placeholderTextColor="#999"
        />

        {/* Section 3: Optional Additional Info */}
        <View style={[styles.sectionHeader, { marginTop: 18 }]}>
          <Text style={styles.sectionTitle}>3. Additional Notes (Optional)</Text>
        </View>

        <TextInput
          style={[styles.textInput, styles.textArea]}
          placeholder="e.g. Call when arriving at lobby desk"
          value={additionalInfo}
          onChangeText={setAdditionalInfo}
          placeholderTextColor="#999"
          multiline
          numberOfLines={3}
        />

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, saving && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.85}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>SAVE ADDRESS</Text>
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
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Delivery Point</Text>
              <TouchableOpacity
                onPress={() => setIsDropdownOpen(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            <View style={styles.searchContainer}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search delivery point or address..."
                placeholderTextColor="#999"
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

            {/* Filtered Points List */}
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
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 54,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#ECECEC',
  },
  backButton: {
    marginRight: 14,
  },
  backArrow: {
    fontSize: 26,
    color: '#222',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 60,
  },
  sectionHeader: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#777',
    marginTop: 4,
    lineHeight: 18,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  dropdownSelectedName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },
  dropdownSelectedAddress: {
    fontSize: 13,
    color: '#666',
    marginTop: 3,
  },
  dropdownPlaceholder: {
    fontSize: 15,
    color: '#999',
  },
  dropdownArrow: {
    fontSize: 14,
    color: '#888',
    marginLeft: 10,
  },
  textInput: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#222',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#FF5A4D',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    shadowColor: '#FF5A4D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
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
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  modalCloseButton: {
    padding: 6,
  },
  modalCloseText: {
    fontSize: 18,
    color: '#888',
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#222',
    padding: 0,
  },
  clearSearchText: {
    fontSize: 14,
    color: '#888',
    paddingHorizontal: 6,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    borderRadius: 8,
  },
  modalItemSelected: {
    backgroundColor: '#FFF5F4',
  },
  modalItemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  modalItemNameSelected: {
    color: '#FF5A4D',
    fontWeight: '700',
  },
  modalItemAddress: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },
  checkmark: {
    fontSize: 16,
    color: '#FF5A4D',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  emptyList: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
  },
});
