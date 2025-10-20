import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Platform,
} from 'react-native';

// Reliable storage adapter for web/native
const storageKey = '@saved_cards';
const isWeb = Platform.OS === 'web';

async function storageGetItem(key) {
  if (isWeb && typeof window !== 'undefined' && window.localStorage) {
    return Promise.resolve(window.localStorage.getItem(key));
  }
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    return AsyncStorage.getItem(key);
  } catch {
    return Promise.resolve(null);
  }
}
async function storageSetItem(key, value) {
  if (isWeb && typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(key, value);
    return Promise.resolve();
  }
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    return AsyncStorage.setItem(key, value);
  } catch {
    return Promise.resolve();
  }
}

export default function PaymentOptions({ navigation }) {
  const [selected, setSelected] = useState('cash');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [savedCards, setSavedCards] = useState([]);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    loadSavedCards();
  }, []);

  const loadSavedCards = async () => {
    const json = await storageGetItem(storageKey);
    const cards = json ? JSON.parse(json) : [];
    setSavedCards(cards);
  };

  const handleSaveCard = async () => {
    if (!cardNumber || !expiry || !cvv) {
      Alert.alert('Error', 'Please fill all card details');
      return;
    }
    const sanitized = cardNumber.replace(/\s+/g, '');
    const newCard = {
      id: Date.now().toString(),
      cardNumber: sanitized,
      expiry,
      cvv,
      createdAt: new Date().toISOString(),
    };

    const existing = await storageGetItem(storageKey);
    const arr = existing ? JSON.parse(existing) : [];
    arr.push(newCard);
    await storageSetItem(storageKey, JSON.stringify(arr));
    setSavedCards(arr);
    Alert.alert('Success', 'Card details saved!');
    setCardNumber('');
    setExpiry('');
    setCvv('');
    setSelected('card');
    setShowSaved(true);
  };

  // FIXED: Delete handler updates storage and state, then reloads list
  const handleDeleteCard = async (id) => {
    const filtered = savedCards.filter((c) => c.id !== id);
    await storageSetItem(storageKey, JSON.stringify(filtered));
    setSavedCards(filtered);
    if (filtered.length === 0) setShowSaved(false);
  };

  const maskCard = (num) => {
    if (!num) return '';
    const last4 = num.slice(-4);
    return '**** **** **** ' + last4;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Select Payment Option</Text>

      <TouchableOpacity
        style={[styles.option, selected === 'cash' && styles.selected]}
        onPress={() => {
          setSelected('cash');
          setShowSaved(false);
        }}
      >
        <Text style={styles.optionText}>Cash</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.option, selected === 'card' && styles.selected]}
        onPress={() => setSelected('card')}
      >
        <Text style={styles.optionText}>Card</Text>
      </TouchableOpacity>

      {selected === 'card' && (
        <View style={styles.cardForm}>
          <TextInput
            style={styles.input}
            placeholder="Card Number"
            keyboardType="numeric"
            value={cardNumber}
            onChangeText={(t) => setCardNumber(formatCardInput(t))}
            maxLength={19}
          />
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Expiry (MM/YY)"
              value={expiry}
              onChangeText={(t) => setExpiry(formatExpiryInput(t))}
              maxLength={5}
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="CVV"
              keyboardType="numeric"
              value={cvv}
              onChangeText={setCvv}
              maxLength={4}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveCard}>
            <Text style={styles.saveButtonText}>Save Card</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.viewButton}
            onPress={async () => {
              await loadSavedCards();
              setShowSaved((s) => !s);
            }}
          >
            <Text style={styles.viewButtonText}>
              {showSaved ? 'Hide Saved Cards' : `View Saved Cards (${savedCards.length})`}
            </Text>
          </TouchableOpacity>

          {showSaved && (
            <View style={styles.savedList}>
              {savedCards.length === 0 ? (
                <Text style={styles.emptyText}>No saved cards</Text>
              ) : (
                <FlatList
                  data={savedCards}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <View style={styles.cardRow}>
                      <View>
                        <Text style={styles.cardMask}>{maskCard(item.cardNumber)}</Text>
                        <Text style={styles.cardMeta}>Expiry: {item.expiry}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.deleteBtn}
                        onPress={() => handleDeleteCard(item.id)}
                      >
                        <Text style={styles.deleteText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  extraData={savedCards}
                />
              )}
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}

// Helpers to format input (simple)
function formatCardInput(text) {
  const digits = text.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
}
function formatExpiryInput(text) {
  const digits = text.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) {
    return digits.slice(0, 2) + '/' + digits.slice(2);
  }
  return digits;
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  option: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f5f0e6',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selected: {
    borderColor: '#1e90ff',
    backgroundColor: '#e6f0ff',
  },
  optionText: { fontSize: 18, color: '#000' },
  cardForm: { marginTop: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  halfInput: { flex: 1, marginRight: 8 },
  saveButton: {
    backgroundColor: '#1e90ff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  viewButton: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d0d7dd',
    alignItems: 'center',
    backgroundColor: '#fafbff',
  },
  viewButtonText: { color: '#1e90ff', fontWeight: '600' },
  savedList: { marginTop: 16 },
  emptyText: { color: '#666', textAlign: 'center', padding: 8 },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardMask: { fontSize: 16, fontWeight: '600' },
  cardMeta: { fontSize: 12, color: '#666' },
  deleteBtn: { padding: 8 },
  deleteText: { color: '#d63031', fontWeight: '600' },
});
