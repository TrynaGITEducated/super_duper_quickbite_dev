// src/screens/AboutScreen.js
import { MaterialIcons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialIcons name="restaurant" size={60} color="#d4a056" />
        <Text style={styles.title}>QuickBite</Text>
        <Text style={styles.subtitle}>Cafeteria Pre-Order System</Text>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About QuickBite</Text>
        <Text style={styles.text}>
          QuickBite is an efficient pre-order system designed to enhance the 
          process of getting food from the cafeteria. Skip the lines and enjoy 
          your meals on your schedule!
        </Text>
      </View>

      {/* Mission */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Mission</Text>
        <Text style={styles.text}>
          We empower students and staff to place food orders in advance, 
          customize their meals, and choose convenient pickup times. Our 
          integrated system streamlines cafeteria operations while providing 
          valuable insights through data analytics and customer feedback.
        </Text>
      </View>

      {/* How It Works */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How It Works</Text>
        <View style={styles.listItem}>
          <MaterialIcons name="menu-book" size={20} color="#8b7355" />
          <Text style={styles.text}>Browse the menu on your device</Text>
        </View>
        <View style={styles.listItem}>
          <MaterialIcons name="tune" size={20} color="#8b7355" />
          <Text style={styles.text}>Customize your meal and choose a pickup time</Text>
        </View>
        <View style={styles.listItem}>
          <MaterialIcons name="payment" size={20} color="#8b7355" />
          <Text style={styles.text}>Pay securely and get a confirmation</Text>
        </View>
        <View style={styles.listItem}>
          <MaterialIcons name="restaurant" size={20} color="#8b7355" />
          <Text style={styles.text}>Pick up your meal without waiting in line</Text>
        </View>
      </View>

      {/* Key Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Features</Text>

        {/** Example Feature */}
        <View style={styles.featureItem}>
          <MaterialIcons name="person-add" size={24} color="#d4a056" />
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>User Registration</Text>
            <Text style={styles.featureDesc}>
              Sign up, log in, and manage your profile with ease
            </Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <MaterialIcons name="restaurant-menu" size={24} color="#d4a056" />
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Menu Browsing</Text>
            <Text style={styles.featureDesc}>
              View available food items, prices, and detailed descriptions
            </Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <MaterialIcons name="schedule" size={24} color="#d4a056" />
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Pre-Order Placement</Text>
            <Text style={styles.featureDesc}>
              Select food items and schedule orders in advance
            </Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <MaterialIcons name="tune" size={24} color="#d4a056" />
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Meal Customization</Text>
            <Text style={styles.featureDesc}>
              Personalize your meals to match your preferences
            </Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <MaterialIcons name="payment" size={24} color="#d4a056" />
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Secure Payments</Text>
            <Text style={styles.featureDesc}>
              Pay for meals and load money onto your cafeteria card
            </Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <MaterialIcons name="access-time" size={24} color="#d4a056" />
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Flexible Pickup Times</Text>
            <Text style={styles.featureDesc}>
              Choose when to collect your order at your convenience
            </Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <MaterialIcons name="star-rate" size={24} color="#d4a056" />
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Feedback System</Text>
            <Text style={styles.featureDesc}>
              Rate meals and help improve cafeteria offerings
            </Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <MaterialIcons name="analytics" size={24} color="#d4a056" />
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Data Analytics</Text>
            <Text style={styles.featureDesc}>
              Kitchen operations optimized through intelligent insights
            </Text>
          </View>
        </View>
      </View>

      {/* Our Vision */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Vision</Text>
        <Text style={styles.text}>
          QuickBite aims to expand to multiple cafeterias, offer loyalty rewards, 
          personalized recommendations, and help make campus dining smarter for everyone.
        </Text>
      </View>

      {/* Why Choose QuickBite */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why Choose QuickBite?</Text>
        <View style={styles.benefitItem}>
          <MaterialIcons name="check-circle" size={20} color="#8b7355" />
          <Text style={styles.benefitText}>Save time - no more waiting in long lines</Text>
        </View>
        <View style={styles.benefitItem}>
          <MaterialIcons name="check-circle" size={20} color="#8b7355" />
          <Text style={styles.benefitText}>Get your food exactly when you need it</Text>
        </View>
        <View style={styles.benefitItem}>
          <MaterialIcons name="check-circle" size={20} color="#8b7355" />
          <Text style={styles.benefitText}>Customize meals to your preferences</Text>
        </View>
        <View style={styles.benefitItem}>
          <MaterialIcons name="check-circle" size={20} color="#8b7355" />
          <Text style={styles.benefitText}>Support better cafeteria services through feedback</Text>
        </View>
        <View style={styles.benefitItem}>
          <MaterialIcons name="check-circle" size={20} color="#8b7355" />
          <Text style={styles.benefitText}>Make informed choices based on community ratings</Text>
        </View>
      </View>

      {/* Contact */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Support</Text>
        <View style={styles.contactItem}>
          <MaterialIcons name="email" size={20} color="#8b7355" />
          <Text style={styles.contactText}>support@quickbite.edu</Text>
        </View>
        <View style={styles.contactItem}>
          <MaterialIcons name="phone" size={20} color="#8b7355" />
          <Text style={styles.contactText}>Campus Ext: 066 366 5741</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.section}>
        <Text style={styles.versionText}>Version 1.0.0</Text>
        <Text style={styles.copyrightText}>© 2025 QuickBite. All rights reserved.</Text>
        <Text style={styles.taglineText}>Making campus dining smarter, one order at a time.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f0e6',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#fff',
    marginBottom: 20,
    borderBottomWidth: 3,
    borderBottomColor: '#d4a056',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#d4a056',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#8b7355',
    marginTop: 5,
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 15,
    marginHorizontal: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#d4a056',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#d4a056',
    marginBottom: 15,
  },
  text: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f0e6',
  },
  featureContent: {
    flex: 1,
    marginLeft: 15,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  featureDesc: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 15,
    color: '#555',
    marginLeft: 10,
    flex: 1,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  contactText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
  },
  versionText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
  },
  copyrightText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 5,
  },
  taglineText: {
    fontSize: 13,
    color: '#d4a056',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
    fontWeight: '600',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
});
