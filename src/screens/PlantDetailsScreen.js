// src/screens/PlantDetailsScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import axios from "axios";
import useCart from "../components/cart/useCart";
import CartDrawer from "../components/cart/CartDrawer";
import { useTranslation } from "react-i18next";

const IMAGE_PREFIX = "https://nextjs-greeneye-app-77z3.vercel.app/";

export default function PlantDetailsScreen() {
  const { t } = useTranslation();
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params || {};

  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const {
    cart,
    total,
    open,
    setOpen,
    addToCart,
    removeFromCart,
    changeQty,
  } = useCart();

  useEffect(() => {
    if (!id) return;
    const fetchPlant = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/plants/${encodeURIComponent(id)}`
        );
        setPlant(data?.plant || data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPlant();
  }, [id]);

  if (loading)
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#388e3c" />
        <Text style={{ marginTop: 8 }}>{t("plant.loading")}</Text>
      </View>
    );

  if (error || !plant?._id)
    return (
      <View style={styles.centered}>
        <Text style={{ color: "#b62222" }}>{t("plant.notFound")}</Text>
      </View>
    );

  const imageUrl = plant.image?.startsWith("http")
    ? plant.image
    : IMAGE_PREFIX + plant.image;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f7f9fc" }}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginBottom: 12 }}
        >
          <Text style={{ color: "#388e3c", fontWeight: "600" }}>
            ← {t("plant.backToShop")}
          </Text>
        </TouchableOpacity>

        <View style={styles.grid}>
          {/* LEFT IMAGE */}
          <View style={styles.imageBox}>
            {plant.image ? (
              <Image
                source={{ uri: imageUrl }}
                style={styles.img}
                resizeMode="contain"
              />
            ) : (
              <Text style={{ fontSize: 90, color: "#b6ccb9" }}>🌱</Text>
            )}
          </View>

          {/* RIGHT DETAILS */}
          <View style={styles.detailBox}>
            <Text style={styles.title}>{plant.name}</Text>
            <View style={styles.priceRow}>
              <Text style={styles.price}>₹{Number(plant.price || 0).toLocaleString()}</Text>
              {plant.countInStock ? (
                <Text style={styles.inStock}>• {t("plant.inStock")}</Text>
              ) : (
                <Text style={styles.outOfStock}>• {t("plant.outOfStock")}</Text>
              )}
            </View>
            <Text style={styles.desc}>{plant.description || t("plant.noDescription")}</Text>
            <View style={styles.infoGrid}>
              <Text>
                <Text style={styles.infoLabel}>{t("plant.sku")}:</Text> {plant.sku || "-"}
              </Text>
              <Text>
                <Text style={styles.infoLabel}>{t("plant.category")}:</Text> {plant.category || t("plant.defaultCategory")}
              </Text>
              <Text>
                <Text style={styles.infoLabel}>{t("plant.brand")}:</Text> {plant.brand || "-"}
              </Text>
              <Text>
                <Text style={styles.infoLabel}>{t("plant.availableCountries")}:</Text>{" "}
                {Array.isArray(plant.country) && plant.country.length
                  ? plant.country.join(", ")
                  : "-"}
              </Text>
            </View>
            <View style={styles.btnRow}>
              <TouchableOpacity
                style={styles.addBtn}
                onPress={async () => {
                  try {
                    await addToCart(plant);
                    Alert.alert(t("plant.addedToCart"));
                  } catch (e) {
                    if (e?.message === "LOGIN_REQUIRED") Alert.alert(t("plant.pleaseLogin"));
                    else Alert.alert(t("plant.addFailed"));
                  }
                }}
              >
                <Text style={styles.addBtnText}>＋ {t("plant.addToCart")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cartBtn}
                onPress={() => setOpen(true)}
              >
                <Text style={styles.cartBtnText}>🛒 {t("plant.viewCart")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <CartDrawer
          open={open}
          onClose={() => setOpen(false)}
          cart={cart}
          changeQty={changeQty}
          removeFromCart={removeFromCart}
          total={total}
          t={t}
        />
      </View>
    </ScrollView>
  );
}

// Styles remain unchanged
const styles = StyleSheet.create({
  centered: {
    flex: 1,
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f7f9fc",
  },
  container: {
    maxWidth: 1100,
    width: "100%",
    alignSelf: "center",
    padding: 18,
    backgroundColor: "#f7f9fc",
    minHeight: 680,
  },
  grid: {
    flexDirection: "row",
    gap: 18,
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  imageBox: {
    backgroundColor: "#f4f7f3",
    borderRadius: 16,
    minHeight: 220,
    minWidth: 180,
    maxWidth: 330,
    width: "44%",
    flex: 1.1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    padding: 20,
    marginRight: 10,
  },
  img: {
    width: "100%",
    height: 180,
    borderRadius: 13,
  },
  detailBox: {
    backgroundColor: "#fff",
    borderColor: "#b6ccb9",
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    flex: 1,
    minWidth: 230,
    maxWidth: 450,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 7,
    elevation: 2,
    marginLeft: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#388e3c",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 7,
  },
  price: {
    color: "#388e3c",
    fontWeight: "bold",
    fontSize: 21,
  },
  inStock: {
    color: "#2e7d32",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 7,
  },
  outOfStock: {
    color: "#b62222",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 7,
  },
  desc: {
    marginTop: 6,
    color: "#555",
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 10,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 17,
    justifyContent: "flex-start",
  },
  infoLabel: { fontWeight: "bold" },
  btnRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 22,
  },
  addBtn: {
    backgroundColor: "#4caf50",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginRight: 12,
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  cartBtn: {
    backgroundColor: "#fff",
    borderColor: "#388e3c",
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  cartBtnText: {
    color: "#388e3c",
    fontWeight: "600",
    fontSize: 15,
  },
});
