// src/navigation/DrawerNavigator.js
import { createDrawerNavigator } from "@react-navigation/drawer";
import TabNavigator from "../../TabNavigator";
import AboutScreen from "../screens/AboutScreen";
import ProfileScreen from "../screens/ProfileScreen";
import RatingsScreen from "../screens/RatingsSecreen";
import SettingsScreen from "../screens/SettingsScreen";
import TimeSchedulerScreen from "../screens/TimeSchedulerScreen";

const Drawer = createDrawerNavigator();

export default function DrawerNavigation() {
  return (
    <Drawer.Navigator initialRouteName="MainTabs">
      <Drawer.Screen 
        name="MainTabs" 
        component={TabNavigator} 
        options={{ title: "Home" }} 
      />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="Rating" component={RatingsScreen} />
      <Drawer.Screen name="TimeScheduler" component={TimeSchedulerScreen} />
      <Drawer.Screen 
        name="About" 
        component={AboutScreen}
        options={{
          title: "About Us",
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="info" size={size} color={color} />
          )
        }}
      />
    </Drawer.Navigator>
  );
}