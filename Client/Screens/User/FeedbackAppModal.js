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
} from "react-native";

import Modal from "react-native-modal";
import IconButton from "../../Componets/UI/IconButton";
import GlobalColors from "../../Color/colors";
import { TouchableWithoutFeedback } from "react-native";
import { EmailValidation } from "../../Helper/Validation";
import AuthInput from "../../Componets/Authentication/AuthInput";
function FeedbackAppModal({ isVisible, onSubmit, onCancel, defaultEmail }) {
  const [content, setContent] = useState("");
  const [enteredEmail, setEnteredEmail] = useState(defaultEmail);
  const [emailIsInvalid, setEmailIsInvalid] = useState(false);

  useEffect(() => {
    setEnteredEmail(defaultEmail);
  }, [isVisible]);
  function submitHandler() {
    const emailIsValid = EmailValidation(enteredEmail);
    setEmailIsInvalid(!emailIsValid);
    onSubmit(enteredEmail, content);
    if (
      enteredEmail !== null &&
      enteredEmail.trim() !== "" &&
      content !== null &&
      content.trim() !== ""
    ) {
      setContent("");
    }
    //code submit report with API
  }
  return (
    <Modal isVisible={isVisible} backdropOpacity={0.7}>
      <TouchableWithoutFeedback
        style={styles.root}
        onPress={() => Keyboard.dismiss()}
      >
        <View style={styles.subRoot}>
          {/* <View
            style={{ alignSelf: "flex-end", marginTop: -20, marginRight: -20 }}
          >
            <IconButton
              icon={"ios-close-circle-outline"}
              size={40}
              color={"red"}
            />
          </View> */}
          <View
            style={{
              marginTop: -10,
              borderBottomColor: "#c0c0c0ff",
              borderBottomWidth: 2,
              paddingBottom: 10,
              width: "100%",
            }}
          >
            <Text
              style={[
                styles.title,
                { color: GlobalColors.headerColor, fontSize: 25 },
              ]}
            >
              Report
            </Text>
          </View>
          <Image
            style={styles.image}
            source={require("../../../assets/logo.png")}
          />
          <View style={{ width: "100%" }}>
            <AuthInput
              label="Email"
              keyboardType="email-address"
              onUpdateValue={(value) => setEnteredEmail(value)}
              value={enteredEmail}
              isInvalid={emailIsInvalid}
              placeholder="a@gmail.com"
              message={"Email is invalided"}
            />
          </View>
          <View style={{ width: "100%", zIndex: -1 }}>
            <TextInput
              placeholder="Content"
              style={styles.content}
              value={content}
              multiline={true}
              onChangeText={(value) => setContent(value)}
            />
            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableOpacity
                onPress={() => {
                  setContent("");
                  onCancel();
                }}
                style={[
                  styles.closeButton,
                  { backgroundColor: "#f1aca9", flex: 1 },
                ]}
              >
                <Text style={styles.closeButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                // onPress={callback}
                style={[
                  styles.closeButton,
                  { backgroundColor: "#69d129", flex: 1 },
                ]}
                onPress={submitHandler}
              >
                <Text style={styles.closeButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
export default FeedbackAppModal;
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
    // height: 560,
    zIndex: 1,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
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
    padding: 10,
    borderRadius: 30,
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
    padding: 15,
    borderRadius: 10,
    width: "100%",
    fontSize: 15,
    // height: 100,
    borderColor: "black",
    borderWidth: 1,
    textAlignVertical: "top",
    paddingTop: 15,

    minHeight: 150,
  },
  selectList1: {
    borderWidth: 0.5,
    borderColor: GlobalColors.headerColor,
    zIndex: 999,
    marginTop: 10,
  },
});
