import {
  Alert,
  Text,
  TextInput,
  View,
  StyleSheet,
  Button,
  LogBox,
  Pressable,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Linking,
} from "react-native";
import CustomButton from "../UI/CustomButton";
import AuthInput from "./AuthInput";
import GlobalColors from "../../Color/colors";
import { useState } from "react";
import { updateUserPassword } from "../../util/apiServices";
import { resetPassword } from "../../util/databaseAPI";
import PopUp from "../UI/PopUp";
function ResetPassword({ navigation, route }) {
  const [enteredPassword, setEnteredPassword] = useState("");
  const [enteredConfirmPassword, setEnteredConfirmPassword] = useState("");
  const [passwordIsInvalid, setPasswordIsInvalid] = useState(false);
  const [passwordsDontMatch, setPasswordsDontMatch] = useState(false);

  const [isPopUpAppear, setIsPopUpAppear] = useState(false);
  const [popupText, setPopupText] = useState("Reset password successfully");
  const [popUpType, setPopUpType] = useState("Success");
  function updateInputValueHandler(inputType, enteredValue) {
    switch (inputType) {
      case "password":
        setEnteredPassword(enteredValue);
        break;
      case "confirmPassword":
        setEnteredConfirmPassword(enteredValue);
        break;
    }
  }
  async function ResetPasswordHandler() {
    let regPassword =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    const passwordIsValid = regPassword.test(enteredPassword);
    const passwordsAreEqual = enteredPassword === enteredConfirmPassword;
    if (!passwordIsValid) {
      setPasswordIsInvalid(true);
      return;
    } else if (!passwordsAreEqual) {
      setPasswordsDontMatch(true);
      return;
    } else {
      const res = await resetPassword(
        route?.params?.email,
        route?.params?.phoneNumber,
        enteredPassword
      );
      if (res !== null) {
        setPopupText("Reset password successfully");
        setPopUpType("Success");
        setIsPopUpAppear((curr) => !curr);
        navigation.reset({
          index: 0,
          routes: [{ name: "Login", params: { isResetPassword: true } }],
        });
      } else {
        setPopupText("Please check your internet connection");
        setPopUpType("Error");
        setIsPopUpAppear((curr) => !curr);
      }
    }
  }
  function popUpHandler() {
    setIsPopUpAppear((curr) => !curr);
  }
  return (
    <>
      <PopUp
        type={popUpType}
        isVisible={isPopUpAppear}
        title={popUpType === "Success" ? "Successfully" : "Error"}
        textBody={popupText}
        callback={popUpHandler}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.root}
        keyboardVerticalOffset={100}
      >
        <TouchableWithoutFeedback
          style={styles.root}
          onPress={() => Keyboard.dismiss()}
        >
          <View style={styles.root}>
            <View style={{ alignItems: "center" }}>
              <Text style={styles.title}>Create Your New Password</Text>
              <Text style={styles.subTitle}>
                Choose a password that must have at least 8 characters with at
                least one Capital letter, lower letter and at least 1 digit.
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <AuthInput
                label="New Password"
                keyboardType="default"
                secure={true}
                onUpdateValue={updateInputValueHandler.bind(this, "password")}
                value={enteredPassword}
                isInvalid={passwordIsInvalid}
                placeholder="Password"
                message={
                  "Password must be at least 8 characters long, 1 upper case character,1 lower case character and 1 special character"
                }
              />
            </View>
            <View style={styles.inputContainer}>
              <AuthInput
                label="Re-enter new password"
                keyboardType="default"
                onUpdateValue={updateInputValueHandler.bind(
                  this,
                  "confirmPassword"
                )}
                secure
                placeholder="Confirm Password"
                value={enteredConfirmPassword}
                isInvalid={passwordsDontMatch}
                message={"Password does not match"}
              />
            </View>
            <View style={{ width: 300 }}>
              <CustomButton
                title="Submit"
                color={GlobalColors.validate}
                onPress={ResetPasswordHandler}
              >
                Confirm
              </CustomButton>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
}

export default ResetPassword;
const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    padding: 10,
  },
  textInput: {
    padding: 10,
    fontSize: 24,
    color: "black",
  },
  title: {
    fontSize: 20,
    fontWeight: "semibold",
    color: "white",
    width: 240,
    textAlign: "center",
  },
  subTitle: {
    marginTop: 20,
    fontSize: 15,
    fontWeight: "semibold",
    color: "white",
    opacity: 0.6,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
  },
});
