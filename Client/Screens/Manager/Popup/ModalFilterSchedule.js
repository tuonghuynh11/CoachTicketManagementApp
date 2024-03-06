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
import { useTranslation } from "react-i18next";
  
  export default function ModalFilterSchedule({
    visible,
    hide,
    handlerSort
  }) {
  const { t } = useTranslation();
    
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
          
          <Pressable
            style={flag == 1 ? styles.pressedButton : styles.choose}
            onPress={() => {
              handlerSort("1"), setFlag(1);
            }}
          >
            {/* <MaterialIcons name="edit" size={35} color="#72C6A1" /> */}
            <Text style={styles.text}>{t("price-low-high")}</Text>
          </Pressable>
          <Pressable
            style={flag == 2 ? styles.pressedButton : styles.choose}
            onPress={() => {
              handlerSort("2"), setFlag(2);
            }}
          >
            {/* <MaterialIcons name="delete" size={35} color="#EB3223" /> */}
            <Text style={styles.text}>{t("price-high-low")}</Text>
          </Pressable>
          
          <Pressable
            style={flag == 0 ? styles.pressedButton : styles.choose}
            onPress={() => {
              handlerSort(''), setFlag(0);
            }}
          >
            {/* <MaterialIcons name="delete" size={35} color="#EB3223" /> */}
            <Text style={styles.text}>{t("default")}</Text>
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
      height: "75%",
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
  