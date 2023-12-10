import React, { useRef, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableNativeFeedback,
  Keyboard,
  Pressable,
} from "react-native";
import GlobalColors from "../../Color/colors";
function OtpInput({ otpCodeChanged }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const inputRefs = [
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
  ];

  const handleOtpChange = (value, index) => {
    console.log(value);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    // Move focus to the next box if the current one has a value
    if (value && index < newOtp.length - 1) {
      inputRefs[index + 1].focus();
    }
    const emptyNumberLength = newOtp.filter((num) => num.length === 0).length;
    if (emptyNumberLength === 0) {
      otpCodeChanged(newOtp);
    }
  };
  return (
    <View style={styles.container}>
      {otp.map((digit, index) => (
        <TextInput
          key={index}
          style={styles.box}
          maxLength={1}
          keyboardType="numeric"
          onChangeText={(value) => handleOtpChange(value, index)}
          value={digit}
          ref={(r) => (inputRefs[index] = r)}
        />
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    borderWidth: 1,
    borderColor: "#c77f13",
    borderRadius: 10,
    width: 43,
    height: 55,
    margin: 10,
    textAlign: "center",
    color: "white",
    fontSize: 25,
  },
});
export default OtpInput;
