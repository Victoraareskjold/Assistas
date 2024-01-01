// DescriptionStep.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import placeholderStyles from "../../styles/placeholderStyles";
import containerStyles from "../../styles/containerStyles";
import buttons from "../../styles/buttons";
import fonts from "../../styles/fonts";

export default function DescriptionStep({ onNext, initialDescription }) {
  const [description, setDescription] = useState(initialDescription);
  const [errorMessage, setErrorMessage] = useState("");

  const handleNext = () => {
    if (!description.trim()) {
      setErrorMessage("Du må fylle ut beskrivelsen før du går videre.");
    } else {
      onNext({ beskrivelse: description });
      setErrorMessage("");
    }
  };

  return (
    <View style={containerStyles.defaultContainer}>
      <View style={{ gap: 4 }}>
        <Text style={fonts.subHeader}>Beskrivelse</Text>
        <Text style={[fonts.body, { opacity: 0.75 }]}>
          Forklar kort hva du trenger hjelp med
        </Text>
      </View>
      <TextInput
        style={placeholderStyles.bigbox}
        placeholder="Jeg trenger hjelp til..."
        value={description}
        onChangeText={setDescription}
        multiline={true}
        numberOfLines={4}
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

const styles = StyleSheet.create({
  // Dine stiler her ...
});
