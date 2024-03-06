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
import { deleteCoach } from "../../../util/coachService";
import { useTranslation } from "react-i18next";

  export default function FilterModal({ visible, hide, navigation, navigateScreen, item, deleteCoach}){
  const { t } = useTranslation();

    
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
            onPress={() => { hide(); navigation.navigate(navigateScreen, item); }}
          >
            <MaterialIcons name="edit" size={35} color="#72C6A1" />
            <Text style={styles.text}>{t("edit")}</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.choose, pressed && { opacity: 0.85 }]}
            onPress={deleteCoach}
          >
            <MaterialIcons name="delete" size={35} color="#EB3223" />
            <Text style={styles.text}>{t("delete")}</Text>
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
      height: "80%",
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
      flexDirection: 'row',
      borderRadius: 20,
      alignItems: "center",
      marginTop: 20,
      paddingLeft: 30
    },
    text: {
      fontWeight: "bold",
      color: "white",
      marginLeft: '30%'
    },
  });