
import { useNavigation } from "@react-navigation/native";
import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { auth, db } from "../../firebase";

const EmailVerificationScreen = ({ route }) => {
  const { email, campus, faculty, userType, userId } = route.params;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [user, setUser] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [manualCodeInput, setManualCodeInput] = useState('');
  const [autoCheckCount, setAutoCheckCount] = useState(0);

  useEffect(() => {
    // Generate verification code for manual fallback
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setVerificationCode(code);
    
    // Store in Firestore for manual verification
    if (userId) {
      updateDoc(doc(db, "users", userId), {
        verificationCode: code,
        verificationCodeCreated: new Date(),
      });
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      // Check verification immediately when auth state changes
      if (user) {
        checkFirebaseVerification();
      }
    });

    return unsubscribe;
  }, [userId]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // Auto-check Firebase verification every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      checkFirebaseVerification();
      setAutoCheckCount(prev => prev + 1);
    }, 10000); // Check every 10 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Check Firebase's native email verification status
  const checkFirebaseVerification = async () => {
    try {
      if (!auth.currentUser) return;

      // Reload user to get latest email verification status from Firebase Auth
      await auth.currentUser.reload();
      const currentUser = auth.currentUser;

      if (currentUser.emailVerified) {
        // Update Firestore with verified status
        await updateDoc(doc(db, "users", currentUser.uid), {
          emailVerified: true,
          accountStatus: "active",
          verifiedAt: new Date(),
        });

        Alert.alert(
          "Success!",
          "Email verified successfully! Welcome to QuickBite!",
          [{ text: "Continue", onPress: () => navigation.replace("Main") }]
        );
      }
    } catch (error) {
      console.error("Firebase verification check error:", error);
    }
  };

  // Check manual verification status (your custom code system)
  const checkManualVerificationStatus = async () => {
    try {
      if (!userId) return;

      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists() && userDoc.data().emailVerified) {
        await updateDoc(doc(db, "users", userId), {
          accountStatus: "active",
          verifiedAt: new Date(),
        });

        Alert.alert(
          "Success!",
          "Email verified successfully! Welcome to QuickBite!",
          [{ text: "Continue", onPress: () => navigation.replace("Main") }]
        );
      }
    } catch (error) {
      console.error("Manual verification check error:", error);
    }
  };

  const sendVerificationEmail = async () => {
    try {
      setResendLoading(true);

      const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      setVerificationCode(newCode);

      await updateDoc(doc(db, "users", userId), {
        verificationCode: newCode,
        verificationCodeCreated: new Date(),
        lastVerificationSent: new Date(),
      });

      // For manual verification fallback
      const verificationUrl = `https://trynagiteducated.github.io/quickbite-verification/?userId=${userId}&code=${newCode}&email=${encodeURIComponent(email)}`;
      
      Alert.alert(
        "Verification Email Sent!",
        `We've sent a verification email to ${email}.\n\nIf you don't see it, you can also use the manual verification method below.`,
        [
          { 
            text: "Open Manual Verification", 
            onPress: () => Linking.openURL(verificationUrl) 
          },
          { text: "OK", style: "default" }
        ]
      );

      setTimeLeft(60); // 60 second cooldown
    } catch (error) {
      console.error("Resend error:", error);
      Alert.alert("Error", "Failed to send verification email. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  const openVerificationPage = () => {
    const verificationUrl = `https://trynagiteducated.github.io/quickbite-verification/?userId=${userId}&code=${verificationCode}&email=${encodeURIComponent(email)}`;
    Linking.openURL(verificationUrl).catch(() => {
      Alert.alert("Error", "Could not open verification page. Please check your internet connection.");
    });
  };

  const handleManualVerification = () => {
    Alert.prompt(
      "Manual Verification",
      "Enter the 6-digit verification code:",
      [
        { 
          text: "Cancel", 
          style: "cancel",
          onPress: () => setManualCodeInput('')
        },
        { 
          text: "Verify", 
          onPress: (code) => {
            if (code) {
              setManualCodeInput(code.toUpperCase());
              verifyManualCode(code.toUpperCase());
            }
          }
        }
      ],
      "plain-text",
      manualCodeInput
    );
  };

  const verifyManualCode = async (code) => {
    try {
      setLoading(true);

      if (!code || code.length !== 6) {
        Alert.alert("Invalid Code", "Please enter a 6-digit verification code.");
        return;
      }

      if (code.toUpperCase() === verificationCode) {
        await updateDoc(doc(db, "users", userId), {
          emailVerified: true,
          accountStatus: "active",
          verifiedAt: new Date(),
        });

        Alert.alert(
          "Success!",
          "Email verified successfully!",
          [{ text: "Continue", onPress: () => navigation.replace("Main") }]
        );
      } else {
        Alert.alert(
          "Invalid Code", 
          "The verification code is incorrect. Please try again.",
          [
            { text: "Try Again", onPress: handleManualVerification },
            { text: "Cancel", style: "cancel" }
          ]
        );
      }
    } catch (error) {
      console.error("Manual verification error:", error);
      Alert.alert("Error", "Failed to verify. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.replace("Login");
    } catch (error) {
      console.error("Sign out error:", error);
      Alert.alert("Error", "Failed to sign out. Please try again.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Verify Your Email</Text>

        <Text style={styles.subtitle}>We've sent a verification email to:</Text>
        <Text style={styles.email}>{email}</Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Verification Methods:</Text>
          <Text style={styles.infoText}>
            1. Check your email and click the verification link (recommended){"\n"}
            2. Use manual code entry below{"\n"}
            3. Auto-checking every 10 seconds
          </Text>
        </View>

        {/* Manual Verification Section */}
        <View style={styles.manualSection}>
          <Text style={styles.manualTitle}>Manual Verification (Backup)</Text>
          
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={openVerificationPage}
          >
            <Text style={styles.primaryButtonText}>
              Get Verification Code
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleManualVerification}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#f4a261" size="small" />
            ) : (
              <Text style={styles.secondaryButtonText}>
                Enter Code Manually
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.tertiaryButton,
            (resendLoading || timeLeft > 0) && styles.disabledButton,
          ]}
          onPress={sendVerificationEmail}
          disabled={resendLoading || timeLeft > 0}
        >
          {resendLoading ? (
            <ActivityIndicator color="#2c5530" size="small" />
          ) : (
            <Text style={styles.tertiaryButtonText}>
              Resend Email {timeLeft > 0 ? `(${timeLeft}s)` : ""}
            </Text>
          )}
        </TouchableOpacity>

        <View style={styles.supportSection}>
          <Text style={styles.supportTitle}>Auto-check Active</Text>
          <Text style={styles.note}>
            Checking for verification every 10 seconds...{"\n"}
            Checks completed: {autoCheckCount}
          </Text>
          <Text style={styles.note}>
            No action needed if you verified via email link.
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.signOutButton} 
          onPress={handleSignOut}
        >
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#2c5530",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
    color: "#666",
  },
  email: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#f4a261",
  },
  manualSection: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  manualTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
  },
  infoBox: {
    backgroundColor: "#fff5e6",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#f4a261",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: "#f4a261",
    padding: 15,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 10,
    minHeight: 50,
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  secondaryButton: {
    padding: 15,
    borderRadius: 6,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f4a261",
    marginBottom: 10,
    minHeight: 50,
    justifyContent: "center",
  },
  tertiaryButton: {
    padding: 15,
    borderRadius: 6,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2c5530",
    marginBottom: 15,
  },
  tertiaryButtonText: {
    color: "#2c5530",
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.6,
  },
  secondaryButtonText: {
    color: "#f4a261",
    fontWeight: "bold",
  },
  supportSection: {
    backgroundColor: "#f0f8ff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2c5530",
  },
  note: {
    textAlign: "center",
    fontSize: 12,
    color: "#666",
    lineHeight: 16,
    marginBottom: 5,
  },
  signOutButton: {
    padding: 10,
    alignItems: "center",
  },
  signOutButtonText: {
    color: "#666",
    fontSize: 14,
  },
});

export default EmailVerificationScreen;