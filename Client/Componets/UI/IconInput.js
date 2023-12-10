import { Text, TextInput, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
function IconInput({
  label,
  keyboardType,
  secure,
  onUpdateValue,
  value,
  isInvalid,
  placeholder,
  message,
  icon,
}) {
  return (
    <View style={styles.root}>
      {label !== "" && <Text style={[styles.label]}>{label}</Text>}
      <View style={[styles.inputContainer, , isInvalid && styles.invalidInput]}>
        <Ionicons name={icon} size={24} color="black" />
        <TextInput
          style={styles.textInput}
          keyboardType={keyboardType}
          value={value}
          onChangeText={onUpdateValue}
          secureTextEntry={secure}
          placeholder={placeholder}
        />
      </View>
      {isInvalid && <Text style={styles.invalidLabel}>*{message}</Text>}
    </View>
  );
}
export default IconInput;

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
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    backgroundColor: "white",
    paddingLeft: 10,
    borderColor: "black",
    borderWidth: 0.19,
  },
  textInput: {
    color: "black",
    fontSize: 18,
    paddingHorizontal: 8,
    paddingVertical: 8,
    paddingRight: 25,
    width: "100%",
  },
  invalidLabel: {
    color: "#FF4E00",
  },
  invalidInput: {
    borderColor: "#FF4E00",
  },
});
