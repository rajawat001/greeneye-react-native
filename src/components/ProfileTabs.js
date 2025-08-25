// src/components/ProfileTabs.js
import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

export default function ProfileTabs() {
  const navigation = useNavigation();
  const route = useRoute();
  const { t } = useTranslation();

  const tabs = [
    { name: "Profile", label: t("profileTabs.profile") },
    { name: "MyOrders", label: t("profileTabs.myOrders") },
    { name: "MyDonation", label: t("profileTabs.myDonation") },
  ];

  return (
    <View style={styles.tabRow}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.name}
          onPress={() => navigation.navigate(tab.name)}
          style={[
            styles.tab,
            route.name === tab.name && styles.tabActive
          ]}
        >
          <Text
            style={[
              styles.tabText,
              route.name === tab.name && styles.tabTextActive
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#eee",
    marginTop: 5,
    marginBottom: 10,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 3,
    borderColor: "transparent",
  },
  tabActive: {
    borderColor: "#388e3c",
  },
  tabText: {
    fontWeight: "600",
    color: "#222",
    fontSize: 15,
  },
  tabTextActive: {
    color: "#388e3c",
  },
});