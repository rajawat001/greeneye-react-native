// src/screens/DonationDetailsScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";

export default function DonationDetailsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params || {};

  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchDonation = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        navigation.replace("Login");
        return;
      }
      try {
        const { data } = await axios.get(
          `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/donations/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDonation(data);
      } catch (e) {
        // You could show a notification here
      }
      setLoading(false);
    };
    fetchDonation();
  }, [id, navigation]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#388e3c" />
        <Text style={{ marginTop: 12 }}>{t("donationDetails.loading")}</Text>
      </View>
    );
  }

  if (!donation) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "#b62222" }}>{t("donationDetails.notFound")}</Text>
      </View>
    );
  }

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: "#388e3c", fontSize: 15 }}>← {t("donationDetails.backToDonations")}</Text>
        </TouchableOpacity>
        <View style={styles.card}>
          <Text style={styles.heading}>
            {t("donationDetails.donation")} #{donation._id.slice(-6).toUpperCase()}
          </Text>
          <Text style={styles.subInfo}>
            {t("donationDetails.date")}: {new Date(donation.createdAt).toLocaleString()}
          </Text>
          <Text style={{ marginBottom: 10 }}>
            <Text style={{ fontWeight: "600" }}>{t("donationDetails.amount")}:</Text> ₹{donation.amount}
          </Text>
          <Text style={{ marginBottom: 10 }}>
            <Text style={{ fontWeight: "600" }}>{t("donationDetails.status")}:</Text>{" "}
            <Text
              style={{
                color: donation.isPaid ? "#388e3c" : "#b62222",
                fontWeight: "600",
              }}
            >
              {donation.isPaid ? t("donationDetails.paid") : t("donationDetails.pending")}
            </Text>
          </Text>
          <Text style={{ marginBottom: 10 }}>
            <Text style={{ fontWeight: "600" }}>{t("donationDetails.name")}:</Text> {donation.donorName}
          </Text>
          <Text style={{ marginBottom: 10 }}>
            <Text style={{ fontWeight: "600" }}>{t("donationDetails.email")}:</Text> {donation.donorEmail}
          </Text>
          <Text>
            <Text style={{ fontWeight: "600" }}>{t("donationDetails.phone")}:</Text> {donation.donorPhone}
          </Text>
        </View>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    maxWidth: 600,
    alignSelf: "center",
    width: "100%",
    paddingBottom: 50,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  backButton: {
    marginBottom: 18,
    alignSelf: "flex-start",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    marginBottom: 30,
  },
  heading: { fontSize: 20, fontWeight: "bold", marginBottom: 6, color: "#388e3c" },
  subInfo: { color: "#888", fontSize: 14, marginBottom: 10 },
});