import React from "react";
import { ScrollView } from "react-native";
import Layout from "../components/Layout";
import Donate from "../components/Donate";

export default function DonateScreen() {
  return (
    <Layout>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Donate />
      </ScrollView>
    </Layout>
  );
}