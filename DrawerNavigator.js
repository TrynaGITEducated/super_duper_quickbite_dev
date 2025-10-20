// // src/navigation/DrawerNavigator.js
// import { createDrawerNavigator } from "@react-navigation/drawer";
// import { Alert } from "react-native";

// import TabNavigator from "../../TabNavigator"; // Your bottom tabs
// //import SettingsScreen from "./src/screens/SettingsScreen";
// import SettingsScreen from "../../src/screens/SettingsScreen";
// import ProfileScreen from "../../src/screens/ProfileScreen";
// const Drawer = createDrawerNavigator();

// export default function DrawerNavigator() {
//   return (
//     <Drawer.Navigator
//       initialRouteName="Tabs"
//       screenOptions={{ headerShown: false }}
//     >
//       <Drawer.Screen name="Tabs" component={TabNavigator} />
//       <Drawer.Screen name="Profile" component={ProfileScreen} />
//       <Drawer.Screen name="Settings" component={SettingsScreen} />
//       <Drawer.Screen
//         name="Logout"
//         component={HomeScreen} // placeholder
//         options={{ drawerLabel: "Logout" }}
//         listeners={({ navigation }) => ({
//           drawerItemPress: (e) => {
//             e.preventDefault();
//             // Perform logout logic here
//             Alert.alert("Logged out!");
//             navigation.closeDrawer();
//           },
//         })}
//       />
//     </Drawer.Navigator>
//   );
// }
import { createDrawerNavigator } from "@react-navigation/drawer";
import TabNavigator from "../../TabNavigator";
import ProfileScreen from "../screens/ProfileScreen";
import RatingsScreen from "../screens/RatingsSecreen";
import SettingsScreen from "../screens/SettingsScreen";
import TimeSchedulerScreen from "../screens/TimeSchedulerScreen";
const Drawer = createDrawerNavigator();

export default function DrawerNavigation() {
  return (
    <Drawer.Navigator initialRouteName="MainTabs">
      <Drawer.Screen name="MainTabs" component={TabNavigator} options={{ title: "Home" }} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="Rating" component={RatingsScreen} />
      <Drawer.Screen name="TimeScheduler" component={TimeSchedulerScreen} />
    </Drawer.Navigator>
  );
}
