import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { useTranslation } from "react-i18next";
import { colors, layout } from "../theme";

export default function About() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <View style={[styles.about, { backgroundColor: colors.lightGray }]}>
      <View style={[styles.aboutContent, isTablet && styles.aboutContentTablet]}>
        <View style={styles.aboutText}>
          <Text style={styles.visionTitle}>{t("about.visionTitle")}</Text>
          <Text style={styles.visionText}>{t("about.visionText")}</Text>
          <Text style={styles.impactTitle}>{t("about.impactTitle")}</Text>
          <Text style={styles.impactText}>{t("about.impactText")}</Text>

          {/* Horizontally scrollable feature cards */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuresScroll}
          >
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🌳</Text>
              <Text style={styles.featureTitle}>{t("about.featurePlantationTitle")}</Text>
              <Text style={styles.featureText}>{t("about.featurePlantationText")}</Text>
            </View>

            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🎓</Text>
              <Text style={styles.featureTitle}>{t("about.featureEducationTitle")}</Text>
              <Text style={styles.featureText}>{t("about.featureEducationText")}</Text>
            </View>

            <View style={styles.feature}>
              <Text style={styles.featureIcon}>♻️</Text>
              <Text style={styles.featureTitle}>{t("about.featureSustainabilityTitle")}</Text>
              <Text style={styles.featureText}>{t("about.featureSustainabilityText")}</Text>
            </View>
          </ScrollView>
        </View>

        <View style={styles.aboutImageWrap}>
          <Image
            source={require("../assets/images/EnvironmentalConservation.png")}
            accessible
            accessibilityLabel={t("about.imgAlt")}
            style={styles.aboutImg}
            resizeMode="contain"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  about: {
    width: "100%",
    paddingVertical: 32,
    paddingHorizontal: 0,
  },
  aboutContent: {
    flexDirection: "column",
    gap: 34,
    alignItems: "center",
    width: "100%",
    maxWidth: 1080,
    alignSelf: "center",
    paddingHorizontal: 18,
  },
  aboutContentTablet: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 50,
    justifyContent: "center",
  },
  aboutText: {
    flex: 1,
    maxWidth: 540,
  },
  visionTitle: {
    fontSize: 22,
    color: colors.primaryGreen,
    fontWeight: "700",
    marginBottom: 8,
  },
  visionText: {
    fontSize: 16,
    color: colors.darkGray,
    marginBottom: 18,
    lineHeight: 24,
  },
  impactTitle: {
    fontSize: 22,
    color: colors.primaryGreen,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 8,
  },
  impactText: {
    fontSize: 16,
    color: colors.darkGray,
    marginBottom: 20,
    lineHeight: 24,
  },
  featuresScroll: {
    gap: 16,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  feature: {
    backgroundColor: colors.white,
    borderRadius: layout.borderRadius,
    alignItems: "center",
    padding: 22,
    shadowColor: "#000",
    shadowOpacity: 0.09,
    shadowRadius: 13,
    elevation: 2,
    width: 240,
    marginRight: 16,
  },
  featureIcon: {
    fontSize: 36,
    color: colors.primaryGreen,
    marginBottom: 10,
  },
  featureTitle: {
    fontWeight: "bold",
    color: colors.primaryGreen,
    fontSize: 17,
    marginBottom: 6,
    textAlign: "center",
  },
  featureText: {
    color: colors.gray,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  aboutImageWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    maxWidth: 450,
  },
  aboutImg: {
    width: 150,
    height: 220,
    borderRadius: layout.borderRadius,
    alignSelf: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.13,
    shadowRadius: 13,
    elevation: 2,
    marginBottom: 20,
  },
});
