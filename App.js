import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Customer Screens
import CartScreen from './src/screens/CartScreen';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import MenuScreen from './src/screens/MenuScreen';
import OrderConfirmationScreen from './src/screens/OrderConfirmationScreen';
import OrderHistory from './src/screens/OrderHistory';
import OrderScreen from './src/screens/OrderScreen';
import PaymentOptions from './src/screens/PaymentOptions';
import PaymentScreen from './src/screens/PaymentScreen';
import PersonalDetails from './src/screens/PersonalDetails';
import ProfileScreen from './src/screens/ProfileScreen';
import RatingScreen from './src/screens/RatingScreen';
import RegistrationScreen from './src/screens/RegistrationScreen';
import TimeSchedulerScreen from './src/screens/TimeSchedulerScreen';
import TrackOrder from './src/screens/TrackOrder';

// Kitchen Admin Screens
import InventoryManagementScreen from './src/screens/InventoryManagementScreen';
import KitchenAnalyticsScreen from './src/screens/KitchenAnalyticsScreen';
import KitchenDashboard from './src/screens/KitchenDashboard';
import StaffLoginScreen from './src/screens/StaffLoginScreen';
import StaffRegistrationScreen from './src/screens/StaffRegistrationScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#1e90ff',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#ddd',
          height: 80,
          paddingBottom: 5,
          paddingTop: 5,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Menu"
        component={MenuScreen}
        options={{
          tabBarLabel: 'Menu',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="restaurant" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Order"
        component={OrderScreen}
        options={{
          tabBarLabel: 'Order',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="assignment" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="person" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function KitchenTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#ff6b35',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#ddd',
          height: 80,
          paddingBottom: 5,
          paddingTop: 5,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="KitchenDashboard"
        component={KitchenDashboard}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="dashboard" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="KitchenAnalytics"
        component={KitchenAnalyticsScreen}
        options={{
          tabBarLabel: 'Analytics',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="analytics" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Inventory"
        component={InventoryManagementScreen}
        options={{
          tabBarLabel: 'Inventory',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="inventory" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* Authentication Screens */}
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegistrationScreen} options={{ headerShown: false }} />
        <Stack.Screen name="StaffLogin" component={StaffLoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="StaffRegister" component={StaffRegistrationScreen} options={{ headerShown: false }} />
        
        {/* Customer Flow */}
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Menu" component={MenuScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
        <Stack.Screen name="TimeScheduler" component={TimeSchedulerScreen} />
        <Stack.Screen name="OrderStatus" component={OrderConfirmationScreen} />
        <Stack.Screen name="PersonalDetails" component={PersonalDetails} />
        <Stack.Screen name="PaymentOptions" component={PaymentOptions} />
        <Stack.Screen name="OrderHistory" component={OrderHistory} />
        <Stack.Screen name="TrackOrder" component={TrackOrder} />
        <Stack.Screen name="RatingScreen" component={RatingScreen} />
        
        {/* Kitchen Admin Flow */}
        <Stack.Screen name="Kitchen" component={KitchenTabs} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}