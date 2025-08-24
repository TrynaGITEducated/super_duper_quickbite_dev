// import { StyleSheet, Text, View } from "react-native";

// export default function MenuScreen() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>Menu 🍕</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", alignItems: "center" },
//   text: { fontSize: 20 },
// });
import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";

const sampleMenu = [
  { id: "1", name: "Burger", price: 50 },
  { id: "2", name: "Pizza", price: 80 },
  { id: "3", name: "Pasta", price: 60 },
];

export default function MenuScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menu 🍕</Text>
      <FlatList
        data={sampleMenu}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate("Orders", { item })}
          >
            <Text style={styles.itemText}>{item.name} - R{item.price}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  item: { padding: 15, backgroundColor: "#f0f0f0", marginBottom: 10, borderRadius: 8 },
  itemText: { fontSize: 18 },
});
