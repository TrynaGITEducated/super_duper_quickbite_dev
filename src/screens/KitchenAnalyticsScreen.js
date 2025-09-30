
import { MaterialIcons } from '@expo/vector-icons';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { db } from '../../firebase';

const screenWidth = Dimensions.get('window').width;

export default function KitchenAnalyticsScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [timeRange, setTimeRange] = useState('today');
  const [stats, setStats] = useState({
    totalOrders: 0,
    completedOrders: 0,
    revenue: 0,
    avgPreparationTime: 0,
    popularItems: []
  });

  useEffect(() => {
    const ordersQuery = query(
      collection(db, 'orders'),
      orderBy('orderTime', 'desc')
    );
    
    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
      calculateStats(ordersData);
    });

    return unsubscribe;
  }, [timeRange]);

  const calculateStats = (ordersData) => {
    const filteredOrders = filterOrdersByTimeRange(ordersData);
    const completedOrders = filteredOrders.filter(order => order.status === 'completed');
    
    const totalRevenue = completedOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const popularItems = calculatePopularItems(completedOrders);
    
    setStats({
      totalOrders: filteredOrders.length,
      completedOrders: completedOrders.length,
      revenue: totalRevenue,
      avgPreparationTime: calculateAvgPreparationTime(completedOrders),
      popularItems: popularItems.slice(0, 5)
    });
  };

  const filterOrdersByTimeRange = (ordersData) => {
    const now = new Date();
    switch (timeRange) {
      case 'today':
        return ordersData.filter(order => {
          const orderDate = order.orderTime?.toDate();
          return orderDate && orderDate.toDateString() === now.toDateString();
        });
      case 'week':
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        return ordersData.filter(order => {
          const orderDate = order.orderTime?.toDate();
          return orderDate && orderDate >= weekAgo;
        });
      case 'month':
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
        return ordersData.filter(order => {
          const orderDate = order.orderTime?.toDate();
          return orderDate && orderDate >= monthAgo;
        });
      default:
        return ordersData;
    }
  };

  const calculatePopularItems = (orders) => {
    const itemCounts = {};
    orders.forEach(order => {
      order.items?.forEach(item => {
        itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
      });
    });
    
    return Object.entries(itemCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  };

  const calculateAvgPreparationTime = (orders) => {
    const validOrders = orders.filter(order => 
      order.orderTime?.toDate() && order.estimatedReadyTime?.toDate()
    );
    
    if (validOrders.length === 0) return 0;
    
    const totalTime = validOrders.reduce((sum, order) => {
      const orderTime = order.orderTime.toDate();
      const readyTime = order.estimatedReadyTime.toDate();
      return sum + (readyTime - orderTime);
    }, 0);
    
    return Math.round(totalTime / validOrders.length / 60000); // Convert to minutes
  };

  // Custom progress bar component
  const ProgressBar = ({ percentage, color }) => (
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBar, { width: `${percentage}%`, backgroundColor: color }]} />
    </View>
  );

  // Status distribution data for custom visualization
  const statusData = [
    { status: 'Completed', count: stats.completedOrders, color: '#28a745', percentage: stats.totalOrders > 0 ? (stats.completedOrders / stats.totalOrders) * 100 : 0 },
    { status: 'Pending', count: orders.filter(o => o.status === 'pending').length, color: '#ffc107', percentage: stats.totalOrders > 0 ? (orders.filter(o => o.status === 'pending').length / stats.totalOrders) * 100 : 0 },
    { status: 'Preparing', count: orders.filter(o => o.status === 'preparing').length, color: '#17a2b8', percentage: stats.totalOrders > 0 ? (orders.filter(o => o.status === 'preparing').length / stats.totalOrders) * 100 : 0 },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Kitchen Analytics</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Time Range Selector */}
      <View style={styles.timeRangeContainer}>
        {['today', 'week', 'month'].map((range) => (
          <TouchableOpacity
            key={range}
            style={[styles.timeRangeButton, timeRange === range && styles.activeTimeRange]}
            onPress={() => setTimeRange(range)}
          >
            <Text style={[styles.timeRangeText, timeRange === range && styles.activeTimeRangeText]}>
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Stats Overview */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <MaterialIcons name="receipt" size={24} color="#ff6b35" />
            <Text style={styles.statNumber}>{stats.totalOrders}</Text>
            <Text style={styles.statLabel}>Total Orders</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialIcons name="check-circle" size={24} color="#28a745" />
            <Text style={styles.statNumber}>{stats.completedOrders}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialIcons name="attach-money" size={24} color="#ffd700" />
            <Text style={styles.statNumber}>R{stats.revenue.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Revenue</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialIcons name="timer" size={24} color="#17a2b8" />
            <Text style={styles.statNumber}>{stats.avgPreparationTime}</Text>
            <Text style={styles.statLabel}>Avg Prep (min)</Text>
          </View>
        </View>

        {/* Order Status Distribution - Custom Implementation */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Order Status Distribution</Text>
          {statusData.map((item, index) => (
            <View key={index} style={styles.statusItem}>
              <View style={styles.statusInfo}>
                <View style={[styles.statusColor, { backgroundColor: item.color }]} />
                <Text style={styles.statusLabel}>{item.status}</Text>
                <Text style={styles.statusCount}>({item.count})</Text>
              </View>
              <ProgressBar percentage={item.percentage} color={item.color} />
              <Text style={styles.statusPercentage}>{item.percentage.toFixed(1)}%</Text>
            </View>
          ))}
        </View>

        {/* Popular Items - Custom Bar Implementation */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Most Popular Items</Text>
          {stats.popularItems.map((item, index) => {
            const maxCount = stats.popularItems[0]?.count || 1;
            const barWidth = (item.count / maxCount) * 100;
            
            return (
              <View key={index} style={styles.popularItemBar}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.itemCount}>{item.count} orders</Text>
                </View>
                <View style={styles.barContainer}>
                  <View style={[styles.bar, { width: `${barWidth}%`, backgroundColor: '#ff6b35' }]} />
                </View>
              </View>
            );
          })}
        </View>

        {/* Popular Items List */}
        <View style={styles.popularItemsContainer}>
          <Text style={styles.sectionTitle}>Top Menu Items</Text>
          {stats.popularItems.map((item, index) => (
            <View key={item.name} style={styles.popularItem}>
              <View style={styles.rankContainer}>
                <Text style={styles.rank}>#{index + 1}</Text>
              </View>
              <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.itemCount}>{item.count} orders</Text>
              </View>
              <MaterialIcons 
                name="star" 
                size={20} 
                color={index < 3 ? "#ffd700" : "#ccc"} 
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

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
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  timeRangeContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 4,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTimeRange: {
    backgroundColor: '#ff6b35',
  },
  timeRangeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeTimeRangeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
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
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
    textAlign: 'center',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusLabel: {
    fontSize: 14,
    color: '#000',
    marginRight: 5,
  },
  statusCount: {
    fontSize: 12,
    color: '#666',
  },
  progressBarContainer: {
    flex: 2,
    height: 6,
    backgroundColor: '#eee',
    borderRadius: 3,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  statusPercentage: {
    fontSize: 12,
    color: '#666',
    minWidth: 40,
    textAlign: 'right',
  },
  popularItemBar: {
    marginBottom: 12,
  },
  itemInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  itemName: {
    fontSize: 14,
    color: '#000',
    flex: 1,
    marginRight: 10,
  },
  itemCount: {
    fontSize: 12,
    color: '#666',
  },
  barContainer: {
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 4,
  },
  popularItemsContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  popularItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  rankContainer: {
    width: 30,
    alignItems: 'center',
  },
  rank: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff6b35',
  },
  itemDetails: {
    flex: 1,
    marginRight: 10,
  },
});