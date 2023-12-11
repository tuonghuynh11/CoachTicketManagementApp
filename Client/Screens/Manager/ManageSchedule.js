import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  SafeAreaView,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import CoachCard from "./CoachCard";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
import ScheduleCard from "./ScheduleCard";
import { getAllSchedules } from "../../util/scheduleService";
import ModalFilterSchedule from "./Popup/ModalFilterSchedule";
import { getAllRoutesId } from "../../util/routeService";
import { useIsFocused } from "@react-navigation/native";

export default function ManageSchedule({ route, navigation }) {
  const openMenu = () => {
    navigation.openDrawer();
  };
  const pressAddHandler = () => {
    navigation.navigate("AddSchedule", route.params);
  };

  const { id } = route.params;

  const [scheduleList, setScheduleList] = useState([]);
  const [scheduleListData, setScheduleListData] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchSchedules = async () => {
      if (isFocused) {
        try {
          setIndicator(true);
          const data = await getAllSchedules(id);
          setScheduleList(data.data.rows);
          setScheduleListData(data.data.rows);
          setIndicator(false);
        } catch (error) {
          // Handle error, e.g., redirect to login if unauthorized
          console.error("Error fetching schedules:", error);
        }
      }
    };

    fetchSchedules();
  }, [isFocused]);

  const [routeDataS, setRouteDataS] = useState([]);
  const [routeDataE, setRouteDataE] = useState([]);

  const deleteHandler = (idsche) => {
    const updatedItems = scheduleListData.filter((item) => item.id !== idsche);
    setScheduleList(updatedItems);
    setScheduleListData(updatedItems);
  };

  const fecthRoute = async () => {
    try {
      setIndicator(true);
      const data = await getAllRoutesId(id);
      setRouteDataS(data.data.rows[0].PlacesData.startPlaces);
      setRouteDataE(data.data.rows[0].PlacesData.arrivalPlaces);
      setIndicator(false);
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  useEffect(() => {
    fecthRoute();
  }, []);

  const [isOpenStart, setIsOpenStart] = useState(false);
  const [currentValueStart, setCurrentValueStart] = useState("");
  const itemsStart = routeDataS.map(({ placeName }) => ({
    label: placeName,
    value: placeName,
  }));

  const [isOpenEnd, setIsOpenEnd] = useState(false);
  const [currentValueEnd, setCurrentValueEnd] = useState("");
  const itemsEnd = routeDataE.map(({ placeName }) => ({
    label: placeName,
    value: placeName,
  }));

  const searchHandler = () => {
    if (currentValueStart != "" && currentValueEnd != "") {
      let filteredList = scheduleListData.filter((schedule) => {
        return (
          schedule.StartPlaceData.placeName
            .toLowerCase()
            .includes(currentValueStart.toLowerCase()) &&
          schedule.ArrivalPlaceData.placeName
            .toLowerCase()
            .includes(currentValueEnd.toLowerCase())
        );
      });

      setScheduleList(filteredList);
    } else if (currentValueStart != "" && currentValueEnd == "") {
      let filteredList = scheduleListData.filter((schedule) =>
        schedule.StartPlaceData.placeName
          .toLowerCase()
          .includes(currentValueStart.toLowerCase())
      );

      setScheduleList(filteredList);
    } else if (currentValueStart == "" && currentValueEnd != "") {
      let filteredList = scheduleListData.filter((schedule) =>
        schedule.ArrivalPlaceData.placeName
          .toLowerCase()
          .includes(currentValueEnd.toLowerCase())
      );
      setScheduleList(filteredList);
    } else {
      setScheduleList(scheduleListData);
    }
  };

  const pressHandler = () => {
    navigation.goBack();
  };

  const [visible, setVisible] = useState(false);
  const show = () => {
    setVisible(true);
  };
  const hide = () => {
    setVisible(false);
  };

  const handlerSort = (type) => {
    if (type == "1") {
      let sortedList = scheduleListData
        .slice()
        .sort((a, b) => parseInt(a.price) - parseInt(b.price));

      setScheduleList(sortedList);
    } else if (type == "2") {
      let sortedList = scheduleListData
        .slice()
        .sort((a, b) => parseInt(b.price) - parseInt(a.price));

      setScheduleList(sortedList);
    } else {
      setScheduleList(scheduleListData);
    }
  };
  const [indicator, setIndicator] = useState(false);
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <ActivityIndicator
          style={styles.indicator}
          size={"large"}
          animating={indicator}
        />
        <ModalFilterSchedule
          hide={hide}
          visible={visible}
          handlerSort={handlerSort}
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
          <Text style={styles.headerText}>List Of Schedules</Text>
          <Pressable
            style={({ pressed }) => [
              styles.addIconStyle,
              pressed && { opacity: 0.85 },
            ]}
            onPress={pressAddHandler}
          >
            <AntDesign name="pluscircle" size={30} color="#72C6A1" />
          </Pressable>
        </View>
        <View style={styles.body}>
          <View style={styles.bodySearchFilter}>
            <View style={styles.bodySearch}>
              <DropDownPicker
                items={itemsStart}
                open={isOpenStart}
                setOpen={() => setIsOpenStart(!isOpenStart)}
                value={currentValueStart}
                setValue={(val) => setCurrentValueStart(val)}
                maxHeight={150}
                autoScroll
                placeholder="Select Start Location"
                showTickIcon={true}
                theme="DARK"
                style={styles.startDropDown}
              />
              <DropDownPicker
                items={itemsEnd}
                open={isOpenEnd}
                setOpen={() => setIsOpenEnd(!isOpenEnd)}
                value={currentValueEnd}
                setValue={(val) => setCurrentValueEnd(val)}
                maxHeight={150}
                autoScroll
                placeholder="Select End Location"
                showTickIcon={true}
                theme="DARK"
                style={styles.startDropDown}
              />
            </View>
            <View style={styles.filter}>
              {/**filter */}
              <Pressable
                onPress={show}
                style={({ pressed }) => [
                  styles.icon,
                  pressed && { opacity: 0.85 },
                ]}
              >
                <Ionicons name="md-filter" size={30} color="black" />
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.icon,
                  pressed && { opacity: 0.85 },
                ]}
                onPress={searchHandler}
              >
                <FontAwesome name="search" size={30} color="black" />
              </Pressable>
            </View>
          </View>
        </View>
        <View style={styles.bodyList}>
          <FlatList
            data={scheduleList}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => navigation.navigate("DetailSchedule", item)}
              >
                <TouchableWithoutFeedback onPress={() => {}}>
                  <ScheduleCard
                    item={item}
                    navigation={navigation}
                    deleteHandler={deleteHandler}
                  />
                </TouchableWithoutFeedback>
              </Pressable>
            )}
            keyExtractor={(item) => item.id}
          />
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
  menuIcon: {
    position: "absolute",
    left: 16,
  },
  headerText: {
    fontSize: 23,
    color: "#283663",
  },
  addIconStyle: {
    position: "absolute",
    right: 16,
  },
  bodySearchFilter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 10,
  },
  bodySearch: {
    flex: 9,
    paddingRight: 10,
    paddingLeft: 20,
  },
  startDropDown: {
    marginBottom: 10,
    zIndex: 100,
    backgroundColor: "#283663",
  },
  filter: {
    flex: 1,
    paddingRight: 7,
  },
  bodyList: {
    flex: 1,
  },
  backIcon: {
    position: "absolute",
    left: 16,
  },
  icon: {
    margin: 5,
    marginBottom: 20,
  },
  indicator: {
    position: "absolute",
    zIndex: 1000,
    right: "46%",
    top: "50%",
  },
});
