// import React from "react";
// import { View, Text, Button, StyleSheet } from "react-native";

// export default function PaymentScreen({ navigation }) {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Payment</Text>
//       <Text style={styles.text}>Proceed to pay for your order.</Text>

//       <Button
//         title="Complete Payment"
//         onPress={() => alert("Payment Successful!")}
//       />
//       <Button title="Back to Orders" onPress={() => navigation.goBack()} color="gray" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
//   title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
//   text: { fontSize: 18, marginBottom: 20 },
// });
// import { addDoc, collection, Timestamp } from "firebase/firestore";
// import { Button, StyleSheet, Text, View } from "react-native";
// import { db } from "../../firebase";

// export default function PaymentScreen({ route, navigation }) {
//   const cartItems = route.params?.cartItems || [];
//   const total = cartItems.reduce((sum, item) => sum + item.price, 0);

//   const handlePayment = async () => {
//     try {
//       // Save order to Firestore
//       await addDoc(collection(db, "orders"), {
//         items: cartItems,
//         total,
//         status: "pending",
//         createdAt: Timestamp.now(),
//       });

//       alert("Order placed successfully!");
//       navigation.navigate("Orders"); // go to Orders screen
//     } catch (error) {
//       alert("Error saving order: " + error.message);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Payment</Text>
//       <Text>Total: R{total}</Text>
//       <Button title="Confirm Payment & Place Order" onPress={handlePayment} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, justifyContent: "center" },
//   title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
// });
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
