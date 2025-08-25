import React from "react";
import { ScrollView } from "react-native";
import Layout from "../components/Layout";
import Impact from "../components/Impact";

export default function ImpactScreen() {
  return (
    <Layout>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Impact />
      </ScrollView>
    </Layout>
  );
}