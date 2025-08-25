// src/components/CustomButton.js
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { globalStyles } from "../globalStyles";

export default function CustomButton({ title, onPress, outline }) {
  return (
    <TouchableOpacity
      style={[globalStyles.btn, outline && globalStyles.btnOutline]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={globalStyles.btnText}>{title}</Text>
    </TouchableOpacity>
  );
}