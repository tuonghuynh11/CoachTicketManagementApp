import { Text, View, StyleSheet, FlatList, Image, Alert } from "react-native";
import BookingTimeLine from "../../Componets/BookingTicket/BookingTimeLine";
import GlobalColors from "../../Color/colors";
import { Entypo } from "@expo/vector-icons";
import CustomButton from "../../Componets/UI/CustomButton";
import RecheckSchedule from "../../Componets/Schedule/RecheckSchedule";
import { useContext, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import TimeOutBooking from "../../Componets/UI/TImeOutBooking";
import { AuthContext } from "../../Store/authContex";
import IconButton from "../../Componets/UI/IconButton";
import { ScrollView } from "react-native";
import { BookingContext } from "../../Store/bookingContext";
import { StripeProvider, usePaymentSheet } from "@stripe/stripe-react-native";
import axios from "axios";
import Loading from "../../Componets/UI/Loading";
import { Pressable } from "react-native";
import { Modal } from "react-native";
import { TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { getDate } from "../../Helper/Date";
import {
  cancelBookingSession,
  confirmBookingTicket,
  confirmBookingTicketBoughtByCreditCard,
  createBookingSession,
  getDiscountOfUser,
} from "../../util/databaseAPI";
import { useIsFocused } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Animated } from "react-native";

import { LogBox } from "react-native";
LogBox.ignoreLogs([
  "Sending `onAnimatedValueUpdate` with no listeners registered",
]);
const Tab = createMaterialTopTabNavigator();

function RecheckScreen({ navigation, route }) {
  const [passengers, setPassengers] = useState([
    { adfdaf: "DevSettings", sd: "sdsd" },
  ]);
  const [cost, setCost] = useState(0);
  const [tripInfo, setTripInfo] = useState({});
  const authCtx = useContext(AuthContext);

  ///Payment

  const [isLoading, setIsLoading] = useState(false);
  const [paymentOption, setPaymentOption] = useState(0);
  const { initPaymentSheet, presentPaymentSheet } = usePaymentSheet();
  const [discountList, setDiscountList] = useState([]);
  const bookingCtx = useContext(BookingContext);
  const [discountSelectedIndex, setDiscountSelectedIndex] = useState(null);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [isDiscountOption, seIsDiscountOption] = useState(false);

  const [isSelectMainTrip, setIsSelectMainTrip] = useState(false);
  const [isSelectRoundTrip, setIsSelectRoundTrip] = useState(false);

  const [bookingInfoTemp, setBookingInfoTemp] = useState();

  const tickets = [
    {
      reservationId: "1",
      seatNumber: "12",
      fullName: "Nguyen Van A",
      coachType: "Limousine",
      status: 0, //0: unpaid, 1:paid
    },
    {
      reservationId: "SFS43434343",
      seatNumber: "54",
      fullName: "Nguyen Van B",
      coachType: "Limousine",
    },
    {
      reservationId: "SFS43434341",
      seatNumber: "23",
      fullName: "Nguyen Van C",
      coachType: "Limousine",
    },
  ];
  //Timeout
  const isFocused = useIsFocused();
  useEffect(() => {
    console.log("run");
    if (isFocused) {
      bookingCtx.IsTimeout((curr) => !curr);
    }
  }, [isFocused]);

  useEffect(() => {
    navigation.setOptions({
      headerBackVisible: false,

      headerLeft: () => {
        return (
          <TouchableOpacity style={{ marginLeft: -15 }}>
            <IconButton
              color={"white"}
              icon={"arrow-back-outline"}
              size={30}
              onPress={async () => {
                console.log("Press");
                navigation.goBack();
                bookingCtx.stopTimeout();
                bookingCtx.resetTimeout();
                //CancelBooking
                let cancelBody = {
                  reservations: bookingCtx?.bookingInfoTemp?.reservations,
                };
                if (bookingCtx?.bookingInfoTemp?.reservationsRoundTrip) {
                  cancelBody.reservationsRoundTrip =
                    bookingCtx?.bookingInfoTemp?.reservationsRoundTrip;
                }
                console.log("cancel", bookingCtx.bookingInfoTemp);

                const res = await cancelBookingSession(
                  authCtx.token,
                  cancelBody
                );
                if (!res) {
                  Alert.alert(
                    "Connection Error",
                    "Please check your internet connection"
                  );
                }
                console.log("Cancel Booking Response code", res);
                //CancelBooking

                // setTimeout(() => {
                //   navigation.goBack();
                // }, 1000);
              }}
            />
          </TouchableOpacity>
        );
      },
    });
  }, [bookingCtx.bookingInfoTemp]);

  //Create Booking Session
  useEffect(() => {
    async function createBookingSessions() {
      const temp = bookingCtx?.bookingInfo;
      let createBookingSessionBody = {
        scheduleId: temp?.mainTripInfo?.id,
        seats: temp?.mainTripSelectedSeats?.map((item) => {
          return item.number < 10 ? "0" + item.number : "" + item.number;
        }),
        // paymentId: 1,
        departurePoint: temp?.mainTripInfo?.departurePlacePosition?.id,
        arrivalPoint: temp?.mainTripInfo?.arrivalPlacePosition?.id,
        // shuttle: {
        //   shuttleRouteId: temp?.mainTripShuttleRoute?.shuttleRouteId,
        //   quantity: temp?.mainTripSelectedSeats?.length,
        // },
        // roundTrip: {
        //   scheduleId: temp?.roundTripInfo?.id,
        //   seats: temp?.RoundTripSelectedSeats?.map((item) => {
        //     return item.number < 10 ? "0" + item.number : "" + item.number;
        //   }),
        //   departurePoint: temp?.roundTripInfo?.departurePlacePosition?.id,
        //   arrivalPoint: temp?.roundTripInfo?.arrivalPlacePosition?.id,
        //   shuttle: {
        //     shuttleRouteId: temp?.roundTripShuttleRoute?.shuttleRouteId,
        //     quantity: temp?.RoundTripSelectedSeats?.length,
        //   },
        // },
      };
      if (temp?.mainTripShuttleRoute) {
        createBookingSessionBody.shuttle = {
          shuttleRouteId: temp?.mainTripShuttleRoute?.shuttleRouteId,
          quantity: temp?.mainTripSelectedSeats?.length,
        };
      }

      if (temp?.roundTripInfo) {
        createBookingSessionBody.roundTrip = {
          scheduleId: temp?.roundTripInfo?.id,
          seats: temp?.RoundTripSelectedSeats?.map((item) => {
            return item.number < 10 ? "0" + item.number : "" + item.number;
          }),
          departurePoint: temp?.roundTripInfo?.departurePlacePosition?.id,
          arrivalPoint: temp?.roundTripInfo?.arrivalPlacePosition?.id,
        };
        if (temp?.roundTripShuttleRoute) {
          createBookingSessionBody.roundTrip.shuttle = {
            shuttleRouteId: temp?.roundTripShuttleRoute?.shuttleRouteId,
            quantity: temp?.RoundTripSelectedSeats?.length,
          };
        }
      }
      console.log("createBookingSessionBody:", createBookingSessionBody);
      const res = await createBookingSession(
        authCtx.token,
        createBookingSessionBody
      );
      if (!res) {
        Alert.alert("Error", "Something went wrong");
        return;
      }
      //Get response
      let bookingInfoTemp = {
        reservations: res?.reservations?.map((item) => item.id),
        // reservationsRoundTrip: res?.reservationsRoundTrip?.map((item) => item.id),
        // shuttlePassenger: res?.shuttlePassenger?.map((item) => item.id),
        // shuttlePassengerRoundTrip: res?.shuttlePassengerRoundTrip?.map(
        //   (item) => item.id
        // ),
      };
      if (
        res?.reservationsRoundTrip &&
        res?.reservationsRoundTrip.length != 0
      ) {
        bookingInfoTemp.reservationsRoundTrip = res?.reservationsRoundTrip?.map(
          (item) => item.id
        );
      }

      if (res?.shuttlePassenger && res?.shuttlePassenger.length != 0) {
        bookingInfoTemp.shuttlePassenger = res?.shuttlePassenger?.map(
          (item) => item.id
        );
      }
      if (
        res?.shuttlePassengerRoundTrip &&
        res?.shuttlePassengerRoundTrip.length != 0
      ) {
        bookingInfoTemp.shuttlePassengerRoundTrip =
          res?.shuttlePassengerRoundTrip?.map((item) => item.id);
      }
      setBookingInfoTemp(bookingInfoTemp);
      bookingCtx.setBookingInfoTemp(bookingInfoTemp);
    }
    if (isFocused) {
      createBookingSessions();
    }
  }, [isFocused]);
  //Timeout
  useEffect(() => {
    // //get discount list from database
    // console.log("Booking Info: ", bookingCtx.bookingInfo);
    async function getUserDiscount() {
      const discountList = await getDiscountOfUser(
        authCtx.token,
        authCtx.idUser
      );
      if (!discountList) {
        return;
      }
      let discountTemp = discountList.rows.map((item) => {
        return {
          id: item.discountId,
          title: `Discount ${item.DiscountData.value * 100}%`,
          expireDate: new Date(item.DiscountData.expireDate),
          value: item.DiscountData.value * 100,
          minimumPriceToApply: item.DiscountData.minimumpricetoapply,
          maximumDiscountPrice: item.DiscountData.maximumdiscountprice,
          status: item.status,
        };
      });
      discountTemp = discountTemp.filter(
        (item) => item.expireDate > Date.now()
      );
      setDiscountList(
        discountTemp.sort((d1, d2) => d1.expireDate - d2.expireDate)
      );
    }
    getUserDiscount();
    // setDiscountList(discounts.sort((d1, d2) => d1.expireDate - d2.expireDate));
  }, []);

  async function initializePaymentSheet() {
    const { paymentIntent, ephemeralKey, customer } =
      await fetchPaymentSheetParams();
    const { error } = await initPaymentSheet({
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      merchantDisplayName: "Example Inc.",
      allowsDelayedPaymentMethods: true,
      returnURL: "stripe-example://stripe-redirect",
    });

    if (!!error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      // setLoading(true);
    }
  }
  async function fetchPaymentSheetParams() {
    const header = {
      accept: "application/json",
      Authorization: `${authCtx.token}`,
    };
    const response = await axios.post(
      `https://coach-ticket-management-api.onrender.com/api/payment-sheet`,
      {
        cost: discountSelectedIndex !== null ? cost - discountPrice : cost,
      },
      {
        headers: header,
      }
    );

    const { paymentIntent, ephemeralKey, customer } = response.data.data;
    console.log(response.data);
    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  }

  async function showCreditCardHandler() {
    const realCost =
      discountSelectedIndex !== null ? cost - discountPrice : cost;
    if (realCost === 0) {
      //Move to the ResultReceiptScreen
      bookingCtx.stopTimeout();
      navigation.reset({
        index: 0,
        routes: [
          {
            name: "PaymentResultScreen",
            params: {
              status: 1, //0 :paylater,1:paid
              paymentMethod: "Credit Card",
              dateTime: new Date(),
              cost: realCost,
              tickets: tickets,
              departurePlace: route?.params?.departurePlace,
              arrivalPlace: route?.params?.arrivalPlace,
              departureTime: route?.params?.departureTime,
              arrivalTime: route?.params?.arrivalTime,
              duration: route?.params?.duration,
              services: route?.params?.services,
              idTrip: route?.params?.idTrip,
              passengers: route?.params?.passengers,
            },
          },
        ],
      });
      return;
    }

    setPaymentOption(1);
    setIsLoading(true);
    await initializePaymentSheet();
    setIsLoading(false);
    const { error } = await presentPaymentSheet();
    if (error) {
      if (error.code === "Canceled") return;
      Alert.alert(`Error code: ${error.code}`, error.message);
      console.log(error.message);
    } else {
      Alert.alert(`Success`, "The payment was confirm successfully");
      //Them ve vao database voi status la 1
      //Lay thong tin tickets moi them vao database
      bookingCtx.stopTimeout();

      //Gọi API
      // let bodyRequest = {
      //   reservations: bookingInfoTemp?.reservations,
      // };
      // if (bookingInfoTemp?.reservationsRoundTrip) {
      //   bodyRequest.reservationsRoundTrip =
      //     bookingInfoTemp?.reservationsRoundTrip;
      // }
      // // discountId
      // if (discountSelectedIndex) {
      //   const discount = discountList[discountSelectedIndex];
      //   bodyRequest.discountId = discount.id;
      // }
      // const res = await confirmBookingTicketBoughtByCreditCard(
      //   authCtx.token,
      //   bodyRequest
      // );
      // if (!res) {
      //   Alert.alert(
      //     "Connection Error",
      //     "Please check your internet connection"
      //   );
      //   return;
      // }
      // console.log("Payment Credit Card", res);

      const res = await confirmBookingTicketSession(2);
      if (!res) {
        return;
      }
      //Gọi API
      navigation.reset({
        index: 0,
        routes: [
          {
            name: "PaymentResultScreen",
            params: {
              status: 1, //0 :paylater,1:paid
              paymentMethod: "Credit Card",
              dateTime: new Date(),
              cost: realCost,
              tickets: tickets,
              departurePlace: route?.params?.departurePlace,
              arrivalPlace: route?.params?.arrivalPlace,
              departureTime: route?.params?.departureTime,
              arrivalTime: route?.params?.arrivalTime,
              duration: route?.params?.duration,
              services: route?.params?.services,
              idTrip: route?.params?.idTrip,
              passengers: route?.params?.passengers,

              // mainTripInfo: bookingCtx?.bookingInfo?.mainTripInfo,
              // mainTripCost: bookingCtx?.bookingInfo?.mainTripCost,
              // mainTripShuttleRoute:
              //   bookingCtx?.bookingInfo?.mainTripShuttleRoute,
              // mainTripPassengers: bookingCtx?.bookingInfo?.mainTripPassengers,
              // roundTripInfo: bookingCtx?.bookingInfo?.roundTripInfo,
              // mainTripSelectedSeats:
              //   bookingCtx?.bookingInfo?.mainTripSelectedSeats,
              // roundTripPassengers: bookingCtx?.bookingInfo?.roundTripPassengers,
              // roundTripShuttleRoute:
              //   bookingCtx?.bookingInfo?.roundTripShuttleRoute,
              // RoundTripCost: bookingCtx?.bookingInfo?.RoundTripCost,
              // RoundTripSelectedSeats:
              //   bookingCtx?.bookingInfo?.RoundTripSelectedSeats,
              reservationIds: bookingInfoTemp.reservations,
              reservationsRoundTrip: bookingInfoTemp.reservationsRoundTrip,
            },
          },
        ],
      });
    }
  }

  async function paymentHandlers() {
    ////Them ve vao database voi status la 0

    bookingCtx.stopTimeout();

    const res = await confirmBookingTicketSession(1);
    if (!res) {
      return;
    }
    //Confirm Booking Ticket w

    navigation.reset({
      index: 0,
      routes: [
        {
          name: "PaymentResultScreen",
          params: {
            status: 0, //0 :paylater,1:paid
            paymentMethod: "Pay Later",
            dateTime: new Date(),
            cost:
              discountSelectedIndex !== null
                ? route?.params?.price -
                  (route?.params?.price *
                    discountList[discountSelectedIndex].value) /
                    100
                : route?.params?.price,
            tickets: tickets,
            departurePlace: route?.params?.departurePlace,
            arrivalPlace: route?.params?.arrivalPlace,
            departureTime: route?.params?.departureTime,
            arrivalTime: route?.params?.arrivalTime,
            duration: route?.params?.duration,
            services: route?.params?.services,
            idTrip: route?.params?.idTrip,
            passengers: route?.params?.passengers,
            roundTripDate: route?.params?.roundTripDate,
            shuttleRoute: route?.params?.shuttleRoute,

            // mainTripInfo: bookingCtx?.bookingInfo?.mainTripInfo,
            // mainTripCost: bookingCtx?.bookingInfo?.mainTripCost,
            // mainTripShuttleRoute: bookingCtx?.bookingInfo?.mainTripShuttleRoute,
            // mainTripPassengers: bookingCtx?.bookingInfo?.mainTripPassengers,
            // roundTripInfo: bookingCtx?.bookingInfo?.roundTripInfo,
            // mainTripSelectedSeats:
            //   bookingCtx?.bookingInfo?.mainTripSelectedSeats,
            // roundTripPassengers: bookingCtx?.bookingInfo?.roundTripPassengers,
            // roundTripShuttleRoute:
            //   bookingCtx?.bookingInfo?.roundTripShuttleRoute,
            // RoundTripCost: bookingCtx?.bookingInfo?.RoundTripCost,
            // RoundTripSelectedSeats:
            //   bookingCtx?.bookingInfo?.RoundTripSelectedSe,
            reservationIds: bookingInfoTemp.reservations,
            reservationsRoundTrip: bookingInfoTemp.reservationsRoundTrip,
          },
        },
      ],
    });
  }
  async function confirmBookingTicketSession(payType) {
    const temp = bookingCtx?.bookingInfo;
    //Gọi API
    let bodyRequest = {
      reservations: bookingInfoTemp?.reservations,
    };

    // discountId
    if (discountSelectedIndex) {
      const discount = discountList[discountSelectedIndex];
      bodyRequest.discountId = discount.id;
    }

    bodyRequest.paymentId = payType.toString(); // 1: pay later, 2: pay now credit card
    bodyRequest.passengers = temp?.mainTripPassengers?.map((item) => {
      return {
        address: item.address,
        fullName: item.fullName,
        phoneNumber: item.phoneNumber,
      };
    });

    //RoundTrip
    if (bookingInfoTemp.reservationsRoundTrip) {
      bodyRequest.reservationsRoundTrip =
        bookingInfoTemp?.reservationsRoundTrip;
      bodyRequest.passengersRoundTrip = temp?.roundTripPassengers?.map(
        (item) => {
          return {
            address: item.address,
            fullName: item.fullName,
            phoneNumber: item.phoneNumber,
          };
        }
      );
    }
    console.log(bodyRequest);
    //RoundTrip
    const res = await confirmBookingTicket(authCtx.token, bodyRequest);
    if (!res) {
      Alert.alert("Connection Error", "Please check your internet connection");
      return null;
    }
    console.log("Confirm ticket: ", res);
    return 200;
    //Gọi API
  }
  function numberDaysBetweenTwoDays(date1, date2) {
    // To calculate the time difference of two dates
    var Difference_In_Time = date2.getTime() - date1.getTime();

    // To calculate the no. of days between two dates
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    return Difference_In_Days;
  }
  function renderDiscountItem(itemData) {
    const numberOfDays = numberDaysBetweenTwoDays(
      new Date(),
      new Date(itemData.item.expireDate)
    );
    const isDisable = cost < itemData.item.minimumPriceToApply;
    return (
      <Pressable
        style={({ pressed }) => [
          styles.discountItem,
          pressed && { opacity: 0.5 },
          discountSelectedIndex === itemData.index && {
            borderColor: "#95c9f0",
            borderWidth: 1.5,
          },
          isDisable && {
            opacity: 0.5,
          },
        ]}
        disabled={isDisable}
        onPress={() => {
          if (discountSelectedIndex === itemData.index) {
            setDiscountSelectedIndex(null);
            setDiscountPrice(0);
          } else {
            // id: item.discountId,
            // title: `Discount ${item.DiscountData.value * 100}%`,
            // expireDate: new Date(item.DiscountData.expireDate),
            // value: item.DiscountData.value * 100,
            // minimumPriceToApply: item.DiscountData.minimumpricetoapply,
            // maximumDiscountPrice: item.DiscountData.maximumdiscountprice,
            // status: item.status,

            const discountValue = (cost * itemData.item.value) / 100;
            if (discountValue > itemData.item.maximumDiscountPrice) {
              setDiscountPrice(itemData.item.maximumDiscountPrice);
            } else {
              setDiscountPrice(discountValue);
            }
            setDiscountSelectedIndex(itemData.index);
          }
          seIsDiscountOption((curr) => !curr);
        }}
      >
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          <Image
            style={{ width: 40, height: 40 }}
            source={
              numberDaysBetweenTwoDays(new Date(), itemData.item.expireDate) >=
              3
                ? require("../../../icon/newDiscount.png")
                : require("../../../icon/oldDiscount.png")
            }
          />
          <View style={{ gap: 10 }}>
            <Text style={styles.discountTitle}>{itemData.item.title}</Text>
            <Text style={{ fontSize: 16, fontWeight: 400 }}>
              Minimum invoice{" "}
              <Text
                style={{
                  color: "red",
                  fontWeight: 600,
                }}
              >
                {addDotsToNumber(itemData.item.minimumPriceToApply)}VND
              </Text>
            </Text>
            <View
              style={{
                padding: 2,
                borderWidth: 1,
                borderColor: "#f70010c5",
                alignItems: "flex-start",
                alignSelf: "flex-start",
              }}
            >
              <Text
                style={{
                  color: "#f70010c5",
                  fontSize: 13,
                }}
              >
                Maximum {addDotsToNumber(itemData.item.maximumDiscountPrice)}VND
              </Text>
            </View>
            {numberOfDays <= 4 && (
              <Text
                style={[
                  numberOfDays < 2 && { color: "red" },
                  {
                    fontSize: 13,
                  },
                ]}
              >
                Expire date : {getDate(itemData.item.expireDate)}
                {" ("}
                {numberOfDays.toFixed(0)}
                {numberOfDays >= 2 ? " days)" : " day)"}
              </Text>
            )}
            {numberOfDays > 4 && (
              <Text
                style={[
                  numberOfDays < 2 && { color: "red" },
                  {
                    fontSize: 13,
                  },
                ]}
              >
                Expire date : {getDate(itemData.item.expireDate)}
              </Text>
            )}
          </View>
        </View>
        {discountSelectedIndex === itemData.index && (
          <Ionicons
            name="radio-button-on"
            size={24}
            color={GlobalColors.headerColor}
          />
        )}
        {discountSelectedIndex !== itemData.index && (
          <Ionicons name="radio-button-off" size={24} color="black" />
        )}
      </Pressable>
    );
  }

  ///Payment

  useEffect(() => {
    setPassengers(route?.params?.passengers);
    if (bookingCtx?.bookingInfo?.roundTripInfo) {
      setCost(
        bookingCtx?.bookingInfo?.mainTripCost +
          bookingCtx?.bookingInfo?.RoundTripCost
      );
    } else {
      setCost(bookingCtx?.bookingInfo?.mainTripCost);
    }
    setTripInfo({
      departurePlace: route?.params?.departurePlace,
      arrivalPlace: route?.params?.arrivalPlace,
      departureTime: route?.params?.departureTime,
      arrivalTime: route?.params?.arrivalTime,
      duration: route?.params?.duration,
      services: route?.params?.services,
      subTotal: route?.params?.trip?.price,
    });
  }, []);
  function addDotsToNumber(number) {
    if (number.toString() === "0") return "0";
    if (number) return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  function paymentHandler() {
    navigation.navigate("PaymentScreen", {
      departurePlace: route?.params?.departurePlace,
      arrivalPlace: route?.params?.arrivalPlace,
      departureTime: route?.params?.departureTime,
      arrivalTime: route?.params?.arrivalTime,
      duration: route?.params?.duration,
      services: route?.params?.services,
      price: route?.params?.price,
      idTrip: route?.params?.idTrip,
      passengers: route?.params?.passengers,
      roundTripDate: route?.params?.roundTripDate,
      shuttleRoute: route?.params?.shuttleRoute,
      trip: route?.params?.trip,
    });
  }

  function renderPassengers(itemData) {
    return (
      <View
        style={{
          justifyContent: "center",
          borderRadius: 10,
          padding: 15,
          backgroundColor: "white",
          alignItems: "center",
          marginVertical: 7,
          maxHeight: 120,
          width: 130,
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            opacity: 0.6,
            alignSelf: "flex-start",
            position: "absolute",
            top: 5,
            left: 10,
          }}
        >
          {itemData.index + 1}
        </Text>
        <View style={styles.passengerItem}>
          <Ionicons
            style={{ marginTop: 5, marginBottom: -10 }}
            name="ios-person-circle-outline"
            size={35}
            color={GlobalColors.lightBackground}
          />
          <View style={styles.passengerItemInfo}>
            <Text style={{ fontSize: 14, fontWeight: "bold" }}>
              {itemData.item.fullName}
            </Text>
            <Text style={{ fontSize: 12, opacity: 0.6 }}>
              {itemData.item.phoneNumber}
            </Text>
          </View>
        </View>

        <Text style={{ fontSize: 30, fontWeight: "bold", opacity: 0.6 }}>
          {itemData.item.seatNumber < 10
            ? "0" + itemData.item.seatNumber
            : itemData.item.seatNumber}
        </Text>
      </View>
    );
  }

  function goTripDetailHandler(type) {
    if (type === "mainTrip") {
      navigation.push("TripDetailScreen", {
        idSchedule: bookingCtx.bookingInfo?.mainTripInfo?.id,
        isReview: true,
        trip: bookingCtx.bookingInfo?.mainTripInfo,
      });
    } else {
      navigation.push("TripDetailScreen", {
        idSchedule: bookingCtx.bookingInfo?.roundTripInfo?.id,
        isReview: true,
        trip: bookingCtx.bookingInfo?.roundTripInfo,
      });
    }
    // navigation.push("TripDetailScreen", {
    //   idSchedule: route?.params?.idTrip,
    //   isReview: true,
    //   trip: route?.params?.trip,
    // });
  }
  function onTimeChange(value) {
    if (value === 0) {
      // Alert.alert("Finished");
      // authCtx.resetTimeout();
      return;
    }
    authCtx.runTimeout();
    // console.log(value);
  }
  return (
    <>
      <Modal
        visible={isDiscountOption}
        style={{
          flex: 1,
        }}
        animationType="slide"
        transparent={true}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              height: "63%",
              width: "100%",
              borderRadius: 20,
              padding: 10,
            }}
          >
            <TouchableOpacity
              style={{ alignSelf: "flex-end" }}
              onPress={() => seIsDiscountOption((curr) => !curr)}
            >
              <Ionicons name="close-circle-outline" size={24} color="black" />
            </TouchableOpacity>
            <Text
              style={{
                alignSelf: "center",
                fontSize: 20,
                fontWeight: "bold",
                marginTop: -20,
              }}
            >
              Your Discounts
            </Text>
            <View
              style={{
                width: "100%",
                height: 10,
                borderBottomColor: "black",
                borderBottomWidth: 1,
                opacity: 0.1,
              }}
            />
            <FlatList
              style={{ marginVertical: 10, marginBottom: 15 }}
              data={discountList}
              renderItem={(itemData) => renderDiscountItem(itemData)}
              ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
      {isLoading && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#ffffff",
            opacity: 0.5,
            zIndex: 1,
          }}
        >
          <Loading />
        </View>
      )}
      <View style={styles.root}>
        <View
          style={{
            paddingHorizontal: 10,
            backgroundColor: GlobalColors.headerColor,
          }}
        >
          <BookingTimeLine position={2} />
        </View>

        <ScrollView>
          <View style={styles.body}>
            <View
              style={{
                padding: 5,
                borderRadius: 10,
                backgroundColor: GlobalColors.validate,
                width: 100,
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <Text style={styles.title}>Your Trip</Text>
            </View>
            {/* Main Trip */}

            <View>
              <TouchableOpacity
                style={[
                  styles.paymentSubContainer,
                  // paymentOption === 1 && styles.optionSelected,
                  {
                    marginBottom: 0,
                    borderWidth: 0.2,
                    borderColor: "gray",
                    // borderBottomWidth: 0,
                  },
                ]}
                onPress={() => setIsSelectMainTrip((curr) => !curr)}
              >
                <View
                  style={[
                    styles.paymentIconContainer,
                    { width: 210, maxWidth: 210 },
                  ]}
                >
                  <Image
                    style={{ height: 40, width: 40 }}
                    source={require("../../../icon/coachIcon.png")}
                  />
                  <View>
                    <Text style={{ fontWeight: "600", fontSize: 16 }}>
                      {bookingCtx.bookingInfo.mainTripInfo?.departurePlace}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontWeight: "500",
                        opacity: 0.5,
                        fontSize: 16,
                        width: 160,
                      }}
                    >
                      Seats Number:{" "}
                      {bookingCtx.bookingInfo?.mainTripSelectedSeats
                        .map((item) =>
                          item.number < 10 ? "0" + item.number : item.number
                        )
                        .toString()}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    padding: 2,
                    borderRadius: 5,
                    backgroundColor: "#25e38a8f",
                    alignItems: "center",
                    height: 30,
                    justifyContent: "center",
                    marginTop: 5,
                    marginLeft: 10,
                    width: 77,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "bold",
                      color: "#289d67ff",
                    }}
                  >
                    One Way
                  </Text>
                </View>
                {!isSelectMainTrip && (
                  <IconButton
                    icon={"chevron-down-outline"}
                    size={24}
                    color={"black"}
                    onPress={() => setIsSelectMainTrip((curr) => !curr)}
                  />
                )}
                {isSelectMainTrip && (
                  <IconButton
                    icon={"chevron-up-outline"}
                    size={24}
                    color={"black"}
                    onPress={() => setIsSelectMainTrip((curr) => !curr)}
                  />
                )}
              </TouchableOpacity>

              {isSelectMainTrip && (
                <View
                  style={[
                    styles.yourTripBody,
                    {
                      marginTop: -5,
                      zIndex: -1,
                      backgroundColor: "#0296e525",
                      borderRadius: 10,
                    },
                  ]}
                >
                  {/* <View
                style={{
                  padding: 5,
                  borderRadius: 10,
                  backgroundColor: GlobalColors.validate,
                  width: 100,
                  alignItems: "center",
                }}
              >
                <Text style={styles.title}>Your Trip</Text>
              </View> */}
                  <View>
                    <RecheckSchedule
                      departurePlace={
                        bookingCtx.bookingInfo?.mainTripInfo?.departurePlace
                      }
                      arrivalPlace={
                        bookingCtx.bookingInfo?.mainTripInfo?.arrivalPlace
                      }
                      departureTime={
                        bookingCtx.bookingInfo?.mainTripInfo?.departureTime
                      }
                      arrivalTime={
                        bookingCtx.bookingInfo?.mainTripInfo.arrivalTime
                      }
                      duration={bookingCtx.bookingInfo?.mainTripInfo.duration}
                      services={bookingCtx.bookingInfo?.mainTripInfo.services}
                      onPressed={goTripDetailHandler.bind(this, "mainTrip")}
                      roundDate={route?.params?.roundTripDate}
                      shuttle={bookingCtx.bookingInfo?.mainTripShuttleRoute}
                      subTotal={bookingCtx.bookingInfo?.mainTripInfo.price}
                    />
                  </View>
                  {/* Seat */}
                  <View
                    style={{ marginTop: -10, marginLeft: 10, marginRight: 10 }}
                  >
                    <View
                      style={{
                        padding: 2,
                        borderRadius: 8,
                        backgroundColor: GlobalColors.icon_active,
                        width: 150,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "bold",
                          color: "white",
                        }}
                      >
                        Passenger List (
                        {bookingCtx.bookingInfo?.mainTripPassengers?.length})
                      </Text>
                    </View>
                    <FlatList
                      style={{ marginTop: 10, paddingRight: 200 }}
                      data={bookingCtx.bookingInfo?.mainTripPassengers}
                      keyExtractor={(item, index) => index}
                      renderItem={renderPassengers}
                      showsVerticalScrollIndicator={false}
                      showsHorizontalScrollIndicator={false}
                      ItemSeparatorComponent={() => {
                        return <View style={{ width: 10 }} />;
                      }}
                      horizontal
                    ></FlatList>
                  </View>
                </View>
              )}
            </View>
            {/* Main Trip */}
            {/* Round Trip */}

            {bookingCtx.bookingInfo?.roundTripInfo && (
              <View style={{ marginTop: 10 }}>
                <TouchableOpacity
                  style={[
                    styles.paymentSubContainer,
                    // paymentOption === 1 && styles.optionSelected,
                    {
                      marginBottom: 0,
                      borderWidth: 0.2,
                      borderColor: "gray",
                      // borderBottomWidth: 0,
                    },
                  ]}
                  onPress={() => setIsSelectRoundTrip((curr) => !curr)}
                >
                  <View
                    style={[
                      styles.paymentIconContainer,
                      { width: 210, maxWidth: 210 },
                    ]}
                  >
                    <Image
                      style={{ height: 40, width: 40 }}
                      source={require("../../../icon/coachIcon.png")}
                    />
                    <View>
                      <Text
                        numberOfLines={1}
                        style={{ fontWeight: "600", fontSize: 16, width: 160 }}
                      >
                        {bookingCtx.bookingInfo?.roundTripInfo?.departurePlace}
                      </Text>
                      <Text
                        style={{
                          fontWeight: "500",
                          opacity: 0.5,
                          fontSize: 16,
                          maxWidth: 175,
                        }}
                      >
                        Seats Number:{" "}
                        {bookingCtx.bookingInfo?.RoundTripSelectedSeats.map(
                          (item) =>
                            item.number < 10 ? "0" + item.number : item.number
                        ).toString()}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      padding: 2,
                      borderRadius: 5,
                      backgroundColor: "#25c3e38f",
                      alignItems: "center",
                      height: 30,
                      justifyContent: "center",
                      marginTop: 5,
                      marginLeft: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "bold",
                        color: "#115a87ff",
                        width: 72,
                      }}
                    >
                      Round Way
                    </Text>
                  </View>
                  {!isSelectRoundTrip && (
                    <IconButton
                      icon={"chevron-down-outline"}
                      size={24}
                      color={"black"}
                      onPress={() => setIsSelectRoundTrip((curr) => !curr)}
                    />
                  )}
                  {isSelectRoundTrip && (
                    <IconButton
                      icon={"chevron-up-outline"}
                      size={24}
                      color={"black"}
                      onPress={() => setIsSelectRoundTrip((curr) => !curr)}
                    />
                  )}
                </TouchableOpacity>

                {isSelectRoundTrip && (
                  <View
                    style={[
                      styles.yourTripBody,
                      {
                        marginTop: -5,
                        zIndex: -1,
                        backgroundColor: "#0296e525",
                        borderRadius: 10,
                      },
                    ]}
                  >
                    {/* <View
                style={{
                  padding: 5,
                  borderRadius: 10,
                  backgroundColor: GlobalColors.validate,
                  width: 100,
                  alignItems: "center",
                }}
              >
                <Text style={styles.title}>Your Trip</Text>
              </View> */}

                    {/* departurePlace={tripInfo.departurePlace}
                      arrivalPlace={tripInfo.arrivalPlace}
                      departureTime={tripInfo.departureTime}
                      arrivalTime={tripInfo.arrivalTime}
                      duration={tripInfo.duration}
                      services={tripInfo.services}
                      onPressed={goTripDetailHandler}
                      roundDate={route?.params?.roundTripDate}
                      shuttle={route?.params?.shuttleRoute}
                      subTotal={route?.params?.trip?.price} */}
                    <View>
                      <RecheckSchedule
                        departurePlace={
                          bookingCtx.bookingInfo?.roundTripInfo?.departurePlace
                        }
                        arrivalPlace={
                          bookingCtx.bookingInfo?.roundTripInfo?.arrivalPlace
                        }
                        departureTime={
                          bookingCtx.bookingInfo?.roundTripInfo?.departureTime
                        }
                        arrivalTime={
                          bookingCtx.bookingInfo?.roundTripInfo?.arrivalTime
                        }
                        duration={
                          bookingCtx.bookingInfo?.roundTripInfo?.duration
                        }
                        services={
                          bookingCtx.bookingInfo?.roundTripInfo?.services
                        }
                        onPressed={goTripDetailHandler.bind(this, "roundTrip")}
                        roundDate={null}
                        shuttle={bookingCtx.bookingInfo?.roundTripShuttleRoute}
                        subTotal={bookingCtx.bookingInfo?.roundTripInfo?.price}
                      />
                    </View>

                    {/* Seat */}
                    <View
                      style={{
                        marginTop: -10,
                        marginLeft: 10,
                        marginRight: 10,
                      }}
                    >
                      <View
                        style={{
                          padding: 2,
                          borderRadius: 8,
                          backgroundColor: GlobalColors.icon_active,
                          width: 150,
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "bold",
                            color: "white",
                          }}
                        >
                          Passenger List (
                          {bookingCtx.bookingInfo?.roundTripPassengers?.length})
                        </Text>
                      </View>
                      <FlatList
                        style={{ marginTop: 10 }}
                        data={bookingCtx.bookingInfo?.roundTripPassengers}
                        keyExtractor={(item, index) => index}
                        renderItem={renderPassengers}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        ItemSeparatorComponent={() => {
                          return <View style={{ width: 10 }} />;
                        }}
                        horizontal
                      ></FlatList>
                    </View>
                  </View>
                )}
              </View>
            )}
            {/* Round Trip */}
          </View>

          {/* Receipt */}
          <View
            style={{
              marginLeft: 20,
              marginRight: 20,
              gap: 10,
              marginBottom: 10,
            }}
          >
            <View
              style={{
                padding: 5,
                borderRadius: 10,
                backgroundColor: GlobalColors.validate,
                width: 100,
                alignItems: "center",
              }}
            >
              <Text style={styles.title}>Receipt</Text>
            </View>
            <View
              style={[
                {
                  width: "100%",
                  backgroundColor: "white",
                  borderRadius: 10,
                  padding: 15,
                },
                {
                  marginBottom: 0,
                  borderWidth: 0.2,
                  borderColor: "gray",
                },
              ]}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "space-between",
                  width: "100%",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "bold",
                    // color: "#115a87ff",
                  }}
                >
                  Ticket For One Way
                </Text>
              </View>
              <View
                style={{
                  marginTop: 5,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
                    opacity: 0.5,
                  }}
                >
                  {bookingCtx?.bookingInfo?.mainTripPassengers?.length} x{" "}
                  {addDotsToNumber(
                    bookingCtx?.bookingInfo?.mainTripInfo?.price
                  )}{" "}
                  VND
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "bold",
                    color: "red",
                  }}
                >
                  {addDotsToNumber(bookingCtx?.bookingInfo?.mainTripCost)} VND
                </Text>
              </View>
            </View>
            {bookingCtx.bookingInfo?.roundTripInfo && (
              <View
                style={[
                  {
                    width: "100%",
                    backgroundColor: "white",
                    borderRadius: 10,
                    padding: 15,
                  },
                  {
                    marginBottom: 0,
                    borderWidth: 0.2,
                    borderColor: "gray",
                  },
                ]}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "space-between",
                    width: "100%",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "bold",
                      // color: "#115a87ff",
                    }}
                  >
                    Ticket For Round Way
                  </Text>
                </View>
                <View
                  style={{
                    marginTop: 5,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      opacity: 0.5,
                    }}
                  >
                    {bookingCtx?.bookingInfo?.roundTripPassengers.length} x{" "}
                    {addDotsToNumber(
                      bookingCtx?.bookingInfo?.roundTripInfo?.price
                    )}{" "}
                    VND
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "bold",
                      color: "red",
                    }}
                  >
                    {addDotsToNumber(bookingCtx?.bookingInfo?.RoundTripCost)}{" "}
                    VND
                  </Text>
                </View>
              </View>
            )}
          </View>
          {/* Receipt */}

          {/* Payment */}
          <View>
            <View>
              <StripeProvider
                publishableKey={
                  "pk_test_51MhlhmBI7ZTpJ5xJUpmkPO48Z8X6ckuQeAN1Rcm9d88jUNlJCawJ1MFKYxPbqZFUeURK3M7m3jhCjdI3KXksOwf100gFkPoIL5"
                }
              >
                <View
                  style={{
                    paddingHorizontal: 20,
                    marginBottom: 105,
                  }}
                  showsVerticalScrollIndicator={false}
                >
                  <Pressable
                    style={({ pressed }) => [
                      {
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "white",
                        marginBottom: 10,
                        paddingLeft: 0,
                        borderRadius: 10,
                        zIndex: 1000000,
                      },
                      pressed && { opacity: 0.5 },
                    ]}
                    onPress={() => seIsDiscountOption((curr) => !curr)}
                  >
                    <View
                      style={{
                        padding: 5,
                        borderRadius: 10,
                        backgroundColor: GlobalColors.validate,
                        width: 100,
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.title}>Discount</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                        marginRight: 5,
                      }}
                    >
                      <Text
                        style={[
                          styles.title,
                          { color: "black", fontWeight: "500", opacity: 0.4 },
                        ]}
                      >
                        {discountSelectedIndex !== null
                          ? "Discount " +
                            discountList[discountSelectedIndex].value +
                            "%"
                          : "add voucher"}
                      </Text>
                      <FontAwesome name="angle-right" size={24} color="black" />
                    </View>
                  </Pressable>

                  {discountSelectedIndex !== null && (
                    <View
                      style={{
                        backgroundColor: "white",
                        padding: 5,
                        borderBottomRightRadius: 10,
                        borderBottomLeftRadius: 10,
                        // borderTopRightRadius: 10,

                        alignSelf: "flex-end",
                        zIndex: -12000,
                        marginBottom: 10,
                        marginTop: -5,
                      }}
                    >
                      <Text
                        style={[
                          {
                            color: GlobalColors.icon_non_active,
                            fontSize: 15,
                            fontWeight: 700,
                            textAlignVertical: "center",
                            textAlign: "center",
                            alignSelf: "flex-end",
                            zIndex: -12000,
                          },
                        ]}
                      >
                        Discount Price:
                        <Text
                          style={[
                            {
                              color: "#ff0000",
                              fontWeight: "600",
                              fontSize: 18,
                              textAlignVertical: "center",
                              textAlign: "center",
                              alignSelf: "flex-end",
                              zIndex: -12000,
                            },
                          ]}
                        >
                          {" -" + addDotsToNumber(discountPrice)} VND
                        </Text>
                      </Text>
                    </View>
                  )}
                  <View>
                    <View
                      style={{
                        padding: 5,
                        borderRadius: 10,
                        backgroundColor: GlobalColors.validate,
                        width: 160,
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.title}>Payment Method</Text>
                    </View>
                    <View style={styles.paymentContainer}>
                      <TouchableOpacity
                        onPress={() => setPaymentOption(0)}
                        style={[
                          styles.paymentSubContainer,
                          paymentOption === 0 && styles.optionSelected,
                        ]}
                      >
                        <View style={styles.paymentIconContainer}>
                          <Ionicons
                            name="wallet-outline"
                            size={24}
                            color={GlobalColors.price}
                          />
                          <Text style={{ fontWeight: "600" }}>Paylater</Text>
                        </View>
                        <CustomButton color={"#4bb5f6ff"}>
                          Active Now
                        </CustomButton>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.paymentSubContainer,
                          paymentOption === 1 && styles.optionSelected,
                        ]}
                        onPress={() => setPaymentOption(1)}
                      >
                        <View style={styles.paymentIconContainer}>
                          <FontAwesome
                            name="credit-card"
                            size={24}
                            color={GlobalColors.price}
                          />
                          <Text style={{ fontWeight: "600" }}>Credit Card</Text>
                        </View>
                        <IconButton
                          icon={"chevron-down-outline"}
                          size={24}
                          color={"black"}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {/* <View style={styles.pickUpSeat}>
            <View
              style={[
                {
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 0,
                },
                discountSelectedIndex !== null && { marginTop: 50 },
              ]}
            >
              <Text
                style={{
                  color: "black",
                  fontWeight: "bold",
                  fontSize: 15,
                  textAlignVertical: "center",
                  marginBottom: 5,
                  textAlign: "center",
                }}
              >
                Total Price
              </Text>
              <Text
                style={[
                  {
                    color: discountSelectedIndex !== null ? "orange" : "red",
                    fontWeight: "bold",
                    fontSize: 22,
                    textAlignVertical: "center",
                    marginBottom: 10,
                    textAlign: "center",
                  },
                  discountSelectedIndex !== null && {
                    textDecorationLine: "line-through",
                    fontSize: 18,
                  },
                ]}
              >
                {addDotsToNumber(cost)} VND
              </Text>
              {discountSelectedIndex !== null && (
                <Text
                  style={{
                    color: "red",
                    fontWeight: "bold",
                    fontSize: 22,
                    textAlignVertical: "center",
                    marginBottom: 40,
                    textAlign: "center",
                    marginTop: -5,
                  }}
                >
                  {addDotsToNumber(
                    cost -
                      (cost * discountList[discountSelectedIndex].value) / 100
                  )}{" "}
                  VND
                </Text>
              )}
            </View>
            <View style={{ flex: 1, height: 50 }}>
              <CustomButton
                color={GlobalColors.lightBackground}
                onPress={() => {
                  if (paymentOption === 0) {
                    paymentHandler();
                  } else {
                    showCreditCardHandler();
                  }
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
                  {paymentOption === 0 ? "Pay Later" : "Pay Now"}
                </Text>
              </CustomButton>
            </View>
          </View> */}
              </StripeProvider>
            </View>
          </View>
        </ScrollView>
        {/* <View style={styles.pickUpSeat}>
          <View style={{ flexDirection: "row", flex: 1 }}>
            <Text style={{ color: "orange", fontWeight: "bold", fontSize: 22 }}>
              {addDotsToNumber(cost)} VND
            </Text>
          </View>
          <View style={{ flex: 1, height: 50 }}>
            <CustomButton
              color={GlobalColors.lightBackground}
              onPress={paymentHandler}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: 5,
                  paddingLeft: 5,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: "white",
                    fontSize: 14,
                    fontWeight: "bold",
                  }}
                >
                  Proceed to Payment
                </Text>
              </View>
            </CustomButton>
          </View>
        </View> */}

        {/* Payment */}

        <View style={styles.pickUpSeat}>
          <View
            style={[
              {
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 0,
              },
              discountSelectedIndex !== null && { marginTop: 50 },
            ]}
          >
            <Text
              style={{
                color: "black",
                fontWeight: "bold",
                fontSize: 15,
                textAlignVertical: "center",
                marginBottom: 5,
                textAlign: "center",
              }}
            >
              Total Price
            </Text>
            <Text
              style={[
                {
                  color: discountSelectedIndex !== null ? "orange" : "red",
                  fontWeight: "bold",
                  fontSize: 22,
                  textAlignVertical: "center",
                  marginBottom: 10,
                  textAlign: "center",
                },
                discountSelectedIndex !== null && {
                  textDecorationLine: "line-through",
                  fontSize: 18,
                },
              ]}
            >
              {addDotsToNumber(cost)} VND
            </Text>

            {discountSelectedIndex !== null && (
              <Text
                style={{
                  color: "red",
                  fontWeight: "bold",
                  fontSize: 22,
                  textAlignVertical: "center",
                  marginBottom: 40,
                  textAlign: "center",
                  marginTop: -5,
                }}
              >
                {addDotsToNumber(cost - discountPrice)} VND
              </Text>
            )}
          </View>
          <View style={{ flex: 1, height: 50 }}>
            <CustomButton
              color={GlobalColors.lightBackground}
              onPress={() => {
                if (paymentOption === 0) {
                  paymentHandlers();
                } else {
                  showCreditCardHandler();
                }
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
                {paymentOption === 0 ? "Pay Later" : "Pay Now"}
              </Text>
            </CustomButton>
          </View>
        </View>
      </View>
    </>
  );
}
export default RecheckScreen;
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  body: {
    padding: 20,
    marginTop: 35,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  pickUpSeat: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 25,
    // paddingTop: 20,
    paddingHorizontal: 20,
    height: 120,
    backgroundColor: "white",
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
  },
  yourTripBody: {
    gap: 10,
  },
  passengerItem: {
    // flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  passengerItemInfo: {
    gap: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  passengerItemRoot: {
    // flexDirection: "row",
    justifyContent: "center",
    borderRadius: 10,
    padding: 15,
    backgroundColor: "white",
    alignItems: "center",
    marginVertical: 7,
    maxHeight: 190,
  },
  discountItem: {
    padding: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: "gray",
    borderWidth: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  paymentSubContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
  },
  paymentIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  paymentContainer: {
    marginVertical: 7,
    marginTop: 10,
    gap: 10,
    marginBottom: 30,
  },
  optionSelected: { borderWidth: 3, borderColor: GlobalColors.button },
  discountTitle: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
  },
});
