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
  const [errorMessage, setErrorMessage] = useState("");

  const handleNext = () => {
    if (!location.trim()) {
      setErrorMessage("Du må fylle ut by eller område før du går videre.");
    } else {
      onNext({ sted: location, adresse: address });
      setErrorMessage("");
    }
  };

  return (
    <View style={containerStyles.defaultContainer}>
      <View style={{ gap: 12 }}>
        <Text style={fonts.subHeader}>Sted</Text>
        <View style={{ gap: 4 }}>
          <Text style={[fonts.body, { opacity: 0.75 }]}>By eller område</Text>
          <TextInput
            style={placeholderStyles.simple}
            placeholder="Oslo"
            value={location}
            onChangeText={setLocation}
            required
          />
        </View>

        <View style={{ gap: 4 }}>
          <Text style={[fonts.body, { opacity: 0.75 }]}>
            Din adresse (valgfri)
          </Text>
          <TextInput
            style={placeholderStyles.simple}
            placeholder="Karl Johans Gate 1"
            value={address}
            onChangeText={setAddress}
          />
        </View>
      </View>

      {errorMessage ? (
        <Text style={fonts.errorText}>{errorMessage}</Text>
      ) : null}

      <TouchableOpacity style={buttons.nextStep} onPress={handleNext}>
        <Text style={fonts.primaryBtn}>Neste</Text>
      </TouchableOpacity>
    </View>
  );
}
