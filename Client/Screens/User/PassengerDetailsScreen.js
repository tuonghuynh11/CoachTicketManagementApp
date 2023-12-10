import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Pressable,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import GlobalColors from "../../Color/colors";
import BookingTimeLine from "../../Componets/BookingTicket/BookingTimeLine";
import IconInput from "../../Componets/UI/IconInput";
import CustomButton from "../../Componets/UI/CustomButton";
import { Ionicons } from "@expo/vector-icons";
import { useContext, useEffect, useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { NameValidation, PhoneNumberValidation } from "../../Helper/Validation";
import PopUp from "../../Componets/UI/PopUp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TimeOutBooking from "../../Componets/UI/TImeOutBooking";
import { AuthContext } from "../../Store/authContex";
import IconButton from "../../Componets/UI/IconButton";
import { BookingContext } from "../../Store/bookingContext";
import { getCurrentUser } from "../../util/databaseAPI";
import Loading from "../../Componets/UI/Loading";
function PassengerDetailsScreen({ navigation, route }) {
  //route.params.idSchedule
  //route.params.numberOfPassenger
  const [savedPassengers, setSavedPassengers] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [popUpTitle, setPopUpTitle] = useState("");
  const [popUpTextBody, setPopUpTextBody] = useState("");
  const [popUpType, setPopUpType] = useState("Success");
  const [isLoading, setIsLoading] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);

  const authCtx = useContext(AuthContext);
  const bookingCtx = useContext(BookingContext);
  // const [isDeleteTimer, setIsDeleteTimer] = useState(false);

  // useEffect(() => {
  //   navigation.setOptions({
  //     headerBackVisible: false,

  //     headerLeft: () => {
  //       return (
  //         <IconButton
  //           color={"white"}
  //           icon={"arrow-back-outline"}
  //           size={30}
  //           onPress={() => {
  //             setIsDeleteTimer(true);
  //             navigation.goBack();
  //           }}
  //         />
  //       );
  //     },
  //   });
  // }, []);
  useEffect(() => {
    navigation.setOptions({
      headerBackVisible: false,

      headerLeft: () => {
        return (
          <IconButton
            color={"white"}
            icon={"arrow-back-outline"}
            size={30}
            onPress={() => {
              console.log("Press");
              navigation.goBack();
              bookingCtx.stopTimeout();
              bookingCtx.resetTimeout();
              // setTimeout(() => {
              //   navigation.goBack();
              // }, 1000);
            }}
          />
        );
      },
    });
  }, []);
  useEffect(() => {
    async function getSavePassengers() {
      setIsLoading((curr) => !curr);
      try {
        const jsonValue = await AsyncStorage.getItem("savePassengersInfo");
        const currentUser = await getCurrentUsers();
        console.log("Current User ", currentUser != null);

        if (jsonValue != null) {
          if (currentUser) {
            const a = JSON.parse(jsonValue);
            console.log("a ", a);

            const temp = [currentUser, ...JSON.parse(jsonValue)];
            console.log("SavePassengers ", temp);

            // const jsonValues = JSON.stringify(temp);
            // await AsyncStorage.setItem("savePassengersInfo", jsonValues);

            setSavedPassengers(temp);
          } else {
            setSavedPassengers(JSON.parse(jsonValue));
          }
        } else {
          console.log("Null");

          if (currentUser) {
            console.log("AddCurrentUser", currentUser);

            const temp = [currentUser];
            // const jsonValues = JSON.stringify(temp);
            // await AsyncStorage.setItem("savePassengersInfo", jsonValues);
            setSavedPassengers((curr) => [...temp]);
          } else {
            console.log("Current User 1 ", currentUser);
            setSavedPassengers([]);
          }
        }

        setPassengers(
          generateEmptyForm(route.params.selectedSeats.length, currentUser)
        );
        setIsLoading((curr) => !curr);
      } catch (e) {
        // error reading value
        console.log("Error reading passengers value:", e);
        setPassengers(
          generateEmptyForm(route.params.selectedSeats.length, currentUser)
        );
        setIsLoading((curr) => !curr);
      }
    }

    const savePassengers = [
      {
        id: 1,
        fullName: "Passenger 1",
        email: "",
        address: "HCM City",
        phoneNumber: "097889939393",
        isSelect: false,
        seatNumber: "",
      },
      {
        id: 2,
        fullName: "Passenger 2",
        email: "",
        address: "Can Tho City",
        phoneNumber: "097889939393",
        isSelect: false,
        seatNumber: "",
      },
    ];
    getSavePassengers();
    // setPassengers(generateEmptyForm(route.params.selectedSeats.length));
  }, []);

  async function getCurrentUsers() {
    const res = await getCurrentUser(authCtx.token, authCtx.idUser);
    if (!res) {
      Alert.alert("Error", "Something went wrong");
      return;
    }
    const temp = res.data;

    if (authCtx.idRole !== "3") {
      // Roles còn lại
      let form = {
        id: "MyInfo",
        fullName: temp.data.fullName,
        address: temp.data.address,
        phoneNumber: temp.data.phoneNumber,
        isInvalid: false,
        seatNumber: 0,
      };
      setCurrentUser(form);
      return form;
    }
    return null;
  }

  function generateEmptyForm(quantity, user) {
    const forms = [];
    const selectedSeats = route.params.selectedSeats;
    if (!route?.params?.isSelectForRoundTrip) {
      for (let i = 0; i < quantity; i++) {
        if (user && i == 0) {
          const form = {
            id: i,
            fullName: user?.fullName,
            address: user?.address,
            phoneNumber: user?.phoneNumber,
            isInvalid: false,
            seatNumber: selectedSeats[i].number,
          };
          forms.push(form);
        } else {
          const form = {
            id: i,
            fullName: "",
            address: "",
            phoneNumber: "",
            isInvalid: false,
            seatNumber: selectedSeats[i].number,
          };
          forms.push(form);
        }
      }
    } else {
      const temp = bookingCtx?.bookingInfo?.mainTripPassengers;
      for (let i = 0; i < quantity; i++) {
        if (temp[i]) {
          const form = {
            id: i,
            fullName: temp[i].fullName,
            address: temp[i].address,
            phoneNumber: temp[i].phoneNumber,
            isInvalid: false,
            seatNumber: selectedSeats[i].number,
          };
          forms.push(form);
        } else {
          const form = {
            id: i,
            fullName: "",
            address: "",
            phoneNumber: "",
            isInvalid: false,
            seatNumber: selectedSeats[i].number,
          };
          forms.push(form);
        }
      }
    }

    return forms;
  }
  function renderSavePassengers(itemData, passengerIndex) {
    async function savePassengerHandler() {
      if (
        passengers.some(
          (passenger) => passenger.fullName === itemData.item.fullName
        )
      ) {
        setPopUpType("Error");
        setPopUpTextBody("The passenger already exists!");
        setPopUpTitle("Failed!");
        setModalIsVisible(true);
        return;
      }
      passengers[passengerIndex].fullName = itemData.item.fullName;
      passengers[passengerIndex].address = itemData.item.address;
      passengers[passengerIndex].phoneNumber = itemData.item.phoneNumber;
      setPassengers([...passengers]);
    }
    return (
      <Pressable
        onPress={savePassengerHandler}
        style={({ pressed }) => [
          styles.savePassenger,
          pressed && styles.pressed,
        ]}
      >
        <Ionicons name="person-outline" size={24} color="black" />
        <Text style={{ fontWeight: "700" }}>
          {itemData.item.fullName}{" "}
          {itemData.item.id === "MyInfo" && " - My Info"}
        </Text>
      </Pressable>
    );
  }
  function PassengerForm(itemData) {
    return (
      <View style={styles.passengerItem}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={styles.title}>Passenger {itemData.index + 1}</Text>
          <Text
            style={[
              styles.title,
              { color: GlobalColors.headerColor, fontSize: 30 },
            ]}
          >
            {itemData.item.seatNumber}
          </Text>
        </View>
        <Text style={[styles.subTitle]}>Saved Passengers</Text>
        <FlatList
          horizontal
          data={savedPassengers}
          keyExtractor={(item, index) => index}
          renderItem={(itemDatas) =>
            renderSavePassengers(itemDatas, itemData.index)
          }
          showsHorizontalScrollIndicator={false}
        />
        <Text style={styles.subTitle}>New Passenger</Text>

        <View style={styles.passengerInput}>
          <IconInput
            label="Full Name"
            keyboardType="default"
            onUpdateValue={(text) => {
              passengers[itemData.index].fullName = text;
              setPassengers([...passengers]);
            }}
            value={passengers[itemData.index].fullName}
            isInvalid={!NameValidation(passengers[itemData.index].fullName)}
            placeholder="Nguyen Van A"
            message={"Full Name is required"}
            icon={"person-outline"}
          />
          <IconInput
            label="Address"
            keyboardType="default"
            onUpdateValue={(text) => {
              passengers[itemData.index].address = text;
              setPassengers([...passengers]);
            }}
            value={passengers[itemData.index].address}
            isInvalid={!NameValidation(passengers[itemData.index].address)}
            placeholder="Ho Chi Minh City"
            message={"Address is required"}
            icon={"location-outline"}
          />
          <IconInput
            label="Phone Number"
            keyboardType="number-pad"
            onUpdateValue={(text) => {
              passengers[itemData.index].phoneNumber = text;
              setPassengers([...passengers]);
            }}
            value={passengers[itemData.index].phoneNumber}
            isInvalid={
              !PhoneNumberValidation(passengers[itemData.index].phoneNumber)
            }
            placeholder="+84"
            message={"Phone Number is invalided"}
            icon={"call-outline"}
          />
        </View>
        <Pressable
          onPress={savePassengersInfo.bind(this, itemData.item)}
          style={({ pressed }) => [
            {
              width: "auto",
              marginRight: 20,
              alignSelf: "flex-end",
              backgroundColor: GlobalColors.button,
              flexDirection: "row",
              alignItems: "center",
              borderRadius: 20,
              paddingHorizontal: 10,
              paddingVertical: 5,
            },
            pressed && styles.pressed,
          ]}
        >
          <Ionicons name="md-add-circle-outline" size={14} color="white" />
          <Text
            style={{
              fontSize: 10,
              color: "white",
              fontWeight: "bold",
            }}
          >
            Save this passenger
          </Text>
        </Pressable>
      </View>
    );
  }

  function checkInformationIsValid({
    id,
    fullName,
    address,
    phoneNumber,
    isValid,
  }) {
    const fullNameIsValid = NameValidation(fullName);
    const addressIsValid = NameValidation(address);
    const phoneNumberIsValid = PhoneNumberValidation(phoneNumber);

    if (fullNameIsValid && addressIsValid && phoneNumberIsValid) {
      return true;
    }
    return false;
  }
  function recheckInformationHandler() {
    let passengerTemp = passengers;
    passengerTemp.forEach((passenger) => {
      if (checkInformationIsValid(passenger)) {
        passenger.isInvalid = false;
      } else {
        passenger.isInvalid = true;
      }
    });
    const numberOfValid = passengerTemp.filter(
      (passenger) => !passenger.isInvalid
    );
    if (numberOfValid.length === passengerTemp.length) {
      setPopUpType("Success");
      // setPopUpTextBody("Continue to the next step...");
      // setPopUpTitle("Successfully!");
      // setModalIsVisible(true);
      if (route?.params?.roundTripDate) {
        let temp = bookingCtx.bookingInfo;
        temp.mainTripPassengers = passengers;
        bookingCtx.setBookingInfo(temp);
        navigation.push("SearchTripsScreen", {
          info: {
            from: null,
            to: null,
            isRoundTrip: null,
            departureTime: route?.params?.roundTripDate,
            roundTripDate: null,
            numberOfSeats: route?.params?.selectedSeats?.length,
            startPlace: route?.params?.arrivalPlace,
            arrivalPlace: route?.params?.departurePlace,
            textStartPlace: route?.params?.arrivalPlace,
            textArrivalPlace: route?.params?.departurePlace,
            isSelectForRoundTrip: true,
          },
        });
        return;
      } else {
        if (route?.params?.isSelectForRoundTrip) {
          let temp = bookingCtx.bookingInfo;
          temp.roundTripPassengers = passengers;
          bookingCtx.setBookingInfo(temp);
        } else {
          let temp = bookingCtx.bookingInfo;
          temp.mainTripPassengers = passengers;
          bookingCtx.setBookingInfo(temp);
        }
        bookingCtx.resetTimeout();
        bookingCtx.startTimeout();
        navigation.navigate("RecheckScreen", {
          passengers: passengers,
          price: route?.params?.price,
          departurePlace: route?.params?.departurePlace,
          arrivalPlace: route?.params?.arrivalPlace,
          departureTime: route?.params?.departureTime,
          arrivalTime: route?.params?.arrivalTime,
          duration: route?.params?.duration,
          services: route?.params?.services,
          idTrip: route?.params?.idTrip,
          shuttleRoute: route?.params?.shuttleRoute,
          roundTripDate: route?.params?.roundTripDate,
          trip: route?.params?.trip,
          isSelectForRoundTrip: route?.params?.isSelectForRoundTrip,
        });
        return;
      }
    } else {
      setPopUpType("Error");
      setPopUpTextBody("Some fields are invalid.");
      setPopUpTitle("Error!");
      setModalIsVisible(true);
    }
    setPassengers([...passengerTemp]);
  }

  function popUpHandler() {
    if (popUpType === "Success") {
      if (route?.params?.roundTripDate) {
        let temp = bookingCtx.bookingInfo;
        temp.mainTripPassengers = passengers;
        bookingCtx.setBookingInfo(temp);
        navigation.push("SearchTripsScreen", {
          info: {
            from: null,
            to: null,
            isRoundTrip: null,
            departureTime: route?.params?.roundTripDate,
            roundTripDate: null,
            numberOfSeats: route?.params?.selectedSeats?.length,
            startPlace: route?.params?.arrivalPlace,
            arrivalPlace: route?.params?.departurePlace,
            textStartPlace: route?.params?.arrivalPlace,
            textArrivalPlace: route?.params?.departurePlace,
            isSelectForRoundTrip: true,
          },
        });
      } else {
        if (route?.params?.isSelectForRoundTrip) {
          let temp = bookingCtx.bookingInfo;
          temp.roundTripPassengers = passengers;
          bookingCtx.setBookingInfo(temp);
        } else {
          let temp = bookingCtx.bookingInfo;
          temp.mainTripPassengers = passengers;
          bookingCtx.setBookingInfo(temp);
        }
        bookingCtx.resetTimeout();
        bookingCtx.startTimeout();
        navigation.navigate("RecheckScreen", {
          passengers: passengers,
          price: route?.params?.price,
          departurePlace: route?.params?.departurePlace,
          arrivalPlace: route?.params?.arrivalPlace,
          departureTime: route?.params?.departureTime,
          arrivalTime: route?.params?.arrivalTime,
          duration: route?.params?.duration,
          services: route?.params?.services,
          idTrip: route?.params?.idTrip,
          shuttleRoute: route?.params?.shuttleRoute,
          roundTripDate: route?.params?.roundTripDate,
          trip: route?.params?.trip,
          isSelectForRoundTrip: route?.params?.isSelectForRoundTrip,
        });
      }
      // navigation.navigate("RecheckScreen", {
      //   passengers: passengers,
      //   price: route?.params.price,
      //   departurePlace: route?.params?.departurePlace,
      //   arrivalPlace: route?.params?.arrivalPlace,
      //   departureTime: route?.params?.departureTime,
      //   arrivalTime: route?.params?.arrivalTime,
      //   duration: route?.params?.duration,
      //   services: route?.params?.services,
      //   idTrip: route?.params?.idTrip,
      //   isSelectForRoundTrip: route?.params?.isSelectForRoundTrip,
      // });
    }
    setModalIsVisible(!modalIsVisible);
  }
  async function savePassengersInfo(passenger) {
    if (checkInformationIsValid(passenger)) {
      try {
        if (
          savedPassengers.length > 0 &&
          savedPassengers.some(
            (passengers) => passengers.fullName === passenger.fullName
          )
        ) {
          setPopUpType("Error");
          setPopUpTextBody("The passenger already exists!");
          setPopUpTitle("Failed!");
          setModalIsVisible(true);
          return;
        }

        savedPassengers.push(passenger);
        const user = savedPassengers.at(0);
        savedPassengers.shift();
        const jsonValue = JSON.stringify(savedPassengers);
        await AsyncStorage.setItem("savePassengersInfo", jsonValue);
        // await AsyncStorage.removeItem("savePassengersInfo");
        setSavedPassengers([user, ...savedPassengers]);
      } catch (e) {
        // saving error
        console.log("Stored passenger information", e);
      }
    } else {
      setPopUpType("Error");
      setPopUpTextBody("Some fields are invalid.");
      setPopUpTitle("Error!");
      setModalIsVisible(true);
    }
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
      {isLoading && (
        <View
          style={{
            flex: 1,
            height: "100%",
            width: "100%",
            position: "absolute",
            zIndex: 1,
            backgroundColor: GlobalColors.contentBackground,
          }}
        >
          <Loading />
        </View>
      )}
      <PopUp
        title={popUpTitle}
        type={popUpType}
        textBody={popUpTextBody}
        isVisible={modalIsVisible}
        callback={popUpHandler}
      />

      <View style={styles.root}>
        <View
          style={{
            paddingHorizontal: 10,
            backgroundColor: GlobalColors.headerColor,
          }}
        >
          <BookingTimeLine position={1} />
        </View>
        {/* <View style={{ marginTop: 5, marginHorizontal: 5 }}>
          <TimeOutBooking
            time={authCtx.timeout}
            onTimeChange={onTimeChange}
            isDelete={isDeleteTimer}
          />
        </View> */}

        <KeyboardAvoidingView
          style={{ flex: 1, marginTop: 0 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <FlatList
            style={{
              marginTop: 10,
              marginBottom: 120,
            }}
            showsVerticalScrollIndicator={false}
            data={passengers}
            keyExtractor={(item, index) => index}
            renderItem={PassengerForm}
          />
        </KeyboardAvoidingView>

        <View style={styles.footer}>
          <View style={{ width: "100%" }}>
            <CustomButton
              color={GlobalColors.lightBackground}
              onPress={recheckInformationHandler}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: 5,
                  paddingLeft: 5,
                  width: "100%",
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
                  Recheck Information
                </Text>
                <Entypo name="chevron-thin-right" size={24} color="white" />
              </View>
            </CustomButton>
          </View>
        </View>
      </View>
    </>
  );
}
export default PassengerDetailsScreen;
const styles = StyleSheet.create({
  root: {
    // marginBottom: 170,
    flex: 1,
  },
  passengerItem: {
    padding: 15,
    gap: 10,
    backgroundColor: "white",
    margin: 15,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: GlobalColors.validate,
  },
  subTitle: {
    fontSize: 18,
    opacity: 0.5,
  },
  passengerInput: {
    marginTop: -10,
    paddingHorizontal: 20,
  },
  pressed: {
    opacity: 0.6,
  },
  savePassenger: {
    flexDirection: "row",
    padding: 10,
    gap: 5,
    backgroundColor: "white",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "black",
    borderWidth: 0.5,
    marginRight: 10,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingTop: 25,
    alignItems: "center",
  },
});
