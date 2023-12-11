import {
  FlatList,
  View,
  StyleSheet,
  Image,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Alert,
  Pressable,
} from "react-native";
import GlobalColors from ".././../Color/colors";
import { Octicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Ionicons } from "@expo/vector-icons";
import { useContext, useEffect, useState } from "react";
import { calculateTimeDifference, getDate, getTime } from "../../Helper/Date";
import TicketItem from "../../Componets/UI/TicketItem";
import FlatButton from "../../Componets/UI/FlatButton";
import * as Progress from "react-native-progress";
import {
  getCurrentPositionAsync,
  useForegroundPermissions,
  PermissionStatus,
} from "expo-location";
import * as Location from "expo-location";
import { requestPermissionsAsync } from "expo-media-library";
import CustomButton from "../../Componets/UI/CustomButton";
import RatingFeedbackScreen from "./RatingFeedbackScreen";
import { AuthContext } from "../../Store/authContex";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import TicketItemNew from "../../Componets/UI/TicketItemNew";
import YesNoPopUp from "../../Componets/UI/YesNoPopUp";
import { cancelTicketWhenFinishedConfirm } from "../../util/databaseAPI";
const Tab = createMaterialTopTabNavigator();
function TicketDetailScreen({ navigation, route }) {
  const authCtx = useContext(AuthContext);
  const [idTrip, setIdTrip] = useState();
  const [isHistory, setIsHistory] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [groupTickets, setGroupTickets] = useState(new Map());
  const [tripInfo, setTripInfo] = useState();

  const [roundTripTickets, setRoundTripTickets] = useState([]);
  const [roundTripPassengers, setRoundTripPassengers] = useState([]);
  const [roundTripInfo, setRoundTripInfo] = useState();
  const [roundTripGroupTickets, setRoundTripGroupTickets] = useState(new Map());

  const { width: screenWidth } = Dimensions.get("window");

  const [selectedPassengerIndex, setSelectedPassengerIndex] = useState(0);

  const [deviceLocation, setDeviceLocation] = useState();
  const [locationPermissionInformation, requestPermission] =
    useForegroundPermissions();

  const [isShowModal, setIsShowModal] = useState(false);
  const [isRating, setIsRating] = useState(false);

  const [isShowCancel, setIsShowCancel] = useState(false);

  const [progressValue, setProgressValue] = useState(0.5);

  const [tabScreenIndex, setTabScreenIndex] = useState(0);
  async function verifyPermission() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    }
    if (status === PermissionStatus.DENIED) {
      Alert.alert(
        "Insufficient Permission!",
        "You need to grant location permissions to tracking"
      );

      return false;
    }
    return true;
  }
  async function getLocationHandler() {
    const hasPermission = await verifyPermission();
    if (!hasPermission) {
      return false;
    }
    const location = await getCurrentPositionAsync();
    setDeviceLocation({
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    });
    return true;
  }

  useEffect(() => {
    // const isStart =
    //   new Date(route?.params?.ticketInfo?.ScheduleData?.departureTime) -
    //     new Date() >
    //     0 && Math.abs(minutes) < 30;

    //tabScreenIndex = 0: mainScreen, 1: roundTripScreen
    if (!route?.params?.isHistory) {
      let isStart = false;
      if (tabScreenIndex == 0) {
        isStart =
          route?.params?.ticketInfo?.ScheduleData?.status == 4 &&
          route?.params?.ticketInfo?.ScheduleData?.arrivalTime - new Date() > 0;
      } else {
        isStart =
          roundTripInfo?.status == 4 &&
          roundTripInfo?.arrivalTime - new Date() > 0;
      }
      navigation.setOptions({
        headerRight: () => {
          return (
            <TouchableOpacity
              onPress={async () => {
                console.log(tabScreenIndex);

                const valid = await getLocationHandler();
                if (!valid) return;
                if (tabScreenIndex == 0) {
                  navigation.navigate("TrackingScreen", {
                    start: {
                      lat: route?.params?.ticketInfo?.ScheduleData
                        ?.StartPlaceData?.placeLat,
                      lng: route?.params?.ticketInfo?.ScheduleData
                        ?.StartPlaceData?.placeLng,
                    },
                    destination: {
                      lat: route?.params?.ticketInfo?.ScheduleData
                        ?.ArrivalPlaceData?.placeLat,
                      lng: route?.params?.ticketInfo?.ScheduleData
                        ?.ArrivalPlaceData?.placeLng,
                    },
                    deviceLocation: deviceLocation,
                    trackingInfo: tripInfo,

                    startPlace:
                      route?.params?.ticketInfo?.ScheduleData?.StartPlaceData
                        ?.placeName,
                    arrivalPlace:
                      route?.params?.ticketInfo?.ScheduleData?.ArrivalPlaceData
                        ?.placeName,

                    departureTime: new Date(tripInfo?.departureTime),
                  });
                } else {
                  navigation.navigate("TrackingScreen", {
                    start: {
                      lat: route?.params?.ticketInfo?.ScheduleData
                        ?.ArrivalPlaceData?.placeLat,
                      lng: route?.params?.ticketInfo?.ScheduleData
                        ?.ArrivalPlaceData?.placeLng,
                    },
                    destination: {
                      lat: route?.params?.ticketInfo?.ScheduleData
                        ?.StartPlaceData?.placeLat,
                      lng: route?.params?.ticketInfo?.ScheduleData
                        ?.StartPlaceData?.placeLng,
                    },
                    startPlace: roundTripInfo?.departurePlace,
                    arrivalPlace: roundTripInfo?.arrivalPlace,
                    departureTime: new Date(roundTripInfo?.departureTime),
                    deviceLocation: deviceLocation,
                    trackingInfo: roundTripInfo,
                  });
                }
              }}
              disabled={!isStart}
            >
              <Text
                style={{
                  color: isStart
                    ? GlobalColors.button
                    : GlobalColors.icon_non_active,
                  fontSize: 15,
                  fontWeight: "700",
                }}
              >
                Tracking
              </Text>
            </TouchableOpacity>
          );
        },
      });
    }
  }, [tabScreenIndex]);
  useEffect(() => {
    //Get reservations by idTrip from database
    setIdTrip(route?.params?.idTrip);
    setIsHistory(route?.params?.isHistory);

    //Main Trip
    const temp = route?.params?.ticketInfo;

    const tickets = temp.reservationId.map((item, index) => {
      return {
        idPassenger: temp.PassengerData.at(index).id,
        reservationId: item,
        seatNumber: temp.seatNumber.at(index),
        fullName: temp.PassengerData.at(index).fullName,
        coachType: temp.ScheduleData.CoachData.CoachTypeData.typeName,
        status: temp.status, //0: unpaid, 1:paid
      };
    });
    const groupTicket = new Map();
    for (const group of tickets) {
      if (!groupTicket.has(group.idPassenger)) {
        groupTicket.set(group.idPassenger, [group]);
      } else {
        const tp = groupTicket.get(group.idPassenger);
        tp.push(group);
        groupTicket.set(group.idPassenger, tp);
      }
    }

    // const tickets = [
    //   {
    //     reservationId: "1",
    //     seatNumber: "12",
    //     fullName: "Nguyen Van A",
    //     coachType: "Limousine",
    //     status: 0, //0: unpaid, 1:paid
    //   },
    //   {
    //     reservationId: "SFS43434343",
    //     seatNumber: "54",
    //     fullName: "Nguyen Van B",
    //     coachType: "Limousine",
    //   },
    //   {
    //     reservationId: "SFS43434341",
    //     seatNumber: "23",
    //     fullName: "Nguyen Van C",
    //     coachType: "Limousine",
    //   },
    // ];
    setPassengers(tickets);
    setTickets(groupTicket.get(tickets.at(0).idPassenger));
    setGroupTickets(groupTicket);
    console.log(temp);
    const trip = {
      id: temp.ScheduleData.id,
      departureTime: new Date(temp.ScheduleData.departureTime),
      arrivalTime: new Date(temp.ScheduleData.arrivalTime),
      departurePlace: temp.ScheduleData.StartPlaceData.placeName,
      arrivalPlace: temp.ScheduleData.ArrivalPlaceData.placeName,
      // duration: calculateTimeDifference(
      //   new Date(2023, 9, 2, 18, 30, 0),
      //   new Date(2023, 9, 3, 7, 30, 0)
      // ),
      // duration: temp.ScheduleData.RouteData.duration + " h",
      duration: calculateTimeDifferenceV2(
        new Date(temp.ScheduleData.departureTime),
        new Date(temp.ScheduleData.arrivalTime)
      ),
      image: temp.ScheduleData.CoachData.image,
      coachId: temp.ScheduleData.CoachData.id,
      coachNumber: temp.ScheduleData.CoachData.coachNumber,
      coachCapacity: temp.ScheduleData.CoachData.capacity,
      coachType: temp.ScheduleData.CoachData.CoachTypeData.typeName,
      availableSeats: "4",
      distance: temp.ScheduleData.RouteData.distance,
      services: temp.ScheduleData.CoachData.ServiceData,
      status: temp.status,
      gate: temp?.ScheduleData?.gate,
      passengers: temp?.reservationId,
      roundTripDate:
        route?.params?.ticketInfo?.RoundTripTicketData?.length !== 0
          ? getDate(
              new Date(
                route?.params?.ticketInfo?.RoundTripTicketData[0].ScheduleData.departureTime
              )
            )
          : null,
      totalPrice: temp.totalPrice,
      singlePrice: temp.ScheduleData.price,
      members: {
        assistant: {
          id: temp.ScheduleData.CoachAssistantData.id,
          fullName: temp.ScheduleData.CoachAssistantData.fullName,
          phoneNumber: temp.ScheduleData.CoachAssistantData.phoneNumber,
        },
        driver: {
          id: temp.ScheduleData.DriverData.id,
          fullName: temp.ScheduleData.DriverData.fullName,
          phoneNumber: temp.ScheduleData.DriverData.phoneNumber,
        },
      },
      shuttleRoute:
        temp.ShuttleTicketData.length !== 0
          ? {
              departurePlace:
                temp.ShuttleTicketData[0].ShuttleRouteData.departurePlace,
              departureTime: new Date(
                temp.ShuttleTicketData[0].ShuttleRouteData.departureTime
              ),
              shuttleId: temp.ShuttleTicketData[0].id,
              shuttleCoach:
                temp.ShuttleTicketData[0].ShuttleRouteData.ShuttleData
                  .CoachData,
              departurePlaceLat:
                temp.ShuttleTicketData[0].ShuttleRouteData.departurePlaceLat,
              departurePlaceLng:
                temp.ShuttleTicketData[0].ShuttleRouteData.departurePlaceLng,
            }
          : null,
      shuttlePassengerIds:
        temp?.ShuttleTicketData.length !== 0
          ? temp.ShuttleTicketData.map((item) => item.id)
          : null,
      ShuttleTicketData:
        temp.ShuttleTicketData?.length !== 0 ? temp.ShuttleTicketData[0] : null,
      departurePlacePosition: temp.ScheduleData.StartPlaceData,
      arrivalPlacePosition: temp.ScheduleData.ArrivalPlaceData,
    };
    setTripInfo(trip);
    //Main Trip

    //Round Trip

    if (route?.params?.ticketInfo?.RoundTripTicketData?.length !== 0) {
      const temp1 = route?.params?.ticketInfo?.RoundTripTicketData[0];
      const temp2 = temp1?.ShuttleTicketData;
      const roundTrip = {
        id: temp1.ScheduleData.id,
        departureTime: new Date(temp1.ScheduleData.departureTime),
        arrivalTime: new Date(temp1.ScheduleData.arrivalTime),
        departurePlace: temp1.ScheduleData.StartPlaceData.placeName,
        arrivalPlace: temp1.ScheduleData.ArrivalPlaceData.placeName,
        duration: calculateTimeDifferenceV2(
          new Date(temp1.ScheduleData.departureTime),
          new Date(temp1.ScheduleData.arrivalTime)
        ),
        image: temp1.ScheduleData.CoachData.image,
        coachId: temp1.ScheduleData.CoachData.id,
        coachNumber: temp1.ScheduleData.CoachData.coachNumber,
        coachCapacity: temp1.ScheduleData.CoachData.capacity,
        coachType: temp1.ScheduleData.CoachData.CoachTypeData.typeName,
        availableSeats: "4",
        status: temp1.status,
        distance: temp1.ScheduleData.RouteData.distance,
        services: temp1.ScheduleData.CoachData?.ServiceData,
        totalPrice: temp1.totalPrice,
        singlePrice: temp1.ScheduleData.price,
        passengers: temp1?.reservationId,
        members: {
          assistant: {
            id: temp1.ScheduleData.CoachAssistantData.id,
            fullName: temp1.ScheduleData.CoachAssistantData.fullName,
            phoneNumber: temp1.ScheduleData.CoachAssistantData.phoneNumber,
          },
          driver: {
            id: temp1.ScheduleData.DriverData.id,
            fullName: temp1.ScheduleData.DriverData.fullName,
            phoneNumber: temp1.ScheduleData.DriverData.phoneNumber,
          },
        },
        shuttleRoute:
          temp2?.length !== 0
            ? {
                departurePlace: temp2[0]?.ShuttleRouteData.departurePlace,
                departureTime: new Date(
                  temp2[0]?.ShuttleRouteData.departureTime
                ),
                shuttleId: temp2[0]?.id,
                shuttleCoach: temp2[0]?.ShuttleRouteData.ShuttleData.CoachData,
                departurePlaceLat: temp2[0]?.ShuttleRouteData.departurePlaceLat,
                departurePlaceLng: temp2[0]?.ShuttleRouteData.departurePlaceLng,
              }
            : null,
        roundTripDate: null,
        shuttleRoundTripPassengerIds:
          temp2?.length !== 0 ? temp2.map((item) => item.id) : null,
        ShuttleTicketRoundTripData: temp2?.length !== 0 ? temp2[0] : null,
        departurePlacePosition: temp1.ScheduleData.StartPlaceData,
        arrivalPlacePosition: temp1.ScheduleData.ArrivalPlaceData,
      };
      const roundTripTickets = temp1.reservationId.map((item, index) => {
        return {
          idPassenger: temp1.PassengerData?.at(index).id,
          reservationId: item,
          seatNumber: temp1.seatNumber.at(index),
          fullName: temp1.PassengerData?.at(index).fullName,
          coachType: temp1.ScheduleData.CoachData.CoachTypeData.typeName,
          status: temp1.status, //0: unpaid, 1:paid
        };
      });
      const groupRoundTripTicket = new Map();
      for (const group of roundTripTickets) {
        if (!groupRoundTripTicket.has(group.idPassenger)) {
          groupRoundTripTicket.set(group.idPassenger, [group]);
        } else {
          const tp = groupRoundTripTicket.get(group.idPassenger);
          tp.push(group);
          groupRoundTripTicket.set(group.idPassenger, tp);
        }
      }
      setRoundTripPassengers(roundTripTickets);
      setRoundTripTickets(
        groupRoundTripTicket.get(roundTripTickets.at(0).idPassenger)
      );
      setRoundTripGroupTickets(groupRoundTripTicket);
      setRoundTripInfo(roundTrip);
    }

    //Round Trip
  }, []);

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
    if (minutes === 0) return `${0}`;
    return `${minutes}`;
  }

  function calculateTimeDifferenceV2(date1, date2) {
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
  function addDotsToNumber(number) {
    if (!number || number.toString() === "0") return "0";
    if (number) return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  function Separator() {
    return (
      <View
        style={{
          overflow: "hidden",
          marginTop: 20,
          width: 250,
          alignSelf: "center",
        }}
      >
        <View
          style={{
            borderStyle: "dashed",
            borderWidth: 2.5,
            borderColor: "black",
            margin: -2,
            marginTop: 0,
            opacity: 0.4,
          }}
        ></View>
      </View>
    );
  }

  function renderTicketItem(itemData, isRoundTrip) {
    // console.log(itemData.item);
    async function onShuttleHandler() {
      const valid = await getLocationHandler();
      if (!valid) return;
      console.log(
        tripInfo?.shuttleRoute?.departurePlaceLat,
        tripInfo?.shuttleRoute?.departurePlaceLng
      );
      navigation.navigate("ShuttleTrackingScreen", {
        idShuttle: tripInfo?.shuttleRoute?.shuttleId, // after has API to change it
        startPlace: tripInfo?.shuttleRoute.departurePlace,
        arrivalPlace: tripInfo?.departurePlacePosition?.placeName,

        start: {
          lat: tripInfo?.shuttleRoute?.departurePlaceLat,
          lng: tripInfo?.shuttleRoute?.departurePlaceLng,
        },
        destination: {
          lat: route?.params?.ticketInfo?.ScheduleData?.StartPlaceData
            ?.placeLat,
          lng: route?.params?.ticketInfo?.ScheduleData?.StartPlaceData
            ?.placeLng,
        },
        station: {},
        departureTime: new Date(tripInfo?.shuttleRoute?.departureTime),
        trackingInfo: route?.params?.ticketInfo?.ShuttleTicketData[0],
      });
    }

    async function onRoundTripShuttleHandler() {
      const valid = await getLocationHandler();
      if (!valid) return;
      navigation.navigate("ShuttleTrackingScreen", {
        idShuttle: roundTripInfo?.shuttleRoute?.shuttleId, // after has API to change it
        startPlace: roundTripInfo?.shuttleRoute.departurePlace,
        arrivalPlace: roundTripInfo?.departurePlacePosition?.placeName,
        start: {
          lat: roundTripInfo?.shuttleRoute?.departurePlaceLat,
          lng: roundTripInfo?.shuttleRoute?.departurePlaceLng,
        },
        destination: {
          lat: roundTripInfo?.departurePlacePosition.placeLat,
          lng: roundTripInfo?.departurePlacePosition.placeLng,
        },
        station: {},
        departureTime: new Date(roundTripInfo?.shuttleRoute?.departureTime),
        // trackingInfo: route?.params?.ticketInfo,
        trackingInfo: roundTripInfo?.ShuttleTicketRoundTripData,
      });
      // lat: roundTripInfo?.shuttleRoute?.departurePlaceLat,
      // lng: roundTripInfo?.shuttleRoute?.departurePlaceLng,
    }

    return (
      <View
        style={[
          {
            marginLeft: -10,
            marginVertical: 12,
          },
          itemData.index == 0 && { marginRight: 10 },
          itemData.index == tickets.length - 1 && { marginLeft: 10 },
          itemData.index != 0 && itemData.index != tickets.length - 1
            ? { marginLeft: 15, marginRight: 10 }
            : null,
          tickets.length === 1 && {
            marginLeft: -10,
            marginVertical: 12,
          },
          {
            // width: 370,
            alignContent: "center",
            alignSelf: "center",
            alignItems: "center",
            marginLeft: 5,
          },
        ]}
      >
        {!isRoundTrip && (
          <TicketItemNew
            tripInfo={tripInfo}
            ticket={itemData.item}
            isHistory={isHistory}
            paddingClose={true}
            shuttleHandler={onShuttleHandler}
            onCancelTicket={() => {}}
          />
        )}
        {isRoundTrip && (
          <TicketItemNew
            tripInfo={roundTripInfo}
            ticket={itemData.item}
            isHistory={isHistory}
            paddingClose={true}
            shuttleHandler={onRoundTripShuttleHandler}
            onCancelTicket={onCancelTicketHandler}
          />
        )}
      </View>
    );
  }

  function renderPassengers(itemData, isRoundTrip) {
    function savePassengerHandler() {
      setSelectedPassengerIndex(itemData.index);
      if (isRoundTrip) {
        setRoundTripTickets(
          roundTripGroupTickets.get(itemData.item.idPassenger)
        );
      } else {
        setTickets(groupTickets.get(itemData.item.idPassenger));
      }

      return;
    }

    return (
      <Pressable
        onPress={savePassengerHandler}
        style={({ pressed }) => [
          styles.savePassenger,
          pressed && styles.pressed,
          selectedPassengerIndex === itemData.index && {
            backgroundColor: "#2ed061",
          },
        ]}
      >
        <Ionicons name="person-outline" size={20} color="black" />
        <Text style={{ fontWeight: "700" }}>{itemData.item.fullName}</Text>
      </Pressable>
    );
  }

  const CustomTabBar = ({ state, descriptors, navigation }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          backgroundColor: GlobalColors.contentBackground,
        }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;
          const onPress = () => {
            console.log("index", state.index);
            setTabScreenIndex(index);
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          // Custom button for the tab
          const isButtonTab = route.name === "ButtonTab"; // Change this to the name of your button tab
          const buttonContent = isButtonTab ? (
            <TouchableOpacity
              onPress={() => {
                console.log("Button pressed");
              }}
            >
              <Text>Button</Text>
            </TouchableOpacity>
          ) : (
            <Text>{label}</Text>
          );

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={{
                flex: 1,
                alignItems: "center",
                paddingVertical: 16,
                backgroundColor: isFocused ? GlobalColors.button : "#524f4f30",
                margin: 5,
                marginBottom: 5,
                borderRadius: 10,
                color: "white",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: isFocused ? "white" : "black",
                }}
              >
                {buttonContent}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  function TripInformation({ tripInfo }) {
    function hasService(serviceName) {
      return tripInfo?.services.some((service) => service === serviceName);
    }
    return (
      <View
        style={{
          borderRadius: 10,
          paddingBottom: 0,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: 10,
          }}
        >
          <Image
            style={{
              height: 50,
              width: 90,
              borderRadius: 10,
            }}
            source={require("../../../assets/logo.png")}
          />
          <View
            style={{
              gap: 5,
              alignItems: "flex-end",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: GlobalColors.price,
                fontWeight: "bold",
                width: 100,
                textAlign: "center",
              }}
            >
              Faster Company
            </Text>
          </View>
        </View>
        <Separator />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingTop: 10,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: "#8C8D89",
              maxWidth: 120,
            }}
          >
            {tripInfo?.departurePlace}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "#8C8D89",
              maxWidth: 120,
            }}
          >
            {tripInfo?.arrivalPlace}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 10,
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "flex-start",
              gap: 5,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                paddingBottom: 5,
              }}
            >
              {getTime(tripInfo?.departureTime)}
            </Text>
            <Text
              style={{
                fontSize: 11,
                opacity: 0.5,
              }}
            >
              {getDate(tripInfo?.departureTime)}
            </Text>
          </View>

          <View
            style={{
              alignItems: "center",
              marginHorizontal: 15,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Octicons name="dot" size={22} color="#1C6AE4" />
              <View
                style={{
                  height: 1,
                  width: 120,
                  borderTopWidth: 1,
                  borderTopColor: "#1C6AE4",
                  opacity: 0.3,
                }}
              ></View>
              <Octicons name="dot-fill" size={22} color="#1C6AE4" />
            </View>
            <View style={{ marginTop: -33 }}>
              <MaterialCommunityIcons
                name="bus-articulated-front"
                size={24}
                color="#1C6AE4"
              />
            </View>
            <Text
              style={[
                {
                  fontSize: 11,
                  opacity: 0.5,
                },
                { marginTop: 0 },
              ]}
            >
              {" "}
              {tripInfo?.duration}{" "}
            </Text>
          </View>

          <View
            style={{
              justifyContent: "center",
              alignItems: "flex-end",
              gap: 5,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                paddingBottom: 5,
              }}
            >
              {getTime(tripInfo?.arrivalTime)}
            </Text>
            <Text
              style={{
                fontSize: 11,
                opacity: 0.5,
              }}
            >
              {getDate(tripInfo?.arrivalTime)}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 10,
          }}
        >
          {hasService("Air Conditioner") && (
            <View style={styles.imageIconContainer}>
              <Image
                style={styles.imageIcon}
                source={require("../../../icon/air_conditioner.png")}
              />
            </View>
          )}

          {hasService("Wifi") && (
            <View style={styles.imageIconContainer}>
              <Image
                style={styles.imageIcon}
                source={require("../../../icon/wifi.png")}
              />
            </View>
          )}

          {hasService("TV") && (
            <View style={styles.imageIconContainer}>
              <Image
                style={styles.imageIcon}
                source={require("../../../icon/television.png")}
              />
            </View>
          )}

          {hasService("Blanket") && (
            <View style={styles.imageIconContainer}>
              <Image
                style={styles.imageIcon}
                source={require("../../../icon/blanket.png")}
              />
            </View>
          )}

          {hasService("Charging Socket") && (
            <View style={styles.imageIconContainer}>
              <Image
                style={styles.imageIcon}
                source={require("../../../icon/power_plug.png")}
              />
            </View>
          )}

          {hasService("Mattress") && (
            <View style={styles.imageIconContainer}>
              <Image
                style={styles.imageIcon}
                source={require("../../../icon/air_mattress.png")}
              />
            </View>
          )}

          {hasService("Earphone") && (
            <View style={styles.imageIconContainer}>
              <Image
                style={styles.imageIcon}
                source={require("../../../icon/headphones.png")}
              />
            </View>
          )}

          {hasService("Toilet") && (
            <View style={styles.imageIconContainer}>
              <Image
                style={styles.imageIcon}
                source={require("../../../icon/toilets.png")}
              />
            </View>
          )}
          {hasService("Food") && (
            <View style={styles.imageIconContainer}>
              <Image
                style={styles.imageIcon}
                source={require("../../../icon/food.png")}
              />
            </View>
          )}
          {hasService("Drink") && (
            <View style={styles.imageIconContainer}>
              <Image
                style={styles.imageIcon}
                source={require("../../../icon/drink.png")}
              />
            </View>
          )}
        </View>
      </View>
    );
  }

  async function onCancelTicketHandler() {
    // {
    //   "reservations": ["2", "3"],
    //   "reservationsRoundTrip": ["1", "2"], // optional
    //   "shuttlePassenger": ["1", "2"], // optional
    //   "shuttlePassengerRoundTrip": ["3", "4"], // optional
    // }
    const body = {
      reservations: tripInfo?.passengers,
    };
    if (roundTripInfo?.passengers) {
      body.reservationsRoundTrip = roundTripInfo?.passengers;
      if (roundTripInfo?.shuttleRoundTripPassengerIds) {
        body.shuttlePassengerRoundTrip =
          roundTripInfo?.shuttleRoundTripPassengerIds;
      }
    }
    if (tripInfo?.shuttlePassengerIds) {
      body.shuttlePassenger = tripInfo?.shuttlePassengerIds;
    }
    console.log("Cancel body: ", body);
    const res = await cancelTicketWhenFinishedConfirm(authCtx.token, body);
    if (!res) {
      Alert.alert("Connection Error", "Please check your internet connection");
      return;
    }
    Alert.alert("Success", "Your reservation has been cancelled successfully");
    navigation.pop();
  }
  return (
    <>
      <YesNoPopUp
        title={"Are you Sure"}
        textBody={"This action will cancel your reservations"}
        isVisible={isShowCancel}
        NoHandler={() => setIsShowCancel((curr) => !curr)}
        YesHandler={onCancelTicketHandler}
      />
      {tripInfo && (
        <RatingFeedbackScreen
          isVisible={isShowModal}
          isRating={isRating}
          userName={authCtx.userName}
          coachNumber={tripInfo?.coachNumber}
          onCancel={() => setIsShowModal((curr) => !curr)}
          image={
            "https://www.nationalexpress.com/media/7570/nx-coach-nav-pod-web.jpg"
          }
          coachMember={tripInfo?.members}
          idTrip={tripInfo?.id}
        />
      )}
      <View style={[styles.root]}>
        <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />}>
          <Tab.Screen name="Main Trip">
            {(props) => (
              <View
                style={{
                  backgroundColor: GlobalColors.contentBackground,
                  height: "100%",
                }}
              >
                <View
                  style={[
                    styles.scrollView,
                    { backgroundColor: GlobalColors.contentBackground },
                  ]}
                >
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <View>
                      {/* Trip Information */}
                      <View
                        style={{
                          gap: 15,
                          alignItems: "center",
                          // marginLeft: 40,
                          backgroundColor: "white",
                          borderRadius: 10,
                          padding: 5,
                          paddingVertical: 10,
                        }}
                      >
                        <TripInformation tripInfo={tripInfo} />
                      </View>
                      {/* Trip Information */}
                      {/* Assistant */}
                      <View
                        style={{
                          gap: 15,
                          alignItems: "center",
                          // marginLeft: 40,
                          backgroundColor: "white",
                          borderRadius: 10,
                          padding: 5,
                          marginTop: 10,
                        }}
                      >
                        <View
                          style={{
                            gap: 10,
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "row",
                            width: "100%",
                            alignSelf: "center",
                          }}
                        >
                          <View style={[styles.rowStyle]}>
                            <Image
                              style={styles.image}
                              source={require("../../../icon/driver.png")}
                            />
                            <View style={{ gap: 5 }}>
                              <Text style={styles.name}>
                                {tripInfo?.members?.driver?.fullName}
                              </Text>
                              <Text style={styles.phoneNumber}>
                                {tripInfo?.members?.driver?.phoneNumber}
                              </Text>
                            </View>
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              // width: 190,
                            }}
                          >
                            <Image
                              style={{
                                width: 40,
                                height: 40,
                                marginRight: 20,
                                marginLeft: -5,
                              }}
                              source={require("../../../icon/businesswoman.png")}
                            />
                            <View style={{ gap: 5, marginLeft: -5 }}>
                              <Text style={styles.name}>
                                {tripInfo?.members?.assistant?.fullName}
                              </Text>
                              <Text style={styles.phoneNumber}>
                                {tripInfo?.members?.assistant?.phoneNumber}
                              </Text>
                            </View>
                          </View>
                        </View>
                        <View
                          style={{
                            gap: 30,
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "row",
                            marginLeft: -20,
                          }}
                        >
                          <View style={styles.rowStyle}>
                            <Image
                              style={styles.image}
                              source={require("../../../icon/licensePlate.png")}
                            />
                            <View style={{ gap: 5 }}>
                              <Text
                                style={[
                                  styles.phoneNumber,
                                  {
                                    fontSize: 15,
                                  },
                                ]}
                              >
                                {tripInfo?.coachNumber}
                              </Text>
                            </View>
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              // width: 190,
                              alignItems: "center",
                            }}
                          >
                            <Image
                              style={{
                                width: 40,
                                height: 40,
                                marginRight: 20,
                                marginLeft: -5,
                              }}
                              source={require("../../../icon/seatsQuantity.png")}
                            />
                            <View style={{ gap: 5, marginLeft: -5 }}>
                              <Text
                                style={[
                                  styles.phoneNumber,
                                  {
                                    fontSize: 15,
                                  },
                                ]}
                              >
                                {tripInfo?.coachCapacity} seats
                              </Text>
                            </View>
                          </View>
                        </View>
                        {/* Total Price */}
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginLeft: -15,
                          }}
                        >
                          <Image
                            style={{
                              width: 40,
                              height: 40,
                              marginRight: 20,
                              marginLeft: -5,
                            }}
                            source={require("../../../icon/totalPrice.png")}
                          />
                          <View style={{ gap: 5, marginLeft: -15 }}>
                            <Text
                              style={[
                                styles.phoneNumber,
                                {
                                  fontSize: 15,
                                  color: "red",
                                  fontWeight: "bold",
                                },
                              ]}
                            >
                              {addDotsToNumber(tripInfo?.totalPrice)} VNĐ{" "}
                              <Text
                                style={{ color: "gray", fontWeight: "normal" }}
                              >
                                {"(" +
                                  addDotsToNumber(tripInfo?.singlePrice) +
                                  " VNĐ / seat)"}
                              </Text>
                            </Text>
                          </View>
                        </View>
                        {/* Total Price */}
                        {/* Gate */}
                        <View
                          style={{
                            flexDirection: "row",
                            width: "100%",
                            justifyContent: "flex-start",
                            gap: 70,
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "flex-start",
                              alignSelf: "flex-start",
                              marginLeft: 20,
                              gap: 7,
                            }}
                          >
                            <Image
                              style={{
                                width: 40,
                                height: 40,
                                marginRight: 20,
                                marginLeft: -5,
                              }}
                              source={require("../../../icon/coachGate.png")}
                            />
                            <View style={{ gap: 5, marginLeft: -15 }}>
                              <Pressable
                                style={({ pressed }) => [
                                  pressed && { opacity: 0.6 },
                                ]}
                                // onPress={shuttleHandler}
                              >
                                <Text
                                  style={[
                                    styles.subTitle,
                                    {
                                      maxWidth: 110,
                                      color: tripInfo?.shuttleRoute
                                        ? GlobalColors.button
                                        : "gray",
                                      fontWeight:
                                        tripInfo?.shuttleRoute && "bold",
                                    },
                                  ]}
                                  numberOfLines={1}
                                >
                                  Gate 13
                                </Text>
                              </Pressable>
                            </View>
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "flex-start",
                              alignSelf: "flex-start",
                              gap: 7,
                            }}
                          >
                            <Image
                              style={{
                                width: 40,
                                height: 40,
                                marginRight: 20,
                                marginLeft: -5,
                              }}
                              source={require("../../../icon/status.png")}
                            />
                            <View style={{ gap: 5, marginLeft: -15 }}>
                              <Pressable
                                style={({ pressed }) => [
                                  pressed && { opacity: 0.6 },
                                ]}
                                // onPress={shuttleHandler}
                              >
                                <Text
                                  style={[
                                    styles.subTitle,
                                    {
                                      maxWidth: 110,
                                      color: tripInfo?.shuttleRoute
                                        ? GlobalColors.button
                                        : "gray",
                                      fontWeight:
                                        tripInfo?.shuttleRoute && "bold",
                                    },
                                  ]}
                                  numberOfLines={1}
                                >
                                  UnStarting
                                </Text>
                              </Pressable>
                            </View>
                          </View>
                        </View>

                        {/* Gate */}
                      </View>
                      {/* Assistant */}

                      {/* Process */}
                      <View
                        style={[
                          styles.tracking,
                          {
                            gap: 15,
                            alignItems: "center",
                            // marginLeft: 40,
                            backgroundColor: "white",
                            borderRadius: 10,
                            padding: 5,
                            marginTop: 10,
                            paddingBottom: 10,
                          },
                        ]}
                      >
                        <Text style={styles.name}>Process</Text>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            marginTop: 10,
                          }}
                        >
                          <View
                            style={{
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Image
                              style={{ width: 27, height: 40 }}
                              source={require("../../../icon/position.png")}
                            />
                            <Text
                              numberOfLines={1}
                              style={[
                                styles.text,
                                {
                                  maxWidth: 60,
                                },
                              ]}
                            >
                              {tripInfo?.departurePlace}
                            </Text>
                          </View>
                          <View
                            style={{
                              justifyContent: "flex-end",
                              marginLeft: -18,
                              marginRight: -15,
                              paddingBottom: 18,
                            }}
                          >
                            <View style={{ zIndex: 1 }}>
                              <Progress.Bar
                                progress={progressValue}
                                width={250}
                                height={6}
                                borderWidth={0}
                                color="#12d252"
                              />
                            </View>
                            <View
                              style={{
                                position: "absolute",
                                zIndex: 0,
                                right: 0,
                                // left: 20,
                                left: 0,
                                top: 10,
                                bottom: 0,
                              }}
                            >
                              <Text
                                style={{
                                  alignSelf: "center",
                                  fontSize: 15,
                                  fontWeight: "600",
                                }}
                              >
                                {(tripInfo?.distance * progressValue).toFixed(
                                  1
                                )}{" "}
                                km
                              </Text>
                            </View>
                            <View
                              style={{
                                position: "absolute",
                                bottom: 19,
                                zIndex: 0,
                              }}
                            >
                              <Separator />
                            </View>
                          </View>
                          <View
                            style={{
                              justifyContent: "center",
                              alignItems: "center",
                              marginLeft: -20,
                            }}
                          >
                            <Image
                              style={{ width: 27, height: 40 }}
                              source={require("../../../icon/position.png")}
                            />
                            <Text
                              numberOfLines={1}
                              style={[
                                styles.text,
                                {
                                  maxWidth: 60,
                                },
                              ]}
                            >
                              {tripInfo?.arrivalPlace}
                            </Text>
                          </View>

                          <View
                            style={{
                              position: "absolute",
                              zIndex: 0,
                              right: 0,
                              left: 0,
                              top: 45,
                              bottom: 0,
                            }}
                          >
                            <Text
                              style={{
                                alignSelf: "center",
                                fontSize: 15,
                                fontWeight: "600",
                                opacity: 0.5,
                              }}
                            >
                              {tripInfo?.distance} km
                            </Text>
                          </View>
                        </View>
                      </View>
                      {/* Process */}

                      <View
                        style={[
                          styles.ticketContainer,
                          {
                            gap: 15,
                            alignItems: "center",
                            // marginLeft: 40,
                            backgroundColor: "white",
                            borderRadius: 10,
                            padding: 5,
                            marginTop: 10,
                            paddingBottom: 10,
                          },
                        ]}
                      >
                        <Text
                          style={{
                            fontSize: 20,
                            fontWeight: "600",
                            color: GlobalColors.validate,
                          }}
                        >
                          Tickets
                        </Text>

                        <View
                          style={{
                            width: "100%",
                            alignItems: "center",
                          }}
                        >
                          <FlatList
                            style={{
                              width: "100%",
                            }}
                            horizontal
                            data={passengers}
                            keyExtractor={(item, index) => index}
                            renderItem={(itemData) =>
                              renderPassengers(itemData, false)
                            }
                            showsHorizontalScrollIndicator={false}
                          />
                        </View>

                        <FlatList
                          style={styles.ticketList}
                          data={tickets}
                          horizontal
                          pagingEnabled
                          keyExtractor={(item, index) => index}
                          renderItem={(itemData) =>
                            renderTicketItem(itemData, false)
                          }
                          showsHorizontalScrollIndicator={false}
                          snapToInterval={screenWidth}
                          decelerationRate="fast"
                          scrollEnabled={false}
                        />
                      </View>
                    </View>
                  </ScrollView>
                </View>
              </View>
            )}
          </Tab.Screen>
          {/* Round Trip */}
          {/* route?.params?.ticketInfo?.isRoundTrip */}
          {roundTripInfo && (
            <Tab.Screen name="Round Trip">
              {(props) => (
                <View
                  style={{
                    backgroundColor: GlobalColors.contentBackground,
                    height: "100%",
                  }}
                >
                  <View
                    style={[
                      styles.scrollView,
                      { backgroundColor: GlobalColors.contentBackground },
                    ]}
                  >
                    <ScrollView showsVerticalScrollIndicator={false}>
                      <View>
                        {/* Trip Information */}
                        <View
                          style={{
                            gap: 15,
                            alignItems: "center",
                            // marginLeft: 40,
                            backgroundColor: "white",
                            borderRadius: 10,
                            padding: 5,
                            paddingVertical: 10,
                          }}
                        >
                          <TripInformation tripInfo={roundTripInfo} />
                        </View>
                        {/* Trip Information */}
                        {/* Assistant */}
                        <View
                          style={{
                            gap: 15,
                            alignItems: "center",
                            // marginLeft: 40,
                            backgroundColor: "white",
                            borderRadius: 10,
                            padding: 5,
                            marginTop: 10,
                          }}
                        >
                          <View
                            style={{
                              gap: 10,
                              alignItems: "center",
                              justifyContent: "center",
                              flexDirection: "row",
                              width: "100%",
                              alignSelf: "center",
                            }}
                          >
                            <View style={[styles.rowStyle]}>
                              <Image
                                style={styles.image}
                                source={require("../../../icon/driver.png")}
                              />
                              <View style={{ gap: 5 }}>
                                <Text style={styles.name}>
                                  {roundTripInfo?.members?.driver?.fullName}
                                </Text>
                                <Text style={styles.phoneNumber}>
                                  {roundTripInfo?.members?.driver?.phoneNumber}
                                </Text>
                              </View>
                            </View>
                            <View
                              style={{
                                flexDirection: "row",
                                // width: 190,
                              }}
                            >
                              <Image
                                style={{
                                  width: 40,
                                  height: 40,
                                  marginRight: 20,
                                  marginLeft: -5,
                                }}
                                source={require("../../../icon/businesswoman.png")}
                              />
                              <View style={{ gap: 5, marginLeft: -5 }}>
                                <Text style={styles.name}>
                                  {roundTripInfo?.members?.assistant?.fullName}
                                </Text>
                                <Text style={styles.phoneNumber}>
                                  {
                                    roundTripInfo?.members?.assistant
                                      ?.phoneNumber
                                  }
                                </Text>
                              </View>
                            </View>
                          </View>
                          <View
                            style={{
                              gap: 30,
                              alignItems: "center",
                              justifyContent: "center",
                              flexDirection: "row",
                              marginLeft: -20,
                            }}
                          >
                            <View style={styles.rowStyle}>
                              <Image
                                style={styles.image}
                                source={require("../../../icon/licensePlate.png")}
                              />
                              <View style={{ gap: 5 }}>
                                <Text
                                  style={[
                                    styles.phoneNumber,
                                    {
                                      fontSize: 15,
                                    },
                                  ]}
                                >
                                  {roundTripInfo?.coachNumber}
                                </Text>
                              </View>
                            </View>
                            <View
                              style={{
                                flexDirection: "row",
                                // width: 190,
                                alignItems: "center",
                              }}
                            >
                              <Image
                                style={{
                                  width: 40,
                                  height: 40,
                                  marginRight: 20,
                                  marginLeft: -5,
                                }}
                                source={require("../../../icon/seatsQuantity.png")}
                              />
                              <View style={{ gap: 5, marginLeft: -5 }}>
                                <Text
                                  style={[
                                    styles.phoneNumber,
                                    {
                                      fontSize: 15,
                                    },
                                  ]}
                                >
                                  {roundTripInfo?.coachCapacity} seats
                                </Text>
                              </View>
                            </View>
                          </View>
                          {/* Total Price */}
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginLeft: -15,
                            }}
                          >
                            <Image
                              style={{
                                width: 40,
                                height: 40,
                                marginRight: 20,
                                marginLeft: -5,
                              }}
                              source={require("../../../icon/totalPrice.png")}
                            />
                            <View style={{ gap: 5, marginLeft: -15 }}>
                              <Text
                                style={[
                                  styles.phoneNumber,
                                  {
                                    fontSize: 15,
                                    color: "red",
                                    fontWeight: "bold",
                                  },
                                ]}
                              >
                                {addDotsToNumber(roundTripInfo?.totalPrice)} VNĐ{" "}
                                <Text
                                  style={{
                                    color: "gray",
                                    fontWeight: "normal",
                                  }}
                                >
                                  {"(" +
                                    addDotsToNumber(
                                      roundTripInfo?.singlePrice
                                    ) +
                                    " VNĐ / seat)"}
                                </Text>
                              </Text>
                            </View>
                          </View>
                          {/* Total Price */}
                          {/* Gate */}
                          <View
                            style={{
                              flexDirection: "row",
                              width: "100%",
                              justifyContent: "flex-start",
                              gap: 70,
                            }}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "flex-start",
                                alignSelf: "flex-start",
                                marginLeft: 20,
                                gap: 7,
                              }}
                            >
                              <Image
                                style={{
                                  width: 40,
                                  height: 40,
                                  marginRight: 20,
                                  marginLeft: -5,
                                }}
                                source={require("../../../icon/coachGate.png")}
                              />
                              <View style={{ gap: 5, marginLeft: -15 }}>
                                <Pressable
                                  style={({ pressed }) => [
                                    pressed && { opacity: 0.6 },
                                  ]}
                                  // onPress={shuttleHandler}
                                >
                                  <Text
                                    style={[
                                      styles.subTitle,
                                      {
                                        maxWidth: 110,
                                        color: tripInfo?.shuttleRoute
                                          ? GlobalColors.button
                                          : "gray",
                                        fontWeight:
                                          tripInfo?.shuttleRoute && "bold",
                                      },
                                    ]}
                                    numberOfLines={1}
                                  >
                                    Gate 13
                                  </Text>
                                </Pressable>
                              </View>
                            </View>
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "flex-start",
                                alignSelf: "flex-start",
                                gap: 7,
                              }}
                            >
                              <Image
                                style={{
                                  width: 40,
                                  height: 40,
                                  marginRight: 20,
                                  marginLeft: -5,
                                }}
                                source={require("../../../icon/status.png")}
                              />
                              <View style={{ gap: 5, marginLeft: -15 }}>
                                <Pressable
                                  style={({ pressed }) => [
                                    pressed && { opacity: 0.6 },
                                  ]}
                                  // onPress={shuttleHandler}
                                >
                                  <Text
                                    style={[
                                      styles.subTitle,
                                      {
                                        maxWidth: 110,
                                        color: roundTripInfo?.shuttleRoute
                                          ? GlobalColors.button
                                          : "gray",
                                        fontWeight:
                                          roundTripInfo?.shuttleRoute && "bold",
                                      },
                                    ]}
                                    numberOfLines={1}
                                  >
                                    UnStarting
                                  </Text>
                                </Pressable>
                              </View>
                            </View>
                          </View>

                          {/* Gate */}
                        </View>
                        {/* Assistant */}

                        {/* Process */}
                        <View
                          style={[
                            styles.tracking,
                            {
                              gap: 15,
                              alignItems: "center",
                              // marginLeft: 40,
                              backgroundColor: "white",
                              borderRadius: 10,
                              padding: 5,
                              marginTop: 10,
                              paddingBottom: 10,
                            },
                          ]}
                        >
                          <Text style={styles.name}>Process</Text>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "center",
                              marginTop: 10,
                            }}
                          >
                            <View
                              style={{
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Image
                                style={{ width: 27, height: 40 }}
                                source={require("../../../icon/position.png")}
                              />
                              <Text
                                numberOfLines={1}
                                style={[
                                  styles.text,
                                  {
                                    maxWidth: 60,
                                  },
                                ]}
                              >
                                {roundTripInfo?.departurePlace}
                              </Text>
                            </View>
                            <View
                              style={{
                                justifyContent: "flex-end",
                                marginLeft: -18,
                                marginRight: -15,
                                paddingBottom: 18,
                              }}
                            >
                              <View style={{ zIndex: 1 }}>
                                <Progress.Bar
                                  progress={progressValue}
                                  width={250}
                                  height={6}
                                  borderWidth={0}
                                  color="#12d252"
                                />
                              </View>
                              <View
                                style={{
                                  position: "absolute",
                                  zIndex: 0,
                                  right: 0,
                                  // left: 20,
                                  left: 0,
                                  top: 10,
                                  bottom: 0,
                                }}
                              >
                                <Text
                                  style={{
                                    alignSelf: "center",
                                    fontSize: 15,
                                    fontWeight: "600",
                                  }}
                                >
                                  {(
                                    roundTripInfo?.distance * progressValue
                                  ).toFixed(1)}{" "}
                                  km
                                </Text>
                              </View>
                              <View
                                style={{
                                  position: "absolute",
                                  bottom: 19,
                                  zIndex: 0,
                                }}
                              >
                                <Separator />
                              </View>
                            </View>
                            <View
                              style={{
                                justifyContent: "center",
                                alignItems: "center",
                                marginLeft: -20,
                              }}
                            >
                              <Image
                                style={{ width: 27, height: 40 }}
                                source={require("../../../icon/position.png")}
                              />
                              <Text
                                numberOfLines={1}
                                style={[
                                  styles.text,
                                  {
                                    maxWidth: 60,
                                  },
                                ]}
                              >
                                {roundTripInfo?.arrivalPlace}
                              </Text>
                            </View>

                            <View
                              style={{
                                position: "absolute",
                                zIndex: 0,
                                right: 0,
                                left: 0,
                                top: 45,
                                bottom: 0,
                              }}
                            >
                              <Text
                                style={{
                                  alignSelf: "center",
                                  fontSize: 15,
                                  fontWeight: "600",
                                  opacity: 0.5,
                                }}
                              >
                                {roundTripInfo?.distance} km
                              </Text>
                            </View>
                          </View>
                        </View>
                        {/* Process */}

                        <View
                          style={[
                            styles.ticketContainer,
                            {
                              gap: 15,
                              alignItems: "center",
                              // marginLeft: 40,
                              backgroundColor: "white",
                              borderRadius: 10,
                              padding: 5,
                              marginTop: 10,
                              paddingBottom: 10,
                            },
                          ]}
                        >
                          <Text
                            style={{
                              fontSize: 20,
                              fontWeight: "600",
                              color: GlobalColors.validate,
                            }}
                          >
                            Tickets
                          </Text>
                          <View
                            style={{
                              width: "100%",
                              alignItems: "center",
                            }}
                          >
                            <FlatList
                              style={{
                                width: "100%",
                              }}
                              horizontal
                              data={roundTripPassengers}
                              keyExtractor={(item, index) => index}
                              renderItem={(itemData) =>
                                renderPassengers(itemData, true)
                              }
                              showsHorizontalScrollIndicator={false}
                            />
                          </View>

                          <FlatList
                            style={styles.ticketList}
                            data={roundTripTickets}
                            horizontal
                            pagingEnabled
                            keyExtractor={(item, index) => index}
                            renderItem={(itemData) =>
                              renderTicketItem(itemData, true)
                            }
                            showsHorizontalScrollIndicator={false}
                            snapToInterval={screenWidth}
                            decelerationRate="fast"
                            scrollEnabled={false}
                          />
                        </View>
                      </View>
                    </ScrollView>
                  </View>
                </View>
              )}
            </Tab.Screen>
          )}
        </Tab.Navigator>
        {/* <View style={styles.scrollView}>
          <ScrollView showsVerticalScrollIndicator="false">
            <View>
              <View
                style={{
                  gap: 15,
                  alignItems: "left",
                  marginLeft: 40,
                }}
              >
                <View
                  style={{
                    gap: 10,
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                  }}
                >
                  <View style={styles.rowStyle}>
                    <Image
                      style={styles.image}
                      source={require("../../../icon/driver.png")}
                    />
                    <View style={{ gap: 5 }}>
                      <Text style={styles.name}>
                        {tripInfo?.members?.driver?.fullName}
                      </Text>
                      <Text style={styles.phoneNumber}>
                        {tripInfo?.members?.driver?.phoneNumber}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      width: 190,
                    }}
                  >
                    <Image
                      style={{
                        width: 40,
                        height: 40,
                        marginRight: 20,
                        marginLeft: -5,
                      }}
                      source={require("../../../icon/businesswoman.png")}
                    />
                    <View style={{ gap: 5, marginLeft: -5 }}>
                      <Text style={styles.name}>
                        {tripInfo?.members?.assistant?.fullName}
                      </Text>
                      <Text style={styles.phoneNumber}>
                        {tripInfo?.members?.assistant?.phoneNumber}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    gap: 30,
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                  }}
                >
                  <View style={styles.rowStyle}>
                    <Image
                      style={styles.image}
                      source={require("../../../icon/licensePlate.png")}
                    />
                    <View style={{ gap: 5 }}>
                      <Text
                        style={[
                          styles.phoneNumber,
                          {
                            fontSize: 15,
                          },
                        ]}
                      >
                        {tripInfo?.coachNumber}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      width: 190,
                      alignItems: "center",
                    }}
                  >
                    <Image
                      style={{
                        width: 40,
                        height: 40,
                        marginRight: 20,
                        marginLeft: -5,
                      }}
                      source={require("../../../icon/seatsQuantity.png")}
                    />
                    <View style={{ gap: 5, marginLeft: -5 }}>
                      <Text
                        style={[
                          styles.phoneNumber,
                          {
                            fontSize: 15,
                          },
                        ]}
                      >
                        {tripInfo?.coachCapacity} seats
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginLeft: -15,
                  }}
                >
                  <Image
                    style={{
                      width: 40,
                      height: 40,
                      marginRight: 20,
                      marginLeft: -5,
                    }}
                    source={require("../../../icon/totalPrice.png")}
                  />
                  <View style={{ gap: 5, marginLeft: -15 }}>
                    <Text
                      style={[
                        styles.phoneNumber,
                        {
                          fontSize: 15,
                          color: "red",
                          fontWeight: "bold",
                        },
                      ]}
                    >
                      {addDotsToNumber(tripInfo?.totalPrice)} VNĐ{" "}
                      <Text style={{ color: "gray", fontWeight: "normal" }}>
                        {"(" +
                          addDotsToNumber(tripInfo?.singlePrice) +
                          " VNĐ / seat)"}
                      </Text>
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.tracking}>
                <Text style={styles.name}>Process</Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginTop: 10,
                  }}
                >
                  <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <Image
                      style={{ width: 27, height: 40 }}
                      source={require("../../../icon/position.png")}
                    />
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.text,
                        {
                          maxWidth: 60,
                        },
                      ]}
                    >
                      {tripInfo?.departurePlace}
                    </Text>
                  </View>
                  <View
                    style={{
                      justifyContent: "flex-end",
                      marginLeft: -18,
                      marginRight: -15,
                      paddingBottom: 18,
                    }}
                  >
                    <View style={{ zIndex: 1 }}>
                      <Progress.Bar
                        progress={progressValue}
                        width={250}
                        height={6}
                        borderWidth={0}
                        color="#12d252"
                      />
                    </View>
                    <View
                      style={{
                        position: "absolute",
                        zIndex: 0,
                        right: 0,
                        left: 20,
                        top: 10,
                        bottom: 0,
                      }}
                    >
                      <Text
                        style={{
                          alignSelf: "center",
                          fontSize: 15,
                          fontWeight: "600",
                        }}
                      >
                        {(tripInfo?.distance * progressValue).toFixed(1)} km
                      </Text>
                    </View>
                    <View
                      style={{ position: "absolute", bottom: 19, zIndex: 0 }}
                    >
                      <Separator />
                    </View>
                  </View>
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      marginLeft: -20,
                    }}
                  >
                    <Image
                      style={{ width: 27, height: 40 }}
                      source={require("../../../icon/position.png")}
                    />
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.text,
                        {
                          maxWidth: 60,
                        },
                      ]}
                    >
                      {tripInfo?.arrivalPlace}
                    </Text>
                  </View>

                  <View
                    style={{
                      position: "absolute",
                      zIndex: 0,
                      right: 0,
                      left: 0,
                      top: 45,
                      bottom: 0,
                    }}
                  >
                    <Text
                      style={{
                        alignSelf: "center",
                        fontSize: 15,
                        fontWeight: "600",
                        opacity: 0.5,
                      }}
                    >
                      {tripInfo?.distance} km
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.ticketContainer}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "600",
                    color: GlobalColors.validate,
                    marginBottom: 10,
                  }}
                >
                  Tickets
                </Text>
                <View
                  style={{
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <FlatList
                    style={{
                      width: "100%",
                    }}
                    horizontal
                    data={passengers}
                    keyExtractor={(item, index) => index}
                    renderItem={(itemData) => renderPassengers(itemData)}
                    showsHorizontalScrollIndicator={false}
                  />
                </View>

                <FlatList
                  style={styles.ticketList}
                  data={tickets}
                  horizontal
                  pagingEnabled
                  keyExtractor={(item, index) => index}
                  renderItem={renderTicketItem}
                  showsHorizontalScrollIndicator={false}
                  snapToInterval={screenWidth}
                  decelerationRate="fast"
                />
              </View>
            </View>
          </ScrollView>
        </View> */}

        {/* Rating */}
        {!route?.params?.isManager && (
          <View
            style={{
              marginHorizontal: 10,
              flexDirection: "row",
              gap: 10,
              marginBottom: 30,
              marginTop: 10,
            }}
          >
            {isHistory && (
              <View style={{ flex: 1 }}>
                <CustomButton
                  radius={10}
                  color={"#F0DB18"}
                  onPress={() => {
                    setIsShowModal((curr) => !curr);
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: "white",
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    Rating
                  </Text>
                </CustomButton>
              </View>
            )}
            {!route?.params?.isHistory && (
              <View style={{ flex: 1 }}>
                <CustomButton
                  radius={10}
                  color={"#F0DB18"}
                  onPress={() => {
                    setIsShowCancel((curr) => !curr);
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: "white",
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    Cancel
                  </Text>
                </CustomButton>
              </View>
            )}
            <View style={{ flex: 1 }}>
              <CustomButton
                radius={10}
                color={"#f16710"}
                onPress={() => {
                  setIsRating(false);
                  setIsShowModal((curr) => !curr);
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: "white",
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  Report
                </Text>
              </CustomButton>
            </View>
          </View>
        )}
      </View>
    </>
  );
}

export default TicketDetailScreen;
const styles = StyleSheet.create({
  root: {
    flex: 1,
    // margin: 10,
    // backgroundColor: "white",
    borderRadius: 10,
    // padding: 10,
    // marginBottom: 90,
  },
  scrollView: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    margin: 10,
    flex: 9,
    marginBottom: 20,
  },
  image: {
    width: 40,
    height: 40,
  },
  rowStyle: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
  },
  phoneNumber: {
    color: GlobalColors.price,
  },
  tracking: {
    marginTop: 20,
  },
  text: {
    marginTop: 5,
    fontWeight: "500",
  },
  ticketContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  ticketList: {
    // marginLeft: -10,
    marginTop: -10,
    width: "100%",
  },
  pressed: {
    opacity: 0.6,
  },
  savePassenger: {
    flexDirection: "row",
    padding: 5,
    gap: 5,
    backgroundColor: "white",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "black",
    borderWidth: 0.5,
    marginRight: 10,
  },
  imageIcon: {
    height: 25,
    width: 25,
  },
  imageIconContainer: {
    borderWidth: 1,
    borderRadius: 15,
    padding: 4,
    paddingHorizontal: 6,
    marginRight: 5,
  },
});
