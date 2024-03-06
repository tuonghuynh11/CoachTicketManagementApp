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
  Platform,
  FlatList,
  ActivityIndicator
} from "react-native";
import React, { useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import PlaceCard from "./PlaceCard";
import ModalSuccess from "./Popup/ModalSuccess";
import ModalFail from "./Popup/ModalFail";
import ModalConfirm from "./Popup/ModalConfirm";
import { getAllStaffs } from "../../util/staffService";
import { useIsFocused } from "@react-navigation/native";
import { getAllRoutesId } from "../../util/routeService";
import { getAllCoaches } from "../../util/coachService";
import {
  getAllDistrict,
  getAllProvince,
  getAllWard,
} from "../../util/locationService";
import ShuttleCard from "./ShuttleCard";
import { getLocation } from "../../util/bingMapService";
import { createSchedule, updateSchedule } from "../../util/scheduleService";
import i18next from "../../Services/i18next";
import { useTranslation } from "react-i18next";

DropDownPicker.setListMode("SCROLLVIEW");

export default function EditSchedule({ navigation, route }) {
  const { t } = useTranslation();

  const pressHandler = () => {
    navigation.goBack();
  };

  const { id, RouteData, StartPlaceData, ArrivalPlaceData, gate, status, departureTime, arrivalTime, CoachData, price, ShuttleRoutesData } = route.params;
  //console.log(id);
  
  const contentC = t("are-you-sure-to-delete");
  const [visibleC, setVisibleC] = useState(false);
  const showC = () => {
    setVisibleC(true);
  };
  const hideC = () => {
    setVisibleC(false);
  };
  const [itemid, setItemid] = useState();
  const confirm = () => {
    const updatedArray = shuttlePlace.filter((item) => item.id !== itemid);
    setShuttlePlace(updatedArray);
    hideC();
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

  const contentS = t("edit-schedule-success");
  const contentF = t("edit-schedule-fail");

  const isFocused = useIsFocused();

  const [staffList, setStaffList] = useState([]);
  const [staffListData, setStaffListData] = useState([]);

  const fetchStaffs = async () => {
    if (isFocused) {
      try {
        setIndicator(true);
        const data = await getAllStaffs();
        setStaffList(
          data.data.rows
            .filter((item) => item.status == true && item.positionId == 2)
            .map(({ fullName, id }) => ({ label: fullName, value: id }))
        );
        setStaffListData(
          data.data.rows
            .filter((item) => item.status == true && item.positionId == 3)
            .map(({ fullName, id }) => ({ label: fullName, value: id }))
        );
        setIndicator(false);
      } catch (error) {
        // Handle error, e.g., redirect to login if unauthorized
        console.error("Error fetching staffs:", error);
      }
    }
  };

  useEffect(() => {
    fetchStaffs();
  }, [isFocused]);

  const [routeListData, setRouteListData] = useState([]);
  const [routeListDataDes, setRouteListDataDes] = useState([]);
  const [ward, setWard] = useState([]);

  const fetchSchedules = async () => {
    if (isFocused) {
      try {
        setIndicator(true);
        const data = await getAllRoutesId(RouteData.id);
        setRouteListData(
          data.data.rows[0].PlacesData.startPlaces.map(({ placeName, id }) => ({
            label: placeName,
            value: id,
          }))
        );
        //setWard(data.data.rows[0].PlacesData.startPlaces.map(({placeName}) => ({label: placeName.split(', ')[1], value: placeName.split(', ')[1]})));
        setRouteListDataDes(
          data.data.rows[0].PlacesData.arrivalPlaces.map(
            ({ placeName, id }) => ({ label: placeName, value: id })
          )
        );
        setIndicator(false);
      } catch (error) {
        // Handle error, e.g., redirect to login if unauthorized
        console.error("Error fetching routes:", error);
      }
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [isFocused]);

  const [coachListData, setCoachListData] = useState([]);

  const fetchCoach = async () => {
    if (isFocused) {
      try {
        setIndicator(true);
        const data = await getAllCoaches();
        setCoachListData(
          data.data.rows
            .filter((item) => item.status == false)
            .map(({ coachNumber, id }) => ({ label: coachNumber, value: id }))
        );
        setIndicator(false);
      } catch (error) {
        // Handle error, e.g., redirect to login if unauthorized
        console.error("Error fetching coach:", error);
      }
    }
  };

  useEffect(() => {
    fetchCoach();
  }, [isFocused]);

  const [idPro, setIdpro] = useState("");

  const fetchProvince = async (name) => {
    try {
      const data = await getAllProvince();
      return data.results.find((item) => item.province_name === name)
        .province_id;
    } catch (error) {
      // Handle error, e.g., redirect to login if unauthorized
      console.error("Error fetching coach:", error);
    }
  };

  const fetchDistrict = async (id, name) => {
    try {
      const data = await getAllDistrict(id);
      return data.results.find((item) => item.district_name === name)
        .district_id;
    } catch (error) {
      // Handle error, e.g., redirect to login if unauthorized
      console.error("Error fetching coach:", error);
    }
  };

  const fetchWard = async (id) => {
    try {
      const data = await getAllWard(id);
      return data.results.map(({ ward_name }) => ({
        value: ward_name,
        label: ward_name,
      }));
    } catch (error) {
      // Handle error, e.g., redirect to login if unauthorized
      console.error("Error fetching coach:", error);
    }
  };

  const wardPress = async () => {
    if (currentValueFrom != "") {
      const placeName = routeListData.find(
        (item) => item.value == currentValueFrom
      ).label;
      const placeArray = placeName.split(", ");
      console.log(placeArray);
      setIndicator(true);
      const proid = await fetchProvince(placeArray[3]);

      const disid = await fetchDistrict(proid, placeArray[2]);

      const result2 = await fetchWard(disid);

      setWard(result2);
      setIndicator(false);
    }
  };

  const [isOpenDriver, setIsOpenDriver] = useState(false);
  const [currentValueDriver, setCurrentValueDriver] = useState("");
  const itemsDriver = staffListData
    .filter((item) => item.status == true && item.positionId == 2)
    .map(({ fullName, id }) => ({ label: fullName, value: id }));
  // const itemDrive = itemsDriver.find(item => item.value = 15);
  const [isOpenDriverShuttle, setIsOpenDriverShuttle] = useState(false);
  const [currentValueDriverShuttle, setCurrentValueDriverShuttle] =
    useState("");

  const [isOpenAssist, setIsOpenAssist] = useState(false);
  const [currentValueAssist, setCurrentValueAssist] = useState("");
  const itemsAssist = staffListData
    .filter((item) => item.status == true && item.positionId == 3)
    .map(({ fullName, id }) => ({ label: fullName, value: id }));

  const [isOpenAssistShuttle, setIsOpenAssistShuttle] = useState(false);
  const [currentValueAssistShuttle, setCurrentValueAssistShuttle] =
    useState("");

  const [isOpenFrom, setIsOpenFrom] = useState(false);
  const [currentValueFrom, setCurrentValueFrom] = useState(StartPlaceData.id);
  //console.log(routeListData)
  //const itemsFrom = [];
  const itemsFrom = [];
  //console.log(routeListData);
  //;

  const [isOpenTo, setIsOpenTo] = useState(false);
  const [currentValueTo, setCurrentValueTo] = useState(ArrivalPlaceData.id);
  const itemsTo = [];

  const [isOpenGate, setIsOpenGate] = useState(false);
  const [currentValueGate, setCurrentValueGate] = useState(gate.toString());
  const itemsGate = [
    { label: t("gate-1"), value: "1" },
    { label: t("gate-2"), value: "2" },
    { label: t("gate-3"), value: "3" },
  ];

  const [isOpenType, setIsOpenType] = useState(false);
  const [currentValueCoach, setCurrentValueCoach] = useState(CoachData.id);
  const itemsCoach = [];
  const [isOpenTypeShuttle, setIsOpenTypeShuttle] = useState(false);
  const [currentValueCoachShuttle, setCurrentValueCoachShuttle] = useState("");

  const [isOpenStatus, setIsOpenStatus] = useState(false);
  const [currentValueStatus, setCurrentValueStatus] = useState(status);
  const itemsStatus = [
    { label: t("unready"), value: "0" },
    { label: t("ready"), value: "1" },
    { label: t("arriving"), value: "2" },
    { label: t("finish"), value: "3" },
  ];

  const [validatePrice, setValidatePrice] = useState(true);
  const [price2, setPrice] = useState(price);
  const priceHandler = (val) => {
    setPrice(val);
    if (parseInt(val) < 150000) setValidatePrice(false);
    else setValidatePrice(true);
  };

  const [validatePlace, setValidatePlace] = useState(true);
  const [place, setPlace] = useState("");
  const placeHandler = (val) => {
    setPlace(val);
    setValidatePlace(true);
  };

  const [isOpenWard, setIsOpenWard] = useState(false);
  const [currentValueWard, setCurrentValueWard] = useState("");

  const [validateDriver, setValidateDriver] = useState(true);
  const [validateDriverShuttle, setValidateDriverShuttle] = useState(true);
  const [validateAssistant, setValidateAssistant] = useState(true);
  const [validateAssistantShuttle, setValidateAssistantShuttle] =
    useState(true);
  const [validateFrom, setValidateFrom] = useState(true);
  const [validateTo, setValidateTo] = useState(true);
  const [validateCoach, setValidateCoach] = useState(true);
  const [validateCoachShuttle, setValidateCoachShuttle] = useState(true);
  const [validateCoachStatus, setValidateCoachStatus] = useState(true);
  const [validateGate, setValidateGate] = useState(true);
  const [validateWard, setValidateWard] = useState(true);

  const fecthLocation = async (location) => {
    try {
      //console.log(location);
      const data = await getLocation(location);
      // console.log(
      //   data.resourceSets[0].resources[0].geocodePoints[0].coordinates
      // );

      return data.resourceSets[0].resources[0].geocodePoints[0].coordinates;
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  const addHandler = async () => {
    if (currentValueWard == "") {
      setValidateWard(false);
    } else {
      setValidateWard(true);
    }
    if (place == "") {
      setValidatePlace(false);
    } else {
      setValidatePlace(true);
    }
    if (currentValueCoachShuttle == "") {
      setValidateCoachShuttle(false);
    } else {
      setValidateCoachShuttle(true);
    }
    if (currentValueDriverShuttle == "") {
      setValidateDriverShuttle(false);
    } else {
      setValidateDriverShuttle(true);
    }
    if (currentValueAssistShuttle == "") {
      setValidateAssistantShuttle(false);
    } else {
      setValidateAssistantShuttle(true);
    }
    if (ShuttleDate == "") {
      setValidateShuttleDate(false);
    } else {
      setValidateShuttleDate(true);
    }
    if(ShuttleTime == ""){
      setValidateShuttleTime(false);
    } else {
      setValidateShuttleTime(true);
    }
    if (
      currentValueCoachShuttle != "" &&
      currentValueAssistShuttle != "" &&
      currentValueDriverShuttle != "" &&
      currentValueWard != "" &&
      place != "" &&
      ShuttleDate != "" &&
      ShuttleTime != ""
    ) {
      if (currentValueFrom != "") {
        setIndicator(true);
        const index = shuttlePlace.length + 1;
        const placeName = routeListData.find(
          (item) => item.value == currentValueFrom
        ).label;
        const placeArray = placeName.split(", ");
        const location =
          place +
          ", " +
          currentValueWard +
          ", " +
          placeArray[2] +
          ", " +
          placeArray[3];

        const res = await fecthLocation(location);

        const date1DatePart = ShuttleDateData.toISOString().split("T")[0];
        ShuttleTimeData.setHours(ShuttleTimeData.getHours() + 7);

        const date2TimePart = ShuttleTimeData.toISOString().split("T")[1];

        const combinedDate = new Date(`${date1DatePart}T${date2TimePart}`);
        ShuttleTimeData.setHours(ShuttleTimeData.getHours() - 7);

        const newShuttle = {
          id: index,
          lat: res[0],
          lng: res[1],
          place: location,
          coachId: currentValueCoachShuttle,
          driverId: currentValueDriverShuttle,
          coachAssistantId: currentValueAssistShuttle,
          shuttleDate: combinedDate
        };
        setShuttlePlace([newShuttle, ...shuttlePlace]);
        setIndicator(false);
      }
    }
  };

  const saveHadler = async () => {
    if (parseInt(price2) < 150000 || price2 == "") {
      setValidatePrice(false);
    } else {
      setValidatePrice(true);
    }
    if (ArrDate == "") {
      setValidateArrDate(false);
    } else {
      setValidateArrDate(true);
    }
    if (DepDate == "") {
      setValidateDepDate(false);
    } else {
      setValidateDepDate(true);
    }
    if (currentValueDriver == "") {
      setValidateDriver(false);
    } else {
      setValidateDriver(true);
    }
    if (currentValueAssist == "") {
      setValidateAssistant(false);
    } else {
      setValidateAssistant(true);
    }
    if (currentValueFrom == "") {
      setValidateFrom(false);
    } else {
      setValidateFrom(true);
    }
    if (currentValueTo == "") {
      setValidateTo(false);
    } else {
      setValidateTo(true);
    }
    if (currentValueCoach == "") {
      setValidateCoach(false);
    } else {
      setValidateCoach(true);
    }
    if (currentValueStatus == "") {
      setValidateCoachStatus(false);
    } else {
      setValidateCoachStatus(true);
    }
    if (currentValueGate == "") {
      setValidateGate(false);
    } else {
      setValidateGate(true);
    }
    if (ArrTime == "") {
      setValidateArrTime(false);
    } else {
      setValidateArrTime(true);
    }
    if (DepTime == "") {
      setValidateDepTime(false);
    } else {
      setValidateDepTime(true);
    }

    if (
      price2 != "" &&
      parseInt(price2) >= 150000 &&
      ArrDate != "" &&
      DepDate != "" &&
      currentValueDriver != "" &&
      currentValueAssist != "" &&
      currentValueFrom != "" &&
      currentValueTo != "" &&
      currentValueCoach != "" &&
      currentValueStatus != "" &&
      currentValueGate != "" &&
      ArrTime != "" &&
      DepTime != ""
    ) {
      try {
        setIndicator(true);
        const shuttles = shuttlePlace.map(
          ({ coachAssistantId, driverId, coachId, place, lng, lat, shuttleDate}) => ({
            coachId: coachId,
            driverId: driverId,
            coachAssistantId: coachAssistantId,
            departurePlace: place,
            departurePlaceLat: lat,
            departurePlaceLng: lng,
            departureTime: shuttleDate
          })
        );

        const date1DatePart = DepDateData.toISOString().split("T")[0];
        DepTimeData.setHours(DepTimeData.getHours() + 7);

        const date2TimePart = DepTimeData.toISOString().split("T")[1];

        const combinedDate = new Date(`${date1DatePart}T${date2TimePart}`);
        DepTimeData.setHours(DepTimeData.getHours() - 7);

        const date1ArrDatePart = ArrDateData.toISOString().split("T")[0];
        ArrTimeData.setHours(ArrTimeData.getHours() + 7);

        const date2ArrTimePart = ArrTimeData.toISOString().split("T")[1];

        const combinedArrDate = new Date(`${date1ArrDatePart}T${date2ArrTimePart}`);
        ArrTimeData.setHours(ArrTimeData.getHours() - 7);
        
        const data = {
          shuttleInfo: shuttles,
          coachId: currentValueCoach,
          routeId: RouteData.id,
          driverId: currentValueDriver,
          coachAssistantId: currentValueAssist,
          startPlace: currentValueFrom,
          arrivalPlace: currentValueTo,
          price: parseInt(price2),
          gate: parseInt(currentValueGate),
          departureTime: combinedDate,
          arrivalTime: combinedArrDate,
          status: parseInt(currentValueStatus)
        };
        // console.log(data);
        // console.log(id);
        const updatedSchedule = await updateSchedule(parseInt(id), data);
        
        console.log(updatedSchedule);
        setIndicator(false);
        showSuccess();
      } catch (error) {
        console.log(error);
        showFail();
      }
    }
  };

  const arrival = new Date(arrivalTime)
  const [validateArrDate, setValidateArrDate] = useState(true);
  const [ArrDate, setArrDate] = useState(arrival.toLocaleDateString());
  const ArrDateHandler = (val) => {
    setArrDate(val);
    setValidateArrDate(true);
  };
  const [validateArrTime, setValidateArrTime] = useState(true);
  const [ArrTime, setArrTime] = useState(arrival.toLocaleTimeString());
  const ArrTimeHandler = (val) => {
    setArrTime(val);
    setValidateArrTime(true);
  };

  const departure = new Date(departureTime);
  const [validateDepDate, setValidateDepDate] = useState(true);
  const [DepDate, setDepDate] = useState(departure.toLocaleDateString());
  const DepDateHandler = (val) => {
    setDepDate(val);
    setValidateDepDate(true);
  };
  const [validateDepTime, setValidateDepTime] = useState(true);
  const [DepTime, setDepTime] = useState(departure.toLocaleTimeString());
  const DepTimeHandler = (val) => {
    setDepTime(val);
    setValidateDepTime(true);
  };

  const [validateShuttleDate, setValidateShuttleDate] = useState(true);
  const [ShuttleDate, setShuttleDate] = useState("");
  const ShuttleDateHandler = (val) => {
    setShuttleDate(val);
    setValidateShuttleDate(true);
  };
  const [validateShuttleTime, setValidateShuttleTime] = useState(true);
  const [ShuttleTime, setShuttleTime] = useState("");
  const ShuttleTimeHandler = (val) => {
    setShuttleTime(val);
    setValidateShuttleTime(true);
  };

  const [DepDateData, setDepDateData] = useState(new Date(departureTime));
  const [ArrDateData, setArrDateData] = useState(new Date(arrivalTime));
  const [ShuttleDateData, setShuttleDateData] = useState(new Date());
  const [DepTimeData, setDepTimeData] = useState(new Date(departureTime));
  const [ArrTimeData, setArrTimeData] = useState(new Date(arrivalTime));
  const [ShuttleTimeData, setShuttleTimeData] = useState(new Date());

  const [date, setDate] = useState(new Date());
  const [openPicker, setOpenPicker] = useState(false);
  const toggleDatepicker = () => {
    if (mode == "time") {
      setMode("date");
    }
    setOpenPicker(!openPicker);
  };
  const onChange = ({ type }, selectedDate) => {
    toggleDatepicker();
    if (type == "set") {
      const currentDate = selectedDate;
      setDate(currentDate);
      if (Platform.OS === "android") {
        setDepDateData(currentDate);
        setDepDate(currentDate.toLocaleDateString());
      }
    } else {
      toggleDatepicker();
    }
  };
  const [time, setTime] = useState(new Date());
  const [openPickerTime, setOpenPickerTime] = useState(false);
  const toggleTimepicker = () => {
    if (modeTime == "date") {
      setModeTime("time");
    }
    setOpenPickerTime(!openPickerTime);
  };
  const onChangeTime = ({ type }, selectedDate) => {
    toggleTimepicker();
    if (type == "set") {
      const currentDate = selectedDate;
      setTime(currentDate);
      if (Platform.OS === "android") {
        setDepTimeData(currentDate);
        setDepTime(currentDate.toLocaleTimeString());
      }
    } else {
      toggleTimepicker();
    }
  };

  const [dateShuttle, setDateShuttle] = useState(new Date());
  const [openPickerShuttle, setOpenPickerShuttle] = useState(false);
  const toggleDatepickerShuttle = () => {
    if (modeShuttle == "time") {
      setModeShuttle("date");
    } 
    setOpenPickerShuttle(!openPickerShuttle);
  };
  const onChangeShuttle = ({ type }, selectedDate) => {
    toggleDatepickerShuttle();
    if (type == "set") {
      const currentDate = selectedDate;
      setDateShuttle(currentDate);
      if (Platform.OS === "android") {
        setShuttleDateData(currentDate);
        setShuttleDate(currentDate.toLocaleDateString());
      }
    } else {
      toggleDatepickerShuttle();
    }
  };
  const [timeShuttle, setTimeShuttle] = useState(new Date());
  const [openPickerShuttleTime, setOpenPickerShuttleTime] = useState(false);
  const toggleTimepickerShuttle = () => {
    if (modeShuttleTime == "date") {
      setModeShuttleTime("time");
    } 
    setOpenPickerShuttleTime(!openPickerShuttleTime);
  };
  const onChangeShuttleTime = ({ type }, selectedDate) => {
    toggleTimepickerShuttle();
    if (type == "set") {
      const currentDate = selectedDate;
      setTimeShuttle(currentDate);
      if (Platform.OS === "android") {
        setShuttleTimeData(currentDate);
        setShuttleTime(currentDate.toLocaleTimeString());
      }
    } else {
      toggleTimepickerShuttle();
    }
  };

  const [dateArr, setDateArr] = useState(new Date());
  const [openPickerArr, setOpenPickerArr] = useState(false);
  const toggleDatepickerArr = () => {
    if (modeArr == "time") {
      setModeArr("date");
    } 
    setOpenPickerArr(!openPickerArr);
  };
  const onChangeArr = ({ type }, selectedDate) => {
    toggleDatepickerArr();
    if (type == "set") {
      const currentDate = selectedDate;
      setDateArr(currentDate);
      if (Platform.OS === "android") {
        setArrDateData(currentDate);

        setArrDate(currentDate.toLocaleDateString());
      }
    } else {
      toggleDatepickerArr();
    }
  };
  const [timeArr, setTimeArr] = useState(new Date());
  const [openPickerArrTime, setOpenPickerArrTime] = useState(false);
  const toggleTimepickerArr = () => {
    if (modeArrTime == "date") {
      setModeArrTime("time");
    } 
    setOpenPickerArrTime(!openPickerArrTime);
  };
  const onChangeArrTime = ({ type }, selectedDate) => {
    toggleTimepickerArr();
    if (type == "set") {
      const currentDate = selectedDate;
      setTimeArr(currentDate);
      if (Platform.OS === "android") {
        setArrTimeData(currentDate);

        setArrTime(currentDate.toLocaleTimeString());
      }
    } else {
      toggleTimepickerArr();
    }
  };

  const [mode, setMode] = useState("time");
  const [modeArr, setModeArr] = useState("time");
  const [modeShuttle, setModeShuttle] = useState("time");

  const [modeTime, setModeTime] = useState("time");
  const [modeArrTime, setModeArrTime] = useState("time");
  const [modeShuttleTime, setModeShuttleTime] = useState("time");

  const reloadHandler = () => {
    setPrice("");
    setArrDate("");
    setDepDate("");
    setPlace("");
    setShuttlePlace([]);
  };

  let index = 0;

  const test = ShuttleRoutesData.map(({departureTime, departurePlace, departurePlaceLat, departurePlaceLng, ShuttleData}) => ({id: index++, lat: departurePlaceLat, lng: departurePlaceLng,place: departurePlace, shuttleDate: departureTime, coachId: ShuttleData.coachId, coachAssistantId: ShuttleData.coachAssistantId, driverId: ShuttleData.driverId}))
  
  const [shuttlePlace, setShuttlePlace] = useState(test);
  const [indicator, setIndicator] = useState(false);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
      <ActivityIndicator style={styles.indicator} size={"large"} animating={indicator}/>
        <ModalSuccess
          visible={visibleSuccess}
          hide={hideSuccess}
          content={contentS}
        />
        <ModalFail visible={visibleFail} hide={hideFail} content={contentF} />
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
          <Text style={styles.headerText}>{t("edit-schedule")}</Text>
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
          decelerationRate={"fast"}
        >
          <Text style={styles.titleText}>{t("driver-coach-assistant")}</Text>
          <View>
            <Text style={styles.textLabel}>Driver</Text>
            <View style={styles.dropDownStyle}>
              <DropDownPicker
                items={staffList}
                open={isOpenDriver}
                setOpen={() => setIsOpenDriver(!isOpenDriver)}
                value={currentValueDriver}
                setValue={(val) => setCurrentValueDriver(val)}
                maxHeight={150}
                autoScroll
                placeholder={t("select-driver")}
                showTickIcon={true}
                style={styles.startDropDown}
                nestedScrollEnabled={true}
              />
            </View>
            {!validateDriver && (
              <Text style={styles.validateText}>{t("please-choose-driver")}</Text>
            )}
            <Text style={styles.textLabel}>{t("coach-assistant")}</Text>
            <View style={styles.dropDownStyle}>
              <DropDownPicker
                items={staffListData}
                open={isOpenAssist}
                setOpen={() => setIsOpenAssist(!isOpenAssist)}
                value={currentValueAssist}
                setValue={(val) => setCurrentValueAssist(val)}
                maxHeight={150}
                autoScroll
                placeholder={t("select-coach-assistant")}
                showTickIcon={true}
                style={styles.startDropDown}
                nestedScrollEnabled={true}
              />
            </View>
            {!validateAssistant && (
              <Text style={styles.validateText}>{t("please-choose-assistant")}</Text>
            )}
          </View>
          <Text style={styles.titleText}>{t("route")}</Text>
          <View>
            <Text style={styles.textLabel}>{t("from")}</Text>
            <View style={styles.dropDownStyle}>
              <DropDownPicker
                items={routeListData}
                open={isOpenFrom}
                setOpen={() => setIsOpenFrom(!isOpenFrom)}
                value={currentValueFrom}
                setValue={(val) => setCurrentValueFrom(val)}
                maxHeight={150}
                autoScroll
                placeholder={t("select-start-location")}
                showTickIcon={true}
                style={styles.startDropDown}
                nestedScrollEnabled={true}
                onPress={wardPress}
              />
            </View>
            {!validateFrom && (
              <Text style={styles.validateText}>
                {t("please-choose-start-location")}
              </Text>
            )}
            <Text style={styles.textLabel}>{t("to")}</Text>
            <View style={styles.dropDownStyle}>
              <DropDownPicker
                items={routeListDataDes}
                open={isOpenTo}
                setOpen={() => setIsOpenTo(!isOpenTo)}
                value={currentValueTo}
                setValue={(val) => setCurrentValueTo(val)}
                maxHeight={150}
                autoScroll
                placeholder={t("select-end-location")}
                showTickIcon={true}
                style={styles.startDropDown}
                nestedScrollEnabled={true}
              />
            </View>
            {!validateTo && (
              <Text style={styles.validateText}>
                {t("please-choose-end-location")}
              </Text>
            )}
            {/* <Text style={styles.textLabel}>Departure Place</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter Departure Place"
            ></TextInput>
            <Text style={styles.textLabel}>Arrival Place</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter Arrival Place"
            ></TextInput> */}
            <Text style={styles.textLabel}>{t("gate")}</Text>
            <View style={styles.dropDownStyle}>
              <DropDownPicker
                items={itemsGate}
                open={isOpenGate}
                setOpen={() => setIsOpenGate(!isOpenGate)}
                value={currentValueGate}
                setValue={(val) => setCurrentValueGate(val)}
                maxHeight={150}
                autoScroll
                placeholder={t("select-gate")}
                showTickIcon={true}
                style={styles.startDropDown}
                nestedScrollEnabled={true}
              />
            </View>
            {!validateGate && (
              <Text style={styles.validateText}>{t("please-choose-gate")}</Text>
            )}
          </View>

          <Text style={styles.titleText}>{t("shuttle")}</Text>
          <View>
            <Text style={styles.textLabel}>{t("shuttle-driver")}</Text>
            <View style={styles.dropDownStyle}>
              <DropDownPicker
                items={staffList}
                open={isOpenDriverShuttle}
                setOpen={() => setIsOpenDriverShuttle(!isOpenDriverShuttle)}
                value={currentValueDriverShuttle}
                setValue={(val) => setCurrentValueDriverShuttle(val)}
                maxHeight={150}
                autoScroll
                placeholder={t("select-shuttle-driver")}
                showTickIcon={true}
                style={styles.startDropDown}
                nestedScrollEnabled={true}
              />
            </View>
            {!validateDriverShuttle && (
              <Text style={styles.validateText}>
                {t("please-choose-shuttle-driver")}
              </Text>
            )}
            <Text style={styles.textLabel}>{t("shuttle-coach-assistant")}</Text>
            <View style={styles.dropDownStyle}>
              <DropDownPicker
                items={staffListData}
                open={isOpenAssistShuttle}
                setOpen={() => setIsOpenAssistShuttle(!isOpenAssistShuttle)}
                value={currentValueAssistShuttle}
                setValue={(val) => setCurrentValueAssistShuttle(val)}
                maxHeight={150}
                autoScroll
                placeholder={t("select-shuttle-coach-assistant")}
                showTickIcon={true}
                style={styles.startDropDown}
                nestedScrollEnabled={true}
              />
            </View>
            {!validateAssistantShuttle && (
              <Text style={styles.validateText}>
                {t("please-choose-shuttle-assistant")}
              </Text>
            )}
            <Text style={styles.textLabel}>{t("shuttle-coach")}</Text>
            <View style={styles.dropDownStyle}>
              <DropDownPicker
                items={coachListData}
                open={isOpenTypeShuttle}
                setOpen={() => setIsOpenTypeShuttle(!isOpenTypeShuttle)}
                value={currentValueCoachShuttle}
                setValue={(val) => setCurrentValueCoachShuttle(val)}
                maxHeight={150}
                autoScroll
                placeholder={t("select-coach")}
                showTickIcon={true}
                style={styles.startDropDown}
                nestedScrollEnabled={true}
              />
            </View>
            {!validateCoachShuttle && (
              <Text style={styles.validateText}>{t("please-choose-coach")}</Text>
            )}
              {openPickerShuttle && (
                <DateTimePicker
                  mode={modeShuttle}
                  display="spinner"
                  value={dateShuttle}
                  onChange={onChangeShuttle}
                  is24Hour={true}
                />
              )}
             <Text style={styles.textLabel}>{t("shuttle-date")}</Text>
            <Pressable onPress={toggleDatepickerShuttle}>
              <TextInput
                editable={false}
                style={
                  validateShuttleDate == true
                    ? styles.textInput
                    : styles.textInputWrong
                }
                placeholder={t("enter-shuttle-date")}
                value={ShuttleDate}
                onChangeText={ShuttleDateHandler}
                onPressIn={toggleDatepickerShuttle}
              ></TextInput>
              {!validateShuttleDate && (
                <Text style={styles.validateText}>
                  {t("non-empty-field")}
                </Text>
              )}
            </Pressable>

            {openPickerShuttleTime && (
                <DateTimePicker
                  mode={modeShuttleTime}
                  display="spinner"
                  value={timeShuttle}
                  onChange={onChangeShuttleTime}
                  is24Hour={true}
                />
              )}
             <Text style={styles.textLabel}>{t("shuttle-time")}</Text>
            <Pressable onPress={toggleTimepickerShuttle}>
              <TextInput
                editable={false}
                style={
                  validateShuttleTime == true
                    ? styles.textInput
                    : styles.textInputWrong
                }
                placeholder={t("enter-shuttle-time")}
                value={ShuttleTime}
                onChangeText={ShuttleTimeHandler}
                onPressIn={toggleTimepickerShuttle}
              ></TextInput>
              {!validateShuttleTime && (
                <Text style={styles.validateText}>
                  {t("non-empty-field")}
                </Text>
              )}
            </Pressable>

            <Text style={styles.titleText}>{t("shuttle-place")}</Text>
            <Text style={styles.textLabel}>{t("ward")}</Text>
            <View style={styles.dropDownStyle}>
              <DropDownPicker
                items={ward}
                open={isOpenWard}
                setOpen={() => setIsOpenWard(!isOpenWard)}
                value={currentValueWard}
                setValue={(val) => setCurrentValueWard(val)}
                maxHeight={150}
                autoScroll
                placeholder={t("select-ward")}
                showTickIcon={true}
                style={styles.startDropDown}
                nestedScrollEnabled={true}
              />
            </View>

            {!validateWard && (
              <Text style={styles.validateText}>{t("please-choose-ward")}</Text>
            )}
            <Text style={styles.textLabel}>{t("detail-place")}</Text>
            <TextInput
              style={
                validatePlace == true ? styles.textInput : styles.textInputWrong
              }
              placeholder={t("enter-detail-place")}
              value={place}
              onChangeText={placeHandler}
            ></TextInput>
            {!validatePlace && (
              <Text style={styles.validateText}>{t("non-empty-field")}</Text>
            )}
            <Pressable
              style={({ pressed }) => [
                styles.addButton,
                pressed && { opacity: 0.85 },
              ]}
              onPress={addHandler}
              //onPress={addDestinationHandler}
            >
              <Text style={styles.addText}>{t("add-place")}</Text>
            </Pressable>
            <View style={styles.listPlaces}>
              <FlatList
                showsHorizontalScrollIndicator={false}
                nestedScrollEnabled={true}
                horizontal={true}
                data={shuttlePlace}
                renderItem={({ item }) => (
                  <Pressable
                    onLongPress={() => {
                      showC();
                      setItemid(item.id);
                    }}
                  >
                    <ShuttleCard item={item} />
                  </Pressable>
                )}
                keyExtractor={(item,index) => index}
              />
            </View>
          </View>
          <View>
          <Text style={styles.titleText}>{t("departure")}</Text>

            {/* 2 date time picker */}
            {openPicker && (
              <DateTimePicker
                mode={mode}
                display="spinner"
                value={date}
                onChange={onChange}
                is24Hour={true}
              />
            )}
            <Text style={styles.textLabel}>{t("departure-date")}</Text>
            <Pressable onPress={toggleDatepicker}>
              <TextInput
                editable={false}
                style={
                  validateDepDate == true
                    ? styles.textInput
                    : styles.textInputWrong
                }
                placeholder={t("enter-departure-date")}
                value={DepDate}
                onChangeText={DepDateHandler}
                onPressIn={toggleDatepicker}
              ></TextInput>
              {!validateDepDate && (
                <Text style={styles.validateText}>
                  {t("non-empty-field")}
                </Text>
              )}
            </Pressable>

            {openPickerTime && (
              <DateTimePicker
                mode={modeTime}
                display="spinner"
                value={time}
                onChange={onChangeTime}
                is24Hour={true}
              />
            )}
            <Text style={styles.textLabel}>{t("departure-time")}</Text>
            <Pressable onPress={toggleTimepicker}>
              <TextInput
                editable={false}
                style={
                  validateDepTime == true
                    ? styles.textInput
                    : styles.textInputWrong
                }
                placeholder={t("enter-departure-time")}
                value={DepTime}
                onChangeText={DepTimeHandler}
                onPressIn={toggleTimepicker}
              ></TextInput>
              {!validateDepTime && (
                <Text style={styles.validateText}>
                  {t("non-empty-field")}
                </Text>
              )}
            </Pressable>
          <Text style={styles.titleText}>{t("arrival")}</Text>


            {openPickerArr && (
              <DateTimePicker
                mode={modeArr}
                display="spinner"
                value={dateArr}
                onChange={onChangeArr}
                is24Hour={true}
              />
            )}
            <Text style={styles.textLabel}>{t("arrival-date")}</Text>
            <Pressable onPress={toggleDatepickerArr}>
              <TextInput
                editable={false}
                style={
                  validateArrDate == true
                    ? styles.textInput
                    : styles.textInputWrong
                }
                placeholder={t("enter-arrival-date")}
                value={ArrDate}
                onChangeText={ArrDateHandler}
                onPressIn={toggleDatepickerArr}
              ></TextInput>
              {!validateArrDate && (
                <Text style={styles.validateText}>
                  {t("non-empty-field")}
                </Text>
              )}
            </Pressable>

            {openPickerArrTime && (
              <DateTimePicker
                mode={modeArrTime}
                display="spinner"
                value={timeArr}
                onChange={onChangeArrTime}
                is24Hour={true}
              />
            )}
            <Text style={styles.textLabel}>{t("arrival-time")}</Text>
            <Pressable onPress={toggleTimepickerArr}>
              <TextInput
                editable={false}
                style={
                  validateArrTime == true
                    ? styles.textInput
                    : styles.textInputWrong
                }
                placeholder={t("enter-arrival-time")}
                value={ArrTime}
                onChangeText={ArrTimeHandler}
                onPressIn={toggleTimepickerArr}
              ></TextInput>
              {!validateArrTime && (
                <Text style={styles.validateText}>
                  {t("non-empty-field")}
                </Text>
              )}
            </Pressable>
          </View>
          <Text style={styles.titleText}>{t("coach")}</Text>
          <View>
            <Text style={styles.textLabel}>{t("coach-available")}</Text>
            <View style={styles.dropDownStyle}>
              <DropDownPicker
                items={coachListData}
                open={isOpenType}
                setOpen={() => setIsOpenType(!isOpenType)}
                value={currentValueCoach}
                setValue={(val) => setCurrentValueCoach(val)}
                maxHeight={150}
                autoScroll
                placeholder={t("select-coach")}
                showTickIcon={true}
                style={styles.startDropDown}
                nestedScrollEnabled={true}
              />
            </View>
            {!validateCoach && (
              <Text style={styles.validateText}>{t("please-choose-coach")}</Text>
            )}
          </View>
          <Text style={styles.titleText}>{t("status")}</Text>
          <View>
            <Text style={styles.textLabel}>{t("status")}</Text>
            <View style={styles.dropDownStyle}>
              <DropDownPicker
                items={itemsStatus}
                open={isOpenStatus}
                setOpen={() => setIsOpenStatus(!isOpenStatus)}
                value={currentValueStatus}
                setValue={(val) => setCurrentValueStatus(val)}
                maxHeight={150}
                autoScroll
                placeholder={t("select-coach-status")}
                showTickIcon={true}
                style={styles.startDropDown}
                nestedScrollEnabled={true}
              />
            </View>
            {!validateCoachStatus && (
              <Text style={styles.validateText}>{t("please-choose-status")}</Text>
            )}
          </View>
          <Text style={styles.titleText}>{t("price")}</Text>
          <View>
            <Text style={styles.textLabel}>{t("price")} (VND)</Text>
            <TextInput
              style={
                validatePrice == true ? styles.textInput : styles.textInputWrong
              }
              placeholder={t("enter-price")}
              value={price2}
              keyboardType="numeric"
              onChangeText={priceHandler}
            ></TextInput>
            {!validatePrice && (
              <Text style={styles.validateText}>
                {t("price-validation")}
              </Text>
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
    marginTop: 10,
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
  indicator: {
    position: "absolute",
    zIndex: 1000,
    right: '46%',
    top: "50%"
  }
});
