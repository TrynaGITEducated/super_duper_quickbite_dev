import { useState } from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import { AirbnbRating } from "react-native-ratings";

export default function RatingScreen() {
  const [rating, setRating] = useState(0);

  const submitRating = () => {
    Alert.alert("Thank you!", `You rated: ${rating} stars`);
    // Here you could also save the rating to Firebase
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rate Your Experience</Text>
      <AirbnbRating
        count={5}
        defaultRating={0}
        size={30}
        onFinishRating={(value) => setRating(value)}
      />
      <Button title="Submit Rating" onPress={submitRating} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
});
