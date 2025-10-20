import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Alert,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { doc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';

const OrderTrackingScreen = ({ route, navigation }) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);

  // Listen for real-time order updates
  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(doc(db, 'orders', orderId), (doc) => {
      if (doc.exists()) {
        const orderData = { id: doc.id, ...doc.data() };
        setOrder(orderData);
        
        // Start pickup timer if order is ready
        if (orderData.status === 'ready' && orderData.pickupExpiresAt) {
          startPickupTimer(orderData.pickupExpiresAt);
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [orderId]);

  const startPickupTimer = (expiryTime) => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const expiryTimestamp = expiryTime?.toDate?.()?.getTime() || expiryTime;
      const difference = expiryTimestamp - now;

      if (difference <= 0) {
        return { total: 0, minutes: 0, seconds: 0, expired: true };
      }

      return {
        total: difference,
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        expired: false
      };
    };

    // Set initial time
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      // Auto-expire order if time runs out
      if (newTimeLeft.expired) {
        clearInterval(timer);
        handleOrderExpired();
      }
    }, 1000);

    return () => clearInterval(timer);
  };

  const handleOrderExpired = async () => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: 'expired'
      });
      // You could send a notification here
    } catch (error) {
      console.error('Error expiring order:', error);
    }
  };

  const markAsCollected = async () => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: 'collected',
        collectedAt: serverTimestamp()
      });
      Alert.alert('Success', 'Thank you for collecting your order!');
    } catch (error) {
      console.error('Error marking as collected:', error);
      Alert.alert('Error', 'Failed to update order status.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'preparing': return '#f4a261';
      case 'ready': return '#28a745';
      case 'collected': return '#6c757d';
      case 'expired': return '#dc3545';
      default: return '#666';
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case 'preparing': return 'Your order is being prepared';
      case 'ready': return 'Your order is ready for pickup!';
      case 'collected': return 'Order collected - Thank you!';
      case 'expired': return 'Pickup time expired';
      default: return 'Order confirmed';
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#d4a056" />
        <Text style={styles.loadingText}>Loading order details...</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Order not found</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.orderNumber}>Order #{orderId.slice(-8).toUpperCase()}</Text>
        <Text style={styles.orderDate}>
          {order.createdAt?.toDate().toLocaleDateString()} at{' '}
          {order.createdAt?.toDate().toLocaleTimeString()}
        </Text>
      </View>

      {/* Order Status */}
      <View style={styles.statusSection}>
        <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(order.status) }]} />
        <View style={styles.statusTextContainer}>
          <Text style={styles.statusTitle}>{getStatusMessage(order.status)}</Text>
          <Text style={styles.statusSubtitle}>
            {order.status === 'preparing' && 'Estimated time: 20-30 minutes'}
            {order.status === 'ready' && 'Please collect within 15 minutes'}
            {order.status === 'collected' && 'Order successfully collected'}
            {order.status === 'expired' && 'Please contact kitchen staff'}
          </Text>
        </View>
      </View>

      {/* Pickup Timer - Only show when order is ready */}
      {order.status === 'ready' && timeLeft && (
        <View style={[
          styles.timerSection,
          timeLeft.minutes < 5 && styles.timerWarning,
          timeLeft.expired && styles.timerExpired
        ]}>
          <Text style={styles.timerTitle}>
            {timeLeft.expired ? '⏰ PICKUP TIME EXPIRED' : '⏰ PICKUP TIMER'}
          </Text>
          <Text style={styles.timerText}>
            {timeLeft.expired 
              ? 'Time has run out' 
              : `${timeLeft.minutes}m ${timeLeft.seconds.toString().padStart(2, '0')}s`
            }
          </Text>
          <Text style={styles.timerSubtext}>
            {timeLeft.expired 
              ? 'Please contact kitchen staff for assistance'
              : 'Time remaining to collect your order'
            }
          </Text>
          
          {!timeLeft.expired && timeLeft.minutes < 5 && (
            <Text style={styles.timerAlert}>
              ⚠️ Hurry! Time is running out
            </Text>
          )}
        </View>
      )}

      {/* Order Items */}
      <View style={styles.itemsCard}>
        <Text style={styles.cardTitle}>Order Items</Text>
        {order.items?.map((item, index) => (
          <View key={index} style={styles.orderItem}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemQuantity}>x{item.quantity}</Text>
            <Text style={styles.itemPrice}>R{(item.price * item.quantity).toFixed(2)}</Text>
          </View>
        ))}
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total: R{order.total?.toFixed(2)}</Text>
        </View>
      </View>

      {/* Collection Info */}
      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>Collection Information</Text>
        <Text style={styles.infoText}>📍 {order.kitchenLocation || 'Main Campus Cafeteria'}</Text>
        <Text style={styles.infoText}>📞 Contact: 021 123 4567</Text>
        {order.readyAt && (
          <Text style={styles.infoText}>
            ✅ Ready at: {order.readyAt.toDate().toLocaleTimeString()}
          </Text>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        {order.status === 'ready' && !timeLeft?.expired && (
          <TouchableOpacity style={styles.collectButton} onPress={markAsCollected}>
            <Text style={styles.collectButtonText}>I've Collected My Order</Text>
          </TouchableOpacity>
        )}
        
        {(order.status === 'expired' || timeLeft?.expired) && (
          <TouchableOpacity style={styles.helpButton} onPress={() => Alert.alert('Help', 'Please visit the cafeteria counter for assistance.')}>
            <Text style={styles.helpButtonText}>Need Help?</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Menu')}
        >
          <Text style={styles.secondaryButtonText}>Back to Menu</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f0e6',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  orderNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
  },
  statusSection: {
    backgroundColor: '#fff',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 15,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  statusSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  timerSection: {
    backgroundColor: '#d4edda',
    padding: 20,
    margin: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  timerWarning: {
    backgroundColor: '#f8d7da',
  },
  timerExpired: {
    backgroundColor: '#f5c6cb',
  },
  timerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#155724',
  },
  timerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#155724',
    marginBottom: 8,
  },
  timerSubtext: {
    fontSize: 14,
    color: '#155724',
    textAlign: 'center',
    marginBottom: 8,
  },
  timerAlert: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#856404',
    marginTop: 8,
  },
  itemsCard: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 10,
    borderRadius: 12,
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 10,
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemName: {
    flex: 2,
    fontSize: 16,
  },
  itemQuantity: {
    flex: 1,
    textAlign: 'center',
    color: '#666',
  },
  itemPrice: {
    flex: 1,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  totalContainer: {
    borderTopWidth: 2,
    borderTopColor: '#ddd',
    paddingTop: 15,
    marginTop: 10,
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#d4a056',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  actions: {
    padding: 20,
    gap: 10,
  },
  collectButton: {
    backgroundColor: '#28a745',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  collectButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  helpButton: {
    backgroundColor: '#dc3545',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  helpButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d4a056',
  },
  secondaryButtonText: {
    color: '#d4a056',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    fontSize: 18,
    color: 'red',
    marginBottom: 20,
  },
});

export default OrderTrackingScreen;