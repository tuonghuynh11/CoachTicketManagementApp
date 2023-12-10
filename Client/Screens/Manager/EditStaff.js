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
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { FontAwesome } from "@expo/vector-icons";
import EditStaffInfo from "./EditStaffInfo";
import EditStaffAccount from "./EditStaffAccount";
import * as ImagePicker from "expo-image-picker";
import placeholder from "../../../assets/peopleIcon.jpg";
import ChooseImageModal from "./Popup/ChooseImageModal";
import ModalConfirm from "./Popup/ModalConfirm";
import ModalSuccess from "./Popup/ModalSuccess";
import ModalFail from "./Popup/ModalFail";

DropDownPicker.setListMode("SCROLLVIEW");

const Tab = createMaterialTopTabNavigator();

function MyTabs({data}) {
  
  return (
    <Tab.Navigator
      initialRouteName="StaffInfo"
      screenOptions={{
        tabBarStyle: { backgroundColor: "#72C6A1" },
        tabBarLabelStyle: { fontSize: 16 },
        tabBarPressColor: "#60ad8c",
        tabBarActiveTintColor: "#283663",
        tabBarIndicatorStyle: {
          backgroundColor: "#283663",
          height: 2,
        },
      }}
    >
      <Tab.Screen
        name="StaffInfo"
        component={EditStaffInfo}
        options={{ tabBarLabel: "Information" }}
        initialParams={data}
      />
      <Tab.Screen
        name="StaffAccount"
        component={EditStaffAccount}
        options={{ tabBarLabel: "Account" }}
        initialParams={data}
      />
    </Tab.Navigator>
  );
}

export default function EditStaff({navigation, route}) {
  const [visible, setVisible] = useState(false);
  const show = () => {
    setVisible(true);
  };
  const hide = () => {
    setVisible(false);
  };

  const {UserAccountData} = route.params;
  const {fullName} = route.params;
  const {email} = route.params;
  const {phoneNumber} = route.params;
  const {gender} = route.params;
  const {positionId} = route.params;

  const [visibleC, setVisibleC] = useState(false);
  const showC = () => {
    setVisibleC(true);
  };
  const hideC = () => {
    setVisibleC(false);
  };

  const content = "Are you sure to ban this staff?";

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

  const contentS = "Ban Staff Successfully!";
  const [contentF, setContentF] = useState("Ban Staff Fail!");

  const confirm = () => {
    try{
      hideC();
      showSuccess();
    }catch(error){
      console.log("Error ban staff:"+error);
    }
  }

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
  const pressHandler = () => {
    navigation.goBack();
  }

  const data = {
    //image: image,
    fullName: fullName,
    email: email,
    phoneNumber: phoneNumber,
    gender: gender,
    positionId: positionId,
    UserAccountData: UserAccountData
  }
  //console.log(data);
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
      <ModalSuccess visible={visibleSuccess} hide={hideSuccess} content={contentS}/>
        <ModalFail visible={visibleFail} hide={hideFail} content={contentF} />
      <ModalConfirm visible={visibleC} hide={hideC} content={content} confirm={confirm}/>
        <View style={styles.header}>
          <Pressable style={({ pressed }) => [
                styles.backIcon,
                pressed && { opacity: 0.85 },
              ]} onPress={pressHandler}>

            <Ionicons
              name="ios-arrow-back-circle-sharp"
              size={38}
              color="#283663"
            />
          </Pressable>
          <Text style={styles.headerText}>Edit Staff</Text>
          <Pressable style={({ pressed }) => [
                styles.resetIconStyle,
                pressed && { opacity: 0.85 },
              ]} onPress={showC}>

            <FontAwesome
              name="ban"
              size={36}
              
              color="red"
            />
          </Pressable>
        </View>
        
          
        <View style={styles.body}>
          
            <MyTabs data={data}/>
          
        </View>
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
});
