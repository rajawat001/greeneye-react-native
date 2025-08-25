// src/components/NotificationProvider.js
import React, { createContext, useState, useContext, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';

const NotificationContext = createContext();

export function useNotification() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const [notif, setNotif] = useState(null);

  const showNotification = useCallback((message, type = 'info') => {
    setNotif({ message, type });
    setTimeout(() => setNotif(null), 5000);
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notif && (
        <View style={[styles.notification, styles[notif.type]]}>
          <Text style={styles.message}>{notif.message}</Text>
          <TouchableOpacity onPress={() => setNotif(null)}>
            <Text style={styles.close}>×</Text>
          </TouchableOpacity>
        </View>
      )}
    </NotificationContext.Provider>
  );
}

const styles = StyleSheet.create({
  notification: {
    position: 'absolute',
    top: 60,
    right: 10,
    left: 10,
    padding: 15,
    borderRadius: 8,
    zIndex: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#444',
    justifyContent: 'space-between',
  },
  info: { backgroundColor: '#444' },
  success: { backgroundColor: '#28a745' },
  error: { backgroundColor: '#dc3545' },
  warning: { backgroundColor: '#ffc107' },
  message: { color: '#fff', flex: 1 },
  close: { marginLeft: 15, color: '#fff', fontSize: 18 },
});