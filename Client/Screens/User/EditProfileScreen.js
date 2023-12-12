import {
  SafeAreaView,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  TextInput,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import CircleImage from "../../Componets/UI/CircleImage";
import AuthInput from "../../Componets/Authentication/AuthInput";
import { useContext, useEffect, useState } from "react";
import FlatButton from "../../Componets/UI/FlatButton";
import GlobalColors from "../../Color/colors";
import CustomButton from "../../Componets/UI/CustomButton";
import {
  EmailValidation,
  NameValidation,
  PhoneNumberValidation,
} from "../../Helper/Validation";
import PopUp from "../../Componets/UI/PopUp";
import ChangePasswordPopUp from "../../Componets/UI/ChangePasswordPopUp";
import * as ImagePicker from "expo-image-picker";
import { resetPassword, updateUserInformation } from "../../util/databaseAPI";
import { AuthContext } from "../../Store/authContex";
import { TouchableOpacity } from "react-native";
import Loading from "../../Componets/UI/Loading";
function EditProfileScreen({ navigation, route }) {
  const authCtx = useContext(AuthContext);

  const [enteredFullName, setEnteredFullName] = useState("");
  const [enteredAddress, setEnteredAddress] = useState("");
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredUserName, setEnteredUserName] = useState("");
  const [enteredPhoneNumber, setEnteredPhoneNumber] = useState("");

  const [fullNameIsInvalid, setFullNameIsInvalid] = useState(false);
  const [addressIsInvalid, setAddressIsInvalid] = useState(false);
  const [emailIsInvalid, setEmailIsInvalid] = useState(false);
  const [phoneNumberIsInvalid, setPhoneNumberIsInvalid] = useState(false);
  const [userNameIsInvalid, setUserNameIsInvalid] = useState(false);

  const [isEdit, setIsEdit] = useState(false);

  const [isPopUpVisible, setIsPopUpVisible] = useState(false);
  const [popUpType, setPopUpType] = useState("Success");
  const [isUpdatePassword, setIsUpdatePassword] = useState(false);

  const [isChangePasswordVisible, setIsChangePasswordVisible] = useState(false);
  //Avatar
  //   const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const [galleryPermissionInformation, requestPermission] =
    ImagePicker.useMediaLibraryPermissions();
  const [avatar, setAvatar] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  async function verifyGalleryPermission() {
    if (
      galleryPermissionInformation.status ===
      ImagePicker.PermissionStatus.UNDETERMINED
    ) {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    }
    if (
      galleryPermissionInformation.status ===
      ImagePicker.PermissionStatus.DENIED
    ) {
      Alert.alert(
        "Insuficient Permission!",
        "You need to grant gallery permissions to change avatar"
      );

      return false;
    }
    return true;
  }
  async function getImageHandler() {
    const hasPermission = await verifyGalleryPermission();
    if (!hasPermission) {
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);

      const file = {
        uri: result.assets[0].uri,
        type: "image/jpeg",
        name: "image.jpeg",
      };
      setImageFile(file);
    }
  }
  useEffect(() => {
    //get profile information from database by userId
    const profileInfo = route?.params?.currentUser;
    setAvatar(
      profileInfo.UserAccountData.avatar
        ? profileInfo.UserAccountData.avatar
        : null
    );
    setEnteredFullName(profileInfo.fullName ? profileInfo.fullName : "");
    setEnteredAddress(profileInfo.address ? profileInfo.address : "");
    setEnteredEmail(profileInfo.email ? profileInfo.email : "");
    setEnteredPhoneNumber(
      profileInfo.phoneNumber ? profileInfo.phoneNumber : ""
    );
    setEnteredUserName(
      profileInfo.UserAccountData.userName
        ? profileInfo.UserAccountData.userName
        : ""
    );
  }, []);
  function updateInputValueHandler(inputType, enteredValue) {
    switch (inputType) {
      case "email":
        setEnteredEmail(enteredValue);
        break;
      case "fullName":
        setEnteredFullName(enteredValue);
        break;
      case "userName":
        setEnteredUserName(enteredValue);
        break;

      case "phoneNumber":
        setEnteredPhoneNumber(enteredValue);
        break;
      case "address":
        setEnteredAddress(enteredValue);
        break;
    }
  }

  async function onChangeInfoHandler() {
    const emailIsValid = EmailValidation(enteredEmail);
    const useNameIsValid = NameValidation(enteredUserName);
    const fullNameIsValid = NameValidation(enteredFullName);
    const addressIsValid = NameValidation(enteredAddress);
    const phoneNumberIsValid = PhoneNumberValidation(enteredPhoneNumber);

    if (
      !emailIsValid | !fullNameIsValid ||
      !phoneNumberIsValid ||
      !useNameIsValid ||
      !addressIsValid
    ) {
      setEmailIsInvalid(!emailIsValid);
      setUserNameIsInvalid(!useNameIsValid);
      setFullNameIsInvalid(!fullNameIsValid);
      setPhoneNumberIsInvalid(!phoneNumberIsValid);
      setAddressIsInvalid(!addressIsInvalid);
      return;
    }
    ///Call APi to update
    try {
      //Success

      const profileInfo = route?.params?.currentUser;
      const res = await updateUserInformation({
        avatar: imageFile,
        accessToken: authCtx.token,
        userId: authCtx.idUser,
        email:
          !profileInfo.email || enteredEmail !== profileInfo.email
            ? enteredEmail
            : null,
        phoneNumber:
          !profileInfo.phoneNumber ||
          enteredPhoneNumber !== profileInfo.phoneNumber
            ? enteredPhoneNumber
            : null,
        fullName:
          !profileInfo.fullName || enteredFullName !== profileInfo.fullName
            ? enteredFullName
            : null,
        userName:
          !profileInfo.UserAccountData.userName ||
          enteredUserName !== profileInfo.UserAccountData.userName
            ? enteredUserName
            : null,
        address:
          !profileInfo.address || enteredAddress !== profileInfo.address
            ? enteredAddress
            : null,
      });
      if (res === null) {
        throw new Error("Something went wrong");
      }
      setPopUpType("Success");

      setIsPopUpVisible((curr) => !curr);
    } catch (error) {
      //Failure
      setIsPopUpVisible((curr) => !curr);
      setPopUpType("Error");
    }
  }

  async function onChangePasswordHandlers(newPassword) {
    try {
      console.log(enteredPhoneNumber, newPassword);
      const res = await resetPassword(null, enteredPhoneNumber, newPassword);

      if (res === null) {
        throw new Error("Something went wrong");
      } else {
        setIsChangePasswordVisible((curr) => !curr);
        setTimeout(() => {
          setPopUpType("Success");
          setIsUpdatePassword(true);
          setIsPopUpVisible((curr) => !curr);

          setTimeout(() => {
            setIsPopUpVisible((curr) => !curr);
            setTimeout(() => {
              authCtx.logout();
            }, 500);
          }, 2000);
        }, 500);
      }
    } catch (error) {
      Alert.alert("Error", error);
    }
  }
  return (
    <>
      <ChangePasswordPopUp
        isVisible={isChangePasswordVisible}
        onCancel={() => setIsChangePasswordVisible((curr) => !curr)}
        onChangePasswordHandler={onChangePasswordHandlers}
      />
      <PopUp
        isVisible={isPopUpVisible}
        isNotButton={isUpdatePassword && popUpType === "Success"}
        type={popUpType}
        title={popUpType == "Success" ? "Success" : "Failure"}
        textBody={
          isUpdatePassword
            ? "Password has been updated. Please sign in again!!"
            : popUpType == "Success"
            ? "Your information has updated"
            : "Connection Error!!"
        }
        callback={() => setIsPopUpVisible((curr) => !curr)}
      />
      <KeyboardAvoidingView
        enabled
        style={{ flex: 1, height: "100%", justifyContent: "center" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback
          style={styles.root}
          onPress={Keyboard.dismiss}
        >
          <View style={styles.subRoot}>
            <TouchableOpacity
              style={{
                alignSelf: "flex-end",
                position: "absolute",
                top: 10,
                right: 10,
              }}
              onPress={() => setIsEdit((curr) => !curr)}
            >
              <MaterialIcons name="edit" size={30} color="#72C6A1" />
            </TouchableOpacity>
            <CircleImage
              image={avatar}
              size={120}
              isEdit={isEdit}
              onPress={getImageHandler}
            />
            <View style={{ width: "100%" }}>
              <AuthInput
                label="Full Name"
                keyboardType="default"
                onUpdateValue={updateInputValueHandler.bind(this, "fullName")}
                value={enteredFullName}
                isInvalid={fullNameIsInvalid}
                placeholder="Nguyen Van A"
                message={"Full Name is required"}
                isDisabled={!isEdit}
              />
              <AuthInput
                label="Address"
                keyboardType="default"
                onUpdateValue={updateInputValueHandler.bind(this, "address")}
                value={enteredAddress}
                isInvalid={addressIsInvalid}
                placeholder="Street 2, A City "
                message={"Address is required"}
                isDisabled={!isEdit}
              />
              <AuthInput
                label="Email"
                keyboardType="email-address"
                onUpdateValue={updateInputValueHandler.bind(this, "email")}
                value={enteredEmail}
                isInvalid={emailIsInvalid}
                placeholder="a@gmail.com"
                message={"Email is invalided"}
                isDisabled={!isEdit}
              />
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
                isDisabled={!isEdit}
              />
              <AuthInput
                label="User Name (*)"
                keyboardType="default"
                onUpdateValue={updateInputValueHandler.bind(this, "userName")}
                value={enteredUserName}
                // isInvalid={userNameIsInvalid}
                // placeholder="Nguyen Van A"
                message={"User Name is required"}
                isDisabled
              />
              <AuthInput
                label="Password (*)"
                keyboardType="default"
                secure={true}
                // onUpdateValue={updateInputValueHandler.bind(this, "password")}
                value={"dasdasadasd"}
                isDisabled
              />
              <View style={{ width: "100%", alignItems: "flex-end" }}>
                <FlatButton
                  color={GlobalColors.validate}
                  onPress={() => setIsChangePasswordVisible((curr) => !curr)}
                >
                  <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                    Change Password ?
                  </Text>
                </FlatButton>
              </View>
            </View>
            {isEdit && (
              <View style={{ width: "100%" }}>
                <CustomButton
                  radius={10}
                  color={"#72C6A1"}
                  onPress={onChangeInfoHandler}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: "white",
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    Submit
                  </Text>
                </CustomButton>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
}
export default EditProfileScreen;
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: GlobalColors.contentBackground,
    gap: 20,
  },
  subRoot: {
    backgroundColor: "white",
    alignItems: "center",
    margin: 20,
    borderRadius: 20,
    padding: 20,
    gap: 10,
    paddingVertical: 20,
    marginBottom: 90,
  },
});
