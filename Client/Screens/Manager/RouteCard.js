import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  Pressable,
} from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import placeholder from "../../../assets/routeImage.png";
import ModalFail from "./Popup/ModalFail";
import ModalSuccess from "./Popup/ModalSuccess";
import ModalConfirm from "./Popup/ModalConfirm";
import {deleteRoute} from "../../util/routeService"
import i18next from "../../Services/i18next";
import { useTranslation } from "react-i18next";

export default function RouteCard({ item, navigation, deleteHandler}) {
  const { t } = useTranslation();

  const pressHandler = () => {
    navigation.navigate("EditRoute", item);
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
      const deletedRoute = await deleteRoute(item.id);
      console.log("Delected route: "+deletedRoute)
      hideC();
      showSuccess();
      //fetch();
    }catch(error){
      console.log(error);
      hideC();
      showFail();
    }
  }

  const contentS = t("delete-route-success");
  const contentF = t("delete-route-fail");
  const contentC = t("are-you-sure-to-delete");
  return (
    <View style={styles.container}>
      <ModalSuccess visible={visibleSuccess} hide={hideSuccess} content={contentS}/>
        <ModalFail visible={visibleFail} hide={hideFail} content={contentF} />
        <ModalConfirm visible={visibleC} hide={hideC} content={contentC} confirm={confirm2}/>
      <View style={styles.contentView}>
        {/**Image of coach */}

        {/* <Image
          style={styles.imageRoute}
          source={item.image != undefined ? { uri: item.image } : placeholder}
        /> */}

        <View style={styles.info}>
          {/**coachnum, type */}
          <Text style={styles.text}>{t("route-name")}: {item.routeName}</Text>
          <Text style={styles.text}>
            {t("departure-place")}: {item.departurePlace}
          </Text>
          <Text style={styles.text}>{t("arrival-place")}: {item.arrivalPlace}</Text>
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
  statusText: {
    color: "white",
    backgroundColor: "#72C6A1",
    fontSize: 20,
    width: "40%",
    borderRadius: 10,
    textAlign: "center",
    margin: 5,
  },
  contentView: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 10 
  },
  imageRoute: {
    flex: 3,
    width: 120,
    height: 100,
    resizeMode: "contain",
    marginLeft: 10,
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 10,
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
