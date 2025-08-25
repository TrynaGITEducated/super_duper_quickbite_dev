// screens/MenuScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function MenuScreen({ navigation }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigateTo = (category) => {
    // Navigate to OrderScreen and pass the selected category
    navigation.navigate('Order', { category });
    setIsMenuOpen(false);
  };

  // Mock data for "What you may like"
  const popularItems = [
    {
      id: '1',
      title: 'Beef & Rice Bowl',
      description: 'A satisfying, homestyle favorite',
      image: require('../../assets/images/beef-rice-bowl.png'),
    },
    {
      id: '2',
      title: 'Fresh Bread & Coffee Bliss',
      description: 'Perfectly baked goodness paired with rich coffee.',
      image: require('../../assets/images/bread-coffee.png'),
    },
    {
      id: '3',
      title: 'Slushi',
      description: 'Ice-cold, sweet, and refreshingly delicious',
      image: require('../../assets/images/slush.png'),
    },
  ];

  // Mock data for "Today's Special Offers"
  const specialOffer = {
    id: 'special',
    title: '10% Discount on Boerewors Meal',
    description: 'You do not want to miss out. Place your order now!',
    image: require('../../assets/images/boerewors.png'),
  };

  return (
    <View style={styles.container}>
      {/* Header with Kebab and Search Bar */}
      <View style={styles.header}>
        {/* Kebab Menu Icon */}
        <TouchableOpacity onPress={toggleMenu}>
          <MaterialIcons name="menu" size={28} color="#000" />
        </TouchableOpacity>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#888"
            autoCapitalize="none"
          />
        </View>
      </View>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('Special Offers')}>
            <Text style={styles.menuText}>Special Offers</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('Burgers')}>
            <Text style={styles.menuText}>Burgers</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('Pizza')}>
            <Text style={styles.menuText}>Pizza</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('Main Meals')}>
            <Text style={styles.menuText}>Main Meals</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('Sandwiches')}>
            <Text style={styles.menuText}>Sandwiches</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('Sushi')}>
            <Text style={styles.menuText}>Sushi</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('Fish & chips')}>
            <Text style={styles.menuText}>Fish & chips</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('Drinks')}>
            <Text style={styles.menuText}>Drinks</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('Desserts & Shakes')}>
            <Text style={styles.menuText}>Desserts & Shakes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('Sides')}>
            <Text style={styles.menuText}>Sides</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('Salads')}>
            <Text style={styles.menuText}>Salads</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Main Content */}
      <View style={styles.content}>
        {/* Explore Our Menu */}
        <Text style={styles.exploreText}>Explore our menu</Text>

        {/* What You May Like */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What you may like</Text>
          {popularItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() => navigateTo(item.title)}
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
            onPress={() => navigateTo('Special Offers')}
          >
            <Image source={specialOffer.image} style={styles.specialImage} />
            <View style={styles.specialContent}>
              <Text style={styles.specialTitle}>{specialOffer.title}</Text>
              <Text style={styles.specialDescription}>{specialOffer.description}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
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
  content: {
    flex: 1,
    marginTop: 20,
  },
  exploreText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
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
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  specialImage: {
    width: '100%',
    height: 120,
  },
  specialContent: {
    padding: 12,
  },
  specialTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  specialDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});