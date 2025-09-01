// src/components/Volunteer.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useNotification } from "./NotificationProvider";
import { colors, layout } from "../theme";
// import { Picker } from '@react-native-picker/picker'; // Uncomment if you use Picker

const cities = [
  "Jaipur", "Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad", "Chennai", "Kolkata", "Other"
];
const availabilities = [
  { value: "weekends", labelKey: "weekends" },
  { value: "weekdays", labelKey: "weekdays" },
  { value: "flexible", labelKey: "flexible" },
  { value: "events", labelKey: "events" }
];
const sectors = [
  "Information Technology (IT)",
  "Banking & Finance",
  "Healthcare & Medical",
  "Education & Training",
  "Government & Public Sector",
  "Non-Profit / NGO",
  "Agriculture",
  "Retail & E-commerce",
  "Construction & Real Estate",
  "Legal & Law",
  "Arts & Media",
  "Travel & Hospitality",
  "Transportation & Logistics",
  "Manufacturing",
  "Telecommunications",
  "Research & Development",
  "Energy & Utilities",
  "Environment & Sustainability",
  "Defense & Security",
  "Automotive",
  "Entertainment & Film",
  "Sports & Fitness",
  "Marketing & Advertising",
  "Human Resources (HR)",
  "Aerospace & Aviation",
  "Fashion & Apparel",
  "Food & Beverages",
  "Social Work",
  "Freelance/Consulting",
  "Other"
];
const professions = [
  "Business Owner / Entrepreneur",
  "Private Job",
  "Government Employee",
  "Freelancer",
  "Student",
  "Homemaker",
  "Retired",
  "Unemployed",
  "Teacher / Professor",
  "Doctor / Nurse",
  "Engineer",
  "Lawyer",
  "Artist / Designer",
  "Social Worker",
  "Volunteer (Full-time)",
  "Technician / Skilled Worker",
  "Manager / Executive",
  "Sales / Marketing Professional",
  "IT Professional",
  "Content Creator / Influencer",
  "Finance Professional (CA, Accountant, Banker)",
  "Researcher / Scientist",
  "Consultant",
  "Admin / Clerical",
  "Self-Employed",
  "Other"
];

export default function Volunteer() {
  const { t } = useTranslation();
  const { showNotification } = useNotification();
  const { width } = useWindowDimensions();
  const isTablet = width >= 700;
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    availability: "",
    sector: "",
    profession: "",
    motivation: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVolunteer, setIsVolunteer] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Fetch user profile if token exists
  useEffect(() => {
    const fetchProfile = async () => {
      let token = null;
      try {
        token = await AsyncStorage.getItem("authToken");
      } catch {}
      if (!token) {
        setLoadingProfile(false);
        return;
      }

      setIsLoggedIn(true);

      try {
        const { data } = await axios.get(
          `${process.env.EXPO_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setForm((f) => ({
          ...f,
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
        }));
        setIsVolunteer(data.is_volunteer === true);
      } catch {
        setIsLoggedIn(false);
      }
      setLoadingProfile(false);
    };

    fetchProfile();
  }, []);

  const handleChange = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const handleSubmit = async () => {
    setLoading(true);

    let token = null;
    try {
      token = await AsyncStorage.getItem("authToken");
    } catch {}

    try {
      if (isLoggedIn && token) {
        // Update volunteer info for logged in user
        await axios.put(
          `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/users/volunteer`,
          {
            city: form.city,
            availability: form.availability,
            sector: form.sector,
            profession: form.profession,
            why_do_you_want_to_join_us: form.motivation,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsVolunteer(true);
        showNotification(t("volunteerForm.notifVolunteerSuccess"), "success");
      } else {
        if (!form.password || form.password.length < 6) {
          showNotification(t("volunteerForm.notifPasswordShort"), "error");
          setLoading(false);
          return;
        }
        // Register new volunteer
        const { data } = await axios.post(
          `${process.env.EXPO_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/register-volunteer`,
          {
            name: form.name,
            email: form.email,
            phone: form.phone,
            password: form.password,
            city: form.city,
            availability: form.availability,
            sector: form.sector,
            profession: form.profession,
            why_do_you_want_to_join_us: form.motivation,
          }
        );
        if (data.token) {
          await AsyncStorage.setItem("authToken", data.token);
          showNotification(t("volunteerForm.notifRegisterSuccess"), "success");
          // You can navigate to profile if you want
        }
        setForm({
          name: "",
          email: "",
          phone: "",
          city: "",
          availability: "",
          sector: "",
          profession: "",
          motivation: "",
          password: "",
        });
      }
    } catch (err) {
      showNotification(
        err.response?.data?.message || t("volunteerForm.notifRegisterFail"),
        "error"
      );
    }
    setLoading(false);
  };

  if (loadingProfile) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f2f4f7" }}>
        <ActivityIndicator size="large" color={colors?.primaryGreen ?? "#388e3c"} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.bg}>
      <View style={[styles.content, isTablet && styles.contentTablet]}>
        {/* Image */}
        <View style={styles.imgWrap}>
          <Image
            source={{ uri: "https://scontent.fjai6-1.fna.fbcdn.net/v/t1.6435-9/41851338_10216974293654823_3818402281796141056_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_ohc=NIxd0_BJSY4Q7kNvwHukHj1&_nc_oc=AdkowrgTEEFcoVA6VPOtboTdFK8hkpEAY4WmGfLJjcQBRTSfDTIQr0ZjF8ertzgd6BiieuGMTOZSwtzopByUdv2M&_nc_zt=23&_nc_ht=scontent.fjai6-1.fna&_nc_gid=9M0gAQZGlXDM2bwaQrSWkw&oh=00_AfR7TEgQejd0NDz_u_dUr3Ko_WtjB4re01Fw3AJEg2eCvg&oe=68A04852" }}
            style={styles.img}
            resizeMode="cover"
            accessible
            accessibilityLabel={t("volunteerForm.volunteerImgAlt")}
          />
        </View>
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>{t("volunteerForm.registerTitle")}</Text>
          {isVolunteer ? (
            <View style={styles.successBox}>
              <Text style={styles.successIcon}>✅</Text>
              <Text style={styles.successText}>{t("volunteerForm.alreadyVolunteer")}</Text>
              <Text style={styles.successText}>{t("volunteerForm.thanksSupport")}</Text>
              <Text style={styles.successText}>{t("volunteerForm.willContact")}</Text>
            </View>
          ) : (
            <>
              <TextInput
                style={styles.input}
                placeholder={t("volunteerForm.name")}
                placeholderTextColor="#888"
                value={form.name}
                onChangeText={(val) => handleChange("name", val)}
                editable={!isLoggedIn}
              />
              <TextInput
                style={styles.input}
                placeholder={t("volunteerForm.email")}
                placeholderTextColor="#888"
                value={form.email}
                onChangeText={(val) => handleChange("email", val)}
                keyboardType="email-address"
                editable={!isLoggedIn}
              />
              <TextInput
                style={styles.input}
                placeholder={t("volunteerForm.phone")}
                placeholderTextColor="#888"
                value={form.phone}
                onChangeText={(val) => handleChange("phone", val)}
                keyboardType="phone-pad"
                editable={!isLoggedIn}
              />
              {!isLoggedIn && (
                <TextInput
                  style={styles.input}
                  placeholder={t("volunteerForm.password")}
                  placeholderTextColor="#888"
                  value={form.password}
                  onChangeText={(val) => handleChange("password", val)}
                  secureTextEntry
                />
              )}
              {/* City */}
              {/* <Picker ... /> can be used instead of TextInput for dropdown */}
              <TextInput
                style={styles.input}
                placeholder={t("volunteerForm.selectCity")}
                placeholderTextColor="#888"
                value={form.city}
                onChangeText={(val) => handleChange("city", val)}
              />
              {/* Availability */}
              <TextInput
                style={styles.input}
                placeholder={t("volunteerForm.availability")}
                placeholderTextColor="#888"
                value={form.availability}
                onChangeText={(val) => handleChange("availability", val)}
              />
              {/* Sector */}
              <TextInput
                style={styles.input}
                placeholder={t("volunteerForm.selectSector")}
                placeholderTextColor="#888"
                value={form.sector}
                onChangeText={(val) => handleChange("sector", val)}
              />
              {/* Profession */}
              <TextInput
                style={styles.input}
                placeholder={t("volunteerForm.selectProfession")}
                placeholderTextColor="#888"
                value={form.profession}
                onChangeText={(val) => handleChange("profession", val)}
              />
              {/* Motivation */}
              <TextInput
                style={[styles.input, { height: 90 }]}
                placeholder={t("volunteerForm.motivation")}
                placeholderTextColor="#888"
                value={form.motivation}
                onChangeText={(val) => handleChange("motivation", val)}
                multiline
              />
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleSubmit}
                disabled={loading}
              >
                <Text style={styles.submitBtnText}>
                  {loading ? t("volunteerForm.registering") : t("volunteerForm.registerBtn")}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bg: {
    backgroundColor: colors?.lightGray ?? "#f2f4f7",
    paddingVertical: 28,
    paddingHorizontal: 10,
    flexGrow: 1,
  },
  content: {
    flexDirection: "column",
    gap: 24,
    alignItems: "stretch",
    width: "100%",
  },
  contentTablet: {
    flexDirection: "row",
    gap: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  imgWrap: {
    flex: 1,
    alignItems: "center",
    marginBottom: 10,
  },
  img: {
    width: 360,
    height: 250,
    borderRadius: layout?.borderRadius ?? 16,
    backgroundColor: "#e8f5e9",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 2,
  },
  formCard: {
    backgroundColor: colors?.white ?? "#fff",
    padding: 24,
    borderRadius: layout?.borderRadius ?? 16,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 3,
    flex: 1,
    minWidth: 310,
    maxWidth: 490,
    alignSelf: "center",
  },
  formTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors?.primaryGreen ?? "#388e3c",
    marginBottom: 18,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#f7f9fc",
    borderRadius: 7,
    marginBottom: 13,
    padding: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  submitBtn: {
    backgroundColor: colors?.primaryGreen ?? "#388e3c",
    padding: 15,
    borderRadius: 7,
    alignItems: "center",
    marginTop: 13,
  },
  submitBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  successBox: {
    backgroundColor: "#e8f5e9",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    marginVertical: 20,
  },
  successIcon: {
    fontSize: 40,
    marginBottom: 8,
    color: "#388e3c",
  },
  successText: {
    color: "#388e3c",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 2,
  },
});