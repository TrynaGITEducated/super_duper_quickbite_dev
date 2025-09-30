//===/====// // src/navigation/TabNavigator.js
//FOR DEBUGGING PURPOSES
//====================`

// import { Ionicons } from "@expo/vector-icons";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// import HomeScreen from "../../src/screens/HomeScreen";
// import MenuScreen from "../../src/screens/MenuScreen";
// import OrderScreen from "../../src/screens/OrderScreen";

// const Tab = createBottomTabNavigator();

// export default function TabNavigator() {
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
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import CartScreen from "./src/screens/CartScreen";
// import HomeScreen from "./src/screens/HomeScreen";
// import OrdersScreen from "./src/screens/OrderScreen";
// import PaymentScreen from "./src/screens/PaymentScreen";

// const Tab = createBottomTabNavigator();

// export default function TabNavigator() {
//   return (
//     <Tab.Navigator initialRouteName="Home">
//       <Tab.Screen name="Home" component={HomeScreen} />
//       <Tab.Screen name="Orders" component={OrdersScreen} />
//       <Tab.Screen name="Cart" component={CartScreen} />
//       <Tab.Screen name="Payment" component={PaymentScreen} />
//     </Tab.Navigator>
//   );
// }l
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import CartScreen from "./src/screens/CartScreen";
import HomeScreen from "./src/screens/HomeScreen";
import OrdersScreen from "./src/screens/OrderScreen";
import PaymentScreen from "./src/screens/PaymentScreen";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = "home";
          else if (route.name === "Order") iconName = "list";
          else if (route.name === "Cart") iconName = "cart";
          else if (route.name === "Payment") iconName = "card";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Order" component={OrdersScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Payment" component={PaymentScreen} />
    </Tab.Navigator>
  );
}
