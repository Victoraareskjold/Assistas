// ProgressBar.js
import React from "react";
import { View, Animated, StyleSheet } from "react-native";
import colors from "../../styles/colors";

const ProgressBar = ({ totalSteps, currentStep }) => {
  // Beregn bredden basert på nåværende steg
  const width = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    // Start animasjon hver gang currentStep endres
    Animated.timing(width, {
      toValue: (currentStep / totalSteps) * 100,
      duration: 300, // Varighet for animasjonen, juster etter ønske
      useNativeDriver: false,
    }).start();
  }, [currentStep, totalSteps]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.filler,
          {
            width: width.interpolate({
              inputRange: [0, 100],
              outputRange: ["0%", "100%"],
            }),
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 8, // Høyden på progressbaren, juster etter ønske
    backgroundColor: "#E1E8F9", // Bakgrunnsfarge for ubefylt område
    borderRadius: 100,
    overflow: "hidden",
    width: "100%",
    flex: 1,
  },
  filler: {
    height: "100%",
    backgroundColor: colors.primary, // Fyllfarge for progressbar
    borderRadius: 5,
  },
});

export default ProgressBar;
