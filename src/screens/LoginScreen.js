import React from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import Login from "../components/Login";

export default function LoginScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.inner}>
        <Login />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f4f8f7",
  },
  inner: {
    flex: 1,
    justifyContent: "center",
    minHeight: 480,
  },
});