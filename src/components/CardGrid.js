// src/components/CardGrid.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { globalStyles } from "../globalStyles";

export default function CardGrid({ data }) {
  return (
    <View style={globalStyles.grid}>
      {data.map((item, idx) => (
        <View key={idx} style={[globalStyles.card, globalStyles.gridItem]}>
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>{item.title}</Text>
          <Text style={{ color: "#555", marginTop: 6 }}>{item.description}</Text>
        </View>
      ))}
    </View>
  );
}