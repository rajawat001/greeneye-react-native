import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const PREVIEW_LINES = 4;

export default function BlogIndex() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { i18n } = useTranslation();
  const navigation = useNavigation();

  useEffect(() => {
    const apiUrl = `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/blogs`;

    axios
      .get(apiUrl)
      .then((res) => {
        setBlogs(res.data.blogs || []);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.error("❌ Blog fetch error:", err.message);
      });
  }, []);

  if (loading)
    return (
      <View style={{ padding: 40, alignItems: "center" }}>
        <ActivityIndicator size="large" color="#388e3c" />
        <Text style={{ marginTop: 10, color: "#388e3c" }}>Loading blogs...</Text>
      </View>
    );

  const publishedBlogs = blogs.filter((b) => b.published);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        {i18n.language === "fr" ? "Notre Blog" : "Our Blog"}
      </Text>

      {publishedBlogs.length === 0 ? (
        <Text style={{ color: "#888", marginTop: 30 }}>No blogs found.</Text>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {publishedBlogs.map((b) => {
            const translation =
              b.translations?.[i18n.language] || b.translations?.en || {};

            return (
              <TouchableOpacity
                key={b.slug}
                style={styles.card}
                activeOpacity={0.88}
                onPress={() => {
                  navigation.navigate("BlogDetail", { slug: b.slug });
                }}
              >
                {b.image ? (
                  <Image
                    source={{ uri: `${b.image}` }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    style={[
                      styles.image,
                      {
                        backgroundColor: "#f7f9fc",
                        alignItems: "center",
                        justifyContent: "center",
                      },
                    ]}
                  >
                    <Text style={{ color: "#bbb" }}>No image</Text>
                  </View>
                )}

                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {translation.title || "No title"}
                  </Text>
                  <Text numberOfLines={PREVIEW_LINES} style={styles.cardDesc}>
                    {translation.content || "No content available"}
                  </Text>
                  <View style={styles.cardFooter}>
                    <Text style={styles.date}>
                      {new Date(b.createdAt).toLocaleDateString(i18n.language)}
                    </Text>
                    <Text style={styles.author}>{b.author || "GreenEye"}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 16,
    paddingHorizontal: 10,
    maxWidth: "100%",
    alignSelf: "stretch",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 18,
    color: "#388e3c",
    letterSpacing: 1.3,
    marginTop: 10,
  },
  scrollContent: {
    flexDirection: "row",
    gap: 16,
    paddingBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    minHeight: 300,
    width: 310,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  image: {
    width: "100%",
    height: 130,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    backgroundColor: "#f7f9fc",
  },
  cardContent: {
    padding: 18,
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 17,
    marginBottom: 7,
    color: "#212529",
    letterSpacing: 0.5,
  },
  cardDesc: {
    fontSize: 13.5,
    color: "#555",
    marginBottom: 12,
    minHeight: 56,
    maxHeight: 80,
    flexShrink: 1,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto",
    alignItems: "flex-end",
  },
  date: {
    fontSize: 12,
    color: "#aaa",
    fontWeight: "500",
  },
  author: {
    fontSize: 12,
    fontStyle: "italic",
    color: "#aaa",
  },
});
