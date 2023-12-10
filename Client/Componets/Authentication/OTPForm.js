import { useContext, useEffect, useRef, useState } from "react";
import firebase from "firebase/compat/app";
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
import {
  FirebaseRecaptcha,
  FirebaseRecaptchaVerifierModal,
} from "expo-firebase-recaptcha";
import { firebaseConfig } from "../../../config";
import FlatButton from "../UI/FlatButton";
import CustomButton from "../UI/CustomButton";
import GlobalColors from "../../Color/colors";
import OtpInput from "./OTPInput";
import { AuthContext } from "../../Store/authContex";
import qs from "qs";
import { addUserToDatabase, sendEmail } from "../../util/apiServices";
import { Register } from "../../util/databaseAPI";
function OTP({ navigation, route, onCreateAccount }) {
  LogBox.ignoreLogs([
    "No native ExpoFirebaseCore module found, are you sure the expo-firebase-core module is linked properly?",
  ]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emails, setEmail] = useState("");

  const isForgotPassword = route?.params?.isForgotPassword;

  // const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [verificationId, setVerificationId] = useState(null);
  const recapCharVerifier = useRef(null);
  const auhCtx = useContext(AuthContext);
  async function sendVerification({ phoneNumberFirst, email }) {
    console.log(phoneNumberFirst);
    console.log(phoneNumber);
    const settings = firebase.auth().settings;
    settings.appVerificationDisabledForTesting = true;
    if (!!phoneNumberFirst || !!phoneNumber) {
      const phoneProvider = new firebase.auth.PhoneAuthProvider();
      phoneProvider
        .verifyPhoneNumber(
          !!phoneNumberFirst ? phoneNumberFirst : phoneNumber,
          recapCharVerifier.current
        )
        .then(setVerificationId)
        .catch((error) => {
          console.log(error);
        });
    } else {
      const otpCode = generateOtpCode();
      await sendEmail(emails, otpCode);
      setOtpCode(otpCode);
    }
  }

  function generateOtpCode() {
    const length = 6; // Change the length of the OTP as needed
    let otp = "";
    const characters = "0123456789";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      otp += characters[randomIndex];
    }
    console.log(otp);

    return otp;
  }

  useEffect(() => {
    if (route?.params?.phoneNumber) {
      const phoneNumber = route?.params?.phoneNumber.slice(
        1,
        route?.params?.phoneNumber.length
      );
      setPhoneNumber((curr) => curr + "+84" + phoneNumber);
      sendVerification({
        phoneNumberFirst:
          "+84" +
          route?.params?.phoneNumber.slice(
            1,
            route?.params?.phoneNumber.length
          ),
        email: route?.params?.email,
      });
    } else {
      async function sendMail(email, code) {
        await sendEmail(email, code);
      }
      setEmail(route?.params?.email);
      const otpCode = generateOtpCode();
      sendMail(route?.params?.email, otpCode);
      setOtpCode(otpCode);
    }

    console.log("run");
  }, []);
  function confirmCode() {
    if (!!phoneNumber) {
      const credential = firebase.auth.PhoneAuthProvider.credential(
        verificationId,
        code
      );
      firebase
        .auth()
        .signInWithCredential(credential)
        .then(async (response) => {
          setCode("");
          if (isForgotPassword) {
            //get id Account match with phone number
            //them sau
            navigation.replace("ResetPassword", {
              email: route?.params?.email,
              phoneNumber: route?.params?.phoneNumber,
            });
          } else {
            //Register
            // Alert.alert("Sign successful");
            //add account to database

            const data = {
              phoneNumber: route?.params?.phoneNumber,
              password: route?.params?.password,
              fullName: route?.params?.fullName,
            };
            addUserToDatabase(data);
            await Register(route?.params?.user);
            // auhCtx.authenticate(response.user.uid);
            navigation.reset({
              index: 0,
              routes: [{ name: "Login", params: { isRegister: true } }],
            });
          }
        })
        .catch((error) => {
          Alert.alert("Error", "OTP code is invalid");
          console.log(error);
          return;
        });
    } else {
      if (otpCode === code) {
        //get id Account match with phone number
        //them sau
        navigation.replace("ResetPassword", {
          email: route?.params?.email,
          phoneNumber: route?.params?.phoneNumber,
        });
      } else {
        Alert.alert("Error", "OTP code is invalid");
        return;
      }
    }
  }

  // async function sendVerification() {
  //   const confirmation = await firebase
  //     .auth()
  //     .signInWithPhoneNumber(phoneNumber, recapCharVerifier.current)
  //     .catch((error) => {
  //       console.log(error);
  //     });
  //   setConfirm(confirmation);
  // }

  // async function confirmCode() {
  //   try {
  //     await confirm.confirm(code);
  //     console.log("Login successful");
  //   } catch (error) {
  //     console.log("Invalid code.");
  //   }
  // }

  function OTPCodeHandler(otpCode) {
    const convertString = otpCode.reduce((otp, item) => {
      return (otp += item);
    }, "");

    setCode(convertString);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.root}
    >
      <TouchableWithoutFeedback
        style={styles.root}
        onPress={() => Keyboard.dismiss()}
      >
        <View style={styles.root}>
          <FirebaseRecaptchaVerifierModal
            ref={recapCharVerifier}
            firebaseConfig={firebaseConfig}
            // attemptInvisibleVerification={true}
          ></FirebaseRecaptchaVerifierModal>

          <View
            style={{
              alignItems: "center",
              gap: 40,
            }}
          >
            <Text style={styles.title}>
              Code has been send to{" "}
              {phoneNumber
                ? "+84 ************" +
                  phoneNumber.slice(phoneNumber.length - 2, phoneNumber.length)
                : phoneNumber.charAt(0) + "**@gmail.com"}
              {/* Code has been send to +91 ********98 */}
            </Text>

            <OtpInput otpCodeChanged={OTPCodeHandler} />
          </View>
          <FlatButton
            title="Resend OTP"
            color={GlobalColors.button}
            onPress={sendVerification}
          >
            Resend OTP
          </FlatButton>
          <View style={{ width: 300 }}>
            <CustomButton
              title="Confirm"
              color={GlobalColors.validate}
              onPress={confirmCode}
            >
              Confirm
            </CustomButton>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
export default OTP;
const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
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
    width: 220,
    textAlign: "center",
  },
});
