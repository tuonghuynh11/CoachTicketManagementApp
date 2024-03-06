import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  SafeAreaView,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import i18next from "../../Services/i18next";
import { useTranslation } from "react-i18next";

export default function ModalConfirm({ visible, hide, content, confirm }) {
  const { t } = useTranslation();

  return (
    <Modal transparent visible={visible}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Pressable onPress={hide}>
              <AntDesign
                name="close"
                size={24}
                color="black"
                style={styles.close}
              />
            </Pressable>
          </View>
          <View style={{ alignItems: "center" }}>
            <Image
              source={require("../../../../assets/warningIcon.png")}
              style={styles.image}
            />
          </View>
          <Text style={styles.text}>{content}</Text>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <Pressable style={{...styles.button, backgroundColor: '#72C6A1'}} onPress={confirm}>
                <Text style={styles.buttonText}>{t("confirm")}</Text>
            </Pressable>
            <Pressable style={{...styles.button, backgroundColor: '#EB3223'}} onPress={hide}>
                <Text style={styles.buttonText}>{t("cancel")}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 20,
    elevation: 20,
  },
  header: {
    width: "100%",
    height: 20,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  image: {
    height: 150,
    width: 150,
    marginVertical: 10,
  },
  text: {
    marginVertical: 30,
    fontSize: 20,
    textAlign: "center",
    color: "#e5d200",
  },
  button:{
    width:100,
    height:50,
    backgroundColor: 'red',
    borderRadius:20,
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold'
  }
});
