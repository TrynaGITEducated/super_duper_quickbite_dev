// import { StyleSheet, Text, View } from "react-native";

// export default function OrderScreen() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>Your Orders 📦</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", alignItems: "center" },
//   text: { fontSize: 20 },
// });
// import { Button, StyleSheet, Text, View } from "react-native";

// export default function OrderScreen({ route, navigation }) {
//   const { item } = route.params || {}; // get item from MenuScreen

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Your Order</Text>

//       {item ? (
//         <>
//           <Text style={styles.text}>{item.name}</Text>
//           <Text style={styles.text}>Price: R{item.price}</Text>
//           <Button
//             title="Proceed to Payment"
//             onPress={() => navigation.navigate("Payment")}
//           />
//         </>
//       ) : (
//         <Text style={styles.text}>No item selected.</Text>
//       )}
//       <Button title="Back to Menu" onPress={() => navigation.goBack()} color="gray" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
//   title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
//   text: { fontSize: 18, marginBottom: 10 },
// });
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { db } from "../../firebase";

export default function OrdersScreen() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const ordersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setOrders(ordersData);
      } catch (error) {
        alert("Error fetching orders: " + error.message);
      }
    };

    fetchOrders();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Orders</Text>
      {orders.length === 0 ? (
        <Text>No orders yet.</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.order}>
              <Text>Order ID: {item.id}</Text>
              <Text>Status: {item.status}</Text>
              <Text>Items:</Text>
              {item.items.map((i, index) => (
                <Text key={index}>
                  {i.name} - R{i.price}
                </Text>
              ))}
              {item.pickupTime && (
                <Text>Pickup Time: {item.pickupTime.toDate().toLocaleTimeString()}</Text>
              )}
              <Text>Total: R{item.total}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 15 },
  order: { marginBottom: 20, padding: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 8 },
});
