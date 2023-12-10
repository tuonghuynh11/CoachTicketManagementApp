import { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import Modal from "react-native-modal";
function PopUp({
  title,
  type,
  textBody,
  isNotButton,
  buttonText,
  callback,
  background,
  timing,
  autoclose,
  icon,
  isVisible,
  textBtn,
}) {
  if (isNotButton) {
    return (
      <Modal isVisible={isVisible} backdropOpacity={0.7}>
        <View style={styles.root}>
          <View
            style={[
              styles.subRoot,
              {
                justifyContent: "center",
              },
            ]}
          >
            <Image
              style={{
                marginTop: -20,
              }}
              source={
                type === "Success"
                  ? require("../../../icon/Success.png")
                  : type === "Warning"
                  ? require("../../../icon/Warning.png")
                  : require("../../../icon/Error.png")
              }
            />
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{textBody}</Text>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal isVisible={isVisible} backdropOpacity={0.7}>
      <View style={styles.root}>
        <View style={styles.subRoot}>
          <Image
            source={
              type === "Success"
                ? require("../../../icon/Success.png")
                : type === "Warning"
                ? require("../../../icon/Warning.png")
                : require("../../../icon/Error.png")
            }
          />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{textBody}</Text>
          {type === "Success" ? (
            <TouchableOpacity onPress={callback} style={[styles.closeButton]}>
              <Text style={styles.closeButtonText}>
                {type === "Success"
                  ? "Ok"
                  : type === "Warning"
                  ? "Continue"
                  : "Try Again"}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={callback}
              style={[
                styles.closeButton,
                type === "Warning"
                  ? { backgroundColor: "#F2D76E" }
                  : { backgroundColor: "#E4A2A0" },
              ]}
            >
              <Text style={styles.closeButtonText}>
                {textBtn != null
                  ? textBtn
                  : type === "Success"
                  ? "Ok"
                  : type === "Warning"
                  ? "Continue"
                  : "Try Again"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}
export default PopUp;
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
    width: 270,
    height: 300,
    zIndex: 1,
  },

  title: {
    fontSize: 18,
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
    width: "100%",
    padding: 20,
    borderRadius: 30,
  },
  closeButtonText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
});
