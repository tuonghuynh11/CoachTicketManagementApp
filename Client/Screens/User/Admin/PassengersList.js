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
} from "react-native";
import CheckBox from "expo-checkbox";
const DATA = [
  {
    id: "Se100",
    imageLink: images.beavis_and_butthead,
    start: "6AM",
    end: "9PM",
    passengers: 54,
    Name: "Beavis",
    phone: "092333543",
  },
  {
    id: "Se101",
    imageLink: images.beavis_and_butthead,
    start: "6AM",
    end: "9PM",
    passengers: 50,
    Name: "Butt-Head",
    phone: "099999999",
  },
  {
    id: "Se102",
    imageLink: images.beavis_and_butthead,
    start: "6AM",
    end: "9PM",
    passengers: 50,
    Name: "McDicker",
    phone: "099999991",
  },
  {
    id: "Se103",
    imageLink: images.beavis_and_butthead,
    start: "6AM",
    end: "9PM",
    passengers: 53,
    Name: "Van Driessen",
    phone: "099935799",
  },
  {
    id: "Se104",
    imageLink: images.beavis_and_butthead,
    start: "6AM",
    end: "9PM",
    passengers: 40,
    Name: "Daria",
    phone: "099999999",
  },
  {
    id: "Se105",
    imageLink: images.beavis_and_butthead,
    start: "6AM",
    end: "9PM",
    passengers: 50,
    Name: "Stewart",
    phone: "099999999",
  },
  {
    id: "Se106",
    imageLink: images.beavis_and_butthead,
    start: "6AM",
    end: "9PM",
    passengers: 50,
    Name: "Jim Cornette",
    phone: "099999999",
  },
];
function Passengers({ navigation }) {
  const route = useRoute();
  console.log(route);
  async function getPosition() {
    return await AsyncStorage.getItem("idPosition");
  }
  let positionId = -1;
  const from = route.params?.from;
  const ticketList = route.params.ticketList;
  const tripId = route.params.tripId;
  let seatList = [];
  const isFocused = useIsFocused();
  useEffect(() => {
    getPosition().then((response) => {
      positionId = response;
    });

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
    seatList.sort((a, b) => {
      if (a.status > b.status) return 1;
      if (a.status < b.status) return -1;
      if (a.seatNum > b.seatNum) return 1;
      if (a.seatNum < b.seatNum) return -1;
      return 0;
    });
  }, [isFocused]);

  const [seatInfo, setSeatInfo] = useState(seatList);
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{ justifyContent: "center", flexDirection: "row", padding: 10 }}
      >
        <Pressable
          style={{ left: 16, position: "absolute" }}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Ionicons name="arrow-back" size={30} color="#283663"></Ionicons>
        </Pressable>
        {from === "history" && (
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
              onPress={() => {}}
            >
              Trip has ended
            </Text>
          </TouchableOpacity>
        )}
        {positionId != 2 && from === "current" && (
          <TouchableOpacity
            style={{
              padding: 10,
              marginTop: 10,
              marginStart: 250,
              marginEnd: 20,
              display: "flex",
              justifyContent: "flex-end",
              borderRadius: 30,
              backgroundColor: "#14dea2",
            }}
          >
            <Text
              style={{ textAlign: "center", color: "white" }}
              onPress={() => {
                navigation.navigate("Scan Barcode", ticketList);
              }}
            >
              Scan
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.text}>
        Seats {" ("} id = {tripId + ")"}
      </Text>

      <StatusBar style="auto" />

      <TouchableOpacity style={styles.flatlist}>
        <FlatList
          contentContainerStyle={{ paddingBottom: 120 }}
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
                  <Text> Name: {item.name}</Text>
                  <Text> Phone: {item.phone}</Text>
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
  },

  flatlist: {
    borderRadius: 10,
    backgroundColor: "#283663",
    marginTop: 20,
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
