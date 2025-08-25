// src/components/Layout.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Navbar from './Navbar';
import { SafeAreaView } from 'react-native-safe-area-context';
import FooterNavBar from './FooterNavBar';

const Layout = ({ children }) => {
  return (
    <SafeAreaView style={styles.container}>     
      <Navbar />
      <View style={styles.content}>
        {children}
      </View>
      <FooterNavBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1 },
});

export default Layout;