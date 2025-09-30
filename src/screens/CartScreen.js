// import { useEffect, useState } from "react";
import { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CartScreen({ route, navigation }) {
  const [cartItems, setCartItems] = useState(route.params?.cartItems || []);

  useEffect(() => {
    if (route.params?.cartItems) {
      setCartItems(route.params.cartItems);
    }
  }, [route.params?.cartItems]);

  // Fix: Calculate total based on quantity and price
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const clearCart = () => {
    setCartItems([]);
    alert("Cart cleared!");
  };

  const updateQuantity = (itemId, change) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId 
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      ).filter(item => item.quantity > 0) // Remove items with 0 quantity
    );
  };

  const removeItem = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const goToMenu = () => {
    // Pass cart items back to Menu screen to preserve state
    navigation.navigate("Menu", { 
      cartItems: cartItems,
      fromConfirmation: true 
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>

      {cartItems.length === 0 ? (
        <View style={styles.emptyCart}>
          <Text style={styles.emptyText}>Your cart is empty.</Text>
          <Button 
            title="Back to Menu" 
            onPress={() => navigation.navigate("Menu")} 
          />
        </View>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.cartItem}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>R{item.price} x {item.quantity}</Text>
                <Text style={styles.itemTotal}>R{(item.price * item.quantity).toFixed(2)}</Text>
              </View>
              <View style={styles.quantityControls}>
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item.id, -1)}
                >
                  <Text style={styles.quantityText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item.id, 1)}
                >
                  <Text style={styles.quantityText}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => removeItem(item.id)}
                >
                  <Text style={styles.removeText}>×</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.total}>Total: R{total.toFixed(2)}</Text>
          
          <View style={styles.buttonContainer}>
            <Button
              title="Continue Shopping"
              onPress={goToMenu}
              color="#d4a056"
            />
            
            <Button
              title="Proceed to Payment"
              onPress={() => navigation.navigate("Payment", { 
                cartItems,
                total 
              })}
            />

            <Button 
              title="Clear Cart" 
              onPress={clearCart} 
              color="red" 
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20,
    backgroundColor: '#f5f0e6'
  },
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 15,
    textAlign: 'center'
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: { 
    fontSize: 18, 
    marginBottom: 20,
    color: '#666'
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2
  },
  itemInfo: {
    flex: 1
  },
  itemName: { 
    fontSize: 16, 
    fontWeight: 'bold',
    marginBottom: 5
  },
  itemPrice: { 
    fontSize: 14, 
    color: '#666',
    marginBottom: 2
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d4a056'
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  quantityButton: {
    backgroundColor: '#f0f0f0',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  quantity: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10
  },
  removeButton: {
    backgroundColor: '#ff6b6b',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10
  },
  removeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 15,
    marginTop: 15
  },
  total: { 
    fontSize: 20, 
    fontWeight: "bold", 
    marginVertical: 15,
    textAlign: 'center'
  },
  buttonContainer: {
    gap: 10
  }
});
// import { Button, FlatList, StyleSheet, Text, View } from "react-native";

// export default function CartScreen({ route, navigation }) {
//   // Use local state to manage cart items
//   const [cartItems, setCartItems] = useState(route.params?.cartItems || []);

//   // Update local state if route.params changes
//   useEffect(() => {
//     if (route.params?.cartItems) {
//       setCartItems(route.params.cartItems);
//     }
//   }, [route.params?.cartItems]);

//   const total = cartItems.reduce((sum, item) => sum + item.price, 0);

//   const clearCart = () => {
//     setCartItems([]);
//     alert("Cart cleared!");
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Your Cart</Text>

//       {cartItems.length === 0 ? (
//         <Text style={{ marginVertical: 20 }}>Your cart is empty.</Text>
//       ) : (
//         <FlatList
//           data={cartItems}
//           keyExtractor={(item, index) => index.toString()}
//           renderItem={({ item }) => (
//             <Text style={styles.itemText}>
//               {item.name} - R{item.price}
//             </Text>
//           )}
//         />
//       )}

//       <Text style={styles.total}>Total: R{total}</Text>

//       {/* <Button
//         title="Proceed to Schedule Pickup"
//         onPress={() => navigation.navigate("TimeScheduler")}
//         disabled={cartItems.length === 0}
//       /> */}
//       <Button
//         title="Proceed to Payment"
//         onPress={() => navigation.navigate("Payment", { cartItems })}
//         disabled={cartItems.length === 0}
//       />

//       <Button title="Clear Cart" onPress={clearCart} color="red" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20 },
//   title: { fontSize: 24, fontWeight: "bold", marginBottom: 15 },
//   itemText: { fontSize: 18, marginBottom: 5 },
//   total: { fontSize: 20, fontWeight: "bold", marginVertical: 15 },
// });
