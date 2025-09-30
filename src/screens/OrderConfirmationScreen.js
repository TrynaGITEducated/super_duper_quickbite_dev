import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { db } from "../../firebase";

export default function OrderConfirmationScreen({ route, navigation }) {
  const { orderId, cartItems, total } = route.params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(10); // Auto-redirect countdown

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const unsub = onSnapshot(doc(db, "orders", orderId), (snapshot) => {
      if (snapshot.exists()) {
        setOrder(snapshot.data());
      } else {
        setOrder(null);
      }
      setLoading(false);
    });

    return () => unsub();
  }, [orderId]);

  // Auto-redirect to menu after countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      goToMenu();
    }
  }, [countdown]);

  const goToMenu = () => {
    // Navigate to Menu and pass cart items to continue ordering
    navigation.navigate("Menu", { 
      cartItems: cartItems || [],
      fromConfirmation: true 
    });
  };

  const startNewOrder = () => {
    // Clear cart and start fresh
    navigation.navigate("Menu", { cartItems: [] });
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
        <Text style={styles.error}>Order not found ❌</Text>
        <Button title="Go to Menu" onPress={goToMenu} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.successIcon}>
          <Text style={styles.successIconText}>✓</Text>
        </View>
        <Text style={styles.title}>Order Confirmed! 🎉</Text>
        <Text style={styles.orderNumber}>
          Order #: {orderId.slice(-8).toUpperCase()}
        </Text>
      </View>

      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        
        {cartItems?.map((item, index) => (
          <View key={index} style={styles.orderItem}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemQuantity}>x{item.quantity}</Text>
            <Text style={styles.itemPrice}>R{(item.price * item.quantity).toFixed(2)}</Text>
          </View>
        ))}
        
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total: R{total?.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.statusCard}>
        <Text style={styles.sectionTitle}>Order Status</Text>
        <Text style={styles.statusText}>Status: {order.status || 'Confirmed'}</Text>
        <Text style={styles.pickupText}>
          Pickup Time:{" "}
          {order.pickupTime
            ? new Date(order.pickupTime).toLocaleString()
            : "Will be notified when ready"}
        </Text>
      </View>

      <View style={styles.estimatedTime}>
        <Text style={styles.estimatedTitle}>Estimated Preparation Time</Text>
        <Text style={styles.estimatedText}>20-30 minutes</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={goToMenu}
        >
          <Text style={styles.primaryButtonText}>
            Continue Ordering ({countdown})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={startNewOrder}
        >
          <Text style={styles.secondaryButtonText}>Start Fresh Order</Text>
        </TouchableOpacity>

        <Button 
          title="View Order Tracking" 
          onPress={() => navigation.navigate("OrderTracking", { orderId })}
          color="#666"
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          You will receive a notification when your order is ready for pickup.
        </Text>
        <Text style={styles.countdownText}>
          Redirecting to menu in {countdown} seconds...
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f0e6',
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  successIconText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  orderNumber: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  detailsCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
  },
  statusCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
  },
  sectionTitle: {
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
  statusText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  pickupText: {
    fontSize: 16,
    color: '#666',
  },
  estimatedTime: {
    backgroundColor: '#e8f5e8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  estimatedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#2e7d32',
  },
  estimatedText: {
    fontSize: 14,
    color: '#2e7d32',
  },
  actions: {
    gap: 10,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#d4a056',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    padding: 15,
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
  footer: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  footerText: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 10,
  },
  countdownText: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
  },
  error: {
    fontSize: 18,
    color: "red",
    marginBottom: 20,
  },
});