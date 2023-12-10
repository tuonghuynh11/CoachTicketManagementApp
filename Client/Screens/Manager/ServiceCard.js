import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import ModalConfirm from "./Popup/ModalConfirm";

export default function ServiceCard({ item }) {
  
  
  return (
    <View style={styles.container}>
        <Text style={styles.text}>{item.name}</Text>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: "#FFFFFF",
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: 10,
    marginVertical: 10,
    width: 160,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
  },
});
