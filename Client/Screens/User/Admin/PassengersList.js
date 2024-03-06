import { StatusBar } from "expo-status-bar";
import { images } from "../../../../assets/Assets";
import { useIsFocused, useRoute } from "@react-navigation/native";
import React, { useState, useEffect, createContext, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
//Them mot nut o mot goc de xac nhan khi chuyen di da xong
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  TouchableHighlight,
  Pressable,
  Alert,
} from "react-native";
import CheckBox from "expo-checkbox";
import axios from "axios";
import { useTranslation } from "react-i18next";

function Passengers({ navigation }) {
  const { t } = useTranslation();
  const route = useRoute();
  console.log(route);
  async function getPosition() {
    return await AsyncStorage.getItem("idPosition");
  }
  let positionId = -1;
  const from = route.params?.from;
  let ticketList = [];
  const tripId = route.params.tripId;
  const [tripStatus, setStatus] = useState(route.params.tripStatus);
  const [seatInfo, setSeatInfo] = useState(seatList);
  const [tickets, setTickets] = useState([]);
  let seatList = [];
  const isFocused = useIsFocused();
  useEffect(() => {
    getPosition().then((response) => {
      positionId = response;
    });
    const getTickets = async () => {
      try {
        const config = {
          headers: {
            Authorization: "Bearer " + images.adminToken,
          },
          params: {
            page: 1,
          },
        };
        config.params.page = 1;
        ticketList = [];
        let flag = true;
        const token = await AsyncStorage.getItem("token");
        do {
          const response = await axios.get(
            "https://coach-ticket-management-api.onrender.com/api/tickets",
            {
              headers: {
                Authorization: token,
              },
              params: {
                page: config.params.page,
                scheduleId: tripId,
              },
            }
          );
          console.log(response);
          if (response.data.data.length == 0) {
            flag = false;
          }
          ticketList = ticketList.concat(response.data.data);
          config.params.page++;
        } while (flag);
      } catch (error) {
        if (error.response) {
          console.log(error.response.data);
        } else if (error.request) {
          console.log(error.request.data);
        }
      }
    };
    getTickets().then(() => {
      setTickets(ticketList);
      console.log(ticketList);
      ticketList.forEach((ticket) => {
        let i = 0;
        for (i = 0; i < ticket.seatNumber.length; i++) {
          const newSeat = {
            id: ticket.reservationId[i],
            seatNum: ticket.seatNumber[i],
            name: ticket.PassengerData[i].fullName,
            phone: ticket.PassengerData[i].phoneNumber,
            gender: ticket.PassengerData[i].gender,
            price: ticket.ScheduleData.price,
            status: ticket.status,
          };
          seatList.push(newSeat);
          console.log(seatList);
        }
      });
      setSeatInfo(seatList);
      seatList.sort((a, b) => {
        if (a.status > b.status) return 1;
        if (a.status < b.status) return -1;
        if (a.seatNum > b.seatNum) return 1;
        if (a.seatNum < b.seatNum) return -1;
        return 0;
      });
    });
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexDirection: "row", display: "flex" }}>
        <Pressable
          style={{ left: 16, marginTop: 10, flex: 1 }}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Ionicons name="arrow-back" size={30} color="#283663"></Ionicons>
        </Pressable>
        <Text style={[styles.text, { flex: 4 }]}>
          {t("seats")} {" ("} id = {tripId + ")"}
        </Text>
      </View>
      <TouchableOpacity
        style={{
          padding: 10,
          marginTop: 20,
          // marginStart: 250,
          // marginEnd: 20,
          display: "flex",
          justifyContent: "center",
          alignSelf: "center",

          borderRadius: 10,
          backgroundColor: "red",
        }}
      >
        <Text
          style={{
            textAlign: "center",
            color: "white",
            fontSize: 15,
            fontWeight: "bold",
          }}
          onPress={() => {
            navigation.goBack();
          }}
        >
          {t("end-trip")}
        </Text>
      </TouchableOpacity>
      <View
        style={{ justifyContent: "center", flexDirection: "row", padding: 10 }}
      >
        {from === "history" && tripStatus != 3 && (
          <TouchableOpacity
            style={{
              padding: 10,
              marginTop: 10,
              marginStart: 20,

              display: "flex",
              justifyContent: "flex-start",
              borderRadius: 30,
              backgroundColor: "#14dea2",
            }}
          >
            <Text
              style={{ textAlign: "center", color: "white" }}
              onPress={async () => {
                const token = await AsyncStorage.getItem("token");
                console.log(tripStatus);
                axios
                  .patch(
                    `${images.apiLink}schedules/finish/${tripId}`,
                    {},
                    {
                      headers: {
                        Authorization: token,
                      },
                    }
                  )
                  .then(() => {
                    Alert.alert(t("success"), t("trip-has-ended-confirmed"));
                    setStatus(3);
                  })
                  .catch((error) => {
                    if (error.request) {
                      console.log(error.request);
                    }
                    if (error.response) {
                      console.log(error.response);
                      Alert.alert("Error", "Error");
                    }
                  });
              }}
            >
              {t("trip-has-ended")}
            </Text>
          </TouchableOpacity>
        )}
        {positionId != 2 && from === "current" && (
          <TouchableOpacity
            style={{
              padding: 10,
              marginTop: 20,
              // marginStart: 250,
              // marginEnd: 20,
              display: "flex",
              justifyContent: "center",
              alignSelf: "center",

              borderRadius: 10,
              backgroundColor: "#14dea2",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: "white",
                fontSize: 25,
                fontWeight: "bold",
              }}
              onPress={() => {
                navigation.navigate("Scan Barcode", tickets);
              }}
            >
              Scan
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <StatusBar style="auto" />

      <TouchableOpacity style={styles.flatlist}>
        <FlatList
          contentContainerStyle={{ paddingBottom: 120, marginBottom: 40 }}
          data={seatInfo}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => navigation.navigate("Check Ticket", item)}
            >
              <View style={styles.avatarContainer}>
                <View
                  style={{
                    padding: 10,
                    borderEndColor: "black",
                    backgroundColor: "white",
                  }}
                >
                  <Text style={{ marginVertical: 20, fontSize: 20 }}>
                    {item.seatNum}
                  </Text>
                </View>

                <View style={{ margin: 20 }}>
                  <Text>
                    {" "}
                    {t("name")}: {item.name}
                  </Text>
                  <Text>
                    {" "}
                    {t("phone")}: {item.phone}
                  </Text>
                </View>
                <CheckBox
                  style={{ backgroundColor: "#ffffff", margin: 20 }}
                  value={item.status == "4"}
                ></CheckBox>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text>This is empty </Text>}
        ></FlatList>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
function ScanBarcode() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState("Not yet scanned");

  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status == "granted");
    })();
  };
  //Request Camera permission
  useEffect(() => {
    askForCameraPermission();
  }, []);
  //What happens when we scan the bar code
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setText(data);
    console.log("Type: " + type + "\nData: " + data);
  };
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting for camera permission</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => askForCameraPermission()}
        >
          <Text>ALLOW CAMERA</Text>
        </TouchableOpacity>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => askForCameraPermission()}
        >
          <Text>ALLOW CAMERA</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.barcodeBox}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={{ height: 400, width: 400 }}
        />
      </View>
      <Text style={{ fontSize: 16, margin: 20 }}>{text}</Text>
      {scanned && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => setScanned(false)}
        >
          <Text>Scan again</Text>
        </TouchableOpacity>
      )}
      <StatusBar style="auto" />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    backgroundColor: "#ffffff",
    // justifyContent: "center",
  },
  avatarContainer: {
    borderRadius: 200,
    height: 90,
    width: undefined,
    flexDirection: "row",
    flex: 5,
    justifyContent: "space-between",
  },
  avatar: {
    height: 90,
    width: 90,
    borderRadius: 40,
  },

  text: {
    paddingTop: 30,
    fontWeight: "bold",
    fontSize: 30,
    textAlign: "center",
    marginTop: -20,
  },

  flatlist: {
    borderRadius: 10,
    backgroundColor: "#283663",
    margin: 20,
    marginTop: 10,
    padding: 10,
  },

  item: {
    marginTop: 20,
    borderRadius: 20,
    backgroundColor: "#D9D9D9",
    justifyContent: "space-between",
  },
});
export default Passengers;
