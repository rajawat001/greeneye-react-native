import React from "react";
import { ScrollView } from "react-native";
import Layout from "../components/Layout";
import Programs from "../components/Programs";

export default function ProgramsScreen() {
  return (
    <Layout>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Programs />
      </ScrollView>
    </Layout>
  );
}