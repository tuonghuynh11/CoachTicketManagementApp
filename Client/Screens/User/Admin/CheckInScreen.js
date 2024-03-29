import { BarCodeScanner } from "expo-barcode-scanner";
import { StatusBar } from "expo-status-bar";
import { images } from "../../../../assets/Assets";
import { useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { addDotsToNumber } from "../../../Helper/Date";
import {} from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  FlatList,
  SafeAreaView,
  ScrollView,
  Pressable,
} from "react-native";
import { useTranslation } from "react-i18next";
const tickets = [
  {
    barcode: "T1245f33",
  },
  {
    barcode: "T1245f33",
  },
  {
    barcode: "T1245f33",
  },
  {
    barcode: "T1245f33",
  },
  {
    barcode: "T1245f33",
  },
];
function CheckScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState("Not yet scanned");
  const { t } = useTranslation();
  const route = useRoute();
  return (
    <SafeAreaView style={styles.container}>
      {/* <Pressable
        style={{ left: 16, position: "absolute" }}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Ionicons name="arrow-back" size={30} color="#283663"></Ionicons>
      </Pressable> */}
      <Text style={styles.text}>{t("ticket-info")}</Text>
      <View style={styles.body}>
        <View style={styles.item}>
          <View style={styles.avatarContainer}>
            <TouchableHighlight
              style={{ justifyContent: "center", alignItems: "center" }}
            >
              <Text style={styles.avatar}> {route.params.seatNum}</Text>
            </TouchableHighlight>
            <View style={{ marginStart: 30 }}>
              <Text style={{ marginTop: 10 }}>
                {t("name")}: {route.params.name}
              </Text>

              <Text style={{ marginTop: 10 }}>
                {t("gender")}: {route.params.gender}
              </Text>
              <Text style={{ marginTop: 10 }}>
                {t("phone-number")}: {route.params.phone}{" "}
              </Text>
            </View>
          </View>

          <View
            style={{
              marginTop: 20,
              borderBottomColor: "black",
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          />
          <Text style={styles.text2}>{t("ticket")}</Text>

          <View style={styles.ticket}>
            <Text style={{ marginStart: 30, marginTop: 10 }}>
              {t("ticket-code")}: {route.params.id}
            </Text>
            <Text style={{ marginStart: 30, marginVertical: 10 }}>
              {t("price")}: {addDotsToNumber(route.params.price)}Đ{" "}
            </Text>
            {/* <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={{ height: 300, width: 300 }}
            ></BarCodeScanner> */}
            {/* <TouchableOpacity
              style={styles.button1}
              onPress={() => setScanned(false)}
            >
              <Text
                color="darkgreen"
                style={{
                  fontSize: 20,
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                SCAN
              </Text>
            </TouchableOpacity> */}
          </View>
        </View>
        <TouchableOpacity
          style={styles.button1}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Text
            color="darkgreen"
            style={{
              fontSize: 20,
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            BACK
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    backgroundColor: "#ffffff",
    // justifyContent: "center",},
  },
  text: {
    paddingTop: 30,
    fontWeight: "bold",
    fontSize: 30,
    textAlign: "center",
  },
  ticket: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    marginHorizontal: 40,
    marginVertical: 20,
  },
  text2: {
    paddingTop: 10,
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
  body: {
    // justifyContent: "center",
    // alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#283663",
    margin: 20,
  },
  item: {
    margin: 10,
    borderRadius: 10,
    backgroundColor: "#D9D9D9",
  },
  avatarContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    height: 100,
    paddingLeft: 20,
  },
  avatar: {
    fontWeight: "900",
    fontSize: 40,
    height: 70,
    width: 50,
    alignItems: "center",
    flex: 2,
  },
  button1: {
    borderRadius: 10,
    marginHorizontal: 123,
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#D9D9D9",
  },
});
export default CheckScreen;
