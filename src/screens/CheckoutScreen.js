import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CheckoutScreen({ navigation }) {
  const [deliveryType, setDeliveryType] = useState('Delivery');
  const [paymentMethod, setPaymentMethod] = useState('MasterCard');

  return (
    <View style={styles.container}>

      <TouchableOpacity style={styles.backArrow} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.header}>checkout</Text>
      
      // Delivery / Pick Up Switch 
      <View style={styles.switchRow}>
        <TouchableOpacity
          style={[styles.switchBtn, deliveryType === 'Delivery' && styles.selected]}
          onPress={() => setDeliveryType('Delivery')}
        >
          <Text style={styles.switchText}>Delivery</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.switchBtn, deliveryType === 'Pick up' && styles.selected]}
          onPress={() => setDeliveryType('Pick up')}
        >
          <Text style={styles.switchText}>Pick up</Text>
        </TouchableOpacity>
      </View>

      // Map 
      <Image
        source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/9/97/Google_Maps_logo_2020.svg' }} 
        style={styles.mapImage}
        resizeMode="contain"
      />
      <Text style={styles.mapLabel}>Google Maps</Text>

      // Info 
      <ScrollView style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <MaterialIcons name="location-on" size={18} color="#444" />
          <Text style={styles.infoText}>Engineering building District 6 Campus</Text>
        </View>
        <View style={styles.infoRow}>
          <FontAwesome name="phone" size={16} color="#444" />
          <Text style={styles.infoText}>+27 60 329 3372</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="md-walk" size={16} color="#444" />
          <Text style={styles.infoText}>Meet at floor 4 wait by the door</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons name="access-time" size={16} color="#444" />
          <Text style={styles.infoText}>Delivery time    15 - 20 min</Text>
        </View>
        // Order total
        <View style={styles.infoRow}>
          <Text style={[styles.infoText, {fontWeight:'bold'}]}>Total</Text>
          <Text style={[styles.infoText, {fontWeight:'bold'}]}>R32,97</Text>
        </View>
      </ScrollView>

      // Payment Buttons 
      <View style={styles.paymentRow}>
        <TouchableOpacity
          style={[styles.payBtn, paymentMethod === 'MasterCard' && styles.paySelected]}
          onPress={() => setPaymentMethod('MasterCard')}
        >
          <Text style={styles.btnText}>MasterCard</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.payBtn, paymentMethod === 'Cash' && styles.paySelected]}
          onPress={() => setPaymentMethod('Cash')}
        >
          <Text style={styles.btnText}>Cash on delivery</Text>
        </TouchableOpacity>
      </View>

      // Next Button 
      <TouchableOpacity style={styles.nextBtn}>
        <Text style={styles.nextText}>Next</Text>
      </TouchableOpacity>

      // Bottom Navigation 
      <View style={styles.bottomNav}>
        <Ionicons name="home" size={28} color="black" />
        <MaterialIcons name="bookmark-border" size={28} color="black" />
        <Ionicons name="person-outline" size={28} color="black" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#efe6d9', alignItems:'center', padding:18, justifyContent:'flex-start' },

  backArrow: { position: 'absolute', top: 32, left: 20, zIndex: 2 },
  header: { fontSize: 20, fontWeight: 'bold', marginTop: 36, marginBottom: 8 },
  switchRow: {
    flexDirection:'row', backgroundColor:'#e5dacb', borderRadius:18, overflow:'hidden', marginVertical:5
  },
  switchBtn: { paddingVertical:7, paddingHorizontal:32 },
  switchText: { fontSize: 16 },
  selected: { backgroundColor:'#d5c8b5' },
  mapImage: { width: 180, height: 80, backgroundColor:'#fff', borderRadius:13, marginTop:12 },
  mapLabel: { marginTop:-28, marginBottom:8, alignSelf:'center', fontWeight:'500', color:'#888' },
  infoContainer: { alignSelf:'stretch', marginVertical:8, paddingHorizontal:2 },
  infoRow: { flexDirection:'row', alignItems:'center', marginBottom:5 },
  infoText: { marginLeft:8, fontSize:15, color:'#444' },

  paymentRow: { flexDirection:'row', justifyContent:'space-between', width:"100%", marginVertical:10 },
  payBtn: { flex:1, marginHorizontal:2, padding:9, backgroundColor:'#e5dacb', borderRadius:7, alignItems:'center' },
  paySelected: { backgroundColor:'#cbb48b' },
  btnText: { fontWeight:'600' },
  nextBtn: { backgroundColor:"#b69d74", borderRadius:9, padding:12, minWidth:110, alignItems:'center', marginTop:3 },
  nextText: { color:'#fff', fontWeight:'bold', fontSize:18 },

  bottomNav: {
    flexDirection:'row', justifyContent:'space-around', alignItems:'center', width:'80%', position:'absolute', bottom:15, left:25, right:25, backgroundColor:'#efe6d9', borderRadius:14, height:49, elevation:2
  }
});
