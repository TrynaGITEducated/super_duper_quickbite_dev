// // import { AntDesign, Entypo, FontAwesome, MaterialIcons } from '@expo/vector-icons';
// // import { useNavigation } from '@react-navigation/native';
// // import Checkbox from "expo-checkbox";
// // import { createUserWithEmailAndPassword } from "firebase/auth";
// // import { doc, setDoc } from "firebase/firestore";
// // import { useState } from 'react';
// // import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// // import { auth, db } from "../../firebase";

// // const RegistrationScreen = () => {
// //   const navigation = useNavigation();

// //   const [firstName, setFirstName] = useState('');
// //   const [lastName, setLastName] = useState('');
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [agreeTerms, setAgreeTerms] = useState(false);
// //   const [receiveNotifications, setReceiveNotifications] = useState(false);
// //   const [loading, setLoading] = useState(false);
// //   const [showTermsModal, setShowTermsModal] = useState(false);

// //   const handleSignUp = async () => {
// //     if (!firstName || !lastName || !email || !password || !agreeTerms) {
// //       Alert.alert('Error', 'Please fill all required fields and agree to the terms.');
// //       return;
// //     }

// //     try {
// //       setLoading(true);

// //       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
// //       const user = userCredential.user;

// //       await setDoc(doc(db, "users", user.uid), {
// //         firstName,
// //         lastName,
// //         email: user.email,
// //         receiveNotifications,
// //         createdAt: new Date(),
// //       });

// //       Alert.alert("Success", "Registered successfully!");
// //       navigation.replace("Main");
// //     } catch (error) {
// //       console.error(error);
// //       Alert.alert("Registration Error", error.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <Text style={styles.header}>Register</Text>

// //       <TextInput
// //         style={styles.input}
// //         placeholder="First Name"
// //         placeholderTextColor="#888"
// //         value={firstName}
// //         onChangeText={setFirstName}
// //       />
// //       <TextInput
// //         style={styles.input}
// //         placeholder="Last Name"
// //         placeholderTextColor="#888"
// //         value={lastName}
// //         onChangeText={setLastName}
// //       />
// //       <TextInput
// //         style={styles.input}
// //         placeholder="Email"
// //         placeholderTextColor="#888"
// //         value={email}
// //         onChangeText={setEmail}
// //         keyboardType="email-address"
// //         autoCapitalize="none"
// //       />
// //       <TextInput
// //         style={styles.input}
// //         placeholder="Password"
// //         placeholderTextColor="#888"
// //         value={password}
// //         secureTextEntry
// //         onChangeText={setPassword}
// //       />

// //       {/* Terms & Conditions Checkbox */}
// //       <View style={styles.checkboxContainer}>
// //         <Checkbox value={agreeTerms} onValueChange={setAgreeTerms} color={agreeTerms ? "#f4a261" : undefined} />
// //         <Text style={styles.label}>
// //           I agree to the{' '}
// //           <Text style={styles.termsLink} onPress={() => setShowTermsModal(true)}>
// //             terms and conditions
// //           </Text>
// //           {' '}*
// //         </Text>
// //       </View>

// //       <View style={styles.checkboxContainer}>
// //         <Checkbox value={receiveNotifications} onValueChange={setReceiveNotifications} color={receiveNotifications ? "#f4a261" : undefined} />
// //         <Text style={styles.label}>Would you like to receive notifications</Text>
// //       </View>

// //       <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
// //         <Text style={styles.buttonText}>
// //           {loading ? "Registering..." : "Sign up"}
// //         </Text>
// //       </TouchableOpacity>

// //       <View style={styles.divider}>
// //         <Text style={styles.orText}>or sign with</Text>
// //       </View>

// //       <View style={styles.socialIcons}>
// //         <TouchableOpacity>
// //           <FontAwesome name="facebook-square" size={32} color="#3b5998" />
// //         </TouchableOpacity>
// //         <TouchableOpacity>
// //           <AntDesign name="google" size={32} color="#db4a39" />
// //         </TouchableOpacity>
// //         <TouchableOpacity>
// //           <Entypo name="twitter" size={32} color="#1DA1F2" />
// //         </TouchableOpacity>
// //       </View>

// //       {/* Terms and Conditions Modal */}
// //       <Modal
// //         visible={showTermsModal}
// //         animationType="slide"
// //         transparent={true}
// //         onRequestClose={() => setShowTermsModal(false)}
// //       >
// //         <View style={styles.modalOverlay}>
// //           <View style={styles.modalContainer}>
// //             {/* Modal Header */}
// //             <View style={styles.modalHeader}>
// //               <Text style={styles.modalTitle}>Terms and Conditions</Text>
// //               <TouchableOpacity onPress={() => setShowTermsModal(false)}>
// //                 <MaterialIcons name="close" size={28} color="#333" />
// //               </TouchableOpacity>
// //             </View>

// //             {/* Terms Content */}
// //             <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={true}>
// //               <Text style={styles.termsTitle}>QuickBite Cafeteria Pre-Order System</Text>
// //               <Text style={styles.termsSubtitle}>Last Updated: January 2025</Text>

// //               <View style={styles.termsSection}>
// //                 <Text style={styles.sectionTitle}>1. Order Collection Policy</Text>
// //                 <Text style={styles.sectionText}>
// //                   • Orders must be collected within 15 minutes of scheduled pickup time{'\n'}
// //                   • Failure to collect orders may result in:{'\n'}
// //                   {'  '}◦ First offense: Warning{'\n'}
// //                   {'  '}◦ Second offense: 24-hour account suspension{'\n'}
// //                   {'  '}◦ Third offense: Permanent account ban{'\n'}
// //                   • Uncollected orders will be disposed of after 30 minutes
// //                 </Text>
// //               </View>

// //               <View style={styles.termsSection}>
// //                 <Text style={styles.sectionTitle}>2. Payment Terms</Text>
// //                 <Text style={styles.sectionText}>
// //                   • All orders must be paid in full before confirmation{'\n'}
// //                   • Refunds only available if order is cancelled 1 hour before pickup time{'\n'}
// //                   • No refunds for uncollected orders
// //                 </Text>
// //               </View>

// //               <View style={styles.termsSection}>
// //                 <Text style={styles.sectionTitle}>3. Account Usage</Text>
// //                 <Text style={styles.sectionText}>
// //                   • Users must provide accurate personal information{'\n'}
// //                   • One account per person{'\n'}
// //                   • Account sharing is prohibited and may result in suspension
// //                 </Text>
// //               </View>

// //               <View style={styles.termsSection}>
// //                 <Text style={styles.sectionTitle}>4. Order Accuracy</Text>
// //                 <Text style={styles.sectionText}>
// //                   • Users are responsible for verifying order details before payment{'\n'}
// //                   • Customization requests must be made at time of ordering{'\n'}
// //                   • Special dietary requirements should be clearly specified
// //                 </Text>
// //               </View>

// //               <View style={styles.termsSection}>
// //                 <Text style={styles.sectionTitle}>5. Cafeteria Rights</Text>
// //                 <Text style={styles.sectionText}>
// //                   QuickBite reserves the right to cancel orders due to:{'\n'}
// //                   • Ingredient unavailability{'\n'}
// //                   • Kitchen capacity issues{'\n'}
// //                   • System maintenance{'\n'}
// //                   • Full refunds will be issued for cafeteria-cancelled orders
// //                 </Text>
// //               </View>

// //               <View style={styles.termsSection}>
// //                 <Text style={styles.sectionTitle}>6. User Conduct</Text>
// //                 <Text style={styles.sectionText}>
// //                   • Abusive behavior towards staff will result in immediate account termination{'\n'}
// //                   • False ratings or reviews may lead to suspension{'\n'}
// //                   • Spam orders or system abuse will result in permanent ban
// //                 </Text>
// //               </View>

// //               <View style={styles.termsSection}>
// //                 <Text style={styles.sectionTitle}>7. Data Privacy</Text>
// //                 <Text style={styles.sectionText}>
// //                   • User information is collected for order processing only{'\n'}
// //                   • Payment details are securely processed{'\n'}
// //                   • Order history is maintained for analytics and improvement
// //                 </Text>
// //               </View>

// //               <View style={styles.termsSection}>
// //                 <Text style={styles.sectionTitle}>8. Schedule Changes</Text>
// //                 <Text style={styles.sectionText}>
// //                   • Pickup times are subject to cafeteria operating hours{'\n'}
// //                   • Users will be notified of any schedule changes{'\n'}
// //                   • Orders must be rescheduled if cafeteria closes unexpectedly
// //                 </Text>
// //               </View>

// //               <View style={styles.termsSection}>
// //                 <Text style={styles.sectionTitle}>9. No-Show Tracking</Text>
// //                 <Text style={styles.sectionText}>
// //                   • System tracks missed pickups automatically{'\n'}
// //                   • Three no-shows within 30 days = automatic 7-day suspension{'\n'}
// //                   • Suspension notices sent via email and app notification
// //                 </Text>
// //               </View>

// //               <View style={styles.termsSection}>
// //                 <Text style={styles.sectionTitle}>10. Modification Rights</Text>
// //                 <Text style={styles.sectionText}>
// //                   • QuickBite may update these terms at any time{'\n'}
// //                   • Users will be notified of significant changes{'\n'}
// //                   • Continued use constitutes acceptance of updated terms
// //                 </Text>
// //               </View>

// //               <View style={styles.agreementBox}>
// //                 <Text style={styles.agreementText}>
// //                   By checking the "I agree to the terms and conditions" box, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
// //                 </Text>
// //               </View>
// //             </ScrollView>

// //             {/* Modal Footer */}
// //             <View style={styles.modalFooter}>
// //               <TouchableOpacity 
// //                 style={styles.acceptButton} 
// //                 onPress={() => {
// //                   setAgreeTerms(true);
// //                   setShowTermsModal(false);
// //                 }}
// //               >
// //                 <Text style={styles.acceptButtonText}>Accept Terms</Text>
// //               </TouchableOpacity>
// //             </View>
// //           </View>
// //         </View>
// //       </Modal>
// //     </View>
// //   );
// // };

// // export default RegistrationScreen;

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     padding: 24,
// //     backgroundColor: '#fff',
// //     justifyContent: 'center',
// //   },
// //   header: {
// //     fontSize: 28,
// //     fontWeight: 'bold',
// //     marginBottom: 30,
// //     alignSelf: 'center',
// //   },
// //   input: {
// //     borderWidth: 1,
// //     borderColor: '#d8d0d0ff',
// //     borderRadius: 6,
// //     padding: 12,
// //     marginBottom: 10,
// //   },
// //   checkboxContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: 10,
// //   },
// //   label: {
// //     marginLeft: 8,
// //     fontSize: 14,
// //   },
// //   termsLink: {
// //     color: '#f4a261',
// //     textDecorationLine: 'underline',
// //     fontWeight: '600',
// //   },
// //   button: {
// //     backgroundColor: '#f4a261',
// //     padding: 15,
// //     borderRadius: 6,
// //     alignItems: 'center',
// //     marginVertical: 10,
// //   },
// //   buttonText: {
// //     color: '#fff',
// //     fontWeight: 'bold',
// //   },
// //   divider: {
// //     alignItems: 'center',
// //     marginVertical: 10,
// //   },
// //   orText: {
// //     color: '#232121ff',
// //   },
// //   socialIcons: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-around',
// //     marginTop: 10,
// //   },
// //   // Modal Styles
// //   modalOverlay: {
// //     flex: 1,
// //     backgroundColor: 'rgba(0, 0, 0, 0.5)',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   modalContainer: {
// //     backgroundColor: '#fff',
// //     borderRadius: 12,
// //     width: '90%',
// //     maxHeight: '80%',
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 4 },
// //     shadowOpacity: 0.3,
// //     shadowRadius: 8,
// //     elevation: 10,
// //   },
// //   modalHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     padding: 20,
// //     borderBottomWidth: 2,
// //     borderBottomColor: '#f4a261',
// //   },
// //   modalTitle: {
// //     fontSize: 22,
// //     fontWeight: 'bold',
// //     color: '#333',
// //   },
// //   modalContent: {
// //     padding: 20,
// //   },
// //   termsTitle: {
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //     color: '#f4a261',
// //     marginBottom: 5,
// //   },
// //   termsSubtitle: {
// //     fontSize: 12,
// //     color: '#666',
// //     marginBottom: 20,
// //   },
// //   termsSection: {
// //     marginBottom: 20,
// //   },
// //   sectionTitle: {
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //     color: '#333',
// //     marginBottom: 8,
// //   },
// //   sectionText: {
// //     fontSize: 14,
// //     color: '#555',
// //     lineHeight: 22,
// //   },
// //   agreementBox: {
// //     backgroundColor: '#fff5e6',
// //     padding: 15,
// //     borderRadius: 8,
// //     borderLeftWidth: 4,
// //     borderLeftColor: '#f4a261',
// //     marginTop: 10,
// //     marginBottom: 20,
// //   },
// //   agreementText: {
// //     fontSize: 13,
// //     color: '#666',
// //     fontStyle: 'italic',
// //     lineHeight: 20,
// //   },
// //   modalFooter: {
// //     padding: 15,
// //     borderTopWidth: 1,
// //     borderTopColor: '#e0e0e0',
// //   },
// //   acceptButton: {
// //     backgroundColor: '#f4a261',
// //     padding: 15,
// //     borderRadius: 8,
// //     alignItems: 'center',
// //   },
// //   acceptButtonText: {
// //     color: '#fff',
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //   },
// // });
// import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';
// import Checkbox from "expo-checkbox";
// import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
// import { doc, setDoc } from "firebase/firestore";
// import { useState } from 'react';
// import { Alert, Dimensions, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// import { auth, db } from "../../firebase";

// const { height: screenHeight } = Dimensions.get("window");

// const RegistrationScreen = () => {
//   const navigation = useNavigation();

//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [userType, setUserType] = useState(""); // 'student' or 'staff'
//   const [studentNumber, setStudentNumber] = useState("");
//   const [staffNumber, setStaffNumber] = useState("");
//   const [department, setDepartment] = useState("");
//   const [campus, setCampus] = useState("");
//   const [faculty, setFaculty] = useState("");
//   const [agreeTerms, setAgreeTerms] = useState(false);
//   const [receiveNotifications, setReceiveNotifications] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [showTermsModal, setShowTermsModal] = useState(false);
//   const [step, setStep] = useState(1); // 1: Basic info, 2: User type, 3: Details

//   // CPUT Campuses
//   const campuses = [
//     "All Campuses",
//     "Bellville Campus",
//     "Cape Town Campus",
//     "Granger Bay Campus",
//     "Mowbray Campus",
//     "Wellington Campus",
//     "Athlone Campus",
//   ];

//   // Faculties and Departments
//   const faculties = [
//     "Applied Sciences",
//     "Business & Management Sciences",
//     "Education & Social Sciences",
//     "Engineering & the Built Environment",
//     "Health & Wellness Sciences",
//     "Informatics & Design",
//     "Administration",
//     "Support Services",
//   ];

//   // Staff Departments
//   const staffDepartments = [
//     "Academic Department",
//     "Administration",
//     "Finance",
//     "Human Resources",
//     "IT Services",
//     "Library Services",
//     "Maintenance",
//     "Research",
//     "Student Affairs",
//     "Other",
//   ];

//   const validateCPUTEmail = (email) => {
//     const cputEmailRegex = /^[a-zA-Z0-9._%+-]+@(mycput\.ac\.za|cput\.ac\.za)$/;
//     return cputEmailRegex.test(email);
//   };

//   const handleStep1 = () => {
//     if (!firstName || !lastName || !email || !password) {
//       Alert.alert("Error", "Please fill all required fields.");
//       return;
//     }

//     if (!validateCPUTEmail(email)) {
//       Alert.alert(
//         "Invalid Email",
//         "Please use your CPUT email address (e.g., name@mycput.ac.za for students or name@cput.ac.za for staff)"
//       );
//       return;
//     }

//     if (password.length < 6) {
//       Alert.alert("Weak Password", "Password must be at least 6 characters long.");
//       return;
//     }

//     setStep(2);
//   };

//   const handleStep2 = () => {
//     if (!userType) {
//       Alert.alert("Error", "Please select whether you are a student or staff member.");
//       return;
//     }
//     setStep(3);
//   };

//   const handleSignUp = async () => {
//     if (!campus || !faculty || !agreeTerms) {
//       Alert.alert("Error", "Please fill all required fields and agree to the terms.");
//       return;
//     }

//     if (userType === "student" && !studentNumber) {
//       Alert.alert("Error", "Please enter your student number.");
//       return;
//     }

//     if (userType === "staff" && !staffNumber) {
//       Alert.alert("Error", "Please enter your staff number.");
//       return;
//     }

//     try {
//       setLoading(true);

//       // Create user account
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;

//       // Send email verification
//       await sendEmailVerification(user);

//       // Prepare user data
//       const userData = {
//         firstName,
//         lastName,
//         email: user.email,
//         userType,
//         campus,
//         faculty,
//         receiveNotifications,
//         emailVerified: false,
//         accountStatus: "pending_verification",
//         createdAt: new Date(),
//       };

//       // Add type-specific data
//       if (userType === "student") {
//         userData.studentNumber = studentNumber;
//         userData.role = "student";
//       } else {
//         userData.staffNumber = staffNumber;
//         userData.department = department;
//         userData.role = "staff";
//       }

//       // Save user data to Firestore
//       await setDoc(doc(db, "users", user.uid), userData);

//       // Navigate to verification screen
//       navigation.replace("EmailVerification", {
//         email: user.email,
//         campus,
//         faculty,
//         userType,
//         userId: user.uid,
//       });

//     } catch (error) {
//       console.error("Registration error:", error);
//       let errorMessage = error.message;

//       // User-friendly error messages
//       if (error.code === "auth/email-already-in-use") {
//         errorMessage = "This email is already registered. Please sign in instead.";
//       } else if (error.code === "auth/weak-password") {
//         errorMessage = "Password should be at least 6 characters.";
//       } else if (error.code === "auth/invalid-email") {
//         errorMessage = "Invalid email address format.";
//       } else if (error.code === "auth/operation-not-allowed") {
//         errorMessage = "Email/password accounts are not enabled. Please contact support.";
//       }

//       Alert.alert("Registration Error", errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Simplified Terms Content Component
//   const TermsContent = () => (
//     <ScrollView style={styles.termsContent} showsVerticalScrollIndicator={true}>
//       <Text style={styles.termsTitle}>QuickBite Cafeteria Pre-Order System</Text>
//       <Text style={styles.termsSubtitle}>Last Updated: January 2025</Text>

//       <Text style={styles.sectionTitle}>1. Order Collection Policy</Text>
//       <Text style={styles.sectionText}>
//         • Orders must be collected within 15 minutes of scheduled pickup time{"\n"}
//         • Failure to collect orders may result in warnings or account suspension{"\n"}
//         • Uncollected orders will be disposed of after 30 minutes
//       </Text>

//       <Text style={styles.sectionTitle}>2. Payment Terms</Text>
//       <Text style={styles.sectionText}>
//         • All orders must be paid in full before confirmation{"\n"}
//         • Refunds only available if order is cancelled 1 hour before pickup time{"\n"}
//         • No refunds for uncollected orders
//       </Text>

//       <Text style={styles.sectionTitle}>3. Account Usage</Text>
//       <Text style={styles.sectionText}>
//         • Users must provide accurate personal information{"\n"}
//         • One account per person{"\n"}
//         • Account sharing is prohibited
//       </Text>

//       <Text style={styles.sectionTitle}>4. User Conduct</Text>
//       <Text style={styles.sectionText}>
//         • Abusive behavior towards staff will result in immediate account termination{"\n"}
//         • System abuse will result in permanent ban
//       </Text>

//       <Text style={styles.sectionTitle}>5. Data Privacy</Text>
//       <Text style={styles.sectionText}>
//         • User information is collected for order processing only{"\n"}
//         • Payment details are securely processed{"\n"}
//         • Order history is maintained for analytics
//       </Text>

//       <View style={styles.agreementBox}>
//         <Text style={styles.agreementText}>
//           By checking the "I agree to the terms and conditions" box, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
//         </Text>
//       </View>
//     </ScrollView>
//   );

//   // Step 1: Basic Information
//   const renderStep1 = () => (
//     <View>
//       <Text style={styles.stepHeader}>Step 1: Personal Information</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="First Name *"
//         placeholderTextColor="#888"
//         value={firstName}
//         onChangeText={setFirstName}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Last Name *"
//         placeholderTextColor="#888"
//         value={lastName}
//         onChangeText={setLastName}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="CPUT Email *"
//         placeholderTextColor="#888"
//         value={email}
//         onChangeText={setEmail}
//         keyboardType="email-address"
//         autoCapitalize="none"
//       />
//       <Text style={styles.emailHint}>
//         Students: name@mycput.ac.za | Staff: name@cput.ac.za
//       </Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Password * (min. 6 characters)"
//         placeholderTextColor="#888"
//         value={password}
//         secureTextEntry
//         onChangeText={setPassword}
//       />

//       <TouchableOpacity style={styles.button} onPress={handleStep1}>
//         <Text style={styles.buttonText}>Next →</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   // Step 2: User Type Selection
//   const renderStep2 = () => (
//     <View>
//       <Text style={styles.stepHeader}>Step 2: Select Your Role</Text>

//       <Text style={styles.sectionDescription}>
//         Are you a student or staff member at CPUT?
//       </Text>

//       <View style={styles.userTypeContainer}>
//         <TouchableOpacity
//           style={[
//             styles.userTypeOption,
//             userType === "student" && styles.userTypeOptionSelected,
//           ]}
//           onPress={() => setUserType("student")}
//         >
//           <FontAwesome
//             name="graduation-cap"
//             size={24}
//             color={userType === "student" ? "#fff" : "#f4a261"}
//           />
//           <Text
//             style={[
//               styles.userTypeText,
//               userType === "student" && styles.userTypeTextSelected,
//             ]}
//           >
//             Student
//           </Text>
//           <Text style={styles.userTypeSubtext}>Current CPUT student</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[
//             styles.userTypeOption,
//             userType === "staff" && styles.userTypeOptionSelected,
//           ]}
//           onPress={() => setUserType("staff")}
//         >
//           <FontAwesome
//             name="briefcase"
//             size={24}
//             color={userType === "staff" ? "#fff" : "#f4a261"}
//           />
//           <Text
//             style={[
//               styles.userTypeText,
//               userType === "staff" && styles.userTypeTextSelected,
//             ]}
//           >
//             Staff Member
//           </Text>
//           <Text style={styles.userTypeSubtext}>Lecturer, Administrator, etc.</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.buttonRow}>
//         <TouchableOpacity
//           style={[styles.button, styles.backButton]}
//           onPress={() => setStep(1)}
//         >
//           <Text style={[styles.buttonText, styles.backButtonText]}>← Back</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.button} onPress={handleStep2}>
//           <Text style={styles.buttonText}>Next →</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   // Step 3: Detailed Information
//   const renderStep3 = () => (
//     <View>
//       <Text style={styles.stepHeader}>
//         Step 3: {userType === "student" ? "Student" : "Staff"} Information
//       </Text>

//       {/* Student Number or Staff Number */}
//       {userType === "student" ? (
//         <TextInput
//           style={styles.input}
//           placeholder="Student Number *"
//           placeholderTextColor="#888"
//           value={studentNumber}
//           onChangeText={setStudentNumber}
//           keyboardType="numeric"
//         />
//       ) : (
//         <View>
//           <TextInput
//             style={styles.input}
//             placeholder="Staff Number *"
//             placeholderTextColor="#888"
//             value={staffNumber}
//             onChangeText={setStaffNumber}
//           />

//           <Text style={styles.dropdownLabel}>Department</Text>
//           <View style={styles.dropdownContainer}>
//             {staffDepartments.map((dept) => (
//               <TouchableOpacity
//                 key={dept}
//                 style={[
//                   styles.dropdownOption,
//                   department === dept && styles.dropdownOptionSelected,
//                 ]}
//                 onPress={() => setDepartment(dept)}
//               >
//                 <Text
//                   style={[
//                     styles.dropdownOptionText,
//                     department === dept && styles.dropdownOptionTextSelected,
//                   ]}
//                 >
//                   {dept}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>
//       )}

//       {/* Campus Selection */}
//       <Text style={styles.dropdownLabel}>Select Campus *</Text>
//       <View style={styles.dropdownContainer}>
//         {campuses.map((campusItem) => (
//           <TouchableOpacity
//             key={campusItem}
//             style={[
//               styles.dropdownOption,
//               campus === campusItem && styles.dropdownOptionSelected,
//             ]}
//             onPress={() => setCampus(campusItem)}
//           >
//             <Text
//               style={[
//                 styles.dropdownOptionText,
//                 campus === campusItem && styles.dropdownOptionTextSelected,
//               ]}
//             >
//               {campusItem}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* Faculty/Division Selection */}
//       <Text style={styles.dropdownLabel}>
//         {userType === "student" ? "Select Faculty *" : "Select Division *"}
//       </Text>
//       <View style={styles.dropdownContainer}>
//         {faculties.map((facultyItem) => (
//           <TouchableOpacity
//             key={facultyItem}
//             style={[
//               styles.dropdownOption,
//               faculty === facultyItem && styles.dropdownOptionSelected,
//             ]}
//             onPress={() => setFaculty(facultyItem)}
//           >
//             <Text
//               style={[
//                 styles.dropdownOptionText,
//                 faculty === facultyItem && styles.dropdownOptionTextSelected,
//               ]}
//             >
//               {facultyItem}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* Terms & Conditions Checkbox */}
//       <View style={styles.checkboxContainer}>
//         <Checkbox
//           value={agreeTerms}
//           onValueChange={setAgreeTerms}
//           color={agreeTerms ? "#f4a261" : undefined}
//         />
//         <Text style={styles.label}>
//           I agree to the{" "}
//           <Text
//             style={styles.termsLink}
//             onPress={() => setShowTermsModal(true)}
//           >
//             terms and conditions
//           </Text>{" "}
//           *
//         </Text>
//       </View>

//       <View style={styles.checkboxContainer}>
//         <Checkbox
//           value={receiveNotifications}
//           onValueChange={setReceiveNotifications}
//           color={receiveNotifications ? "#f4a261" : undefined}
//         />
//         <Text style={styles.label}>Receive order notifications</Text>
//       </View>

//       <View style={styles.buttonRow}>
//         <TouchableOpacity
//           style={[styles.button, styles.backButton]}
//           onPress={() => setStep(2)}
//         >
//           <Text style={[styles.buttonText, styles.backButtonText]}>← Back</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={styles.button}
//           onPress={handleSignUp}
//           disabled={loading}
//         >
//           <Text style={styles.buttonText}>
//             {loading ? "Registering..." : "Complete Registration"}
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>CPUT Cafeteria Registration</Text>

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         style={styles.mainScrollView}
//       >
//         {step === 1
//           ? renderStep1()
//           : step === 2
//           ? renderStep2()
//           : renderStep3()}
//       </ScrollView>

//       {/* Terms and Conditions Modal */}
//       <Modal
//         visible={showTermsModal}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setShowTermsModal(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             {/* Modal Header */}
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Terms and Conditions</Text>
//               <TouchableOpacity
//                 onPress={() => setShowTermsModal(false)}
//                 style={styles.closeButton}
//               >
//                 <MaterialIcons name="close" size={28} color="#333" />
//               </TouchableOpacity>
//             </View>

//             {/* Terms Content */}
//             <TermsContent />

//             {/* Modal Footer */}
//             <View style={styles.modalFooter}>
//               <TouchableOpacity
//                 style={styles.acceptButton}
//                 onPress={() => {
//                   setAgreeTerms(true);
//                   setShowTermsModal(false);
//                 }}
//               >
//                 <Text style={styles.acceptButtonText}>Accept Terms</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// export default RegistrationScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 24,
//     backgroundColor: "#fff",
//   },
//   mainScrollView: {
//     flex: 1,
//   },
//   header: {
//     fontSize: 28,
//     fontWeight: "bold",
//     marginBottom: 20,
//     alignSelf: "center",
//     textAlign: "center",
//     color: "#2c5530",
//   },
//   stepHeader: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 20,
//     color: "#f4a261",
//   },
//   sectionDescription: {
//     fontSize: 16,
//     color: "#666",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#d8d0d0ff",
//     borderRadius: 6,
//     padding: 12,
//     marginBottom: 15,
//     fontSize: 16,
//   },
//   emailHint: {
//     fontSize: 12,
//     color: "#666",
//     marginBottom: 15,
//     fontStyle: "italic",
//     textAlign: "center",
//   },
//   userTypeContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 30,
//   },
//   userTypeOption: {
//     flex: 1,
//     padding: 20,
//     borderWidth: 2,
//     borderColor: "#f4a261",
//     borderRadius: 12,
//     alignItems: "center",
//     marginHorizontal: 5,
//     backgroundColor: "#fff",
//   },
//   userTypeOptionSelected: {
//     backgroundColor: "#f4a261",
//   },
//   userTypeText: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginTop: 10,
//     color: "#f4a261",
//   },
//   userTypeTextSelected: {
//     color: "#fff",
//   },
//   userTypeSubtext: {
//     fontSize: 12,
//     color: "#666",
//     marginTop: 5,
//     textAlign: "center",
//   },
//   dropdownLabel: {
//     fontSize: 16,
//     fontWeight: "600",
//     marginBottom: 8,
//     color: "#333",
//   },
//   dropdownContainer: {
//     marginBottom: 20,
//   },
//   dropdownOption: {
//     padding: 15,
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 6,
//     marginBottom: 8,
//     backgroundColor: "#f9f9f9",
//   },
//   dropdownOptionSelected: {
//     backgroundColor: "#f4a261",
//     borderColor: "#f4a261",
//   },
//   dropdownOptionText: {
//     fontSize: 14,
//     color: "#333",
//   },
//   dropdownOptionTextSelected: {
//     color: "#fff",
//     fontWeight: "bold",
//   },
//   checkboxContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 15,
//   },
//   label: {
//     marginLeft: 8,
//     fontSize: 14,
//     flex: 1,
//     color: "#333",
//   },
//   termsLink: {
//     color: "#f4a261",
//     textDecorationLine: "underline",
//     fontWeight: "600",
//   },
//   button: {
//     backgroundColor: "#f4a261",
//     padding: 15,
//     borderRadius: 6,
//     alignItems: "center",
//     marginVertical: 10,
//   },
//   backButton: {
//     backgroundColor: "#f0f0f0",
//     flex: 1,
//     marginRight: 10,
//   },
//   backButtonText: {
//     color: "#333",
//   },
//   buttonText: {
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize: 16,
//   },
//   buttonRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   // Modal Styles
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   modalContainer: {
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     width: "100%",
//     height: screenHeight * 0.8,
//     maxHeight: screenHeight * 0.8,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 10,
//   },
//   modalHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 20,
//     borderBottomWidth: 2,
//     borderBottomColor: "#f4a261",
//   },
//   modalTitle: {
//     fontSize: 22,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   closeButton: {
//     padding: 5,
//   },
//   termsContent: {
//     flex: 1,
//     padding: 20,
//   },
//   termsTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#f4a261",
//     marginBottom: 5,
//     textAlign: "center",
//   },
//   termsSubtitle: {
//     fontSize: 12,
//     color: "#666",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#333",
//     marginBottom: 8,
//     marginTop: 15,
//   },
//   sectionText: {
//     fontSize: 14,
//     color: "#555",
//     lineHeight: 20,
//     marginBottom: 10,
//   },
//   agreementBox: {
//     backgroundColor: "#fff5e6",
//     padding: 15,
//     borderRadius: 8,
//     borderLeftWidth: 4,
//     borderLeftColor: "#f4a261",
//     marginTop: 20,
//     marginBottom: 10,
//   },
//   agreementText: {
//     fontSize: 13,
//     color: "#666",
//     fontStyle: "italic",
//     lineHeight: 20,
//   },
//   modalFooter: {
//     padding: 15,
//     borderTopWidth: 1,
//     borderTopColor: "#e0e0e0",
//   },
//   acceptButton: {
//     backgroundColor: "#f4a261",
//     padding: 15,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   acceptButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Checkbox from "expo-checkbox";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from 'react';
import { Alert, Dimensions, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from "../../firebase";

const { height: screenHeight } = Dimensions.get("window");

const RegistrationScreen = () => {
  const navigation = useNavigation();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState(""); // 'student' or 'staff'
  const [studentNumber, setStudentNumber] = useState("");
  const [staffNumber, setStaffNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [campus, setCampus] = useState("");
  const [faculty, setFaculty] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [receiveNotifications, setReceiveNotifications] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [step, setStep] = useState(1); // 1: Basic info, 2: User type, 3: Details

  // CPUT Campuses
  const campuses = [
    "All Campuses",
    "Bellville Campus",
    "Cape Town Campus",
    "Granger Bay Campus",
    "Mowbray Campus",
    "Wellington Campus",
    "Athlone Campus",
  ];

  // Faculties and Departments
  const faculties = [
    "Applied Sciences",
    "Business & Management Sciences",
    "Education & Social Sciences",
    "Engineering & the Built Environment",
    "Health & Wellness Sciences",
    "Informatics & Design",
    "Administration",
    "Support Services",
  ];

  // Staff Departments
  const staffDepartments = [
    "Academic Department",
    "Administration",
    "Finance",
    "Human Resources",
    "IT Services",
    "Library Services",
    "Maintenance",
    "Research",
    "Student Affairs",
    "Other",
  ];

  const validateCPUTEmail = (email) => {
    const cputEmailRegex = /^[a-zA-Z0-9._%+-]+@(mycput\.ac\.za|cput\.ac\.za)$/;
    return cputEmailRegex.test(email);
  };

  const handleStep1 = () => {
    if (!firstName || !lastName || !email || !password) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }

    if (!validateCPUTEmail(email)) {
      Alert.alert(
        "Invalid Email",
        "Please use your CPUT email address (e.g., name@mycput.ac.za for students or name@cput.ac.za for staff)"
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters long.");
      return;
    }

    setStep(2);
  };

  const handleStep2 = () => {
    if (!userType) {
      Alert.alert("Error", "Please select whether you are a student or staff member.");
      return;
    }
    setStep(3);
  };

  const handleSignUp = async () => {
    if (!campus || !faculty || !agreeTerms) {
      Alert.alert("Error", "Please fill all required fields and agree to the terms.");
      return;
    }

    if (userType === "student" && !studentNumber) {
      Alert.alert("Error", "Please enter your student number.");
      return;
    }

    if (userType === "staff" && !staffNumber) {
      Alert.alert("Error", "Please enter your staff number.");
      return;
    }

    try {
      setLoading(true);

      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send email verification
      await sendEmailVerification(user);

      // Prepare user data
      const userData = {
        firstName,
        lastName,
        email: user.email,
        userType,
        campus,
        faculty,
        receiveNotifications,
        emailVerified: false,
        accountStatus: "pending_verification",
        createdAt: new Date(),
      };

      // Add type-specific data
      if (userType === "student") {
        userData.studentNumber = studentNumber;
        userData.role = "student";
      } else {
        userData.staffNumber = staffNumber;
        userData.department = department;
        userData.role = "staff";
      }

      // Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), userData);

      // ✅ CHANGED: Use navigate instead of replace to maintain navigation stack
      navigation.navigate("EmailVerification", {
        email: user.email,
        campus,
        faculty,
        userType,
        userId: user.uid,
        firstName,
        lastName,
      });

    } catch (error) {
      console.error("Registration error:", error);
      let errorMessage = error.message;

      // User-friendly error messages
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already registered. Please sign in instead.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address format.";
      } else if (error.code === "auth/operation-not-allowed") {
        errorMessage = "Email/password accounts are not enabled. Please contact support.";
      }

      Alert.alert("Registration Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Simplified Terms Content Component
  const TermsContent = () => (
    <ScrollView style={styles.termsContent} showsVerticalScrollIndicator={true}>
      <Text style={styles.termsTitle}>QuickBite Cafeteria Pre-Order System</Text>
      <Text style={styles.termsSubtitle}>Last Updated: January 2025</Text>

      <Text style={styles.sectionTitle}>1. Order Collection Policy</Text>
      <Text style={styles.sectionText}>
        • Orders must be collected within 15 minutes of scheduled pickup time{"\n"}
        • Failure to collect orders may result in warnings or account suspension{"\n"}
        • Uncollected orders will be disposed of after 30 minutes
      </Text>

      <Text style={styles.sectionTitle}>2. Payment Terms</Text>
      <Text style={styles.sectionText}>
        • All orders must be paid in full before confirmation{"\n"}
        • Refunds only available if order is cancelled 1 hour before pickup time{"\n"}
        • No refunds for uncollected orders
      </Text>

      <Text style={styles.sectionTitle}>3. Account Usage</Text>
      <Text style={styles.sectionText}>
        • Users must provide accurate personal information{"\n"}
        • One account per person{"\n"}
        • Account sharing is prohibited
      </Text>

      <Text style={styles.sectionTitle}>4. User Conduct</Text>
      <Text style={styles.sectionText}>
        • Abusive behavior towards staff will result in immediate account termination{"\n"}
        • System abuse will result in permanent ban
      </Text>

      <Text style={styles.sectionTitle}>5. Data Privacy</Text>
      <Text style={styles.sectionText}>
        • User information is collected for order processing only{"\n"}
        • Payment details are securely processed{"\n"}
        • Order history is maintained for analytics
      </Text>

      <View style={styles.agreementBox}>
        <Text style={styles.agreementText}>
          By checking the "I agree to the terms and conditions" box, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
        </Text>
      </View>
    </ScrollView>
  );

  // Step 1: Basic Information
  const renderStep1 = () => (
    <View>
      <Text style={styles.stepHeader}>Step 1: Personal Information</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name *"
        placeholderTextColor="#888"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name *"
        placeholderTextColor="#888"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="CPUT Email *"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Text style={styles.emailHint}>
        Students: name@mycput.ac.za | Staff: name@cput.ac.za
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Password * (min. 6 characters)"
        placeholderTextColor="#888"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleStep1}>
        <Text style={styles.buttonText}>Next →</Text>
      </TouchableOpacity>
    </View>
  );

  // Step 2: User Type Selection
  const renderStep2 = () => (
    <View>
      <Text style={styles.stepHeader}>Step 2: Select Your Role</Text>

      <Text style={styles.sectionDescription}>
        Are you a student or staff member at CPUT?
      </Text>

      <View style={styles.userTypeContainer}>
        <TouchableOpacity
          style={[
            styles.userTypeOption,
            userType === "student" && styles.userTypeOptionSelected,
          ]}
          onPress={() => setUserType("student")}
        >
          <FontAwesome
            name="graduation-cap"
            size={24}
            color={userType === "student" ? "#fff" : "#f4a261"}
          />
          <Text
            style={[
              styles.userTypeText,
              userType === "student" && styles.userTypeTextSelected,
            ]}
          >
            Student
          </Text>
          <Text style={styles.userTypeSubtext}>Current CPUT student</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.userTypeOption,
            userType === "staff" && styles.userTypeOptionSelected,
          ]}
          onPress={() => setUserType("staff")}
        >
          <FontAwesome
            name="briefcase"
            size={24}
            color={userType === "staff" ? "#fff" : "#f4a261"}
          />
          <Text
            style={[
              styles.userTypeText,
              userType === "staff" && styles.userTypeTextSelected,
            ]}
          >
            Staff Member
          </Text>
          <Text style={styles.userTypeSubtext}>Lecturer, Administrator, etc.</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.backButton]}
          onPress={() => setStep(1)}
        >
          <Text style={[styles.buttonText, styles.backButtonText]}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleStep2}>
          <Text style={styles.buttonText}>Next →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Step 3: Detailed Information
  const renderStep3 = () => (
    <View>
      <Text style={styles.stepHeader}>
        Step 3: {userType === "student" ? "Student" : "Staff"} Information
      </Text>

      {/* Student Number or Staff Number */}
      {userType === "student" ? (
        <TextInput
          style={styles.input}
          placeholder="Student Number *"
          placeholderTextColor="#888"
          value={studentNumber}
          onChangeText={setStudentNumber}
          keyboardType="numeric"
        />
      ) : (
        <View>
          <TextInput
            style={styles.input}
            placeholder="Staff Number *"
            placeholderTextColor="#888"
            value={staffNumber}
            onChangeText={setStaffNumber}
          />

          <Text style={styles.dropdownLabel}>Department</Text>
          <View style={styles.dropdownContainer}>
            {staffDepartments.map((dept) => (
              <TouchableOpacity
                key={dept}
                style={[
                  styles.dropdownOption,
                  department === dept && styles.dropdownOptionSelected,
                ]}
                onPress={() => setDepartment(dept)}
              >
                <Text
                  style={[
                    styles.dropdownOptionText,
                    department === dept && styles.dropdownOptionTextSelected,
                  ]}
                >
                  {dept}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Campus Selection */}
      <Text style={styles.dropdownLabel}>Select Campus *</Text>
      <View style={styles.dropdownContainer}>
        {campuses.map((campusItem) => (
          <TouchableOpacity
            key={campusItem}
            style={[
              styles.dropdownOption,
              campus === campusItem && styles.dropdownOptionSelected,
            ]}
            onPress={() => setCampus(campusItem)}
          >
            <Text
              style={[
                styles.dropdownOptionText,
                campus === campusItem && styles.dropdownOptionTextSelected,
              ]}
            >
              {campusItem}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Faculty/Division Selection */}
      <Text style={styles.dropdownLabel}>
        {userType === "student" ? "Select Faculty *" : "Select Division *"}
      </Text>
      <View style={styles.dropdownContainer}>
        {faculties.map((facultyItem) => (
          <TouchableOpacity
            key={facultyItem}
            style={[
              styles.dropdownOption,
              faculty === facultyItem && styles.dropdownOptionSelected,
            ]}
            onPress={() => setFaculty(facultyItem)}
          >
            <Text
              style={[
                styles.dropdownOptionText,
                faculty === facultyItem && styles.dropdownOptionTextSelected,
              ]}
            >
              {facultyItem}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Terms & Conditions Checkbox */}
      <View style={styles.checkboxContainer}>
        <Checkbox
          value={agreeTerms}
          onValueChange={setAgreeTerms}
          color={agreeTerms ? "#f4a261" : undefined}
        />
        <Text style={styles.label}>
          I agree to the{" "}
          <Text
            style={styles.termsLink}
            onPress={() => setShowTermsModal(true)}
          >
            terms and conditions
          </Text>{" "}
          *
        </Text>
      </View>

      <View style={styles.checkboxContainer}>
        <Checkbox
          value={receiveNotifications}
          onValueChange={setReceiveNotifications}
          color={receiveNotifications ? "#f4a261" : undefined}
        />
        <Text style={styles.label}>Receive order notifications</Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.backButton]}
          onPress={() => setStep(2)}
        >
          <Text style={[styles.buttonText, styles.backButtonText]}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={handleSignUp}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Registering..." : "Complete Registration"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>CPUT Cafeteria Registration</Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.mainScrollView}
      >
        {step === 1
          ? renderStep1()
          : step === 2
          ? renderStep2()
          : renderStep3()}
      </ScrollView>

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
              <TouchableOpacity
                onPress={() => setShowTermsModal(false)}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={28} color="#333" />
              </TouchableOpacity>
            </View>

            {/* Terms Content */}
            <TermsContent />

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
    backgroundColor: "#fff",
  },
  mainScrollView: {
    flex: 1,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: "center",
    textAlign: "center",
    color: "#2c5530",
  },
  stepHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#f4a261",
  },
  sectionDescription: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d8d0d0ff",
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  emailHint: {
    fontSize: 12,
    color: "#666",
    marginBottom: 15,
    fontStyle: "italic",
    textAlign: "center",
  },
  userTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  userTypeOption: {
    flex: 1,
    padding: 20,
    borderWidth: 2,
    borderColor: "#f4a261",
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 5,
    backgroundColor: "#fff",
  },
  userTypeOptionSelected: {
    backgroundColor: "#f4a261",
  },
  userTypeText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    color: "#f4a261",
  },
  userTypeTextSelected: {
    color: "#fff",
  },
  userTypeSubtext: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
    textAlign: "center",
  },
  dropdownLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  dropdownContainer: {
    marginBottom: 20,
  },
  dropdownOption: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    marginBottom: 8,
    backgroundColor: "#f9f9f9",
  },
  dropdownOptionSelected: {
    backgroundColor: "#f4a261",
    borderColor: "#f4a261",
  },
  dropdownOptionText: {
    fontSize: 14,
    color: "#333",
  },
  dropdownOptionTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  label: {
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
    color: "#333",
  },
  termsLink: {
    color: "#f4a261",
    textDecorationLine: "underline",
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#f4a261",
    padding: 15,
    borderRadius: 6,
    alignItems: "center",
    marginVertical: 10,
  },
  backButton: {
    backgroundColor: "#f0f0f0",
    flex: 1,
    marginRight: 10,
  },
  backButtonText: {
    color: "#333",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: "100%",
    height: screenHeight * 0.8,
    maxHeight: screenHeight * 0.8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#f4a261",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 5,
  },
  termsContent: {
    flex: 1,
    padding: 20,
  },
  termsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#f4a261",
    marginBottom: 5,
    textAlign: "center",
  },
  termsSubtitle: {
    fontSize: 12,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    marginTop: 15,
  },
  sectionText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    marginBottom: 10,
  },
  agreementBox: {
    backgroundColor: "#fff5e6",
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#f4a261",
    marginTop: 20,
    marginBottom: 10,
  },
  agreementText: {
    fontSize: 13,
    color: "#666",
    fontStyle: "italic",
    lineHeight: 20,
  },
  modalFooter: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  acceptButton: {
    backgroundColor: "#f4a261",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  acceptButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});