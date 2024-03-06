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
import placeholder from "../../../assets/peopleIcon.jpg";
import i18next from "../../Services/i18next";
import { useTranslation } from "react-i18next";

export default function TrackingStaffCard({ item }) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {/*status*/}
      <View style={styles.contentView}>
        {/**Image of coach */}

        <Image
          style={styles.imageStaff}
          source={item.image != undefined ? { uri: item.image } : placeholder}
        />

        <View style={styles.info}>
          <Text style={styles.text}>{t("full-name")}: {item.fullName}</Text>
          <Text style={styles.text}>{t("phone-number")}: {item.phoneNumber}</Text>
          <Text style={styles.text}>{t("position")}: {item.positionId=='2'?"Driver":"Coach Assistant"}</Text>
        </View>
        {/* <View style={styles.edit}>
            <Pressable
              style={({ pressed }) => [styles.icon, pressed && { opacity: 0.6 }]}
              onPress={() => console.log("edit")}
            >
              <MaterialIcons name="edit" size={35} color="#72C6A1" />
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.icon, pressed && { opacity: 0.6 }]}
              onPress={() => console.log("delete")}
            >
              <MaterialIcons name="delete" size={35} color="#EB3223" />
            </Pressable>
          </View> */}
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
  },
  imageStaff: {
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
    marginBottom: 5,
  },
  icon: {
    flex: 1,
    paddingTop: 5,
  },
});
