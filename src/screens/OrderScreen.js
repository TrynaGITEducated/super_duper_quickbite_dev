// screens/OrderScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // Changed from Ionicons to MaterialIcons

const categories = [
  { id: "1", title: "Burgers", image: require("../../assets/images/burger.png") },
  { id: "2", title: "Drinks", image: require("../../assets/images/drink.png") },
  { id: "3", title: "Main meals", image: require("../../assets/images/mainmeal.png") },
  { id: "4", title: "Fish & chips", image: require("../../assets/images/fishchips.png") },
  { id: "5", title: "Sandwiches", image: require("../../assets/images/sandwich.png") },
];

const meals = [
  // Fish & chips
  { id: "f1", title: "Small chips", price: 15, category: "Fish & chips", image: require("../../assets/images/small-chips.png") },
  { id: "f2", title: "Large chips", price: 30, category: "Fish & chips", image: require("../../assets/images/large-chips.png") },
  { id: "f3", title: "Chips with Russian", price: 25, category: "Fish & chips", image: require("../../assets/images/chips-russian.png") },
  { id: "f4", title: "Chips with Hake", price: 40, category: "Fish & chips", image: require("../../assets/images/chips-hake.png") },

  // Sandwich
  { id: "s1", title: "Hot dog", price: 20, category: "Sandwich", image: require("../../assets/images/hotdog.png") },
  { id: "s2", title: "Kota", price: 30, category: "Sandwich", image: require("../../assets/images/kota.png") },
  { id: "s3", title: "Half bread", price: 10, category: "Sandwich", image: require("../../assets/images/half-bread.png") },
  { id: "s4", title: "Bread", price: 12, category: "Sandwich", image: require("../../assets/images/bread.png") },
  { id: "s5", title: "Sandwich", price: 15, category: "Sandwich", image: require("../../assets/images/sandwich.png") },
  { id: "s6", title: "Pie", price: 20, category: "Sandwich", image: require("../../assets/images/pie.png") },

  // Burgers
  { id: "b1", title: "Cheeseburger", price: 25, category: "Burgers", image: require("../../assets/images/cheeseburger.png") },
  { id: "b2", title: "Chicken Burger", price: 30, category: "Burgers", image: require("../../assets/images/chicken-burger.png") },
  { id: "b3", title: "Double Burger", price: 40, category: "Burgers", image: require("../../assets/images/double-burger.png") },

  // Drinks
  { id: "d1", title: "Coke", price: 10, category: "Drinks", image: require("../../assets/images/coke.png") },
  { id: "d2", title: "Fanta", price: 10, category: "Drinks", image: require("../../assets/images/fanta.png") },
  { id: "d3", title: "Water", price: 8, category: "Drinks", image: require("../../assets/images/water.png") },
  { id: "d4", title: "Juice", price: 12, category: "Drinks", image: require("../../assets/images/juice.png") },
  { id: "d5", title: "Energy Drink", price: 15, category: "Drinks", image: require("../../assets/images/energy-drink.png") },
  { id: "d6", title: "Slush", price: 12, category: "Drinks", image: require("../../assets/images/slush.png") },
  { id: "d7", title: "Coffee", price: 15, category: "Drinks", image: require("../../assets/images/coffee.png") },

  // Main Meals
  { id: "mm1", title: "Samp and Beef", price: 45, category: "Main meals", image: require("../../assets/images/samp-beef.png") },
  { id: "mm2", title: "Chicken Curry", price: 50, category: "Main meals", image: require("../../assets/images/chicken-curry.png") },
  { id: "mm3", title: "Mogodu and Pap", price: 40, category: "Main meals", image: require("../../assets/images/mogodu-pap.png") },
];

export default function OrderScreen({ route, navigation }) {
  const [cartItems, setCartItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { category } = route.params || {};

  React.useEffect(() => {
    if (category) {
      setSelectedCategory(category);
    }
  }, [category]);

  const updateQuantity = (id, change) => {
    setQuantities((prev) => {
      const newQty = (prev[id] || 1) + change;
      return { ...prev, [id]: newQty > 0 ? newQty : 1 };
    });
  };

  const addToCart = (item) => {
    const quantity = quantities[item.id] || 1;
    const itemWithQty = { ...item, quantity };
    setCartItems((prev) => [...prev, itemWithQty]);
    alert(`${item.title} (x${quantity}) added to cart!`);
  };

  const goToCart = () => {
    navigation.navigate("Cart", { cartItems: [...cartItems] });
  };

  const renderMeal = ({ item }) => (
    <View style={styles.mealCard}>
      <Image source={item.image} style={styles.mealImage} />
      <View style={{ flex: 1 }}>
        <Text style={styles.mealTitle}>{item.title} . R{item.price}.00</Text>
        <View style={styles.quantityRow}>
          <Text>Quantity</Text>
          <TouchableOpacity onPress={() => updateQuantity(item.id, -1)}>
            <Text style={styles.qtyBtn}>-</Text>
          </TouchableOpacity>
          <Text style={{ marginHorizontal: 8 }}>{quantities[item.id] || 1}</Text>
          <TouchableOpacity onPress={() => updateQuantity(item.id, 1)}>
            <Text style={styles.qtyBtn}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)}>
          <Text style={styles.addText}>Add to cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Filter meals based on selected category AND search query
  const filteredMeals = meals
    .filter((m) => {
      const matchesCategory = selectedCategory
        ? m.category === selectedCategory
        : !["Burgers", "Drinks", "Main meals"].includes(m.category);
      const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

  return (
    <View style={styles.container}>
      {/* Header with Search Bar Only */}
      <View style={styles.header}>
        {/* Search Bar (Same as MenuScreen) */}
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
          />
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>Order your meal</Text>

      <View style={{ flexDirection: "row", flex: 1 }}>
        {/* Categories */}
        <View style={styles.categories}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryItem,
                selectedCategory === cat.title && styles.selectedCategory,
              ]}
              onPress={() => setSelectedCategory(cat.title)}
            >
              <Image source={cat.image} style={styles.categoryImage} />
              <Text style={styles.categoryText}>{cat.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Meals */}
        <FlatList
          data={filteredMeals}
          renderItem={renderMeal}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      </View>

      {/* Next button */}
      <TouchableOpacity style={styles.nextButton} onPress={goToCart}>
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f0e6",
    paddingHorizontal: 6,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    width: '100%',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flex: 1,
    marginLeft: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  categories: {
    width: 100,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  categoryItem: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 5,
  },
  selectedCategory: {
    backgroundColor: '#d4a056',
    borderRadius: 8,
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  categoryText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
  mealCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 8,
    elevation: 2,
  },
  mealImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 10,
  },
  mealTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  qtyBtn: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#d4a056',
    padding: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  addText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#444',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
});