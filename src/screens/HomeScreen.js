// screens/HomeScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function HomeScreen({ navigation }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigateTo = (screenName) => {
    navigation.navigate(screenName);
    setIsMenuOpen(false);
  };

  return (
    <View style={styles.container}>
      {/* Header with Kebab Icon */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu}>
          <MaterialIcons name="menu" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo("Menu")}>
            <Text style={styles.menuText}>Menu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo("Order")}>
            <Text style={styles.menuText}>Order</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo("Profile")}>
            <Text style={styles.menuText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo("Login")}>
            <Text style={styles.menuText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Main Content */}
      <View style={styles.content}>
        <Image
          source={require("../../assets/images/quickbite-logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.welcomeText}>Welcome to QuickBite Cafeteria</Text>
        <TouchableOpacity
          style={styles.orderButton}
          onPress={() => navigateTo("Menu")}
        >
          <Text style={styles.orderButtonText}>Order now →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f0e6",
    paddingHorizontal: 6,
    paddingTop: 50,
    paddingBottom: 90,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 16,
    paddingTop: 0,
    paddingBottom: 10,
  },
  dropdownMenu: {
    position: "absolute",
    top: 80,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuText: {
    fontSize: 16,
    color: "#000",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  logo: {
    width: 200,
    height: 150,
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
    marginBottom: 20,
  },
  orderButton: {
    backgroundColor: "#d4a056",
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    maxWidth: 200,
    marginBottom: -20,
  },
  orderButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});