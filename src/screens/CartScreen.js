// import { useState } from "react";
// import { Button, FlatList, Text, View } from "react-native";

// export default function CartScreen({ navigation }) {
//   const [cartItems, setCartItems] = useState([
//     { id: "1", name: "Burger", price: 50 },
//     { id: "2", name: "Chips", price: 20 },
//   ]);

//   const total = cartItems.reduce((sum, item) => sum + item.price, 0);

//   return (
//     <View style={{ flex: 1, padding: 20 }}>
//       <Text style={{ fontSize: 20, fontWeight: "bold" }}>Your Cart</Text>

//       <FlatList
//         data={cartItems}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <Text style={{ fontSize: 16 }}>
//             {item.name} - R{item.price}
//           </Text>
//         )}
//       />

//       <Text style={{ marginVertical: 20, fontSize: 18 }}>
//         Total: R{total}
//       </Text>

//       <Button
//         title="Proceed to Schedule Pickup"
//         onPress={() => navigation.navigate("TimeScheduler")}
//       />
//     </View>
//   );
// }
import { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, Text, View } from "react-native";

export default function CartScreen({ route, navigation }) {
  // Use local state to manage cart items
  const [cartItems, setCartItems] = useState(route.params?.cartItems || []);

  // Update local state if route.params changes
  useEffect(() => {
    if (route.params?.cartItems) {
      setCartItems(route.params.cartItems);
    }
  }, [route.params?.cartItems]);

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  const clearCart = () => {
    setCartItems([]);
    alert("Cart cleared!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>

      {cartItems.length === 0 ? (
        <Text style={{ marginVertical: 20 }}>Your cart is empty.</Text>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Text style={styles.itemText}>
              {item.name} - R{item.price}
            </Text>
          )}
        />
      )}

      <Text style={styles.total}>Total: R{total}</Text>

      <Button
        title="Proceed to Schedule Pickup"
        onPress={() => navigation.navigate("TimeScheduler")}
        disabled={cartItems.length === 0}
      />

      <Button
        title="Proceed to Payment"
        onPress={() => navigation.navigate("Payment", { cartItems })}
        disabled={cartItems.length === 0}
      />

      <Button title="Clear Cart" onPress={clearCart} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 15 },
  itemText: { fontSize: 18, marginBottom: 5 },
  total: { fontSize: 20, fontWeight: "bold", marginVertical: 15 },
});
