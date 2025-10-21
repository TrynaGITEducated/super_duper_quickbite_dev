// screens/MenuScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function MenuScreen({ navigation }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigateToCategory = (category) => {
    navigation.navigate('Order', { category });
    setIsMenuOpen(false);
  };

  // Only these 5 categories in dropdown
  const menuCategories = [
    'Burgers',
    'Drinks',
    'Main meals',
    'Fish & chips',
    'Sandwiches',
  ];

  // Updated "What you may like" — all items exist in OrderScreen
  const popularItems = [
    {
      id: '1',
      title: 'Samp and Beef',
      description: 'Hearty traditional stew with tender beef',
      image: require('../../assets/images/samp-beef.png'),
      category: 'Main meals',
    },
    {
      id: '2',
      title: 'Cheeseburger',
      description: 'Juicy beef patty with melted cheese',
      image: require('../../assets/images/cheeseburger.png'),
      category: 'Burgers',
    },
    {
      id: '3',
      title: 'Slush',
      description: 'Ice-cold, sweet, and refreshingly delicious',
      image: require('../../assets/images/slush.png'),
      category: 'Drinks',
    },
    {
      id: '4',
      title: 'Kota',
      description: 'South African street food classic',
      image: require('../../assets/images/kota.png'),
      category: 'Sandwiches',
    },
    {
      id: '5',
      title: 'Chips with Hake',
      description: 'Crispy fish with golden chips',
      image: require('../../assets/images/chips-hake.png'),
      category: 'Fish & chips',
    },
    {
      id: '6',
      title: 'Chicken Curry',
      description: 'Spiced curry with tender chicken pieces',
      image: require('../../assets/images/chicken-curry.png'),
      category: 'Main meals',
    },
    {
      id: '7',
      title: 'Coffee',
      description: 'Rich and aromatic freshly brewed coffee',
      image: require('../../assets/images/coffee.png'),
      category: 'Drinks',
    },
  ];

  // Special offer data
  const specialOffer = {
    title: 'Special Combo Deal',
    description: 'Get a burger, chips, and drink for only R99!',
    image: require('../../assets/images/special-offer.png'),
  };

  // Full meal list for search
  const allMeals = [
    // Burgers
    { title: 'Cheeseburger', category: 'Burgers' },
    { title: 'Chicken Burger', category: 'Burgers' },
    { title: 'Double Burger', category: 'Burgers' },
    // Drinks
    { title: 'Coke', category: 'Drinks' },
    { title: 'Fanta', category: 'Drinks' },
    { title: 'Water', category: 'Drinks' },
    { title: 'Juice', category: 'Drinks' },
    { title: 'Energy Drink', category: 'Drinks' },
    { title: 'Slush', category: 'Drinks' },
    { title: 'Coffee', category: 'Drinks' },
    // Main meals
    { title: 'Samp and Beef', category: 'Main meals' },
    { title: 'Chicken Curry', category: 'Main meals' },
    { title: 'Mogodu and Pap', category: 'Main meals' },
    // Fish & chips
    { title: 'Small chips', category: 'Fish & chips' },
    { title: 'Large chips', category: 'Fish & chips' },
    { title: 'Chips with Russian', category: 'Fish & chips' },
    { title: 'Chips with Hake', category: 'Fish & chips' },
    // Sandwiches
    { title: 'Hot dog', category: 'Sandwiches' },
    { title: 'Kota', category: 'Sandwiches' },
    { title: 'Half bread', category: 'Sandwiches' },
    { title: 'Bread', category: 'Sandwiches' },
    { title: 'Sandwiches', category: 'Sandwiches' },
    { title: 'Pie', category: 'Sandwiches' },
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredItems = searchQuery
    ? allMeals.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const clearSearch = () => {
    setSearchQuery('');
  };

  const navigateToItem = (category, itemTitle) => {
    navigation.navigate('Order', { 
      category, 
      targetItemTitle: itemTitle 
    });
  };

  return (
    <View style={styles.container}>
      {/* Header with Kebab and Search Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu}>
          <MaterialIcons name="menu" size={28} color="#000" />
        </TouchableOpacity>

        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={handleSearch}
            autoCapitalize="none"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={clearSearch}>
              <MaterialIcons name="close" size={20} color="#888" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Dropdown Menu — only 5 categories */}
      {isMenuOpen && (
        <View style={styles.dropdownMenu}>
          {menuCategories.map((category) => (
            <TouchableOpacity
              key={category}
              style={styles.menuItem}
              onPress={() => navigateToCategory(category)}
            >
              <Text style={styles.menuText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Search Results */}
      {searchQuery && (
        <View style={styles.searchResults}>
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.searchResultItem}
                onPress={() => navigateToItem(item.category, item.title)}
              >
                <Text style={styles.searchResultText}>{item.title}</Text>
                <Text style={styles.searchResultCategory}>{item.category}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noResultsText}>No items found</Text>
          )}
        </View>
      )}

      {/* 👇 Wrap content in ScrollView */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.exploreText}>Explore our menu</Text>

        {/* What You May Like */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What you may like</Text>
          {popularItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() => navigateToItem(item.category, item.title)}
            >
              <Image source={item.image} style={styles.cardImage} />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDescription}>{item.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Today's Special Offers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's special offers</Text>
          <TouchableOpacity
            style={styles.specialCard}
            onPress={() => navigateToItem('Special Offers', 'Special Combo Deal')}
          >
            <Image source={specialOffer.image} style={styles.specialImage} />
            <View style={styles.specialContent}>
              <Text style={styles.specialTitle}>{specialOffer.title}</Text>
              <Text style={styles.specialDescription}>{specialOffer.description}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f0e6',
    paddingHorizontal: 16,
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
  dropdownMenu: {
    position: 'absolute',
    top: 70,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  menuItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuText: {
    fontSize: 16,
    color: '#000',
  },
  searchResults: {
    position: 'absolute',
    top: 70,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
    maxHeight: 200,
  },
  searchResultItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchResultText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  searchResultCategory: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  noResultsText: {
    textAlign: 'center',
    color: '#666',
    paddingVertical: 16,
    fontStyle: 'italic',
  },
  // 👇 New scroll container style
  scrollContent: {
    paddingBottom: 40, // Extra padding so last item isn't cut off
  },
  exploreText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#000',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  specialCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  specialImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
  },
  specialContent: {
    paddingHorizontal: 8,
  },
  specialTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  specialDescription: {
    fontSize: 14,
    color: '#666',
  },
});