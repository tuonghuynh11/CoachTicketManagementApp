import { useContext, useEffect, useState } from "react";
import {
  Button,
  Text,
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  TextInput,
  Pressable,
  FlatList,
  ScrollView,
  Platform,
  TouchableOpacity,
  Switch,
  Modal,
  Alert,
  Keyboard,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AuthContext } from "../../Store/authContex";
import GlobalColors from "../../Color/colors";
import { Ionicons } from "@expo/vector-icons";
import IconButton from "../../Componets/UI/IconButton";
import InputIcon from "../../Componets/UI/InputIcon";
import CustomButton from "../../Componets/UI/CustomButton";
import RouteItem from "../../Componets/Route/RouteItem";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SelectList } from "react-native-dropdown-select-list";
import { checkTokenExpiration, getLocationInfo } from "../../util/apiServices";
import PopUp from "../../Componets/UI/PopUp";
import {
  ResetToken,
  getAllPlaces,
  getAllRoutes,
  getPopularTrip,
  searchTrip,
} from "../../util/databaseAPI";
import SearchBox from "../../Componets/UI/SearchBox";
import FlatButton from "../../Componets/UI/FlatButton";
import {
  PermissionStatus,
  getCurrentPositionAsync,
  requestForegroundPermissionsAsync,
} from "expo-location";
import { convertVietnameseToNormal } from "../../Helper/Validation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
function HomeScreen({ navigation }) {
  const authCtx = useContext(AuthContext);

  const [popularRoutes, setPopularRoutes] = useState([]);
  const [recentSearchRoutes, setRecentSearchRoutes] = useState([]);
  const [suggestRoutes, setSuggestRoutes] = useState([]);

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [dateOfTrip, setDateOfTrip] = useState("");

  const [departurePlace, setDeparturePlace] = useState("");
  const [arrivalPlace, setArrivalPlace] = useState("");

  const [departurePlaceObj, setDeparturePlaceObj] = useState(null);
  const [arrivalPlaceObj, setArrivalPlaceObj] = useState(null);

  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [roundTripDate, setRoundTripDate] = useState(
    new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
  );
  const [showRoundTripPicker, setShowRoundTripPicker] = useState(false);
  const [dateOfRoundTrip, setDateOfRoundTrip] = useState("");

  const [selectedSeat, setSelectedSeat] = useState();
  const [selectedSeatText, setSelectedSeatText] = useState("1 seat");

  const [isSelectSeat, setIsSelectSeat] = useState(false);

  const [isTokenExpire, setIsTokenExpire] = useState(false);

  const [isWarning, setIsWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  const [baseLocations, setBaseLocations] = useState([]);
  const [locations, setLocations] = useState([]);
  const [isShowSearchLocations, setIsShowSearchLocations] = useState(false);
  const [myPosition, setMyPosition] = useState();
  const [pickPlaceOption, setPickPlaceOption] = useState(0); //0: pick for departurePlaces, 1: pick for arrivalPlace

  const isFocused = useIsFocused();
  const data = [
    { key: "1", value: "1 seat" },
    { key: "2", value: "2 seats" },
    { key: "3", value: "3 seats" },
    { key: "4", value: "4 seats" },
  ];
  useEffect(() => {
    if (checkTokenExpiration(authCtx.token.split(" ")[1])) {
      setIsTokenExpire(true);
    } else {
      setIsTokenExpire(false);
    }
  }, [authCtx.token]);
  useEffect(() => {
    async function getRecentSearchTrip() {
      try {
        const jsonValue = await AsyncStorage.getItem("recentSearchTrips");
        if (jsonValue != null) {
          const temp = JSON.parse(jsonValue);
          const temp2 = temp.map((item) => {
            const departurePlaces = item?.departurePlace?.split(",");
            const arrivalPlaces = item?.arrivalPlace?.split(",");
            return {
              id: item.id,
              image: item.image,
              departurePlace:
                departurePlaces[departurePlaces.length - 1].trim(),
              arrivalPlace: arrivalPlaces[arrivalPlaces.length - 1].trim(),
              Price: item.price,
            };
          });
          setRecentSearchRoutes(temp2);
        } else {
          setRecentSearchRoutes([]);
        }
      } catch (e) {
        // error reading value
        console.log("Get Recent Search Trip:", e);
      }
    }
    async function getSuggestTrip() {
      try {
        const jsonValue = await AsyncStorage.getItem("suggestTrips");
        if (jsonValue != null) {
          const temp = JSON.parse(jsonValue);
          const temp2 = temp.map((item) => {
            const departurePlaces = item?.departurePlace?.split(",");
            const arrivalPlaces = item?.arrivalPlace?.split(",");
            return {
              id: item.id,
              image: item.image,
              departurePlace:
                departurePlaces[departurePlaces.length - 1].trim(),
              arrivalPlace: arrivalPlaces[arrivalPlaces.length - 1].trim(),
              Price: item.price,
            };
          });
          setSuggestRoutes(temp2);
        } else {
          setSuggestRoutes([]);
        }
      } catch (e) {
        // error reading value
        console.log("Get Recent Search Trip:", e);
      }
    }
    if (isFocused) {
      getRecentSearchTrip();
      getSuggestTrip();
    }
  }, [isFocused]);
  useEffect(() => {
    async function getLocation() {
      const routes = await getAllRoutes(authCtx.token);
      // const places = await getAllPlaces(authCtx.token);
      const places = { rows: [] };
      if (!routes || !places) {
        return;
      }
      const locations = convertResponseLocationsToArray(
        routes.rows,
        places.rows
      );
      setBaseLocations(locations);
      setLocations(locations);
    }

    getLocation();
    async function getPopularTrips() {
      const popular = await getPopularTrip(authCtx.token);
      if (!popular) {
        return;
      }
      const temp2 = popular.rows.map((item) => {
        const departurePlaces = item?.StartPlaceData?.placeName?.split(", ");
        const arrivalPlaces = item?.ArrivalPlaceData?.placeName?.split(", ");
        return {
          id: item.id,
          image: item.CoachData.image,
          departurePlace: departurePlaces[departurePlaces.length - 1].trim(),
          arrivalPlace: arrivalPlaces[arrivalPlaces.length - 1].trim(),
          Price: item.price,
        };
      });
      const filter = [];
      for (const item of temp2) {
        const isContained = filter.find(
          (item1) =>
            item1.departurePlace == item.departurePlace &&
            item1.arrivalPlace == item.arrivalPlace
        );
        if (!isContained) {
          filter.push(item);
        }
      }
      setPopularRoutes(filter);
    }
    getPopularTrips();
    const popular = [
      {
        id: 1,
        image:
          "https://nld.mediacdn.vn/2019/12/28/tp-hcm-ruc-ro-ve-dem-anh-hoang-trieu-4-15775262530931728274679.jpg",
        departurePlace: "Vung Tau",
        arrivalPlace: "Ho Chi Minh",
        Price: 120000,
      },
      {
        id: 2,
        image:
          "https://nld.mediacdn.vn/2019/12/28/tp-hcm-ruc-ro-ve-dem-anh-hoang-trieu-4-15775262530931728274679.jpg",
        departurePlace: "Thua Thien Hue",
        arrivalPlace: "Ho Chi Minh",
        Price: 120000,
      },
      {
        id: 3,
        image:
          "https://nld.mediacdn.vn/2019/12/28/tp-hcm-ruc-ro-ve-dem-anh-hoang-trieu-4-15775262530931728274679.jpg",
        departurePlace: "Vung Tau",
        arrivalPlace: "Ho Chi Minh",
        Price: 120000,
      },
    ];
    const recent = [
      {
        id: 1,
        image:
          "https://nld.mediacdn.vn/2019/12/28/tp-hcm-ruc-ro-ve-dem-anh-hoang-trieu-4-15775262530931728274679.jpg",
        departurePlace: "Vung Tau",
        arrivalPlace: "Ho Chi Minh",
        Price: 120000,
      },
      {
        id: 2,
        image:
          "https://nld.mediacdn.vn/2019/12/28/tp-hcm-ruc-ro-ve-dem-anh-hoang-trieu-4-15775262530931728274679.jpg",
        departurePlace: "Vung Tau",
        arrivalPlace: "Ho Chi Minh",
        Price: 120000,
      },
      {
        id: 3,
        image:
          "https://nld.mediacdn.vn/2019/12/28/tp-hcm-ruc-ro-ve-dem-anh-hoang-trieu-4-15775262530931728274679.jpg",
        departurePlace: "Vung Tau",
        arrivalPlace: "Ho Chi Minh",
        Price: 120000,
      },
    ];

    ///// 1: parentPlace, 2: childPlace
    /// parentPlace: search by departurePlace and arrivalPlace
    /// childPlace: search by from and arrivalPlaceto

    // const locations = [
    //   {
    //     id: 1,
    //     placeName: "Tp Hồ Chí Minh",
    //     placeType: 1, // 1: parentPlace, 2: childPlace
    //   },
    //   {
    //     id: 1,
    //     placeName: "Kiên Giang",
    //     placeType: 1, // 1: parentPlace, 2: childPlace
    //   },
    // ];
    // setBaseLocations(locations);
    // setLocations(locations);
    // setPopularRoutes(popular);
    // setRecentSearchRoutes(recent);
  }, []);
  function convertResponseLocationsToArray(routes, places) {
    let result = [];
    ///Routes
    let temp = new Set();
    routes.forEach((item) => {
      temp.add(item.departurePlace);
      temp.add(item.arrivalPlace);
    });
    temp.forEach((item) => {
      result.push({
        id: "route" + item[0],
        placeName: item,
        parentName: "",
        placeType: 1,
      });
    });
    /////Places
    let temp1 = new Set();
    places.forEach((item) => {
      temp1.add({
        placeName: item.placeName,
        parentName:
          item.isPickUpPlace === "1"
            ? item.RouteData.departurePlace
            : item.RouteData.arrivalPlace,
      });
    });
    temp1.forEach((item) => {
      result.push({
        id: "places" + item[0],
        placeName: item.placeName,
        parentName: item.parentName,
        placeType: 2,
      });
    });

    return result;
  }

  //Date
  function toggleDatePicker() {
    Keyboard.dismiss();
    setShowPicker(!showPicker);
  }
  function onDateChange({ type }, selectedDate) {
    if (type === "set") {
      const currentDate = selectedDate;
      setRoundTripDate(
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() + 1
        )
      );

      setDate(currentDate);
      if (Platform.OS === "android") {
        toggleDatePicker();
        setDateOfTrip(formatDate(currentDate));
      }
    } else {
      toggleDatePicker();
    }
  }

  function confirmIOSDate() {
    setDateOfTrip(formatDate(date));
    toggleDatePicker();
  }
  //Date
  ///round trip

  function toggleRoundTripDatePicker() {
    Keyboard.dismiss();
    setShowRoundTripPicker(!showRoundTripPicker);
  }
  function onRoundTripDateChange({ type }, selectedDate) {
    if (type === "set") {
      const currentDate = selectedDate;
      setRoundTripDate(currentDate);
      if (Platform.OS === "android") {
        toggleRoundTripDatePicker();
        setDateOfRoundTrip(formatDate(currentDate));
      }
    } else {
      toggleRoundTripDatePicker();
    }
  }

  function confirmIOSRoundTripDate() {
    setDateOfRoundTrip(formatDate(roundTripDate));
    toggleRoundTripDatePicker();
  }
  ///round trip
  function formatDate(rawDate, isYMD = false) {
    let date = new Date(rawDate);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;
    if (isYMD) {
      return `${year}-${month}-${day}`;
    }
    return `${day}-${month}-${year}`;
  }

  function onChangeTextHandler(type, enteredValue) {
    switch (type) {
      case "from":
        setDeparturePlace(enteredValue);
        break;
      case "to":
        setArrivalPlace(enteredValue);
        break;
    }
  }

  async function onSearchTripHandler() {
    console.log("from", departurePlace);
    console.log("to", arrivalPlace);
    console.log("date", date);
    if (!departurePlace || !arrivalPlace || !dateOfTrip || !selectedSeatText) {
      setWarningMessage("Some fields are empty. Please fill it.");
      setIsWarning((curr) => !curr);
      return;
    }
    if (isRoundTrip && !dateOfRoundTrip) {
      setWarningMessage(
        "Round trip option was selected. Please select round trip date"
      );
      setIsWarning((curr) => !curr);
      return;
    }
    if (
      convertVietnameseToNormal(departurePlace.trim()) ===
      convertVietnameseToNormal(arrivalPlace.trim())
    ) {
      setWarningMessage("Departure place and Arrival place must be different");
      setIsWarning((curr) => !curr);
      return;
    }
    console.log("startDate: ", date.toISOString().split("T")[0]);

    console.log("roundDate: ", formatDate(roundTripDate, true));

    console.log("departurePlaceObj: ", departurePlaceObj);
    console.log("arrivalPlaceObj: ", arrivalPlaceObj);

    navigation.navigate("SearchTripsScreen", {
      info: {
        from: departurePlaceObj.placeType === 1 ? departurePlace : null,
        to: arrivalPlaceObj.placeType === 1 ? arrivalPlace : null,
        isRoundTrip: isRoundTrip,
        departureTime: date.toISOString().split("T")[0],
        roundTripDate: isRoundTrip ? formatDate(roundTripDate, true) : null,
        numberOfSeats: selectedSeatText.charAt(0),
        startPlace: departurePlaceObj.placeType === 2 ? departurePlace : null,
        arrivalPlace: arrivalPlaceObj.placeType === 2 ? arrivalPlace : null,
        textStartPlace: departurePlace,
        textArrivalPlace: arrivalPlace,
      },
    });
  }
  function swapPlaceHandler() {
    const temp = departurePlace;
    const temp1 = departurePlaceObj;
    setDeparturePlace(arrivalPlace);
    setArrivalPlace(temp);
    setDeparturePlaceObj(arrivalPlaceObj);
    setArrivalPlaceObj(temp1);
  }
  function renderRouteItem(itemData) {
    function goTripDetail() {
      const departurePlaceObjTemp = baseLocations.find(
        (locations) =>
          locations.placeName.trim() === itemData.item.departurePlace.trim()
      );
      const arrivalPlaceObjTemp = baseLocations.find(
        (locations) =>
          locations.placeName.trim() === itemData.item.arrivalPlace.trim()
      );
      console.log("baseLocations", baseLocations);
      console.log("departurePlaceObjTemp", departurePlaceObjTemp);
      console.log("arrivalPlaceObjTemp", arrivalPlaceObjTemp);
      navigation.navigate("SearchTripsScreen", {
        info: {
          from:
            departurePlaceObjTemp.placeType === 1
              ? itemData.item.departurePlace
              : null,
          to:
            arrivalPlaceObjTemp.placeType === 1
              ? itemData.item.arrivalPlace
              : null,
          isRoundTrip: false,
          departureTime: null,
          roundTripDate: null,
          numberOfSeats: null,
          startPlace:
            departurePlaceObjTemp.placeType === 2
              ? itemData.item.departurePlace
              : null,
          arrivalPlace:
            arrivalPlaceObjTemp.placeType === 2
              ? itemData.item.arrivalPlace
              : null,
          textStartPlace: itemData.item.departurePlace,
          textArrivalPlace: itemData.item.arrivalPlace,
        },
      });
    }
    return <RouteItem route={itemData.item} onPress={goTripDetail} />;
  }

  function renderLocationItem(itemData) {
    function itemHandler() {
      if (pickPlaceOption === 0) {
        setDeparturePlace(itemData.item.placeName);
        setDeparturePlaceObj(itemData.item);
      } else {
        setArrivalPlace(itemData.item.placeName);
        setArrivalPlaceObj(itemData.item);
      }
      setIsShowSearchLocations((curr) => !curr);
    }
    return (
      <Pressable
        onPress={itemHandler}
        style={({ pressed }) => [
          pressed && { opacity: 0.6 },
          {
            gap: 2,
            marginBottom: 10,
            borderBottomWidth: 1,
            borderColor: "#e2dfdf",
            paddingBottom: 10,
          },
        ]}
      >
        <Text
          style={{
            fontSize: 15,
          }}
        >
          {itemData.item.parentName
            ? itemData.item.placeName + ` - ${itemData.item.parentName}`
            : itemData.item.placeName}
        </Text>
        <Text
          style={{
            fontSize: 13,
            opacity: 0.5,
          }}
        >
          All Pick Up Places in {itemData.item.placeName}
        </Text>
      </Pressable>
    );
  }
  function onChangeTextInSearchBox(enteredText) {
    const filter = baseLocations.filter(
      (item) =>
        convertVietnameseToNormal(item.placeName)
          .toLowerCase()
          .startsWith(convertVietnameseToNormal(enteredText.toLowerCase())) ||
        convertVietnameseToNormal(item.placeName)
          .toLowerCase()
          .includes(convertVietnameseToNormal(enteredText.toLowerCase()))
    );
    setLocations((curr) => [...filter]);
  }
  function onSearchBoxHandler(textInput) {
    const filter = baseLocations.filter(
      (item) =>
        convertVietnameseToNormal(item.placeName)
          .toLowerCase()
          .startsWith(convertVietnameseToNormal(textInput.toLowerCase())) ||
        convertVietnameseToNormal(item.placeName)
          .toLowerCase()
          .includes(convertVietnameseToNormal(textInput.toLowerCase()))
    );
    setLocations((curr) => [...filter]);
  }

  async function getMyLocation() {
    let { status } = await requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Warning",
        "Location Permission was denied. Please grant access in Settings"
      );
      return;
    }

    const location = await getCurrentPositionAsync();
    setMyPosition({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    const data = await getLocationInfo(
      location.coords.latitude,
      location.coords.longitude
    );
    console.log("get location", data);

    try {
      if (data.length !== 0) {
        const address = data[0].address.adminDistrict;
        if (address.includes("City")) {
          const stringArr = address.split(" ");

          let result = "";
          let finalResult = stringArr.reduce((accumulator, value, index) => {
            if (index !== stringArr.length - 1) {
              accumulator += value + " ";
            }
            return accumulator;
          }, result);

          finalResult = finalResult.trim();

          const filter = baseLocations.find((item) => {
            return convertVietnameseToNormal(item.placeName)
              .toLowerCase()
              .includes(convertVietnameseToNormal(finalResult.toLowerCase()));
          });
          console.log("filter:", filter);
          if (pickPlaceOption === 0) {
            if (filter) {
              setDeparturePlace(filter.placeName);
              setDeparturePlaceObj(filter);
            } else {
              setDeparturePlace("Thành phố " + finalResult);
              setDeparturePlaceObj({
                id: "myLocation",
                placeName: "Thành phố " + finalResult,
                parentName: "",
                placeType: 1,
              });
            }
          } else {
            if (filter) {
              setArrivalPlace(filter.placeName);
              setArrivalPlaceObj(filter);
            } else {
              setArrivalPlace("Thành phố " + finalResult);
              setArrivalPlaceObj({
                id: "myLocation",
                placeName: "Thành phố " + finalResult,
                parentName: "",
                placeType: 1,
              });
            }
          }
          setIsShowSearchLocations((curr) => !curr);
        } else {
          const address = data[0].address.adminDistrict;
          const finalResult = address.trim();

          const filter = baseLocations.find((item) => {
            return convertVietnameseToNormal(item.placeName)
              .toLowerCase()
              .includes(convertVietnameseToNormal(finalResult.toLowerCase()));
          });
          console.log("filter:", filter);
          if (pickPlaceOption === 0) {
            if (filter) {
              setDeparturePlace(filter.placeName);
              setDeparturePlaceObj(filter);
            } else {
              setDeparturePlace("Tỉnh " + finalResult);
              setDeparturePlaceObj({
                id: "myLocation",
                placeName: "Tỉnh " + finalResult,
                parentName: "",
                placeType: 1,
              });
            }
          } else {
            if (filter) {
              setArrivalPlace(filter.placeName);
              setArrivalPlaceObj(filter);
            } else {
              setArrivalPlace("Tỉnh " + finalResult);
              setArrivalPlaceObj({
                id: "myLocation",
                placeName: "Tỉnh " + finalResult,
                parentName: "",
                placeType: 1,
              });
            }
          }
          setIsShowSearchLocations((curr) => !curr);
        }
      } else {
        Alert.alert("Error", "Can't get your location");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Can't get your location");
    }
  }
  return (
    <>
      <PopUp
        type={"Warning"}
        isVisible={isTokenExpire}
        title={"Your session has been expired"}
        textBody={"Please login again!"}
        textBtn={"Ok"}
        callback={async () => {
          setIsTokenExpire((curr) => !curr);
          authCtx.logout();
        }}
      />
      <PopUp
        type={"Warning"}
        isVisible={isWarning}
        title={"Warning"}
        textBody={warningMessage}
        textBtn={"Ok"}
        callback={async () => {
          setIsWarning((curr) => !curr);
        }}
      />
      <Modal
        visible={isShowSearchLocations}
        backdropOpacity={0.7}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.subRoot}>
          <View
            style={{
              width: "100%",
              backgroundColor: "#e2dfdf",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              height: "90%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                justifyContent: "flex-start",
                borderBottomColor: "black",
                borderBottomWidth: 0.3,
                padding: 10,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                backgroundColor: GlobalColors.background,
              }}
            >
              <View
                style={{
                  width: "80%",
                  height: 40,
                }}
              >
                <SearchBox
                  onChangeTextFunc={onChangeTextInSearchBox}
                  searchFunc={onSearchBoxHandler}
                />
              </View>
              <FlatButton
                color={GlobalColors.button}
                onPress={() => setIsShowSearchLocations((curr) => !curr)}
              >
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>Cancel</Text>
              </FlatButton>
            </View>
            <View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  padding: 10,
                  borderBottomWidth: 10,
                  borderColor: "#e2dfdf",
                  backgroundColor: "white",
                }}
              >
                <Pressable
                  style={({ pressed }) => [
                    pressed && { opacity: 0.6 },
                    { flexDirection: "row", alignItems: "center", gap: 10 },
                  ]}
                  onPress={getMyLocation}
                >
                  <MaterialCommunityIcons
                    name="crosshairs-gps"
                    size={24}
                    color={GlobalColors.price}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      color: GlobalColors.price,
                      fontWeight: "600",
                    }}
                  >
                    Your current location
                  </Text>
                </Pressable>
              </View>

              {locations && locations.length !== 0 && (
                <View
                  style={{
                    backgroundColor: "white",
                    padding: 10,
                    maxHeight: "87%",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      opacity: 0.5,
                      marginBottom: 10,
                    }}
                  >
                    Popular locations
                  </Text>
                  <FlatList
                    data={locations}
                    keyExtractor={(item, index) => index}
                    showsVerticalScrollIndicator={false}
                    renderItem={renderLocationItem}
                  />
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>
      <View style={[styles.root, isSelectSeat && { opacity: 0.5 }]}>
        <Image
          style={styles.image}
          source={require("../../../assets/coachBackground.png")}
        />
        <View style={styles.imageContainer}></View>
        <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
          <View style={styles.secondContainer}>
            <View style={styles.headerContainer}>
              <View>
                <Text style={styles.text}>Faster</Text>
                <Text style={styles.subText}>Book a trip now</Text>
              </View>
              <View style={styles.iconContainer}>
                <IconButton
                  icon={"ios-notifications-outline"}
                  color={"white"}
                  size={25}
                />
              </View>
            </View>

            <View style={styles.searchBox}>
              <View style={styles.inputContainer}>
                <View style={styles.iconInputContainer}>
                  <Ionicons name="bus" size={20} color="black" />
                  <Image
                    style={styles.imageIcon}
                    source={require("../../../icon/walk.png")}
                  />
                </View>
                <TextInput
                  onPressIn={() => {
                    setPickPlaceOption(0);
                    setIsShowSearchLocations((curr) => !curr);
                  }}
                  onChangeText={onChangeTextHandler.bind(this, "from")}
                  style={styles.textInput}
                  placeholder="from"
                  value={departurePlace}
                  autoCorrect={false}
                  editable={false}
                />
              </View>
              <View
                style={{
                  height: 38,
                  width: 38,
                  borderWidth: 0.5,
                  borderColor: "black",
                  borderRadius: 38,
                  alignSelf: "flex-end",
                  marginVertical: -28,
                  marginRight: 10,
                  paddingRight: 2,
                  paddingBottom: 2,
                  backgroundColor: "#0e95ef",
                  zIndex: 1000,
                }}
              >
                <IconButton
                  onPress={swapPlaceHandler}
                  icon={"swap-vertical"}
                  size={28}
                  color={"white"}
                />
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.iconInputContainer}>
                  <Ionicons name="bus" size={20} color="black" />
                  <Image
                    style={styles.imageIcon}
                    source={require("../../../icon/walking.png")}
                  />
                </View>
                <TextInput
                  onPressIn={() => {
                    setPickPlaceOption(1);
                    setIsShowSearchLocations((curr) => !curr);
                  }}
                  onChangeText={onChangeTextHandler.bind(this, "to")}
                  style={styles.textInput}
                  placeholder="to"
                  value={arrivalPlace}
                  autoCorrect={false}
                  editable={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <View
                  style={[
                    styles.iconInputContainer,
                    { paddingRight: 15, paddingLeft: 15 },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="calendar-arrow-right"
                    size={24}
                    color="black"
                  />
                </View>
                <View
                  style={{
                    width: "80%",
                    justifyContent: "center",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Pressable
                    style={{ paddingTop: 2 }}
                    onPress={toggleDatePicker}
                  >
                    <TextInput
                      style={[styles.textInput, { width: "100%" }]}
                      placeholder="Departure Time"
                      editable={false}
                      value={dateOfTrip}
                      onPressIn={toggleDatePicker}
                    />
                  </Pressable>
                  <View
                    style={{
                      alignItems: "flex-end",
                    }}
                  >
                    <Text
                      style={{
                        opacity: 0.4,
                        fontSize: 12,
                        marginBottom: 2,
                      }}
                    >
                      Round Trip?
                    </Text>
                    <Switch
                      trackColor={{ false: "purple", true: "#2877df" }}
                      value={isRoundTrip}
                      onValueChange={() => {
                        setIsRoundTrip((curr) => !curr);
                        setDateOfRoundTrip("");
                      }}
                    />
                  </View>
                </View>
              </View>
              {isRoundTrip && (
                <View style={styles.inputContainer}>
                  <View
                    style={[
                      styles.iconInputContainer,
                      { paddingRight: 15, paddingLeft: 15 },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="calendar-arrow-left"
                      size={24}
                      color="black"
                    />
                  </View>
                  <Pressable
                    style={{ paddingTop: 2 }}
                    onPress={toggleRoundTripDatePicker}
                  >
                    <TextInput
                      style={[styles.textInput, { width: "100%" }]}
                      placeholder="Round Time"
                      editable={false}
                      value={dateOfRoundTrip}
                      onPressIn={toggleRoundTripDatePicker}
                    />
                  </Pressable>
                </View>
              )}

              {/* Date */}
              {showPicker && (
                <DateTimePicker
                  mode="date"
                  display="spinner"
                  value={date}
                  onChange={onDateChange}
                  style={styles.datePicker}
                  minimumDate={new Date()}
                />
              )}
              {showPicker && Platform.OS === "ios" && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  <TouchableOpacity
                    onPress={toggleDatePicker}
                    style={[
                      styles.dateButton,
                      styles.pickerButton,
                      { backgroundColor: "#11182711" },
                    ]}
                  >
                    <Text style={[styles.buttonDateText, { color: "#075985" }]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={confirmIOSDate}
                    style={[styles.dateButton, styles.pickerButton]}
                  >
                    <Text style={[styles.buttonDateText]}>Confirm</Text>
                  </TouchableOpacity>
                </View>
              )}
              {/* Date */}

              {/* RoundTrip Date */}

              {showRoundTripPicker && (
                <DateTimePicker
                  mode="date"
                  display="spinner"
                  value={roundTripDate}
                  onChange={onRoundTripDateChange}
                  style={styles.datePicker}
                  minimumDate={
                    new Date(
                      date.getFullYear(),
                      date.getMonth(),
                      date.getDate() + 1
                    )
                  }
                />
              )}
              {showRoundTripPicker && Platform.OS === "ios" && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  <TouchableOpacity
                    onPress={toggleRoundTripDatePicker}
                    style={[
                      styles.dateButton,
                      styles.pickerButton,
                      { backgroundColor: "#11182711" },
                    ]}
                  >
                    <Text style={[styles.buttonDateText, { color: "#075985" }]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={confirmIOSRoundTripDate}
                    style={[styles.dateButton, styles.pickerButton]}
                  >
                    <Text style={[styles.buttonDateText]}>Confirm</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* RoundTrip Date */}

              <View style={styles.inputContainer}>
                <View
                  style={[
                    styles.iconInputContainer,
                    { paddingRight: 15, paddingLeft: 15 },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="seat-recline-normal"
                    size={24}
                    color="black"
                  />
                </View>
                <Pressable
                  onPress={() => {
                    console.log("press", isSelectSeat);
                    setIsSelectSeat((curr) => !curr);
                  }}
                  style={{
                    paddingHorizontal: 2,
                    paddingLeft: 5,
                    paddingVertical: 5,
                    width: "80%",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                    }}
                  >
                    {selectedSeatText}
                  </Text>
                </Pressable>
              </View>

              <Modal
                visible={isSelectSeat}
                transparent={true}
                animationType="slide"
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                ></View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <View style={styles.modal}>
                    <View
                      style={{
                        zIndex: 20000,
                      }}
                    >
                      <SelectList
                        setSelected={(val) => {
                          setSelectedSeat(val);
                        }}
                        data={data}
                        save="value"
                        search={false}
                        defaultOption={data[0]}
                        inputStyles={{ fontSize: 20 }}
                        dropdownStyles={{
                          width: "100%",
                          backgroundColor: "white",
                          zIndex: 10000,
                          height: 80,
                          borderWidth: 0,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        dropdownItemStyles={{
                          borderBottomWidth: 0.2,
                          borderColor: "gray",
                          opacity: 0.5,
                          alignItems: "center",
                          justifyContent: "center",
                          width: "100%",
                        }}
                        boxStyles={{
                          width: "100%",
                          borderWidth: 0,
                          paddingTop: 25,
                          marginBottom: 0,
                          paddingBottom: 0,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      />
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 10,
                        gap: 50,
                        paddingHorizontal: 20,
                        position: "absolute",
                        bottom: 30,
                        right: 0,
                        left: 0,
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <CustomButton
                          color={"#726a6a70"}
                          onPress={() => setIsSelectSeat(false)}
                        >
                          {" "}
                          Cancel
                        </CustomButton>
                      </View>
                      <View style={{ flex: 1 }}>
                        <CustomButton
                          color={GlobalColors.validate}
                          onPress={() => {
                            console.log(selectedSeat);
                            if (selectedSeat === "1") {
                              setSelectedSeatText(selectedSeat + " seat");
                            } else {
                              setSelectedSeatText(selectedSeat);
                            }
                            setIsSelectSeat(false);
                          }}
                        >
                          Submit
                        </CustomButton>
                      </View>
                    </View>
                  </View>
                </View>
              </Modal>
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  pressed && styles.pressed,
                  ,
                ]}
                onPress={onSearchTripHandler}
              >
                <View>
                  <Text style={styles.buttonText}>Search Trip</Text>
                </View>
              </Pressable>
            </View>

            <View style={styles.routeList}>
              <Text style={styles.listTitle}> Popular Routes</Text>
              <FlatList
                horizontal
                data={popularRoutes}
                keyExtractor={(item, index) => item.id}
                renderItem={renderRouteItem}
                showsHorizontalScrollIndicator={false}
              />
            </View>
            <View style={styles.routeList}>
              <Text style={styles.listTitle}> Recent Searches</Text>
              <FlatList
                horizontal
                keyExtractor={(item, index) => item.id}
                data={recentSearchRoutes}
                renderItem={renderRouteItem}
                showsHorizontalScrollIndicator={false}
              />
            </View>
            <View style={styles.routeList}>
              <Text style={styles.listTitle}> Suggest For You</Text>
              <FlatList
                horizontal
                keyExtractor={(item, index) => item.id}
                data={suggestRoutes}
                renderItem={renderRouteItem}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

export default HomeScreen;
const styles = StyleSheet.create({
  root: {
    flex: 1,
    marginBottom: 55,
  },
  subRoot: {
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: "'rgba(0,0,0,0.5)'",
    borderRadius: 30,
    width: 350,
    zIndex: 1,
    width: "100%",
    flex: 1,
  },
  image: {
    width: "100%",
    height: 250,
    position: "absolute",
  },
  imageContainer: {
    width: "100%",
    height: 250,
    position: "absolute",
    backgroundColor: "#948e8f",
    opacity: 0.4,
  },
  secondContainer: {
    width: "100%",
    paddingLeft: 20,
    marginTop: 50,
    justifyContent: "space-around",
  },
  text: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
  },
  subText: {
    color: "#0bf129",
    fontSize: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconContainer: {
    marginRight: 10,
    width: 36,
    height: 36,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: "#d9c9d9",
    paddingRight: 2,
  },

  iconInputContainer: {
    paddingRight: 5,
    borderRightWidth: 1,
    borderRightColor: "gray",
    flexDirection: "row",
    padding: 10,
  },
  inputContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    padding: 5,
  },
  imageIcon: {
    width: 20,
    height: 20,
  },
  searchBox: {
    marginTop: 50,
    padding: 20,
    justifyContent: "center",
    marginRight: 30,
    marginLeft: 10,
    gap: 20,
    elevation: 2,
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
  },
  textInput: {
    padding: 10,
    fontSize: 16,
    width: "80%",
  },
  button: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    elevation: 2,
    shadowColor: "black",
    backgroundColor: GlobalColors.validate,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  pressed: {
    opacity: 0.7,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  listTitle: {
    fontSize: 20,
    color: "black",
    marginVertical: 10,
    fontWeight: "bold",
  },
  routeList: {
    zIndex: 1000,
  },
  datePicker: {
    height: 120,
    marginTop: -10,
  },
  dateButton: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    marginTop: 10,
    marginBottom: 15,
    backgroundColor: GlobalColors.button,
  },
  buttonDateText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
  },
  pickerButton: {
    paddingHorizontal: 20,
  },
  modal: {
    height: 150,
    marginTop: 20,
    backgroundColor: "white",
    width: "100%",
    borderTopColor: "#f7f1f1e7",
    borderTopWidth: 2,
    shadowColor: "black",
  },
});
