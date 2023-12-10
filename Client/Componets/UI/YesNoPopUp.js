import { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import Modal from "react-native-modal";
function YesNoPopUp({
  title,
  type,
  textBody,
  button,
  buttonText,
  callback,
  background,
  timing,
  autoclose,
  icon,
  isVisible,
  NoHandler,
  YesHandler,
}) {
  return (
    <Modal isVisible={isVisible} backdropOpacity={0.7}>
      <View style={styles.root}>
        <View style={styles.subRoot}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{textBody}</Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              onPress={NoHandler}
              style={[styles.closeButton, { backgroundColor: "#f0d8d8" }]}
            >
              <Text style={styles.closeButtonText}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={YesHandler} style={[styles.closeButton]}>
              <Text style={styles.closeButtonText}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
export default YesNoPopUp;
const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  subRoot: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 30,
    width: 270,
    height: 200,
    zIndex: 1,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  message: {
    marginTop: 10,
    textAlign: "center",
  },
  closeButton: {
    marginTop: 20,
    alignSelf: "center",
    backgroundColor: "#96e047",
    padding: 10,
    borderRadius: 30,
    flex: 1,
  },
  closeButtonText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
});
