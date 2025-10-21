import { StyleSheet, Text, View } from 'react-native';

export default function PersonalDetails({ route }) {
  const { userDetails } = route.params || {};

  if (!userDetails) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Personal Details</Text>
        <Text>No user details available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Personal Details</Text>
      {userDetails.displayName && (
        <Text style={styles.detail}>Name: {userDetails.displayName}</Text>
      )}
      {userDetails.firstName && (
        <Text style={styles.detail}>First Name: {userDetails.firstName}</Text>
      )}
      {userDetails.lastName && (
        <Text style={styles.detail}>Last Name: {userDetails.lastName}</Text>
      )}
      <Text style={styles.detail}>Email: {userDetails.email}</Text>
      {/* Add more fields as needed */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  detail: { fontSize: 16, marginBottom: 10 },
});
