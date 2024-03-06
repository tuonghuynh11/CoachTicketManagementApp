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
  ActivityIndicator
} from "react-native";
import React, { useState } from "react";
import ModalSuccess from "./Popup/ModalSuccess";
import ModalFail from "./Popup/ModalFail";
import { updateStaffPassword } from "../../util/staffService";
import i18next from "../../Services/i18next";
import { useTranslation } from "react-i18next";


export default function EditStaffAccount({route}) {
  const { t } = useTranslation();

  const {UserAccountData} = route.params;
  const [validateUsername, setValidateUsername] = useState(true);
  const [username, setUsername] = useState(UserAccountData.userName);
  const usernameHandler = (val) => {
    setUsername(val);
    setValidateUsername(true);
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

  const contentS = t("update-account-success");
  const [contentF, setContentF] = useState(t("update-account-fail"));
  const [validateOldPassword, setValidateOldPassword] = useState(true);
  const [oldpassword, setOldPassword] = useState('');
  const oldpasswordHandler = (val) => {
    setOldPassword(val);
    setValidateOldPassword(true);
  };
  const [validateNewPassword, setValidateNewPassword] = useState(true);
  const [Newpassword, setNewPassword] = useState('');
  const NewpasswordHandler = (val) => {
    setNewPassword(val);
    setValidateNewPassword(true);
  };
  const [validateReNewPassword, setValidateReNewPassword] = useState(true);
  const [reNewpassword, setReNewPassword] = useState('');
  const reNewpasswordHandler = (val) => {
    setReNewPassword(val);
    setValidateReNewPassword(true);
  };
  const saveHadler = async () => {
    
    if(username == '') {
      setValidateUsername(false);
    }
    else{
      setValidateUsername(true);
    }
    if(reNewpassword == '') {
      setValidateReNewPassword(false);
    }
    else{
      setValidateReNewPassword(true);
    }
    if(Newpassword == '') {
      setValidateNewPassword(false);
    }
    else{
      setValidateNewPassword(true);
    }
    if(username != '' && reNewpassword != '' && Newpassword != ''){
      if(oldpassword == Newpassword) {
        setContentF(t("old-pass-validation"));
        showFail();
      }
      else if(Newpassword != reNewpassword) {
        setContentF(t("new-pass-validation"));
        showFail();
      }
      else {
        try{
          setIndicator(true);
          const data ={
            password: reNewpassword
          }
          const updatedStaff = await updateStaffPassword(UserAccountData.id, data);
          console.log(updatedStaff);
          setIndicator(false)
          showSuccess();

        }catch(error){
          console.log(error);
          showFail();
        }
      }
    }
  }

  const [indicator, setIndicator] = useState(false);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
      <ModalSuccess visible={visibleSuccess} hide={hideSuccess} content={contentS}/>
        <ModalFail visible={visibleFail} hide={hideFail} content={contentF} />
        <ActivityIndicator style={styles.indicator} size={"large"} animating={indicator}/>
        <ScrollView
          style={styles.body}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          decelerationRate={"fast"}
        >
          <View>
            <Text style={styles.textLabel}>{t("username")}</Text>
            <TextInput
              style={validateUsername == true ? styles.textInput:styles.textInputWrong}
              placeholder={t("enter-username")}
              value={username}
              onChangeText={usernameHandler}
              editable={false}
            ></TextInput>
            {!validateUsername && <Text style={styles.validateText}>{t("non-empty-field")}</Text>}
            
            
            <Text style={styles.textLabel}>{t("new-password")}</Text>
            <TextInput
              style={validateNewPassword == true ? styles.textInput:styles.textInputWrong}
              placeholder={t("enter-new-password")}
              secureTextEntry={true}
              value={Newpassword}
              onChangeText={NewpasswordHandler}
            ></TextInput>
            {!validateNewPassword && <Text style={styles.validateText}>{t("non-empty-field")}</Text>}
            <Text style={styles.textLabel}>{t("repeat-new-password")}</Text>
            <TextInput
              style={validateReNewPassword == true ? styles.textInput:styles.textInputWrong}
              placeholder={t("re-enter-new-password")}
              secureTextEntry={true}
              value={reNewpassword}
              onChangeText={reNewpasswordHandler}
            ></TextInput>
            {!validateReNewPassword && <Text style={styles.validateText}>{t("non-empty-field")}</Text>}
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
    marginTop: 10
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
    borderColor: '#283663',
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
    borderColor: '#EB3223',
    borderWidth: 1,
    color: "#283663",
    
  },
  textLabel: {
    color: "#283663",
    marginLeft: 34,
    marginBottom: 5,
    marginTop: 10
  },
  saveButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#283663",
    marginHorizontal: "10%",
    height: 50,
    marginBottom: 10,
    borderRadius: 20,
    marginTop: 30
  },
  saveText: {
    fontSize: 16,
    color: "white",
  },
  validateText: {
    color: "#EB3223",
    marginLeft: 40,
  },
  indicator: {
    position: "absolute",
    zIndex: 1000,
    right: '46%',
    top: "50%"
  }
});
