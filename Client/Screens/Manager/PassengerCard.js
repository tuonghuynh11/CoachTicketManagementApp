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
import { CheckBox } from "react-native-elements";
import i18next from "../../Services/i18next";
import { useTranslation } from "react-i18next";

export default function PassengerCard({ item }) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.contentView}>
        {/**Image of coach */}

        <Image
          style={styles.imagePassenger}
          source={require("../../../assets/peopleIcon.jpg")}
        />

        <View style={styles.info}>
          {/**coachnum, type */}
          <Text style={styles.text}>{t("full-name")}: {item.name}</Text>
          <Text style={styles.text}>{t("phone-number")}: {item.phone}</Text>
        </View>
        <View style={styles.edit}>
          {/*icon edit and delete*/}
          <CheckBox checked={item.status} checkedColor="#72C6A1" />
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
  contentView: {
    flex: 1,
    flexDirection: "row",
  },
  imagePassenger: {
    flex: 3,
    width: 100,
    height: 120,
    resizeMode: "contain",
    marginLeft: 10,
  },
  info: {
    flex: 7,
    paddingTop: 25,
    paddingLeft: 10,
  },
  edit: {
    flex: 1,
    paddingEnd: 20,
    paddingTop: 30,
  },
  text: {
    flex: 1,
    fontSize: 14,
    color: "#283663",
    fontWeight: "600",
  },
});
