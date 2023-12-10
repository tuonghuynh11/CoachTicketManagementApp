import { View, StyleSheet, Image, Text, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import IconButton from "../../Componets/UI/IconButton";
import { StatusBar } from "expo-status-bar";
import GlobalColors from "../../Color/colors";
import { Octicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ServiceIcon from "../../Componets/Schedule/ServiceIcon";
import CustomButton from "../../Componets/UI/CustomButton";
import { useContext, useEffect, useState } from "react";
import { LogBox } from "react-native";
import { AuthContext } from "../../Store/authContex";
import { BookingContext } from "../../Store/bookingContext";

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

function TripDetailScreen({ navigation, route }) {
  const [tripInfo, setTripInfo] = useState({});
  const bookingCtx = useContext(BookingContext);

  useEffect(() => {
    if (route?.params?.isReview) {
      navigation.setOptions({
        presentation: "modal",
      });
    }
    console.log("Trip detail");
  }, []);
  useEffect(() => {
    //Load tripInfo from database API
    // LoadTripInfo(route?.params?.idSchedule)
    console.log("id Schedule", route.params.idSchedule);
    if (!route?.params?.isReview) {
      bookingCtx.IsTimeout(false);
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

    // const tripInfo = {
    //   id: 1,
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
    //   numberOfAvailableSeat: "4",
    //   services: ["Air Conditioner", "Wifi", "TV", "Blanket"],
    //   price: "120000",
    // };

    setTripInfo(route?.params?.trip);
    bookingCtx.setCurrentTrip(route?.params?.trip);
  }, []);
  function addDotsToNumber(number) {
    if (number) return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  function getDate(rawDate) {
    try {
      let date = new Date(rawDate);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();

      month = month < 10 ? `0${month}` : month;
      day = day < 10 ? `0${day}` : day;
      return `${day}-${month}-${year}`;
    } catch (error) {
      return;
    }
  }
  function getTime(rawDate) {
    try {
      let date = new Date(rawDate);
      let hour = date.getHours();
      let minutes = date.getMinutes();

      let season = hour < 12 ? "AM" : "PM";
      hour = hour < 10 ? `0${hour}` : hour;
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      return `${hour}:${minutes} ${season}`;
    } catch (error) {
      return;
    }
  }

  function selectTripHandler() {
    bookingCtx.resetTimeout();
    bookingCtx.startTimeout();
    if (route?.params?.isSelectForRoundTrip) {
      navigation.push("SelectSeatsScreen", {
        capacity: tripInfo.capacity,
        price: tripInfo.price,
        departurePlace: tripInfo.departurePlace,
        arrivalPlace: tripInfo.arrivalPlace,
        departureTime: tripInfo.departureTime,
        arrivalTime: tripInfo.arrivalTime,
        duration: tripInfo.duration,
        services: tripInfo.services,
        idTrip: tripInfo.id,
        roundTripDate: route?.params?.roundTripDate,
        trip: tripInfo,
        isSelectForRoundTrip: route?.params?.isSelectForRoundTrip,
      }); //get capacity Of coach from API
    } else {
      navigation.navigate("SelectSeatsScreen", {
        capacity: tripInfo.capacity,
        price: tripInfo.price,
        departurePlace: tripInfo.departurePlace,
        arrivalPlace: tripInfo.arrivalPlace,
        departureTime: tripInfo.departureTime,
        arrivalTime: tripInfo.arrivalTime,
        duration: tripInfo.duration,
        services: tripInfo.services,
        idTrip: tripInfo.id,
        roundTripDate: route?.params?.roundTripDate,
        trip: tripInfo,
        isSelectForRoundTrip: route?.params?.isSelectForRoundTrip,
      }); //get capacity Of coach from API
    }
  }
  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <Image
        defaultSource={require("../../../icon/defaultCoach.jpg")}
        style={styles.image}
        source={{
          uri: tripInfo.image,
        }}
      ></Image>
      <View style={styles.body}>
        <View
          style={{
            backgroundColor: "#4B2795",
            height: 40,
            width: 150,
            borderRadius: 10,
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "center",
            marginTop: -30,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            COACH {tripInfo.coachId}
          </Text>
        </View>

        <View
          style={{
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            borderWidth: 1,
            borderColor: "#EEF0EB",
            padding: 10,
            paddingBottom: 25,
            marginTop: 10,
            backgroundColor: "white",
          }}
        >
          <Text
            style={{
              color: "gray",
              fontSize: 20,
              fontWeight: "bold",
              opacity: 0.7,
            }}
          >
            {getDate(tripInfo.departureTime)}
          </Text>
        </View>

        <View
          style={{
            borderRadius: 10,
            borderWidth: 0.2,
            borderColor: "#d0d1cc",
            padding: 10,
            backgroundColor: "#F8F5F5",
            alignItems: "center",
            marginTop: -15,
            marginHorizontal: -5,
          }}
        >
          {/* <Text
            style={{
              color: "gray",
              fontSize: 20,
              fontWeight: "700",
              opacity: 0.7,
            }}
          >
            Bus no. {tripInfo.coachNumber}
          </Text> */}

          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: 10,
            }}
          >
            <View style={styles.dateTime}>
              <Text style={styles.time}>{tripInfo.departurePlace}</Text>

              <Text style={styles.date}>{getTime(tripInfo.departureTime)}</Text>
            </View>

            <View style={styles.iconActivity}>
              <View style={styles.iconContainer}>
                <Octicons name="dot" size={24} color="#1C6AE4" />
                <View
                  style={{
                    height: 1,
                    width: 100,
                    borderTopWidth: 1,
                    borderTopColor: "#1C6AE4",
                    opacity: 0.3,
                  }}
                ></View>
                <Octicons name="dot-fill" size={24} color="#1C6AE4" />
              </View>
              <View style={{ marginTop: -33 }}>
                <MaterialCommunityIcons
                  name="bus-articulated-front"
                  size={24}
                  color="#1C6AE4"
                />
              </View>
              <Text style={[styles.date, { marginTop: -1 }]}>
                {tripInfo.duration}
              </Text>
            </View>

            <View style={styles.dateTime1}>
              <Text style={styles.time}>{tripInfo.arrivalPlace}</Text>

              <Text style={styles.date}>{getTime(tripInfo.arrivalTime)}</Text>
            </View>
          </View>
        </View>
        <View style={styles.footer}>
          <Text style={styles.title}>Coach Information</Text>

          <View style={styles.textContainer}>
            <Text style={styles.text}>Capacity:</Text>
            <Text style={styles.text}> {tripInfo.capacity} seats</Text>
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.text}>Type:</Text>
            <Text style={styles.text}> {tripInfo.coachType}</Text>
          </View>

          <Text style={[styles.title, { marginTop: 8 }]}>Available Seats</Text>
          <Text style={styles.text}>
            {tripInfo.numberOfAvailableSeat} seats
          </Text>

          <View style={styles.subFooter}>
            <Text style={styles.title}>Utilities</Text>
            <ScrollView
              bounces="false"
              showsHorizontalScrollIndicator="false"
              horizontal
            >
              <View style={styles.serviceGroup}>
                {tripInfo.services &&
                  tripInfo.services.map((service, index) => (
                    <ServiceIcon key={index} serviceName={service} />
                  ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
      <View style={styles.pickUpSeat}>
        <View style={{ flexDirection: "row", flex: 1 }}>
          <Text style={{ color: "orange", fontWeight: "bold", fontSize: 18 }}>
            {addDotsToNumber(tripInfo.price)}VND
          </Text>
          <Text
            style={{
              color: "#868383",
              fontWeight: "bold",
              fontSize: 13,
              opacity: 0.6,
              marginTop: 8,
            }}
          >
            /seat
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <CustomButton
            color={GlobalColors.lightBackground}
            onPress={selectTripHandler}
            disabled={route?.params?.isReview}
          >
            Select
          </CustomButton>
        </View>
      </View>
      <View style={{ position: "absolute", height: 100, top: 27, left: 10 }}>
        <IconButton
          style={styles.icon}
          icon="arrow-back-sharp"
          size={30}
          color={"white"}
          onPress={() => {
            try {
              if (navigation.canGoBack()) {
                navigation.goBack();
              } else {
                navigation.replace("HomeScreen");
              }
            } catch (error) {
              navigation.replace("HomeScreen");
            }
          }}
        />
      </View>
    </View>
  );
}

export default TripDetailScreen;
const styles = StyleSheet.create({
  root: {
    flex: 1,
    height: "100%",
  },
  icon: {},
  iconContainer: {
    left: 10,
    top: 40,
    height: 100,
    position: "absolute",
    backgroundColor: "red",
  },
  image: {
    height: "30%",
    width: "100%",
  },
  body: {
    flex: 1,
    padding: 10,
    backgroundColor: "#F1F1F1",
  },
  iconActivity: {
    alignItems: "center",
    marginTop: 10,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  dateTime: {
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  dateTime1: {
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  time: {
    fontSize: 15,
    paddingBottom: 5,
    fontWeight: "700",
    color: GlobalColors.lightBackground,
    width: 110,
    textAlign: "center",
  },
  date: {
    fontSize: 14,
    opacity: 0.5,
  },
  footer: {
    backgroundColor: "white",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 10,
  },
  title: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
    marginBottom: 0,
    opacity: 0.4,
  },
  textContainer: {
    flexDirection: "row",
    marginVertical: 3,
    opacity: 0.9,
  },
  text: {
    fontSize: 16,
    opacity: 0.9,
  },
  subFooter: {
    marginTop: 10,
    paddingTop: 10,
    borderTopColor: "#F1F1F1",
    borderTopWidth: 1,
  },
  serviceGroup: {
    flexDirection: "row",
    gap: 10,
  },
  pickUpSeat: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    position: "absolute",
    paddingTop: 25,
    paddingHorizontal: 20,
    bottom: 0,
    right: 0,
    left: 0,
    height: 100,
    backgroundColor: "white",
  },
});
