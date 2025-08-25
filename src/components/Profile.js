// src/components/Profile.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import ProfileTabs from "./ProfileTabs";
import { useNotification } from "./NotificationProvider";

const cities = ["Jaipur", "Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad", "Chennai", "Kolkata", "Other"];
const availabilities = [
  { value: "weekends", label: "Weekends Only" },
  { value: "weekdays", label: "Weekdays" },
  { value: "flexible", label: "Flexible" },
  { value: "events", label: "Events Only" },
];
const sectors = [
  "Information Technology (IT)", "Banking & Finance", "Healthcare & Medical", "Education & Training", "Government & Public Sector", "Non-Profit / NGO", "Agriculture", "Retail & E-commerce", "Construction & Real Estate", "Legal & Law", "Arts & Media", "Travel & Hospitality", "Transportation & Logistics", "Manufacturing", "Telecommunications", "Research & Development", "Energy & Utilities", "Environment & Sustainability", "Defense & Security", "Automotive", "Entertainment & Film", "Sports & Fitness", "Marketing & Advertising", "Human Resources (HR)", "Aerospace & Aviation", "Fashion & Apparel", "Food & Beverages", "Social Work", "Freelance/Consulting", "Other"
];
const professions = [
  "Business Owner / Entrepreneur", "Private Job", "Government Employee", "Freelancer", "Student", "Homemaker", "Retired", "Unemployed", "Teacher / Professor", "Doctor / Nurse", "Engineer", "Lawyer", "Artist / Designer", "Social Worker", "Volunteer (Full-time)", "Technician / Skilled Worker", "Manager / Executive", "Sales / Marketing Professional", "IT Professional", "Content Creator / Influencer", "Finance Professional (CA, Accountant, Banker)", "Researcher / Scientist", "Consultant", "Admin / Clerical", "Self-Employed", "Other"
];

export default function Profile() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { showNotification } = useNotification();

  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [volEditData, setVolEditData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        navigation.replace("Login");
        return;
      }
      try {
        const { data } = await axios.get(
          `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/users/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser(data);
        setEditData({
          name: data.name,
          email: data.email,
          phone: data.phone || "",
          address: {
            street: data.address?.street || "",
            city: data.address?.city || "",
            state: data.address?.state || "",
            pincode: data.address?.pincode || "",
          },
        });
        setVolEditData({
          city: data.volunteer?.city || "",
          availability: data.volunteer?.availability || "",
          sector: data.volunteer?.sector || "",
          profession: data.volunteer?.profession || "",
          why_do_you_want_to_join_us: data.volunteer?.why_do_you_want_to_join_us || "",
        });
      } catch (e) {
        await AsyncStorage.removeItem("authToken");
        navigation.replace("Login");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigation]);

  const handleChange = (name, value) =>
    setEditData((prev) => ({ ...prev, [name]: value }));

  const handleAddressChange = (name, value) =>
    setEditData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));

  const handleVolChange = (name, value) =>
    setVolEditData((prev) => ({ ...prev, [name]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      let updatedUser = user;
      const profileRes = await axios.put(
        `${EXPO_PUBLIC_API_BASE_URL}/api/users/profile`,
        editData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      updatedUser = profileRes.data;

      if (user.is_volunteer) {
        await axios.put(
          `${EXPO_PUBLIC_API_BASE_URL}/api/users/volunteer`,
          volEditData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const { data: refreshed } = await axios.get(
          `${EXPO_PUBLIC_API_BASE_URL}/api/users/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        updatedUser = refreshed;
        setVolEditData({
          city: refreshed.volunteer?.city || "",
          availability: refreshed.volunteer?.availability || "",
          sector: refreshed.volunteer?.sector || "",
          profession: refreshed.volunteer?.profession || "",
          why_do_you_want_to_join_us: refreshed.volunteer?.why_do_you_want_to_join_us || "",
        });
      }

      setUser(updatedUser);
      setEditMode(false);
      showNotification(t("profilePage.updateSuccess"), "success");
    } catch (e) {
      showNotification(e.response?.data?.message || t("profilePage.updateError"), "error");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <View style={{ padding: 40, alignItems: "center" }}>
        <ActivityIndicator size="large" color="#388e3c" />
        <Text style={{ marginTop: 10 }}>{t("profilePage.loading")}</Text>
      </View>
    );
  }

  if (!user) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ProfileTabs />
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>👤 {t("profilePage.profile")}</Text>
          <Text style={styles.headerSub}>
            {t("profilePage.welcome")},{" "}
            <Text style={{ fontWeight: "bold" }}>{user.name}</Text>
          </Text>
        </View>

        <View style={{ marginVertical: 16 }}>
          {/* Name */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>{t("profilePage.name")}</Text>
            <TextInput
              style={[styles.input, !editMode && styles.inputDisabled]}
              value={editMode ? editData.name : user.name}
              editable={editMode}
              onChangeText={(val) => handleChange("name", val)}
            />
          </View>
          {/* Email */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>{t("profilePage.email")}</Text>
            <TextInput
              style={[styles.input, !editMode && styles.inputDisabled]}
              value={editMode ? editData.email : user.email}
              editable={editMode}
              onChangeText={(val) => handleChange("email", val)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          {/* Phone */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>{t("profilePage.phone")}</Text>
            <TextInput
              style={[styles.input, styles.inputDisabled]}
              value={user.phone || ""}
              editable={false}
            />
          </View>
          {/* Address */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>{t("profilePage.street")}</Text>
            <TextInput
              style={[styles.input, !editMode && styles.inputDisabled]}
              value={editMode ? editData.address?.street : user.address?.street || ""}
              editable={editMode}
              onChangeText={(val) => handleAddressChange("street", val)}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>{t("profilePage.city")}</Text>
            <TextInput
              style={[styles.input, !editMode && styles.inputDisabled]}
              value={editMode ? editData.address?.city : user.address?.city || ""}
              editable={editMode}
              onChangeText={(val) => handleAddressChange("city", val)}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>{t("profilePage.state")}</Text>
            <TextInput
              style={[styles.input, !editMode && styles.inputDisabled]}
              value={editMode ? editData.address?.state : user.address?.state || ""}
              editable={editMode}
              onChangeText={(val) => handleAddressChange("state", val)}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>{t("profilePage.pincode")}</Text>
            <TextInput
              style={[styles.input, !editMode && styles.inputDisabled]}
              value={editMode ? editData.address?.pincode : user.address?.pincode || ""}
              editable={editMode}
              onChangeText={(val) => handleAddressChange("pincode", val)}
              keyboardType="number-pad"
            />
          </View>

          {/* Volunteer Section */}
          {user.is_volunteer && (
            <View style={styles.volSection}>
              <Text style={styles.volHeader}>{t("profilePage.volunteerDetails")}</Text>
              {/* City */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>{t("profilePage.city")}</Text>
                {editMode ? (
                  <PickerSelect
                    value={volEditData.city}
                    onValueChange={(v) => handleVolChange("city", v)}
                    items={cities.map((c) => ({ label: c, value: c }))}
                    placeholder={{ label: t("profilePage.selectCity"), value: "" }}
                  />
                ) : (
                  <TextInput
                    style={[styles.input, styles.inputDisabled]}
                    value={user.volunteer?.city || ""}
                    editable={false}
                  />
                )}
              </View>
              {/* Availability */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>{t("profilePage.availability")}</Text>
                {editMode ? (
                  <PickerSelect
                    value={volEditData.availability}
                    onValueChange={(v) => handleVolChange("availability", v)}
                    items={availabilities.map((a) => ({ label: t(a.label), value: a.value }))}
                    placeholder={{ label: t("profilePage.select"), value: "" }}
                  />
                ) : (
                  <TextInput
                    style={[styles.input, styles.inputDisabled]}
                    value={
                      availabilities.find((a) => a.value === user.volunteer?.availability)?.label ||
                      user.volunteer?.availability ||
                      ""
                    }
                    editable={false}
                  />
                )}
              </View>
              {/* Sector */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>{t("profilePage.sector")}</Text>
                {editMode ? (
                  <PickerSelect
                    value={volEditData.sector}
                    onValueChange={(v) => handleVolChange("sector", v)}
                    items={sectors.map((s) => ({ label: s, value: s }))}
                    placeholder={{ label: t("profilePage.select"), value: "" }}
                  />
                ) : (
                  <TextInput
                    style={[styles.input, styles.inputDisabled]}
                    value={user.volunteer?.sector || ""}
                    editable={false}
                  />
                )}
              </View>
              {/* Profession */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>{t("profilePage.profession")}</Text>
                {editMode ? (
                  <PickerSelect
                    value={volEditData.profession}
                    onValueChange={(v) => handleVolChange("profession", v)}
                    items={professions.map((p) => ({ label: p, value: p }))}
                    placeholder={{ label: t("profilePage.select"), value: "" }}
                  />
                ) : (
                  <TextInput
                    style={[styles.input, styles.inputDisabled]}
                    value={user.volunteer?.profession || ""}
                    editable={false}
                  />
                )}
              </View>
              {/* Motivation */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>{t("profilePage.motivation")}</Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.inputMultiline,
                    !editMode && styles.inputDisabled,
                  ]}
                  value={
                    editMode
                      ? volEditData.why_do_you_want_to_join_us
                      : user.volunteer?.why_do_you_want_to_join_us || ""
                  }
                  editable={editMode}
                  onChangeText={(val) =>
                    handleVolChange("why_do_you_want_to_join_us", val)
                  }
                  multiline
                  numberOfLines={3}
                />
              </View>
            </View>
          )}

          {/* Edit/Save/Cancel buttons */}
          {!editMode ? (
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => setEditMode(true)}
            >
              <Text style={styles.editBtnText}>{t("profilePage.editInfo")}</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.btnRow}>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSave}
                disabled={saving}
              >
                <Text style={styles.saveBtnText}>
                  {saving ? t("profilePage.saving") : t("profilePage.save")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setEditMode(false)}
              >
                <Text style={styles.cancelBtnText}>{t("profilePage.cancel")}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

// Simple PickerSelect for React Native (no external package)
function PickerSelect({ value, onValueChange, items, placeholder }) {
  return (
    <View style={{
      backgroundColor: "#f7f9fc",
      borderRadius: 6,
      borderWidth: 1,
      borderColor: "#e9ecef",
      marginBottom: 12,
    }}>
      <Picker
        selectedValue={value}
        onValueChange={onValueChange}
        style={{ height: 42, paddingHorizontal: 8 }}
      >
        {placeholder && (
          <Picker.Item label={placeholder.label} value={placeholder.value} color="#888" />
        )}
        {items.map((item) => (
          <Picker.Item key={item.value} label={item.label} value={item.value} />
        ))}
      </Picker>
    </View>
  );
}

import { Picker } from "@react-native-picker/picker"; // Place this at the top of the file

const styles = StyleSheet.create({
  container: { padding: 16, maxWidth: 600, alignSelf: "center", width: "100%" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
    minHeight: 350,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    marginBottom: 30,
  },
  header: { marginBottom: 12 },
  headerTitle: { fontSize: 21, fontWeight: "bold", color: "#388e3c" },
  headerSub: { color: "#333", fontSize: 15, marginTop: 2 },
  formGroup: { marginBottom: 13 },
  label: { fontWeight: "bold", fontSize: 14, marginBottom: 4, color: "#444" },
  input: {
    backgroundColor: "#f7f9fc",
    borderRadius: 6,
    padding: 11,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#e9ecef",
    color: "#222",
  },
  inputMultiline: { minHeight: 60, textAlignVertical: "top" },
  inputDisabled: { backgroundColor: "#f2f2f2", color: "#999" },
  volSection: {
    marginTop: 24,
    backgroundColor: "#f8f9fc",
    borderWidth: 1,
    borderColor: "#e0e7ef",
    borderRadius: 8,
    padding: 14,
  },
  volHeader: {
    fontWeight: "600",
    color: "#1976d2",
    marginBottom: 10,
    fontSize: 16,
  },
  editBtn: {
    marginTop: 18,
    backgroundColor: "#388e3c",
    borderRadius: 5,
    padding: 12,
    alignItems: "center",
  },
  editBtnText: { color: "#fff", fontWeight: "600", fontSize: 15 },
  btnRow: { flexDirection: "row", marginTop: 18, gap: 10 },
  saveBtn: {
    backgroundColor: "#388e3c",
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 28,
    alignItems: "center",
    marginRight: 8,
  },
  saveBtnText: { color: "#fff", fontWeight: "600", fontSize: 15 },
  cancelBtn: {
    backgroundColor: "#bbb",
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  cancelBtnText: { color: "#fff", fontWeight: "500", fontSize: 15 },
});