// src/screens/PaymentMethodScreen.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function PaymentMethodScreen({ route, navigation }) {
  const { cartItems, total } = route.params || {};

  const handleCashSelection = () => {
    navigation.navigate('TimeScheduler', { 
      cartItems,
      total,
      paymentMethod: 'cash'
    });
  };

  const handleCardSelection = () => {
    navigation.navigate('Payment', { 
      cartItems,
      total,
      paymentMethod: 'card'
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Payment Method</Text>
        <Text style={styles.subtitle}>
          Choose how you'd like to pay for your order
        </Text>
      </View>

      <View style={styles.orderSummary}>
        <Text style={styles.summaryTitle}>Order Summary</Text>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Amount:</Text>
          <Text style={styles.totalAmount}>R{total?.toFixed(2) || '0.00'}</Text>
        </View>
        <Text style={styles.itemCount}>
          {cartItems?.length || 0} item{cartItems?.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <View style={styles.paymentOptions}>
        <TouchableOpacity 
          style={[styles.paymentCard, styles.cashCard]} 
          onPress={handleCashSelection}
        >
          <View style={styles.iconContainer}>
            <MaterialIcons name="money" size={32} color="#28a745" />
          </View>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentTitle}>Cash Payment</Text>
            <Text style={styles.paymentDescription}>
              Pay with cash when you pick up your order
            </Text>
          </View>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.paymentCard, styles.cardCard]} 
          onPress={handleCardSelection}
        >
          <View style={styles.iconContainer}>
            <MaterialIcons name="credit-card" size={32} color="#007bff" />
          </View>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentTitle}>Card Payment</Text>
            <Text style={styles.paymentDescription}>
              Pay securely with your credit or debit card
            </Text>
          </View>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          🔒 Your payment information is secure and encrypted
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f0e6',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  orderSummary: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#d4a056',
  },
  itemCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  paymentOptions: {
    gap: 20,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  paymentDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  cashCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  cardCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#007bff',
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
});