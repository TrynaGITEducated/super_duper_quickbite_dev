
// import { MaterialIcons } from '@expo/vector-icons';
// import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
// import { useEffect, useState } from 'react';
// import {
//   Dimensions,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View
// } from 'react-native';
// import { db } from '../../firebase';

// const screenWidth = Dimensions.get('window').width;

// export default function KitchenAnalyticsScreen({ navigation }) {
//   const [orders, setOrders] = useState([]);
//   const [timeRange, setTimeRange] = useState('today');
//   const [stats, setStats] = useState({
//     totalOrders: 0,
//     completedOrders: 0,
//     revenue: 0,
//     avgPreparationTime: 0,
//     popularItems: []
//   });

//   useEffect(() => {
//     const ordersQuery = query(
//       collection(db, 'orders'),
//       orderBy('orderTime', 'desc')
//     );
    
//     const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
//       const ordersData = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));
//       setOrders(ordersData);
//       calculateStats(ordersData);
//     });

//     return unsubscribe;
//   }, [timeRange]);

//   const calculateStats = (ordersData) => {
//     const filteredOrders = filterOrdersByTimeRange(ordersData);
//     const completedOrders = filteredOrders.filter(order => order.status === 'completed');
    
//     const totalRevenue = completedOrders.reduce((sum, order) => sum + (order.total || 0), 0);
//     const popularItems = calculatePopularItems(completedOrders);
    
//     setStats({
//       totalOrders: filteredOrders.length,
//       completedOrders: completedOrders.length,
//       revenue: totalRevenue,
//       avgPreparationTime: calculateAvgPreparationTime(completedOrders),
//       popularItems: popularItems.slice(0, 5)
//     });
//   };

//   const filterOrdersByTimeRange = (ordersData) => {
//     const now = new Date();
//     switch (timeRange) {
//       case 'today':
//         return ordersData.filter(order => {
//           const orderDate = order.orderTime?.toDate();
//           return orderDate && orderDate.toDateString() === now.toDateString();
//         });
//       case 'week':
//         const weekAgo = new Date(now.setDate(now.getDate() - 7));
//         return ordersData.filter(order => {
//           const orderDate = order.orderTime?.toDate();
//           return orderDate && orderDate >= weekAgo;
//         });
//       case 'month':
//         const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
//         return ordersData.filter(order => {
//           const orderDate = order.orderTime?.toDate();
//           return orderDate && orderDate >= monthAgo;
//         });
//       default:
//         return ordersData;
//     }
//   };

//   const calculatePopularItems = (orders) => {
//     const itemCounts = {};
//     orders.forEach(order => {
//       order.items?.forEach(item => {
//         itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
//       });
//     });
    
//     return Object.entries(itemCounts)
//       .map(([name, count]) => ({ name, count }))
//       .sort((a, b) => b.count - a.count);
//   };

//   const calculateAvgPreparationTime = (orders) => {
//     const validOrders = orders.filter(order => 
//       order.orderTime?.toDate() && order.estimatedReadyTime?.toDate()
//     );
    
//     if (validOrders.length === 0) return 0;
    
//     const totalTime = validOrders.reduce((sum, order) => {
//       const orderTime = order.orderTime.toDate();
//       const readyTime = order.estimatedReadyTime.toDate();
//       return sum + (readyTime - orderTime);
//     }, 0);
    
//     return Math.round(totalTime / validOrders.length / 60000); // Convert to minutes
//   };

//   // Custom progress bar component
//   const ProgressBar = ({ percentage, color }) => (
//     <View style={styles.progressBarContainer}>
//       <View style={[styles.progressBar, { width: `${percentage}%`, backgroundColor: color }]} />
//     </View>
//   );

//   // Status distribution data for custom visualization
//   const statusData = [
//     { status: 'Completed', count: stats.completedOrders, color: '#28a745', percentage: stats.totalOrders > 0 ? (stats.completedOrders / stats.totalOrders) * 100 : 0 },
//     { status: 'Pending', count: orders.filter(o => o.status === 'pending').length, color: '#ffc107', percentage: stats.totalOrders > 0 ? (orders.filter(o => o.status === 'pending').length / stats.totalOrders) * 100 : 0 },
//     { status: 'Preparing', count: orders.filter(o => o.status === 'preparing').length, color: '#17a2b8', percentage: stats.totalOrders > 0 ? (orders.filter(o => o.status === 'preparing').length / stats.totalOrders) * 100 : 0 },
//   ];

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <MaterialIcons name="arrow-back" size={28} color="#000" />
//         </TouchableOpacity>
//         <Text style={styles.title}>Kitchen Analytics</Text>
//         <View style={{ width: 28 }} />
//       </View>

//       {/* Time Range Selector */}
//       <View style={styles.timeRangeContainer}>
//         {['today', 'week', 'month'].map((range) => (
//           <TouchableOpacity
//             key={range}
//             style={[styles.timeRangeButton, timeRange === range && styles.activeTimeRange]}
//             onPress={() => setTimeRange(range)}
//           >
//             <Text style={[styles.timeRangeText, timeRange === range && styles.activeTimeRangeText]}>
//               {range.charAt(0).toUpperCase() + range.slice(1)}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       <ScrollView style={styles.scrollView}>
//         {/* Stats Overview */}
//         <View style={styles.statsGrid}>
//           <View style={styles.statCard}>
//             <MaterialIcons name="receipt" size={24} color="#ff6b35" />
//             <Text style={styles.statNumber}>{stats.totalOrders}</Text>
//             <Text style={styles.statLabel}>Total Orders</Text>
//           </View>
//           <View style={styles.statCard}>
//             <MaterialIcons name="check-circle" size={24} color="#28a745" />
//             <Text style={styles.statNumber}>{stats.completedOrders}</Text>
//             <Text style={styles.statLabel}>Completed</Text>
//           </View>
//           <View style={styles.statCard}>
//             <MaterialIcons name="attach-money" size={24} color="#ffd700" />
//             <Text style={styles.statNumber}>R{stats.revenue.toFixed(2)}</Text>
//             <Text style={styles.statLabel}>Revenue</Text>
//           </View>
//           <View style={styles.statCard}>
//             <MaterialIcons name="timer" size={24} color="#17a2b8" />
//             <Text style={styles.statNumber}>{stats.avgPreparationTime}</Text>
//             <Text style={styles.statLabel}>Avg Prep (min)</Text>
//           </View>
//         </View>

//         {/* Order Status Distribution - Custom Implementation */}
//         <View style={styles.chartContainer}>
//           <Text style={styles.chartTitle}>Order Status Distribution</Text>
//           {statusData.map((item, index) => (
//             <View key={index} style={styles.statusItem}>
//               <View style={styles.statusInfo}>
//                 <View style={[styles.statusColor, { backgroundColor: item.color }]} />
//                 <Text style={styles.statusLabel}>{item.status}</Text>
//                 <Text style={styles.statusCount}>({item.count})</Text>
//               </View>
//               <ProgressBar percentage={item.percentage} color={item.color} />
//               <Text style={styles.statusPercentage}>{item.percentage.toFixed(1)}%</Text>
//             </View>
//           ))}
//         </View>

//         {/* Popular Items - Custom Bar Implementation */}
//         <View style={styles.chartContainer}>
//           <Text style={styles.chartTitle}>Most Popular Items</Text>
//           {stats.popularItems.map((item, index) => {
//             const maxCount = stats.popularItems[0]?.count || 1;
//             const barWidth = (item.count / maxCount) * 100;
            
//             return (
//               <View key={index} style={styles.popularItemBar}>
//                 <View style={styles.itemInfo}>
//                   <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
//                   <Text style={styles.itemCount}>{item.count} orders</Text>
//                 </View>
//                 <View style={styles.barContainer}>
//                   <View style={[styles.bar, { width: `${barWidth}%`, backgroundColor: '#ff6b35' }]} />
//                 </View>
//               </View>
//             );
//           })}
//         </View>

//         {/* Popular Items List */}
//         <View style={styles.popularItemsContainer}>
//           <Text style={styles.sectionTitle}>Top Menu Items</Text>
//           {stats.popularItems.map((item, index) => (
//             <View key={item.name} style={styles.popularItem}>
//               <View style={styles.rankContainer}>
//                 <Text style={styles.rank}>#{index + 1}</Text>
//               </View>
//               <View style={styles.itemDetails}>
//                 <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
//                 <Text style={styles.itemCount}>{item.count} orders</Text>
//               </View>
//               <MaterialIcons 
//                 name="star" 
//                 size={20} 
//                 color={index < 3 ? "#ffd700" : "#ccc"} 
//               />
//             </View>
//           ))}
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f0e6',
//     paddingHorizontal: 16,
//     paddingTop: 40,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#000',
//   },
//   timeRangeContainer: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     padding: 4,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   timeRangeButton: {
//     flex: 1,
//     paddingVertical: 8,
//     alignItems: 'center',
//     borderRadius: 6,
//   },
//   activeTimeRange: {
//     backgroundColor: '#ff6b35',
//   },
//   timeRangeText: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#666',
//   },
//   activeTimeRangeText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   scrollView: {
//     flex: 1,
//   },
//   statsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//   },
//   statCard: {
//     width: '48%',
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     padding: 15,
//     alignItems: 'center',
//     marginBottom: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   statNumber: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#000',
//     marginTop: 5,
//   },
//   statLabel: {
//     fontSize: 12,
//     color: '#666',
//     marginTop: 5,
//   },
//   chartContainer: {
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     padding: 15,
//     marginBottom: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   chartTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#000',
//     marginBottom: 15,
//     textAlign: 'center',
//   },
//   statusItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 12,
//   },
//   statusInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   statusColor: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     marginRight: 8,
//   },
//   statusLabel: {
//     fontSize: 14,
//     color: '#000',
//     marginRight: 5,
//   },
//   statusCount: {
//     fontSize: 12,
//     color: '#666',
//   },
//   progressBarContainer: {
//     flex: 2,
//     height: 6,
//     backgroundColor: '#eee',
//     borderRadius: 3,
//     marginHorizontal: 10,
//     overflow: 'hidden',
//   },
//   progressBar: {
//     height: '100%',
//     borderRadius: 3,
//   },
//   statusPercentage: {
//     fontSize: 12,
//     color: '#666',
//     minWidth: 40,
//     textAlign: 'right',
//   },
//   popularItemBar: {
//     marginBottom: 12,
//   },
//   itemInfo: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 5,
//   },
//   itemName: {
//     fontSize: 14,
//     color: '#000',
//     flex: 1,
//     marginRight: 10,
//   },
//   itemCount: {
//     fontSize: 12,
//     color: '#666',
//   },
//   barContainer: {
//     height: 8,
//     backgroundColor: '#eee',
//     borderRadius: 4,
//     overflow: 'hidden',
//   },
//   bar: {
//     height: '100%',
//     borderRadius: 4,
//   },
//   popularItemsContainer: {
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     padding: 15,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#000',
//     marginBottom: 15,
//   },
//   popularItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   rankContainer: {
//     width: 30,
//     alignItems: 'center',
//   },
//   rank: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#ff6b35',
//   },
//   itemDetails: {
//     flex: 1,
//     marginRight: 10,
//   },
// });
import { MaterialIcons } from '@expo/vector-icons';
import { 
  collection, 
  onSnapshot, 
  orderBy, 
  query, 
  where,
  Timestamp 
} from 'firebase/firestore';
import { useEffect, useState, useRef } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  RefreshControl
} from 'react-native';
import { db } from '../../firebase';

const screenWidth = Dimensions.get('window').width;

export default function KitchenAnalyticsScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [timeRange, setTimeRange] = useState('today');
  const [refreshing, setRefreshing] = useState(false);
  const [realTimeUpdates, setRealTimeUpdates] = useState([]);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const [stats, setStats] = useState({
    totalOrders: 0,
    completedOrders: 0,
    revenue: 0,
    avgPreparationTime: 0,
    popularItems: [],
    currentWaitTime: 0,
    efficiency: 0,
    peakHours: []
  });

  // Real-time pulse animation for new orders
  const startPulseAnimation = () => {
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.2,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    // Subscribe to orders with real-time updates
    const ordersQuery = query(
      collection(db, 'orders'),
      orderBy('orderTime', 'desc')
    );
    
    const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Detect new orders for real-time notifications
      if (ordersData.length > orders.length) {
        const newOrders = ordersData.slice(0, ordersData.length - orders.length);
        showRealTimeUpdate(`New order: ${newOrders[0]?.items?.[0]?.name || 'Order received'}`);
        startPulseAnimation();
      }
      
      setOrders(ordersData);
      calculateStats(ordersData);
    });

    // Subscribe to menu items for inventory insights
    const menuQuery = query(collection(db, 'menu'));
    const unsubscribeMenu = onSnapshot(menuQuery, (snapshot) => {
      const menuData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMenuItems(menuData);
    });

    // Real-time updates cleanup
    const updateCleanup = setInterval(() => {
      setRealTimeUpdates(prev => prev.filter(update => 
        Date.now() - update.timestamp < 5000
      ));
    }, 1000);

    return () => {
      unsubscribeOrders();
      unsubscribeMenu();
      clearInterval(updateCleanup);
    };
  }, [timeRange]);

  const showRealTimeUpdate = (message) => {
    const update = {
      id: Date.now().toString(),
      message,
      timestamp: Date.now()
    };
    setRealTimeUpdates(prev => [update, ...prev.slice(0, 4)]); // Keep only last 5
  };

  const calculateStats = (ordersData) => {
    const filteredOrders = filterOrdersByTimeRange(ordersData);
    const completedOrders = filteredOrders.filter(order => order.status === 'completed');
    const pendingOrders = filteredOrders.filter(order => 
      ['pending', 'preparing', 'ready'].includes(order.status)
    );
    
    const totalRevenue = completedOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const popularItems = calculatePopularItems(completedOrders);
    const peakHours = calculatePeakHours(filteredOrders);
    const currentWaitTime = calculateCurrentWaitTime(pendingOrders);
    const efficiency = calculateKitchenEfficiency(completedOrders);
    
    setStats({
      totalOrders: filteredOrders.length,
      completedOrders: completedOrders.length,
      revenue: totalRevenue,
      avgPreparationTime: calculateAvgPreparationTime(completedOrders),
      popularItems: popularItems.slice(0, 5),
      currentWaitTime,
      efficiency,
      peakHours: peakHours.slice(0, 3)
    });
  };

  const filterOrdersByTimeRange = (ordersData) => {
    const now = new Date();
    switch (timeRange) {
      case 'today':
        const todayStart = new Date(now);
        todayStart.setHours(0, 0, 0, 0);
        return ordersData.filter(order => {
          const orderDate = order.orderTime?.toDate();
          return orderDate && orderDate >= todayStart;
        });
      case 'week':
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        return ordersData.filter(order => {
          const orderDate = order.orderTime?.toDate();
          return orderDate && orderDate >= weekAgo;
        });
      case 'month':
        const monthAgo = new Date(now);
        monthAgo.setMonth(now.getMonth() - 1);
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
    const itemRevenue = {};
    
    orders.forEach(order => {
      order.items?.forEach(item => {
        itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
        itemRevenue[item.name] = (itemRevenue[item.name] || 0) + (item.price * item.quantity);
      });
    });
    
    return Object.entries(itemCounts)
      .map(([name, count]) => ({ 
        name, 
        count,
        revenue: itemRevenue[name] || 0
      }))
      .sort((a, b) => b.count - a.count);
  };

  const calculatePeakHours = (orders) => {
    const hourCounts = {};
    
    orders.forEach(order => {
      const orderDate = order.orderTime?.toDate();
      if (orderDate) {
        const hour = orderDate.getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      }
    });
    
    return Object.entries(hourCounts)
      .map(([hour, count]) => ({ 
        hour: parseInt(hour), 
        count,
        label: `${hour}:00`
      }))
      .sort((a, b) => b.count - a.count);
  };

  const calculateCurrentWaitTime = (pendingOrders) => {
    if (pendingOrders.length === 0) return 0;
    
    const totalWaitTime = pendingOrders.reduce((sum, order) => {
      const orderTime = order.orderTime?.toDate();
      if (orderTime) {
        const waitTime = (new Date() - orderTime) / 60000; // minutes
        return sum + Math.min(waitTime, 60); // Cap at 60 minutes
      }
      return sum;
    }, 0);
    
    return Math.round(totalWaitTime / pendingOrders.length);
  };

  const calculateKitchenEfficiency = (completedOrders) => {
    if (completedOrders.length === 0) return 0;
    
    const onTimeOrders = completedOrders.filter(order => {
      const orderTime = order.orderTime?.toDate();
      const readyTime = order.estimatedReadyTime?.toDate();
      if (orderTime && readyTime) {
        const actualTime = (readyTime - orderTime) / 60000;
        const estimatedTime = order.estimatedPrepTime || 20; // Default 20 minutes
        return actualTime <= estimatedTime;
      }
      return false;
    });
    
    return Math.round((onTimeOrders.length / completedOrders.length) * 100);
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
    
    return Math.round(totalTime / validOrders.length / 60000);
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Force re-calculation
    calculateStats(orders);
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Custom progress bar component
  const ProgressBar = ({ percentage, color, height = 6 }) => (
    <View style={[styles.progressBarContainer, { height }]}>
      <View style={[styles.progressBar, { width: `${percentage}%`, backgroundColor: color }]} />
    </View>
  );

  // Status distribution data
  const statusData = [
    { 
      status: 'Completed', 
      count: stats.completedOrders, 
      color: '#28a745', 
      percentage: stats.totalOrders > 0 ? (stats.completedOrders / stats.totalOrders) * 100 : 0 
    },
    { 
      status: 'Preparing', 
      count: orders.filter(o => o.status === 'preparing').length, 
      color: '#17a2b8', 
      percentage: stats.totalOrders > 0 ? (orders.filter(o => o.status === 'preparing').length / stats.totalOrders) * 100 : 0 
    },
    { 
      status: 'Pending', 
      count: orders.filter(o => o.status === 'pending').length, 
      color: '#ffc107', 
      percentage: stats.totalOrders > 0 ? (orders.filter(o => o.status === 'pending').length / stats.totalOrders) * 100 : 0 
    },
    { 
      status: 'Ready', 
      count: orders.filter(o => o.status === 'ready').length, 
      color: '#6f42c1', 
      percentage: stats.totalOrders > 0 ? (orders.filter(o => o.status === 'ready').length / stats.totalOrders) * 100 : 0 
    },
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

      {/* Real-time Updates Banner */}
      {realTimeUpdates.length > 0 && (
        <View style={styles.realTimeBanner}>
          <MaterialIcons name="notifications" size={16} color="#fff" />
          <Text style={styles.realTimeText} numberOfLines={1}>
            {realTimeUpdates[0].message}
          </Text>
        </View>
      )}

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

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Live Kitchen Metrics */}
        <View style={styles.liveMetricsContainer}>
          <Text style={styles.sectionTitle}>Live Kitchen Metrics</Text>
          <View style={styles.liveMetricsGrid}>
            <Animated.View style={[styles.liveMetricCard, { transform: [{ scale: pulseAnim }] }]}>
              <MaterialIcons name="schedule" size={20} color="#dc3545" />
              <Text style={styles.liveMetricValue}>{stats.currentWaitTime}m</Text>
              <Text style={styles.liveMetricLabel}>Avg Wait Time</Text>
            </Animated.View>
            <View style={styles.liveMetricCard}>
              <MaterialIcons name="efficiency" size={20} color="#28a745" />
              <Text style={styles.liveMetricValue}>{stats.efficiency}%</Text>
              <Text style={styles.liveMetricLabel}>Efficiency</Text>
            </View>
            <View style={styles.liveMetricCard}>
              <MaterialIcons name="local-fire-department" size={20} color="#ff6b35" />
              <Text style={styles.liveMetricValue}>
                {orders.filter(o => ['pending', 'preparing'].includes(o.status)).length}
              </Text>
              <Text style={styles.liveMetricLabel}>Active Orders</Text>
            </View>
          </View>
        </View>

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
            <Text style={styles.statNumber}>{stats.avgPreparationTime}m</Text>
            <Text style={styles.statLabel}>Avg Prep Time</Text>
          </View>
        </View>

        {/* Order Status Distribution */}
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

        {/* Peak Hours */}
        {stats.peakHours.length > 0 && (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Peak Order Hours</Text>
            {stats.peakHours.map((peak, index) => {
              const maxCount = stats.peakHours[0]?.count || 1;
              const barWidth = (peak.count / maxCount) * 100;
              
              return (
                <View key={index} style={styles.peakHourItem}>
                  <Text style={styles.peakHourLabel}>{peak.label}</Text>
                  <View style={styles.peakHourBarContainer}>
                    <View style={[styles.peakHourBar, { width: `${barWidth}%` }]} />
                  </View>
                  <Text style={styles.peakHourCount}>{peak.count} orders</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Popular Items */}
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
                <Text style={styles.itemRevenue}>R{item.revenue.toFixed(2)}</Text>
              </View>
            );
          })}
        </View>

        {/* Real-time Activity Feed */}
        <View style={styles.activityContainer}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {orders.slice(0, 5).map((order) => (
            <View key={order.id} style={styles.activityItem}>
              <View style={styles.activityInfo}>
                <Text style={styles.activityOrder}>Order #{order.id.slice(-4)}</Text>
                <Text style={styles.activityItems}>
                  {order.items?.slice(0, 2).map(item => item.name).join(', ')}
                  {order.items?.length > 2 ? '...' : ''}
                </Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                <Text style={styles.statusBadgeText}>{order.status}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const getStatusColor = (status) => {
  switch (status) {
    case 'completed': return '#28a745';
    case 'preparing': return '#17a2b8';
    case 'ready': return '#6f42c1';
    case 'pending': return '#ffc107';
    default: return '#6c757d';
  }
};

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
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  realTimeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff6b35',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  realTimeText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    flex: 1,
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
  liveMetricsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  liveMetricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  liveMetricCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  liveMetricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 5,
  },
  liveMetricLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
    textAlign: 'center',
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
  peakHourItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  peakHourLabel: {
    width: 60,
    fontSize: 12,
    color: '#000',
  },
  peakHourBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  peakHourBar: {
    height: '100%',
    backgroundColor: '#ff6b35',
    borderRadius: 4,
  },
  peakHourCount: {
    fontSize: 12,
    color: '#666',
    width: 70,
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
  itemRevenue: {
    fontSize: 10,
    color: '#28a745',
    fontWeight: 'bold',
    marginTop: 2,
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
  activityContainer: {
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
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  activityInfo: {
    flex: 1,
  },
  activityOrder: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  activityItems: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
});