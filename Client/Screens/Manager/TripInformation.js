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
import i18next from "../../Services/i18next";
import { useTranslation } from "react-i18next";

export default function TripInformation({ route, navigation }) {
  const { t } = useTranslation();

  const pressHandler = () => {
    navigation.goBack();
  };
  const [passengerList, setPassengerList] = useState([
    { id: "1", name: "Tom", phone: "01111111", status: true },
    { id: "2", name: "John", phone: "01111111", status: true },
    { id: "3", name: "Timmy", phone: "01111111", status: false },
    { id: "4", name: "Jack", phone: "01111111", status: true },
    { id: "5", name: "Mai", phone: "01111111", status: false },
  ]);

  const {
    RouteData,
    DriverData,
    CoachAssistantData,
    departureTime,
    arrivalTime,
    CoachData,
    StartPlaceData,
    ArrivalPlaceData,
    price,
    status,
    remainingSlot,
  } = route.params;

  const departure = new Date(departureTime);
  const arrival = new Date(arrivalTime);

  return (
    <TouchableWithoutFeedback
      style={{ flex: 1 }}
      onPress={() => Keyboard.dismiss()}
    >
      <SafeAreaView style={styles.container}>
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
          <Text style={styles.headerText}>{t("trip-information")}</Text>
        </View>
        <ScrollView
          style={styles.body}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          decelerationRate={"fast"}
        >
          <Text style={styles.title}>{t("general-information")}</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.text}>{t("driver")}: {DriverData.fullName}</Text>
            <Text style={styles.text}>
              {t("coach-assistant")}: {CoachAssistantData.fullName}
            </Text>
            <Text style={styles.text}>{t("from")}: {RouteData.departurePlace}</Text>
            <Text style={styles.text}>{t("to")}: {RouteData.arrivalPlace}</Text>
            <Text style={styles.text}>{t("price")}: {price}</Text>
            <Text style={styles.text}>{t("remaining-slot")}: {remainingSlot}</Text>
            <Text style={styles.text}>
              {t("status")}: {status == 0 ? "Current" : "Done"}
            </Text>
          </View>
          <Text style={styles.title}>{t("coach-information")}</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.text}>
              {t("coach-number")}: {CoachData.coachNumber}
            </Text>
            <Text style={styles.text}>
              {t("coach-type")}: {CoachData.CoachTypeData.typeName}
            </Text>
            <Text style={styles.text}>{t("capacity")}: {CoachData.capacity}</Text>
          </View>
          <Text style={styles.title}>{t("time-information")}</Text>

          <View style={styles.infoContainer}>
            <Text style={styles.text}>
              {t("departure-time")}: {departure.toLocaleString()}
            </Text>
            <Text style={styles.text}>
              {t("arrival-time")}: {arrival.toLocaleString()}
            </Text>
          </View>
          <Text style={styles.title}>{t("detail-place-information")}</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.text}>
              {t("departure-place")}: {StartPlaceData.placeName}
            </Text>
            <Text style={styles.text}>
              {t("arrival-place")}: {ArrivalPlaceData.placeName}
            </Text>
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
          <View>{/* Map */}</View>
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
    color: "#FFFFFF",
    marginVertical: 10,
    fontSize: 18,
  },
  listContainer: {},
  title: {
    fontSize: 20,
    color: "#72C6A1",
    marginLeft: 10,
    marginVertical: 5,
  },
});
