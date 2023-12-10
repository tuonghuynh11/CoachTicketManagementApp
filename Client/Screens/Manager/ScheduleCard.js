import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  Pressable,
} from "react-native";
import {React, useState} from "react";
import { MaterialIcons } from "@expo/vector-icons";
import ModalFail from "./Popup/ModalFail";
import ModalSuccess from "./Popup/ModalSuccess";
import ModalConfirm from "./Popup/ModalConfirm";
import { deleteSchedule } from "../../util/scheduleService";

export default function ScheduleCard({ item, navigation, deleteHandler }) {
  const pressHandler = () => {
    navigation.navigate("EditSchedule", item);
  };

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

  const confirm2 = () =>{
    deleteHandler(item.id);
    confirm();
  }

  const confirm = async () =>{
    try{
      const deletedSchedule = deleteSchedule(item.id);
      console.log(deletedSchedule);
      hideC()
      showSuccess();
      //fetch();
    }catch(error){
      console.log(error);
      hideC();
      showFail();
    }
  }
  

  let statusName = "";
  if (item.status == "0") statusName = "Unready";
  if (item.status == "1") statusName = "Ready";
  if (item.status == "2") statusName = "Arriving";
  if (item.status == "3") statusName = "Finish";

  const depTime = new Date(item.departureTime);
  const arrTime = new Date(item.arrivalTime);

  const contentS = "Delete Successfully!";
  const contentF = "Delete Fail!";
  const contentC = "Are you sure to delete route?";

  return (
    <View style={styles.container}>
      <ModalSuccess visible={visibleSuccess} hide={hideSuccess} content={contentS}/>
        <ModalFail visible={visibleFail} hide={hideFail} content={contentF} />
        <ModalConfirm visible={visibleC} hide={hideC} content={contentC} confirm={confirm2}/>
      {/*status*/}
      <View>
        <Text
          style={
            (item.status == "0" && styles.statusTextUn) ||
            (item.status == "1" && styles.statusTextRea) ||
            (item.status == "2" && styles.statusTextArr) ||
            (item.status == "3" && styles.statusTextFin)
          }
        >
          {statusName}
        </Text>
      </View>
      <View style={styles.contentView}>
        {/**Image of coach */}

        {/* <Image
          style={styles.imageSchedule}
          source={require("../../../assets/scheduleTrip.png")}
        /> */}

        <View style={styles.info}>
          {/**coachnum, type */}
          <Text style={styles.text}>From: {item.StartPlaceData.placeName}</Text>
          <Text style={styles.text}>Start Time: {depTime.toLocaleString()}</Text>
          <Text style={styles.text}>To: {item.ArrivalPlaceData.placeName}</Text>
          <Text style={styles.text}>Arrival Time: {arrTime.toLocaleString()}</Text>
          <Text style={styles.text}>Price: {item.price}</Text>
        </View>
        <View style={styles.edit}>
          {/*icon edit and delete*/}
          <Pressable
            style={({ pressed }) => [styles.icon, pressed && { opacity: 0.6 }]}
            onPress={pressHandler}
          >
            <MaterialIcons name="edit" size={35} color="#72C6A1" />
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.icon, pressed && { opacity: 0.6 }]}
            onPress={showC}
          >
            <MaterialIcons name="delete" size={35} color="#EB3223" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: "#FFFFFF",
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  statusTextFin: {
    color: "white",
    backgroundColor: "#72C6A1",
    fontSize: 20,
    width: "40%",
    borderRadius: 10,
    textAlign: "center",
    margin: 5,
  },
  statusTextArr: {
    color: "white",
    backgroundColor: "#e9dd01",
    fontSize: 20,
    width: "40%",
    borderRadius: 10,
    textAlign: "center",
    margin: 5,
  },
  statusTextUn: {
    color: "white",
    backgroundColor: "#b7b7b7",
    fontSize: 20,
    width: "40%",
    borderRadius: 10,
    textAlign: "center",
    margin: 5,
  },
  statusTextRea: {
    color: "white",
    backgroundColor: "#d62b2b",
    fontSize: 20,
    width: "40%",
    borderRadius: 10,
    textAlign: "center",
    margin: 5,
  },
  contentView: {
    flex: 1,
    flexDirection: "row",
    paddingBottom: 20,
  },
  imageSchedule: {
    flex: 3,
    width: 100,
    height: 120,
    resizeMode: "contain",
    marginLeft: 5,
  },
  info: {
    flex: 7,
    paddingTop: 10,
    paddingLeft: 15,
  },
  edit: {
    flex: 1,
    paddingEnd: 5,
  },
  text: {
    flex: 1,
    fontSize: 18,
    color: "#283663",
    fontWeight: "600",
  },
  icon: {
    flex: 1,
    paddingTop: 5,
    marginBottom: 5,
  },
});
