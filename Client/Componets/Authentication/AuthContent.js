import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import FlatButton from "../UI/FlatButton";
import { Alert, StyleSheet, Text, View } from "react-native";
import AuthForm from "./AuthForm";
import GlobalColors from "../../Color/colors";
import IconButton from "../UI/IconButton";
function AuthContent({ isLogin, isPhoneNumber, onAuthenticate }) {
  const navigation = useNavigation();
  const [credentialsInvalid, setCredentialsInvalid] = useState({
    email: false,
    password: false,
    fullName: false,
    confirmPassword: false,
    phoneNumber: false,
  });

  function switchAuthModeHandler() {
    if (isLogin) {
      navigation.replace("Signup");
    } else {
      navigation.replace("Login");
    }
  }
  function switchAuthMethodModeHandler() {
    if (isLogin) {
      navigation.replace("Login", {
        isPhoneNumber: !isPhoneNumber,
        isModal: true,
      });
    } else {
      navigation.replace("Signup", {
        isPhoneNumber: !isPhoneNumber,
        isModal: true,
      });
    }
  }
  function submitHandler(credentials) {
    let { fullName, email, password, confirmPassword, phoneNumber } =
      credentials;
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    let regPhoneNumber = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
    let regPassword =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    email = email.trim();
    password = password.trim();
    fullName = fullName.trim();
    phoneNumber = phoneNumber?.trim();
    const emailIsValid = reg.test(email);
    const passwordIsValid = isLogin
      ? password.length > 0
      : regPassword.test(password);

    var regexFullName = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/;
    const fullNameIsValid = regexFullName.test(fullName);
    const passwordsAreEqual = password === confirmPassword;
    const phoneNumberIsValid = regPhoneNumber.test(phoneNumber);

    if (isLogin) {
      if (isPhoneNumber) {
        if (!phoneNumberIsValid || !passwordIsValid) {
          setCredentialsInvalid({
            email: !emailIsValid,
            fullName: !fullNameIsValid,
            password: !passwordIsValid,
            phoneNumber: !phoneNumberIsValid,
            confirmPassword: !passwordIsValid || !passwordsAreEqual,
          });
          return;
        } else {
          //True
          //Check password in database
        }
      } else {
        const emailIsValid2 = email !== null && email.length > 0;
        if (!emailIsValid2 || !passwordIsValid) {
          setCredentialsInvalid({
            email: !emailIsValid2,
            fullName: !fullNameIsValid,
            password: !passwordIsValid,
            phoneNumber: !phoneNumberIsValid,
            confirmPassword: !passwordIsValid || !passwordsAreEqual,
          });
          return;
        } else {
          //True
          setCredentialsInvalid({
            email: !emailIsValid2,
            fullName: !fullNameIsValid,
            password: !passwordIsValid,
            phoneNumber: !phoneNumberIsValid,
            confirmPassword: !passwordIsValid || !passwordsAreEqual,
          });
        }
      }
    } else {
      if (isPhoneNumber) {
        if (
          !fullNameIsValid ||
          !phoneNumberIsValid ||
          !passwordIsValid ||
          !passwordsAreEqual
        ) {
          setCredentialsInvalid({
            email: !emailIsValid,
            fullName: !fullNameIsValid,
            password: !passwordIsValid,
            phoneNumber: !phoneNumberIsValid,
            confirmPassword: !passwordIsValid || !passwordsAreEqual,
          });
          return;
        } else {
          //true
        }
      } else {
        if (
          !fullNameIsValid ||
          !emailIsValid ||
          !passwordIsValid ||
          !passwordsAreEqual
        ) {
          setCredentialsInvalid({
            email: !emailIsValid,
            fullName: !fullNameIsValid,
            password: !passwordIsValid,
            phoneNumber: !phoneNumberIsValid,
            confirmPassword: !passwordIsValid || !passwordsAreEqual,
          });
          return;
        } else {
          //true
        }
      }
    }

    // if (
    //   !emailIsValid ||
    //   !passwordIsValid ||
    //   (isPhoneNumber && !phoneNumberIsValid) ||
    //   (!isLogin && (!passwordsAreEqual || !fullNameIsValid))
    // ) {
    //   Alert.alert("Invalid input", "Please check your entered credentials.");
    //   setCredentialsInvalid({
    //     email: !emailIsValid,
    //     fullName: !fullNameIsValid,
    //     password: !passwordIsValid,
    //     phoneNumber: !phoneNumberIsValid,
    //     confirmPassword: !passwordIsValid || !passwordsAreEqual,
    //   });
    //   return;
    // }
    onAuthenticate({ email, phoneNumber, password, fullName });
  }
  return (
    <View style={styles.authContent}>
      <AuthForm
        isLogin={isLogin}
        isPhoneNumber={isPhoneNumber}
        onSubmit={submitHandler}
        credentialsInvalid={credentialsInvalid}
      />
      <View style={styles.separator}>
        <View style={styles.line} />
        <Text style={styles.separatorText}>or continue with</Text>
        <View style={styles.line} />
      </View>
      {!isPhoneNumber && (
        <View style={styles.phoneNumber}>
          <IconButton
            icon={"phone-portrait-outline"}
            size={30}
            color={"white"}
            onPress={switchAuthMethodModeHandler}
          ></IconButton>
        </View>
      )}
      {isPhoneNumber && (
        <View style={styles.phoneNumber}>
          <IconButton
            icon={"mail-outline"}
            size={30}
            color={"white"}
            onPress={switchAuthMethodModeHandler}
          ></IconButton>
        </View>
      )}
      <Text style={styles.text}>
        {isLogin ? "Don’t have an account?" : "Already have an account?"}
      </Text>
      <View style={styles.buttons}>
        <FlatButton
          onPress={switchAuthModeHandler}
          color={GlobalColors.validate}
        >
          {isLogin ? "Create a new user" : "Log in instead"}
        </FlatButton>
      </View>
    </View>
  );
}
export default AuthContent;
const styles = StyleSheet.create({
  authContent: {
    marginHorizontal: 32,
    padding: 16,
    borderRadius: 15,
    elevation: 2,
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    marginTop: 20,
  },
  buttons: {
    marginTop: 10,
  },
  text: {
    marginTop: 20,
    alignSelf: "center",
  },
  separator: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    marginTop: 20,
    alignItems: "center",
  },
  line: {
    width: "20%",
    borderBottomWidth: 1,
    borderColor: GlobalColors.background,
  },
  separatorText: {
    color: "black",
    fontWeight: "700",
    marginHorizontal: 4,
  },
  phoneNumber: {
    marginTop: 10,
    alignSelf: "center",
    borderColor: GlobalColors.lightBackground,
    backgroundColor: GlobalColors.lightBackground,
    borderWidth: 1.5,
    borderRadius: 10,
  },
});
