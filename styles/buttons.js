import { StyleSheet, Text, View } from "react-native";
import React from "react";
import colors from "./colors";

export default StyleSheet.create({
  btn1: {
    marginTop: 6,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  textBtn: {
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "blue",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
  },
  iconButton: {
    backgroundColor: colors.lightBlue,
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    paddingVertical: 24,
    flex: 1,
    gap: 12,
  },
  nextStep: {
    backgroundColor: colors.primary,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 50,
  },
});
