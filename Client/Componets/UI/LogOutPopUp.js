import { useEffect } from "react";
import { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import Modal from "react-native-modal";
import { TouchableWithoutFeedback } from "react-native";
import GlobalColors from "../../Color/colors";
import { useTranslation } from "react-i18next";
function LogOutPopUp({ isVisible, onCancel, onLogout }) {
  const { t } = useTranslation();
  return (
    <Modal isVisible={isVisible} backdropOpacity={0.7}>
      <TouchableWithoutFeedback
        style={styles.root}
        onPress={() => Keyboard.dismiss()}
      >
        <View style={styles.subRoot}>
          <Text
            style={{
              alignSelf: "flex-start",
              fontSize: 20,
              fontWeight: "600",
            }}
          >
            {t("logging-out")} ...
          </Text>
          <Text
            style={{
              alignSelf: "flex-start",
              fontSize: 14.5,
            }}
          >
            {t("log-out-message")}
          </Text>
          <View style={{ width: "100%", gap: 10 }}>
            <TouchableOpacity
              style={[
                styles.closeButton,
                { backgroundColor: GlobalColors.lightBackground },
              ]}
              onPress={onLogout}
            >
              <Text style={styles.closeButtonText}>{t("yes")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                onCancel();
              }}
              style={[styles.closeButton, { backgroundColor: "#e6d7d675" }]}
            >
              <Text
                style={[styles.closeButtonText, { color: GlobalColors.price }]}
              >
                {t("no")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
export default LogOutPopUp;
const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  subRoot: {
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 30,
    width: 350,
    zIndex: 1,
    gap: 10,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "red",
    textAlign: "center",
  },
  message: {
    marginTop: 10,
    textAlign: "center",
  },
  closeButton: {
    alignSelf: "center",
    backgroundColor: "#96e047",
    width: "100%",
    padding: 10,
    borderRadius: 10,
  },
  closeButtonText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },

  image: {
    height: 100,
    width: 100,
    borderRadius: 100,
    borderColor: "gray",
    borderWidth: 2,
    marginTop: 10,
  },
  content: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    width: "100%",
    fontSize: 15,
    // height: 100,
    borderColor: "black",
    borderWidth: 1,
    textAlignVertical: "top",

    minHeight: 150,
  },
  selectList1: {
    borderWidth: 0.5,
    borderColor: GlobalColors.headerColor,
    zIndex: 999,
    marginTop: 10,
  },
});
