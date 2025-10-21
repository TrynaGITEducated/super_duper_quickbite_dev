// import { MaterialIcons } from "@expo/vector-icons";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

// // Customer Screens
// import AboutScreen from "./src/screens/AboutScreen";
// import CartScreen from "./src/screens/CartScreen";
// import EmailVerificationScreen from "./src/screens/EmailVerificationScreen";
// import HomeScreen from "./src/screens/HomeScreen";
// import LoginScreen from "./src/screens/LoginScreen";
// import MenuScreen from "./src/screens/MenuScreen";
// import OrderConfirmationScreen from "./src/screens/OrderConfirmationScreen";
// import OrderScreen from "./src/screens/OrderScreen";
// import PaymentScreen from "./src/screens/PaymentScreen";
// import ProfileScreen from "./src/screens/ProfileScreen";
// import RegistrationScreen from "./src/screens/RegistrationScreen";
// import TimeSchedulerScreen from "./src/screens/TimeSchedulerScreen";
// // Kitchen Admin Screens
// import InventoryManagementScreen from "./src/screens/InventoryManagementScreen";
// import KitchenAnalyticsScreen from "./src/screens/KitchenAnalyticsScreen";
// import KitchenDashboard from "./src/screens/KitchenDashboard";
// import KitchenOrderScreen from "./src/screens/KitchenOrderScreen";
// import OrderTrackingScreen from "./src/screens/OrderTrackingScreen";
// import StaffLoginScreen from "./src/screens/StaffLoginScreen";
// import StaffRegistrationScreen from "./src/screens/StaffRegistrationScreen";
// const Tab = createBottomTabNavigator();
// const Stack = createNativeStackNavigator();

// function MainTabs() {
//   return (
//     <Tab.Navigator
//       screenOptions={{
//         tabBarActiveTintColor: "#1e90ff",
//         tabBarInactiveTintColor: "#888",
//         tabBarStyle: {
//           backgroundColor: "#fff",
//           borderTopWidth: 1,
//           borderTopColor: "#ddd",
//           height: 80,
//           paddingBottom: 5,
//           paddingTop: 5,
//         },
//         headerShown: false,
//       }}
//     >
//       <Tab.Screen
//         name="Home"
//         component={HomeScreen}
//         options={{
//           tabBarLabel: "Home",
//           tabBarIcon: ({ color }) => (
//             <MaterialIcons name="home" size={24} color={color} />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Menu"
//         component={MenuScreen}
//         options={{
//           tabBarLabel: "Menu",
//           tabBarIcon: ({ color }) => (
//             <MaterialIcons name="restaurant" size={24} color={color} />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Order"
//         component={OrderScreen}
//         options={{
//           tabBarLabel: "Order",
//           tabBarIcon: ({ color }) => (
//             <MaterialIcons name="assignment" size={24} color={color} />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Profile"
//         component={ProfileScreen}
//         options={{
//           tabBarLabel: "Profile",
//           tabBarIcon: ({ color }) => (
//             <MaterialIcons name="person" size={24} color={color} />
//           ),
//         }}
//       />
//     </Tab.Navigator>
//   );
// }

// function KitchenTabs() {
//   return (
//     <Tab.Navigator
//       screenOptions={{
//         tabBarActiveTintColor: "#ff6b35",
//         tabBarInactiveTintColor: "#888",
//         tabBarStyle: {
//           backgroundColor: "#fff",
//           borderTopWidth: 1,
//           borderTopColor: "#ddd",
//           height: 80,
//           paddingBottom: 5,
//           paddingTop: 5,
//         },
//         headerShown: false,
//       }}
//     >
//       <Tab.Screen
//         name="KitchenDashboard"
//         component={KitchenDashboard}
//         options={{
//           tabBarLabel: "Dashboard",
//           tabBarIcon: ({ color }) => (
//             <MaterialIcons name="dashboard" size={24} color={color} />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="KitchenAnalytics"
//         component={KitchenAnalyticsScreen}
//         options={{
//           tabBarLabel: "Analytics",
//           tabBarIcon: ({ color }) => (
//             <MaterialIcons name="analytics" size={24} color={color} />
//           ),
//         }}
//       />
//       <Tab.Screen name="KitchenOrders" component={KitchenOrderScreen} />
//       <Tab.Screen
//         name="Inventory"
//         component={InventoryManagementScreen}
//         options={{
//           tabBarLabel: "Inventory",
//           tabBarIcon: ({ color }) => (
//             <MaterialIcons name="inventory" size={24} color={color} />
//           ),
//         }}
//       />
//     </Tab.Navigator>
//   );
// }
// const registerUser = async (email, password, userData) => {
//   try {
//     // Create user
//     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//     const user = userCredential.user;

//     // Store additional user data in Firestore
//     await setDoc(doc(db, "users", user.uid), {
//       email: email,
//       campus: userData.campus,
//       faculty: userData.faculty,
//       userType: userData.userType,
//       createdAt: new Date(),
//       emailVerified: false,
//       accountStatus: "pending"
//     });

//     // Send Firebase verification email (will use your custom template)
//     await sendEmailVerification(user);

//     // Navigate to verification screen
//     navigation.navigate('EmailVerification', {
//       email: email,
//       campus: userData.campus,
//       faculty: userData.faculty, 
//       userType: userType,
//       userId: user.uid
//     });

//   } catch (error) {
//     console.error('Registration error:', error);
//     throw error;
//   }
// };
// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Login">
//         {/* Authentication Screens */}
//         <Stack.Screen
//           name="Login"
//           component={LoginScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="Register"
//           component={RegistrationScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="StaffLogin"
//           component={StaffLoginScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="StaffRegister"
//           component={StaffRegistrationScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="EmailVerification"
//           component={EmailVerificationScreen}
//           options={{ headerShown: false }}
//         />
//         {/* Customer Flow */}
//         <Stack.Screen
//           name="Main"
//           component={MainTabs}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="Menu"
//           component={MenuScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen name="Cart" component={CartScreen} />
//         <Stack.Screen name="Payment" component={PaymentScreen} />
//         <Stack.Screen name="TimeScheduler" component={TimeSchedulerScreen} />
//         <Stack.Screen name="OrderStatus" component={OrderConfirmationScreen} />
//         <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />

//         {/* About Screen */}
//         <Stack.Screen
//           name="About"
//           component={AboutScreen}
//           options={{
//             title: "About QuickBite",
//             headerStyle: {
//               backgroundColor: "#1e90ff",
//             },
//             headerTintColor: "#fff",
//             headerTitleStyle: {
//               fontWeight: "bold",
//             },
//           }}
//         />

//         {/* Kitchen Admin Flow */}
//         <Stack.Screen
//           name="Kitchen"
//           component={KitchenTabs}
//           options={{ headerShown: false }}
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }
import { MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Customer Screens
import AboutScreen from './src/screens/AboutScreen';
import CartScreen from './src/screens/CartScreen';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import MenuScreen from './src/screens/MenuScreen';
import OrderConfirmationScreen from './src/screens/OrderConfirmationScreen';
import OrderScreen from './src/screens/OrderScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import RegistrationScreen from './src/screens/RegistrationScreen';
import TimeSchedulerScreen from './src/screens/TimeSchedulerScreen';

// Kitchen Admin Screens
import InventoryManagementScreen from "./src/screens/InventoryManagementScreen";
import KitchenAnalyticsScreen from "./src/screens/KitchenAnalyticsScreen";
import KitchenDashboard from "./src/screens/KitchenDashboard";
import KitchenOrderScreen from "./src/screens/KitchenOrderScreen";
import OrderTrackingScreen from "./src/screens/OrderTrackingScreen";
import StaffLoginScreen from "./src/screens/StaffLoginScreen";
import StaffRegistrationScreen from "./src/screens/StaffRegistrationScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#1e90ff",
        tabBarInactiveTintColor: "#888",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#ddd",
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
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Menu"
        component={MenuScreen}
        options={{
          tabBarLabel: "Menu",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="restaurant" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Order"
        component={OrderScreen}
        options={{
          tabBarLabel: "Order",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="assignment" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
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
        tabBarActiveTintColor: "#ff6b35",
        tabBarInactiveTintColor: "#888",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#ddd",
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
          tabBarLabel: "Dashboard",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="dashboard" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="KitchenAnalytics"
        component={KitchenAnalyticsScreen}
        options={{
          tabBarLabel: "Analytics",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="analytics" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="KitchenOrders" 
        component={KitchenOrderScreen}
        options={{
          tabBarLabel: "Orders",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="list-alt" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Inventory"
        component={InventoryManagementScreen}
        options={{
          tabBarLabel: "Inventory",
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
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegistrationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="StaffLogin"
          component={StaffLoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="StaffRegister"
          component={StaffRegistrationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EmailVerification"
          component={EmailVerificationScreen}
          options={{ headerShown: false }}
        />
        
        {/* Customer Flow */}
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Menu"
          component={MenuScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
        <Stack.Screen name="TimeScheduler" component={TimeSchedulerScreen} />
        <Stack.Screen name="OrderStatus" component={OrderConfirmationScreen} />
        
        {/* About Screen */}
        <Stack.Screen 
          name="About" 
          component={AboutScreen}
          options={{ 
            title: 'About QuickBite',
            headerStyle: {
              backgroundColor: '#1e90ff',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }} 
        />
        
        {/* Kitchen Admin Flow */}
        <Stack.Screen
          name="Kitchen"
          component={KitchenTabs}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}