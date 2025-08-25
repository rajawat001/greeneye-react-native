import React from "react";
import { ScrollView } from "react-native";
import Layout from "../components/Layout";
import BlogIndex from "../components/BlogIndex";

export default function BlogScreen() {
  return (
    <Layout>
      <ScrollView showsVerticalScrollIndicator={false}>
        <BlogIndex />
      </ScrollView>
    </Layout>
  );
}