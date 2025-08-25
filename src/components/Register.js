import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Linking,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useNotification } from "../components/NotificationProvider";

export default function Register() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { showNotification } = useNotification();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
    newsletter: false,
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const isEmailValid = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPhoneValid = (phone) =>
    /^[+]?[1-9][\d]{9,15}$/.test(phone.replace(/\s/g, ""));
  const isPasswordStrong = (pwd) =>
    pwd.length >= 8 && /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /\d/.test(pwd);
  const isPasswordMatch = form.password === form.confirmPassword;

  const handleChange = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const handleCheckbox = (name) => setForm((prev) => ({ ...prev, [name]: !prev[name] }));

  const handleSendOtp = async () => {
    if (!isPasswordMatch) return showNotification(t("register.pwdNoMatch"), "error");
    if (!isPasswordStrong(form.password)) return showNotification(t("register.pwdWeak"), "error");
    if (!form.agreeTerms) return showNotification(t("register.agreeTermsMsg"), "error");
    if (!isEmailValid(form.email)) return showNotification(t("register.invalidEmail"), "error");
    if (!isPhoneValid(form.phone)) return showNotification(t("register.invalidPhone"), "error");

    setLoading(true);
    try {
      const phone = form.phone.startsWith("+") ? form.phone : `+91${form.phone}`;

      await axios.post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/otp/send`, {
        phone,
        email: form.email,
      });

      setOtpSent(true);
      showNotification("OTP sent to your SMS", "success");
    } catch (err) {
      const msg = err.response?.data?.message;
      const field = err.response?.data?.field;

      if (field === "email") {
        showNotification("This email is already registered. Please login instead.", "error");
        navigation.navigate("Login");
        return;
      }

      if (field === "phone") {
        showNotification("This phone number is already registered. Please login instead.", "error");
        navigation.navigate("Login");
        return;
      }

      showNotification(msg || "Failed to send OTP", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return showNotification("Please enter OTP", "error");

    setLoading(true);
    try {
      const payload = {
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        password: form.password,
        phone: form.phone,
        otp: otp,
      };

      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/otp/verify`,
        payload
      );

      if (data.token) {
        await AsyncStorage.setItem("authToken", data.token);
        showNotification(t("register.registerSuccess"), "success");
        navigation.replace("Profile");
      }

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        agreeTerms: false,
        newsletter: false,
      });
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || error.response?.data?.error || t("register.registerFail");
      showNotification(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* WhatsApp (optional) */}
      <TouchableOpacity
        style={styles.waCard}
        onPress={() => Linking.openURL("https://wa.me/919876543210")}
      >
        <Text style={styles.waIcon}>🟢</Text>
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.waTitle}>{t("register.registerWithWhatsapp")}</Text>
          <Text style={styles.waDesc}>{t("register.waInstant")}</Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.divider}>{t("register.or")}</Text>
      <Text style={styles.heading}>{t("register.registerWithEmail")}</Text>

      {/* Row: First and last name */}
      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1, marginRight: 5 }]}
          placeholder={t("register.firstName")}
          value={form.firstName}
          onChangeText={(val) => handleChange("firstName", val)}
        />
        <TextInput
          style={[styles.input, { flex: 1, marginLeft: 5 }]}
          placeholder={t("register.lastName")}
          value={form.lastName}
          onChangeText={(val) => handleChange("lastName", val)}
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder={t("register.email")}
        value={form.email}
        onChangeText={(val) => handleChange("email", val)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder={t("register.phone")}
        value={form.phone}
        onChangeText={(val) => handleChange("phone", val)}
        keyboardType="phone-pad"
      />

      {/* Password */}
      <View style={{ position: "relative" }}>
        <TextInput
          style={styles.input}
          placeholder={t("register.createPwd")}
          value={form.password}
          onChangeText={(val) => handleChange("password", val)}
          secureTextEntry={!showPwd}
        />
        <TouchableOpacity
          style={styles.pwdToggle}
          onPress={() => setShowPwd((v) => !v)}
          accessibilityLabel={showPwd ? t("register.hidePassword") : t("register.showPassword")}
        >
          <Text style={{ fontSize: 17, color: "#888" }}>
            {showPwd ? "🙈" : "👁️"}
          </Text>
        </TouchableOpacity>
      </View>
      {/* Confirm password */}
      <View style={{ position: "relative" }}>
        <TextInput
          style={styles.input}
          placeholder={t("register.confirmPwd")}
          value={form.confirmPassword}
          onChangeText={(val) => handleChange("confirmPassword", val)}
          secureTextEntry={!showConfirmPwd}
        />
        <TouchableOpacity
          style={styles.pwdToggle}
          onPress={() => setShowConfirmPwd((v) => !v)}
          accessibilityLabel={showConfirmPwd ? t("register.hidePassword") : t("register.showPassword")}
        >
          <Text style={{ fontSize: 17, color: "#888" }}>
            {showConfirmPwd ? "🙈" : "👁️"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Terms and newsletter */}
      <TouchableOpacity
        style={styles.checkboxRow}
        onPress={() => handleCheckbox("agreeTerms")}
      >
        <Text style={styles.checkbox}>{form.agreeTerms ? "☑️" : "⬜️"}</Text>
        <Text style={styles.checkboxLabel}>
          {t("register.agreeMsg1")}
          <Text style={styles.link} onPress={() => Linking.openURL("https://greeneye.foundation/legal/terms-of-service")}>{t("termsLink")}</Text>
          {t("register.agreeMsg2")}
          <Text style={styles.link} onPress={() => Linking.openURL("https://greeneye.foundation/legal/privacy-policy")}>{t("privacyLink")}</Text>
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.checkboxRow}
        onPress={() => handleCheckbox("newsletter")}
      >
        <Text style={styles.checkbox}>{form.newsletter ? "☑️" : "⬜️"}</Text>
        <Text style={styles.checkboxLabel}>{t("register.newsletter")}</Text>
      </TouchableOpacity>

       {otpSent && (
        <TextInput
          style={styles.input}
          placeholder="Enter OTP"
          value={otp}
          onChangeText={(val) => setOtp(val)}
          keyboardType="number-pad"
        />
      )}

      <TouchableOpacity
        style={styles.submitBtn}
        onPress={otpSent ? handleVerifyOtp : handleSendOtp}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitBtnText}>
            {otpSent ? "Verify OTP & Register" : t("register.createAccount")}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Login")}
        style={styles.switchBtn}
      >
        <Text style={styles.switchText}>
          {t("register.alreadyHaveAccount")}{" "}
          <Text style={styles.linkText}>{t("register.signIn")}</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, marginTop: 32 },
  heading: { fontSize: 21, fontWeight: "bold", marginBottom: 15, color: "#388e3c" },
  waCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8f5e9",
    borderRadius: 10,
    padding: 13,
    marginBottom: 14,
  },
  waIcon: { fontSize: 32 },
  waTitle: { fontWeight: "bold", fontSize: 17, color: "#25D366" },
  waDesc: { color: "#444", fontSize: 13 },
  divider: { textAlign: "center", color: "#aaa", marginVertical: 10 },
  row: { flexDirection: "row", gap: 8, marginBottom: 5 },
  input: {
    backgroundColor: "#f7f9fc",
    borderRadius: 6,
    marginBottom: 10,
    padding: 13,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  pwdToggle: {
    position: "absolute",
    right: 16,
    top: 12,
    padding: 6,
  },
  checkboxRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  checkbox: { fontSize: 18, marginRight: 7 },
  checkboxLabel: { fontSize: 13.5, color: "#444", flex: 1, flexWrap: "wrap" },
  link: { color: "#388e3c", fontWeight: "bold", textDecorationLine: "underline" },
  submitBtn: {
    backgroundColor: "#388e3c",
    padding: 14,
    borderRadius: 7,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 18,
  },
  submitBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  switchBtn: { alignSelf: "center", marginTop: 6 },
  switchText: { color: "#444", fontSize: 14 },
  linkText: { color: "#388e3c", fontWeight: "bold" },
});