import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  Pressable,
  ScrollView,
  TouchableWithoutFeedback,
  SafeAreaView,
  Keyboard,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
import * as ImagePicker from "expo-image-picker";
import placeholder from "../../../assets/peopleIcon.jpg";
import ChooseImageModal from "./Popup/ChooseImageModal";
import ModalSuccess from "./Popup/ModalSuccess";
import ModalFail from "./Popup/ModalFail";
import { createStaff, createStaffWithImage } from "../../util/staffService";
import i18next from "../../Services/i18next";
import { useTranslation } from "react-i18next";

DropDownPicker.setListMode("SCROLLVIEW");

export default function AddStaff({ navigation }) {
  const { t } = useTranslation();

  const [visible, setVisible] = useState(false);
  const show = () => {
    setVisible(true);
  };
  const hide = () => {
    setVisible(false);
  };

  const [visibleSuccess, setVisibleSuccess] = useState(false);
  const showSuccess = () => {
    setVisibleSuccess(true);
  };
  const hideSuccess = () => {
    setVisibleSuccess(false);
  };

  const [visibleFail, setVisibleFail] = useState(false);
  const showFail = () => {
    setVisibleFail(true);
  };
  const hideFail = () => {
    setVisibleFail(false);
  };

  const contentS = t("add-staff-success");
  const [contentF, setContentF] = useState(t("add-staff-fail"));

  const [image, setImage] = useState();
  const uploadImage = async (mode) => {
    try {
      let result = {};
      if (mode === "gallery") {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      } else {
        await ImagePicker.requestCameraPermissionsAsync();
        result = await ImagePicker.launchCameraAsync({
          cameraType: ImagePicker.CameraType.front,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      }

      if (!result.canceled) {
        await saveImage(result.assets[0].uri);
      }
    } catch (error) {
      alert("Error uploading image: " + error);
      setVisible(false);
    }
  };

  const saveImage = async (image) => {
    try {
      setImage(image);
      setVisible(false);
    } catch (error) {
      throw error;
    }
  };
  const pressHandler = () => {
    navigation.goBack();
  };
  const [isOpen, setIsOpen] = useState(false);
  const [currentValue, setCurrentValue] = useState("");
  const items = [
    { label: t("driver"), value: "2" },
    { label: t("coach-assistant"), value: "3" },
    { label: t("manager"), value: "4" },
  ];

  const [isOpenGender, setIsOpenGender] = useState(false);
  const [currentValueGender, setCurrentValueGender] = useState("");
  const itemsGender = [
    { label: t("male"), value: "male" },
    { label: t("female"), value: "female" },
  ];

  const [validatePosition, setValidatePostion] = useState(true);
  const [validateGender, setValidateGender] = useState(true);

  const [validateFullName, setValidateFullName] = useState(true);
  const [fullName, setFullName] = useState("");
  const fullNameHandler = (val) => {
    setFullName(val);
    setValidateFullName(true);
  };
  const [validateEmail, setValidateEmail] = useState(true);
  const [email, setEmail] = useState("");
  const emailHandler = (val) => {
    setEmail(val);
    setValidateEmail(true);
  };
  const [validatePhone, setValidatePhone] = useState(true);
  const [phone, setPhone] = useState("");
  const phoneHandler = (val) => {
    setPhone(val);
    setValidatePhone(true);
  };
  const [validateUsername, setValidateUsername] = useState(true);
  const [username, setUsername] = useState("");
  const usernameHandler = (val) => {
    setUsername(val);
    setValidateUsername(true);
  };
  const [validatePassword, setValidatePassword] = useState(true);
  const [password, setPassword] = useState("");
  const passwordHandler = (val) => {
    setPassword(val);
    setValidatePassword(true);
  };
  const [validateRePassword, setValidateRePassword] = useState(true);
  const [repassword, setRePassword] = useState("");
  const repasswordHandler = (val) => {
    setRePassword(val);
    setValidateRePassword(true);
  };

  const saveHadler = async () => {
    if (fullName == "") {
      setValidateFullName(false);
    } else {
      setValidateFullName(true);
    }

    if (email == "") {
      setValidateEmail(false);
    } else {
      setValidateEmail(true);
    }

    if (phone == "") {
      setValidatePhone(false);
    } else {
      setValidatePhone(true);
    }
    if (username == "") {
      setValidateUsername(false);
    } else {
      setValidateUsername(true);
    }
    if (password == "") {
      setValidatePassword(false);
    } else {
      setValidatePassword(true);
    }
    if (repassword == "") {
      setValidateRePassword(false);
    } else {
      setValidateRePassword(true);
    }
    if (currentValue == "") {
      setValidatePostion(false);
    } else {
      setValidatePostion(true);
    }
    if (currentValueGender == "") {
      setValidateGender(false);
    } else {
      setValidateGender(true);
    }
    if (
      fullName != "" &&
      email != "" &&
      phone != "" &&
      username != "" &&
      password != "" &&
      repassword != "" &&
      currentValue != "" &&
      currentValueGender != ""
    ) {
      if (repassword != password) {
        setContentF(t("password-validation"));
        showFail();
      } else {
        try {
          const data = {
            fullName: fullName,
            email: email,
            phone: phone,
            currentValue: parseInt(currentValue),
            currentValueGender: currentValueGender,
            username: username,
            password: password,
            image: image,
          };
          const createdStaff = await createStaffWithImage(data);
          console.log(createdStaff);
          showSuccess();
        } catch (error) {
          console.log("Error create staff:" + error);
          showFail();
        }
      }
    }
  };
  const reloadHandler = () => {
    setFullName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setRePassword("");
    setUsername("");
  };
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <ModalSuccess
          visible={visibleSuccess}
          hide={hideSuccess}
          content={contentS}
        />
        <ModalFail visible={visibleFail} hide={hideFail} content={contentF} />
        <View style={styles.header}>
          <Pressable
            style={({ pressed }) => [
              styles.backIcon,
              pressed && { opacity: 0.85 },
            ]}
            onPress={pressHandler}
          >
            <Ionicons
              name="ios-arrow-back-circle-sharp"
              size={38}
              color="#283663"
            />
          </Pressable>
          <Text style={styles.headerText}>{t("new-staff")}</Text>
          <Pressable
            style={({ pressed }) => [
              pressed && { opacity: 0.85 },
              styles.resetIconStyle,
            ]}
            onPress={reloadHandler}
          >
            <Ionicons name="reload-circle" size={38} color="#EB3223" />
          </Pressable>
        </View>
        <ScrollView
          style={styles.body}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          decelerationRate={"fast"}
        >
          <View style={styles.imageContainer}>
            <Image
              style={styles.staffImage}
              source={image ? { uri: image } : placeholder}
            />
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.editIcon,
              pressed && { opacity: 0.85 },
            ]}
            onPress={show}
          >
            <MaterialIcons name="edit" size={30} color="#72C6A1" />
          </Pressable>
          <ChooseImageModal
            visible={visible}
            hide={hide}
            uploadImage={uploadImage}
          />
          <Text style={styles.titleText}>{t("staff-information")}</Text>
          <View>
            <Text style={styles.textLabel}>{t("full-name")}</Text>
            <TextInput
              style={
                validateFullName == true
                  ? styles.textInput
                  : styles.textInputWrong
              }
              placeholder={t("enter-full-name")}
              value={fullName}
              onChangeText={fullNameHandler}
            ></TextInput>
            {!validateFullName && (
              <Text style={styles.validateText}>{t("non-empty-field")}</Text>
            )}
            <Text style={styles.textLabel}>{t("email")}</Text>
            <TextInput
              style={
                validateEmail == true ? styles.textInput : styles.textInputWrong
              }
              placeholder={t("enter-email")}
              value={email}
              onChangeText={emailHandler}
            ></TextInput>
            {!validateEmail && (
              <Text style={styles.validateText}>{t("non-empty-field")}</Text>
            )}
            <Text style={styles.textLabel}>{t("phone-number")}</Text>
            <TextInput
              style={
                validatePhone == true ? styles.textInput : styles.textInputWrong
              }
              placeholder={t("enter-phone-number")}
              keyboardType="numeric"
              value={phone}
              onChangeText={phoneHandler}
            ></TextInput>
            {!validatePhone && (
              <Text style={styles.validateText}>{t("non-empty-field")}</Text>
            )}
            <Text style={styles.textLabel}>{t("position")}</Text>
            <View style={[styles.dropDownStyle, { zIndex: 10000 }]}>
              <DropDownPicker
                items={items}
                open={isOpen}
                setOpen={() => setIsOpen(!isOpen)}
                value={currentValue}
                setValue={(val) => setCurrentValue(val)}
                maxHeight={150}
                autoScroll
                placeholder={t("select-position")}
                showTickIcon={true}
                style={styles.startDropDown}
                nestedScrollEnabled={true}
              />
            </View>
            {!validatePosition && (
              <Text style={styles.validateText}>{t("please-choose-position")}</Text>
            )}
            <Text style={styles.textLabel}>{t("gender")}</Text>
            <View style={[styles.dropDownStyle, { zIndex: 100 }]}>
              <DropDownPicker
                items={itemsGender}
                open={isOpenGender}
                setOpen={() => setIsOpenGender(!isOpenGender)}
                value={currentValueGender}
                setValue={(val) => setCurrentValueGender(val)}
                maxHeight={150}
                autoScroll
                placeholder={t("select-gender")}
                showTickIcon={true}
                style={styles.startDropDown}
                nestedScrollEnabled={true}
              />
            </View>
            {!validateGender && (
              <Text style={styles.validateText}>{t("please-choose-gender")}</Text>
            )}
          </View>
          <Text style={[styles.titleText, { zIndex: -1 }]}>
            Account Information
          </Text>
          <View style={{ zIndex: -1 }}>
            <Text style={styles.textLabel}>{t("username")}</Text>
            <TextInput
              style={
                validateUsername == true
                  ? styles.textInput
                  : styles.textInputWrong
              }
              placeholder={t("enter-username")}
              value={username}
              onChangeText={usernameHandler}
            ></TextInput>
            {!validateUsername && (
              <Text style={styles.validateText}>{t("non-empty-field")}</Text>
            )}
            <Text style={styles.textLabel}>{t("password")}</Text>
            <TextInput
              style={
                validatePassword == true
                  ? styles.textInput
                  : styles.textInputWrong
              }
              placeholder={t("enter-password")}
              secureTextEntry={true}
              value={password}
              onChangeText={passwordHandler}
            ></TextInput>
            {!validatePassword && (
              <Text style={styles.validateText}>{t("non-empty-field")}</Text>
            )}
            <Text style={styles.textLabel}>{t("re-password")}</Text>
            <TextInput
              style={
                validateRePassword == true
                  ? styles.textInput
                  : styles.textInputWrong
              }
              placeholder={t("re-enter-password")}
              secureTextEntry={true}
              value={repassword}
              onChangeText={repasswordHandler}
            ></TextInput>
            {!validateRePassword && (
              <Text style={styles.validateText}>{t("non-empty-field")}</Text>
            )}
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.saveButton,
              pressed && { opacity: 0.85 },
            ]}
            onPress={saveHadler}
          >
            <Text style={styles.saveText}>{t("save-button")}</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 55,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    position: "absolute",
    left: 16,
  },
  headerText: {
    fontSize: 23,
    color: "#283663",
  },
  resetIconStyle: {
    position: "absolute",
    right: 16,
  },
  body: {
    flex: 1,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 80,
    marginHorizontal: "30%",
    marginTop: 10,
    overflow: "hidden",
  },
  staffImage: {
    width: 120,
    height: 120,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: "#283663",
    zIndex: 100,
  },
  editIcon: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  titleText: {
    color: "#283663",
    fontSize: 20,
    marginLeft: 10,
    marginBottom: 5,
    marginTop: 10,
  },
  textInput: {
    backgroundColor: "white",
    fontSize: 16,
    marginEnd: 20,
    marginStart: 20,
    height: 50,
    paddingLeft: 20,
    paddingRight: 40,
    borderRadius: 10,
    borderColor: "#283663",
    borderWidth: 1,
    color: "#283663",
  },
  textInputWrong: {
    backgroundColor: "white",
    fontSize: 16,
    marginEnd: 20,
    marginStart: 20,
    height: 50,
    paddingLeft: 20,
    paddingRight: 40,
    borderRadius: 10,
    borderColor: "#EB3223",
    borderWidth: 1,
    color: "#283663",
  },
  textLabel: {
    color: "#283663",
    marginLeft: 34,
    marginBottom: 5,
    marginTop: 10,
  },
  startDropDown: {
    zIndex: 100,
    borderColor: "#283663",
    color: "#283663",
    paddingLeft: 20,
  },
  dropDownStyle: {
    paddingRight: 20,
    paddingLeft: 20,
  },
  saveButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#283663",
    marginHorizontal: "10%",
    height: 50,
    marginBottom: 10,
    borderRadius: 20,
    marginTop: 30,
  },
  saveText: {
    fontSize: 16,
    color: "white",
  },
  validateText: {
    color: "#EB3223",
    marginLeft: 40,
  },
});
