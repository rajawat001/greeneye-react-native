import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { colors } from '../theme';

const tabs = [
  {
    key: 'Home',
    icon: '🏠',
    labelKey: 'navbar.home',
    route: 'Home',
  },
  {
    key: 'Volunteer',
    icon: '🤝',
    labelKey: 'navbar.volunteer',
    route: 'Volunteer',
  },
  {
    key: 'Donate',
    icon: '🌱',
    labelKey: 'navbar.donate',
    route: 'Donate',
  },
  {
    key: 'Blog',
    icon: '📝',
    labelKey: 'navbar.blog',
    route: 'Blog',
  },
];

export default function FooterNavBar() {
  const navigation = useNavigation();
  const route = useRoute();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {tabs.map(tab => {
        const isActive = route.name === tab.route;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => {
              if (!isActive) navigation.navigate(tab.route);
            }}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.icon,
              isActive && { color: colors.primaryGreen }
            ]}>
              {tab.icon}
            </Text>
            <Text style={[
              styles.label,
              isActive && { color: colors.primaryGreen, fontWeight: '700' }
            ]}>
              {t(tab.labelKey)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#fff',
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 4,
    paddingHorizontal: 6,
  },
  tab: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 2,
  },
  icon: {
    fontSize: 22,
    color: colors.darkGray || '#888',
    marginBottom: 2,
  },
  label: {
    fontSize: 13,
    color: colors.darkGray || '#888',
    marginTop: 1,
  },
});
