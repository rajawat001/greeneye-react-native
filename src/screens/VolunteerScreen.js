import React from "react";
import { ScrollView } from "react-native";
import Layout from "../components/Layout";
import Volunteer from "../components/Volunteer";

export default function VolunteerScreen() {
  return (
    <Layout>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Volunteer />
      </ScrollView>
    </Layout>
  );
}