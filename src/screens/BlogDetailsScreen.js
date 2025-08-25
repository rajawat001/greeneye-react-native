import React from "react";
import { ScrollView } from "react-native";
import Layout from "../components/Layout";
import BlogDetails from "../components/BlogDetails";

export default function BlogScreen() {
  return (
    <Layout>
      <ScrollView showsVerticalScrollIndicator={false}>
        <BlogDetails />
      </ScrollView>
    </Layout>
  );
}