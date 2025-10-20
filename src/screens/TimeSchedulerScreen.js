import DateTimePicker from "@react-native-community/datetimepicker";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import {
  Platform,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { db } from "../../firebase";

export default function TimeSchedulerScreen({ route, navigation }) {
  const { orderId } = route.params;
  const [time, setTime] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event, selectedTime) => {
    setShow(false);
    if (selectedTime) setTime(selectedTime);
  };

  const confirmPickup = async () => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await setDoc(
        orderRef,
        {
          pickupTime: time.toISOString(),
          status: "scheduled",
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      navigation.navigate("OrderStatus", { orderId });
    } catch (error) {
      alert("Error updating order: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⏰ Select Pickup Time</Text>

      <TouchableOpacity style={styles.button} onPress={() => setShow(true)}>
        <Text style={styles.buttonText}>Pick a Time</Text>
      </TouchableOpacity>

      {show && (
        <View style={styles.pickerCard}>
          <DateTimePicker
            value={time}
            mode="time"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onChange}
          />
        </View>
      )}

      <Text style={styles.selectedTime}>
        Selected Time: <Text style={styles.timeValue}>{time.toLocaleTimeString()}</Text>
      </Text>

      <TouchableOpacity style={styles.confirmButton} onPress={confirmPickup}>
        <Text style={styles.confirmText}>Confirm Pickup</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f0e6",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#d4a056",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#d4a056",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    elevation: 3,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  pickerCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    elevation: 2,
    marginBottom: 20,
  },
  selectedTime: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
  },
  timeValue: {
    fontWeight: "bold",
    color: "#d4a056",
  },
  confirmButton: {
    backgroundColor: "#444",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 3,
  },
  confirmText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});