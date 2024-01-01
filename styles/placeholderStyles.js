import { StyleSheet, Text, View } from "react-native";
import React from "react";
import colors from "./colors";

export default StyleSheet.create({
  simple: {
    borderWidth: 1,
    borderColor: "#E1E8F9",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  bigbox: {
    backgroundColor: colors.darkGrey,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderRadius: 5,
    textAlignVertical: "top",
    minHeight: 120,
  },
});
