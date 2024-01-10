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
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import ServiceCard from "./ServiceCard";
import * as ImagePicker from "expo-image-picker";
import placeholder from "../../../assets/coachCarIcon.png";
import ChooseImageModal from "./Popup/ChooseImageModal";
import DropDownPicker from "react-native-dropdown-picker";
import { updateCoach, updateCoachWithImage } from "../../util/coachService";
import ModalSuccess from "./Popup/ModalSuccess";
import ModalFail from "./Popup/ModalFail";
import ModalConfirm from "./Popup/ModalConfirm";

DropDownPicker.setListMode("SCROLLVIEW");

export default function EditCoach({ route, navigation }) {
  const [visible, setVisible] = useState(false);
  const show = () => {
    setVisible(true);
  };
  const hide = () => {
    setVisible(false);
  };

  const contentC = "Are you sure to delete?";

  const [itemid, setItemid] = useState();

  const [visibleC, setVisibleC] = useState(false);
  const showC = () => {
    setVisibleC(true);
  };
  const hideC = () => {
    setVisibleC(false);
  };

  const confirm = () => {
    const updatedArray = serviceList.filter((item) => item.id !== itemid);
    setServiceList(updatedArray);
    hideC();
  };

  const { coachNumber } = route.params;
  const { idCoachType } = route.params;
  const { status } = route.params;
  const { id } = route.params;
  const { capacity } = route.params;
  const { lat } = route.params;
  const { lng } = route.params;
  const { image } = route.params;
  const { CoachTypeData } = route.params;
  const { ServiceData } = route.params;

  const [imageCoach, setImageCoach] = useState(image);
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
      setImageCoach(image);
      setVisible(false);
    } catch (error) {
      throw error;
    }
  };

  const pressHandler = () => {
    navigation.goBack();
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

  const [validateCoachNum, setValidateCoachNum] = useState(true);
  const [coachNum, setCoachNum] = useState(coachNumber);
  const coachNumHandler = (val) => {
    setCoachNum(val);
    setValidateCoachNum(true);
  };

  const [isOpenCapa, setIsOpenCapa] = useState(false);
  const [currentValueCapa, setCurrentValueCapa] = useState(capacity);
  const itemsCapa = [
    { label: "15", value: "15" },
    { label: "30", value: "30" },
    { label: "36", value: "36" },
    { label: "55", value: "55" },
  ];

  const value = CoachTypeData.typeName;
  const [isOpenType, setIsOpenType] = useState(false);
  const [currentValueType, setCurrentValueType] = useState(value);
  const itemsType = [
    { label: "VIP", value: "VIP" },
    { label: "Normal", value: "normal" },
    { label: "Sleeper", value: "Sleeper" },
  ];

  const [isOpenService, setIsOpenService] = useState(false);
  const [currentValueService, setCurrentValueService] = useState("");
  const itemsService = [
    { label: "Air Conditioner", value: "1" },
    { label: "Wifi", value: "2" },
    { label: "TV", value: "3" },
    { label: "Blanket", value: "4" },
    { label: "Charging Socket", value: "5" },
    { label: "Mattress", value: "6" },
    { label: "Earphone", value: "7" },
    { label: "Toilet", value: "8" },
    { label: "Food", value: "9" },
    { label: "Drink", value: "11" },
  ];

  const ServiceList = ServiceData.map((item) => ({
    id: itemsService.find((items) => items.label === item).value,
    name: item,
  }));

  const [serviceList, setServiceList] = useState(ServiceList);
  const [validateService, setValidateService] = useState(true);
  const [validateCapa, setValidateCapa] = useState(true);
  const [validateType, setValidateType] = useState(true);

  const saveHadler = async () => {
    if (coachNum == "") {
      setValidateCoachNum(false);
    } else {
      setValidateCoachNum(true);
    }

    if (currentValueType == "") {
      setValidateType(false);
    } else {
      setValidateType(true);
    }

    if (currentValueCapa == "") {
      setValidateCapa(false);
    } else {
      setValidateCapa(true);
    }
    if (coachNum != "" && currentValueType != "" && currentValueCapa != "") {
      try {
        setIndicator(true);
        const CoachID = id;
        let coachtype = 1;
        if (currentValueType == "VIP") {
          coachtype = 2;
        }
        if (currentValueType == "normal") {
          coachtype = 1;
        }
        //console.log(serviceList.map((item) => item.id.toString()))
        const updatedCoachData = {
          id: id,
          coachNumber: coachNum,
          imageCoach: imageCoach,
          idCoachType: parseInt(coachtype),
          capacity: parseInt(currentValueCapa),
          services: serviceList.map((item) => item.id.toString()),
        };
        const patchedCoach = await updateCoachWithImage(updatedCoachData);
        console.log("Patched Coach:", patchedCoach);
        setIndicator(false);
        showSuccess();
      } catch (error) {
        console.log(error);
        showFail();
      }
    }
  };

  const addHandler = () => {
    if (currentValueService == "") {
      setValidateService(false);
    } else {
      setValidateService(true);
    }

    if (currentValueService != "") {
      addServiceHandler(currentValueService);
    }
  };

  const reloadHandler = () => {
    setCoachNum("");
    setServiceList([]);
  };

  const addServiceHandler = (currentValueService) => {
    const newSer = {
      id: currentValueService,
      name: itemsService.find((item) => item.value === currentValueService)
        .label,
    };
    setServiceList([newSer, ...serviceList]);
  };

  const content = "Update coach successfully!";
  const contentFail = "Update coach Fail!";

  const [indicator, setIndicator] = useState(false);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <ActivityIndicator
          style={styles.indicator}
          size={"large"}
          animating={indicator}
        />
        <ModalSuccess
          visible={visibleSuccess}
          hide={hideSuccess}
          content={content}
        />
        <ModalFail
          visible={visibleFail}
          hide={hideFail}
          content={contentFail}
        />
        <ModalConfirm
          visible={visibleC}
          hide={hideC}
          content={contentC}
          confirm={confirm}
        />
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
          <Text style={styles.headerText}>Edit Coach</Text>
          <Pressable
            style={({ pressed }) => [
              styles.resetIconStyle,
              pressed && { opacity: 0.85 },
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
        >
          <View style={styles.imageContainer}>
            <Image
              style={styles.coachImage}
              source={imageCoach ? { uri: imageCoach } : placeholder}
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
          <Text style={styles.titleText}>Coach Information</Text>
          <View style={styles.coachInfoContainer}>
            {/* 3 textinput */}
            <Text style={styles.textLabel}>Coach Number</Text>
            <TextInput
              style={
                validateCoachNum == true
                  ? styles.textInput
                  : styles.textInputWrong
              }
              placeholder="Enter Coach Number"
              value={coachNum}
              onChangeText={coachNumHandler}
            ></TextInput>
            {!validateCoachNum && (
              <Text style={styles.validateText}>This field can't be empty</Text>
            )}
            <Text style={styles.textLabel}>Type</Text>
            <View style={styles.dropDownStyle}>
              <DropDownPicker
                items={itemsType}
                open={isOpenType}
                defaultValue={value}
                setOpen={() => setIsOpenType(!isOpenType)}
                value={currentValueType}
                setValue={(val) => setCurrentValueType(val)}
                maxHeight={150}
                autoScroll
                placeholder="Select Type"
                showTickIcon={true}
                style={styles.startDropDown}
                nestedScrollEnabled={true}
              />
            </View>
            {!validateType && (
              <Text style={styles.validateText}>Please choose coach type</Text>
            )}
            <Text style={styles.textLabel}>Capacity</Text>
            <View style={styles.dropDownStyle}>
              <DropDownPicker
                items={itemsCapa}
                open={isOpenCapa}
                defaultValue={capacity}
                setOpen={() => setIsOpenCapa(!isOpenCapa)}
                value={currentValueCapa}
                setValue={(val) => setCurrentValueCapa(val)}
                maxHeight={150}
                autoScroll
                placeholder="Select Capacity"
                showTickIcon={true}
                style={styles.startDropDown}
                nestedScrollEnabled={true}
              />
            </View>
            {!validateCapa && (
              <Text style={styles.validateText}>Please choose capacity</Text>
            )}
          </View>
          <Text style={styles.titleText}>Services</Text>
          <View>
            {/* 2 textinput, row flatlist */}
            <Text style={styles.textLabel}>Service Name</Text>
            <View style={[styles.dropDownStyle, { zIndex: 100 }]}>
              <DropDownPicker
                items={itemsService}
                open={isOpenService}
                setOpen={() => setIsOpenService(!isOpenService)}
                value={currentValueService}
                setValue={(val) => setCurrentValueService(val)}
                maxHeight={150}
                autoScroll
                placeholder="Select Service"
                showTickIcon={true}
                style={styles.startDropDown}
                nestedScrollEnabled={true}
              />
            </View>
            {!validateService && (
              <Text style={styles.validateText}>Please choose service</Text>
            )}
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.addButton,
              pressed && { opacity: 0.85 },
              { zIndex: -1 },
            ]}
            onPress={addHandler}
          >
            <Text style={styles.addText}>Add Service</Text>
          </Pressable>
          <View style={[styles.listService, { zIndex: -1 }]}>
            <FlatList
              showsHorizontalScrollIndicator={false}
              nestedScrollEnabled={true}
              horizontal={true}
              data={serviceList}
              renderItem={({ item }) => (
                <Pressable
                  onLongPress={() => {
                    showC();
                    setItemid(item.id);
                  }}
                >
                  <ServiceCard item={item}></ServiceCard>
                </Pressable>
              )}
              keyExtractor={(item, index) => index}
            />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.saveButton,
              pressed && { opacity: 0.85 },
            ]}
            onPress={saveHadler}
          >
            <Text style={styles.saveText}>SAVE</Text>
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
  coachImage: {
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
  textInputMultiline: {
    backgroundColor: "white",
    fontSize: 16,
    marginEnd: 20,
    marginStart: 20,
    height: 100,
    paddingLeft: 20,
    paddingRight: 40,
    borderRadius: 10,
    borderColor: "#283663",
    borderWidth: 1,
    color: "#283663",
    textAlignVertical: "top",
    paddingVertical: 5,
  },
  textInputMultilineWrong: {
    backgroundColor: "white",
    fontSize: 16,
    marginEnd: 20,
    marginStart: 20,
    height: 100,
    paddingLeft: 20,
    paddingRight: 40,
    borderRadius: 10,
    borderColor: "#EB3223",
    borderWidth: 1,
    color: "#283663",
    textAlignVertical: "top",
    paddingVertical: 5,
  },
  addButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#72C6A1",
    marginHorizontal: "30%",
    height: 50,
    marginBottom: 10,
    borderRadius: 20,
    marginTop: 20,
  },
  addText: {
    fontSize: 16,
    color: "white",
  },
  listService: {
    marginHorizontal: 20,
    marginVertical: 10,
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 10,
    height: 120,
    paddingTop: 18,
    borderColor: "#283663",
    borderWidth: 1,
  },
  saveButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#283663",
    marginHorizontal: "10%",
    height: 50,
    marginBottom: 10,
    borderRadius: 20,
  },
  saveText: {
    fontSize: 16,
    color: "white",
  },
  validateText: {
    color: "#EB3223",
    marginLeft: 40,
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
  indicator: {
    position: "absolute",
    zIndex: 1000,
    right: "46%",
    top: "50%",
  },
});
