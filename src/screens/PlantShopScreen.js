// src/screens/PlantShopScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import useCart from "../components/cart/useCart";
import CartDrawer from "../components/cart/CartDrawer";
import Slider from "@react-native-community/slider";
import { useNotification } from "../components/NotificationProvider";

const IMAGE_PREFIX = "https://nextjs-greeneye-app-77z3.vercel.app/";

const formatPrice = (price = 0) => `₹${Number(price).toLocaleString()}`;

export default function PlantShopScreen() {
  const { t } = useTranslation();
  const [plants, setPlants] = useState([]);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [userCountry, setUserCountry] = useState(null);
  const [countryFiltered, setCountryFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { showNotification } = useNotification();

  const {
    cart,
    cartCount,
    total,
    open,
    setOpen,
    addToCart,
    removeFromCart,
    changeQty,
  } = useCart();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/plants`)
      .then((res) => {
        const arr = Array.isArray(res.data.plants) ? res.data.plants : [];
        setPlants(arr);
        setFilteredPlants(arr);
        if (arr.length) {
          const prices = arr.map((p) => Number(p.price || 0));
          setPriceRange([Math.min(...prices), Math.max(...prices)]);
        }
      })
      .catch(() => {
        setPlants([]);
        setFilteredPlants([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setUserCountry("IN");
  }, []);

  useEffect(() => {
    if (!userCountry) return setCountryFiltered([]);
    const byCountry = plants.filter((plant) => {
      if (Array.isArray(plant.country)) {
        return plant.country.includes(userCountry);
      }
      if (typeof plant.country === "string") {
        return plant.country === userCountry;
      }
      return false;
    });
    setCountryFiltered(byCountry);
  }, [plants, userCountry]);

  useEffect(() => {
    setFilteredPlants(
      countryFiltered.filter((plant) => {
        const matchesName = (plant.name || "")
          .toLowerCase()
          .includes(search.toLowerCase());
        const price = Number(plant.price || 0);
        const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
        return matchesName && matchesPrice;
      })
    );
  }, [search, priceRange, countryFiltered]);

  const minPrice = Math.min(...plants.map((p) => Number(p.price || 0)), 0);
  const maxPrice = Math.max(...plants.map((p) => Number(p.price || 0)), 10000);

  const handlePriceChange = (val) => setPriceRange([priceRange[0], val]);

  const renderPlant = ({ item: plant }) => {
    const imageUrl = plant.image?.startsWith("http")
      ? plant.image
      : IMAGE_PREFIX + plant.image;

    return (
      <TouchableOpacity
        style={styles.plantCard}
        onPress={() => navigation.navigate("PlantDetails", { id: plant._id })}
        activeOpacity={0.93}
      >
        <View style={styles.plantImageBox}>
          {plant.image ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.plantImage}
              resizeMode="cover"
            />
          ) : (
            <Text style={{ fontSize: 54, color: "#88b289" }}>🌱</Text>
          )}
        </View>
        <Text style={styles.plantName} numberOfLines={1}>
          {plant.name}
        </Text>
        <Text style={styles.price}>{formatPrice(plant.price)}</Text>
        <Text style={styles.desc} numberOfLines={2}>
          {plant.description || t("plantshop.noDescription")}
        </Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={async (e) => {
            e.stopPropagation?.();
            try {
              await addToCart(plant);
              showNotification(t("plantshop.addedToCart"), "success");
            } catch (err) {
              if (err?.message === "LOGIN_REQUIRED")
                showNotification(t("plantshop.loginFirst"), "warning");
              else
                Alert.alert(
                  err?.response?.data?.message ||
                  t("plantshop.addCartFail")
                );
            }
          }}
        >
          <Text style={styles.addBtnText}>＋ {t("plantshop.addToCart")}</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f6faf8" }}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <View style={styles.container}>
        <Text style={styles.title}>🪴 {t("plantshop.storeTitle")}</Text>
        <Text style={styles.countryText}>
          {userCountry
            ? t("plantshop.showingCountry", { country: userCountry })
            : t("plantshop.detectingLocation")}
        </Text>

        {/* Search & Filters */}
        <View style={styles.filterRow}>
          <TextInput
            style={styles.searchInput}
            placeholder={t("plantshop.searchPlaceholder")}
            placeholderTextColor="#3d6550ff"
            value={search}
            onChangeText={setSearch}
            clearButtonMode="while-editing"
          />
          <View style={styles.priceRangeBlock}>
            <Text style={{ marginBottom: 2, fontWeight: "bold", color: "#444" }}>{t("plantshop.priceRange")}:</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.priceRangeValue}>{formatPrice(priceRange[0])}</Text>
              <Text style={{ marginHorizontal: 4, color: "#aaa" }}>-</Text>
              <Text style={styles.priceRangeValue}>{formatPrice(priceRange[1])}</Text>
            </View>
            <Slider
              minimumValue={minPrice}
              maximumValue={maxPrice}
              value={priceRange[1]}
              step={1}
              onValueChange={handlePriceChange}
              style={{ width: 120, marginTop: 3 }}
              minimumTrackTintColor="#388e3c"
              maximumTrackTintColor="#e9ecef"
              thumbTintColor="#388e3c"
            />
          </View>
          <TouchableOpacity style={styles.cartBtn} onPress={() => setOpen(true)}>
            <Text style={styles.cartBtnText}>🛒</Text>
            {cartCount > 0 && (
              <View style={styles.cartCountBadge}>
                <Text style={styles.cartCountText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Product List */}
        <View style={styles.listContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#388e3c" style={{ margin: 40 }} />
          ) : !userCountry ? (
            <Text style={styles.msg}>{t("plantshop.loadingLocation")}</Text>
          ) : userCountry && countryFiltered.length === 0 ? (
            <Text style={styles.msg}>{t("plantshop.noService")}</Text>
          ) : userCountry && countryFiltered.length > 0 && filteredPlants.length === 0 ? (
            <Text style={styles.msg}>{t("plantshop.noPlantsFound")}</Text>
          ) : filteredPlants.length === 0 ? (
            <Text style={styles.msg}>{t("plantshop.noPlantsFound")}</Text>
          ) : (
            <FlatList
              data={filteredPlants}
              keyExtractor={(item) => item._id}
              renderItem={renderPlant}
              contentContainerStyle={styles.flatListContent}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            />
          )}
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
    backgroundColor: "#f6faf8",
  },
  title: {
    fontSize: 27,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 14,
    color: "#388e3c",
    letterSpacing: 0.5,
  },
  countryText: {
    textAlign: "center",
    marginBottom: 14,
    color: "#3b6957",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginVertical: 8,
    paddingHorizontal: 4,
  },
  searchInput: {
    flex: 1.5,
    backgroundColor: "#fff",
    borderRadius: 9,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    borderWidth: 1.2,
    borderColor: "#d3e6d7",
    marginRight: 10,
    fontWeight: "600",
    letterSpacing: 0.2,
    color: "#334d3c",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0.7 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  priceRangeBlock: {
    minWidth: 110,
    marginHorizontal: 2,
    alignItems: "flex-start",
    flex: 1,
  },
  priceRangeValue: {
    fontWeight: "bold",
    color: "#388e3c",
    fontSize: 15,
    marginHorizontal: 1,
  },
  cartBtn: {
    marginLeft: 10,
    backgroundColor: "#388e3c",
    borderRadius: 50,
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    shadowColor: "#388e3c",
    shadowOpacity: 0.17,
    shadowRadius: 8,
    elevation: 4,
  },
  cartBtnText: {
    fontSize: 25,
    color: "#fff",
    fontWeight: "bold",
  },
  cartCountBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#fff",
    borderRadius: 17,
    minWidth: 22,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#388e3c",
    zIndex: 2,
  },
  cartCountText: {
    color: "#388e3c",
    fontWeight: "bold",
    fontSize: 13,
  },
  listContainer: {
    flex: 1,
    marginTop: 8,
    alignItems: "center",
    width: "100%",
  },
  flatListContent: {
    paddingBottom: 42,
    paddingTop: 8,
    justifyContent: "center",
  },
  plantCard: {
    backgroundColor: "#fff",
    borderRadius: 17,
    margin: 7,
    paddingTop: 16,
    paddingBottom: 15,
    paddingHorizontal: 12,
    width: "46%",
    alignItems: "center",
    shadowColor: "#388e3c",
    shadowOpacity: 0.09,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  plantImageBox: {
    width: 90,
    height: 90,
    borderRadius: 50,
    backgroundColor: "#e8f5e9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    marginTop: 2,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#b6ccb9",
  },
  plantImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  plantName: {
    fontWeight: "700",
    fontSize: 17,
    color: "#222",
    marginBottom: 2,
    textAlign: "center",
    letterSpacing: 0.1,
  },
  price: {
    color: "#388e3c",
    fontWeight: "bold",
    fontSize: 17,
    marginBottom: 2,
  },
  desc: {
    fontSize: 13.5,
    color: "#444",
    textAlign: "center",
    marginBottom: 8,
    minHeight: 33,
    opacity: 0.8,
    fontWeight: "600",
  },
  addBtn: {
    backgroundColor: "#4caf50",
    borderRadius: 8,
    paddingVertical: 9,
    paddingHorizontal: 22,
    marginTop: 2,
    alignSelf: "center",
    shadowColor: "#4caf50",
    shadowOpacity: 0.13,
    shadowRadius: 4,
    elevation: 2,
  },
  addBtnText: {
    color: "#fff",
    fontSize: 15.5,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  msg: {
    fontStyle: "italic",
    opacity: 0.7,
    marginVertical: 22,
    textAlign: "center",
    fontWeight: "bold",
    color: "#b6ccb9",
    fontSize: 16,
  },
});