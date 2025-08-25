// src/components/BlogDetails.js

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useTranslation } from "react-i18next";
import { useRoute, useNavigation } from "@react-navigation/native";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function BlogDetails() {
  const route = useRoute();
  const navigation = useNavigation();
  const { slug } = route.params || {};
  const { i18n, t } = useTranslation("blog");
  const locale = i18n.language || "en";

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    fetch(`${API_BASE_URL}/api/blogs/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setBlog(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        Alert.alert(t("notFound"), "", [
          { text: t("backToBlogs"), onPress: () => navigation.goBack() }
        ]);
      });
  }, [slug]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2d6a4f" />
        <Text style={{ marginTop: 20 }}>{t("loading")}</Text>
      </View>
    );
  }

  if (!blog) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "#888", fontSize: 18, marginBottom: 24 }}>{t("notFound")}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← {t("backToBlogs")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const tr = blog.translations?.[locale] || blog.translations?.en || {};

  const fullImageUrl = blog.image ? `${blog.image}` : null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={styles.backBtnText}>← {t("backToBlogs")}</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{tr.title || t("noTitle")}</Text>

      {fullImageUrl ? (
        <Image
          source={{ uri: fullImageUrl }}
          style={styles.image}
          resizeMode="contain"
        />
      ) : null}

      <Text style={styles.content}>
        {tr.content || t("noContent")}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          📅 {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString(locale) : ""}
        </Text>
        <Text style={[styles.footerText, { fontWeight: "700" }]}>
          👤 {blog.author || "GreenEye"}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 20,
    paddingBottom: 40,
    minHeight: "100%",
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 24,
  },
  backBtn: {
    marginBottom: 20,
  },
  backBtnText: {
    color: "#2d6a4f",
    fontSize: 16,
    fontWeight: "600",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 16,
    lineHeight: 32,
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: "#f1f5f9",
  },
  content: {
    fontSize: 16,
    color: "#334155",
    lineHeight: 26,
    fontWeight: "400",
    marginBottom: 30,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#64748b",
  },
});
