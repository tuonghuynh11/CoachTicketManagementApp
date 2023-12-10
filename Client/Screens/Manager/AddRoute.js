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
import React, { useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import PlaceCard from "./PlaceCard";
import * as ImagePicker from "expo-image-picker";
import placeholder from "../../../assets/routeImage.png";
import ChooseImageModal from "./Popup/ChooseImageModal";
import DropDownPicker from "react-native-dropdown-picker";
import {
  getAllDistrict,
  getAllProvince,
  getAllWard,
} from "../../util/locationService";
import { getLocation } from "../../util/bingMapService";
import { createRoute } from "../../util/routeService";
import ModalFail from "./Popup/ModalFail";
import ModalSuccess from "./Popup/ModalSuccess";
import ModalConfirm from "./Popup/ModalConfirm";

DropDownPicker.setListMode("SCROLLVIEW");

export default function AddRoute({ navigation }) {
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

  const contentS = "Add Route Successfully!";
  const [contentF, setContentF] = useState("Add Route Fail!");

  const contentC = "Are you sure to delete?"
  const [visibleC, setVisibleC] = useState(false);
  const showC = () => {
    setVisibleC(true);
  };
  const hideC = () => {
    setVisibleC(false);
  };

  const [visibleCDes, setVisibleCDes] = useState(false);
  const showCDes = () => {
    setVisibleCDes(true);
  };
  const hideCDes = () => {
    setVisibleCDes(false);
  };

  const [itemid, setItemid] = useState();

  const confirmDep = () => {
    const updatedArray = depPlace.filter((item) => item.id !== itemid);
    setDepPlace(updatedArray);
    hideC()
  }


  const confirmDes = () => {
    const updatedArray = desPlace.filter((item) => item.id !== itemid);
    setDesPlace(updatedArray);
    hideCDes()
  }

  const [isOpenDepProvince, setIsOpenDepProvince] = useState(false);
  const [currentValueDepProvince, setCurrentValueDepProvince] = useState("");
  const [isOpenDesProvince, setIsOpenDesProvince] = useState(false);
  const [currentValueDesProvince, setCurrentValueDesProvince] = useState("");
  const [provinceData, setProvinceData] = useState([]);

  const fetchProvinces = async () => {
    try {
      setIndicator(true);
      const data = await getAllProvince();
      setProvinceData(data.results);
      setIndicator(false);
    } catch (error) {
      // Handle error, e.g., redirect to login if unauthorized
      console.error("Error fetching provinces:", error);
    }
  };

  useEffect(() => {
    fetchProvinces();
  }, []);

  const itemsDepProvince = provinceData.map(
    ({ province_id, province_name }) => ({
      value: province_id,
      label: province_name,
    })
  );
  const itemsDesProvince = provinceData.map(
    ({ province_id, province_name }) => ({
      value: province_id,
      label: province_name,
    })
  );

  const [isOpenDepDistrict, setIsOpenDepDistrict] = useState(false);
  const [currentValueDepDistrict, setCurrentValueDepDistrict] = useState("");
  const [isOpenDesDistrict, setIsOpenDesDistrict] = useState(false);
  const [currentValueDesDistrict, setCurrentValueDesDistrict] = useState("");

  const [depDistrictData, setDepDistrictData] = useState([]);
  const [desDistrictData, setDesDistrictData] = useState([]);

  const fetchDepDistricts = async (val) => {
    try {
      // console.log(val);
      setIndicator(true);
      const data = await getAllDistrict(val);
      setDepDistrictData(data.results);
      setIndicator(false);
    } catch (error) {
      // Handle error, e.g., redirect to login if unauthorized
      console.error("Error fetching districts:", error);
    }
  };

  const fetchDesDistricts = async (val) => {
    try {
      // console.log(val);
      setIndicator(true);
      const data = await getAllDistrict(val);
      setDesDistrictData(data.results);
      setIndicator(false);
    } catch (error) {
      // Handle error, e.g., redirect to login if unauthorized
      console.error("Error fetching districts:", error);
    }
  };

  // useEffect(() => {
  //   fetchDistricts();
  // }, [currentValueDepProvince]);

  const itemsDepDistrict = depDistrictData.map(
    ({ district_id, district_name }) => ({
      value: district_id,
      label: district_name,
    })
  );
  const itemsDesDistrict = desDistrictData.map(
    ({ district_id, district_name }) => ({
      value: district_id,
      label: district_name,
    })
  );

  const [isOpenDepWard, setIsOpenDepWard] = useState(false);
  const [currentValueDepWard, setCurrentValueDepWard] = useState("");
  const [isOpenDesWard, setIsOpenDesWard] = useState(false);
  const [currentValueDesWard, setCurrentValueDesWard] = useState("");
  const [depWardData, setDepWardData] = useState([]);
  const [desWardData, setDesWardData] = useState([]);

  const fetchDepWard = async (val) => {
    try {
      // console.log(val);
      setIndicator(true);
      const data = await getAllWard(val);
      setDepWardData(data.results);
      setIndicator(false);
    } catch (error) {
      // Handle error, e.g., redirect to login if unauthorized
      console.error("Error fetching wards:", error);
    }
  };

  const itemsDepWard = depWardData.map(({ ward_id, ward_name }) => ({
    value: ward_id,
    label: ward_name,
  }));

  const itemsDesWard = desWardData.map(({ ward_id, ward_name }) => ({
    value: ward_id,
    label: ward_name,
  }));

  const fetchDesWard = async (val) => {
    try {
      // console.log(val);
      setIndicator(true);
      const data = await getAllWard(val);
      setDesWardData(data.results);
      setIndicator(false);
    } catch (error) {
      // Handle error, e.g., redirect to login if unauthorized
      console.error("Error fetching wards:", error);
    }
  };

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
  const [validateRouteName, setValidateRouteName] = useState(true);
  const [RouteName, setRouteName] = useState("");
  const RouteNameHandler = (val) => {
    setRouteName(val);
    setValidateRouteName(true);
  };

  const [validateDeparturePlace, setValidateDeparturePlace] = useState(true);
  const [DeparturePlace, setDeparturePlace] = useState("");
  const DeparturePlaceHandler = (val) => {
    setDeparturePlace(val);
    setValidateDeparturePlace(true);
  };

  const [validateDestinationPlace, setValidateDestinationPlace] =
    useState(true);
  const [DestinationPlace, setDestinationPlace] = useState("");
  const DestinationPlaceHandler = (val) => {
    setDestinationPlace(val);
    setValidateDestinationPlace(true);
  };

  const [validateDepProvince, setValidateDepProvince] = useState(true);
  const [validateDesProvince, setValidateDesProvince] = useState(true);
  const [validateDepDistrict, setValidateDepDistrict] = useState(true);
  const [validateDesDistrict, setValidateDesDistrict] = useState(true);
  const [validateDepWard, setValidateDepWard] = useState(true);
  const [validateDesWard, setValidateDesWard] = useState(true);

  const fecthLocation = async (location, type) => {
    try {
      //console.log(location);
      const data = await getLocation(location);
      // console.log(
      //   data.resourceSets[0].resources[0].geocodePoints[0].coordinates
      // );
      if (type == "dep") {
        return data.resourceSets[0].resources[0].geocodePoints[0].coordinates;
      } else if (type == "des") {
        return data.resourceSets[0].resources[0].geocodePoints[0].coordinates;
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  const [latDep, setLatDep] = useState();
  const [latDes, setLatDes] = useState();
  const [lngDep, setLngDep] = useState();
  const [lngDes, setLngDes] = useState();

  const addDepartureHandler = async () => {
    if (DeparturePlace == "") {
      setValidateDeparturePlace(false);
    } else {
      setValidateDeparturePlace(true);
    }
    if (currentValueDepDistrict == "") {
      setValidateDepDistrict(false);
    } else {
      setValidateDepDistrict(true);
    }
    if (currentValueDepWard == "") {
      setValidateDepWard(false);
    } else {
      setValidateDepWard(true);
    }

    if (
      DeparturePlace != "" &&
      currentValueDepDistrict != "" &&
      currentValueDepWard != ""
    ) {
      setIndicator(true)
      const index = depPlace.length + 1;
      const locationPlace =
        DeparturePlace +
        ", " +
        itemsDepWard.find((item) => item.value === currentValueDepWard).label +
        ", " +
        itemsDepDistrict.find((item) => item.value === currentValueDepDistrict)
          .label +
        ", " +
        itemsDepProvince.find((item) => item.value === currentValueDepProvince)
          .label;

      const res = await fecthLocation(locationPlace, "dep");

      console.log(res);

      const newPlace = {
        id: index,
        
        lat: res[0],
        lng: res[1],
        placeName: locationPlace
      };
      setDepPlace([newPlace, ...depPlace]);
      setIndicator(false);
    }
  };

  const addDestinationHandler = async () => {
    if (DestinationPlace == "") {
      setValidateDestinationPlace(false);
    } else {
      setValidateDestinationPlace(true);
    }
    if (currentValueDesDistrict == "") {
      setValidateDesDistrict(false);
    } else {
      setValidateDesDistrict(true);
    }

    if (currentValueDesWard == "") {
      setValidateDesWard(false);
    } else {
      setValidateDesWard(true);
    }

    if (
      DestinationPlace != "" &&
      currentValueDesDistrict != "" &&
      currentValueDesWard != ""
    ) {
      setIndicator(true);
      const index = desPlace.length + 1;
      const locationPlace =
        DestinationPlace +
        ", " +
        itemsDesWard.find((item) => item.value === currentValueDesWard).label +
        ", " +
        itemsDesDistrict.find((item) => item.value === currentValueDesDistrict)
          .label +
        ", " +
        itemsDesProvince.find((item) => item.value === currentValueDesProvince)
          .label;

      const res = await fecthLocation(locationPlace, "des");

      const newPlace = {
        id: index,
        
        lat: res[0],
        lng: res[1],
        placeName: locationPlace
      };
      setDesPlace([newPlace, ...desPlace]);
      setIndicator(false);
    }
  };

  const saveHadler = async () => {
    if (RouteName == "") {
      setValidateRouteName(false);
    } else {
      setValidateRouteName(true);
    }
    if (currentValueDepProvince == "") {
      setValidateDepProvince(false);
    } else {
      setValidateDepProvince(true);
    }
    if (currentValueDesProvince == "") {
      setValidateDesProvince(false);
    } else {
      setValidateDepProvince(true);
    }
    if (
      RouteName != "" &&
      currentValueDepProvince != "" &&
      currentValueDesProvince != ""
    ) {
      try {
        setIndicator(true);
        const newPlaceData = {
          startPlace: depPlace.map(({lat, lng, placeName}) => ({placeLat: lat, placeLng: lng, placeName})),
          endPlace: desPlace.map(({lat, lng, placeName}) => ({placeLat: lat, placeLng: lng, placeName})),
        };
        const newRouteData = {
          routeName: RouteName,
          departurePlace: itemsDepProvince.find(
            (item) => item.value == currentValueDepProvince
          ).label,
          arrivalPlace: itemsDesProvince.find(
            (item) => item.value == currentValueDesProvince
          ).label,
          places: newPlaceData,
        };
        console.log(newPlaceData);
        console.log(newRouteData);
        const newRoute = await createRoute(newRouteData);
        console.log(newRoute);
        console.log("success");
        setIndicator(false);
        showSuccess();
      } catch (error) {
        console.log(error);
        showFail();
      }
    }
  };

  const places = [
    { id: 1, placeName: "abcd" },
    { id: 2, placeName: "abcd" },
    { id: 3, placeName: "abcd" },
    { id: 4, placeName: "abcd" },
    { id: 5, placeName: "abcd" },
  ];

  const [depPlace, setDepPlace] = useState([]);
  const [desPlace, setDesPlace] = useState([]);

  const reloadHandler = () => {
    setRouteName("");
    setDepPlace([]);
    setDesPlace([]);
    setDeparturePlace("");
    setDestinationPlace("");
  };

  const [indicator, setIndicator] = useState(false);
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
      <ActivityIndicator style={styles.indicator} size={"large"} animating={indicator}/>
      <ModalSuccess visible={visibleSuccess} hide={hideSuccess} content={contentS}/>
        <ModalFail visible={visibleFail} hide={hideFail} content={contentF} />
        <ModalConfirm visible={visibleC} hide={hideC} content={contentC} confirm={confirmDep}/>
        <ModalConfirm visible={visibleCDes} hide={hideCDes} content={contentC} confirm={confirmDes}/>
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
          <Text style={styles.headerText}>New Route</Text>
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
          {/* <View style={styles.imageContainer}>
            <Image
              style={styles.routeImage}
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
          /> */}
          <Text style={styles.titleText}>Route Information</Text>
          <View>
            <Text style={styles.textLabel}>Route Name</Text>
            <TextInput
              style={
                validateRouteName == true
                  ? styles.textInput
                  : styles.textInputWrong
              }
              placeholder="Enter Route Name"
              value={RouteName}
              onChangeText={RouteNameHandler}
            ></TextInput>
            {!validateRouteName && (
              <Text style={styles.validateText}>This field can't be empty</Text>
            )}
            <Text style={styles.textLabel}>Departure Province: </Text>
            <View style={styles.dropDownStyle}>
              <DropDownPicker
                items={itemsDepProvince}
                open={isOpenDepProvince}
                setOpen={() => setIsOpenDepProvince(!isOpenDepProvince)}
                value={currentValueDepProvince}
                setValue={(val) => {
                  setCurrentValueDepProvince(val);
                }}
                maxHeight={150}
                autoScroll
                placeholder="Select Province"
                showTickIcon={true}
                style={styles.startDropDown}
                nestedScrollEnabled={true}
                // onChangeValue={(val) => fetchDistricts(val)}
                onSelectItem={(val) => fetchDepDistricts(val.value)}
              />
            </View>
            {!validateDepProvince && (
              <Text style={styles.validateText}>Please choose province</Text>
            )}
            <Text style={styles.textLabel}>Destination Province:</Text>
            <View style={styles.dropDownStyle}>
              <DropDownPicker
                items={itemsDesProvince}
                open={isOpenDesProvince}
                setOpen={() => setIsOpenDesProvince(!isOpenDesProvince)}
                value={currentValueDesProvince}
                setValue={(val) => setCurrentValueDesProvince(val)}
                maxHeight={150}
                autoScroll
                placeholder="Select Province"
                showTickIcon={true}
                style={styles.startDropDown}
                nestedScrollEnabled={true}
                onSelectItem={(val) => fetchDesDistricts(val.value)}
              />
            </View>
            {!validateDesProvince && (
              <Text style={styles.validateText}>Please choose province</Text>
            )}
            <Text style={styles.titleText}>Departure Places</Text>
            <View>
              {/* 2 textinput, row flatlist */}
              <Text style={styles.textLabel}>Depature District: </Text>
              <View style={styles.dropDownStyle}>
                <DropDownPicker
                  items={itemsDepDistrict}
                  open={isOpenDepDistrict}
                  setOpen={() => setIsOpenDepDistrict(!isOpenDepDistrict)}
                  value={currentValueDepDistrict}
                  setValue={(val) => {
                    setCurrentValueDepDistrict(val);
                  }}
                  maxHeight={150}
                  autoScroll
                  placeholder="Select District"
                  showTickIcon={true}
                  style={styles.startDropDown}
                  nestedScrollEnabled={true}
                  // onChangeValue={(val) => fetchDistricts(val)}
                  onSelectItem={(val) => fetchDepWard(val.value)}
                />
              </View>
              {!validateDepDistrict && (
                <Text style={styles.validateText}>Please choose district</Text>
              )}
              <Text style={styles.textLabel}>Depature Ward: </Text>
              <View style={styles.dropDownStyle}>
                <DropDownPicker
                  items={itemsDepWard}
                  open={isOpenDepWard}
                  setOpen={() => setIsOpenDepWard(!isOpenDepWard)}
                  value={currentValueDepWard}
                  setValue={(val) => {
                    setCurrentValueDepWard(val);
                  }}
                  maxHeight={150}
                  autoScroll
                  placeholder="Select Ward"
                  showTickIcon={true}
                  style={styles.startDropDown}
                  nestedScrollEnabled={true}
                  // onChangeValue={(val) => fetchDistricts(val)}
                  //onSelectItem={(val) => fetchDepDistricts(val.value)}
                />
              </View>
              {!validateDepWard && (
                <Text style={styles.validateText}>Please choose ward</Text>
              )}
              <Text style={styles.textLabel}>Departure Place</Text>
              <TextInput
                style={
                  validateDeparturePlace == true
                    ? styles.textInput
                    : styles.textInputWrong
                }
                placeholder="Enter Detail Place"
                value={DeparturePlace}
                onChangeText={DeparturePlaceHandler}
              ></TextInput>
              {!validateDeparturePlace && (
                <Text style={styles.validateText}>
                  This field can't be empty
                </Text>
              )}
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.addButton,
                pressed && { opacity: 0.85 },
              ]}
              onPress={addDepartureHandler}
            >
              <Text style={styles.addText}>Add Place</Text>
            </Pressable>
            <View style={styles.listPlaces}>
              <FlatList
                showsHorizontalScrollIndicator={false}
                nestedScrollEnabled={true}
                horizontal={true}
                data={depPlace}
                renderItem={({ item }) => 
                <Pressable onLongPress={() => {
                  showC();
                  setItemid(item.id);
                }}>

                  <PlaceCard item={item} />
                </Pressable>
              }
                keyExtractor={(item) => item.id}
              />
            </View>
            <Text style={styles.titleText}>Destination Places</Text>
            <View>
              {/* 2 textinput, row flatlist */}
              <Text style={styles.textLabel}>Destination District: </Text>
              <View style={styles.dropDownStyle}>
                <DropDownPicker
                  items={itemsDesDistrict}
                  open={isOpenDesDistrict}
                  setOpen={() => setIsOpenDesDistrict(!isOpenDesDistrict)}
                  value={currentValueDesDistrict}
                  setValue={(val) => {
                    setCurrentValueDesDistrict(val);
                  }}
                  maxHeight={150}
                  autoScroll
                  placeholder="Select District"
                  showTickIcon={true}
                  style={styles.startDropDown}
                  nestedScrollEnabled={true}
                  // onChangeValue={(val) => fetchDistricts(val)}
                  onSelectItem={(val) => fetchDesWard(val.value)}
                />
              </View>
              {!validateDesDistrict && (
                <Text style={styles.validateText}>Please choose district</Text>
              )}
              <Text style={styles.textLabel}>Destination Ward: </Text>
              <View style={styles.dropDownStyle}>
                <DropDownPicker
                  items={itemsDesWard}
                  open={isOpenDesWard}
                  setOpen={() => setIsOpenDesWard(!isOpenDesWard)}
                  value={currentValueDesWard}
                  setValue={(val) => {
                    setCurrentValueDesWard(val);
                  }}
                  maxHeight={150}
                  autoScroll
                  placeholder="Select Ward"
                  showTickIcon={true}
                  style={styles.startDropDown}
                  nestedScrollEnabled={true}
                  // onChangeValue={(val) => fetchDistricts(val)}
                  //onSelectItem={(val) => fetchDepDistricts(val.value)}
                />
              </View>
              {!validateDesWard && (
                <Text style={styles.validateText}>Please choose ward</Text>
              )}
              <Text style={styles.textLabel}>Destination Place</Text>
              <TextInput
                style={
                  validateDestinationPlace == true
                    ? styles.textInput
                    : styles.textInputWrong
                }
                placeholder="Enter Enter Detail Place"
                value={DestinationPlace}
                onChangeText={DestinationPlaceHandler}
              ></TextInput>
              {!validateDestinationPlace && (
                <Text style={styles.validateText}>
                  This field can't be empty
                </Text>
              )}
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.addButton,
                pressed && { opacity: 0.85 },
              ]}
              onPress={addDestinationHandler}
            >
              <Text style={styles.addText}>Add Place</Text>
            </Pressable>
            <View style={styles.listPlaces}>
              <FlatList
                showsHorizontalScrollIndicator={false}
                nestedScrollEnabled={true}
                horizontal={true}
                data={desPlace}
                renderItem={({ item }) => 
                <Pressable onLongPress={() => {
                  showCDes();
                  setItemid(item.id);
                }}>

                  <PlaceCard item={item} />
                </Pressable>
              }
                keyExtractor={(item) => item.id}
              />
            </View>
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
  routeImage: {
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
  listPlaces: {
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: "white",
    borderRadius: 10,
    height: 120,
    borderColor: "#283663",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
  },
  saveButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#283663",
    marginHorizontal: "10%",
    height: 50,
    marginBottom: 10,
    borderRadius: 20,
    marginTop: 20,
  },
  saveText: {
    fontSize: 16,
    color: "white",
  },
  validateText: {
    color: "#EB3223",
    marginLeft: 40,
  },
  dropDownStyle: {
    paddingRight: 20,
    paddingLeft: 20,
  },
  startDropDown: {
    zIndex: 100,
    borderColor: "#283663",
    color: "#283663",
    paddingLeft: 20,
  },
  indicator: {
    position: "absolute",
    zIndex: 1000,
    right: '46%',
    top: "50%"
  }
});
