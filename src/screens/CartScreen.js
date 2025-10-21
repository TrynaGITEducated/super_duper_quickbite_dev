import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
} from "react-native";

export default function CartScreen({ route, navigation }) {
  const [cartItems, setCartItems] = useState(route.params?.cartItems || []);

  useEffect(() => {
    if (route.params?.cartItems) {
      setCartItems(route.params.cartItems);
    }
  }, [route.params?.cartItems]);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const clearCart = () => {
    setCartItems([]);
    alert("Cart cleared!");
  };

  const updateQuantity = (itemId, change) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === itemId
            ? { ...item, quantity: Math.max(1, item.quantity + change) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (itemId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== itemId)
    );
  };

  const goToMenu = () => {
    navigation.navigate("Menu", {
      cartItems: cartItems,
      fromConfirmation: true,
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.cartCard}>
      <Image
        source={item.image}
        style={styles.itemImage}
        resizeMode="cover"
      />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.title}</Text>
        <Text style={styles.itemPrice}>R{item.price} each</Text>
        <Text style={styles.itemSubtotal}>
          Subtotal: R{(item.price * item.quantity).toFixed(2)}
        </Text>
        <View style={styles.quantityRow}>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => updateQuantity(item.id, -1)}
          >
            <Text style={styles.qtyText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.qtyValue}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => updateQuantity(item.id, 1)}
          >
            <Text style={styles.qtyText}>＋</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeItem(item.id)}
          >
            <Text style={styles.removeText}>×</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 Your Cart</Text>
      {cartItems.length === 0 ? (
        <View style={styles.emptyCart}>
          <Text style={styles.emptyText}>Your cart is empty.</Text>
          <TouchableOpacity style={styles.backButton} onPress={goToMenu}>
            <Text style={styles.backButtonText}>Back to Menu</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.totalText}>
            Total: <Text style={styles.totalAmount}>R{total.toFixed(2)}</Text>
          </Text>
          <View style={styles.footerButtons}>
            <TouchableOpacity style={styles.secondaryButton} onPress={goToMenu}>
              <Text style={styles.secondaryButtonText}>Continue Shopping</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() =>
                navigation.navigate("Payment", { cartItems, total })
              }
            >
              <Text style={styles.primaryButtonText}>Proceed to Payment</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dangerButton} onPress={clearCart}>
              <Text style={styles.dangerButtonText}>Clear Cart</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f0e6",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#d4a056",
    marginBottom: 20,
  },
  emptyCart: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: "#d4a056",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    elevation: 3,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  cartCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 3,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
    justifyContent: "space-between",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  itemPrice: {
    fontSize: 14,
    color: "#777",
  },
  itemSubtotal: {
    fontSize: 15,
    fontWeight: "600",
    color: "#d4a056",
    marginTop: 4,
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  qtyButton: {
    backgroundColor: "#f0f0f0",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
  },
  qtyText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  qtyValue: {
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 5,
    color: "#333",
  },
  removeButton: {
    backgroundColor: "#ff6b6b",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  removeText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 15,
    marginTop: 20,
  },
  totalText: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 15,
    color: "#333",
  },
  totalAmount: {
    color: "#d4a056",
    fontWeight: "bold",
  },
  footerButtons: {
    gap: 10,
  },
  primaryButton: {
    backgroundColor: "#d4a056",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d4a056",
    paddingVertical: 13,
    borderRadius: 30,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#d4a056",
    fontWeight: "600",
  },
  dangerButton: {
    backgroundColor: "#ff6b6b",
    paddingVertical: 13,
    borderRadius: 30,
    alignItems: "center",
  },
  dangerButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});