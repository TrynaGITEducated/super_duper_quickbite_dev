// src/screens/ProfileScreen.js
import { MaterialIcons } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth, db } from '../../firebase';

export default function ProfileScreen({ navigation }) {
  // Store user details
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const user = auth.currentUser;
      if (user) {
        // Try to get extra details from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        setUserDetails({
          email: user.email,
          displayName: user.displayName,
          ...userDoc.exists() ? userDoc.data() : {},
        });
      }
    };
    fetchUserDetails();
  }, []);

  const handleLogout = () => {
    // Reset navigation stack back to Login screen
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="person" size={80} color="#1e90ff" />
        <Text style={styles.title}>My Account</Text>
      </View>

      <ScrollView contentContainerStyle={styles.menu}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('PersonalDetails', { userDetails })}
        >
          <Text style={styles.menuText}>Personal Details</Text>
          <MaterialIcons name="chevron-right" size={24} color="#888" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('PaymentOptions')}
        >
          <Text style={styles.menuText}>Payment Options</Text>
          <MaterialIcons name="chevron-right" size={24} color="#888" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('OrderHistory')}
        >
          <Text style={styles.menuText}>History</Text>
          <MaterialIcons name="chevron-right" size={24} color="#888" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, styles.logoutItem]}
          onPress={handleLogout}
        >
          <Text style={[styles.menuText, styles.logoutText]}>Logout</Text>
          <MaterialIcons name="logout" size={24} color="#d63031" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f0e6',
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 12,
    color: '#000',
  },
  menu: {
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  menuText: {
    fontSize: 16,
    color: '#000',
  },
  logoutItem: {
    backgroundColor: '#fff',
  },
  logoutText: {
    color: '#d63031',
  },
});
