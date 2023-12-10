import { Pressable, StyleSheet, Text, View } from "react-native";
import GlobalColors from "../../Color/colors";
function FlatButton({ children, onPress, color }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View>
        <Text style={[styles.buttonText, color && { color: color }]}>
          {children}
        </Text>
      </View>
    </Pressable>
  );
}

export default FlatButton;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  pressed: {
    opacity: 0.7,
  },
  buttonText: {
    fontWeight: "500",
    textAlign: "center",
    color: GlobalColors.text_input,
  },
});
