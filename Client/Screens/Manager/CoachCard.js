import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import placeholder from "../../../assets/coachCarIcon.png";
import { deleteCoach } from "../../util/coachService";
import ModalSuccess from "./Popup/ModalSuccess";
import ModalFail from "./Popup/ModalFail";
import ModalConfirm from "./Popup/ModalConfirm";

export default function CoachCard({ item, navigation, fecth, showSuccess, showFail }) {
  const pressHandler = () => {
    navigation.navigate('EditCoach', item);
  }

  const [itemid, setItemid] = useState();
  
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
    try {
      const coachIdToDelete = item.id; 
      console.log(coachIdToDelete)
      const deletedCoach = await deleteCoach(coachIdToDelete);
      console.log('Deleted Coach:', deletedCoach);
      showSuccess()
      fecth();
      // Perform other actions
    } catch (error) {
      showFail()
      console.log(error)
    }
  }
  
  let nameStatus = 'Arriving';
  if(item.status == false){
    nameStatus = 'Ready';
  }
  const deleteHandler = async () => {
    showC();
  }

  

  return (
    <View style={styles.container}>
      <ModalConfirm visible={visibleC} hide={hideC} content={contentC} confirm={confirm}/>
      {/*status*/}
      <View>
        <Text style={item.status?styles.statusTextArr:styles.statusText}>{nameStatus}</Text>
      </View>
      <View style={styles.contentView}>
        {/**Image of coach */}

        <Image
          style={styles.imageCoach}
          source={(item.image!=undefined)?{uri: item.image}:placeholder}
        />

        <View style={styles.info}>
          {/**coachnum, type */}
          <Text style={styles.text}>Coach Number: {item.coachNumber}</Text>
          <Text style={styles.text}>Coach Type: {item.CoachTypeData.typeName}</Text>
          <Text style={styles.text}>Coach Capacity: {item.capacity}</Text>
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
            onPress={deleteHandler}
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
  statusText: {
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
  contentView: {
    flex: 1,
    flexDirection: "row",
  },
  imageCoach: {
    flex: 3,
    width: 120,
    height: 100,
    resizeMode: "contain",
    marginLeft: 10,
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 10
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
  },
});
