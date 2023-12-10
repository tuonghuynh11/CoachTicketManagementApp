import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Image,
  FlatList,
  Pressable,
  Alert,
} from "react-native";
import GlobalColors from "../../Color/colors";
import { Entypo } from "@expo/vector-icons";
import BookingTimeLine from "../../Componets/BookingTicket/BookingTimeLine";
import { useContext, useEffect, useState } from "react";
import SeatItem from "../../Componets/UI/SeatItem";
import CustomButton from "../../Componets/UI/CustomButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Loading from "../../Componets/UI/Loading";
import PopUp from "../../Componets/UI/PopUp";
import TimeOutBooking from "../../Componets/UI/TImeOutBooking";
import { AuthContext } from "../../Store/authContex";
import IconButton from "../../Componets/UI/IconButton";
import { useIsFocused } from "@react-navigation/native";
import { BookingContext } from "../../Store/bookingContext";
import YesNoPopUp from "../../Componets/UI/YesNoPopUp";
import SleeperSeatItem from "../../Componets/UI/SleeperSeatItem";

function SelectSeatsScreen({ navigation, route }) {
  const [capacity, setCapacity] = useState(route.params.capacity); //15,30,55 ///route.params.capacity

  const [seats, setSeats] = useState(generateSeat(capacity));
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [cost, setCost] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [isDeleteTimer, setIsDeleteTimer] = useState(false);

  const isFocused = useIsFocused();
  const bookingCtx = useContext(BookingContext);

  const [optionIsVisible, setOptionIsVisible] = useState(false);

  useEffect(() => {
    bookingCtx.IsTimeout(false);
  }, []);
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
  function generateSeat(quantity) {
    const seatHasSelected = route?.params.trip.seatData;
    let numberRow = 0;
    let numberColumn = 0;

    if (quantity == 15) {
      numberRow = 5;
      numberColumn = 3;
    } else if (quantity == 30) {
      numberRow = 8;
      numberColumn = 4;
    } else if (quantity == 36) {
      numberRow = 6;
      numberColumn = 6;
    } else {
      numberRow = 14;
      numberColumn = 4;
    }
    let rowArray = [];
    let reach = false;

    let start = 1;

    if (quantity == 15) {
      for (let i = 0; i < numberRow; i++) {
        let columnArray = [];
        for (let j = 0; j < numberColumn; j++) {
          let seatObject = {
            number: start,
            taken: Boolean(seatHasSelected.find((item) => item == start)), //get booked seat from api
            selected: false,
            row: i,
            column: j,
          };
          start++;
          columnArray.push(seatObject);
          if (i == 2) {
            if (j == 1) break;
          }
        }
        rowArray.push(columnArray);
      }
    } else if (quantity == 30) {
      for (let i = 0; i < numberRow; i++) {
        let columnArray = [];
        for (let j = 0; j < numberColumn; j++) {
          let seatObject = {
            number: start,
            taken: Boolean(seatHasSelected.find((item) => item == start)),
            selected: false,
            row: i,
            column: j,
          };
          start++;
          columnArray.push(seatObject);
          if (i == 3) {
            if (j == 1) break;
          }
        }
        rowArray.push(columnArray);
      }
    } else if (quantity === 36) {
      let firstFloor = 1;
      let secondFloor = 19;
      for (let i = 0; i < numberRow; i++) {
        let columnArray = [];
        for (let j = 0; j < numberColumn; j++) {
          let seatObject;
          if (j >= 3) {
            seatObject = {
              number: secondFloor,
              taken: Boolean(
                seatHasSelected.find((item) => item == secondFloor)
              ),
              selected: false,
              row: i,
              column: j,
            };
            secondFloor++;
          } else {
            seatObject = {
              number: firstFloor,
              taken: Boolean(
                seatHasSelected.find((item) => item == firstFloor)
              ),
              selected: false,
              row: i,
              column: j,
            };
            firstFloor++;
          }

          columnArray.push(seatObject);
          if (i == 6) {
            if (j == 1) break;
          }
        }
        rowArray.push(columnArray);
      }
    } else {
      for (let i = 0; i < numberRow; i++) {
        let columnArray = [];
        // taken: Boolean(Math.round(Math.random())),

        for (let j = 0; j < numberColumn; j++) {
          let seatObject = {
            number: start,
            taken: Boolean(seatHasSelected.find((item) => item == start)),
            selected: false,
            row: i,
            column: j,
          };
          start++;
          columnArray.push(seatObject);
          if (i == 6) {
            if (j == 1) break;
          }
        }
        rowArray.push(columnArray);
      }
    }

    return rowArray;
  }

  useEffect(() => {
    // route.params.capacity
    //Lấy thông tin chuyến đi từ API bao gồm các chỗ đã đặt, còn trống
    setSeats(generateSeat(route?.params?.capacity));
    setCapacity(route?.params?.capacity);

    // setSeats(generateSeat(55));
    // setCapacity(55);
    // setTimeout(() => {
    //   setIsLoading(false);
    // }, 2000);
  }, []);
  function selectedSeatHandler(index, subindex, number) {
    if (seats[index][subindex].taken) {
      return;
    }
    let temp = [...seats];
    let numberOfSeat = selectedSeats.length;
    temp[index][subindex].selected = !temp[index][subindex].selected;
    if (temp[index][subindex].selected) {
      setSelectedSeats((curr) => [...curr, temp[index][subindex]]);
      numberOfSeat += 1;
    } else {
      setSelectedSeats((curr) => curr.filter((item) => item.number !== number));
      numberOfSeat -= 1;
    }
    setSeats(temp);
    setCost(route?.params?.price * numberOfSeat);
  }
  function addDotsToNumber(number) {
    if (number.toString() === "0") return "0";
    if (number) return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  function SeatItemSelected({ index, subIndex, number }) {
    return isLoading ? (
      <Loading />
    ) : (
      <View style={styles.seatItemSelected}>
        <Text style={{ fontSize: 15, fontWeight: "bold" }}>{number}</Text>
        <MaterialCommunityIcons name="seat-passenger" size={24} color="black" />
        <Pressable
          style={({ pressed }) => [
            { position: "absolute", right: -8, top: -6, paddingTop: 4 },
            pressed && styles.pressed,
          ]}
          onPress={() => {
            console.log(index, subIndex);
            selectedSeatHandler(index, subIndex, number);
          }}
        >
          <MaterialCommunityIcons
            name="close-circle"
            size={20}
            color="#fd0a0a"
          />
        </Pressable>
      </View>
    );
  }
  function selectTripHandler() {
    if (selectedSeats.length === 0) {
      setModalIsVisible(true);
      return;
    }
    setOptionIsVisible((curr) => !curr);
  }

  function NoOptionHandler() {
    console.log(selectedSeats);

    if (!route?.params?.isSelectForRoundTrip) {
      let temp = bookingCtx.bookingInfo;
      temp.mainTripSelectedSeats = selectedSeats;
      temp.mainTripCost = cost;
      bookingCtx.setBookingInfo(temp);

      setOptionIsVisible((curr) => !curr);
      navigation.navigate("PassengerDetailsScreen", {
        selectedSeats: selectedSeats,
        price: cost,
        departurePlace: route?.params?.departurePlace,
        arrivalPlace: route?.params?.arrivalPlace,
        departureTime: route?.params?.departureTime,
        arrivalTime: route?.params?.arrivalTime,
        duration: route?.params?.duration,
        services: route?.params?.services,
        idTrip: route?.params?.idTrip,
        roundTripDate: route?.params?.roundTripDate,
        trip: route?.params?.trip,
        isSelectForRoundTrip: route?.params?.isSelectForRoundTrip,
      });
    } else {
      const temp = bookingCtx.bookingInfo;
      temp.RoundTripSelectedSeats = selectedSeats;
      temp.RoundTripCost = cost;
      bookingCtx.setBookingInfo(temp);

      setOptionIsVisible((curr) => !curr);
      navigation.push("PassengerDetailsScreen", {
        selectedSeats: selectedSeats,
        price: cost,
        departurePlace: route?.params?.departurePlace,
        arrivalPlace: route?.params?.arrivalPlace,
        departureTime: route?.params?.departureTime,
        arrivalTime: route?.params?.arrivalTime,
        duration: route?.params?.duration,
        services: route?.params?.services,
        idTrip: route?.params?.idTrip,
        roundTripDate: route?.params?.roundTripDate,
        trip: route?.params?.trip,
        isSelectForRoundTrip: route?.params?.isSelectForRoundTrip,
      });
    }
  }
  function YesOptionHandler() {
    if (!route?.params?.isSelectForRoundTrip) {
      let temp = bookingCtx.bookingInfo;

      temp.mainTripSelectedSeats = selectedSeats;
      temp.mainTripCost = cost;
      bookingCtx.setBookingInfo(temp);

      setOptionIsVisible((curr) => !curr);
      navigation.navigate("SelectPointScreen", {
        selectedSeats: selectedSeats,
        price: cost,
        departurePlace: route?.params?.departurePlace,
        arrivalPlace: route?.params?.arrivalPlace,
        departureTime: route?.params?.departureTime,
        arrivalTime: route?.params?.arrivalTime,
        duration: route?.params?.duration,
        services: route?.params?.services,
        idTrip: route?.params?.idTrip,
        roundTripDate: route?.params?.roundTripDate,
        trip: route?.params?.trip,
        isSelectForRoundTrip: route?.params?.isSelectForRoundTrip,
      });
    } else {
      const temp = bookingCtx.bookingInfo;

      temp.RoundTripSelectedSeats = selectedSeats;
      temp.RoundTripCost = cost;
      bookingCtx.setBookingInfo(temp);

      setOptionIsVisible((curr) => !curr);

      navigation.push("SelectPointScreen", {
        selectedSeats: selectedSeats,
        price: cost,
        departurePlace: route?.params?.departurePlace,
        arrivalPlace: route?.params?.arrivalPlace,
        departureTime: route?.params?.departureTime,
        arrivalTime: route?.params?.arrivalTime,
        duration: route?.params?.duration,
        services: route?.params?.services,
        idTrip: route?.params?.idTrip,
        roundTripDate: route?.params?.roundTripDate,
        trip: route?.params?.trip,
        isSelectForRoundTrip: route?.params?.isSelectForRoundTrip,
      });
    }
  }
  return (
    <>
      <YesNoPopUp
        isVisible={optionIsVisible}
        title={"Option"}
        textBody={"Do you want to use shuttle service ?"}
        NoHandler={NoOptionHandler}
        YesHandler={YesOptionHandler}
      />
      <PopUp
        title={"Error"}
        type={"Error"}
        textBody={"Please select a seat"}
        isVisible={modalIsVisible}
        callback={() => setModalIsVisible(!modalIsVisible)}
      />
      <View style={styles.root}>
        <View
          style={{
            paddingHorizontal: 10,
            backgroundColor: GlobalColors.headerColor,
          }}
        >
          <BookingTimeLine position={0} />
        </View>
        {/* <View style={{ height: 40, marginHorizontal: 5 }}>
        
        </View> */}

        {capacity != 36 && (
          <ScrollView
            style={styles.subRoot}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>Pick your seat</Text>
            <View style={styles.seatType}>
              <SeatItem type={"empty"} label={"Vacant"} />
              <SeatItem type={"reserved"} label={"Busy"} />
              <SeatItem type={"yourChoice"} label={"Your Choice"} />
            </View>
            {capacity == 15 && (
              <View style={[styles.seatsCoachContainer, { marginBottom: 130 }]}>
                <Image
                  style={styles.coachContainer}
                  source={require("../../../icon/seats_15.png")}
                />
                <View
                  style={{
                    position: "absolute",
                    top: 100,
                    left: 70,
                    justifyContent: "space-between",
                    gap: 20,
                  }}
                >
                  {seats.map((item, index) => {
                    return (
                      <View key={index} style={{ flexDirection: "row" }}>
                        {item.map((seat, subIndex) => {
                          return (
                            <View
                              key={subIndex}
                              style={
                                subIndex == 1 && {
                                  marginLeft: -12,
                                  marginRight: 10,
                                }
                              }
                            >
                              <SeatItem
                                size={40}
                                number={seat.number}
                                type={
                                  seat.taken
                                    ? "reserved"
                                    : seat.selected
                                    ? "yourChoice"
                                    : "empty"
                                }
                                onPress={() => {
                                  selectedSeatHandler(
                                    index,
                                    subIndex,
                                    seat.number
                                  );
                                }}
                              />
                            </View>
                          );
                        })}
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            {capacity == 30 && (
              <View
                style={[
                  styles.seatsCoachContainer,
                  { marginLeft: 40, marginBottom: 160 },
                ]}
              >
                <Image
                  style={styles.coachContainer}
                  source={require("../../../icon/seats_30.png")}
                />
                <View
                  style={{
                    position: "absolute",
                    top: 130,
                    left: 35,
                    justifyContent: "space-between",
                    gap: 20,
                  }}
                >
                  {seats.map((item, index) => {
                    return (
                      <View key={index} style={{ flexDirection: "row" }}>
                        {item.map((seat, subIndex) => {
                          return (
                            <View
                              key={subIndex}
                              style={[
                                subIndex == 1 && {
                                  marginLeft: -12,
                                  marginRight: 20,
                                },
                                subIndex == 3 && {
                                  marginLeft: -12,
                                },
                              ]}
                            >
                              <SeatItem
                                size={36}
                                number={seat.number}
                                type={
                                  seat.taken
                                    ? "reserved"
                                    : seat.selected
                                    ? "yourChoice"
                                    : "empty"
                                }
                                onPress={() => {
                                  selectedSeatHandler(
                                    index,
                                    subIndex,
                                    seat.number
                                  );
                                }}
                              />
                            </View>
                          );
                        })}
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            {capacity == 55 && (
              <View
                style={[
                  styles.seatsCoachContainer,
                  { marginLeft: 40, marginBottom: 160 },
                ]}
              >
                <Image
                  style={styles.coachContainer}
                  source={require("../../../icon/seats_55.png")}
                />
                <View
                  style={{
                    position: "absolute",
                    top: 110,
                    left: 50,
                    justifyContent: "space-between",
                    gap: 13,
                  }}
                >
                  {seats.map((item, index) => {
                    return (
                      <View key={index} style={{ flexDirection: "row" }}>
                        {item.map((seat, subIndex) => {
                          return (
                            <View
                              key={subIndex}
                              style={[
                                subIndex == 1 && {
                                  marginLeft: -12,
                                  marginRight: 20,
                                },
                                subIndex == 3 && {
                                  marginLeft: -12,
                                },
                              ]}
                            >
                              <SeatItem
                                size={31}
                                number={seat.number}
                                type={
                                  seat.taken
                                    ? "reserved"
                                    : seat.selected
                                    ? "yourChoice"
                                    : "empty"
                                }
                                onPress={() => {
                                  selectedSeatHandler(
                                    index,
                                    subIndex,
                                    seat.number
                                  );
                                }}
                              />
                            </View>
                          );
                        })}
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            <View style={{ height: 100 }} />
          </ScrollView>
        )}

        {/* Xe giường nằm */}

        {route?.params?.capacity == 36 && (
          <ScrollView
            style={styles.subRoot}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>Pick your seat</Text>
            <View style={styles.seatType}>
              <SleeperSeatItem type={"empty"} label={"Vacant"} />
              <SleeperSeatItem type={"reserved"} label={"Busy"} />
              <SleeperSeatItem type={"yourChoice"} label={"Your Choice"} />
            </View>

            {route?.params?.capacity == 36 && (
              <View
                style={[
                  {
                    marginBottom: 160,
                    flexDirection: "row",
                    alignItems: "center",
                  },
                ]}
              >
                {/* First Floor */}
                <View style={{ marginRight: 35 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "bold",
                      marginBottom: 20,
                      position: "absolute",
                      zIndex: 1,
                      left: 55,
                      right: 0,
                      top: 20,
                      alignSelf: "center",
                      opacity: 0.5,
                    }}
                  >
                    First Floor
                  </Text>

                  <Image
                    style={[
                      styles.coachContainer,
                      {
                        width: 180,
                        height: 489,
                      },
                    ]}
                    source={require("../../../icon/sleeper_first_floor.png")}
                    resizeMode="stretch"
                  />
                  <View
                    style={{
                      position: "absolute",
                      top: 100,
                      left: 20,
                      justifyContent: "space-between",
                      gap: 13,
                    }}
                  >
                    {seats.map((item, index) => {
                      return (
                        <View key={index} style={{ flexDirection: "row" }}>
                          {item.map((seat, subIndex) => {
                            return (
                              <View
                                key={subIndex}
                                style={[
                                  subIndex == 1 && {
                                    marginRight: 10,
                                  },
                                  subIndex == 2 && {
                                    marginLeft: -12,
                                    marginRight: 45,
                                  },
                                ]}
                              >
                                <SleeperSeatItem
                                  // size={31}
                                  number={seat.number}
                                  type={
                                    seat.taken
                                      ? "reserved"
                                      : seat.selected
                                      ? "yourChoice"
                                      : "empty"
                                  }
                                  onPress={() => {
                                    selectedSeatHandler(
                                      index,
                                      subIndex,
                                      seat.number
                                    );
                                  }}
                                />
                              </View>
                            );
                          })}
                        </View>
                      );
                    })}
                  </View>
                </View>
                {/* Second Floor */}
                <View
                  style={{
                    marginLeft: -23,
                    zIndex: -1,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "bold",
                      marginBottom: 20,
                      position: "absolute",
                      zIndex: 1,
                      left: 50,
                      right: 0,
                      top: 20,
                      alignSelf: "center",
                      opacity: 0.5,
                    }}
                  >
                    Second Floor
                  </Text>
                  <Image
                    style={[
                      styles.coachContainer,
                      {
                        width: 180,
                        height: 489,
                      },
                    ]}
                    source={require("../../../icon/sleeper_second_floor.png")}
                    resizeMode="stretch"
                  />
                  <View
                    style={{
                      position: "absolute",
                      top: 110,
                      left: 50,
                      justifyContent: "space-between",
                      gap: 13,
                    }}
                  ></View>
                </View>
              </View>
            )}

            <View style={{ height: 100 }} />
          </ScrollView>
        )}

        {/* Xe giường nằm */}

        <View style={styles.calculatePriceContainer}>
          {selectedSeats.length !== 0 && (
            <View
              style={{
                borderRadius: 10,
                backgroundColor: GlobalColors.button,
                width: 85,
                padding: 5,
                marginLeft: 10,
                marginTop: -14,
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "600",
                  color: "white",
                  textAlign: "center",
                }}
              >
                Your seats ({selectedSeats && selectedSeats.length})
              </Text>
            </View>
          )}

          <View style={{ padding: 5, marginBottom: -15 }}>
            <FlatList
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.number}
              horizontal
              data={selectedSeats}
              renderItem={(itemData) => (
                <SeatItemSelected
                  number={itemData.item.number}
                  index={itemData.item.row}
                  subIndex={itemData.item.column}
                />
              )}
            />
          </View>
          {/* <View></View> */}
          <View style={styles.pickUpSeat}>
            <View style={{ flexDirection: "row", flex: 1, marginTop: 10 }}>
              <Text
                style={{ color: "orange", fontWeight: "bold", fontSize: 22 }}
              >
                {addDotsToNumber(cost)} VND
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <CustomButton
                color={GlobalColors.lightBackground}
                onPress={selectTripHandler}
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
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    Passengers Detail
                  </Text>
                  <Entypo name="chevron-thin-right" size={24} color="white" />
                </View>
              </CustomButton>
            </View>
          </View>
        </View>
      </View>
    </>
  );
}
export default SelectSeatsScreen;
const styles = StyleSheet.create({
  root: {
    // flex: 1,
  },
  subRoot: {
    padding: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 20,
  },
  seatType: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  seatsCoachContainer: {
    alignItems: "center",
    marginLeft: 30,
  },
  coachContainer: {},
  calculatePriceContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    height: 250,
  },
  pickUpSeat: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 25,
    paddingTop: 20,
    paddingHorizontal: 20,
    height: 160,
    backgroundColor: "white",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  seatItemSelected: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  pressed: {
    opacity: 0.7,
  },
});
