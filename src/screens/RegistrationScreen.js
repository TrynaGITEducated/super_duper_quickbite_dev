import { AntDesign, Entypo, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Checkbox from "expo-checkbox";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
  const [showTermsModal, setShowTermsModal] = useState(false);

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
        <Text style={styles.label}>
          I agree to the{' '}
          <Text style={styles.termsLink} onPress={() => setShowTermsModal(true)}>
            terms and conditions
          </Text>
          {' '}*
        </Text>
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

      {/* Terms and Conditions Modal */}
      <Modal
        visible={showTermsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowTermsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Terms and Conditions</Text>
              <TouchableOpacity onPress={() => setShowTermsModal(false)}>
                <MaterialIcons name="close" size={28} color="#333" />
              </TouchableOpacity>
            </View>

            {/* Terms Content */}
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={true}>
              <Text style={styles.termsTitle}>QuickBite Cafeteria Pre-Order System</Text>
              <Text style={styles.termsSubtitle}>Last Updated: January 2025</Text>

              <View style={styles.termsSection}>
                <Text style={styles.sectionTitle}>1. Order Collection Policy</Text>
                <Text style={styles.sectionText}>
                  • Orders must be collected within 15 minutes of scheduled pickup time{'\n'}
                  • Failure to collect orders may result in:{'\n'}
                  {'  '}◦ First offense: Warning{'\n'}
                  {'  '}◦ Second offense: 24-hour account suspension{'\n'}
                  {'  '}◦ Third offense: Permanent account ban{'\n'}
                  • Uncollected orders will be disposed of after 30 minutes
                </Text>
              </View>

              <View style={styles.termsSection}>
                <Text style={styles.sectionTitle}>2. Payment Terms</Text>
                <Text style={styles.sectionText}>
                  • All orders must be paid in full before confirmation{'\n'}
                  • Refunds only available if order is cancelled 1 hour before pickup time{'\n'}
                  • No refunds for uncollected orders
                </Text>
              </View>

              <View style={styles.termsSection}>
                <Text style={styles.sectionTitle}>3. Account Usage</Text>
                <Text style={styles.sectionText}>
                  • Users must provide accurate personal information{'\n'}
                  • One account per person{'\n'}
                  • Account sharing is prohibited and may result in suspension
                </Text>
              </View>

              <View style={styles.termsSection}>
                <Text style={styles.sectionTitle}>4. Order Accuracy</Text>
                <Text style={styles.sectionText}>
                  • Users are responsible for verifying order details before payment{'\n'}
                  • Customization requests must be made at time of ordering{'\n'}
                  • Special dietary requirements should be clearly specified
                </Text>
              </View>

              <View style={styles.termsSection}>
                <Text style={styles.sectionTitle}>5. Cafeteria Rights</Text>
                <Text style={styles.sectionText}>
                  QuickBite reserves the right to cancel orders due to:{'\n'}
                  • Ingredient unavailability{'\n'}
                  • Kitchen capacity issues{'\n'}
                  • System maintenance{'\n'}
                  • Full refunds will be issued for cafeteria-cancelled orders
                </Text>
              </View>

              <View style={styles.termsSection}>
                <Text style={styles.sectionTitle}>6. User Conduct</Text>
                <Text style={styles.sectionText}>
                  • Abusive behavior towards staff will result in immediate account termination{'\n'}
                  • False ratings or reviews may lead to suspension{'\n'}
                  • Spam orders or system abuse will result in permanent ban
                </Text>
              </View>

              <View style={styles.termsSection}>
                <Text style={styles.sectionTitle}>7. Data Privacy</Text>
                <Text style={styles.sectionText}>
                  • User information is collected for order processing only{'\n'}
                  • Payment details are securely processed{'\n'}
                  • Order history is maintained for analytics and improvement
                </Text>
              </View>

              <View style={styles.termsSection}>
                <Text style={styles.sectionTitle}>8. Schedule Changes</Text>
                <Text style={styles.sectionText}>
                  • Pickup times are subject to cafeteria operating hours{'\n'}
                  • Users will be notified of any schedule changes{'\n'}
                  • Orders must be rescheduled if cafeteria closes unexpectedly
                </Text>
              </View>

              <View style={styles.termsSection}>
                <Text style={styles.sectionTitle}>9. No-Show Tracking</Text>
                <Text style={styles.sectionText}>
                  • System tracks missed pickups automatically{'\n'}
                  • Three no-shows within 30 days = automatic 7-day suspension{'\n'}
                  • Suspension notices sent via email and app notification
                </Text>
              </View>

              <View style={styles.termsSection}>
                <Text style={styles.sectionTitle}>10. Modification Rights</Text>
                <Text style={styles.sectionText}>
                  • QuickBite may update these terms at any time{'\n'}
                  • Users will be notified of significant changes{'\n'}
                  • Continued use constitutes acceptance of updated terms
                </Text>
              </View>

              <View style={styles.agreementBox}>
                <Text style={styles.agreementText}>
                  By checking the "I agree to the terms and conditions" box, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
                </Text>
              </View>
            </ScrollView>

            {/* Modal Footer */}
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.acceptButton} 
                onPress={() => {
                  setAgreeTerms(true);
                  setShowTermsModal(false);
                }}
              >
                <Text style={styles.acceptButtonText}>Accept Terms</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    fontSize: 14,
  },
  termsLink: {
    color: '#f4a261',
    textDecorationLine: 'underline',
    fontWeight: '600',
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#f4a261',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  modalContent: {
    padding: 20,
  },
  termsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f4a261',
    marginBottom: 5,
  },
  termsSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 20,
  },
  termsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
  },
  agreementBox: {
    backgroundColor: '#fff5e6',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f4a261',
    marginTop: 10,
    marginBottom: 20,
  },
  agreementText: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  modalFooter: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  acceptButton: {
    backgroundColor: '#f4a261',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});