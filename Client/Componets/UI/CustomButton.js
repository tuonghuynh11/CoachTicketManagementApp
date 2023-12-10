import { Pressable, StyleSheet, Text, View } from "react-native";
import GlobalColors from "../../Color/colors";
import colors from "../../Color/colors";
function CustomButton({ children, onPress, color, disabled = false, radius }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        radius && { borderRadius: radius },
        pressed && styles.pressed,
        color && { backgroundColor: color },
        disabled && { opacity: 0.5 },
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <View>
        <Text style={styles.buttonText}>{children}</Text>
      </View>
    </Pressable>
  );
}

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 12,
    elevation: 2,
    shadowColor: "black",
    backgroundColor: GlobalColors.button,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  pressed: {
    opacity: 0.7,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
