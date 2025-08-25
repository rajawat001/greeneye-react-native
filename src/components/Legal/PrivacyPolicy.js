import React from "react";
import { View, Text, StyleSheet, ScrollView, Linking } from "react-native";
import { useTranslation } from "react-i18next";

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t("privacyPolicy.title")}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.text}>{t("privacyPolicy.effectiveDate")}</Text>
        <Text style={styles.text}>
          {t("privacyPolicy.intro")}{" "}
          <Text
            style={styles.link}
            onPress={() => Linking.openURL("https://greeneye.foundation")}
          >
            https://greeneye.foundation
          </Text>
          , {t("privacyPolicy.intro2")}
        </Text>
        <Text style={styles.sectionTitle}>{t("privacyPolicy.infoCollectedTitle")}</Text>
        <View style={styles.ul}>
          <Text style={styles.li}>• {t("privacyPolicy.infoName")}</Text>
          <Text style={styles.li}>• {t("privacyPolicy.infoEmail")}</Text>
          <Text style={styles.li}>• {t("privacyPolicy.infoPhone")}</Text>
        </View>
        <Text style={styles.text}>{t("privacyPolicy.infoCollectedText")}</Text>

        <Text style={styles.sectionTitle}>{t("privacyPolicy.howWeUseTitle")}</Text>
        <Text style={styles.text}>{t("privacyPolicy.howWeUseText")}</Text>

        <Text style={styles.sectionTitle}>{t("privacyPolicy.cookiesTitle")}</Text>
        <Text style={styles.text}>{t("privacyPolicy.cookiesText")}</Text>

        <Text style={styles.sectionTitle}>{t("privacyPolicy.dataProtectionTitle")}</Text>
        <Text style={styles.text}>{t("privacyPolicy.dataProtectionText")}</Text>

        <Text style={styles.sectionTitle}>{t("privacyPolicy.contactTitle")}</Text>
        <Text style={styles.text}>{t("privacyPolicy.contactText")}</Text>
        <Text style={styles.text}>
          📞 Phone: 7023277322{"\n"}
          📧 Email: contact@greeneye.foundation{"\n"}
          🏠 Address: Prime, C11, Kanak Vrindavan, Jaipur, Rajasthan, Bajiri Mandi-302034
        </Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © 2025 GreenEye. {t("privacyPolicy.rightsReserved")}
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
  ul: { marginBottom: 8, marginLeft: 10 },
  li: {
    color: "#1b4332",
    fontSize: 16,
    marginBottom: 3,
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

export default PrivacyPolicy;