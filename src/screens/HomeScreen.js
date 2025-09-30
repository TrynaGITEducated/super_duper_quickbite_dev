import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
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
    navigation.navigate(screenName);
    setIsMenuOpen(false);
  };

  // Start animations when component mounts
  useEffect(() => {
    // Rotating food animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Fade in and slide up animation for welcome content
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

  // Interpolate rotation
  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  // Food items for rotation
  const foodItems = [
    { id: 1, source: require("../../assets/images/burger.png"), style: styles.foodItem1 },
    { id: 2, source: require("../../assets/images/coffee.png"), style: styles.foodItem2 },
    { id: 3, source: require("../../assets/images/fishchips.png"), style: styles.foodItem3 },
    { id: 4, source: require("../../assets/images/pie.png"), style: styles.foodItem4 },
  ];

  return (
    <View style={styles.container}>
      {/* Header with Kebab Icon */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu}>
          <MaterialIcons name="menu" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo("Menu")}>
            <Text style={styles.menuText}>Menu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo("Order")}>
            <Text style={styles.menuText}>Order</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo("Profile")}>
            <Text style={styles.menuText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo("Login")}>
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
          {foodItems.map((item) => (
            <Animated.Image
              key={item.id}
              source={item.source}
              style={[
                item.style,
                {
                  transform: [{ rotate: rotateInterpolate }]
                }
              ]}
              resizeMode="contain"
            />
          ))}
        </Animated.View>
        
        {/* Central Logo */}
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

      {/* Main Content */}
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
        
        {/* Floating food items */}
        <View style={styles.floatingFoods}>
          <Animated.Image
            source={require("../../assets/images/coffee.png")}
            style={[
              styles.floatingFood1,
              {
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -20]
                    })
                  }
                ]
              }
            ]}
          />
          <Animated.Image
            source={require("../../assets/images/mainmeal.png")}
            style={[
              styles.floatingFood2,
              {
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 15]
                    })
                  }
                ]
              }
            ]}
          />
        </View>

        <TouchableOpacity
          style={styles.orderButton}
          onPress={() => navigateTo("Menu")}
        >
          <Text style={styles.orderButtonText}>Order now →</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Animated background elements */}
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
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 16,
    paddingTop: 0,
    paddingBottom: 10,
    zIndex: 1000,
  },
  dropdownMenu: {
    position: "absolute",
    top: 80,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuText: {
    fontSize: 16,
    color: "#000",
  },
  foodCircleContainer: {
    position: 'absolute',
    top: '20%',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
  },
  foodCircle: {
    width: 250,
    height: 250,
    borderRadius: 125,
    position: 'relative',
  },
  centralLogo: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  foodItem1: {
    position: 'absolute',
    width: 70,
    height: 70,
    top: 10,
    left: 90,
  },
  foodItem2: {
    position: 'absolute',
    width: 70,
    height: 70,
    top: 90,
    left: 160,
  },
  foodItem3: {
    position: 'absolute',
    width: 70,
    height: 70,
    top: 170,
    left: 90,
  },
  foodItem4: {
    position: 'absolute',
    width: 70,
    height: 70,
    top: 90,
    left: 20,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    fontWeight: '500',
  },
  floatingFoods: {
    position: 'relative',
    width: '100%',
    height: 80,
    marginBottom: 30,
  },
  floatingFood1: {
    position: 'absolute',
    width: 50,
    height: 50,
    left: 30,
    top: 0,
  },
  floatingFood2: {
    position: 'absolute',
    width: 45,
    height: 45,
    right: 40,
    top: 20,
  },
  orderButton: {
    backgroundColor: "#d4a056",
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: "center",
    width: "100%",
    maxWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  orderButtonText: {
    color: "#fff",
    fontSize: 18,
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

// // screens/HomeScreen.js
// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
// } from "react-native";
// import { MaterialIcons } from "@expo/vector-icons";

// export default function HomeScreen({ navigation }) {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   const navigateTo = (screenName) => {
//     navigation.navigate(screenName);
//     setIsMenuOpen(false);
//   };

//   return (
//     <View style={styles.container}>
//       {/* Header with Kebab Icon */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={toggleMenu}>
//           <MaterialIcons name="menu" size={28} color="#000" />
//         </TouchableOpacity>
//       </View>

//       {/* Dropdown Menu */}
//       {isMenuOpen && (
//         <View style={styles.dropdownMenu}>
//           <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo("Menu")}>
//             <Text style={styles.menuText}>Menu</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo("Order")}>
//             <Text style={styles.menuText}>Order</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo("Profile")}>
//             <Text style={styles.menuText}>Profile</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo("Login")}>
//             <Text style={styles.menuText}>Logout</Text>
//           </TouchableOpacity>
//         </View>
//       )}

//       {/* Main Content */}
//       <View style={styles.content}>
//         <Image
//           source={require("../../assets/images/quickbite-logo.png")}
//           style={styles.logo}
//           resizeMode="contain"
//         />
//         <Text style={styles.welcomeText}>Welcome to QuickBite Cafeteria</Text>
//         <TouchableOpacity
//           style={styles.orderButton}
//           onPress={() => navigateTo("Menu")}
//         >
//           <Text style={styles.orderButtonText}>Order now →</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f5f0e6",
//     paddingHorizontal: 6,
//     paddingTop: 50,
//     paddingBottom: 90,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "flex-start",
//     alignItems: "center",
//     padding: 16,
//     paddingTop: 0,
//     paddingBottom: 10,
//   },
//   dropdownMenu: {
//     position: "absolute",
//     top: 80,
//     left: 0,
//     right: 0,
//     backgroundColor: "#fff",
//     borderRadius: 8,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 5,
//     zIndex: 1000,
//   },
//   menuItem: {
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//   },
//   menuText: {
//     fontSize: 16,
//     color: "#000",
//   },
//   content: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     paddingHorizontal: 20,
//     paddingTop: 20,
//   },
//   logo: {
//     width: 200,
//     height: 150,
//     marginBottom: 30,
//   },
//   welcomeText: {
//     fontSize: 24,
//     fontWeight: "bold",
//     textAlign: "center",
//     color: "#000",
//     marginBottom: 20,
//   },
//   orderButton: {
//     backgroundColor: "#d4a056",
//     paddingHorizontal: 40,
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: "center",
//     width: "100%",
//     maxWidth: 200,
//     marginBottom: -20,
//   },
//   orderButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });