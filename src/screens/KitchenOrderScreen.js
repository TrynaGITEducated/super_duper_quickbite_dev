import {
    collection,
    doc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { db } from '../../firebase';

const KitchenOrderScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Listen for orders assigned to this kitchen
  useEffect(() => {
    const kitchenId = 'your-kitchen-id'; // Get from auth or context
    
    const q = query(
      collection(db, 'orders'),
      where('kitchenId', '==', kitchenId),
      where('status', 'in', ['preparing', 'ready']),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
    });

    return unsubscribe;
  }, []);

  const markOrderAsReady = async (orderId) => {
    try {
      setLoading(true);
      const now = new Date();
      const pickupExpiresAt = new Date(now.getTime() + 15 * 60 * 1000); // 15 minutes from now

      await updateDoc(doc(db, 'orders', orderId), {
        status: 'ready',
        readyAt: serverTimestamp(),
        pickupExpiresAt: pickupExpiresAt,
        customerNotified: false
      });

      // Send push notification to customer
      await sendReadyNotification(orderId);
      
      Alert.alert('Success', 'Order marked as ready! Customer notified.');
    } catch (error) {
      console.error('Error marking order as ready:', error);
      Alert.alert('Error', 'Failed to update order status.');
    } finally {
      setLoading(false);
    }
  };

  const sendReadyNotification = async (orderId) => {
    // Implement push notification logic here
    // This would use FCM (Firebase Cloud Messaging)
    console.log('Sending ready notification for order:', orderId);
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Order #{item.id.slice(-6)}</Text>
        <Text style={styles.orderTime}>
          {item.createdAt?.toDate().toLocaleTimeString()}
        </Text>
      </View>
      
      <Text style={styles.customerName}>Customer: {item.userId}</Text>
      
      {/* Order Items */}
      <View style={styles.itemsContainer}>
        {item.items?.map((orderItem, index) => (
          <Text key={index} style={styles.itemText}>
            {orderItem.quantity}x {orderItem.name}
          </Text>
        ))}
      </View>

      {/* Order Status */}
      <View style={[
        styles.statusBadge,
        item.status === 'ready' ? styles.readyBadge : styles.preparingBadge
      ]}>
        <Text style={styles.statusText}>
          {item.status === 'ready' ? 'READY FOR PICKUP' : 'PREPARING'}
        </Text>
      </View>

      {/* Timer for ready orders */}
      {item.status === 'ready' && item.pickupExpiresAt && (
        <PickupTimer expiryTime={item.pickupExpiresAt} orderId={item.id} />
      )}

      {/* Action Button */}
      {item.status === 'preparing' && (
        <TouchableOpacity
          style={styles.readyButton}
          onPress={() => markOrderAsReady(item.id)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.readyButtonText}>Mark as Ready</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kitchen Orders</Text>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

// Pickup Timer Component
const PickupTimer = ({ expiryTime, orderId }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(expiryTime));

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(expiryTime);
      setTimeLeft(newTimeLeft);

      // Auto-expire order if time runs out
      if (newTimeLeft.total <= 0) {
        clearInterval(timer);
        expireOrder(orderId);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiryTime, orderId]);

  const calculateTimeLeft = (expiry) => {
    const now = new Date().getTime();
    const expiryTimestamp = expiry?.toDate?.()?.getTime() || expiry;
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

  const expireOrder = async (orderId) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: 'expired'
      });
      // Send notification about expired order
    } catch (error) {
      console.error('Error expiring order:', error);
    }
  };

  return (
    <View style={[
      styles.timerContainer,
      timeLeft.minutes < 5 && styles.timerWarning,
      timeLeft.expired && styles.timerExpired
    ]}>
      <Text style={styles.timerText}>
        {timeLeft.expired ? 'EXPIRED' : `Pickup: ${timeLeft.minutes}:${timeLeft.seconds.toString().padStart(2, '0')}`}
      </Text>
      <Text style={styles.timerSubtext}>
        {timeLeft.expired ? 'Order pickup time expired' : 'Time remaining to collect'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#2c5530',
  },
  listContainer: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  orderTime: {
    fontSize: 14,
    color: '#666',
  },
  customerName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  itemsContainer: {
    marginBottom: 12,
  },
  itemText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  preparingBadge: {
    backgroundColor: '#fff3cd',
  },
  readyBadge: {
    backgroundColor: '#d1edff',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  readyButton: {
    backgroundColor: '#f4a261',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  readyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  timerContainer: {
    backgroundColor: '#d4edda',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  timerWarning: {
    backgroundColor: '#f8d7da',
  },
  timerExpired: {
    backgroundColor: '#f5c6cb',
  },
  timerText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#155724',
  },
  timerSubtext: {
    fontSize: 12,
    textAlign: 'center',
    color: '#155724',
    marginTop: 4,
  },
});

export default KitchenOrderScreen;