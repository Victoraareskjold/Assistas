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

  return (
    <View style={containerStyles.defaultContainer}>
      <Text style={fonts.subHeader}>Beskrivelse</Text>
      <TextInput
        style={placeholderStyles.bigbox}
        placeholder="Jeg trenger hjelp til..."
        value={description}
        onChangeText={setDescription}
        multiline={true}
        numberOfLines={4}
      />
      <TouchableOpacity
        style={buttons.nextStep}
        onPress={() => onNext({ beskrivelse: description })}
      >
        <Text style={fonts.primaryBtn}>Neste</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // Dine stiler her ...
});
