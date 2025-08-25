// src/components/cart/CartDrawer.js
import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const formatPrice = (p) => `₹${Number(p).toLocaleString()}`;

export default function CartDrawer({
  open,
  onClose,
  cart,
  changeQty,
  removeFromCart,
  total,
  t = (k) => k,
}) {
  const navigation = useNavigation();

  return (
    <Modal
      visible={open}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        onPress={onClose}
        activeOpacity={1}
      />
      <View style={styles.drawer}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeBtnText}>×</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>🛒 {t("plantshop.yourCart") || "Your Cart"}</Text>
        {!cart.items || cart.items.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={{ fontSize: 38, color: "#b6ccb9" }}>🌱</Text>
            <Text style={{ color: "#888", marginTop: 6 }}>
              {t("plantshop.cartEmpty") || "Cart is empty"}
            </Text>
          </View>
        ) : (
          <FlatList
            data={cart.items}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.itemRow}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: "bold" }}>{item.plant?.name}</Text>
                  <Text style={{ fontSize: 13, color: "#388e3c" }}>
                    {formatPrice(item.plant?.price)} x {item.quantity}
                    <Text style={{ fontWeight: "600", marginLeft: 8 }}>
                      {" = "}
                      {formatPrice((item.plant?.price || 0) * item.quantity)}
                    </Text>
                  </Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => changeQty(item._id, item.quantity - 1)}
                  >
                    <Text style={styles.qtyBtnText}>-</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => changeQty(item._id, item.quantity + 1)}
                  >
                    <Text style={styles.qtyBtnText}>+</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => removeFromCart(item._id)}
                  >
                    <Text style={styles.removeBtnText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            style={{ maxHeight: 350 }}
            ListFooterComponent={
              <View>
                <View style={styles.totalLine} />
                <Text style={styles.totalText}>
                  {t("plantshop.total") || "Total"}: {formatPrice(total)}
                </Text>
                <TouchableOpacity
                  style={styles.checkoutBtn}
                  onPress={() => {
                    onClose();
                    navigation.navigate("Checkout");
                  }}
                >
                  <Text style={styles.checkoutBtnText}>
                    💳 {t("plantshop.checkout") || "Checkout"}
                  </Text>
                </TouchableOpacity>
              </View>
            }
          />
        )}
      </View>
    </Modal>
  );
}

const { width, height } = Dimensions.get("window");
const DRAWER_WIDTH = Math.min(370, width * 0.97);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#0c1b29bb",
  },
  drawer: {
    position: "absolute",
    top: 0,
    right: 0,
    width: DRAWER_WIDTH,
    height: height,
    backgroundColor: "#f6faf8",
    borderTopLeftRadius: 28,
    borderBottomLeftRadius: 28,
    shadowColor: "#388e3c",
    shadowOpacity: 0.11,
    shadowRadius: 22,
    shadowOffset: { width: -8, height: 7 },
    elevation: 17,
    zIndex: 999,
    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  closeBtn: {
    position: "absolute",
    top: 12,
    right: 18,
    zIndex: 2,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#e5f3ea",
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtnText: {
    fontSize: 28,
    color: "#388e3c",
    fontWeight: "bold",
    lineHeight: 30,
  },
  heading: {
    marginTop: 17,
    marginBottom: 20,
    fontSize: 22,
    fontWeight: "bold",
    color: "#388e3c",
    letterSpacing: 0.6,
    textAlign: "center",
  },
  emptyBox: {
    alignItems: "center",
    marginTop: 80,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    borderBottomWidth: 1.5,
    borderBottomColor: "#e0eee6",
    paddingBottom: 11,
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingTop: 10,
    shadowColor: "#388e3c",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  qtyBtn: {
    backgroundColor: "#e5f3ea",
    borderRadius: 7,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 2,
    borderWidth: 1.5,
    borderColor: "#bde2c6",
  },
  qtyBtnText: {
    fontSize: 20,
    color: "#388e3c",
    fontWeight: "bold",
  },
  removeBtn: {
    backgroundColor: "#ffeaea",
    marginLeft: 5,
    borderRadius: 7,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#f5b7b7",
  },
  removeBtnText: {
    color: "#b62222",
    fontSize: 16,
    fontWeight: "900",
    textAlign: "center",
  },
  itemTextName: {
    fontWeight: "bold",
    color: "#233b29",
    fontSize: 16,
    marginBottom: 2,
    letterSpacing: 0.1,
  },
  itemTextSub: {
    fontSize: 14,
    color: "#388e3c",
    fontWeight: "700",
    marginBottom: 2,
  },
  itemTextTotal: {
    fontWeight: "900",
    color: "#233b29",
    fontSize: 14,
    marginLeft: 2,
  },
  totalLine: {
    borderTopWidth: 1.5,
    borderTopColor: "#b6ccb9",
    marginVertical: 24,
  },
  totalText: {
    textAlign: "right",
    fontWeight: "bold",
    fontSize: 21,
    color: "#388e3c",
    marginBottom: 19,
    letterSpacing: 0.2,
  },
  checkoutBtn: {
    backgroundColor: "#388e3c",
    borderRadius: 13,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#388e3c",
    shadowOpacity: 0.13,
    shadowRadius: 6,
    elevation: 4,
  },
  checkoutBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 0.2,
  },
});