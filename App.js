// import React from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { Ionicons } from "@expo/vector-icons";

// import HomeScreen from "./src/screens/HomeScreen";
// import MenuScreen from "./src/screens/MenuScreen";
// import OrderScreen from "./src/screens/OrderScreen";
// import PaymentScreen from "./src/screens/PaymentScreen";
// import LoginScreen from "./src/screens/LoginScreen";

// const Tab = createBottomTabNavigator();
// const Stack = createNativeStackNavigator();

// // Tabs
// function TabNavigator() {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         headerShown: false,
//         tabBarIcon: ({ color, size }) => {
//           let iconName;
//           if (route.name === "Home") iconName = "home";
//           else if (route.name === "Orders") iconName = "list";
//           else if (route.name === "Menu") iconName = "restaurant";
//           return <Ionicons name={iconName} size={size} color={color} />;
//         },
//         tabBarActiveTintColor: "#007AFF",
//         tabBarInactiveTintColor: "gray",
//       })}
//     >
//       <Tab.Screen name="Home" component={HomeScreen} />
//       <Tab.Screen name="Orders" component={OrderScreen} />
//       <Tab.Screen name="Menu" component={MenuScreen} />
//     </Tab.Navigator>
//   );
// }

// // Main App
// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         <Stack.Screen
//           name="Main"
//           component={TabNavigator}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen name="Login" component={LoginScreen} />
//         <Stack.Screen name="Payment" component={PaymentScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// // }
// import { Ionicons } from "@expo/vector-icons";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { createDrawerNavigator } from "@react-navigation/drawer";
// import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";

// import HomeScreen from "./src/screens/HomeScreen";
// import LoginScreen from "./src/screens/LoginScreen";
// import MenuScreen from "./src/screens/MenuScreen";
// import OrderScreen from "./src/screens/OrderScreen";
// import PaymentScreen from "./src/screens/PaymentScreen";
// import ProfileScreen from "./src/screens/ProfileScreen";
// import RegistrationScreen from "./src/screens/RegistrationScreen";
// import SettingsScreen from "./src/screens/SettingsScreen";
// const Tab = createBottomTabNavigator();
// const Stack = createNativeStackNavigator();
// const Drawer = createDrawerNavigator();

// // ---- Bottom Tabs ----
// function TabNavigator() {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         headerShown: false,
//         tabBarIcon: ({ color, size }) => {
//           let iconName;
//           if (route.name === "Home") iconName = "home";
//           else if (route.name === "Orders") iconName = "list";
//           else if (route.name === "Menu") iconName = "restaurant";
//           return <Ionicons name={iconName} size={size} color={color} />;
//         },
//         tabBarActiveTintColor: "#007AFF",
//         tabBarInactiveTintColor: "gray",
//       })}
//     >
//       <Tab.Screen name="Home" component={HomeScreen} />
//       <Tab.Screen name="Orders" component={OrderScreen} />
//       <Tab.Screen name="Menu" component={MenuScreen} />
//     </Tab.Navigator>
//   );
// }

// // ---- Drawer Navigator ----
// function DrawerNavigator() {
//   return (
//     <Drawer.Navigator
//       screenOptions={{ headerShown: false }}
//       initialRouteName="Tabs"
//     >
//       <Drawer.Screen name="Tabs" component={TabNavigator} />
//       <Drawer.Screen name="Profile" component={ProfileScreen} />
//       <Drawer.Screen name="Settings" component={SettingsScreen} />
//       <Drawer.Screen
//         name="Logout"
//         component={HomeScreen} // placeholder, we’ll handle logout
//         options={{
//           drawerLabel: "Logout",
//         }}
//         listeners={({ navigation }) => ({
//           drawerItemPress: (e) => {
//             e.preventDefault();
//             // Perform logout logic here
//             alert("Logged out!");
//             navigation.closeDrawer();
//           },
//         })}
//       />
//     </Drawer.Navigator>
//   );
// }

// // ---- Main App ----
// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         <Stack.Screen
//           name="Main"
//           component={DrawerNavigator}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen name="Login" component={LoginScreen} />
//         <Stack.Screen
//           name="Register"
//           component={RegistrationScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen name="Payment" component={PaymentScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import DrawerNavigator from "./src/navigation/DrawerNavigator";
import LoginScreen from "./src/screens/LoginScreen";
import PaymentScreen from "./src/screens/PaymentScreen";
import RegistrationScreen from "./src/screens/RegistrationScreen";
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen
          name="Register"
          component={RegistrationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={DrawerNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Payment" component={PaymentScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
