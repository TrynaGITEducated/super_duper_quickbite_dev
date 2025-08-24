import { addDoc, collection, Timestamp } from "firebase/firestore";
import { useState } from "react";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import { Button, ScrollView, StyleSheet, View } from "react-native";
import { db } from "../../firebase";

export default function PaymentScreen({ route, navigation }) {
  const cartItems = route.params?.cartItems || [];
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  const [card, setCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
    focus: ""
  });

  const handleInputChange = (name, value) => setCard({ ...card, [name]: value });
  const handleInputFocus = (name) => setCard({ ...card, focus: name });

  const handlePayment = async () => {
    try {
      const docRef = await addDoc(collection(db, "orders"), {
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
      <Cards
        number={card.number}
        name={card.name}
        expiry={card.expiry}
        cvc={card.cvc}
        focused={card.focus}
        style={{ backgroundColor: "#ADD8E6" }} // light blue
      />

      <View style={styles.form}>
        <input
          type="text"
          name="number"
          placeholder="Card Number (13 digits)"
          value={card.number}
          onChange={(e) => handleInputChange("number", e.target.value)}
          onFocus={() => handleInputFocus("number")}
        />
        <input
          type="text"
          name="name"
          placeholder="Card Holder Name"
          value={card.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          onFocus={() => handleInputFocus("name")}
        />
        <input
          type="text"
          name="expiry"
          placeholder="MM/YY"
          value={card.expiry}
          onChange={(e) => handleInputChange("expiry", e.target.value)}
          onFocus={() => handleInputFocus("expiry")}
        />
        <input
          type="text"
          name="cvc"
          placeholder="CVC"
          value={card.cvc}
          onChange={(e) => handleInputChange("cvc", e.target.value)}
          onFocus={() => handleInputFocus("cvc")}
        />

        {/* Logos */}
        <div style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 10 }}>
          <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" />
          <img src="https://img.icons8.com/color/48/000000/mastercard.png" alt="Mastercard" />
          <img src="https://img.icons8.com/color/48/000000/paypal.png" alt="PayPal" />
          
        </div>

        <Button title={`Pay R${total}`} onPress={handlePayment} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#f8f8f8", alignItems: "center" },
  form: { width: "100%", marginTop: 20 },
});
