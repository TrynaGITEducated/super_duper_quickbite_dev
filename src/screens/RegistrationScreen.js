// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { useState } from "react";
// import { Button, StyleSheet, Text, TextInput, View } from "react-native";
// import { auth } from "../../firebase";

// export default function RegisterScreen({ navigation }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleRegister = async () => {
//     try {
//       await createUserWithEmailAndPassword(auth, email, password);
//       alert("Registration successful!");
//       navigation.navigate("Login");
//     } catch (error) {
//       alert(error.message);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Register</Text>
//       <TextInput
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//         style={styles.input}
//       />
//       <TextInput
//         placeholder="Password"
//         secureTextEntry
//         value={password}
//         onChangeText={setPassword}
//         style={styles.input}
//       />
//       <Button title="Register" onPress={handleRegister} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", padding: 20 },
//   title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     padding: 10,
//     marginBottom: 15,
//     borderRadius: 8,
//   },
// });// src/screens/RegistrationScreen.jsimport React, { useState } from "react";
import Checkbox from "expo-checkbox";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { auth, db } from "../../firebase"; // ✅ make sure firebase.js is set up

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!agree) {
      Alert.alert("Error", "You must agree to the Terms & Conditions");
      return;
    }

    try {
      setLoading(true);

      // ✅ Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // ✅ Save user info to Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: new Date(),
      });

      Alert.alert("Success", "Account created successfully!");

      // ✅ Navigate back to Login
      navigation.navigate("Login");
    } catch (error) {
      console.error(error);
      Alert.alert("Registration Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Terms & Conditions Checkbox */}
      <View style={styles.checkboxContainer}>
        <Checkbox value={agree} onValueChange={setAgree} color={agree ? "#007AFF" : undefined} />
        <Text style={styles.checkboxText}>I agree to the Terms & Conditions</Text>
      </View>

      <Button
        title={loading ? "Registering..." : "Register"}
        onPress={handleRegister}
        disabled={loading}
      />

      <Text style={{ marginTop: 20 }}>
        Already have an account?{" "}
        <Text style={{ color: "blue" }} onPress={() => navigation.navigate("Login")}>
          Login
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 10,
    borderRadius: 8,
  },
  checkboxContainer: { flexDirection: "row", alignItems: "center", marginVertical: 15 },
  checkboxText: { marginLeft: 8 },
});
