import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Touchable,
  Image,
} from "react-native";

const ChatAdCard = ({ adData }) => {
  if (!adData) return null;

  return (
    <TouchableOpacity style={styles.adCard}>
      <Image
        style={styles.imageStyling}
        source={{ uri: adData.bildeUrl }} // Ensure this is the correct path to your image URL in the adData object
      />
      <View>
        <Text style={styles.adTitle}>{adData.overskrift}</Text>
        <Text style={styles.adBody}>{adData.sted}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  adCard: {
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderColor: "lightgrey",
    zIndex: 1,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    padding: 12,
  },
  adTitle: {
    fontWeight: "bold",
  },
  adBody: {
    fontWeight: "regular",
  },
  imageStyling: {
    height: 64,
    width: 64,
    borderRadius: 100,
  },
});

export default ChatAdCard;
