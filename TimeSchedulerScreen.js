import DateTimePicker from "@react-native-community/datetimepicker";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { Button, Platform, Text, View } from "react-native";
import { db } from "../../firebase";

export default function TimeSchedulerScreen({ route, navigation }) {
  const { orderId } = route.params || {};
  const [time, setTime] = useState(new Date());
  const [show, setShow] = useState(false);
  const [pickupConfirmed, setPickupConfirmed] = useState(false);
  const [waitDuration, setWaitDuration] = useState(null); // in minutes
  const [countdown, setCountdown] = useState(null); // in seconds
  const [forceCountdown, setForceCountdown] = useState(false);
  const [pickedUp, setPickedUp] = useState(false);
  const timerRef = useRef(null);

  // Always listen for order changes (pickup time, waitDuration)
  useEffect(() => {
    const orderRef = doc(db, "orders", orderId);
    const unsub = onSnapshot(orderRef, (docSnap) => {
      const data = docSnap.data();
      if (!data) return;
      // If pickupTime is set, set pickupConfirmed and time
      if (data.pickupTime) {
        setPickupConfirmed(true);
        setTime(new Date(data.pickupTime));
      }
      // If waitDuration is set, update state and countdown
      if (data.waitDuration) {
        setWaitDuration(data.waitDuration);
        // Always recalculate countdown from now
        const pickup = new Date(data.pickupTime);
        const target = new Date(pickup.getTime() + data.waitDuration * 60000);
        const now = new Date();
        const seconds = Math.max(0, Math.floor((target - now) / 1000));
        setCountdown(seconds);
      } else {
        setWaitDuration(null);
        setCountdown(null);
      }
    });
    return () => unsub();
  }, [orderId]);

  // Force a 15-minute wait for demo/testing
  useEffect(() => {
    if (pickupConfirmed && waitDuration == null) {
      setWaitDuration(15);
      setForceCountdown(true);
      const pickup = new Date(time);
      const target = new Date(pickup.getTime() + 15 * 60000);
      const now = new Date();
      const seconds = Math.max(0, Math.floor((target - now) / 1000));
      setCountdown(seconds);
    }
  }, [pickupConfirmed, waitDuration, time]);

  // Countdown timer logic
  useEffect(() => {
    if ((waitDuration == null && !forceCountdown) || countdown == null || !pickupConfirmed) return;
    if (countdown <= 0 || pickedUp) {
      clearInterval(timerRef.current);
      navigation.replace("RatingScreen", { orderId });
      return;
    }
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          navigation.replace("RatingScreen", { orderId });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [waitDuration, countdown, pickupConfirmed, forceCountdown, pickedUp]);

  const onChange = (event, selectedTime) => {
    if (Platform.OS === "android") {
      setShow(false);
      if (event.type === "set" && selectedTime) setTime(selectedTime);
    } else {
      if (selectedTime) setTime(selectedTime);
    }
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
      setPickupConfirmed(true);
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

      {pickupConfirmed && waitDuration == null && (
        <Text style={{ marginTop: 20, color: "orange" }}>
          Waiting for kitchen to set pickup wait duration...
        </Text>
      )}
      {pickupConfirmed && (waitDuration != null || forceCountdown) && countdown != null && !pickedUp && (
        <View style={{ marginTop: 20, alignItems: "center" }}>
          <Text style={{ fontSize: 16, color: "green" }}>
            Please pick up your order within 15 minutes!
          </Text>
          <Text style={{ fontSize: 32, fontWeight: "bold", marginTop: 10 }}>
            {Math.floor(countdown / 60)
              .toString()
              .padStart(2, "0")}
            :
            {(countdown % 60).toString().padStart(2, "0")}
          </Text>
          <Button
            title="Order Picked"
            onPress={() => {
              setPickedUp(true);
            }}
            color="#ff6b35"
          />
        </View>
      )}
    </View>
  );
}
