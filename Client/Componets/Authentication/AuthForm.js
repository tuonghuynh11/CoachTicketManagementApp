import { View, StyleSheet, Text } from "react-native";
import AuthInput from "./AuthInput";
import { useState } from "react";
import CustomButton from "../UI/CustomButton";
import FlatButton from "../UI/FlatButton";
import GlobalColors from "../../Color/colors";
import IconButton from "../UI/IconButton";
import { useNavigation } from "@react-navigation/native";
function AuthForm({ isLogin, isPhoneNumber, onSubmit, credentialsInvalid }) {
  const [enteredFullName, setEnteredFullName] = useState("");
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [enteredConfirmPassword, setEnteredConfirmPassword] = useState("");
  const [enteredPhoneNumber, setEnteredPhoneNumber] = useState("");
  const navigation = useNavigation();
  const {
    fullName: fullNameIsInvalid,
    email: emailIsInvalid,
    password: passwordIsInvalid,
    confirmPassword: passwordsDontMatch,
    phoneNumber: phoneNumberIsInvalid,
  } = credentialsInvalid;

  function forgotPasswordHandler() {
    navigation.navigate("ForgotPassword");
  }
  function updateInputValueHandler(inputType, enteredValue) {
    switch (inputType) {
      case "email":
        setEnteredEmail(enteredValue);
        break;
      case "fullName":
        setEnteredFullName(enteredValue);
        break;
      case "password":
        setEnteredPassword(enteredValue);
        break;
      case "confirmPassword":
        setEnteredConfirmPassword(enteredValue);
        break;
      case "phoneNumber":
        setEnteredPhoneNumber(enteredValue);
        break;
    }
  }

  function submitHandler() {
    onSubmit({
      email: enteredEmail,
      fullName: enteredFullName,
      password: enteredPassword,
      confirmPassword: enteredConfirmPassword,
      phoneNumber: enteredPhoneNumber,
    });
  }
  return (
    <View style={styles.root}>
      <View style={styles.inputContainer}>
        {!isLogin && (
          <AuthInput
            label="User Name"
            keyboardType="default"
            onUpdateValue={updateInputValueHandler.bind(this, "fullName")}
            value={enteredFullName}
            isInvalid={fullNameIsInvalid}
            placeholder="user1"
            message={"User Name must contains normal letters with numbers"}
          />
        )}
        {!isPhoneNumber && (
          <AuthInput
            label={isLogin ? "User Name" : "Email"}
            keyboardType="email-address"
            onUpdateValue={updateInputValueHandler.bind(this, "email")}
            value={enteredEmail}
            isInvalid={emailIsInvalid}
            placeholder={isLogin ? "user1" : "a@gmail.com"}
            message={isLogin ? "User Name is required" : "Email is invalided"}
          />
        )}
        {isPhoneNumber && (
          <AuthInput
            label="Phone Number"
            keyboardType="number-pad"
            onUpdateValue={updateInputValueHandler.bind(this, "phoneNumber")}
            value={enteredPhoneNumber}
            isInvalid={phoneNumberIsInvalid}
            placeholder="0xxxxxxx"
            message={"Phone Number is invalided"}
          />
        )}

        <AuthInput
          label="Password"
          keyboardType="default"
          secure={true}
          onUpdateValue={updateInputValueHandler.bind(this, "password")}
          value={enteredPassword}
          isInvalid={passwordIsInvalid}
          placeholder="Password"
          message={
            isLogin
              ? "Password is required"
              : "Password must be at least 8 characters long, 1 upper case character,1 lower case character and 1 special character"
          }
        />
        {isLogin && (
          <View style={styles.forgotPasswordContainer}>
            <FlatButton
              onPress={forgotPasswordHandler}
              color={"#FE0000"}
              style={styles.forgotPassword}
            >
              {"Forgot password?"}
            </FlatButton>
          </View>
        )}
        {!isLogin && (
          <AuthInput
            label="Confirm Password"
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
        )}
      </View>

      <View style={styles.button}>
        <CustomButton onPress={submitHandler}>
          {isLogin ? "Sign in" : "Sign Up"}
        </CustomButton>
      </View>
    </View>
  );
}
export default AuthForm;
const styles = StyleSheet.create({
  root: {},
  inputContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  button: {
    marginTop: 10,
    width: "80%",
    alignSelf: "center",
  },
  forgotPasswordContainer: {
    width: "100%",
    alignItems: "flex-end",
    marginLeft: 10,
  },
});
