import { addDoc, collection, Timestamp } from "firebase/firestore";
import { useState } from "react";
import { Button, Image, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { db } from "../../firebase";

export default function PaymentScreen({ route, navigation }) {
  const cartItems = route.params?.cartItems || [];
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  const [card, setCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
  });

  const handleInputChange = (name, value) => setCard({ ...card, [name]: value });

  const handlePayment = async () => {
    try {
      const docRef = await addDoc(collection(db, "order"), {
        items: cartItems,
        total,
        status: "pending",
        createdAt: Timestamp.now(),
      });
      alert("Payment successful! Proceed to schedule pickup.");
      navigation.navigate("TimeScheduler", { orderId: docRef.id });
    } catch (error) {
      alert("Error saving order: " + error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Enter Card Details</Text>

      <TextInput
        style={styles.input}
        placeholder="Card Number (16 digits)"
        keyboardType="numeric"
        value={card.number}
        onChangeText={(text) => handleInputChange("number", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Card Holder Name"
        value={card.name}
        onChangeText={(text) => handleInputChange("name", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="MM/YY"
        value={card.expiry}
        onChangeText={(text) => handleInputChange("expiry", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="CVC"
        secureTextEntry
        keyboardType="numeric"
        value={card.cvc}
        onChangeText={(text) => handleInputChange("cvc", text)}
      />

      {/* Logos */}
      <View style={styles.logoRow}>
        <Image style={styles.logo} source={{ uri: "https://img.icons8.com/color/48/000000/visa.png" }} />
        <Image style={styles.logo} source={{ uri: "https://img.icons8.com/color/48/000000/mastercard.png" }} />
        <Image style={styles.logo} source={{ uri: "https://img.icons8.com/color/48/000000/paypal.png" }} />
      </View>

      <Button title={`Pay R${total}`} onPress={handlePayment} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
    alignItems: "center",
  },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 20 },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  logoRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  logo: { width: 50, height: 30, resizeMode: "contain" },
});
