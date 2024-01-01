import { StyleSheet, Text, View } from "react-native";
import React from "react";
import colors from "./colors";

export default StyleSheet.create({
  header: {
    fontSize: 28,
    fontWeight: "600",
    letterSpacing: 1,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "600",
  },
  btnBody: {
    fontSize: 16,
    fontWeight: "500",
  },
  body: {
    fontSize: 14,
  },
  primaryBtn: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  errorText: {
    color: colors.red,
    fontWeight: "500",
    textAlign: "center",
  },
});
