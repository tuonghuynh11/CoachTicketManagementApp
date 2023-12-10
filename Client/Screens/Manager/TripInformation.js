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
  FlatList,
} from "react-native";
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import PassengerCard from "./PassengerCard";

export default function TripInformation({ route, navigation }) {
  const pressHandler = () => {
    navigation.goBack();
  }
  const [passengerList, setPassengerList] = useState([
    {id: '1', name: 'Tom', phone: '01111111', status: true},
    {id: '2', name: 'John', phone: '01111111', status: true},
    {id: '3', name: 'Timmy', phone: '01111111', status: false},
    {id: '4', name: 'Jack', phone: '01111111', status: true},
    {id: '5', name: 'Mai', phone: '01111111', status: false},
  ])

  const {RouteData, DriverData, CoachAssistantData, departureTime, arrivalTime, CoachData, StartPlaceData, ArrivalPlaceData, price, status, remainingSlot} = route.params

  const departure = new Date(departureTime);
  const arrival = new Date(arrivalTime);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable style={({ pressed }) => [
              styles.backIcon,
              pressed && { opacity: 0.85 },
            ]} onPress={pressHandler}>

            <Ionicons
              name="ios-arrow-back-circle-sharp"
              size={38}
              color="#283663"
            />
          </Pressable>
          <Text style={styles.headerText}>Trip Information</Text>
        </View>
        <ScrollView
          style={styles.body}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          decelerationRate={"fast"}
        >
          <Text style={styles.title}>General Information</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.text}>Driver: {DriverData.fullName}</Text>
            <Text style={styles.text}>Coach Assistant: {CoachAssistantData.fullName}</Text>
            <Text style={styles.text}>From: {RouteData.departurePlace}</Text>
            <Text style={styles.text}>To: {RouteData.arrivalPlace}</Text>
            <Text style={styles.text}>Price: {price}</Text>
            <Text style={styles.text}>Remaining Slot: {remainingSlot}</Text>
            <Text style={styles.text}>Status: {status == 0?"Current":"Done"}</Text>
          </View>
          <Text style={styles.title}>Coach Information</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.text}>Coach Number: {CoachData.coachNumber}</Text>
            <Text style={styles.text}>Coach Type: {CoachData.CoachTypeData.typeName}</Text>
            <Text style={styles.text}>Capacity: {CoachData.capacity}</Text>
          </View>
          <Text style={styles.title}>Time Information</Text>

          <View style={styles.infoContainer}>
            <Text style={styles.text}>Departure Time: {departure.toLocaleString()}</Text>
            <Text style={styles.text}>Arrival Time: {arrival.toLocaleString()}</Text>
          </View>
          <Text style={styles.title}>Detail Place Information</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.text}>Departure Place: {StartPlaceData.placeName}</Text>
            <Text style={styles.text}>Arrival Place: {ArrivalPlaceData.placeName}</Text>
          </View>
          {/* <View style={styles.listContainer}>
            <FlatList scrollEnabled={false}
            data={passengerList}
            renderItem={({ item }) => (
              <TouchableWithoutFeedback onPress={() => {}}>
                <PassengerCard item={item}/>
              </TouchableWithoutFeedback>
            )}
            keyExtractor={(item) => item.id}/>
          </View> */}
          <View>
            {/* Map */}
          </View>
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
  body: {
    flex: 1,
  },
  infoContainer: {
    borderRadius: 10,
    elevation: 3,
    backgroundColor: "#283663",
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  text: {
    marginLeft: 20,
    color: '#FFFFFF',
    marginVertical: 10,
    fontSize: 18
  },
  listContainer: {
  },
  title: {
    fontSize: 20,
    color: '#72C6A1',
    marginLeft: 10,
    marginVertical: 5
  }
});
