import {
  Image,
  Pressable,
  View,
  StyleSheet,
  Text,
  Alert,
  Linking,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FlatButton from "../UI/FlatButton";
import CustomButton from "../UI/CustomButton";
import GlobalColors from "../../Color/colors";
import AuthInput from "./AuthInput";
import { useState } from "react";
import qs from "qs";
import { checkEmailOrPhoneNumberExist } from "../../util/databaseAPI";
import PopUp from "../UI/PopUp";
function ForgotPassword({ navigation }) {
  const [isEmail, setIsEmail] = useState(true);
  const [enteredEmail, setEnteredEmail] = useState("");
  const [emailIsInvalid, setEmailIsInvalid] = useState(false);
  const [enteredPhoneNumber, setEnteredPhoneNumber] = useState("");
  const [phoneNumberIsInvalid, setPhoneNumberIsInvalid] = useState(false);

  const [isError, setIsError] = useState(false);
  const [textError, setTextError] = useState("Email is existed!!!");
  function updateInputValueHandler(inputType, enteredValue) {
    switch (inputType) {
      case "email":
        setEnteredEmail(enteredValue);
        break;
      case "phoneNumber":
        setEnteredPhoneNumber(enteredValue);
        break;
    }
  }
  async function nextStepHandler() {
    let regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    let regPhoneNumber = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
    if (isEmail) {
      if (!regEmail.test(enteredEmail.trim())) {
        setEmailIsInvalid(true);
      } else {
        // Alert.alert("Successfully entered");
        //true
        setEmailIsInvalid(false);
        try {
          const res = await checkEmailOrPhoneNumberExist({
            email: enteredEmail,
            phoneNumber: null,
          });
          if (res === null) {
            setIsError((curr) => !curr);
            setTextError("Email is not existed!!!");
          } else {
            navigation.navigate("OTP", {
              isForgotPassword: true,
              email: enteredEmail,
            });
          }
        } catch (error) {
          Alert.alert(error);
        }
      }
    } else {
      if (!regPhoneNumber.test(enteredPhoneNumber.trim())) {
        setPhoneNumberIsInvalid(true);
      } else {
        //true
        setPhoneNumberIsInvalid(false);

        try {
          const res = await checkEmailOrPhoneNumberExist({
            email: null,
            phoneNumber: enteredPhoneNumber,
          });
          if (res === null) {
            setIsError((curr) => !curr);
            setTextError("Phone number is not existed!!!");
          } else {
            navigation.navigate("OTP", {
              isForgotPassword: true,
              phoneNumber: enteredPhoneNumber,
            });
          }
        } catch (error) {
          Alert.alert(error);
        }
      }
    }
  }

  return (
    <>
      <PopUp
        type={"Error"}
        isVisible={isError}
        title={"Error"}
        textBody={textError}
        callback={() => {
          setIsError((curr) => !curr);
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.root}
        keyboardVerticalOffset={300}
      >
        <TouchableWithoutFeedback
          style={styles.root}
          onPress={() => Keyboard.dismiss()}
        >
          <View style={styles.root}>
            <Image
              style={styles.image}
              source={require("../../../assets/forgotbg.png")}
            />
            <View>
              <Text style={styles.title}>
                Select which contact details should we use to reset your
                password
              </Text>
            </View>

            <Pressable
              onPress={() => setIsEmail(true)}
              style={({ pressed }) => [
                styles.button,
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="mail" size={28} color="white" />
              </View>
              <Text
                style={{
                  color: "white",
                  fontSize: 15,
                  alignSelf: "center",
                }}
              >
                via Email
              </Text>
            </Pressable>
            {isEmail && (
              <View style={styles.inputContainer}>
                <AuthInput
                  label="Email"
                  keyboardType="email-address"
                  onUpdateValue={updateInputValueHandler.bind(this, "email")}
                  value={enteredEmail}
                  isInvalid={emailIsInvalid}
                  placeholder="a@gmail.com"
                  message={"Email is invalided"}
                />
              </View>
            )}

            <Pressable
              onPress={() => setIsEmail(false)}
              style={({ pressed }) => [
                styles.button,
                pressed && styles.pressed,
              ]}
            >
              <View>
                <Ionicons
                  name="ios-chatbubble-ellipses-outline"
                  size={28}
                  color="white"
                />
              </View>
              <Text style={styles.text}>via SMS</Text>
            </Pressable>
            {!isEmail && (
              <View style={styles.inputContainer}>
                <AuthInput
                  label="Phone Number"
                  keyboardType="number-pad"
                  onUpdateValue={updateInputValueHandler.bind(
                    this,
                    "phoneNumber"
                  )}
                  value={enteredPhoneNumber}
                  isInvalid={phoneNumberIsInvalid}
                  placeholder="0xxxxxxx"
                  message={"Phone Number is invalided"}
                />
              </View>
            )}
            <View style={{ width: "90%" }}>
              <CustomButton
                onPress={nextStepHandler}
                color={GlobalColors.button}
              >
                Continue
              </CustomButton>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
}

export default ForgotPassword;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    width: "100%",
  },
  image: {
    width: "70%",
    height: 200,
  },
  title: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
  },
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 30,
  },
  button: {
    flexDirection: "row",
    width: "100%",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 12,
    elevation: 2,
    shadowColor: "black",
    borderWidth: 1,
    borderColor: GlobalColors.button,
    backgroundColor: GlobalColors.lightBackground,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  pressed: {
    opacity: 0.7,
  },
  text: {
    color: "white",
    fontSize: 15,
    marginTop: 5,
    marginStart: 5,
  },
  inputContainer: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
  },
});
