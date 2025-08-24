import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { AntDesign, FontAwesome, Entypo } from '@expo/vector-icons';
import Checkbox from "expo-checkbox"; 
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase"; 

const RegistrationScreen = () => {
  const navigation = useNavigation();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [receiveNotifications, setReceiveNotifications] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !password || !agreeTerms) {
      Alert.alert('Error', 'Please fill all required fields and agree to the terms.');
      return;
    }

    try {
      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        email: user.email,
        receiveNotifications,
        createdAt: new Date(),
      });

      Alert.alert("Success", "Registered successfully!");

   
      navigation.replace("Main");
    } catch (error) {
      console.error(error);
      Alert.alert("Registration Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Register</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        placeholderTextColor="#888"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        placeholderTextColor="#888"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />

      {/* Terms & Conditions Checkbox */}
      <View style={styles.checkboxContainer}>
        <Checkbox value={agreeTerms} onValueChange={setAgreeTerms} color={agreeTerms ? "#f4a261" : undefined} />
        <Text style={styles.label}>I agree to the terms and conditions *</Text>
      </View>

      <View style={styles.checkboxContainer}>
        <Checkbox value={receiveNotifications} onValueChange={setReceiveNotifications} color={receiveNotifications ? "#f4a261" : undefined} />
        <Text style={styles.label}>Would you like to receive notifications</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? "Registering..." : "Sign up"}
        </Text>
      </TouchableOpacity>

      <View style={styles.divider}>
        <Text style={styles.orText}>or sign with</Text>
      </View>

      <View style={styles.socialIcons}>
        <TouchableOpacity>
          <FontAwesome name="facebook-square" size={32} color="#3b5998" />
        </TouchableOpacity>
        <TouchableOpacity>
          <AntDesign name="google" size={32} color="#db4a39" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Entypo name="twitter" size={32} color="#1DA1F2" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegistrationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    alignSelf: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d8d0d0ff',
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    marginLeft: 8,
  },
  button: {
    backgroundColor: '#f4a261',
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  divider: {
    alignItems: 'center',
    marginVertical: 10,
  },
  orText: {
    color: '#232121ff',
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
});
