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
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import ModalSuccess from "./Popup/ModalSuccess";
import ModalFail from "./Popup/ModalFail";
import { updateStaffWithImage } from "../../util/staffService";
import ModalConfirm from "./Popup/ModalConfirm";
import { MaterialIcons } from "@expo/vector-icons";
import placeholder from "../../../assets/peopleIcon.jpg";
import ChooseImageModal from "./Popup/ChooseImageModal";
import * as ImagePicker from "expo-image-picker";
import i18next from "../../Services/i18next";
import { useTranslation } from "react-i18next";

DropDownPicker.setListMode("SCROLLVIEW");

export default function EditStaffInfo({ route }) {
  const { t } = useTranslation();

  //const {image} = route.params;
  const { fullName } = route.params;
  const { email } = route.params;
  const { phoneNumber } = route.params;
  const { gender } = route.params;
  const { positionId } = route.params;
  const { UserAccountData } = route.params;

  const [isOpen, setIsOpen] = useState(false);
  const [currentValue, setCurrentValue] = useState(positionId.toString());
  const [validatePosition, setValidatePostion] = useState(true);
  const items = [
    { label: t("driver"), value: "2" },
    { label: t("coach-assistant"), value: "3" },
    { label: t("manager"), value: "4" },
  ];

  const [isOpenGender, setIsOpenGender] = useState(false);
  const [currentValueGender, setCurrentValueGender] = useState(gender);
  const itemsGender = [
    { label: t("male"), value: "male" },
    { label: t("female"), value: "female" },
  ];
  const [validateGender, setValidateGender] = useState(true);

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

  const contentS = t("update-staff-success");
  const [contentF, setContentF] = useState(t("update-staff-fail"));
  const [validateFullName2, setValidateFullName2] = useState(true);
  const [fullName2, setFullName2] = useState(fullName);
  const fullNameHandler = (val) => {
    setFullName2(val);
    setValidateFullName2(true);
  };
  const [validateEmail, setValidateEmail] = useState(true);
  const [email2, setEmail] = useState(email);
  const emailHandler = (val) => {
    setEmail(val);
    setValidateEmail(true);
  };
  const [validatePhone, setValidatePhone] = useState(true);
  const [phone, setPhone] = useState(phoneNumber);
  const phoneHandler = (val) => {
    setPhone(val);
    setValidatePhone(true);
  };
  const saveHadler = async () => {
    if (fullName2 == "") {
      setValidateFullName2(false);
    } else {
      setValidateFullName2(true);
    }

    if (email2 == "") {
      setValidateEmail(false);
    } else {
      setValidateEmail(true);
    }

    if (phone == "") {
      setValidatePhone(false);
    } else {
      setValidatePhone(true);
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
      fullName2 != "" &&
      email2 != "" &&
      phone != "" &&
      currentValue != "" &&
      currentValueGender != ""
    ) {
      try {
        setIndicator(true);
        const data = {
          fullName: fullName,
          email: email2,
          phone: phone,
          currentValue: currentValue,
          currentValueGender: currentValueGender,
          image: image,
          id: UserAccountData.id,
        };
        // console.log(data);
        const updatedStaff = await updateStaffWithImage(data);
        console.log(updatedStaff);
        setIndicator(false);
        showSuccess();
      } catch (error) {
        console.log(error);
        showFail();
      }
    }
  };

  const [image, setImage] = useState(UserAccountData.avatar);
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

  const [visible, setVisible] = useState(false);
  const show = () => {
    setVisible(true);
  };
  const hide = () => {
    setVisible(false);
  };

  const [indicator, setIndicator] = useState(false);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <ModalSuccess
          visible={visibleSuccess}
          hide={hideSuccess}
          content={contentS}
        />
        <ModalFail visible={visibleFail} hide={hideFail} content={contentF} />
        <ActivityIndicator
          style={styles.indicator}
          size={"large"}
          animating={indicator}
        />
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
          <View>
            <Text style={styles.textLabel}>{t("full-name")}</Text>
            <TextInput
              style={
                validateFullName2 == true
                  ? styles.textInput
                  : styles.textInputWrong
              }
              placeholder={t("enter-full-name")}
              value={fullName2}
              onChangeText={fullNameHandler}
            ></TextInput>
            {!validateFullName2 && (
              <Text style={styles.validateText}>{t("non-empty-field")}</Text>
            )}
            <Text style={styles.textLabel}>{t("email")}</Text>
            <TextInput
              style={
                validateEmail == true ? styles.textInput : styles.textInputWrong
              }
              placeholder={t("enter-email")}
              value={email2}
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
            <View style={[styles.dropDownStyle, { zIndex: 1 }]}>
              <DropDownPicker
                items={items}
                open={isOpen}
                setOpen={() => setIsOpen(!isOpen)}
                value={currentValue}
                setValue={(val) => setCurrentValue(val)}
                maxHeight={80}
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
            <View style={[styles.dropDownStyle]}>
              <DropDownPicker
                items={itemsGender}
                open={isOpenGender}
                setOpen={() => setIsOpenGender(!isOpenGender)}
                value={currentValueGender}
                setValue={(val) => setCurrentValueGender(val)}
                maxHeight={100}
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
          <Pressable
            style={({ pressed }) => [
              styles.saveButton,
              pressed && { opacity: 0.85 },
              { zIndex: -1 },
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
    backgroundColor: "#FFFFFF",
  },
  body: {
    flex: 1,
    paddingTop: 15,
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
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 80,
    marginHorizontal: "30%",
    marginTop: 10,
    overflow: "hidden",
  },
  indicator: {
    position: "absolute",
    zIndex: 1000,
    right: "46%",
    top: "50%",
  },
});
