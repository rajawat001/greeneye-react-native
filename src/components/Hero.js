// src/components/Hero.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { colors } from "../theme";

import LanguageSwitcher from '../components/LanguageSwitcher';

const { width } = Dimensions.get("window");

export default function Hero() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  return (
    <LinearGradient
      colors={["#FFD700", "#FFA500", "#32CD32", "#228B22"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.hero}
    >
      <View style={styles.langBar}>
              <LanguageSwitcher />
            </View>
      {/* Content */}
      <View style={styles.heroContent}>
        <Text style={styles.heroTitle}>
          <Text style={styles.heroTitleMain}>{t("hero.titleMain")}</Text>
          {"\n"}
          <Text style={styles.heroTitleSub}>{t("hero.titleSub")}</Text>
        </Text>
        <Text style={styles.heroDescription}>{t("hero.description")}</Text>
        <View style={styles.heroButtons}>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => navigation.navigate("Volunteer")}
            accessibilityRole="button"
          >
            <Text style={styles.btnIcon}>🤝</Text>
            <Text style={styles.btnPrimaryText}>{t("hero.joinMission")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={() => navigation.navigate("Donate")}
            accessibilityRole="button"
          >
            <Text style={styles.btnIcon}>❤️</Text>
            <Text style={styles.btnSecondaryText}>{t("hero.contribute")}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.heroStats}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>50,000</Text>
          <Text style={styles.statLabel}>{t("hero.statTrees")}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>1,200</Text>
          <Text style={styles.statLabel}>{t("hero.statVolunteers")}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>25</Text>
          <Text style={styles.statLabel}>{t("hero.statCities")}</Text>
        </View>
      </View>

      {/* Plant Shop Button */}
      <Pressable
        style={styles.plantImageWrapper}
        onPress={() => navigation.navigate("PlantShop")}
        accessibilityRole="button"
        accessibilityLabel={t("hero.plantBtnAria")}
      >
        <Image
          source={require("../assets/images/plant.png")}
          style={styles.plantImage}
          resizeMode="contain"
          accessibilityLabel={t("hero.plantImgAlt")}
        />
      </Pressable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingTop: 90,
    paddingBottom: 120,
    minHeight: 420,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  heroContent: {
    zIndex: 2,
    width: "90%",
    maxWidth: 700,
    alignItems: "center",
    alignSelf: "center",
    paddingHorizontal: 12,
    marginTop: 16,
  },
  heroTitle: {
    textAlign: "center",
    marginBottom: 0,
  },
  heroTitleMain: {
    fontSize: width < 480 ? 28 : 40,
    fontWeight: "800",
    color: "#333",
    textShadowColor: "rgba(255,255,255,0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  heroTitleSub: {
    fontWeight: "600",
    color: colors.darkGreen,
    fontSize: width < 480 ? 20 : 28,
    marginBottom: 0,
    textShadowColor: "rgba(255,255,255,0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  heroDescription: {
    fontSize: width < 480 ? 15 : 18,
    color: "#333",
    marginVertical: 15,
    textAlign: "center",
    lineHeight: 26,
  },
  heroButtons: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    marginTop: 6,
    marginBottom: 10,
    flexWrap: "wrap",
  },
  btnPrimary: {
    backgroundColor: colors.warmOrange,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 22,
    marginRight: 7,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#ff6b35",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 1,
  },
  btnPrimaryText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 15,
    marginLeft: 6,
  },
  btnSecondary: {
    backgroundColor: "transparent",
    borderColor: "#333",
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 22,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 7,
  },
  btnSecondaryText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 15,
    marginLeft: 6,
  },
  btnIcon: {
    fontSize: 19,
    marginRight: 0,
    color: "#fff",
  },
  heroStats: {
    position: "absolute",
    bottom: 32,
    left: 15,
    right: 0,
    width: "92%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.98)",
    borderRadius: 12,
    borderColor: "#3332",
    borderWidth: 1,
    padding: 12,
    zIndex: 4,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    alignItems: "center",
    minWidth: 80,
  },
  statNumber: {
    fontSize: width < 480 ? 19 : 22,
    fontWeight: "bold",
    color: colors.darkGreen,
  },
  statLabel: {
    fontSize: width < 480 ? 12 : 14,
    color: "#333",
    marginTop: 3,
  },
  plantImageWrapper: {
    position: "absolute",
    right: 18,
    top: 70,
    backgroundColor: "#e8f5e8",
    padding: 7,
    borderRadius: 99,
    shadowColor: "#006400",
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 3,
    zIndex: 5,
  },
  plantImage: {
    width: 70,
    height: 70,
  },
});