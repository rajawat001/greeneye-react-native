import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { colors } from "../theme";

const NAV_LINKS = [
  { route: "Home", labelKey: "home" },
  { route: "Programs", labelKey: "programs" },
  { route: "Impact", labelKey: "impact" },
  { route: "Volunteer", labelKey: "volunteer" },
  { route: "Donate", labelKey: "donate" },
  { route: "Blog", labelKey: "blog" },
  { route: "Contact", labelKey: "contact" },
];

export default function Navbar() {
  const navigation = useNavigation();
  const route = useRoute();
  const { t } = useTranslation();

  const [menuActive, setMenuActive] = useState(false);
  const [menuAnim] = useState(new Animated.Value(0));
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    Animated.timing(menuAnim, {
      toValue: menuActive ? 1 : 0,
      duration: 220,
      useNativeDriver: false,
    }).start();
  }, [menuActive]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          setIsLoggedIn(false);
          setUserName("");
          return;
        }

        setIsLoggedIn(true);
        const { data } = await axios.get(
          `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUserName(data.name || t("navbar.profile"));
      } catch (err) {
        console.warn("User profile fetch failed:", err?.response?.data || err.message);
        setUserName(t("navbar.profile"));
      }
    };

    fetchUser();
    const interval = setInterval(fetchUser, 5000); // Refresh name every 5s
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setUserName("");
    navigation.navigate("Login");
  };

  const isActive = (r) => route.name === r;

  const renderLink = (link, isMobile = false) => (
    <TouchableOpacity
      key={link.route}
      onPress={() => {
        setMenuActive(false);
        navigation.navigate(link.route);
      }}
      style={[
        isMobile ? styles.mobileLinkBtn : styles.linkBtn,
        isActive(link.route) && styles.linkBtnActive,
      ]}
    >
      <Text
        style={[
          isMobile ? styles.mobileLinkText : styles.linkText,
          isActive(link.route) && styles.linkTextActive,
        ]}
      >
        {t(`navbar.${link.labelKey}`)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.navbar}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Home")}
        style={styles.logoRow}
        activeOpacity={0.7}
      >
        <Text style={styles.logoIcon}>🌱</Text>
        <Text style={styles.logoText}>GreenEye</Text>
      </TouchableOpacity>

      <View style={styles.linksRow}>
        {NAV_LINKS.map((link) => renderLink(link))}
        {isLoggedIn ? (
          <>
            <TouchableOpacity
              onPress={() => navigation.navigate("Profile")}
              style={styles.linkBtn}
            >
              <Text style={styles.linkText}>👤 {userName || t("navbar.profile")}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={styles.linkBtn}>
              <Text style={styles.linkText}>🚪 {t("navbar.logout")}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              onPress={() => navigation.navigate("Register")}
              style={styles.linkBtn}
            >
              <Text style={styles.linkText}>{t("navbar.register")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              style={styles.linkBtn}
            >
              <Text style={styles.linkText}>🔑 {t("navbar.login")}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <TouchableOpacity
        style={styles.hamburger}
        onPress={() => setMenuActive((a) => !a)}
        accessibilityLabel="Menu"
      >
        <Text style={styles.hamburgerIcon}>{menuActive ? "✖️" : "☰"}</Text>
      </TouchableOpacity>

      {menuActive && (
        <Animated.View
          style={[
            styles.mobileMenu,
            {
              top: Platform.OS === "ios" ? 68 : 56,
              opacity: menuAnim,
              left: menuAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [400, 0],
              }),
            },
          ]}
        >
          {NAV_LINKS.map((link) => renderLink(link, true))}
          {isLoggedIn ? (
            <>
              <TouchableOpacity
                onPress={() => {
                  setMenuActive(false);
                  navigation.navigate("Profile");
                }}
                style={styles.mobileLinkBtn}
              >
                <Text style={styles.mobileLinkText}>👤 {userName || t("navbar.profile")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setMenuActive(false);
                  handleLogout();
                }}
                style={styles.mobileLinkBtn}
              >
                <Text style={styles.mobileLinkText}>🚪 {t("navbar.logout")}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                onPress={() => {
                  setMenuActive(false);
                  navigation.navigate("Register");
                }}
                style={styles.mobileLinkBtn}
              >
                <Text style={styles.mobileLinkText}>{t("navbar.register")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setMenuActive(false);
                  navigation.navigate("Login");
                }}
                style={styles.mobileLinkBtn}
              >
                <Text style={styles.mobileLinkText}>🔑 {t("navbar.login")}</Text>
              </TouchableOpacity>
            </>
          )}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primaryGreen,
    height: 56,
    paddingHorizontal: 10,
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    position: "relative",
    zIndex: 50,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoIcon: {
    fontSize: 28,
    marginRight: 8,
    color: colors.lightGreen,
  },
  logoText: {
    fontWeight: "700",
    fontSize: 20,
    color: "#fff",
  },
  linksRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 22,
    display: "none",
  },
  linkBtn: {
    marginHorizontal: 4,
    padding: 6,
    borderRadius: 6,
  },
  linkBtnActive: {
    backgroundColor: colors.darkGreen,
  },
  linkText: {
    color: "#fff",
    fontSize: 15,
    opacity: 0.85,
  },
  linkTextActive: {
    fontWeight: "bold",
    opacity: 1,
  },
  hamburger: {
    marginLeft: 16,
    padding: 6,
  },
  hamburgerIcon: {
    fontSize: 28,
    color: "#fff",
  },
  mobileMenu: {
    position: "absolute",
    top: 56,
    right: 0,
    width: 220,
    backgroundColor: colors.primaryGreen,
    borderRadius: 12,
    padding: 18,
    zIndex: 50,
    elevation: 6,
  },
  mobileLinkBtn: {
    paddingVertical: 11,
    marginVertical: 2,
    borderRadius: 6,
    paddingHorizontal: 12,
  },
  mobileLinkText: {
    color: "#fff",
    fontSize: 17,
    opacity: 0.96,
  },
});
