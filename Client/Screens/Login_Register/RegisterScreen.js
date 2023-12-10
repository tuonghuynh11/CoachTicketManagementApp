import { View, StyleSheet, Text, Alert, Keyboard } from "react-native";
import AuthContent from "../../Componets/Authentication/AuthContent";
import { useContext, useEffect, useState } from "react";
import Loading from "../../Componets/UI/Loading";
import { AuthContext } from "../../Store/authContex";
import { createUser } from "../../util/firebaseAuthen";
import { addUserToDatabase } from "../../util/apiServices";
import { Register } from "../../util/databaseAPI";
import UserAccount from "../../Models/UserAccount";

function RegisterScreen({ navigation, route }) {
  const isPhoneNumber = route?.params?.isPhoneNumber;
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const authCtx = useContext(AuthContext);
  useEffect(() => {
    if (route?.params?.isModal || isPhoneNumber) {
      navigation.setOptions({
        presentation: "modal",
      });
    }
  }, []);
  async function signUpHandler({ email, phoneNumber, password, fullName }) {
    Keyboard.dismiss();
    setIsAuthenticating(true);

    try {
      var user = new UserAccount();
      user.email = email;
      user.password = password;
      user.phoneNumber = phoneNumber;
      user.userName = fullName;
      if (email.length > 0) {
        // const data = await createUser(email, password);

        //store account to database
        await Register(user);

        // addUserToDatabase({ email, phoneNumber, password, fullName });
        // authCtx.authenticate(data.idToken);
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: "Login", params: { isRegister: true } }],
          });
        }, 2000);
      } else {
        await Register(user, false);
        navigation.navigate("OTP", {
          phoneNumber: phoneNumber,
          isForgotPassword: false,
          password: password,
          fullName: fullName,
          user: user,
        });
        setIsAuthenticating(false);
      }
    } catch (err) {
      let errorMessage = err.response.data.errors;
      Alert.alert(
        "Authentication failed!",
        errorMessage
          ? errorMessage
          : "Could not create user. Please check your input and try again later!"
      );
      setIsAuthenticating(false);
    }
  }
  // if (isAuthenticating) {
  //   return <Loading message="Creating user..." />;
  // }

  return (
    <>
      {isAuthenticating && (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <Loading message="Creating user..." />
        </View>
      )}
      <View style={styles.root}>
        <Text style={styles.title}>Create Your Account</Text>
        <View style={styles.authContentContainer}>
          {isPhoneNumber && (
            <AuthContent isPhoneNumber onAuthenticate={signUpHandler} />
          )}
          {!isPhoneNumber && <AuthContent onAuthenticate={signUpHandler} />}
        </View>
      </View>
    </>
  );
}
export default RegisterScreen;
const styles = StyleSheet.create({
  root: {
    marginTop: 100,
    alignItems: "center",
  },
  authContentContainer: {
    width: "100%",
  },
  title: {
    color: "white",
    fontSize: 30,
    fontWeight: "600",
  },
});
