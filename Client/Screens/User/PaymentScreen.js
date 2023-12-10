import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  Pressable,
  Modal,
  FlatList,
} from "react-native";
import GlobalColors from "../../Color/colors";
import BookingTimeLine from "../../Componets/BookingTicket/BookingTimeLine";
import RecheckSchedule from "../../Componets/Schedule/RecheckSchedule";
import { useContext, useEffect, useState } from "react";
import CustomButton from "../../Componets/UI/CustomButton";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import IconButton from "../../Componets/UI/IconButton";
import CreditCardForm from "../../Componets/UI/CreditCardForm";
import { StripeProvider, usePaymentSheet } from "@stripe/stripe-react-native";
import axios from "axios";
import Loading from "../../Componets/UI/Loading";
import TimeOutBooking from "../../Componets/UI/TImeOutBooking";
import { AuthContext } from "../../Store/authContex";
import { BookingContext } from "../../Store/bookingContext";
import { getDate } from "../../Helper/Date";
function PaymentScreen({ navigation, route }) {
  const authCtx = useContext(AuthContext);
  const [cost, setCost] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentOption, setPaymentOption] = useState(0);
  const { initPaymentSheet, presentPaymentSheet } = usePaymentSheet();
  const [tripInfo, setTripInfo] = useState({}); //Mot doi thanh tripInfo
  const [discountList, setDiscountList] = useState([]);
  const bookingCtx = useContext(BookingContext);
  const [discountSelectedIndex, setDiscountSelectedIndex] = useState(null);
  const [isDiscountOption, seIsDiscountOption] = useState(false);
  useEffect(() => {
    //get discount list from database
    const discounts = [
      {
        id: 1,
        title: "Discount 50%",
        expireDate: new Date(2023, 10, 11),
        value: 50,
      },
      {
        id: 2,
        title: "Discount 45%",
        expireDate: new Date(2023, 10, 11),
        value: 45,
      },
      {
        id: 3,
        title: "Discount 55%",
        expireDate: new Date(2023, 10, 11),
        value: 55,
      },
      {
        id: 4,
        title: "Discount 90%",
        expireDate: new Date(2023, 10, 11),
        value: 90,
      },
      {
        id: 5,
        title: "Discount 100%",
        expireDate: new Date(2023, 10, 11),
        value: 100,
      },
      {
        id: 6,
        title: "Discount 30%",
        expireDate: new Date(2023, 9, 11),
        value: 30,
      },
      {
        id: 7,
        title: "Discount 20%",
        expireDate: new Date(2023, 9, 13),
        value: 20,
      },
      {
        id: 8,
        title: "Discount 10%",
        expireDate: new Date(2023, 9, 14),
        value: 10,
      },
      {
        id: 9,
        title: "Discount 5%",
        expireDate: new Date(2023, 9, 15),
        value: 5,
      },
    ];
    setDiscountList(discounts.sort((d1, d2) => d1.expireDate - d2.expireDate));
  }, []);

  useEffect(() => {
    setCost(route?.params?.price);
    console.log(route.params.price);

    setTripInfo({
      departurePlace: route?.params?.departurePlace,
      arrivalPlace: route?.params?.arrivalPlace,
      departureTime: route?.params?.departureTime,
      arrivalTime: route?.params?.arrivalTime,
      duration: route?.params?.duration,
      services: route?.params?.services,
      idTrip: route?.params?.idTrip,
      passengers: route?.params?.passengers,
    });
  }, []);
  ///Test data
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
  // const tripInfo = {
  //   departureTime: new Date(2023, 9, 2, 18, 30, 0),
  //   arrivalTime: new Date(2023, 9, 3, 7, 30, 0),
  //   departurePlace: "Hồ Chí Minh",
  //   arrivalPlace: "Nha Trang",
  //   duration: calculateTimeDifference(
  //     new Date(2023, 9, 2, 18, 30, 0),
  //     new Date(2023, 9, 3, 7, 30, 0)
  //   ),
  //   image:
  //     "https://www.intelligenttransport.com/wp-content/uploads/My-project-1-51-1.jpg",
  //   coachId: "2",
  //   coachNumber: "BA123",
  //   coachCapacity: "40",
  //   coachType: "Limousine giường nằm",
  //   availableSeats: "4",
  //   services: ["Air Conditioner", "Wifi", "TV", "Blanket"],
  //   price: "120000",
  // };
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
        cost:
          discountSelectedIndex !== null
            ? cost - cost * (discountList[discountSelectedIndex].value / 100)
            : cost,
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
      discountSelectedIndex !== null
        ? cost - cost * (discountList[discountSelectedIndex].value / 100)
        : cost;
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
      Alert.alert(`Error code: ${error.code}`, error.message);
      console.log(error.message);
    } else {
      Alert.alert(`Success`, "The payment was confirm successfully");
      //Them ve vao database voi status la 1
      //Lay thong tin tickets moi them vao database
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
    }
  }
  function addDotsToNumber(number) {
    if (number.toString() === "0") return "0";
    if (number) return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
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
    return `${hours}h${minutes}m`;
  }

  function paymentHandler() {
    ////Them ve vao database voi status la 0
    bookingCtx.stopTimeout();
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
          },
        },
      ],
    });
  }
  function goTripDetailHandler() {
    navigation.push("TripDetailScreen", {
      idSchedule: route?.params?.idTrip,
      isReview: true,
    });
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
  function numberDaysBetweenTwoDays(date1, date2) {
    // To calculate the time difference of two dates
    var Difference_In_Time = date2.getTime() - date1.getTime();

    // To calculate the no. of days between two dates
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    return Difference_In_Days;
  }
  function renderDiscountItem(itemData) {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.discountItem,
          pressed && { opacity: 0.5 },
          discountSelectedIndex === itemData.index && {
            borderColor: "#95c9f0",
            borderWidth: 1.5,
          },
        ]}
        onPress={() => {
          if (discountSelectedIndex === itemData.index) {
            setDiscountSelectedIndex(null);
          } else {
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
            <Text>Expire date : {getDate(itemData.item.expireDate)}</Text>
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
  return (
    <>
      <Modal
        visible={isDiscountOption}
        style={styles.modal}
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
              height: "53%",
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
      <View style={styles.root}>
        {isLoading && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          >
            <Loading />
          </View>
        )}
        <StripeProvider
          publishableKey={
            "pk_test_51MhlhmBI7ZTpJ5xJUpmkPO48Z8X6ckuQeAN1Rcm9d88jUNlJCawJ1MFKYxPbqZFUeURK3M7m3jhCjdI3KXksOwf100gFkPoIL5"
          }
        >
          <View
            style={{
              paddingHorizontal: 10,
              backgroundColor: GlobalColors.headerColor,
              zIndex: 1,
            }}
          >
            <BookingTimeLine position={3} />
          </View>
          {/* <View style={{ marginTop: 5, marginHorizontal: 5, marginBottom: -10 }}>
          <TimeOutBooking
            time={time}
            onTimeChange={onTimeChange}
            isDelete={isDeleteTimer}
          />
        </View> */}
          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            <View style={styles.yourTripBody}>
              <View
                style={{
                  padding: 5,
                  borderRadius: 10,
                  backgroundColor: GlobalColors.validate,
                  width: 100,
                  alignItems: "center",
                }}
              >
                <Text style={styles.title}>Your Trip</Text>
              </View>
              <View>
                <RecheckSchedule
                  departurePlace={tripInfo.departurePlace}
                  arrivalPlace={tripInfo.arrivalPlace}
                  departureTime={tripInfo.departureTime}
                  arrivalTime={tripInfo.arrivalTime}
                  duration={tripInfo.duration}
                  services={tripInfo.services}
                  onPressed={goTripDetailHandler}
                  roundDate={route?.params?.roundTripDate}
                  shuttle={route?.params?.shuttleRoute}
                  subTotal={route?.params?.trip?.price}
                />
              </View>
            </View>
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
                  <CustomButton color={"#4bb5f6ff"}>Active Now</CustomButton>
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
                {/* {isShowCreditCard && (
                <View style={{ gap: 10 }}>
                  <View style={styles.creditCard}>
                    <TouchableOpacity
                      onPress={() => {
                        setCreditCardOption(0);
                      }}
                      style={[
                        styles.imageContainer,
                        creditCardOption === 0 && styles.cardSelected,
                      ]}
                    >
                      <Image
                        style={styles.image}
                        source={require("../../../icon/visa.png")}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setCreditCardOption(1);
                      }}
                      style={[
                        styles.imageContainer,
                        ,
                        creditCardOption === 1 && styles.cardSelected,
                      ]}
                    >
                      <Image
                        style={styles.image}
                        source={require("../../../icon/mastercard.png")}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setCreditCardOption(2);
                      }}
                      style={[
                        styles.imageContainer,
                        ,
                        creditCardOption === 2 && styles.cardSelected,
                      ]}
                    >
                      <Image
                        style={styles.image}
                        source={require("../../../icon/americanExpress.png")}
                      />
                    </TouchableOpacity>
                  </View>

                  <CreditCardForm
                    name={cardName}
                    expireDate={cardExpireDate}
                    cardNumber={cardNumber}
                    secureCode={cardSecureCode}
                    cardNumberValidateMessage={cardNumberValidateMessage}
                    expireDateValidateMessage={expireDateValidateMessage}
                    secureNumberValidateMessage={secureNumberValidateMessage}
                    isCardNumberValid={isCardNumberValid}
                    isExpiredDateValid={isExpiredDateValid}
                    isSecureNumberValid={isSecureNumberValid}
                  />
                </View>
              )} */}
              </View>
            </View>
          </ScrollView>

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
          </View>
        </StripeProvider>
      </View>
    </>
  );
}

export default PaymentScreen;
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  body: {
    paddingHorizontal: 20,
    marginBottom: 105,
    paddingBottom: 130,
    marginTop: 55,
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
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  passengerItemInfo: {
    gap: 5,
    justifyContent: "center",
  },
  passengerItemRoot: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 10,
    padding: 15,
    backgroundColor: "white",
    alignItems: "center",
    marginVertical: 7,
  },
  paymentContainer: {
    marginVertical: 7,
    marginTop: 10,
    gap: 10,
    marginBottom: 30,
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
  creditCard: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  image: {
    width: 70,
    height: 50,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 6,
  },
  imageContainer: {},
  optionSelected: { borderWidth: 3, borderColor: GlobalColors.button },
  modal: {
    flex: 1,
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
  title1: {
    fontSize: 20,
    fontWeight: "bold",
    color: GlobalColors.price,
    marginBottom: 10,
  },
  discountTitle: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
  },
});
