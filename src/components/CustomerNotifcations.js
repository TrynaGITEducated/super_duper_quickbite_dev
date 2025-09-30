// components/CustomerNotifications.js
import { collection, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { auth, db } from '../firebase';

const CustomerNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!auth.currentUser) return;

    const notificationsQuery = query(
      collection(db, 'notifications'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
      const notificationsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setNotifications(notificationsData);
      setUnreadCount(notificationsData.filter(n => !n.read).length);
    });

    return unsubscribe;
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await updateDoc(notificationRef, { read: true });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.read);
      await Promise.all(
        unreadNotifications.map(n => 
          updateDoc(doc(db, 'notifications', n.id), { read: true })
        )
      );
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  return (
    <div className="notifications-panel">
      <div className="notifications-header">
        <h3>Notifications ({unreadCount})</h3>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead} className="mark-all-read">
            Mark all as read
          </button>
        )}
      </div>
      
      <div className="notifications-list">
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className={`notification-item ${notification.read ? 'read' : 'unread'}`}
            onClick={() => markAsRead(notification.id)}
          >
            <div className="notification-icon">
              {notification.type === 'order_ready' ? '✅' : 'ℹ️'}
            </div>
            <div className="notification-content">
              <strong>{notification.title}</strong>
              <p>{notification.message}</p>
              <small>
                {new Date(notification.timestamp?.toDate()).toLocaleString()}
              </small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerNotifications;