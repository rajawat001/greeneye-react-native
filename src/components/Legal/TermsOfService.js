import React from "react";
import { View, Text, StyleSheet, ScrollView, Linking } from "react-native";
import { useTranslation } from "react-i18next";

const TermsOfService = () => {
  const { t } = useTranslation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t("termsOfService.title")}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.text}>{t("termsOfService.effectiveDate")}</Text>
        <Text style={styles.text}>
          {t("termsOfService.welcome")}{" "}
          <Text
            style={styles.link}
            onPress={() => Linking.openURL("https://greeneye.foundation")}
          >
            https://greeneye.foundation
          </Text>
          , {t("termsOfService.agree")}
        </Text>
        <Text style={styles.sectionTitle}>{t("termsOfService.useTitle")}</Text>
        <Text style={styles.text}>{t("termsOfService.useText")}</Text>

        <Text style={styles.sectionTitle}>{t("termsOfService.userDataTitle")}</Text>
        <Text style={styles.text}>{t("termsOfService.userDataText")}</Text>

        <Text style={styles.sectionTitle}>{t("termsOfService.ownershipTitle")}</Text>
        <Text style={styles.text}>{t("termsOfService.ownershipText")}</Text>

        <Text style={styles.sectionTitle}>{t("termsOfService.changesTitle")}</Text>
        <Text style={styles.text}>{t("termsOfService.changesText")}</Text>

        <Text style={styles.sectionTitle}>{t("termsOfService.contactTitle")}</Text>
        <Text style={styles.text}>{t("termsOfService.contactText")}</Text>
        <Text style={styles.text}>
          📞 Phone: 7023277322{"\n"}
          📧 Email: contact@greeneye.foundation{"\n"}
          🏠 Address: Prime, C11, Kanak Vrindavan, Jaipur, Rajasthan, Bajiri Mandi-302034
        </Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © 2025 GreenEye. {t("termsOfService.rightsReserved")}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: "#f0fdf4", flexGrow: 1, paddingBottom: 20 },
  header: {
    backgroundColor: "#2d6a4f",
    paddingVertical: 20,
    marginTop: 16,
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  content: {
    maxWidth: 800,
    alignSelf: "center",
    padding: 18,
    lineHeight: 22,
  },
  text: {
    color: "#1b4332",
    fontSize: 16,
    marginBottom: 13,
  },
  sectionTitle: {
    color: "#2d6a4f",
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 7,
  },
  link: {
    color: "#2d6a4f",
    textDecorationLine: "underline",
  },
  footer: {
    backgroundColor: "#2d6a4f",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 17,
    marginTop: 24,
  },
  footerText: {
    color: "#fff",
    fontSize: 15,
    textAlign: "center",
  },
});

export default TermsOfService;