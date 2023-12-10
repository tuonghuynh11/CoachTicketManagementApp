import { TextInput, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
function InputIcon({ icon, placeholder }) {
  return (
    <View style={styles.root}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={24} color="black" />
      </View>
      <TextInput placeholder={placeholder} />
    </View>
  );
}
export default InputIcon;
const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    padding: 5,
  },
  iconContainer: {
    paddingRight: 5,
    borderRightWidth: 1,
    borderRightColor: "gray",
  },
});
