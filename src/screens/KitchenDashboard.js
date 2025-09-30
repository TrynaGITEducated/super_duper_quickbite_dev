// screens/KitchenDashboard.js
import { MaterialIcons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { auth, db } from '../../firebase';

export default function KitchenDashboard({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debugInfo, setDebugInfo] = useState('');

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  useEffect(() => {
    console.log('Setting up Firebase listeners...');
    
    // Listen for real-time orders - try compound query first
    const ordersQuery = query(
      collection(db, 'orders'),
      where('status', 'in', ['pending', 'preparing', 'ready']),
      orderBy('orderTime', 'desc')
    );
    
    const unsubscribeOrders = onSnapshot(ordersQuery, 
      (snapshot) => {
        console.log('Orders snapshot received:', snapshot.size, 'orders');
        const ordersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setOrders(ordersData);
        setDebugInfo(`Loaded ${ordersData.length} active orders`);
        
        // Log first order for debugging
        if (ordersData.length > 0) {
          console.log('First order sample:', JSON.stringify(ordersData[0], null, 2));
        }
      },
      (error) => {
        console.error('Error with compound query:', error);
        setDebugInfo(`Query error: ${error.message}`);
        
        // Fallback: get all orders and filter client-side
        console.log('Trying fallback query...');
        const fallbackQuery = query(
          collection(db, 'orders'),
          orderBy('orderTime', 'desc')
        );
        
        onSnapshot(fallbackQuery, (snapshot) => {
          const allOrders = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          const activeOrders = allOrders.filter(order => 
            !['completed', 'cancelled'].includes(order.status)
          );
          console.log('Fallback loaded:', activeOrders.length, 'active orders');
          setOrders(activeOrders);
          setDebugInfo(`Fallback: ${activeOrders.length} active orders`);
        });
      }
    );

    // Listen for menu items
    const menuQuery = query(collection(db, 'menu'));
    const unsubscribeMenu = onSnapshot(menuQuery, (snapshot) => {
      const menuData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMenuItems(menuData);
    });

    return () => {
      unsubscribeOrders();
      unsubscribeMenu();
    };
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      const updates = { status: newStatus };
      
      if (newStatus === 'ready') {
        updates.estimatedReadyTime = serverTimestamp();
        await sendNotification(orderId, 'order_ready', 'Your order is ready for pickup!');
      }
      
      await updateDoc(orderRef, updates);
      Alert.alert('Success', `Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      Alert.alert('Error', `Failed to update order status: ${error.message}`);
    }
  };

  const toggleItemAvailability = async (itemId, currentStatus) => {
    try {
      const itemRef = doc(db, 'menu', itemId);
      await updateDoc(itemRef, { available: !currentStatus });
      Alert.alert('Success', `Item ${!currentStatus ? 'made available' : 'made unavailable'}`);
    } catch (error) {
      console.error('Error updating item availability:', error);
      Alert.alert('Error', 'Failed to update item availability');
    }
  };

  const sendNotification = async (orderId, type, message) => {
    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) return;

      await addDoc(collection(db, 'notifications'), {
        userId: order.userId,
        orderId: orderId,
        type: type,
        title: type === 'order_ready' ? 'Order Ready!' : 'Order Update',
        message: message,
        timestamp: serverTimestamp(),
        read: false
      });
      Alert.alert('Success', 'Customer notified');
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Debug function to check orders
  const debugOrders = () => {
    console.log('=== ORDERS DEBUG ===');
    console.log('Total orders:', orders.length);
    orders.forEach((order, index) => {
      console.log(`Order ${index + 1}:`, {
        id: order.id,
        status: order.status,
        customerName: order.customerName,
        items: order.items?.length || 0,
        total: order.total
      });
    });
    
    Alert.alert(
      'Orders Debug', 
      `Total: ${orders.length} orders\n` +
      `Active: ${orders.filter(o => !['completed', 'cancelled'].includes(o.status)).length}\n` +
      `Debug: ${debugInfo}`
    );
  };

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.userEmail?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'preparing': return '#17a2b8';
      case 'ready': return '#28a745';
      case 'completed': return '#6c757d';
      case 'cancelled': return '#dc3545';
      default: return '#666';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'preparing': return 'Preparing';
      case 'ready': return 'Ready for Pickup';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const formatOrderTime = (timestamp) => {
    if (!timestamp) return 'Time unknown';
    try {
      if (timestamp.toDate) {
        return timestamp.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      }
      return new Date(timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    } catch (error) {
      return 'Invalid time';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setIsMenuOpen(!isMenuOpen)}>
          <MaterialIcons name="menu" size={28} color="#000" />
        </TouchableOpacity>

        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search orders..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
          />
        </View>

        {/* Debug Button */}
        <TouchableOpacity onPress={debugOrders} style={styles.debugButton}>
          <MaterialIcons name="bug-report" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Dashboard Menu */}
      {isMenuOpen && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => navigation.navigate('KitchenAnalytics')}
          >
            <MaterialIcons name="analytics" size={20} color="#000" />
            <Text style={styles.menuText}>Analytics</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => navigation.navigate('Inventory')}
          >
            <MaterialIcons name="inventory" size={20} color="#000" />
            <Text style={styles.menuText}>Inventory</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <MaterialIcons name="logout" size={20} color="#000" />
            <Text style={styles.menuText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.exploreText}>Kitchen Dashboard</Text>
        
        {/* Debug Info */}
        {debugInfo ? (
          <Text style={styles.debugInfo}>{debugInfo}</Text>
        ) : null}
        
        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{orders.filter(o => o.status === 'pending').length}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{orders.filter(o => o.status === 'preparing').length}</Text>
            <Text style={styles.statLabel}>Preparing</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{orders.filter(o => o.status === 'ready').length}</Text>
            <Text style={styles.statLabel}>Ready</Text>
          </View>
        </View>
        
        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'orders' && styles.activeTab]}
            onPress={() => setActiveTab('orders')}
          >
            <Text style={[styles.tabText, activeTab === 'orders' && styles.activeTabText]}>
              Orders ({orders.filter(o => !['completed', 'cancelled'].includes(o.status)).length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'menu' && styles.activeTab]}
            onPress={() => setActiveTab('menu')}
          >
            <Text style={[styles.tabText, activeTab === 'menu' && styles.activeTabText]}>
              Menu ({menuItems.filter(m => !m.available).length} unavailable)
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {activeTab === 'orders' && (
            <View style={styles.section}>
              {filteredOrders.filter(order => !['completed', 'cancelled'].includes(order.status)).length === 0 ? (
                <View style={styles.emptyState}>
                  <MaterialIcons name="receipt" size={48} color="#ccc" />
                  <Text style={styles.emptyText}>No active orders</Text>
                  <Text style={styles.emptySubtext}>
                    Orders from customers will appear here automatically
                  </Text>
                  <TouchableOpacity onPress={debugOrders} style={styles.debugHelpButton}>
                    <Text style={styles.debugHelpText}>Debug Orders</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                filteredOrders
                  .filter(order => !['completed', 'cancelled'].includes(order.status))
                  .map((order) => (
                  <OrderCard 
                    key={order.id} 
                    order={order} 
                    onUpdateStatus={updateOrderStatus}
                    onSendNotification={sendNotification}
                    getStatusColor={getStatusColor}
                    getStatusText={getStatusText}
                    formatOrderTime={formatOrderTime}
                  />
                ))
              )}
            </View>
          )}

          {activeTab === 'menu' && (
            <View style={styles.section}>
              {menuItems.map((item) => (
                <MenuItemCard 
                  key={item.id} 
                  item={item} 
                  onToggleAvailability={toggleItemAvailability}
                />
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const OrderCard = ({ order, onUpdateStatus, onSendNotification, getStatusColor, getStatusText, formatOrderTime }) => (
  <View style={styles.card}>
    <View style={styles.orderHeader}>
      <View style={styles.orderInfo}>
        <Text style={styles.orderNumber}>Order #{order.id.slice(-6).toUpperCase()}</Text>
        <Text style={styles.customerName}>
          {order.customerName || order.userName || order.userEmail || 'Customer'}
        </Text>
        <Text style={styles.orderTime}>
          Ordered: {formatOrderTime(order.orderTime)}
        </Text>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
        <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
      </View>
    </View>
    
    <View style={styles.orderDetails}>
      <Text style={styles.itemsTitle}>Items:</Text>
      {order.items?.map((item, index) => (
        <View key={index} style={styles.itemRow}>
          <Text style={styles.itemText}>
            {item.quantity}x {item.name || item.title}
            {item.price ? ` - $${item.price}` : ''}
          </Text>
          {item.notes && (
            <Text style={styles.itemNotes}>Note: {item.notes}</Text>
          )}
        </View>
      ))}
      
      <Text style={styles.totalText}>Total: ${order.total?.toFixed(2) || '0.00'}</Text>
      
      {order.specialInstructions && (
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Special Instructions:</Text>
          <Text style={styles.instructionsText}>{order.specialInstructions}</Text>
        </View>
      )}
    </View>

    <View style={styles.orderActions}>
      {order.status === 'pending' && (
        <TouchableOpacity 
          style={[styles.actionButton, styles.startButton]}
          onPress={() => onUpdateStatus(order.id, 'preparing')}
        >
          <Text style={styles.buttonText}>Start Preparing</Text>
        </TouchableOpacity>
      )}
      
      {order.status === 'preparing' && (
        <TouchableOpacity 
          style={[styles.actionButton, styles.readyButton]}
          onPress={() => onUpdateStatus(order.id, 'ready')}
        >
          <Text style={styles.buttonText}>Mark Ready</Text>
        </TouchableOpacity>
      )}
      
      {order.status === 'ready' && (
        <TouchableOpacity 
          style={[styles.actionButton, styles.completeButton]}
          onPress={() => onUpdateStatus(order.id, 'completed')}
        >
          <Text style={styles.buttonText}>Complete Order</Text>
        </TouchableOpacity>
      )}
      
      <TouchableOpacity 
        style={[styles.actionButton, styles.delayButton]}
        onPress={() => onSendNotification(
          order.id, 
          'delay', 
          `Your order #${order.id.slice(-6)} is delayed. We'll notify you when it's ready.`
        )}
      >
        <Text style={styles.buttonText}>Notify Delay</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const MenuItemCard = ({ item, onToggleAvailability }) => (
  <View style={styles.card}>
    <View style={styles.menuItemHeader}>
      <View style={styles.menuItemInfo}>
        <Text style={styles.menuItemName}>{item.name}</Text>
        <Text style={styles.menuItemPrice}>${item.price}</Text>
        <Text style={styles.menuItemCategory}>{item.category}</Text>
      </View>
      <View style={[
        styles.availabilityBadge, 
        { backgroundColor: item.available ? '#d4edda' : '#f8d7da' }
      ]}>
        <Text style={[
          styles.availabilityText,
          { color: item.available ? '#155724' : '#721c24' }
        ]}>
          {item.available ? 'Available' : 'Unavailable'}
        </Text>
      </View>
    </View>
    
    {item.ingredients && (
      <View style={styles.ingredientsContainer}>
        <Text style={styles.ingredientsTitle}>Ingredients:</Text>
        <Text style={styles.ingredientsText}>
          {Object.entries(item.ingredients).map(([ingredient, quantity]) => 
            `${ingredient}: ${quantity}`
          ).join(', ')}
        </Text>
      </View>
    )}
    
    {item.lowStockWarning && (
      <View style={styles.warningBadge}>
        <MaterialIcons name="warning" size={16} color="#856404" />
        <Text style={styles.warningText}>Low Ingredients Stock</Text>
      </View>
    )}
    
    <TouchableOpacity 
      style={[
        styles.actionButton, 
        item.available ? styles.unavailableButton : styles.availableButton,
        styles.fullWidthButton
      ]}
      onPress={() => onToggleAvailability(item.id, item.available)}
    >
      <Text style={styles.buttonText}>
        {item.available ? 'Make Unavailable' : 'Make Available'}
      </Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f0e6',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    width: '100%',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  debugButton: {
    backgroundColor: '#6c757d',
    padding: 8,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 70,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 10,
  },
  content: {
    flex: 1,
    marginTop: 20,
  },
  exploreText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#000',
  },
  debugInfo: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 20,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#ff6b35',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 18,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginBottom: 20,
  },
  debugHelpButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  debugHelpText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  customerName: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  orderTime: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  orderDetails: {
    marginBottom: 10,
  },
  itemsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  itemRow: {
    marginBottom: 4,
  },
  itemText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  itemNotes: {
    fontSize: 11,
    color: '#ff6b35',
    fontStyle: 'italic',
    marginLeft: 16,
  },
  totalText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 8,
  },
  instructionsContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 4,
  },
  instructionsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 2,
  },
  instructionsText: {
    fontSize: 11,
    color: '#666',
    fontStyle: 'italic',
  },
  orderActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  menuItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  menuItemInfo: {
    flex: 1,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  menuItemPrice: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  menuItemCategory: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  availabilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  availabilityText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  ingredientsContainer: {
    marginBottom: 8,
  },
  ingredientsTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000',
    marginBottom: 2,
  },
  ingredientsText: {
    fontSize: 11,
    color: '#666',
  },
  warningBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    padding: 6,
    borderRadius: 4,
    marginBottom: 8,
  },
  warningText: {
    fontSize: 12,
    color: '#856404',
    marginLeft: 4,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    minWidth: 120,
  },
  fullWidthButton: {
    minWidth: '100%',
  },
  startButton: { backgroundColor: '#17a2b8' },
  readyButton: { backgroundColor: '#28a745' },
  completeButton: { backgroundColor: '#6c757d' },
  delayButton: { backgroundColor: '#ffc107' },
  cancelButton: { backgroundColor: '#dc3545' },
  availableButton: { backgroundColor: '#28a745' },
  unavailableButton: { backgroundColor: '#dc3545' },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});