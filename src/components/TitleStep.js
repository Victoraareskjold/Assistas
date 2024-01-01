import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  styles,
} from "react-native";
import containerStyles from "../../styles/containerStyles";
import placeholderStyles from "../../styles/placeholderStyles";
import fonts from "../../styles/fonts";
import buttons from "../../styles/buttons";

export default function TitleStep({ onNext, initialTitle }) {
  const [title, setTitle] = useState(initialTitle);
  const [errorMessage, setErrorMessage] = useState("");

  const handleNext = () => {
    if (!title.trim()) {
      setErrorMessage("Du må fylle ut tittelen før du går videre."); // Oppdaterer feilmeldingen
    } else {
      onNext({ overskrift: title });
      setErrorMessage(""); // Nullstiller feilmeldingen hvis alt er ok
    }
  };

  return (
    <View style={containerStyles.defaultContainer}>
      <Text style={fonts.subHeader}>Hva trenger du hjelp med?</Text>
      <TextInput
        style={placeholderStyles.simple}
        placeholder="Overskrift"
        value={title}
        onChangeText={setTitle}
        placeholderTextColor={"rgba(39, 39, 39, 0.5)"}
      />
      {errorMessage ? (
        <Text style={fonts.errorText}>{errorMessage}</Text>
      ) : null}
      <TouchableOpacity style={buttons.nextStep} onPress={handleNext}>
        <Text style={fonts.primaryBtn}>Neste</Text>
      </TouchableOpacity>
    </View>
  );
}
