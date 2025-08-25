// src/components/Programs.js
import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { colors, layout } from "../theme";

export default function Programs() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  const programs = [
    {
      img: "https://upload.wikimedia.org/wikipedia/commons/b/b5/LMP_2008_Reforestation_Effort.jpg",
      title: t("programsSection.urbanReforestationTitle"),
      desc: t("programsSection.urbanReforestationDesc"),
      features: [
        t("programsSection.urbanFeature1"),
        t("programsSection.urbanFeature2"),
        t("programsSection.urbanFeature3"),
      ],
    },
    {
      img: "https://media.licdn.com/dms/image/v2/D5612AQGT9my7qyifPQ/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1709107731096?e=2147483647&v=beta&t=pwfGVRf-e3tt9nMC4vBkwqKiQvbnZgErbAjSGHdsEpY",
      title: t("programsSection.communityDrivesTitle"),
      desc: t("programsSection.communityDrivesDesc"),
      features: [
        t("programsSection.communityFeature1"),
        t("programsSection.communityFeature2"),
        t("programsSection.communityFeature3"),
      ],
    },
    {
      img: "https://growbilliontrees.com/cdn/shop/files/GROW-BILLION-TREES-500-TREES.jpg?v=1735294078",
      title: t("programsSection.schoolProgramsTitle"),
      desc: t("programsSection.schoolProgramsDesc"),
      features: [
        t("programsSection.schoolFeature1"),
        t("programsSection.schoolFeature2"),
        t("programsSection.schoolFeature3"),
      ],
    },
  ];

  return (
    <View style={{ paddingVertical: 24 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.programsGrid}
      >
        {programs.map((p, idx) => (
          <View style={styles.programCard} key={idx}>
            <View style={styles.programImage}>
              <Image
                source={{ uri: p.img }}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
            <View style={styles.programContent}>
              <Text style={styles.cardTitle}>{p.title}</Text>
              <Text style={styles.cardDesc}>{p.desc}</Text>
              <View style={styles.featuresList}>
                {p.features.map((f, i) => (
                  <View style={styles.featureRow} key={i}>
                    <Text style={styles.checkIcon}>✔️</Text>
                    <Text style={styles.featureText}>{f}</Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity
                style={styles.btnOutline}
                onPress={() => navigation.navigate("Volunteer")}
              >
                <Text style={styles.btnOutlineText}>
                  {t("programsSection.joinProgram")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  programsGrid: {
    paddingHorizontal: 16,
    columnGap: 16,
  },
  programCard: {
    backgroundColor: "#fff",
    borderRadius: layout?.borderRadius ?? 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    width: 280,
    flexShrink: 0,
  },
  programImage: {
    height: 160,
    width: "100%",
    backgroundColor: "#e8f5e9",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  programContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors?.primaryGreen ?? "#388e3c",
    marginBottom: 8,
  },
  cardDesc: {
    color: colors?.gray ?? "#555",
    fontSize: 14,
    marginBottom: 14,
    lineHeight: 20,
  },
  featuresList: {
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  checkIcon: {
    color: colors?.primaryGreen ?? "#388e3c",
    marginRight: 8,
    fontSize: 16,
  },
  featureText: {
    color: colors?.darkGray ?? "#444",
    fontSize: 14,
  },
  btnOutline: {
    borderColor: colors?.primaryGreen ?? "#388e3c",
    borderWidth: 2,
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: "center",
  },
  btnOutlineText: {
    color: colors?.primaryGreen ?? "#388e3c",
    fontWeight: "bold",
    fontSize: 14,
  },
});
