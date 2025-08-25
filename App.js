// App.js

import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { SafeAreaView, StyleSheet } from 'react-native';
import i18n from './src/utils/i18n';
import RootNavigator from './src/navigation/RootNavigator';
import { NotificationProvider } from './src/components/NotificationProvider';
import { colors } from './src/theme';
import * as Linking from 'expo-linking';

const prefix = Linking.createURL('/');

export default function App() {
  const linking = {
    prefixes: [
      'https://nextjs-greeneye-app-77z3.vercel.app',
      'greeneye://'
    ],
    config: {
      screens: {
        Home: '',
        PlantDetails: 'plants/:id',
        Blog: 'blog',
        BlogDetail: 'blog/:slug',
        Programs: 'programs',
        Impact: 'impact',
        Volunteer: 'volunteer',
        Donate: 'donate',
        Contact: 'contact',
        // and so on for your other screens if you want them deep-linkable
      },
    },
  };

  return (
    <I18nextProvider i18n={i18n}>
      <NotificationProvider>
        <SafeAreaView style={styles.safeArea}>
          <RootNavigator linking={linking} />
        </SafeAreaView>
      </NotificationProvider>
    </I18nextProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
