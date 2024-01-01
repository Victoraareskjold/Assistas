import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  StyleSheet,
  Button,
} from "react-native";
import { categories } from "../components/Categories";
import colors from "../../styles/colors";
import buttons from "../../styles/buttons";
import fonts from "../../styles/fonts";
import containerStyles from "../../styles/containerStyles";
import placeholderStyles from "../../styles/placeholderStyles";
import CheckedIcon from "../../assets/SVGs/CheckedIcon";

export default function CategorySelector({
  onSelectCategories,
  onNext,
  selectedCategories: initialSelectedCategories,
}) {
  const [selectedCategories, setSelectedCategories] = useState(
    initialSelectedCategories || []
  );
  const [errorMessage, setErrorMessage] = useState(""); // Ny state for feilmelding

  const handleSelectCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleNext = () => {
    if (selectedCategories.length === 0) {
      setErrorMessage("Du må velge minst én kategori."); // Oppdaterer feilmeldingen
    } else {
      onNext({ kategori: selectedCategories });
      setErrorMessage(""); // Nullstiller feilmeldingen hvis alt er ok
    }
  };

  return (
    <>
      <View style={containerStyles.defaultContainer}>
        <View style={{ gap: 4 }}>
          <Text style={fonts.subHeader}>Velg kategori</Text>
          <Text style={[fonts.body, { opacity: 0.75 }]}>
            Du kan velge flere kategorier
          </Text>
        </View>
        <View style={{ gap: 12 }}>
          {categories.map((category) => {
            const isSelected = selectedCategories.includes(category.text);
            return (
              <TouchableOpacity
                key={category.id}
                style={[
                  placeholderStyles.simple,
                  isSelected && styles.selectedCard,
                ]}
                onPress={() => handleSelectCategory(category.text)}
              >
                <View style={styles.radioButtonContainer}>
                  {isSelected ? (
                    <CheckedIcon />
                  ) : (
                    <View style={styles.radioButton} />
                  )}
                  <Text
                    style={[styles.text, isSelected && styles.textSelected]}
                  >
                    {category.text}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
        {errorMessage ? (
          <Text style={fonts.errorText}>{errorMessage}</Text>
        ) : null}

        <TouchableOpacity style={buttons.nextStep} onPress={handleNext}>
          <Text style={fonts.primaryBtn}>Neste</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row", // Endret for å tillate ikoner ved siden av tekst
    alignItems: "center",
    marginRight: 12,
    padding: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.lightGray, // Angi en farge for border
  },
  selectedCard: {
    borderColor: colors.primary, // Sett din ønskede farge for valgte kort
  },
  text: {
    marginLeft: 12,
    fontSize: 14,
  },
  textSelected: {
    fontWeight: "600",
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioButton: {
    height: 16,
    width: 16,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "#E1E8F9",
    alignItems: "center",
    justifyContent: "center",
  },
  radioButtonSelected: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: colors.primary, // Sett en farge for valgte radio buttons
  },
});
