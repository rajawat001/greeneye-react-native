import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
  Animated,
  ScrollView,
} from "react-native";
import { useTranslation } from "react-i18next";
import { colors, layout } from "../theme";

const statsRaw = [
  { emoji: "🌱", number: 50000, labelKey: "statTrees", descKey: "statTreesDesc" },
  { emoji: "💨", number: 75000, labelKey: "statCO2", descKey: "statCO2Desc" },
  { emoji: "🤝", number: 1200, labelKey: "statVolunteers", descKey: "statVolunteersDesc" },
  { emoji: "🗺️", number: 25, labelKey: "statCities", descKey: "statCitiesDesc" },
];

export default function Impact() {
  const { t } = useTranslation();
  const anims = useRef(statsRaw.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    statsRaw.forEach((stat, i) => {
      Animated.timing(anims[i], {
        toValue: stat.number,
        duration: 1400,
        useNativeDriver: false,
      }).start();
    });
  }, []);

  const statCards = statsRaw.map((stat, idx) => ({
    ...stat,
    label: t(`impact.${stat.labelKey}`),
    desc: t(`impact.${stat.descKey}`),
    animatedValue: anims[idx],
  }));

  return (
    <ScrollView contentContainerStyle={styles.bg} showsVerticalScrollIndicator={false}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScroll}
      >
        {statCards.map((stat, idx) => (
          <View style={styles.card} key={stat.label}>
            <Text style={styles.icon}>{stat.emoji}</Text>
            <Animated.Text style={styles.number}>
              {anims[idx].interpolate({
                inputRange: [0, stat.number],
                outputRange: [0, stat.number],
                extrapolate: "clamp",
              }).__getValue
                ? Math.floor(anims[idx].__getValue()).toLocaleString()
                : "0"}
            </Animated.Text>
            <Text style={styles.label}>{stat.label}</Text>
            <Text style={styles.desc}>{stat.desc}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.visual}>
        <Image
          source={require("../assets/images/GreenLandscape.png")}
          style={styles.image}
          resizeMode="cover"
          accessible
          accessibilityLabel={t("impact.landscapeAlt")}
        />
        <View style={styles.content}>
          <Text style={styles.heading}>{t("impact.heading")}</Text>
          <Text style={styles.blurb}>{t("impact.blurb")}</Text>
          <View style={styles.list}>
            {["listNative", "listCare", "listEducation", "listHabitat"].map((key) => (
              <View style={styles.listItem} key={key}>
                <Text style={styles.leaf}>🍃</Text>
                <Text style={styles.listText}>{t(`impact.${key}`)}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bg: {
    backgroundColor: colors?.veryLightGreen ?? "#e6f5ea",
    paddingVertical: 32,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  horizontalScroll: {
    flexDirection: "row",
    gap: 16,
    paddingHorizontal: 10,
    paddingBottom: 28,
  },
  card: {
    backgroundColor: colors?.white ?? "#fff",
    paddingVertical: 36,
    paddingHorizontal: 18,
    borderRadius: layout?.borderRadius ?? 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 2,
    width: 220,
    marginRight: 12,
  },
  icon: { fontSize: 38, marginBottom: 13 },
  number: {
    fontSize: 34,
    fontWeight: "700",
    color: colors?.primaryGreen ?? "#388e3c",
    marginBottom: 6,
  },
  label: {
    fontSize: 17,
    fontWeight: "600",
    color: colors?.darkGray ?? "#3a3a3a",
    marginBottom: 5,
    textAlign: "center",
  },
  desc: {
    color: colors?.gray ?? "#666",
    fontSize: 13,
    textAlign: "center",
  },
  visual: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    marginTop: 30,
    gap: 20,
  },
  image: {
    width: 320,
    height: 200,
    borderRadius: layout?.borderRadius ?? 18,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.14,
    shadowRadius: 13,
    elevation: 3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 8,
    maxWidth: 430,
  },
  heading: {
    fontSize: 26,
    color: colors?.primaryGreen ?? "#388e3c",
    fontWeight: "700",
    marginBottom: 16,
  },
  blurb: {
    color: colors?.darkGray ?? "#3a3a3a",
    marginBottom: 16,
    lineHeight: 22,
    fontSize: 15,
  },
  list: {
    marginTop: 4,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  leaf: {
    color: colors?.primaryGreen ?? "#388e3c",
    marginRight: 10,
    fontSize: 17,
  },
  listText: {
    color: colors?.darkGray ?? "#3a3a3a",
    fontSize: 14,
  },
});
