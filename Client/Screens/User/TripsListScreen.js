import { useContext, useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Modal,
  Pressable,
  Alert,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import GlobalColors from "../../Color/colors";
import { SelectList } from "react-native-dropdown-select-list";
import ScheduleItem from "../../Componets/Schedule/ScheduleItem";
import EmptyTrip from "../../Componets/UI/EmptyTrip";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { searchTrip } from "../../util/databaseAPI";
import { AuthContext } from "../../Store/authContex";
import { useIsFocused } from "@react-navigation/native";
import Loading from "../../Componets/UI/Loading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BookingContext } from "../../Store/bookingContext";
import { useTranslation } from "react-i18next";
function TripListsScreen({ navigation, route }) {
  const { t } = useTranslation();
  const authCtx = useContext(AuthContext);
  const bookingCtx = useContext(BookingContext);
  const [listOfTrips, setListOfTrips] = useState([]);
  const [initListOfTrips, setInitListOfTrips] = useState([]);

  const [listOfStartPlace, setListOfStartPlace] = useState([]);

  const [listOfArrivalPlace, setListOfArrivalPlace] = useState([]);

  const [arrivalPlaceSelected, setArrivalPlaceSelected] = useState("");
  const [startPlaceSelected, setStartPlaceSelected] = useState("");
  const [isSearchEmpty, setIsSearchEmpty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [sortSelectedIndex, setSortSelectedIndex] = useState(0);

  const isFocused = useIsFocused();
  //Sort
  const sortOptions = [
    { id: 0, value: t("ticket-prices-increase") },
    { id: 1, value: t("earliest-departure-time") },
    { id: 2, value: t("latest-departure-time") },
    { id: 3, value: t("ticket-prices-decrease") },
  ];
  const [isSortVisible, setIsSortVisible] = useState(false);

  function calculateTimeDifference(date1, date2) {
    // Calculate the time difference in milliseconds
    const timeDifferenceMillis = date2 - date1;

    // Calculate hours, minutes, and seconds from milliseconds
    const hours = Math.floor(timeDifferenceMillis / (1000 * 60 * 60));
    const minutes = Math.floor(
      (timeDifferenceMillis % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeDifferenceMillis % (1000 * 60)) / 1000);

    // Return the time difference as an object
    if (minutes === 0) return `${hours}h`;
    return `${hours}h:${minutes}m`;
  }
  //Sort
  useEffect(() => {
    async function getTrips() {
      //goi API

      //setListOfTrips(tripList);
      setIsLoading((curr) => !curr);
      const res = await searchTrip(
        authCtx.token,
        route?.params?.info.from,
        route?.params?.info.to,
        route?.params?.info.departureTime,
        route?.params?.info.numberOfSeats,
        route?.params?.info.roundTripDate,
        route?.params?.info.startPlace,
        route?.params?.info.arrivalPlace
      );
      if (res === null) {
        Alert.alert(t("error"), t("something-was-wrong"));
        setIsLoading((curr) => !curr);

        return;
      }

      if (res.rows.length === 0) {
        console.log(isSearchEmpty);
        setIsLoading((curr) => !curr);
        setIsSearchEmpty((curr) => !curr);
        // setListOfStartPlace(start);
        // setListOfArrivalPlace(arrival);
        return;
      }

      const tripList = res?.rows.map((trip) => {
        return {
          id: trip.id,
          idRoute: trip.routeId, //id của route được tìm kiếm
          price: trip.price,
          numberOfAvailableSeat: trip.remainingSlot,
          departurePlace: trip.StartPlaceData.placeName, //Nơi lên xe
          arrivalPlace: trip.ArrivalPlaceData.placeName, //Nơi xuống xe
          departureTime: new Date(trip.departureTime),
          arrivalTime: new Date(trip.arrivalTime),
          capacity: trip.CoachData.capacity,
          coachType: trip.CoachData.CoachTypeData.typeName,
          image: trip.CoachData.image,
          duration: calculateTimeDifference(
            new Date(trip.departureTime),
            new Date(trip.arrivalTime)
          ),
          services: trip.ServiceData,
          roundTripId: trip?.roundTrip ? trip?.roundTrip[0]?.id : null,
          seatData: trip.SeatsData,
          departurePlacePosition: trip.StartPlaceData,
          arrivalPlacePosition: trip.ArrivalPlaceData,
        };
      });

      //Suggest trip
      const suggestedTrips = res?.suggestedTrips;
      await storeSuggestTrip(suggestedTrips);
      //Suggest trip

      // setListOfTrips((curr) => [...tripList]);
      setListOfTrips((curr) =>
        tripList.sort((trip1, trip2) =>
          trip1.price > trip2.price ? 1 : trip1.price < trip2.price ? -1 : 0
        )
      );
      setInitListOfTrips(tripList);
      sortHandler(0);

      const start = [];
      start.push({ key: 1, value: "All" });
      const arrival = [];
      arrival.push({ key: 1, value: "All" });
      tripList.forEach((trip, index) => {
        if (!start.some((item) => item.value === trip.departurePlace)) {
          start.push({ key: index + 2, value: trip.departurePlace });
        }
        if (!arrival.some((item) => item.value === trip.arrivalPlace)) {
          arrival.push({ key: index + 2, value: trip.arrivalPlace });
        }
      });
      setListOfStartPlace(start);

      setListOfArrivalPlace(arrival);

      setIsLoading((curr) => !curr);
    }
    async function storeSuggestTrip(suggestTripArr) {
      try {
        if (!suggestTripArr || suggestTripArr.rows.length === 0) {
          return;
        } else {
          const suggestTripList = suggestTripArr?.rows.map((trip) => {
            return {
              id: trip.id,
              idRoute: trip.routeId, //id của route được tìm kiếm
              price: trip.price,
              numberOfAvailableSeat: trip.remainingSlot,
              departurePlace: trip.StartPlaceData.placeName, //Nơi lên xe
              arrivalPlace: trip.ArrivalPlaceData.placeName, //Nơi xuống xe
              departureTime: new Date(trip.departureTime),
              arrivalTime: new Date(trip.arrivalTime),
              capacity: trip.CoachData.capacity,
              coachType: trip.CoachData.CoachTypeData.typeName,
              image: trip.CoachData.image,
              duration: calculateTimeDifference(
                new Date(trip.departureTime),
                new Date(trip.arrivalTime)
              ),
              services: trip.ServiceData,
              roundTripId: trip?.roundTrip ? trip?.roundTrip[0]?.id : null,
            };
          });
          const jsonValues = JSON.stringify(suggestTripList);
          await AsyncStorage.setItem("suggestTrips", jsonValues);
        }
      } catch (e) {
        // error reading value
        console.log("Store SuggestTrip", e);
      }
    }

    //Example
    // const tripList = [
    //   {
    //     id: 1,
    //     idRoute: 2, //id của route được tìm kiếm
    //     price: 1100000,
    //     numberOfAvailableSeat: 9,
    //     departurePlace: "HCM", //Nơi lên xe
    //     arrivalPlace: "An Giang", //Nơi xuống xe
    //     departureTime: new Date(2023, 1, 12, 11, 23, 32),
    //     arrivalTime: new Date(2023, 2, 12, 3, 23, 32),
    //     duration: new Date(0, 0, 0, 1, 30, 0),
    //     service: [
    //       "Air Conditioner",
    //       "Wifi",
    //       "TV",
    //       "Blanket",
    //       "Charging Socket",
    //       "Mattress",
    //       "Earphone",
    //       "Toilet",
    //     ],
    //   },
    //   {
    //     id: 2,
    //     price: 1000000,
    //     numberOfAvailableSeat: 8,
    //     departurePlace: "HCM",
    //     arrivalPlace: "An Giang",
    //     departureTime: new Date(2023, 12, 12, 10, 23, 32),
    //     arrivalTime: new Date(2023, 22, 12, 3, 23, 32),
    //     duration: new Date(0, 0, 0, 1, 30, 0),
    //     service: ["Air Conditioner", "Wifi", "TV", "Blanket"],
    //   },
    //   {
    //     id: 3,
    //     price: 1500000,
    //     numberOfAvailableSeat: 7,
    //     departurePlace: "HCM",
    //     arrivalPlace: "An Giang",
    //     departureTime: new Date(2023, 10, 12, 7, 23, 32),
    //     arrivalTime: new Date(2023, 20, 12, 3, 23, 32),
    //     duration: new Date(0, 0, 0, 23, 30, 0),
    //     service: ["Air Conditioner", "Wifi", "TV", "Blanket"],
    //   },
    //   {
    //     id: 4,
    //     price: 1900000,
    //     numberOfAvailableSeat: 20,
    //     departurePlace: "Quảng Bình",
    //     arrivalPlace: "Kiên Giang",
    //     departureTime: new Date(2023, 13, 12, 1, 23, 32),
    //     arrivalTime: new Date(2023, 23, 12, 3, 23, 32),
    //     duration: new Date(0, 0, 0, 23, 30, 0),
    //     service: ["Air Conditioner", "Wifi"],
    //   },
    //   {
    //     id: 5,
    //     price: 1606000,
    //     numberOfAvailableSeat: 20,
    //     departurePlace: "Thừa Thiên Huế",
    //     arrivalPlace: "Long An",
    //     departureTime: new Date(2023, 1, 12, 2, 23, 32),
    //     arrivalTime: new Date(2023, 2, 12, 3, 23, 32),
    //     duration: new Date(0, 0, 0, 1, 30, 0),
    //     service: ["Air Conditioner"],
    //   },
    // ];

    // setListOfTrips(tripList);
    // setInitListOfTrips(tripList);
    getTrips();

    //Example

    // bookingCtx.clearBookingInfo();
  }, [isFocused]);
  useEffect(() => {
    const {
      from,
      to,
      departureTime,
      isRoundTrip,
      roundTripDate,
      numberOfSeats,
      textStartPlace,
      textArrivalPlace,
    } = route?.params?.info;
    navigation.setOptions({
      title: textStartPlace + " -> " + textArrivalPlace,
      headerTitleStyle: {
        fontSize: 20,
        textAlign: "center",
        color: "white",
      },
      headerStyle: {
        gap: 20,
        // backgroundColor: "#0080ff",
        backgroundColor: "#0C1941",
      },

      headerLeft: () => {
        return (
          <Ionicons
            name="arrow-back"
            size={24}
            color="white"
            onPress={() => navigation.goBack()}
          />
        );
      },
    });
  }, []);

  async function getSRecentSearchTrips(trip) {
    // await AsyncStorage.removeItem("recentSearchTrips");
    // return;
    try {
      const jsonValue = await AsyncStorage.getItem("recentSearchTrips");
      if (jsonValue != null) {
        const temp = JSON.parse(jsonValue);
        const isExist = temp.find((item) => item.id === trip.id);
        if (isExist) {
          return;
        }
        if (temp.length > 5) {
          temp.shift();
          temp.push(trip);
          const newArr = temp.reverse();
          const jsonValues = JSON.stringify(newArr);
          await AsyncStorage.setItem("recentSearchTrips", jsonValues);
        } else {
          temp.push(trip);
          const jsonValues = JSON.stringify(temp);
          await AsyncStorage.setItem("recentSearchTrips", jsonValues);
        }
      } else {
        const temp = [trip];
        const jsonValues = JSON.stringify(temp);
        await AsyncStorage.setItem("recentSearchTrips", jsonValues);
      }
    } catch (e) {
      // error reading value
      console.log("Store Recent Search", e);
    }
  }

  async function scheduleHandler(schedule) {
    await getSRecentSearchTrips(schedule);
    console.log(schedule);

    if (route?.params?.info?.isSelectForRoundTrip) {
      let temp = bookingCtx.bookingInfo;
      temp.roundTripInfo = schedule;
      bookingCtx.setBookingInfo(temp);

      navigation.push("TripDetailScreen", {
        idSchedule: schedule.id,
        roundTripDate: route?.params?.info?.roundTripDate,
        trip: schedule,
        isSelectForRoundTrip: route?.params?.info?.isSelectForRoundTrip,
      });
    } else {
      console.log(schedule);
      let temp = bookingCtx.bookingInfo;
      temp.mainTripInfo = schedule;
      bookingCtx.setBookingInfo(temp);

      navigation.navigate("TripDetailScreen", {
        idSchedule: schedule.id,
        roundTripDate: route?.params?.info?.roundTripDate,
        trip: schedule,
        isSelectForRoundTrip: route?.params?.info?.isSelectForRoundTrip,
      });
    }
  }
  function renderScheduleItem(itemData) {
    let departureShort = itemData.item.departurePlace.split(", ");
    departureShort.pop();
    let arrivalShort = itemData.item.arrivalPlace.split(", ");
    arrivalShort.pop();

    return (
      <ScheduleItem
        onPressed={scheduleHandler.bind(this, itemData.item)}
        price={itemData.item.price}
        numberOfAvailableSeat={itemData.item.numberOfAvailableSeat}
        departurePlace={departureShort.join(", ")}
        arrivalPlace={arrivalShort.join(", ")}
        departureTime={itemData.item.departureTime}
        arrivalTime={itemData.item.arrivalTime}
        duration={itemData.item.duration}
        services={itemData.item.services}
      />
    );
  }
  function selectStartPlaceHandler() {
    console.log("start", startPlaceSelected);
    console.log("arrival", arrivalPlaceSelected);
    if (startPlaceSelected === "All" || startPlaceSelected === 1) {
      setListOfTrips(initListOfTrips);
      setIsSearchEmpty(false);

      return;
    }
    const temp = initListOfTrips;
    if (arrivalPlaceSelected === "All" || arrivalPlaceSelected === 1) {
      setListOfTrips(
        temp.filter((trip) => trip.departurePlace === startPlaceSelected)
      );
      setIsSearchEmpty(false);

      return;
    }
    const temp1 = temp.filter(
      (trip) =>
        trip.departurePlace === startPlaceSelected &&
        trip.arrivalPlace === arrivalPlaceSelected
    );
    if (temp1.length === 0) {
      setIsSearchEmpty(true);
      return;
    }
    setListOfTrips(temp1);
    setIsSearchEmpty(false);

    /////////////
  }
  function selectArrivalPlaceHandler() {
    if (arrivalPlaceSelected === "All" || arrivalPlaceSelected === 1) {
      setListOfTrips(initListOfTrips);
      setIsSearchEmpty(false);

      return;
    }
    const temp = initListOfTrips;
    if (startPlaceSelected === "All" || startPlaceSelected === 1) {
      setListOfTrips(
        temp.filter((trip) => trip.arrivalPlace === arrivalPlaceSelected)
      );
      setIsSearchEmpty(false);

      return;
    }
    const temp1 = temp.filter(
      (trip) =>
        trip.arrivalPlace === arrivalPlaceSelected &&
        trip.departurePlace === startPlaceSelected
    );
    if (temp1.length === 0) {
      setIsSearchEmpty(true);
      return;
    }

    setListOfTrips(temp1);
    setIsSearchEmpty(false);
  }

  function Separator() {
    return (
      <View
        style={{
          width: "100%",
          height: 2,
          borderBottomColor: "black",
          borderBottomWidth: 0.3,
        }}
      ></View>
    );
  }
  function SortItem({ item, isChecked, onSelect }) {
    return (
      <Pressable
        style={({ pressed }) => [
          {
            margin: 10,
            padding: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: 10,
          },
          pressed && { opacity: 0.6 },
          isChecked && { borderWidth: 2, borderColor: GlobalColors.button },
        ]}
        onPress={onSelect}
      >
        <Text
          style={[
            { fontWeight: "bold", fontSize: 16 },
            isChecked && { fontWeight: "normal" },
          ]}
        >
          {item.value}
        </Text>
        {isChecked && (
          <Ionicons
            name="ios-checkmark"
            size={24}
            color={GlobalColors.button}
          />
        )}
      </Pressable>
    );
  }

  function sortHandler(option) {
    //0 : Price increase
    //1: Earliest Departure Time

    //2: Latest Departure Time
    //3 : Price decrease
    console.log(option);
    switch (option) {
      case 0:
        setListOfTrips((curr) =>
          curr.sort((trip1, trip2) =>
            trip1.price > trip2.price ? 1 : trip1.price < trip2.price ? -1 : 0
          )
        );
        break;
      case 1:
        setListOfTrips((curr) =>
          curr.sort((trip1, trip2) => trip1.departureTime - trip2.departureTime)
        );
        break;
      case 2:
        setListOfTrips((curr) =>
          curr.sort((trip1, trip2) => trip2.departureTime - trip1.departureTime)
        );
        break;
      case 3:
        setListOfTrips((curr) =>
          curr.sort((trip1, trip2) =>
            trip1.price < trip2.price ? 1 : trip1.price > trip2.price ? -1 : 0
          )
        );
        break;

      default:
        break;
    }
  }
  return (
    <>
      {isLoading && (
        <View style={{ height: "100%" }}>
          <Loading />
        </View>
      )}
      <Modal
        visible={isSortVisible}
        backdropOpacity={0.7}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.subRoot}>
          <View
            style={{
              width: "100%",
              backgroundColor: "white",
              paddingVertical: 20,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
          >
            <View
              style={{
                alignItems: "center",
                width: "100%",
                justifyContent: "space-between",
                borderBottomColor: "black",
                borderBottomWidth: 0.3,
                paddingBottom: 10,
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                {t("sort-by")}
              </Text>
              <TouchableOpacity
                style={{
                  alignSelf: "flex-end",
                  marginTop: -30,
                  marginRight: 10,
                }}
                onPress={() => setIsSortVisible((curr) => !curr)}
              >
                <Ionicons name="close-circle-outline" size={30} color="black" />
              </TouchableOpacity>
            </View>
            <SortItem
              item={sortOptions[0]}
              isChecked={sortSelectedIndex === 0}
              onSelect={() => {
                setSortSelectedIndex(0);
                setIsSortVisible((curr) => !curr);
                sortHandler(0);
              }}
            />
            <Separator />
            <SortItem
              item={sortOptions[1]}
              isChecked={sortSelectedIndex === 1}
              onSelect={() => {
                setSortSelectedIndex(1);
                setIsSortVisible((curr) => !curr);
                sortHandler(1);
              }}
            />
            <Separator />
            <SortItem
              item={sortOptions[2]}
              isChecked={sortSelectedIndex === 2}
              onSelect={() => {
                setSortSelectedIndex(2);
                setIsSortVisible((curr) => !curr);
                sortHandler(2);
              }}
            />
            <Separator />
            <SortItem
              item={sortOptions[3]}
              isChecked={sortSelectedIndex === 3}
              onSelect={() => {
                setSortSelectedIndex(3);
                setIsSortVisible((curr) => !curr);
                sortHandler(3);
              }}
            />
          </View>
        </View>
      </Modal>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          position: "absolute",
          bottom: 30,
          // width: "100%",
          justifyContent: "center",
          backgroundColor: "black",
          alignSelf: "center",
          padding: 10,
          paddingHorizontal: 15,
          borderRadius: 30,
          opacity: 0.7,
          gap: 10,
          zIndex: 1,
        }}
        onPress={() => setIsSortVisible((curr) => !curr)}
      >
        <MaterialCommunityIcons name="sort-variant" size={24} color="white" />
        <Text style={{ color: "white", fontWeight: "600", fontSize: 17 }}>
          {t("sort")}
        </Text>
      </TouchableOpacity>
      <View style={styles.root}>
        {isSearchEmpty ? (
          <EmptyTrip title={t("no-trips")} message={t("choose-another-trip")} />
        ) : (
          <FlatList
            style={styles.list}
            data={listOfTrips}
            keyExtractor={(item, index) => item.id}
            renderItem={renderScheduleItem}
            showsVerticalScrollIndicator={true}
          />
        )}

        <View style={styles.selectionPlace}>
          <View style={styles.boxPlace}>
            <Text
              style={{ paddingLeft: 20, marginBottom: -25, color: "#8C8D89" }}
            >
              {t("boarding-location")}
            </Text>

            <SelectList
              boxStyles={styles.selectList}
              setSelected={(val) => setStartPlaceSelected(val)}
              data={listOfStartPlace}
              save="value"
              search={false}
              defaultOption={listOfStartPlace[0]}
              inputStyles={{ fontSize: 15 }}
              dropdownStyles={{
                backgroundColor: "white",
                borderWidth: 1,
                marginHorizontal: 5,
              }}
              dropdownItemStyles={{
                borderBottomWidth: 0.17,
                borderColor: "gray",
                opacity: 0.6,
                width: "100%",
              }}
              onSelect={selectStartPlaceHandler}
            />
          </View>
          <View style={styles.boxPlace1}>
            <Text
              style={{ paddingLeft: 20, marginBottom: -25, color: "#8C8D89" }}
            >
              {t("drop-off-location")}
            </Text>
            <SelectList
              boxStyles={styles.selectList1}
              setSelected={(val) => setArrivalPlaceSelected(val)}
              data={listOfArrivalPlace}
              save="value"
              search={false}
              defaultOption={listOfArrivalPlace[0]}
              inputStyles={{ fontSize: 15 }}
              dropdownStyles={{
                backgroundColor: "white",
                borderWidth: 1,
                marginHorizontal: 5,
              }}
              dropdownItemStyles={{
                borderBottomWidth: 0.17,
                borderColor: "gray",
                opacity: 0.6,
                width: "100%",
              }}
              onSelect={selectArrivalPlaceHandler}
            />
          </View>
        </View>
      </View>
    </>
  );
}

export default TripListsScreen;
const styles = StyleSheet.create({
  root: {
    flex: 1,
    marginBottom: 10,
  },
  list: {
    marginTop: 90,
  },
  selectionPlace: {
    flexDirection: "row",
    width: "100%",
    height: 90,
    backgroundColor: "white",
    borderWidth: 0.2,
    borderColor: "gray",
    padding: 10,
    position: "absolute",
  },
  boxPlace: {
    flex: 1,
    width: "50%",
    position: "absolute",
    left: 10,
    top: 20,
    bottom: 10,
    zIndex: 10000000000,
  },
  boxPlace1: {
    flex: 1,
    width: "50%",
    position: "absolute",
    right: 10,
    top: 20,
    bottom: 10,
  },
  selectList: {
    borderRadius: 0,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderWidth: 0.2,
    borderColor: "gray",
    paddingTop: 30,
  },
  selectList1: {
    borderRadius: 0,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 0.2,
    borderColor: "gray",
    paddingTop: 30,
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
});
