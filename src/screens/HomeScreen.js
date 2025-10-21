// screens/HomeScreen.js
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function HomeScreen({ navigation }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Animation values
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigateTo = (screenName) => {
    setIsMenuOpen(false);
    if (screenName === "About") {
      navigation.getParent()?.navigate(screenName);
    } else {
      navigation.navigate(screenName);
    }
  };

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  // Added 5th item (Sandwiches)
  const foodItems = [
    { id: 1, source: require("../../assets/images/burger.png") },
    { id: 2, source: require("../../assets/images/coffee.png") },
    { id: 3, source: require("../../assets/images/fishchips.png") },
    { id: 4, source: require("../../assets/images/pie.png") },
    { id: 5, source: require("../../assets/images/sandwich.png") }, // New item
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu}>
          <MaterialIcons name="menu" size={28} color="#000" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.aboutIconButton}
          onPress={() => navigateTo("About")}
        >
          <MaterialIcons name="info-outline" size={28} color="#d4a056" />
        </TouchableOpacity>
      </View>

      {isMenuOpen && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo("Menu")}>
            <MaterialIcons name="restaurant" size={20} color="#d4a056" style={styles.menuIcon} />
            <Text style={styles.menuText}>Menu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo("Order")}>
            <MaterialIcons name="assignment" size={20} color="#d4a056" style={styles.menuIcon} />
            <Text style={styles.menuText}>Order</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo("Profile")}>
            <MaterialIcons name="person" size={20} color="#d4a056" style={styles.menuIcon} />
            <Text style={styles.menuText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo("About")}>
            <MaterialIcons name="info" size={20} color="#d4a056" style={styles.menuIcon} />
            <Text style={styles.menuText}>About QuickBite</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo("Login")}>
            <MaterialIcons name="logout" size={20} color="#d4a056" style={styles.menuIcon} />
            <Text style={styles.menuText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Animated Food Circle */}
      <View style={styles.foodCircleContainer}>
        <Animated.View 
          style={[
            styles.foodCircle,
            {
              transform: [{ rotate: rotateInterpolate }]
            }
          ]}
        >
          {foodItems.map((item, index) => {
            // 5 items: 72° apart (360/5)
            const angle = (index * 2 * Math.PI) / 5;
            const radius = 90; // Reduced from 120 → closer to logo
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            
            return (
              <View
                key={item.id}
                style={[
                  styles.foodOrb,
                  {
                    transform: [
                      { translateX: x },
                      { translateY: y }
                    ]
                  }
                ]}
              >
                <Image
                  source={item.source}
                  style={styles.foodImage}
                  resizeMode="contain"
                />
              </View>
            );
          })}
        </Animated.View>
        
        <Animated.Image
          source={require("../../assets/images/quickbite-logo.png")}
          style={[
            styles.centralLogo,
            {
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim }
              ]
            }
          ]}
          resizeMode="contain"
        />
      </View>

      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim }
            ]
          }
        ]}
      >
        <Text style={styles.welcomeText}>Welcome to QuickBite Cafeteria</Text>
        <Text style={styles.subtitle}>Fresh Food, Fast Delivery</Text>
        
        <TouchableOpacity
          style={styles.orderButton}
          onPress={() => navigateTo("Menu")}
        >
          <Text style={styles.orderButtonText}>Order now →</Text>
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.backgroundElements}>
        <Animated.View 
          style={[
            styles.bgCircle1,
            {
              transform: [
                {
                  scale: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1]
                  })
                }
              ]
            }
          ]} 
        />
        <Animated.View 
          style={[
            styles.bgCircle2,
            {
              transform: [
                {
                  scale: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.3, 0.8]
                  })
                }
              ]
            }
          ]} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f0e6",
    paddingHorizontal: 6,
    paddingTop: 50,
    paddingBottom: 90,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: 0,
    paddingBottom: 10,
    zIndex: 1000,
  },
  aboutIconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(212, 160, 86, 0.1)',
  },
  dropdownMenu: {
    position: "absolute",
    top: 80,
    left: 10,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  menuIcon: {
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    color: "#333",
    fontWeight: '500',
  },
  foodCircleContainer: {
    position: 'absolute',
    top: '20%', // Slightly lower to balance content
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: 260, // Reduced from 300
  },
  foodCircle: {
    width: 260, // Reduced from 320
    height: 260,
    borderRadius: 10,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  foodOrb: {
    position: 'absolute',
    width: 60, // Slightly smaller
    height: 60,
    borderRadius: 32.5,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  foodImage: {
    width: 48, // Slightly smaller
    height: 48,
  },
  // centralLogo: {
  //   position: 'absolute',
  //   width: 120, // Slightly smaller
  //   height: 120,
  //   borderRadius: 60,
  //   backgroundColor: '#fff',
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 4 },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 8,
  //   elevation: 5,
  // },
   centralLogo: {
    position: 'absolute',
    width: 150,
    height: 150,
    // marginBottom: 30,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end", // Changed from "flex-end" to center vertically
    paddingHorizontal: 20,
    paddingBottom: 200, // Reduced padding
  },
  welcomeText: {
    fontSize: 26, // Slightly smaller
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 25, // Reduced margin
    fontWeight: '500',
  },
  orderButton: {
    backgroundColor: "#d4a056",
    paddingHorizontal: 35,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    width: "100%",
    maxWidth: 190,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  orderButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  backgroundElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  bgCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(212, 160, 86, 0.1)',
    top: '10%',
    left: -50,
  },
  bgCircle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(212, 160, 86, 0.08)',
    bottom: '20%',
    right: -30,
  },
});