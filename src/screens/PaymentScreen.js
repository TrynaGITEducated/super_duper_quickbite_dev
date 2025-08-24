
import { useState } from "react";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";

export default function PaymentPage() {
  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
    focus: ""
  });

  const handleInputChange = (e) => {
    setCardData({ ...cardData, [e.target.name]: e.target.value });
  };

  const handleInputFocus = (e) => {
    setCardData({ ...cardData, focus: e.target.name });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Payment Submitted ✅");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      {}
      <Cards
        number={cardData.number}
        name={cardData.name}
        expiry={cardData.expiry}
        cvc={cardData.cvc}
        focused={cardData.focus}
      />

      {}
      <form onSubmit={handleSubmit} className="mt-6 w-80 space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Card Holder Name"
          value={cardData.name}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className="border p-2 rounded w-full"
        />

        <input
          type="tel"
          name="number"
          placeholder="Card Number"
          value={cardData.number}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className="border p-2 rounded w-full"
        />

        <input
          type="tel"
          name="expiry"
          placeholder="MM/YY"
          value={cardData.expiry}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className="border p-2 rounded w-full"
        />

        <input
          type="tel"
          name="cvc"
          placeholder="CVV"
          value={cardData.cvc}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className="border p-2 rounded w-full"
        />

        {}
        <div className="flex justify-between mt-2">
          <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" />
          <img src="https://img.icons8.com/color/48/000000/mastercard.png" alt="Mastercard" />
          <img src="https://img.icons8.com/color/48/000000/paypal.png" alt="PayPal" />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded w-full mt-4 hover:bg-blue-700"
        >
          Pay Now
        </button>
      </form>
    </div>
  );
}



import { addDoc, collection, Timestamp } from "firebase/firestore";
import { Button, StyleSheet, Text, View } from "react-native";
import { db } from "../../firebase";

export default function PaymentScreen({ route, navigation }) {
  const cartItems = route.params?.cartItems || [];
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handlePayment = async () => {
    try {
      // Save order to Firestore
      const docRef = await addDoc(collection(db, "orders"), {
        items: cartItems,
        total,
        status: "pending",
        createdAt: Timestamp.now(),
      });

      alert("Payment successful! Proceed to schedule pickup.");

      // Navigate to TimeScheduler with orderId
      navigation.navigate("TimeScheduler", { orderId: docRef.id });

    } catch (error) {
      alert("Error saving order: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment</Text>
      <Text>Total: R{total}</Text>
      <Button title="Confirm Payment & Place Order" onPress={handlePayment} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
});
