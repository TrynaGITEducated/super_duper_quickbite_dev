// import { Button, StyleSheet, Text, View } from "react-native";

// export default function HomeScreen({ navigation }) {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>Welcome to QuickBite 🍔</Text>
//       <Button title="Go to Login" onPress={() => navigation.navigate("Login")} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", alignItems: "center" },
//   text: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
// });
// import { Button, StyleSheet, Text, View } from "react-native";

// export default function HomeScreen({ navigation }) {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>Welcome to QuickBite 🍔</Text>

//       <Button title="Go to Login" onPress={() => navigation.navigate("Login")} />
//       <Button title="Open Menu" onPress={() => navigation.openDrawer()} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", alignItems: "center" },
//   text: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
// });
import React, { useState } from "react";
import { View, Text, Button, FlatList, StyleSheet } from "react-native";

export default function HomeScreen({ navigation }) {
  // Sample menu items
  const [menuItems] = useState([
    { id: "1", name: "Burger", price: 50 },
    { id: "2", name: "Pizza", price: 70 },
    { id: "3", name: "Fries", price: 20 },
  ]);

  // Simple cart state (could later use Context or Redux)
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart([...cart, item]);
    alert(`${item.name} added to cart!`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menu</Text>
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>
              {item.name} - R{item.price}
            </Text>
            <Button title="Add to Cart" onPress={() => addToCart(item)} />
          </View>
        )}
      />
      <Button
        title="Go to Cart"
        onPress={() => navigation.navigate("Cart", { cartItems: cart })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 15 },
  item: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  itemText: { fontSize: 18 },
});
