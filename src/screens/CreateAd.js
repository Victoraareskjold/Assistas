import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Image,
  Touchable,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import { auth, storage } from "../../firebase";
import {
  getFirestore,
  doc,
  collection,
  addDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import Ionicons from "@expo/vector-icons/Ionicons";

import { firestore } from "../../firebase";

import TitleStep from "../components/TitleStep";
import CategorySelector from "../components/CategorySelector";
import DescriptionStep from "../components/DescriptionStep";
import LocationStep from "../components/LocationStep";
import ProgressBar from "../components/ProgressBar"; // Oppdater stien til komponenten

import * as ImagePicker from "expo-image-picker";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import buttons from "../../styles/buttons";
import fonts from "../../styles/fonts";
import containerStyles from "../../styles/containerStyles";

export default function CreateAd({ route }) {
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(1);

  const [imageUri, setImageUri] = useState(null);

  const [isUploading, setIsUploading] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [adData, setAdData] = useState({
    overskrift: "",
    beskrivelse: "",
    sted: "",
    kategori: [],
    imageUri: null,
  });

  const goToNextStep = (newData) => {
    setAdData({ ...adData, ...newData });
    setCurrentStep(currentStep + 1);
  };

  /* Backhandler */
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            if (currentStep > 1) {
              setCurrentStep(currentStep - 1);
            } else {
              navigation.goBack();
            }
          }}
        >
          <Image
            source={require("../../assets/icon.png")}
            style={{ width: 32, height: 32 }}
          />
        </TouchableOpacity>
      ),
    });
  }, [currentStep, navigation]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <TitleStep initialTitle={adData.overskrift} onNext={goToNextStep} />
        );
      case 2:
        return (
          <CategorySelector
            selectedCategories={adData.kategori} // Pass the saved categories
            onSelectCategories={(kategori) =>
              setAdData({ ...adData, kategori })
            }
            onNext={goToNextStep}
          />
        );
      case 3:
        return (
          <DescriptionStep
            initialDescription={adData.beskrivelse}
            onNext={goToNextStep}
          />
        );
      case 4:
        return (
          <LocationStep
            initialLocation={adData.sted}
            initialAddress={adData.adresse}
            onNext={goToNextStep}
          />
        );
      case 5: // Anta at dette er sluttpunktet
        return (
          <View style={containerStyles.defaultContainer}>
            <Text>Er du klar til å opprette annonsen?</Text>
            <TouchableOpacity onPress={leggTilAnnonse} style={buttons.nextStep}>
              <Text style={fonts.primaryBtn}>Opprett Annonse</Text>
            </TouchableOpacity>
            {formErrorMessage ? (
              <Text style={styles.error}>{formErrorMessage}</Text>
            ) : null}
          </View>
        );
      default:
        return <Text>Noe gikk galt, prøv igjen!</Text>;
    }
  };

  const isFormValid = () => {
    return (
      adData.overskrift.trim() !== "" &&
      adData.beskrivelse.trim() !== "" &&
      adData.sted.trim() !== "" &&
      adData.kategori.length > 0
    );
  };

  const leggTilAnnonse = async () => {
    if (!isFormValid() || isUploading) {
      setFormErrorMessage("Alle felt må fylles ut eller opplasting pågår");
      return;
    }

    try {
      setIsUploading(true); // Start opplasting

      // Første del av funksjonen - last opp bildet og få URL
      const imageUrl = await uploadImage();

      // Andre del av funksjonen - legg til annonse
      const db = getFirestore(firestore);
      const userUID = auth.currentUser.uid;
      const annonseRef = await addDoc(collection(db, "annonser"), {
        overskrift: adData.overskrift,
        beskrivelse: adData.beskrivelse,
        sted: adData.sted,
        kategori: adData.kategori,
        uid: userUID,
        status: adData.status || "Ikke startet", // Assuming status is part of adData or provide a default value
        bildeUrl: imageUrl || null,
      });

      // Hent og oppdater brukerdata
      const userDocRef = doc(db, "users", userUID);
      const userDocSnapshot = await getDoc(userDocRef);
      const userData = userDocSnapshot.data();
      await updateDoc(annonseRef, { user: userData });

      // Naviger tilbake
      navigation.goBack();
    } catch (error) {
      console.error("Feil ved opplasting av annonse:", error);
      setFormErrorMessage("Det oppstod en feil ved opprettelse av annonse");
    } finally {
      setIsUploading(false); // Avslutt opplasting uansett utfall
    }
  };

  // Funksjon for å velge bilde
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri); // Oppdaterer for å bruke den første asset-en
    }
  };

  // Funksjon for å laste opp bilde
  const uploadImage = async () => {
    if (!imageUri) return null;

    const response = await fetch(imageUri);
    const blob = await response.blob();

    const imageRef = storageRef(storage, `images/${Date.now()}`);
    await uploadBytes(imageRef, blob);

    const downloadUrl = await getDownloadURL(imageRef);
    return downloadUrl;
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={{ backgroundColor: "#FFF", flex: 1 }}>
      <SafeAreaView />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
        <View style={styles.paginationContainer}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="chevron-back" size={28} color="black" />
          </TouchableOpacity>
          <ProgressBar totalSteps={5} currentStep={currentStep} />
        </View>
        {renderStep()}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    paddingHorizontal: 20,
  },
  errorContainer: {
    marginBottom: 12,
  },
  errorMessage: {
    color: "red",
    fontSize: 16,
    fontWeight: "500",
  },
});
