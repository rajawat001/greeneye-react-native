// src/screens/ProfileScreen.js
import React from "react";
import Layout from "../components/Layout";
import Profile from "../components/Profile";
import { ScrollView } from "react-native";

export default function ProfileScreen() {
  return (
     <Layout>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <Profile />
      </ScrollView>
    </Layout>
  );
}
