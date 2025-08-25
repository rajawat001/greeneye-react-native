import React from "react";
import { ScrollView } from "react-native";
import Layout from "../components/Layout";
import Contact from "../components/Contact";

export default function ContactScreen() {
  return (
    <Layout>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Contact />
      </ScrollView>
    </Layout>
  );
}