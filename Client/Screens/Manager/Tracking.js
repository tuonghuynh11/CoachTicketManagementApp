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
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import StaffCard from "./StaffCard";
import TrackingStaffCard from "./TrackingStaffCard";
import PassengerCard from "./PassengerCard";
import FilterModal from "./Popup/SettingModal";
import placeholder from "../../../assets/coachCarIcon.png";
import ServiceCard from "./ServiceCard";
import ModalSuccess from "./Popup/ModalSuccess";
import ModalFail from "./Popup/ModalFail";
import ModalConfirm from "./Popup/ModalConfirm";
import { deleteCoach } from "../../util/coachService";

export default function Tracking({ route, navigation }) {
  const pressHandler = () => {
    navigation.goBack();
  };
  const [serviceList, setServiceList] = useState([]);

  const { coachNumber } = route.params;
  const { idCoachType } = route.params;
  const { status } = route.params;
  const { id } = route.params;
  const { capacity } = route.params;
  const { lat } = route.params;
  const { lng } = route.params;
  const { image } = route.params;
  const { CoachTypeData } = route.params;
  const {ServiceData} = route.params;
  const ServiceList = ServiceData.map((item, index) => ({
    id: index + 1,
    name: item,
  })); 

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

  const contentC = "Are you sure to delete coach?"
  const [visibleC, setVisibleC] = useState(false);
  const showC = () => {
    setVisibleC(true);
  };
  const hideC = () => {
    setVisibleC(false);
  };

  const confirm = async () => {
    hideC();
    hide()
    try {
      const coachIdToDelete = id; 
      console.log(coachIdToDelete)
      const deletedCoach = await deleteCoach(coachIdToDelete);
      console.log('Deleted Coach:', deletedCoach);
      showSuccess()
      hide();
      navigation.goBack();
      // Perform other actions
    } catch (error) {
      showFail()
      console.log(error)
    }
  }

  const navigateScreen = "EditCoach";

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

  const contentSuccess = "Delete coach successfully!";
  const contentFail = "Delete coach fail!";

  const deleteHandler = async () => {
    showC();
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
      <ModalConfirm visible={visibleC} hide={hideC} content={contentC} confirm={confirm}/>
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
          <Pressable onPress={pressHandler} style={styles.backIcon}>
            <Ionicons
              name="ios-arrow-back-circle-sharp"
              size={38}
              color="#283663"
            />
          </Pressable>
          <Text style={styles.headerText}>Coach Detail</Text>
          <Pressable style={styles.settingIconStyle} onPress={settingHadler}>
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
            <Text style={styles.text}>Coach Number: {coachNumber}</Text>
            <Text style={styles.text}>Type: {CoachTypeData.typeName}</Text>
            <Text style={styles.text}>Capacity: {capacity}</Text>
            <Text style={styles.text}>Lat: {lat}</Text>
            <Text style={styles.text}>Lng: {lng}</Text>
          </View>
          <View>
            <Text style={styles.title}>Tracking</Text>
          </View>
          {/* <View></View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Driver & Coach Assistant</Text>
            
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
          </View> */}
          <View>
            <Text style={styles.title}>Services</Text>
          </View>
          <View style={styles.listService}>
            <FlatList
              showsHorizontalScrollIndicator={false}
              // nestedScrollEnabled={true}
              horizontal={true}
              data={ServiceList}
              renderItem={({ item }) => <ServiceCard item={item}></ServiceCard>}
              keyExtractor={(item) => item.id}
            />
          </View>
          <View>
            <Text style={styles.title}>Coach</Text>
          </View>
          <View style={styles.imageContainer}>
            <Image
              style={styles.coachImage}
              source={image != undefined ? { uri: image } : placeholder}
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
  listService: {
    marginHorizontal: 20,
    marginVertical: 10,
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 10,
    height: 120,
    paddingTop: 18,
    borderColor: "#283663",
    borderWidth: 1,
  },
});
