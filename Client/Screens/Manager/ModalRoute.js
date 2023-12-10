import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  Pressable,
  ScrollView,
  TouchableWithoutFeedback,
  SafeAreaView,
  Keyboard,
  FlatList,
  Modal,
} from "react-native";
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";

export default function ModalRoute({
  visible,
  hide,
  navigation,
  navigateScreen,
}) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={hide}
      transparent
    >
      <Pressable style={styles.upper} onPress={hide}></Pressable>
      <View style={styles.lower}>
        <Pressable
          style={({ pressed }) => [styles.choose, pressed && { opacity: 0.85 }]}
          onPress={() => {
            hide();
            navigation.navigate(navigateScreen);
          }}
        >
          <MaterialIcons name="edit" size={35} color="#72C6A1" />
          <Text style={styles.text}>Edit</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.choose, pressed && { opacity: 0.85 }]}
        >
          <MaterialIcons name="delete" size={35} color="#EB3223" />
          <Text style={styles.text}>Delete</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.choose, pressed && { opacity: 0.85 }]}
        >
          <MaterialIcons name="airport-shuttle" size={35} color="#f6ea64" />
          <Text style={styles.text}>Manage Shuttle</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  upper: {
    height: "70%",
    backgroundColor: "#DDD",
    opacity: 0.4,
  },
  lower: {
    flex: 1,
    backgroundColor: "#DDD",
    backgroundColor: "white",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 10,
  },
  choose: {
    flex: 1,
    backgroundColor: "#283663",
    marginHorizontal: 30,
    flexDirection: "row",
    borderRadius: 20,
    alignItems: "center",
    marginTop: 20,
    paddingLeft: 30,
  },
  text: {
    fontWeight: "bold",
    color: "white",
    marginLeft: "30%",
  },
});
