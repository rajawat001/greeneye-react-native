// src/components/Donate.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Platform,
} from "react-native";
import RazorpayCheckout from "react-native-razorpay";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useNotification } from "./NotificationProvider";
import { colors, layout } from "../theme";

const presetAmounts = [100, 500, 1000, 5000];

export default function Donate() {
  const { t } = useTranslation();
  const { showNotification } = useNotification();
  const { width } = useWindowDimensions();
  const isTablet = width > 700;

  const [amount, setAmount] = useState("");
  const [activeBtn, setActiveBtn] = useState(null);
  const [form, setForm] = useState({
    donorName: "",
    donorEmail: "",
    donorPhone: "",
  });
  const [loading, setLoading] = useState(false);

  // Autofill donor info if logged in
  useEffect(() => {
    const fetchProfile = async () => {
      let token = null;
      try {
        token = await AsyncStorage.getItem("authToken");
      } catch {}
      if (!token) return;
      try {
        const { data } = await axios.get(
          `${process.env.EXPO_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setForm((f) => ({
          ...f,
          donorName: data.name || "",
          donorEmail: data.email || "",
          donorPhone: data.phone || "",
        }));
      } catch {}
    };
    fetchProfile();
  }, []);

  const handleAmountBtn = (amt, idx) => {
    setAmount(amt.toString());
    setActiveBtn(idx);
  };

  const handleChange = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!amount || parseInt(amount, 10) < 50) {
      showNotification(
        t("donate.minAmountError") || "Please enter a minimum donation amount of ₹50.",
        "error"
      );
      return;
    }
    setLoading(true);

    try {
      // Create order in backend
      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/donations/create`,
        {
          donorName: form.donorName,
          donorEmail: form.donorEmail,
          donorPhone: form.donorPhone,
          amount: parseInt(amount, 10),
        }
      );

      // Launch Razorpay payment
      let razorpayKey = process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID;
      const options = {
        description: t("donate.razorpayDesc") || "Thank you for your support!",
        image: undefined,
        currency: data.currency,
        key: razorpayKey,
        amount: data.amount,
        name: t("donate.razorpayTitle") || "GreenEye Donation",
        order_id: data.orderId,
        prefill: {
          name: form.donorName,
          email: form.donorEmail,
          contact: form.donorPhone,
        },
        theme: { color: colors?.primaryGreen ?? "#388e3c" },
      };

      RazorpayCheckout.open(options)
        .then(async (response) => {
          // Verify payment
          try {
            const verifyRes = await axios.post(
              `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/donations/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                donationId: data.donationId,
              }
            );
            if (verifyRes.data.success) {
              showNotification(t("donate.successMessage", { amount }), "success");
              setAmount("");
              setForm({ donorName: "", donorEmail: "", donorPhone: "" });
              setActiveBtn(null);
              // Optionally, navigate to a "Thank You" or "My Donations" screen
            } else {
              showNotification(
                t("donate.verifyFail") || "Payment verification failed. Please try again.",
                "error"
              );
            }
          } catch {
            showNotification(
              t("donate.verifyFail") || "Payment verification failed. Please try again.",
              "error"
            );
          }
        })
        .catch(() => {
          showNotification(
            t("donate.donationFail") || "Donation failed or cancelled.",
            "error"
          );
        });
    } catch (err) {
      showNotification(
        t("donate.donationFail") || "Donation failed. Please try again later.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.bg}>
      <View style={[styles.content, isTablet && styles.contentTablet]}>
        {/* Left: Donation impact/breakdown */}
        <View style={styles.infoCard}>
          <Text style={styles.impactTitle}>{t("donate.impactTitle")}</Text>
          <View style={styles.breakdown}>
            <View style={styles.breakdownItem}>
              <Text style={styles.amount}>₹100</Text>
              <Text style={styles.breakDesc}>{t("donate.breakdown100")}</Text>
            </View>
            <View style={styles.breakdownItem}>
              <Text style={styles.amount}>₹500</Text>
              <Text style={styles.breakDesc}>{t("donate.breakdown500")}</Text>
            </View>
            <View style={styles.breakdownItem}>
              <Text style={styles.amount}>₹1000</Text>
              <Text style={styles.breakDesc}>{t("donate.breakdown1000")}</Text>
            </View>
            <View style={styles.breakdownItem}>
              <Text style={styles.amount}>₹5000</Text>
              <Text style={styles.breakDesc}>{t("donate.breakdown5000")}</Text>
            </View>
          </View>
        </View>

        {/* Right: Donation form */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>{t("donate.formTitle")}</Text>
          <View style={styles.amountRow}>
            {presetAmounts.map((amt, idx) => (
              <TouchableOpacity
                key={amt}
                style={[styles.amountBtn, activeBtn === idx && styles.activeBtn]}
                onPress={() => handleAmountBtn(amt, idx)}
              >
                <Text style={[styles.amountBtnText, activeBtn === idx && { color: "#fff" }]}>
                  ₹{amt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            style={styles.input}
            placeholder={t("donate.placeholderAmount")}
            keyboardType="numeric"
            value={amount}
            onChangeText={(val) => {
              setAmount(val);
              setActiveBtn(null);
            }}
          />
          <TextInput
            style={styles.input}
            placeholder={t("donate.placeholderName")}
            value={form.donorName}
            onChangeText={(val) => handleChange("donorName", val)}
          />
          <TextInput
            style={styles.input}
            placeholder={t("donate.placeholderEmail")}
            value={form.donorEmail}
            keyboardType="email-address"
            onChangeText={(val) => handleChange("donorEmail", val)}
          />
          <TextInput
            style={styles.input}
            placeholder={t("donate.placeholderPhone")}
            value={form.donorPhone}
            keyboardType="phone-pad"
            onChangeText={(val) => handleChange("donorPhone", val)}
          />
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitBtnText}>{t("donate.donateNow")}</Text>
            )}
          </TouchableOpacity>
          <Text style={styles.note}>
            <Text style={{ color: colors?.primaryGreen ?? "#388e3c" }}>🛡️ </Text>
            {t("donate.note")}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bg: {
    backgroundColor: colors?.primaryGreen ?? "#388e3c",
    flexGrow: 1,
    paddingVertical: 28,
    paddingHorizontal: 10,
    minHeight: "100%",
  },
  content: {
    flexDirection: "column",
    gap: 26,
    alignItems: "stretch",
    width: "100%",
  },
  contentTablet: {
    flexDirection: "row",
    gap: 42,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  infoCard: {
    flex: 1,
    marginBottom: 18,
    marginRight: 0,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderRadius: layout?.borderRadius ?? 16,
    padding: 24,
    backdropFilter: "blur(10px)",
    minWidth: 265,
    maxWidth: 420,
    alignSelf: "center",
  },
  impactTitle: {
    fontSize: 22,
    color: colors?.lightGreen ?? "#c8e6c9",
    fontWeight: "bold",
    marginBottom: 18,
    textAlign: "left",
  },
  breakdown: {
    marginBottom: 0,
  },
  breakdownItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.16)",
  },
  amount: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors?.warmOrange ?? "#ff9800",
    marginRight: 18,
    minWidth: 80,
  },
  breakDesc: {
    color: "#fff",
    fontSize: 15,
    flex: 1,
    flexWrap: "wrap",
  },
  formCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: layout?.borderRadius ?? 16,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 3,
    minWidth: 310,
    maxWidth: 470,
    alignSelf: "center",
    marginBottom: 18,
  },
  formTitle: {
    fontSize: 22,
    color: colors?.primaryGreen ?? "#388e3c",
    fontWeight: "bold",
    marginBottom: 18,
    textAlign: "center",
  },
  amountRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  amountBtn: {
    backgroundColor: "#e8f5e9",
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: 7,
    marginRight: 10,
    marginBottom: 10,
  },
  activeBtn: {
    backgroundColor: colors?.primaryGreen ?? "#388e3c",
  },
  amountBtnText: {
    color: colors?.primaryGreen ?? "#388e3c",
    fontWeight: "bold",
    fontSize: 16,
  },
  input: {
    backgroundColor: "#f7f9fc",
    borderRadius: 7,
    marginBottom: 11,
    padding: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  submitBtn: {
    backgroundColor: colors?.primaryGreen ?? "#388e3c",
    padding: 15,
    borderRadius: 7,
    alignItems: "center",
    marginTop: 7,
  },
  submitBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  note: {
    color: colors?.gray ?? "#444",
    marginTop: 13,
    fontSize: 13,
    textAlign: "center",
  },
});