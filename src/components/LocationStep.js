// LocationStep.js
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

export default function LocationStep({
  onNext,
  initialLocation,
  initialAddress,
}) {
  const [location, setLocation] = useState(initialLocation);
  const [address, setAddress] = useState(initialAddress);

  return (
    <View style={containerStyles.defaultContainer}>
      <Text style={fonts.subHeader}>Sted</Text>
      <TextInput
        style={placeholderStyles.simple}
        placeholder="By eller område"
        value={location}
        onChangeText={setLocation}
        required // Markerer dette feltet som påkrevd
      />

      <TextInput
        style={placeholderStyles.simple}
        placeholder="Din adresse (valgfri)"
        value={address}
        onChangeText={setAddress}
      />

      <TouchableOpacity
        style={buttons.nextStep}
        onPress={() => onNext({ sted: location, adresse: address })}
      >
        <Text style={fonts.primaryBtn}>Neste</Text>
      </TouchableOpacity>
    </View>
  );
}
