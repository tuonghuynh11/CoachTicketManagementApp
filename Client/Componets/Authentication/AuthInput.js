import { Text, TextInput, View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
function AuthInput({
  label,
  keyboardType,
  secure,
  onUpdateValue,
  value,
  isInvalid,
  placeholder,
  message,
  isDisabled,
}) {
  const [showPassword, setShowPassword] = useState(secure);
  return (
    <View style={styles.root}>
      <Text style={[styles.label]}>{label}</Text>
      <View
        style={[
          styles.inputContainer,
          ,
          isInvalid && styles.invalidInput,
          isDisabled && styles.disabled,
        ]}
      >
        <TextInput
          style={styles.textInput}
          keyboardType={keyboardType}
          value={value}
          onChangeText={onUpdateValue}
          secureTextEntry={showPassword}
          placeholder={placeholder}
          editable={!isDisabled}
          placeholderTextColor="#453e3e49"
        />
        {secure && (
          <MaterialCommunityIcons
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color="#aaa"
            style={{ marginRight: 10 }}
            onPress={() => setShowPassword(!showPassword)}
            disabled={isDisabled}
          />
        )}
      </View>
      {isInvalid && <Text style={styles.invalidLabel}>*{message}</Text>}
    </View>
  );
}
export default AuthInput;

const styles = StyleSheet.create({
  root: {
    marginTop: 10,
  },
  label: {
    color: "black",
    fontSize: 15,
    marginBottom: 5,
    fontWeight: "700",
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textInput: {
    color: "black",
    fontSize: 17,
    paddingHorizontal: 8,
    paddingVertical: 8,
    flex: 1,
  },
  invalidLabel: {
    color: "#FF4E00",
  },
  invalidInput: {
    borderColor: "#FF4E00",
  },
  disabled: {
    opacity: 0.5,
  },
});
