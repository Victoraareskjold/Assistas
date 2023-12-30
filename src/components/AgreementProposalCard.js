import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import colors from "../../styles/colors";
import CheckIcon from "../../assets/SVGs/CheckIcon";

const AgreementProposalCard = ({
  sendProposal,
  status,
  proposalData,
  isUserAdCreator,
}) => {
  const [selectedPriceType, setSelectedPriceType] = useState(
    proposalData.selectedPriceType || "hourly"
  );
  const [price, setPrice] = useState(proposalData.price || "");

  useEffect(() => {
    if (proposalData && proposalData.price && proposalData.selectedPriceType) {
      setSelectedPriceType(proposalData.selectedPriceType);
      setPrice(proposalData.price);
    }
  }, [proposalData]); // Avhengighet av proposalData

  const handlePriceTypeSelection = (type) => {
    if (status === "pending") {
      setSelectedPriceType(type);
    }
  };

  return (
    <View style={styles.container}>
      {/* Behold estetikken men endre funksjonalitet basert på status */}
      {status === "pending" && (
        // Logikk for å opprette tilbud
        <>
          <Text style={styles.headerText}>Opprett en avtale:</Text>
          <View style={styles.optionsContainer}>
            {/* Vis valgmuligheter for pristype */}
            <TouchableOpacity
              style={[
                styles.optionCard,
                selectedPriceType === "hourly" && styles.selectedOption,
              ]}
              onPress={() => handlePriceTypeSelection("hourly")}
            >
              <Text>Timepris</Text>
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
            onChangeText={setPrice}
            value={price}
            placeholder="Skriv inn pris"
            keyboardType="numeric"
          />
          <View
            style={{ flexDirection: "row", gap: 32, justifyContent: "center" }}
          >
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: colors.lightBlue }]}
              onPress={() => sendProposal(selectedPriceType, price)}
            >
              <Text style={[styles.btnText, { color: colors.blue }]}>
                Send tilbud
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {status === "submitted" && (
        // Visning av sendt tilbud
        <>
          <Text style={styles.headerText}>Sendt tilbud:</Text>
          <View
            style={{
              flexDirection: "column",
              gap: 20,
              justifyContent: "center",
            }}
          >
            <View style={styles.optionsContainer}>
              {/* Vis valgmuligheter for pristype */}
              <TouchableOpacity
                style={[
                  styles.optionCard,
                  selectedPriceType === "hourly" && styles.selectedOption,
                ]}
              >
                <Text>Timepris</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.optionCard,
                  selectedPriceType === "total" && styles.selectedOption,
                ]}
              >
                <Text>Fastpris</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.priceInput}>{`${price}`}</Text>
            {isUserAdCreator && (
              <View
                style={{
                  flexDirection: "row",
                  gap: 32,
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: colors.lightGreen }]}
                  onPress={() => {
                    /* handle acceptance */
                  }}
                >
                  <CheckIcon />
                  <Text style={[styles.btnText, { color: colors.green }]}>
                    Godta
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: colors.lightRed }]}
                  onPress={() => {
                    /* handle rejection */
                  }}
                >
                  <Text style={[styles.btnText, { color: colors.red }]}>
                    Avslå
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {!isUserAdCreator && (
              <View
                style={{
                  flexDirection: "row",
                  gap: 32,
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: colors.lightBlue }]}
                  onPress={() => {
                    /* handle acceptance */
                  }}
                >
                  <Text style={[styles.btnText, { color: colors.blue }]}>
                    Venter på svar ...
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </>
      )}
    </View>
  );
};

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
  btn: {
    backgroundColor: colors.grey,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    minWidth: 96,
  },
  btnText: {
    fontSize: 16,
    color: "red",
  },
});

export default AgreementProposalCard;
