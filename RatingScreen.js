import { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { AirbnbRating } from "react-native-ratings";

export default function RatingScreen() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const submitRating = () => {
    Alert.alert("Thank you!", `You rated: ${rating} stars\nComment: ${comment}`);
    // Here you could also save the rating and comment to Firebase
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rate Your Experience</Text>
      <View style={styles.starsContainer}>
        <AirbnbRating
          count={5}
          defaultRating={0}
          size={40}
          showRating={false}
          onFinishRating={setRating}
        />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Leave a comment..."
        value={comment}
        onChangeText={setComment}
        multiline
      />
      <Button title="Submit Rating" onPress={submitRating} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  starsContainer: { marginBottom: 24, width: "100%", alignItems: "center", minHeight: 60 },
  input: {
    width: "100%",
    minHeight: 60,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginVertical: 16,
    fontSize: 16,
    backgroundColor: "#fff",
    textAlignVertical: "top",
  },
});
