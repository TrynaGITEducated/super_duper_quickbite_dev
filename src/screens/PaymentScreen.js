// import { addDoc, collection, Timestamp } from "firebase/firestore";
// import { useState } from "react";
// import { Button, Image, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
// import { db } from "../../firebase";

// export default function PaymentScreen({ route, navigation }) {
//   const cartItems = route.params?.cartItems || [];
//   const total = cartItems.reduce((sum, item) => sum + item.price, 0);

//   const [card, setCard] = useState({
//     number: "",
//     name: "",
//     expiry: "",
//     cvc: "",
//   });

//   const handleInputChange = (name, value) => setCard({ ...card, [name]: value });

//   const handlePayment = async () => {
//     try {
//       const docRef = await addDoc(collection(db, "order"), {
//         items: cartItems,
//         total,
//         status: "pending",
//         createdAt: Timestamp.now(),
//       });
//       alert("Payment successful! Proceed to schedule pickup.");
//       navigation.navigate("TimeScheduler", { orderId: docRef.id });
//     } catch (error) {
//       alert("Error saving order: " + error.message);
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>Enter Card Details</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Card Number (16 digits)"
//         keyboardType="numeric"
//         value={card.number}
//         onChangeText={(text) => handleInputChange("number", text)}
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Card Holder Name"
//         value={card.name}
//         onChangeText={(text) => handleInputChange("name", text)}
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="MM/YY"
//         value={card.expiry}
//         onChangeText={(text) => handleInputChange("expiry", text)}
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="CVC"
//         secureTextEntry
//         keyboardType="numeric"
//         value={card.cvc}
//         onChangeText={(text) => handleInputChange("cvc", text)}
//       />

//       {/* Logos */}
//       <View style={styles.logoRow}>
//         <Image style={styles.logo} source={{ uri: "https://img.icons8.com/color/48/000000/visa.png" }} />
//         <Image style={styles.logo} source={{ uri: "https://img.icons8.com/color/48/000000/mastercard.png" }} />
//         <Image style={styles.logo} source={{ uri: "https://img.icons8.com/color/48/000000/paypal.png" }} />
//       </View>

//       <Button title={`Pay R${total}`} onPress={handlePayment} />
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     padding: 20,
//     backgroundColor: "#f8f8f8",
//     alignItems: "center",
//   },
//   title: { fontSize: 18, fontWeight: "bold", marginBottom: 20 },
//   input: {
//     width: "100%",
//     borderWidth: 1,
//     borderColor: "#ccc",
//     padding: 10,
//     marginBottom: 15,
//     borderRadius: 8,
//     backgroundColor: "#fff",
//   },
//   logoRow: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     width: "100%",
//     marginBottom: 20,
//   },
//   logo: { width: 50, height: 30, resizeMode: "contain" },
// });
import { addDoc, collection, doc, updateDoc, Timestamp } from "firebase/firestore";
import { useState } from "react";
import {
  Alert,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator
} from "react-native";
import { db } from "../../firebase";

// Stripe test card numbers for simulation
const TEST_CARDS = {
  visa: "4242424242424242",
  mastercard: "5555555555554444",
  amex: "378282246310005",
  decline: "4000000000000002"
};

export default function PaymentScreen({ route, navigation }) {
  const cartItems = route.params?.cartItems || [];
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const [loading, setLoading] = useState(false);
  const [card, setCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
  });

  const handleInputChange = (name, value) => {
    let formattedValue = value;
    
    // Format card number with spaces
    if (name === 'number') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) formattedValue = formattedValue.substring(0, 19);
    }
    
    // Format expiry date
    if (name === 'expiry') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.substring(0, 2) + '/' + formattedValue.substring(2, 4);
      }
      if (formattedValue.length > 5) formattedValue = formattedValue.substring(0, 5);
    }
    
    // Format CVC (max 4 digits)
    if (name === 'cvc') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
    }
    
    setCard({ ...card, [name]: formattedValue });
  };

  const validateCard = () => {
    // Basic validation
    const cardNumber = card.number.replace(/\s/g, '');
    const expiry = card.expiry.split('/');
    
    if (cardNumber.length !== 16) {
      Alert.alert("Invalid Card", "Please enter a valid 16-digit card number");
      return false;
    }
    
    if (!card.name.trim()) {
      Alert.alert("Invalid Card", "Please enter cardholder name");
      return false;
    }
    
    if (card.expiry.length !== 5 || expiry.length !== 2) {
      Alert.alert("Invalid Card", "Please enter expiry date in MM/YY format");
      return false;
    }
    
    if (card.cvc.length < 3) {
      Alert.alert("Invalid Card", "Please enter a valid CVC");
      return false;
    }
    
    return true;
  };

  const simulatePayment = async (cardNumber) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check for test card scenarios
    if (cardNumber === TEST_CARDS.decline) {
      throw new Error("Your card was declined. Please try a different card.");
    }
    
    if (cardNumber === "4000000000000069") {
      throw new Error("Expired card. Please use a different card.");
    }
    
    // Simulate random failures (5% chance)
    if (Math.random() < 0.05) {
      throw new Error("Payment processing failed. Please try again.");
    }
    
    return {
      success: true,
      transactionId: 'txn_' + Math.random().toString(36).substr(2, 9),
      amount: total
    };
  };

  const handlePayment = async () => {
    if (!validateCard()) return;
    
    setLoading(true);
    
    try {
      const cardNumber = card.number.replace(/\s/g, '');
      
      // Simulate payment processing
      const paymentResult = await simulatePayment(cardNumber);
      
      if (paymentResult.success) {
        // Save order to Firestore
        const docRef = await addDoc(collection(db, "orders"), {
          items: cartItems,
          total,
          status: "paid",
          paymentStatus: "completed",
          transactionId: paymentResult.transactionId,
          paymentMethod: "card",
          cardLast4: cardNumber.slice(-4),
          customerName: card.name,
          createdAt: Timestamp.now(),
          estimatedReadyTime: null // Will be set in scheduler
        });

        // Clear cart after successful payment
        if (route.params?.clearCart) {
          route.params.clearCart();
        }

        Alert.alert(
          "Payment Successful!",
          `Your payment of R${total} has been processed successfully.`,
          [
            {
              text: "Schedule Pickup",
              onPress: () => navigation.navigate("TimeScheduler", { 
                orderId: docRef.id,
                cartItems 
              })
            }
          ]
        );
      }
    } catch (error) {
      Alert.alert("Payment Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  const fillTestCard = (type) => {
    const testCards = {
      visa: {
        number: TEST_CARDS.visa,
        name: "Test User",
        expiry: "12/28",
        cvc: "123"
      },
      mastercard: {
        number: TEST_CARDS.mastercard,
        name: "Test User", 
        expiry: "12/28",
        cvc: "123"
      },
      amex: {
        number: TEST_CARDS.amex,
        name: "Test User",
        expiry: "12/28", 
        cvc: "1234"
      },
      decline: {
        number: TEST_CARDS.decline,
        name: "Test User",
        expiry: "12/28",
        cvc: "123"
      }
    };
    
    setCard(testCards[type]);
  };

  const getCardType = (number) => {
    const cleaned = number.replace(/\s/g, '');
    if (/^4/.test(cleaned)) return "Visa";
    if (/^5[1-5]/.test(cleaned)) return "Mastercard";
    if (/^3[47]/.test(cleaned)) return "American Express";
    return "Card";
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Payment Details</Text>
      
      {/* Order Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Order Summary</Text>
        {cartItems.map((item, index) => (
          <View key={index} style={styles.summaryItem}>
            <Text style={styles.itemName}>{item.name} x {item.quantity}</Text>
            <Text style={styles.itemPrice}>R{(item.price * item.quantity).toFixed(2)}</Text>
          </View>
        ))}
        <View style={styles.totalRow}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalAmount}>R{total.toFixed(2)}</Text>
        </View>
      </View>

      {/* Test Card Buttons */}
      <View style={styles.testCardSection}>
        <Text style={styles.testCardTitle}>Test Cards (Click to auto-fill):</Text>
        <View style={styles.testCardButtons}>
          <TouchableOpacity 
            style={[styles.testCardBtn, styles.visaBtn]}
            onPress={() => fillTestCard('visa')}
          >
            <Text style={styles.testCardBtnText}>Visa</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.testCardBtn, styles.mastercardBtn]}
            onPress={() => fillTestCard('mastercard')}
          >
            <Text style={styles.testCardBtnText}>Mastercard</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.testCardBtn, styles.amexBtn]}
            onPress={() => fillTestCard('amex')}
          >
            <Text style={styles.testCardBtnText}>Amex</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.testCardBtn, styles.declineBtn]}
            onPress={() => fillTestCard('decline')}
          >
            <Text style={styles.testCardBtnText}>Decline</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Card Details Form */}
      <View style={styles.formCard}>
        <TextInput
          style={styles.input}
          placeholder="Card Number"
          keyboardType="numeric"
          value={card.number}
          onChangeText={(text) => handleInputChange("number", text)}
          maxLength={19}
        />
        {card.number.length > 0 && (
          <Text style={styles.cardType}>
            {getCardType(card.number)}
          </Text>
        )}

        <TextInput
          style={styles.input}
          placeholder="Cardholder Name"
          value={card.name}
          onChangeText={(text) => handleInputChange("name", text)}
          autoCapitalize="words"
        />

        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="MM/YY"
            value={card.expiry}
            onChangeText={(text) => handleInputChange("expiry", text)}
            maxLength={5}
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="CVC"
            secureTextEntry
            keyboardType="numeric"
            value={card.cvc}
            onChangeText={(text) => handleInputChange("cvc", text)}
            maxLength={4}
          />
        </View>

        {/* Payment Logos */}
        <View style={styles.logoRow}>
          <Image style={styles.logo} source={{ uri: "https://img.icons8.com/color/48/000000/visa.png" }} />
          <Image style={styles.logo} source={{ uri: "https://img.icons8.com/color/48/000000/mastercard.png" }} />
          <Image style={styles.logo} source={{ uri: "https://img.icons8.com/color/48/000000/american-express.png" }} />
        </View>

        {/* Payment Button */}
        <TouchableOpacity 
          style={[styles.payButton, loading && styles.payButtonDisabled]}
          onPress={handlePayment}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.payButtonText}>
              Pay R{total.toFixed(2)}
            </Text>
          )}
        </TouchableOpacity>
        
        <Text style={styles.securityText}>
          🔒 Your payment details are secure and encrypted
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  summaryCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  itemName: {
    fontSize: 14,
    color: "#666",
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  totalText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ff6b35",
  },
  testCardSection: {
    marginBottom: 20,
  },
  testCardTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
    textAlign: "center",
  },
  testCardButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },
  testCardBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 80,
  },
  visaBtn: {
    backgroundColor: "#1a1f71",
  },
  mastercardBtn: {
    backgroundColor: "#eb001b",
  },
  amexBtn: {
    backgroundColor: "#2e77bc",
  },
  declineBtn: {
    backgroundColor: "#dc3545",
  },
  testCardBtnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  formCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  halfInput: {
    flex: 1,
    marginHorizontal: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardType: {
    position: "absolute",
    right: 15,
    top: 15,
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  logoRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    gap: 15,
  },
  logo: {
    width: 50,
    height: 30,
    resizeMode: "contain",
  },
  payButton: {
    backgroundColor: "#ff6b35",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  payButtonDisabled: {
    backgroundColor: "#ccc",
  },
  payButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  securityText: {
    textAlign: "center",
    fontSize: 12,
    color: "#666",
    marginTop: 10,
  },
});