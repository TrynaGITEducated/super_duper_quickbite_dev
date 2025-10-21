import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { auth, db } from '../../firebase';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setOrders([]);
          setLoading(false);
          return;
        }
        const ordersRef = collection(db, 'orders');
        const q = query(ordersRef, where('userId', '==', user.uid));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(data);
      } catch (e) {
        setOrders([]);
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1e90ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order History</Text>
      {orders.length === 0 ? (
        <Text style={styles.empty}>No orders found.</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.orderCard}>
              <Text style={styles.orderId}>Order ID: {item.id}</Text>
              <Text>Date: {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'N/A'}</Text>
              <Text>Status: {item.status || 'N/A'}</Text>
              {item.items && Array.isArray(item.items) && (
                <View style={styles.itemsList}>
                  <Text style={styles.itemsTitle}>Items:</Text>
                  {item.items.map((itm, idx) => (
                    <Text key={idx} style={styles.itemText}>
                      {itm.title} x{itm.quantity}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  empty: { color: '#666', textAlign: 'center', marginTop: 40 },
  orderCard: {
    backgroundColor: '#f5f0e6',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  orderId: { fontWeight: 'bold', marginBottom: 4 },
  itemsList: { marginTop: 8 },
  itemsTitle: { fontWeight: 'bold' },
  itemText: { marginLeft: 8 },
});
