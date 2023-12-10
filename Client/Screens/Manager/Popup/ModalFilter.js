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

export default function ModalFilter({ visible, hide, textHandler, handlerTextCapa }) {
  const [flag, setFlag] = useState(0);
  const [flagCapa, setFlagCapa] = useState(0);
  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={hide}
      transparent
    >
      <Pressable style={styles.upper} onPress={hide}></Pressable>
      <View style={styles.lower}>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.title}>Coach Type</Text>
        </View>
        <Pressable
          style={flag == 1 ? styles.pressedButton : styles.choose}
          onPress={() => {
            textHandler("vip"), setFlag(1);
          }}
        >
          {/* <MaterialIcons name="edit" size={35} color="#72C6A1" /> */}
          <Text style={styles.text}>VIP</Text>
        </Pressable>
        <Pressable
          style={flag == 2 ? styles.pressedButton : styles.choose}
          onPress={() => {
            textHandler("normal"), setFlag(2);
          }}
        >
          {/* <MaterialIcons name="delete" size={35} color="#EB3223" /> */}
          <Text style={styles.text}>Normal</Text>
        </Pressable>
        <Pressable
          style={flag == 0 ? styles.pressedButton : styles.choose}
          onPress={() => {
            textHandler(""), setFlag(0);
          }}
        >
          {/* <MaterialIcons name="delete" size={35} color="#EB3223" /> */}
          <Text style={styles.text}>All</Text>
        </Pressable>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.title}>Coach Capacity</Text>
        </View>
        <Pressable
          style={flagCapa == 1 ? styles.pressedButton : styles.choose}
          onPress={() => {
            handlerTextCapa("15"), setFlagCapa(1);
          }}
        >
          {/* <MaterialIcons name="edit" size={35} color="#72C6A1" /> */}
          <Text style={styles.text}>15</Text>
        </Pressable>
        <Pressable
          style={flagCapa == 2 ? styles.pressedButton : styles.choose}
          onPress={() => {
            handlerTextCapa("30"), setFlagCapa(2);
          }}
        >
          {/* <MaterialIcons name="delete" size={35} color="#EB3223" /> */}
          <Text style={styles.text}>30</Text>
        </Pressable>
        <Pressable
          style={flagCapa == 3 ? styles.pressedButton : styles.choose}
          onPress={() => {
            handlerTextCapa("55"), setFlagCapa(3);
          }}
        >
          {/* <MaterialIcons name="delete" size={35} color="#EB3223" /> */}
          <Text style={styles.text}>55</Text>
        </Pressable>
        <Pressable
          style={flagCapa == 0 ? styles.pressedButton : styles.choose}
          onPress={() => {
            handlerTextCapa(""), setFlagCapa(0);
          }}
        >
          {/* <MaterialIcons name="delete" size={35} color="#EB3223" /> */}
          <Text style={styles.text}>All</Text>
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
    height: "40%",
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
    justifyContent: "center",
  },
  text: {
    fontWeight: "bold",
    color: "white",
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 10,
  },
  pressedButton: {
    flex: 1,
    backgroundColor: "#72C6A1",
    marginHorizontal: 30,
    flexDirection: "row",
    borderRadius: 20,
    alignItems: "center",
    marginTop: 20,
    justifyContent: "center",
  },
});
