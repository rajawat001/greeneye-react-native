// src/components/Contact.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Linking,
  ScrollView,
  Platform,
  useWindowDimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useTranslation } from "react-i18next";
import { useNotification } from "./NotificationProvider";
import { colors, layout } from "../theme";

export default function Contact() {
  const { t } = useTranslation();
  const { showNotification } = useNotification();
  const { width } = useWindowDimensions();
  const isTablet = width > 700;

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      showNotification(
        t("contact.successMessage") ||
          "Your message has been sent! We will get back to you soon.",
        "success"
      );
    }, 2000);
  };

  const contactInfo = [
    {
      icon: "📍",
      title: t("contact.locationTitle"),
      lines: [
        "Prime, C11, Kanak Vrindavan",
        "Jaipur, Rajasthan, Bajiri Mandi-302034",
        t("contact.country", { defaultValue: "India" }),
      ],
    },
    {
      icon: "📞",
      title: t("contact.phoneTitle"),
      lines: ["7023277322"],
    },
    {
      icon: "✉️",
      title: t("contact.emailTitle"),
      lines: ["contact@greeneye.foundation"],
    },
  ];
  const socialLinks = [
    {
      label: "Facebook",
      icon: "📘",
      url: "https://facebook.com/",
    },
    {
      label: "Twitter",
      icon: "🐦",
      url: "https://twitter.com/",
    },
    {
      label: "Instagram",
      icon: "📸",
      url: "https://instagram.com/",
    },
    {
      label: "LinkedIn",
      icon: "💼",
      url: "https://linkedin.com/",
    },
    {
      label: "YouTube",
      icon: "▶️",
      url: "https://youtube.com/",
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.bg}>
      <View style={[styles.content, isTablet && styles.contentTablet]}>
        {/* Contact Info Card */}
        <View style={[styles.card, styles.infoCard]}>
          {contactInfo.map((item, idx) => (
            <View style={styles.infoItem} key={idx}>
              <Text style={styles.infoIcon}>{item.icon}</Text>
              <View>
                <Text style={styles.infoTitle}>{item.title}</Text>
                {item.lines.map((line, i) => (
                  <Text style={styles.infoText} key={i}>
                    {line}
                  </Text>
                ))}
              </View>
            </View>
          ))}
          <View style={styles.socialBlock}>
            <Text style={styles.socialTitle}>{t("contact.followUs")}</Text>
            <View style={styles.socialRow}>
              {socialLinks.map((s, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.socialCircle}
                  onPress={() => Linking.openURL(s.url)}
                  accessibilityLabel={s.label}
                >
                  <Text style={styles.socialIcon}>{s.icon}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Contact Form Card */}
        <View style={[styles.card, styles.formCard]}>
          <Text style={styles.formTitle}>{t("contact.formTitle")}</Text>
          <TextInput
            style={styles.input}
            placeholder={t("contact.firstName")}
            placeholderTextColor="#888"
            value={form.firstName}
            onChangeText={(val) => handleChange("firstName", val)}
          />
          <TextInput
            style={styles.input}
            placeholder={t("contact.lastName")}
            placeholderTextColor="#888"
            value={form.lastName}
            onChangeText={(val) => handleChange("lastName", val)}
          />
          <TextInput
            style={styles.input}
            placeholder={t("contact.emailAddress")}
            placeholderTextColor="#888"
            value={form.email}
            onChangeText={(val) => handleChange("email", val)}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder={t("contact.phoneNumber")}
            placeholderTextColor="#888"
            value={form.phone}
            onChangeText={(val) => handleChange("phone", val)}
            keyboardType="phone-pad"
          />
          {/* Subject dropdown */}
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={form.subject}
              onValueChange={(val) => handleChange("subject", val)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label={t("contact.selectSubject")} value="" />
              <Picker.Item label={t("contact.subjectVolunteer")} value="volunteer" />
              <Picker.Item label={t("contact.subjectDonation")} value="donation" />
              <Picker.Item label={t("contact.subjectPartnership")} value="partnership" />
              <Picker.Item label={t("contact.subjectGeneral")} value="general" />
              <Picker.Item label={t("contact.subjectFeedback")} value="feedback" />
            </Picker>
          </View>
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder={t("contact.yourMessage")}
            placeholderTextColor="#888"
            value={form.message}
            onChangeText={(val) => handleChange("message", val)}
            multiline
          />
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitBtnText}>
              {loading ? t("contact.sending") : t("contact.sendMessage")}
            </Text>
          </TouchableOpacity>
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
    flexGrow: 1,
  },
  content: {
    flexDirection: "column",
    gap: 30,
    alignItems: "stretch",
    width: "100%",
  },
  contentTablet: {
    flexDirection: "row",
    gap: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  card: {
    backgroundColor: colors?.white ?? "#fff",
    borderRadius: layout?.borderRadius ?? 16,
    padding: 22,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    flex: 1,
    minWidth: 310,
    maxWidth: 500,
    alignSelf: "center",
  },
  infoCard: {
    marginRight: 0,
  },
  formCard: {
    marginLeft: 0,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 18,
  },
  infoIcon: {
    fontSize: 23,
    marginRight: 14,
    marginTop: 2,
    color: colors?.primaryGreen ?? "#388e3c",
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors?.primaryGreen ?? "#388e3c",
  },
  infoText: {
    fontSize: 13,
    color: colors?.gray ?? "#444",
  },
  socialBlock: {
    marginTop: 15,
  },
  socialTitle: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 6,
    color: colors?.primaryGreen ?? "#388e3c",
  },
  socialRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  socialCircle: {
    marginHorizontal: 6,
    backgroundColor: "#f0f7f5",
    borderRadius: 30,
    width: 38,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
    elevation: 1,
  },
  socialIcon: {
    fontSize: 19,
    color: colors?.primaryGreen ?? "#388e3c",
  },
  formTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
    color: colors?.primaryGreen ?? "#388e3c",
    textAlign: "center",
  },
  input: {
    backgroundColor: "#f7f9fc",
    borderRadius: 6,
    marginBottom: 10,
    padding: 10,
    fontSize: 14,
  },
  pickerWrapper: {
    backgroundColor: "#f7f9fc",
    borderRadius: 6,
    marginBottom: 10,
    overflow: "hidden",
  },
  picker: {
    height: 44,
    width: "100%",
  },
  pickerItem: {
    fontSize: 14,
  },
  submitBtn: {
    backgroundColor: colors?.primaryGreen ?? "#388e3c",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  submitBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
});