import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useNotification } from "../components/NotificationProvider";
import ReCaptcha from "@valture/react-native-recaptcha-v3";

const SITE_KEY = process.env.EXPO_PUBLIC_RECAPTCHA_SITE_KEY;
const BASE_URL = "https://greeneye.foundation";

export default function Login() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { showNotification } = useNotification();
  const recaptchaRef = useRef(null);

  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [form, setForm] = useState({
    email: "",
    password: "",
    otp: "",
    mobile: "",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [useOtpLogin, setUseOtpLogin] = useState(false);

  const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (name, value) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  const handleSendOtp = async () => {
    if (!form.mobile || form.mobile.length !== 10) {
      showNotification("Please enter a valid 10-digit mobile number", "error");
      return;
    }

    setLoading(true);
    try {
      const token = await recaptchaRef.current?.getToken("login");

      if (!token) {
        showNotification("Captcha not solved yet, please try again", "error");
        setLoading(false);
        return;
      }
      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/otp/send`,
        {
          phone: form.mobile,
          recaptchaToken: token,
        }
      );
      setOtpSent(true);
      showNotification(data.message || "OTP sent successfully", "success");
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Failed to send OTP",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!form.otp || form.otp.length !== 4) {
      showNotification("Please enter a valid 4-digit OTP", "error");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/otp/login`,
        {
          phone: form.mobile,
          otp: form.otp,
        }
      );

      if (data.token) {
        await AsyncStorage.setItem("authToken", data.token);
        showNotification("OTP verified. Logged in successfully.", "success");
        navigation.replace("Profile");
        setForm({ email: "", password: "", otp: "", mobile: "" });
      }
    } catch (error) {
      showNotification(
        error.response?.data?.message || "OTP verification failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async () => {
    if (!isEmailValid(form.email)) {
      showNotification(t("login.invalidEmail"), "error");
      return;
    }

    if (!form.password) {
      showNotification(t("login.enterPassword"), "error");
      return;
    }

    setLoading(true);
    try {
      // ✅ captcha token le lo
      const token = await recaptchaRef.current?.getToken("login");

      if (!token) {
        showNotification("Captcha not solved yet, please try again", "error");
        setLoading(false);
        return;
      }
      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/users/login`,
        {
          email: form.email,
          password: form.password,
          recaptchaToken: token,
        }
      );

      if (data.token) {
        await AsyncStorage.setItem("authToken", data.token);
        showNotification(t("login.loginSuccess"), "success");
        navigation.replace("Profile");
        setForm({ email: "", password: "", otp: "", mobile: "" });
      }
    } catch (error) {
      showNotification(
        error.response?.data?.message || t("login.invalidCredentials"),
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (useOtpLogin) {
      otpSent ? handleVerifyOtp() : handleSendOtp();
    } else {
      handlePasswordLogin();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        {useOtpLogin ? t("login.signInWithOtp") : t("login.signInTitle")}
      </Text>

      {useOtpLogin ? (
        <TextInput
          style={styles.input}
          placeholder="Enter Mobile Number"
          placeholderTextColor="#888"
          value={form.mobile}
          onChangeText={(val) => handleChange("mobile", val)}
          keyboardType="phone-pad"
          maxLength={10}
        />
      ) : (
        <TextInput
          style={styles.input}
          placeholder={t("login.emailPlaceholder")}
          placeholderTextColor="#888"
          value={form.email}
          onChangeText={(val) => handleChange("email", val)}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      )}

      {!useOtpLogin ? (
        <View style={{ position: "relative" }}>
          <TextInput
            style={styles.input}
            placeholder={t("login.passwordPlaceholder")}
            placeholderTextColor="#888"
            value={form.password}
            onChangeText={(val) => handleChange("password", val)}
            secureTextEntry={!showPwd}
          />
          <TouchableOpacity
            style={styles.pwdToggle}
            onPress={() => setShowPwd((v) => !v)}
            accessible
            accessibilityLabel={
              showPwd ? t("login.hidePassword") : t("login.showPassword")
            }
          >
            <Text style={{ fontSize: 17, color: "#888" }}>
              {showPwd ? "🙈" : "👁️"}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        otpSent && (
          <TextInput
            style={styles.input}
            placeholder="Enter OTP"
            placeholderTextColor="#888"
            value={form.otp}
            onChangeText={(val) => handleChange("otp", val)}
            keyboardType="numeric"
            maxLength={6}
          />
        )
      )}

      {useOtpLogin && otpSent && (
        <TouchableOpacity onPress={handleSendOtp} style={styles.resendBtn}>
          <Text style={styles.resendText}>Resend OTP</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.submitBtn}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitBtnText}>
            {useOtpLogin
              ? otpSent
                ? "Verify OTP"
                : "Send OTP"
              : t("login.signInBtn")}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Register")}
        style={styles.switchBtn}
      >
        <Text style={styles.switchText}>
          {t("login.newToGreenEye")}{" "}
          <Text style={styles.linkText}>{t("createAccount")}</Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          setUseOtpLogin(!useOtpLogin);
          setOtpSent(false);
          setForm({ email: "", password: "", otp: "", mobile: "" });
        }}
        style={styles.toggleOtpBtn}
      >
        <Text style={styles.toggleOtpText}>
          {useOtpLogin ? "Login with Password" : "Login with OTP"}
        </Text>
      </TouchableOpacity>

      {/* ✅ ReCaptcha Component */}
      <ReCaptcha
        ref={recaptchaRef}
        siteKey={SITE_KEY}
        baseUrl={BASE_URL}
        action="login"
        onExecute={(token) => {
          setRecaptchaToken(token);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, marginTop: 58 },
  heading: {
    fontSize: 23,
    fontWeight: "bold",
    marginBottom: 14,
    color: "#388e3c",
  },
  input: {
    backgroundColor: "#f7f9fc",
    borderRadius: 6,
    marginBottom: 12,
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
  submitBtn: {
    backgroundColor: "#388e3c",
    padding: 14,
    borderRadius: 7,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 20,
  },
  submitBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  switchBtn: { alignSelf: "center", marginTop: 10 },
  switchText: { color: "#444", fontSize: 14 },
  linkText: { color: "#388e3c", fontWeight: "bold" },
  toggleOtpBtn: { alignSelf: "center", marginTop: 18 },
  toggleOtpText: { color: "#1c7ed6", fontSize: 15, fontWeight: "500" },
  resendBtn: { alignSelf: "flex-end", marginBottom: 10 },
  resendText: { color: "#1c7ed6", fontSize: 14 },
});
