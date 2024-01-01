import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import containerStyles from "../../styles/containerStyles";
import placeholderStyles from "../../styles/placeholderStyles";
import fonts from "../../styles/fonts";
import buttons from "../../styles/buttons";

export default function TitleStep({ onNext, initialTitle }) {
  const [title, setTitle] = useState(initialTitle);

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

      <TouchableOpacity
        style={buttons.nextStep}
        onPress={() => onNext({ overskrift: title })}
      >
        <Text style={fonts.primaryBtn}>Neste</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // Dine stiler her ...
});
