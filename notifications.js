// notifications.js
import messaging from '@react-native-firebase/messaging';

export const setupOrderNotifications = () => {
  // Request permission
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    return authStatus === messaging.AuthorizationStatus.AUTHORIZED;
  };

  // Handle background notifications
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Background notification:', remoteMessage);
  });

  // Handle foreground notifications
  const unsubscribe = messaging().onMessage(async (remoteMessage) => {
    Alert.alert(
      remoteMessage.notification.title,
      remoteMessage.notification.body
    );
  });

  return unsubscribe;
};

// Function to send ready notification
export const sendOrderReadyNotification = async (userId, orderId) => {
  // This would be called from your backend or cloud function
  // Implementation depends on your notification service
};