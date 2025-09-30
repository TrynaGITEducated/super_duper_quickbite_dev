import DateTimePicker from "@react-native-community/datetimepicker";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { Button, Platform, Text, View } from "react-native";
import { db } from "../../firebase";

export default function TimeSchedulerScreen({ route, navigation }) {
  const { orderId } = route.params; // orderId from PaymentScreen
  const [time, setTime] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event, selectedTime) => {
    setShow(false);
    if (selectedTime) setTime(selectedTime);
  };

  const confirmPickup = async () => {
    try {
      const orderRef = doc(db, "orders", orderId);

      // Create or update the order with pickup time
      await setDoc(
        orderRef,
        {
          pickupTime: time.toISOString(),
          status: "scheduled",
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      // Navigate to confirmation screen
      navigation.navigate("OrderStatus", { orderId });
    } catch (error) {
      alert("Error updating order: " + error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Select Pickup Time</Text>

      <Button title="Pick a Time" onPress={() => setShow(true)} />

      {show && (
        <DateTimePicker
          value={time}
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onChange}
        />
      )}

      <Text style={{ marginTop: 20, fontSize: 16 }}>
        Selected Time: {time.toLocaleTimeString()}
      </Text>
      <Button title="Confirm Pickup" onPress={confirmPickup} />
      
    </View>
  );
}
