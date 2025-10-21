// // screens/InventoryManagementScreen.js
// import { MaterialIcons } from '@expo/vector-icons';
// import {
//   addDoc,
//   collection,
//   doc,
//   onSnapshot,
//   query // ← ADD THIS IMPORT
//   ,
//   updateDoc
// } from 'firebase/firestore';
// import { useEffect, useState } from 'react';
// import {
//   Alert,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View
// } from 'react-native';
// import { db } from '../../firebase';

// export default function InventoryManagementScreen({ navigation }) {
//   const [inventory, setInventory] = useState([]);
//   const [menuItems, setMenuItems] = useState([]);
//   const [lowStockItems, setLowStockItems] = useState([]);
//   const [activeTab, setActiveTab] = useState('overview');

//   useEffect(() => {
//     const inventoryQuery = query(collection(db, 'inventory'));
//     const menuQuery = query(collection(db, 'menu'));

//     const unsubscribeInventory = onSnapshot(inventoryQuery, (snapshot) => {
//       const inventoryData = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));
//       setInventory(inventoryData);
//       checkLowStock(inventoryData, menuItems);
//     });

//     const unsubscribeMenu = onSnapshot(menuQuery, (snapshot) => {
//       const menuData = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));
//       setMenuItems(menuData);
//       checkLowStock(inventory, menuData);
//     });

//     return () => {
//       unsubscribeInventory();
//       unsubscribeMenu();
//     };
//   }, []);

//   const checkLowStock = (inventoryData, menuData) => {
//     const lowStock = [];
    
//     inventoryData.forEach(item => {
//       if (item.currentStock < item.minStock) {
//         lowStock.push(item);
        
//         // Update menu items that use this ingredient
//         menuData.forEach(menuItem => {
//           if (menuItem.ingredients && menuItem.ingredients[item.name]) {
//             updateDoc(doc(db, 'menu', menuItem.id), {
//               lowStockWarning: true
//             });
//           }
//         });
//       }
//     });
    
//     setLowStockItems(lowStock);
//   };

//   const updateStock = async (itemId, newStock) => {
//     try {
//       await updateDoc(doc(db, 'inventory', itemId), {
//         currentStock: newStock
//       });
//       Alert.alert('Success', 'Stock updated successfully');
//     } catch (error) {
//       console.error('Error updating stock:', error);
//       Alert.alert('Error', 'Failed to update stock');
//     }
//   };

//   const addInventoryItem = async (item) => {
//     try {
//       await addDoc(collection(db, 'inventory'), item);
//       Alert.alert('Success', 'Inventory item added');
//     } catch (error) {
//       console.error('Error adding inventory item:', error);
//       Alert.alert('Error', 'Failed to add inventory item');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <MaterialIcons name="arrow-back" size={28} color="#000" />
//         </TouchableOpacity>
//         <Text style={styles.title}>Inventory Management</Text>
//         <View style={{ width: 28 }} />
//       </View>

//       {/* Tabs */}
//       <View style={styles.tabContainer}>
//         <TouchableOpacity 
//           style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
//           onPress={() => setActiveTab('overview')}
//         >
//           <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
//             Overview
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//           style={[styles.tab, activeTab === 'lowstock' && styles.activeTab]}
//           onPress={() => setActiveTab('lowstock')}
//         >
//           <Text style={[styles.tabText, activeTab === 'lowstock' && styles.activeTabText]}>
//             Low Stock ({lowStockItems.length})
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//           style={[styles.tab, activeTab === 'add' && styles.activeTab]}
//           onPress={() => setActiveTab('add')}
//         >
//           <Text style={[styles.tabText, activeTab === 'add' && styles.activeTabText]}>
//             Add Item
//           </Text>
//         </TouchableOpacity>
//       </View>

//       <ScrollView style={styles.scrollView}>
//         {activeTab === 'overview' && <InventoryOverview inventory={inventory} onUpdateStock={updateStock} />}
//         {activeTab === 'lowstock' && <LowStockItems items={lowStockItems} onUpdateStock={updateStock} />}
//         {activeTab === 'add' && <AddInventoryItem onAddItem={addInventoryItem} />}
//       </ScrollView>
//     </View>
//   );
// }

// const InventoryOverview = ({ inventory, onUpdateStock }) => (
//   <View style={styles.section}>
//     <Text style={styles.sectionTitle}>Inventory Overview</Text>
//     {inventory.length === 0 ? (
//       <Text style={styles.emptyText}>No inventory items found</Text>
//     ) : (
//       inventory.map((item) => (
//         <InventoryItemCard key={item.id} item={item} onUpdateStock={onUpdateStock} />
//       ))
//     )}
//   </View>
// );

// const LowStockItems = ({ items, onUpdateStock }) => (
//   <View style={styles.section}>
//     <Text style={styles.sectionTitle}>Low Stock Items</Text>
//     {items.length === 0 ? (
//       <Text style={styles.emptyText}>No low stock items</Text>
//     ) : (
//       items.map((item) => (
//         <InventoryItemCard key={item.id} item={item} onUpdateStock={updateStock} isLowStock={true} />
//       ))
//     )}
//   </View>
// );

// const InventoryItemCard = ({ item, onUpdateStock, isLowStock = false }) => {
//   const [editMode, setEditMode] = useState(false);
//   const [newStock, setNewStock] = useState(item.currentStock?.toString() || '0');

//   const handleSave = () => {
//     const stock = parseInt(newStock);
//     if (!isNaN(stock) && stock >= 0) {
//       onUpdateStock(item.id, stock);
//       setEditMode(false);
//     } else {
//       Alert.alert('Error', 'Please enter a valid stock number');
//     }
//   };

//   const stockPercentage = item.maxStock > 0 ? (item.currentStock / item.maxStock) * 100 : 0;

//   return (
//     <View style={[styles.card, isLowStock && styles.lowStockCard]}>
//       <View style={styles.itemHeader}>
//         <View>
//           <Text style={styles.itemName}>{item.name}</Text>
//           <Text style={styles.itemCategory}>{item.category}</Text>
//         </View>
//         {isLowStock && (
//           <MaterialIcons name="warning" size={20} color="#dc3545" />
//         )}
//       </View>

//       <View style={styles.stockInfo}>
//         <Text style={styles.stockText}>
//           Stock: {item.currentStock} / {item.maxStock}
//         </Text>
//         <Text style={styles.minStockText}>Min: {item.minStock}</Text>
//       </View>

//       <View style={styles.stockBar}>
//         <View 
//           style={[
//             styles.stockLevel,
//             { 
//               width: `${Math.min(stockPercentage, 100)}%`,
//               backgroundColor: stockPercentage < 20 ? '#dc3545' : 
//                              stockPercentage < 50 ? '#ffc107' : '#28a745'
//             }
//           ]} 
//         />
//       </View>

//       {editMode ? (
//         <View style={styles.editContainer}>
//           <TextInput
//             style={styles.stockInput}
//             value={newStock}
//             onChangeText={setNewStock}
//             keyboardType="numeric"
//             placeholder="Enter stock quantity"
//           />
//           <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
//             <Text style={styles.saveButtonText}>Save</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.cancelButton} onPress={() => setEditMode(false)}>
//             <Text style={styles.cancelButtonText}>Cancel</Text>
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <TouchableOpacity 
//           style={styles.editButton}
//           onPress={() => setEditMode(true)}
//         >
//           <Text style={styles.editButtonText}>Update Stock</Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// };

// const AddInventoryItem = ({ onAddItem }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     category: '',
//     currentStock: '',
//     minStock: '',
//     maxStock: ''
//   });

//   const handleSubmit = () => {
//     if (!formData.name || !formData.currentStock || !formData.minStock || !formData.maxStock) {
//       Alert.alert('Error', 'Please fill in all required fields');
//       return;
//     }

//     onAddItem({
//       ...formData,
//       currentStock: parseInt(formData.currentStock),
//       minStock: parseInt(formData.minStock),
//       maxStock: parseInt(formData.maxStock)
//     });

//     // Reset form
//     setFormData({
//       name: '',
//       category: '',
//       currentStock: '',
//       minStock: '',
//       maxStock: ''
//     });
//   };

//   return (
//     <View style={styles.section}>
//       <Text style={styles.sectionTitle}>Add New Inventory Item</Text>
//       <View style={styles.form}>
//         <TextInput
//           style={styles.input}
//           placeholder="Item Name"
//           value={formData.name}
//           onChangeText={(text) => setFormData({...formData, name: text})}
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Category (optional)"
//           value={formData.category}
//           onChangeText={(text) => setFormData({...formData, category: text})}
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Current Stock"
//           value={formData.currentStock}
//           onChangeText={(text) => setFormData({...formData, currentStock: text})}
//           keyboardType="numeric"
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Minimum Stock"
//           value={formData.minStock}
//           onChangeText={(text) => setFormData({...formData, minStock: text})}
//           keyboardType="numeric"
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Maximum Stock"
//           value={formData.maxStock}
//           onChangeText={(text) => setFormData({...formData, maxStock: text})}
//           keyboardType="numeric"
//         />
//         <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
//           <Text style={styles.submitButtonText}>Add Inventory Item</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };
// screens/InventoryManagementScreen.js
import { MaterialIcons } from '@expo/vector-icons';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  writeBatch
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { db } from '../../firebase';

export default function InventoryManagementScreen({ navigation }) {
  const [inventory, setInventory] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMenuItems, setSelectedMenuItems] = useState([]);
  const [ingredientUsageModal, setIngredientUsageModal] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(null);

  useEffect(() => {
    const inventoryQuery = query(collection(db, 'inventory'));
    const menuQuery = query(collection(db, 'menu'));

    const unsubscribeInventory = onSnapshot(inventoryQuery, (snapshot) => {
      const inventoryData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setInventory(inventoryData);
      checkLowStock(inventoryData, menuItems);
    });

    const unsubscribeMenu = onSnapshot(menuQuery, (snapshot) => {
      const menuData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMenuItems(menuData);
      checkLowStock(inventory, menuData);
    });

    return () => {
      unsubscribeInventory();
      unsubscribeMenu();
    };
  }, []);

  const checkLowStock = (inventoryData, menuData) => {
    const lowStock = [];
    
    inventoryData.forEach(item => {
      if (item.currentStock < item.minStock) {
        lowStock.push(item);
        
        // Update menu items that use this ingredient
        menuData.forEach(menuItem => {
          if (menuItem.ingredients && menuItem.ingredients[item.name]) {
            updateDoc(doc(db, 'menu', menuItem.id), {
              lowStockWarning: true
            });
          }
        });
      }
    });
    
    setLowStockItems(lowStock);
  };

  const updateStock = async (itemId, newStock) => {
    try {
      await updateDoc(doc(db, 'inventory', itemId), {
        currentStock: newStock
      });
      
      // Update menu item availability based on new stock
      await updateMenuAvailability();
      
      Alert.alert('Success', 'Stock updated successfully');
    } catch (error) {
      console.error('Error updating stock:', error);
      Alert.alert('Error', 'Failed to update stock');
    }
  };

  // NEW: Update menu item availability based on inventory
  const updateMenuAvailability = async () => {
    const batch = writeBatch(db);
    
    menuItems.forEach(menuItem => {
      const isAvailable = checkMenuItemAvailability(menuItem);
      const menuRef = doc(db, 'menu', menuItem.id);
      batch.update(menuRef, { 
        available: isAvailable,
        lowStockWarning: !isAvailable
      });
    });
    
    try {
      await batch.commit();
    } catch (error) {
      console.error('Error updating menu availability:', error);
    }
  };

  // NEW: Check if a menu item can be made with current inventory
  const checkMenuItemAvailability = (menuItem) => {
    if (!menuItem.ingredients) return true;
    
    for (const [ingredientName, quantityRequired] of Object.entries(menuItem.ingredients)) {
      const inventoryItem = inventory.find(item => item.name === ingredientName);
      if (!inventoryItem || inventoryItem.currentStock < quantityRequired) {
        return false;
      }
    }
    return true;
  };

  // NEW: Get menu items that use a specific ingredient
  const getMenuItemsUsingIngredient = (ingredientName) => {
    return menuItems.filter(menuItem => 
      menuItem.ingredients && menuItem.ingredients[ingredientName]
    );
  };

  // NEW: Show which menu items are affected by an ingredient
  const showIngredientUsage = (ingredient) => {
    const affectedMenuItems = getMenuItemsUsingIngredient(ingredient.name);
    setSelectedIngredient(ingredient);
    setSelectedMenuItems(affectedMenuItems);
    setIngredientUsageModal(true);
  };

  // NEW: Quick stock adjustment buttons
  const quickAdjustStock = async (itemId, adjustment) => {
    const item = inventory.find(i => i.id === itemId);
    if (!item) return;

    const newStock = Math.max(0, item.currentStock + adjustment);
    await updateStock(itemId, newStock);
  };

  // NEW: Mark ingredient as out of stock
  const markOutOfStock = async (itemId) => {
    await updateStock(itemId, 0);
    Alert.alert('Out of Stock', 'Item marked as out of stock. Related menu items will be updated.');
  };

  // NEW: Restock ingredient to maximum
  const restockToMax = async (itemId) => {
    const item = inventory.find(i => i.id === itemId);
    if (!item) return;

    await updateStock(itemId, item.maxStock);
    Alert.alert('Restocked', 'Item restocked to maximum level');
  };

  const addInventoryItem = async (item) => {
    try {
      await addDoc(collection(db, 'inventory'), item);
      Alert.alert('Success', 'Inventory item added');
    } catch (error) {
      console.error('Error adding inventory item:', error);
      Alert.alert('Error', 'Failed to add inventory item');
    }
  };

  // NEW: Delete inventory item
  const deleteInventoryItem = async (itemId) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this inventory item?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'inventory', itemId));
              Alert.alert('Success', 'Inventory item deleted');
            } catch (error) {
              console.error('Error deleting item:', error);
              Alert.alert('Error', 'Failed to delete inventory item');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Inventory Management</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
            Overview
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'lowstock' && styles.activeTab]}
          onPress={() => setActiveTab('lowstock')}
        >
          <Text style={[styles.tabText, activeTab === 'lowstock' && styles.activeTabText]}>
            Low Stock ({lowStockItems.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'add' && styles.activeTab]}
          onPress={() => setActiveTab('add')}
        >
          <Text style={[styles.tabText, activeTab === 'add' && styles.activeTabText]}>
            Add Item
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {activeTab === 'overview' && (
          <InventoryOverview 
            inventory={inventory} 
            onUpdateStock={updateStock}
            onQuickAdjust={quickAdjustStock}
            onMarkOutOfStock={markOutOfStock}
            onRestock={restockToMax}
            onShowUsage={showIngredientUsage}
            onDeleteItem={deleteInventoryItem}
          />
        )}
        {activeTab === 'lowstock' && (
          <LowStockItems 
            items={lowStockItems} 
            onUpdateStock={updateStock}
            onQuickAdjust={quickAdjustStock}
            onRestock={restockToMax}
            onShowUsage={showIngredientUsage}
          />
        )}
        {activeTab === 'add' && <AddInventoryItem onAddItem={addInventoryItem} />}
      </ScrollView>

      {/* Ingredient Usage Modal */}
      <Modal
        visible={ingredientUsageModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIngredientUsageModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Menu Items Using {selectedIngredient?.name}
              </Text>
              <TouchableOpacity onPress={() => setIngredientUsageModal(false)}>
                <MaterialIcons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            
            <ScrollView>
              {selectedMenuItems.length === 0 ? (
                <Text style={styles.emptyText}>No menu items use this ingredient</Text>
              ) : (
                selectedMenuItems.map(menuItem => (
                  <View key={menuItem.id} style={styles.menuItemCard}>
                    <Text style={styles.menuItemName}>{menuItem.name}</Text>
                    <Text style={styles.ingredientQuantity}>
                      Uses: {menuItem.ingredients[selectedIngredient.name]} units
                    </Text>
                    <View style={[
                      styles.availabilityBadge,
                      { backgroundColor: menuItem.available ? '#28a745' : '#dc3545' }
                    ]}>
                      <Text style={styles.availabilityText}>
                        {menuItem.available ? 'Available' : 'Out of Stock'}
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const InventoryOverview = ({ 
  inventory, 
  onUpdateStock, 
  onQuickAdjust, 
  onMarkOutOfStock, 
  onRestock, 
  onShowUsage,
  onDeleteItem 
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Inventory Overview</Text>
    {inventory.length === 0 ? (
      <Text style={styles.emptyText}>No inventory items found</Text>
    ) : (
      inventory.map((item) => (
        <InventoryItemCard 
          key={item.id} 
          item={item} 
          onUpdateStock={onUpdateStock}
          onQuickAdjust={onQuickAdjust}
          onMarkOutOfStock={onMarkOutOfStock}
          onRestock={onRestock}
          onShowUsage={onShowUsage}
          onDeleteItem={onDeleteItem}
        />
      ))
    )}
  </View>
);

const LowStockItems = ({ items, onUpdateStock, onQuickAdjust, onRestock, onShowUsage }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Low Stock Items</Text>
      <TouchableOpacity 
        style={styles.bulkRestockButton}
        onPress={() => items.forEach(item => onRestock(item.id))}
      >
        <Text style={styles.bulkRestockText}>Restock All</Text>
      </TouchableOpacity>
    </View>
    {items.length === 0 ? (
      <Text style={styles.emptyText}>No low stock items</Text>
    ) : (
      items.map((item) => (
        <InventoryItemCard 
          key={item.id} 
          item={item} 
          onUpdateStock={onUpdateStock}
          onQuickAdjust={onQuickAdjust}
          onRestock={onRestock}
          onShowUsage={onShowUsage}
          isLowStock={true}
        />
      ))
    )}
  </View>
);

const InventoryItemCard = ({ 
  item, 
  onUpdateStock, 
  onQuickAdjust, 
  onMarkOutOfStock, 
  onRestock, 
  onShowUsage,
  onDeleteItem,
  isLowStock = false 
}) => {
  const [editMode, setEditMode] = useState(false);
  const [newStock, setNewStock] = useState(item.currentStock?.toString() || '0');

  const handleSave = () => {
    const stock = parseInt(newStock);
    if (!isNaN(stock) && stock >= 0) {
      onUpdateStock(item.id, stock);
      setEditMode(false);
    } else {
      Alert.alert('Error', 'Please enter a valid stock number');
    }
  };

  const stockPercentage = item.maxStock > 0 ? (item.currentStock / item.maxStock) * 100 : 0;

  return (
    <View style={[styles.card, isLowStock && styles.lowStockCard]}>
      <View style={styles.itemHeader}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemCategory}>{item.category}</Text>
        </View>
        <View style={styles.headerActions}>
          {isLowStock && (
            <MaterialIcons name="warning" size={20} color="#dc3545" />
          )}
          <TouchableOpacity onPress={() => onShowUsage(item)}>
            <MaterialIcons name="info" size={20} color="#007bff" />
          </TouchableOpacity>
          {onDeleteItem && (
            <TouchableOpacity onPress={() => onDeleteItem(item.id)}>
              <MaterialIcons name="delete" size={20} color="#dc3545" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.stockInfo}>
        <Text style={styles.stockText}>
          Stock: {item.currentStock} / {item.maxStock}
        </Text>
        <Text style={styles.minStockText}>Min: {item.minStock}</Text>
      </View>

      <View style={styles.stockBar}>
        <View 
          style={[
            styles.stockLevel,
            { 
              width: `${Math.min(stockPercentage, 100)}%`,
              backgroundColor: stockPercentage < 20 ? '#dc3545' : 
                             stockPercentage < 50 ? '#ffc107' : '#28a745'
            }
          ]} 
        />
      </View>

      {/* Quick Action Buttons */}
      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.quickButton}
          onPress={() => onQuickAdjust(item.id, -1)}
        >
          <Text style={styles.quickButtonText}>-1</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.quickButton}
          onPress={() => onQuickAdjust(item.id, -5)}
        >
          <Text style={styles.quickButtonText}>-5</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.quickButton}
          onPress={() => onQuickAdjust(item.id, 1)}
        >
          <Text style={styles.quickButtonText}>+1</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.quickButton}
          onPress={() => onQuickAdjust(item.id, 5)}
        >
          <Text style={styles.quickButtonText}>+5</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.quickButton, styles.outOfStockButton]}
          onPress={() => onMarkOutOfStock(item.id)}
        >
          <Text style={styles.quickButtonText}>Out</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.quickButton, styles.restockButton]}
          onPress={() => onRestock(item.id)}
        >
          <Text style={styles.quickButtonText}>Max</Text>
        </TouchableOpacity>
      </View>

      {editMode ? (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.stockInput}
            value={newStock}
            onChangeText={setNewStock}
            keyboardType="numeric"
            placeholder="Enter stock quantity"
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setEditMode(false)}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => setEditMode(true)}
        >
          <Text style={styles.editButtonText}>Update Stock</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// AddInventoryItem component remains the same...
const AddInventoryItem = ({ onAddItem }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    currentStock: '',
    minStock: '',
    maxStock: ''
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.currentStock || !formData.minStock || !formData.maxStock) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    onAddItem({
      ...formData,
      currentStock: parseInt(formData.currentStock),
      minStock: parseInt(formData.minStock),
      maxStock: parseInt(formData.maxStock)
    });

    // Reset form
    setFormData({
      name: '',
      category: '',
      currentStock: '',
      minStock: '',
      maxStock: ''
    });
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Add New Inventory Item</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Item Name *"
          value={formData.name}
          onChangeText={(text) => setFormData({...formData, name: text})}
        />
        <TextInput
          style={styles.input}
          placeholder="Category (optional)"
          value={formData.category}
          onChangeText={(text) => setFormData({...formData, category: text})}
        />
        <TextInput
          style={styles.input}
          placeholder="Current Stock *"
          value={formData.currentStock}
          onChangeText={(text) => setFormData({...formData, currentStock: text})}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Minimum Stock *"
          value={formData.minStock}
          onChangeText={(text) => setFormData({...formData, minStock: text})}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Maximum Stock *"
          value={formData.maxStock}
          onChangeText={(text) => setFormData({...formData, maxStock: text})}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Add Inventory Item</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 20,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#ff6b35',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lowStockCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#dc3545',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  itemCategory: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  stockInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stockText: {
    fontSize: 14,
    color: '#000',
  },
  minStockText: {
    fontSize: 12,
    color: '#666',
  },
  stockBar: {
    height: 6,
    backgroundColor: '#eee',
    borderRadius: 3,
    marginBottom: 10,
    overflow: 'hidden',
  },
  stockLevel: {
    height: '100%',
    borderRadius: 3,
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: '#28a745',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#ff6b35',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#ff6b35',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // ... keep all existing styles and add these new ones:
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  bulkRestockButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  bulkRestockText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  itemInfo: {
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 4,
  },
  quickButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  quickButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#495057',
  },
  outOfStockButton: {
    backgroundColor: '#dc3545',
  },
  restockButton: {
    backgroundColor: '#28a745',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
  },
  menuItemCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
  },
  menuItemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  ingredientQuantity: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  availabilityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  availabilityText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },

});

// // ... keep all existing style definitions
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f0e6',
//     paddingHorizontal: 16,
//     paddingTop: 40,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#000',
//   },
//   tabContainer: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     marginBottom: 20,
//     padding: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   tab: {
//     flex: 1,
//     paddingVertical: 8,
//     alignItems: 'center',
//     borderRadius: 6,
//   },
//   activeTab: {
//     backgroundColor: '#ff6b35',
//   },
//   tabText: {
//     fontSize: 12,
//     fontWeight: '500',
//     color: '#666',
//     textAlign: 'center',
//   },
//   activeTabText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   scrollView: {
//     flex: 1,
//   },
//   section: {
//     marginBottom: 20,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#000',
//     marginBottom: 15,
//   },
//   emptyText: {
//     textAlign: 'center',
//     color: '#666',
//     fontSize: 16,
//     marginTop: 20,
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     padding: 15,
//     marginVertical: 6,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   lowStockCard: {
//     borderLeftWidth: 4,
//     borderLeftColor: '#dc3545',
//   },
//   itemHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   itemName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#000',
//   },
//   itemCategory: {
//     fontSize: 12,
//     color: '#666',
//     marginTop: 2,
//     textTransform: 'capitalize',
//   },
//   stockInfo: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 8,
//   },
//   stockText: {
//     fontSize: 14,
//     color: '#000',
//   },
//   minStockText: {
//     fontSize: 12,
//     color: '#666',
//   },
//   stockBar: {
//     height: 6,
//     backgroundColor: '#eee',
//     borderRadius: 3,
//     marginBottom: 10,
//     overflow: 'hidden',
//   },
//   stockLevel: {
//     height: '100%',
//     borderRadius: 3,
//   },
//   editContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   stockInput: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 4,
//     padding: 8,
//     marginRight: 8,
//   },
//   saveButton: {
//     backgroundColor: '#28a745',
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 4,
//     marginRight: 8,
//   },
//   saveButtonText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   cancelButton: {
//     backgroundColor: '#6c757d',
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 4,
//   },
//   cancelButtonText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   editButton: {
//     backgroundColor: '#ff6b35',
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 4,
//     alignItems: 'center',
//   },
//   editButtonText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   form: {
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     padding: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 4,
//     padding: 12,
//     marginBottom: 12,
//     fontSize: 14,
//   },
//   submitButton: {
//     backgroundColor: '#ff6b35',
//     paddingVertical: 12,
//     borderRadius: 4,
//     alignItems: 'center',
//   },
//   submitButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });