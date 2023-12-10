import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Image,
  Dimensions,
} from "react-native";
import CustomButton from "../../Componets/UI/CustomButton";
import { useContext, useEffect, useState } from "react";
import TicketItem from "../../Componets/UI/TicketItem";
import { getDate, getTime } from "../../Helper/Date";
import { Octicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import GlobalColors from "../../Color/colors";
import { BookingContext } from "../../Store/bookingContext";
const { width: screenWidth } = Dimensions.get("window");

function ElectronicTicketScreen({ navigation, route }) {
  const [tickets, setTickets] = useState([]);
  const [tripInfo, setTripInfo] = useState({});
  const [roundTripInfo, setRoundTripInfo] = useState({});
  const bookingCtx = useContext(BookingContext);

  useEffect(() => {
    bookingCtx.IsTimeout(false);

    //Ticket Body
    // reservationId: "1",
    // seatNumber: "12",
    // fullName: "Nguyen Van A",
    // coachType: "Limousine",
    // status: 0,

    // setTripInfo({
    //   departurePlace: route?.params?.departurePlace,
    //   arrivalPlace: route?.params?.arrivalPlace,
    //   departureTime: route?.params?.departureTime,
    //   arrivalTime: route?.params?.arrivalTime,
    //   duration: route?.params?.duration,
    //   services: route?.params?.services,
    //   idTrip: route?.params?.idTrip,
    //   passengers: route?.params?.passengers,
    //   roundTripDate: route?.params?.roundTripDate,
    //   shuttleRoute: route?.params?.shuttleRoute,
    // });

    const temp = bookingCtx?.bookingInfo?.mainTripInfo;
    setTripInfo({
      departurePlace: temp?.departurePlace,
      arrivalPlace: temp?.arrivalPlace,
      departureTime: new Date(temp?.departureTime),
      arrivalTime: new Date(temp?.arrivalTime),
      duration: temp?.duration,
      services: temp?.services,
      idTrip: temp?.id,
      passengers: bookingCtx?.bookingInfo?.mainTripPassengers,
      roundTripDate: new Date(
        bookingCtx?.bookingInfo?.roundTripInfo?.departureTime
      ),
      shuttleRoute: bookingCtx?.bookingInfo?.mainTripShuttleRoute,
    });
    const temp2 = bookingCtx?.bookingInfo?.roundTripInfo;

    setRoundTripInfo({
      departurePlace: temp2?.departurePlace,
      arrivalPlace: temp2?.arrivalPlace,
      departureTime: new Date(temp2?.departureTime),
      arrivalTime: new Date(temp2?.arrivalTime),
      duration: temp2?.duration,
      services: temp2?.services,
      idTrip: temp2?.id,
      passengers: bookingCtx?.bookingInfo?.roundTripPassengers,
      roundTripDate: null,
      shuttleRoute: bookingCtx?.bookingInfo?.roundTripShuttleRoute,
    });
    const paymentStatus = route?.params?.paymentStatus;
    const reservationIds = route?.params?.reservationIds;
    const reservationsRoundTrip = route?.params?.reservationsRoundTrip;

    const mainTickets = bookingCtx?.bookingInfo?.mainTripPassengers?.map(
      (item, index) => {
        return {
          ticketType: 0, //0:main ticket,1:roundTrip ticket
          reservationId: reservationIds[index],
          seatNumber:
            item.seatNumber < 10 ? "0" + item.seatNumber : item.seatNumber,
          fullName: item.fullName,
          coachType: temp?.coachType,
          status: paymentStatus,
        };
      }
    );
    const roundTripTickets = bookingCtx?.bookingInfo?.roundTripPassengers?.map(
      (item, index) => {
        return {
          ticketType: 1, //0:main ticket,1:roundTrip ticket
          reservationId: reservationsRoundTrip[index],
          seatNumber:
            item.seatNumber < 10 ? "0" + item.seatNumber : item.seatNumber,
          fullName: item.fullName,
          coachType: temp2?.coachType,
          status: paymentStatus,
        };
      }
    );
    const union = [...mainTickets, ...roundTripTickets];
    setTickets(union);
    console.log("mainTrip:", {
      departurePlace: temp?.departurePlace,
      arrivalPlace: temp?.arrivalPlace,
      departureTime: new Date(temp?.departureTime),
      arrivalTime: new Date(temp?.arrivalTime),
      duration: temp?.duration,
      services: temp?.services,
      idTrip: temp?.id,
      passengers: bookingCtx?.bookingInfo?.mainTripPassengers,
      roundTripDate: new Date(
        bookingCtx?.bookingInfo?.roundTripInfo?.departureTime
      ),
      shuttleRoute: bookingCtx?.bookingInfo?.mainTripShuttleRoute,
    });
    console.log("roundTrip:", {
      departurePlace: temp2?.departurePlace,
      arrivalPlace: temp2?.arrivalPlace,
      departureTime: new Date(temp2?.departureTime),
      arrivalTime: new Date(temp2?.arrivalTime),
      duration: temp2?.duration,
      services: temp2?.services,
      idTrip: temp2?.id,
      passengers: bookingCtx?.bookingInfo?.roundTripPassengers,
      roundTripDate: null,
      shuttleRoute: bookingCtx?.bookingInfo?.roundTripShuttleRoute,
    });
    // setTickets(route.params.tickets);
  }, []);
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
  function returnHomeHandler() {
    navigation.reset({
      index: 0,
      routes: [{ name: "HomeScreen" }],
    });
    bookingCtx.clearBookingInfo();
    bookingCtx.clearBookingInfoTemp();
  }

  function renderTicketItem(itemData) {
    if (itemData.item.ticketType == 0) {
      return (
        <View
          style={[
            itemData.index == 0 && { paddingRight: 30 },
            itemData.index != 0 && { paddingRight: 20 },
            itemData.index == tickets.length - 1 && { paddingRight: 0 },

            {
              width: screenWidth,
              alignContent: "center",
              alignSelf: "center",
              alignItems: "center",
              marginLeft: 5,
            },
          ]}
        >
          <TicketItem tripInfo={tripInfo} ticket={itemData.item} />
        </View>
      );
    } else {
      return (
        <View
          style={[
            itemData.index == 0 && { paddingRight: 30 },
            itemData.index != 0 && { paddingRight: 20 },
            itemData.index == tickets.length - 1 && { paddingRight: 0 },
            {
              width: screenWidth,
              alignContent: "center",
              alignSelf: "center",
              alignItems: "center",
              marginLeft: 5,
            },
          ]}
        >
          <TicketItem tripInfo={roundTripInfo} ticket={itemData.item} />
        </View>
      );
    }
  }
  return (
    <View style={styles.root}>
      <FlatList
        pagingEnabled
        horizontal
        data={tickets}
        renderItem={renderTicketItem}
        showsHorizontalScrollIndicator={false}
        snapToInterval={screenWidth + 10}
        decelerationRate="fast"
      />

      <View
        style={{
          margin: 10,
          position: "absolute",
          bottom: 20,
          left: 0,
          right: 0,
          marginHorizontal: 20,
        }}
      >
        <CustomButton
          radius={10}
          color={GlobalColors.lightBackground}
          onPress={returnHomeHandler}
        >
          <Text
            style={{
              textAlign: "center",
              color: "white",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            Return to home
          </Text>
        </CustomButton>
      </View>
    </View>
  );
}

export default ElectronicTicketScreen;
const styles = StyleSheet.create({
  root: {
    flex: 1,
    // marginVertical: 20,
    margin: 20,
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 10,
  },
});
