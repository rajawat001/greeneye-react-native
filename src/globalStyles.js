// src/globalStyles.js
import { StyleSheet } from "react-native";
import { colors, layout } from "./theme";

export const globalStyles = StyleSheet.create({
  // Container & Section
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    width: "100%",
    alignSelf: "center",
  },
  section: {
    paddingVertical: 40,
    paddingHorizontal: 0,
    backgroundColor: colors.white,
  },
  sectionHeader: {
    alignItems: "center",
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.primaryGreen,
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: colors.gray,
    textAlign: "center",
    marginBottom: 12,
  },

  // Card
  card: {
    backgroundColor: colors.white,
    borderRadius: layout.borderRadius,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 4,
    marginVertical: 10,
    padding: 16,
  },

  // Button
  btn: {
    backgroundColor: colors.warmOrange,
    borderRadius: layout.borderRadius,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: "center",
    marginVertical: 10,
  },
  btnText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 16,
  },
  btnOutline: {
    backgroundColor: "transparent",
    borderColor: colors.primaryGreen,
    borderWidth: 2,
    color: colors.primaryGreen,
  },

  // Inputs
  input: {
    borderWidth: 2,
    borderColor: "#e9ecef",
    borderRadius: layout.borderRadius,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: colors.white,
    marginBottom: 16,
  },
  label: {
    fontWeight: "600",
    color: colors.primaryGreen,
    marginBottom: 6,
  },

  // Row & Grid
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: -8,
  },
  gridItem: {
    width: "48%",
    marginHorizontal: 8,
    marginBottom: 16,
  },

  // Shadow (for iOS and Android)
  shadow: {
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
});