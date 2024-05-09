import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  SafeAreaView,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Image,
  Modal,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import StaffCard from "./StaffCard";
import TrackingStaffCard from "./TrackingStaffCard";
import PassengerCard from "./PassengerCard";
import FilterModal from "./Popup/SettingModal";
import ModalSuccess from "./Popup/ModalSuccess";
import ModalFail from "./Popup/ModalFail";
import ModalConfirm from "./Popup/ModalConfirm";
import { deleteSchedule } from "../../util/scheduleService";
import i18next from "../../Services/i18next";
import { useTranslation } from "react-i18next";

export default function DetailSchedule({ route, navigation }) {
  const { t } = useTranslation();

  const pressHandler = () => {
    navigation.goBack();
  };

  const contentC = t("are-you-sure-to-delete");
  const [visibleC, setVisibleC] = useState(false);
  const showC = () => {
    setVisibleC(true);
  };
  const hideC = () => {
    setVisibleC(false);
  };

  const [visibleSuccess, setVisibleSuccess] = useState(false);
  const showSuccess = () => {
    setVisibleSuccess(true);
  };
  const hideSuccess = () => {
    setVisibleSuccess(false);
  };

  const [visibleFail, setVisibleFail] = useState(false);
  const showFail = () => {
    setVisibleFail(true);
  };
  const hideFail = () => {
    setVisibleFail(false);
  };

  const { CoachData, id } = route.params;
  const { RouteData } = route.params;
  const { DriverData } = route.params;
  const { CoachAssistantData } = route.params;
  const { StartPlaceData } = route.params;
  const { ArrivalPlaceData } = route.params;
  const { price } = route.params;
  const { status } = route.params;
  const { departureTime } = route.params;
  const { arrivalTime } = route.params;

  const depTime = new Date(departureTime);
  const arrTime = new Date(arrivalTime);

  let statusName = "";
  if (status == "0") statusName = t("unready");
  if (status == "1") statusName = t("ready");
  if (status == "2") statusName = t("arriving");
  if (status == "3") statusName = t("finish");

  const [staffList, setStaffList] = useState([DriverData, CoachAssistantData]);

  const [visible, setVisible] = useState(false);
  const show = () => {
    setVisible(true);
  };
  const hide = () => {
    setVisible(false);
  };

  const settingHadler = () => {
    show();
  };
  const navigateScreen = "EditSchedule";

  const contentSuccess = t("delete-schedule-success");
  const contentFail = t("delete-schedule-fail");

  const deleteHandler = async () => {
    showC();
  };

  const confirm = async () => {
    hideC();
    hide();
    try {
      const coachIdToDelete = id;
      console.log(coachIdToDelete);
      const deletedSchedule = await deleteSchedule(coachIdToDelete);
      console.log("Deleted schedule:", deletedSchedule);
      showSuccess();
      hide();
      navigation.goBack();
      // Perform other actions
    } catch (error) {
      showFail();
      console.log(error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <ModalConfirm
          visible={visibleC}
          hide={hideC}
          content={contentC}
          confirm={confirm}
        />
        <ModalSuccess
          visible={visibleSuccess}
          hide={hideSuccess}
          content={contentSuccess}
        />
        <ModalFail
          visible={visibleFail}
          hide={hideFail}
          content={contentFail}
        />
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
          <Text style={styles.headerText}>{t("detail-schedule")}</Text>
          <Pressable
            style={({ pressed }) => [
              styles.settingIconStyle,
              pressed && { opacity: 0.85 },
            ]}
            onPress={settingHadler}
          >
            <Ionicons name="settings" size={32} color="#283663" />
          </Pressable>
        </View>
        <FilterModal
          visible={visible}
          hide={hide}
          navigation={navigation}
          navigateScreen={navigateScreen}
          item={route.params}
          deleteCoach={deleteHandler}
        />
        <ScrollView
          style={styles.body}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          decelerationRate={"fast"}
        >
          <View style={styles.infoContainer}>
            <Text style={styles.text}>
              {t("coach-number")}: {CoachData.coachNumber}
            </Text>
            <Text style={styles.text}>
              {t("from")}: {StartPlaceData.placeName},{" "}
              {RouteData.departurePlace}
            </Text>
            <Text style={styles.text}>
              {t("to")}: {ArrivalPlaceData.placeName}, {RouteData.arrivalPlace}
            </Text>
            <Text style={styles.text}>
              {t("start-time")}: {depTime.toLocaleString()}
            </Text>
            <Text style={styles.text}>
              {t("arrival-time")}: {arrTime.toLocaleString()}
            </Text>
            <Text style={styles.text}>
              {t("price")}: {price}
            </Text>
            <Text style={styles.text}>
              {t("status")}: {statusName}
            </Text>
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{t("driver-coach-assist")}</Text>
            {/* <AntDesign
              name="pluscircle"
              size={30}
              color="#72C6A1"
              style={styles.addIconStyle}
            /> */}
          </View>
          <View>
            <FlatList
              scrollEnabled={false}
              data={staffList}
              renderItem={({ item }) => (
                <TouchableWithoutFeedback onPress={() => {}}>
                  <TrackingStaffCard item={item} />
                </TouchableWithoutFeedback>
              )}
              keyExtractor={(item) => item.id}
            />
          </View>
          {/* <View>
            <Text style={styles.title}>Passenger</Text>
          </View>
          <View>
            <FlatList
              showsHorizontalScrollIndicator={false}
              nestedScrollEnabled={true}
              horizontal={true}
              data={passengerList}
              renderItem={({ item }) => <PassengerCard item={item} />}
              keyExtractor={(item) => item.id}
            />
          </View> */}
          <View>
            <Text style={styles.title}>{t("coach")}</Text>
          </View>
          <View style={styles.imageContainer}>
            <Image
              style={styles.coachImage}
              source={
                CoachData.image != undefined
                  ? { uri: CoachData.image }
                  : {
                      uri: "https://upload.wikimedia.org/wikipedia/commons/5/50/Ausden_Clark_Executive_Coach_in_Black_and_Pink_Livery.jpg",
                    }
              }
            />
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
  settingIconStyle: {
    position: "absolute",
    right: 16,
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
  title: {
    fontSize: 20,
    color: "#283663",
    marginLeft: 10,
    marginVertical: 5,
  },
  imageContainer: {
    borderRadius: 10,
    marginHorizontal: 10,
    height: 200,
    marginBottom: 20,
    overflow: "hidden",
  },
  coachImage: {
    width: "100%",
    height: "100%",
  },
  titleContainer: {
    flexDirection: "row",
  },
  addIconStyle: {
    marginLeft: 20,
    marginTop: 5,
  },
});
