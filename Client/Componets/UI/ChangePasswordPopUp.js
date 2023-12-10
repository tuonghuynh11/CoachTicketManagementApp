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
import AuthInput from "../Authentication/AuthInput";
import { PasswordValidation } from "../../Helper/Validation";
function ChangePasswordPopUp({ isVisible, onCancel, onChangePasswordHandler }) {
  const [enteredOldPassword, setEnteredOldPassword] = useState("");
  const [enteredNewPassword, setEnteredNewPassword] = useState("");

  const [oldPasswordIsInvalid, setOldPasswordIsInvalid] = useState(false);
  const [isWrongOldPassword, setIsWrongOldPassword] = useState(false);
  const [newPasswordIsInvalid, setNewPasswordIsInvalid] = useState(false);

  function updateInputValueHandler(inputType, enteredValue) {
    switch (inputType) {
      case "oldPassword":
        setEnteredOldPassword(enteredValue);
        break;
      case "newPassword":
        setEnteredNewPassword(enteredValue);
        break;
    }
  }
  function changePasswordHandler() {
    //Get idUser from device
    console.log("old ", enteredOldPassword);
    console.log("new ", enteredNewPassword);
    // const oldPassword = getOldPassword()
    const oldPasswordValid = enteredOldPassword.trim().length > 0; //Mốt thêm dk so password từ database
    const newPasswordValid = PasswordValidation(enteredNewPassword);
    if (!oldPasswordValid || !newPasswordValid) {
      setNewPasswordIsInvalid(!newPasswordValid);
      setOldPasswordIsInvalid(!oldPasswordValid);
      return;
    }
    setNewPasswordIsInvalid(!newPasswordValid);
    setOldPasswordIsInvalid(!oldPasswordValid);

    onChangePasswordHandler(enteredNewPassword);
  }
  return (
    <Modal isVisible={isVisible} backdropOpacity={0.7}>
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback
          style={styles.root}
          onPress={() => Keyboard.dismiss()}
        >
          <View style={styles.subRoot}>
            <View
              style={{
                height: 60,
                width: 350,
                marginTop: -20,
                backgroundColor: GlobalColors.headerColor,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={styles.title}>Change Password</Text>
            </View>
            <View style={{ width: "100%", marginTop: 10 }}>
              <Text style={styles.subTitle}>
                Please enter your old password again, then enter your new
                password.
              </Text>
            </View>

            <View style={{ width: "100%" }}>
              <AuthInput
                label="Old Password"
                keyboardType="default"
                onUpdateValue={updateInputValueHandler.bind(
                  this,
                  "oldPassword"
                )}
                isInvalid={oldPasswordIsInvalid}
                placeholder="M12345@udghg"
                message={
                  enteredOldPassword === ""
                    ? "Field is required"
                    : "Old Password was wrong"
                }
                secure
              />
              <AuthInput
                label="New Password"
                keyboardType="default"
                secure
                onUpdateValue={updateInputValueHandler.bind(
                  this,
                  "newPassword"
                )}
                isInvalid={newPasswordIsInvalid}
                placeholder="M12345@udghg"
                message={
                  enteredNewPassword === ""
                    ? "Field is required"
                    : "Password must be at least 8 characters long, 1 upper case character,1 lower case character and 1 special character"
                }
              />
            </View>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableOpacity
                onPress={() => {
                  setNewPasswordIsInvalid(false);
                  setOldPasswordIsInvalid(false);
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
                onPress={changePasswordHandler}
              >
                <Text style={styles.closeButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}
export default ChangePasswordPopUp;
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
