// src/screens/OrderDetailsScreen.js
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

export default function OrderDetailsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params || {};

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchOrder = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        navigation.replace("Login");
        return;
      }
      try {
        const { data } = await axios.get(
          `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/orders/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrder(data);
      } catch (e) {
        // You could show a notification here
      }
      setLoading(false);
    };
    fetchOrder();
  }, [id, navigation]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#388e3c" />
        <Text style={{ marginTop: 12 }}>{t("orderDetails.loading")}</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "#b62222" }}>{t("orderDetails.notFound")}</Text>
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
          <Text style={{ color: "#388e3c", fontSize: 15 }}>← {t("orderDetails.backToOrders")}</Text>
        </TouchableOpacity>
        <View style={styles.card}>
          <Text style={styles.heading}>
            {t("orderDetails.order")} #{order._id.slice(-6).toUpperCase()}
          </Text>
          <Text style={styles.subInfo}>
            {t("orderDetails.placed")}: {new Date(order.createdAt).toLocaleString()}
          </Text>
          <Text style={{ marginBottom: 12 }}>
            <Text style={{ fontWeight: "600" }}>{t("orderDetails.status")}: </Text>
            <Text
              style={{
                color: order.isDelivered ? "#388e3c" : "#b62222",
                fontWeight: "600",
              }}
            >
              {order.isDelivered ? t("orderDetails.delivered") : t("orderDetails.pending")}
            </Text>
          </Text>

          {/* Payment Status */}
          <Text style={{ marginBottom: 12 }}>
            <Text style={{ fontWeight: "600" }}>{t("orderDetails.paymentStatus")}: </Text>
            <Text
              style={{
                color: order.isPaid ? "#388e3c" : "#b62222",
                fontWeight: "600",
              }}
            >
              {order.isPaid ? t("orderDetails.paid") : t("orderDetails.notPaid")}
            </Text>
          </Text>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontWeight: "600" }}>{t("orderDetails.shippingAddress")}:</Text>
            <Text>{order.shippingAddress?.name}</Text>
            <Text>{order.shippingAddress?.address}</Text>
            <Text>
              {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}
            </Text>
            <Text>
              {t("orderDetails.phone")}: {order.shippingAddress?.phone}
            </Text>
          </View>

          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontWeight: "600" }}>{t("orderDetails.items")}:</Text>
            {order.orderItems.map((item) => (
              <Text key={item._id} style={{ marginLeft: 6, marginBottom: 4 }}>
                - {item.name || t("orderDetails.product")} x {item.quantity}{" "}
                <Text style={{ color: "#388e3c" }}>
                  ₹{item.price * item.quantity}
                </Text>
              </Text>
            ))}
          </View>

          <Text style={{ marginTop: 8, fontWeight: "600" }}>
            {t("orderDetails.total")}: ₹
            {order.orderItems.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            )}
          </Text>
          <Text style={{ marginTop: 8 }}>
            {t("orderDetails.payment")}: <Text style={{ fontWeight: "600" }}>{order.paymentMethod}</Text>
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