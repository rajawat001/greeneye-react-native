// src/screens/MyOrdersScreen.js
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
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import ProfileTabs from "../components/ProfileTabs";
import Layout from "../components/Layout";

export default function MyOrdersScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        navigation.replace("Login");
        return;
      }
      try {
        const { data } = await axios.get(
          `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/orders/myorders`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrders(data || []);
      } catch (e) {
        // You could show a notification here
      }
      setLoading(false);
    };
    fetchOrders();
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#388e3c" />
        <Text style={{ marginTop: 12 }}>{t("myOrders.loading")}</Text>
      </View>
    );
  }

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.container}>
        <ProfileTabs />
        <Text style={styles.heading}>📦 {t("myOrders.heading")}</Text>
        {!orders.length ? (
          <Text style={{ color: "#888", marginTop: 30 }}>{t("myOrders.notFound")}</Text>
        ) : (
          orders.map((order) => (
            <TouchableOpacity
              key={order._id}
              style={styles.card}
              activeOpacity={0.85}
              onPress={() => navigation.navigate("OrderDetails", { id: order._id })}
            >
              <Text style={styles.cardTitle}>
                {t("myOrders.order")} #{order._id.slice(-6).toUpperCase()}
              </Text>
              <Text style={styles.cardInfo}>
                {t("myOrders.placed")}: {new Date(order.createdAt).toLocaleString()}
              </Text>
              <Text style={styles.cardInfo}>
                {t("myOrders.items")}: {order.orderItems.length}
              </Text>
              <Text>
                <Text style={{ fontWeight: "500" }}>{t("myOrders.status")}:</Text>{" "}
                <Text
                  style={{
                    color: order.isDelivered ? "#388e3c" : "#b62222",
                    fontWeight: "600",
                  }}
                >
                  {order.isDelivered ? t("myOrders.delivered") : t("myOrders.pending")}
                </Text>
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    maxWidth: 600,
    alignSelf: "center",
    width: "100%",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  heading: {
    marginTop: 18,
    marginBottom: 20,
    fontWeight: "bold",
    fontSize: 20,
    color: "#388e3c",
    letterSpacing: 1.1,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 3,
  },
  cardInfo: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
});