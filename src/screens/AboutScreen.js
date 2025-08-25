import React from "react";
import { ScrollView } from "react-native";
import Layout from "../components/Layout";
import About from "../components/About";

export default function BlogScreen() {
  return (
    <Layout>
      <ScrollView showsVerticalScrollIndicator={false}>
        <About />
      </ScrollView>
    </Layout>
  );
}