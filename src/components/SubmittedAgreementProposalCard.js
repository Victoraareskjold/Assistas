import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import colors from "../../styles/colors";

const SubmittedAgreementProposalCard = ({ sendProposal }) => {
  const [selectedPriceType, setSelectedPriceType] = useState(null);
  const [price, setPrice] = useState("");

  // Handlers
  const handlePriceTypeSelection = (type) => {
    setSelectedPriceType(type);
  };

  const onPriceChange = (value) => {
    setPrice(value);
  };

  return (
    <View style={styles.container}>
      <Text>Opprett en avtale:</Text>
      <View style={styles.optionsContainer}>
        {/* Timepris og Fastpris valg */}
        <TouchableOpacity
          style={[
            styles.optionCard,
            selectedPriceType === "hourly" && styles.selectedOption,
          ]}
          onPress={() => handlePriceTypeSelection("hourly")}
        >
          <Text>lol</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.optionCard,
            selectedPriceType === "total" && styles.selectedOption,
          ]}
          onPress={() => handlePriceTypeSelection("total")}
        >
          <Text>Fastpris</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.priceInput}
        onChangeText={onPriceChange}
        value={price}
        placeholder="Skriv inn pris"
        keyboardType="numeric"
      />
      <TouchableOpacity
        style={styles.sendButton}
        onPress={() => sendProposal(selectedPriceType, price)}
      >
        <Text style={styles.sendButtonText}>Send tilbud</Text>
      </TouchableOpacity>
    </View>
  );
};

// Fortsett med samme stil som før, men legg til stil for TextInput
const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    margin: 12,
    borderRadius: 10,
    backgroundColor: "white",
    gap: 16,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    gap: 16,
  },
  optionCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 24,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E1E8F9",
    gap: 6,
    opacity: 0.5,
  },
  icon: {
    width: 50,
    height: 50,
  },
  sendButton: {
    backgroundColor: colors.primary,
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "center",
  },
  sendButtonText: {
    color: "white",
    fontWeight: "bold",
    lineHeight: 28,
    fontSize: 14,
  },
  selectedOption: {
    borderColor: colors.primary,
    borderWidth: 2,
    opacity: 1,
  },
  priceInput: {
    borderWidth: 1,
    borderColor: "#E1E8F9",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 5,
  },
});

export default SubmittedAgreementProposalCard;
