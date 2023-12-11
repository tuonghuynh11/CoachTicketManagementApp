import { StatusBar } from "expo-status-bar";
import { images } from "../../../../assets/Assets";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CheckScreen from "./CheckInScreen";
import Passengers from "./PassengersList";
import {
  useFocusEffect,
  useIsFocused,
  useRoute,
} from "@react-navigation/native";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React, { useState, useEffect, useContext } from "react";
import { BarCodeScanner } from "expo-barcode-scanner";
import { AntDesign } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  TouchableHighlight,
  ScrollView,
} from "react-native";
import { Audio } from "expo-av";
import axios from "axios";
import { AuthContext } from "../../../Store/authContex";
import AsyncStorage from "@react-native-async-storage/async-storage";
const config = {
  headers: {
    Authorization: "Bearer " + images.adminToken,
  },
  params: {
    page: 1,
  },
};
let trips = [];

const getData = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    config.params.page = 1;
    trips = [];
    let flag = true;
    do {
      const response = await axios
        .get("https://coach-ticket-management-api.onrender.com/api/trips", {
          headers: {
            Authorization: token,
          },
          params: {
            page: config.params.page,
          },
        })
        .catch((err) => {
          console.log(err);
        });

      if (response.data.data.rows.length == 0) {
        flag = false;
      }
      trips = trips.concat(response.data.data.rows);
      console.log("Get Trip", trips);

      config.params.page++;
    } while (flag);
    return trips;
  } catch (error) {
    if (error.response) {
      console.log("getData My Work Err:", error.response.data);
    } else if (error.request) {
      console.log("getData My Work Err:", error.request.data);
    } else {
      console.log("getData My Work Err:", error);
    }
  }
};
let tickets = [];
const getTickets = async () => {
  try {
    config.params.page = 1;
    tickets = [];
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
          },
        }
      );
      if (response.data.data.length == 0) {
        flag = false;
      }
      tickets = tickets.concat(response.data.data);
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
let currentTrips = [];
let historyTrips = [];

const translateDate = function (rawDate) {
  const date = new Date(rawDate);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const hour = date.getHours();
  const minute = date.getMinutes();
  console.log("Month: " + month);
  const year = date.getFullYear();
  return `${day}-${month}-${year} ${hour}:${minute}`;
};
const Stack = createNativeStackNavigator();
function App({ navigation }) {
  const [current, setCurrent] = useState(currentTrips);
  useEffect(() => {
    getData()
      .then(async () => {
        // console.log("getAllData", trips);

        trips.forEach((sche) => {
          const currentDate = new Date().getTime();
          const departureTime = new Date(sche.departureTime).getTime();
          if (departureTime > currentDate) {
            currentTrips = currentTrips.concat(sche);
            console.log("Current: " + currentTrips.length);
          } else {
            historyTrips = historyTrips.concat(sche);
            console.log("Histpry: " + historyTrips.length);
          }
        });
        currentTrips.forEach((trip) => {
          trip.ticketList = [];
        });
        historyTrips.forEach((trip) => {
          trip.ticketList = [];
        });
        await getTickets().then(() => {
          currentTrips.forEach((trip) => {
            tickets.forEach((ticket) => {
              //id trip = id schedule cua ve
              if (trip.id == ticket.ScheduleData.id) {
                trip.ticketList.push(ticket);
              }
            });

            // console.log("trip:", trip);
          });

          historyTrips.forEach((trip) => {
            tickets.forEach((ticket) => {
              //id trip = id schedule cua ve
              if (trip.id == ticket.ScheduleData.id) {
                trip.ticketList.push(ticket);
              }
            });
          });
        });
        setCurrent(currentTrips);
      })
      .catch((error) => {
        console.log("My work err:", error);
      });
    // async function getAllData() {

    // }
    // getAllData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>My work</Text>

      <StatusBar style="auto" />
      {/* <View style={[styles.dumbass, styles.dumbass2]}>
        <TouchableOpacity style={styles.button1}>
          <Text
            color="darkgreen"
            style={{
              fontSize: 20,
              textAlign: "center",
            }}
          >
            Current
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button1}>
          <Text
            color="darkgreen"
            style={{
              fontSize: 20,
            }}
          >
            History
          </Text>
        </TouchableOpacity>
      </View> */}
      <View style={styles.flatlist}>
        <FlatList
          contentContainerStyle={{ paddingBottom: 120 }}
          data={current}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => {
                console.log("Press");
                navigation.navigate("Passenger List", {
                  ticketList: item.ticketList,
                  tripId: item.id,
                });
              }}
            >
              <Text>{item.id}</Text>
              <View style={styles.avatarContainer}>
                <TouchableHighlight>
                  <Image
                    source={{ uri: item.CoachData.image }}
                    style={styles.avatar}
                  ></Image>
                </TouchableHighlight>
                <View>
                  <Text>
                    {" "}
                    ID of bus:{" "}
                    <Text style={{ fontWeight: "bold" }}>
                      {item.CoachData.id}
                    </Text>
                  </Text>
                  <Text> Driver: {item.DriverData.fullName}</Text>
                  <Text> Assistant: {item.CoachAssistantData.fullName}</Text>
                  <Text> Start: {translateDate(item.departureTime)}</Text>
                  <Text> End: {translateDate(item.arrivalTime)}</Text>
                  <Text> Route: {item.RouteData.routeName}</Text>
                </View>
              </View>
              <View
                style={{
                  borderBottomColor: "black",
                  borderBottomWidth: StyleSheet.hairlineWidth,
                }}
              />
              <View>
                <Text style={{ marginStart: 70 }}>
                  Number of passengers:{" "}
                  {Number(item.CoachData.capacity) - item.remainingSlot}
                  {"\n"}
                  Service:
                </Text>
                <ScrollView horizontal={true}></ScrollView>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text>This is empty af</Text>}
        ></FlatList>
      </View>
    </SafeAreaView>
  );
}
function History({ navigation }) {
  const [history, setHistory] = useState(historyTrips);

  useFocusEffect(() => {
    console.log("Set Hostiry");
    setHistory(historyTrips);
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>My work</Text>

      <StatusBar style="auto" />
      {/* <View style={[styles.dumbass, styles.dumbass2]}>
        <TouchableOpacity style={styles.button1}>
          <Text
            color="darkgreen"
            style={{
              fontSize: 20,
              textAlign: "center",
            }}
          >
            Current
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button1}>
          <Text
            color="darkgreen"
            style={{
              fontSize: 20,
            }}
          >
            History
          </Text>
        </TouchableOpacity>
      </View> */}
      <View style={styles.flatlist}>
        <FlatList
          contentContainerStyle={{ paddingBottom: 120 }}
          data={history}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() =>
                navigation.navigate("Passenger List", {
                  ticketList: item.ticketList,
                  tripId: item.id,
                })
              }
            >
              <Text>{item.id}</Text>
              <View style={styles.avatarContainer}>
                <TouchableHighlight>
                  <Image
                    source={{ uri: item.CoachData.image }}
                    style={styles.avatar}
                  ></Image>
                </TouchableHighlight>
                <View>
                  <Text>
                    {" "}
                    ID of bus:{" "}
                    <Text style={{ fontWeight: "bold" }}>
                      {item.CoachData.id}
                    </Text>
                  </Text>
                  <Text>Driver: {item.DriverData.fullName}</Text>
                  <Text>Assistant: {item.CoachAssistantData.fullName}</Text>
                  <Text> Start: {translateDate(item.departureTime)}</Text>
                  <Text> End: {translateDate(item.arrivalTime)}</Text>
                  <Text> Route: {item.RouteData.routeName}</Text>
                </View>
              </View>
              <View
                style={{
                  borderBottomColor: "black",
                  borderBottomWidth: StyleSheet.hairlineWidth,
                }}
              />
              <View>
                <Text style={{ marginStart: 70 }}>
                  Number of passengers:{" "}
                  {Number(item.CoachData.capacity) - item.remainingSlot}
                  {"\n"}
                  Service:
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text>This is empty af</Text>}
        ></FlatList>
      </View>
    </SafeAreaView>
  );
}
function ScanBarcode({ navigation }) {
  const route = useRoute();
  const ticketList = route.params;
  const [hasPermission, setHasPermission] = useState(null);
  const [text, setText] = useState("Not yet scanned");
  const [sound, setSound] = useState();
  const authCtx = useContext(AuthContext);

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
  useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);
  //What happens when we scan the bar code
  const handleBarCodeScanned = async ({ type, data }) => {
    setText(data);
    const { sound } = await Audio.Sound.createAsync(images.beep);

    ticketList.forEach((ticket) => {
      for (let i = 0; i < ticket.seatNumber.length; i++) {
        if (
          ticket.reservationId[i] ==
          data.substring(data.length - ticket.reservationId[i].length)
        ) {
          console.log(ticket.reservationId[i], ticket.status);
          const configScan = {
            headers: {
              Authorization: authCtx.token,
            },
          };
          const scanData = {
            reservations: ticket.reservationId,
          };
          axios
            .patch(`${images.apiLink}tickets/scan`, scanData, configScan)
            .then(() => {
              ticket.status = 4;
              setSound(sound);
              sound.playAsync();
            });

          navigation.goBack();

          console.log("Type: " + type + "\nData: " + data);
          return;
        }
      }
    });
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
      <View style={[styles.container, { backgroundColor: "#ff7f50" }]}>
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
    <View
      style={[
        styles.container,
        {
          backgroundColor: "#ff7f50",
          justifyContent: "center",
        },
      ]}
    >
      <AntDesign
        style={{ marginTop: -5, alignSelf: "flex-end" }}
        name="close"
        size={24}
        color="black"
        onPress={() => {
          navigation.goBack();
        }}
      />
      <View>
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          style={{ height: 400, width: 400 }}
        />
      </View>
      <Text style={{ fontSize: 16, margin: 20 }}>{text}</Text>

      <StatusBar style="auto" />
    </View>
  );
}

const Tab = createMaterialTopTabNavigator();
const Tabs = function () {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#6A5ACD",
        tabBarInactiveTintColor: "#FFA500",
        tabBarStyle: { backgroundColor: "#808080" },
      }}
    >
      <Tab.Screen name="Current" component={App} />
      <Tab.Screen name="History" component={History} />
    </Tab.Navigator>
  );
};
const Navigation = function () {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator
        initialRouteName="Tabs"
        screenOptions={{
          headerShown: true,
          // title: "My Work",
          headerStyle: {
            backgroundColor: GlobalColors.headerColor,
          },
          headerShadowVisible: false,
          headerTitleStyle: {
            color: "white",
          },
          headerShown: true,
        }}
      >
        <Stack.Screen
          name="Tabs"
          component={Tabs}
          options={{
            title: "My Work",
          }}
        />
        <Stack.Screen name="History" component={History} />
        <Stack.Screen name="My Work" component={App} />
        <Stack.Screen name="Passenger List" component={Passengers} />
        <Stack.Screen name="Check Ticket" component={CheckScreen} />
        <Stack.Screen name="Scan Barcode" component={ScanBarcode} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    backgroundColor: "#ffffff",
    // justifyContent: "center",
  },
  button: {
    backgroundColor: "#5421ca",
    borderRadius: 10,
    padding: 20,
  },
  avatarContainer: {
    borderRadius: 200,
    height: undefined,
    width: undefined,
    flexDirection: "row",
    flex: 5,
    justifyContent: "flex-start",
  },
  avatar: {
    height: 90,
    width: 90,
    borderRadius: 40,
  },
  image: {
    width: "100%",
    height: undefined,
    aspectRatio: 1,
  },
  text: {
    paddingTop: 30,
    fontWeight: "bold",
    fontSize: 30,
    textAlign: "center",
  },
  dumbass: {
    marginTop: 20,
    backgroundColor: "#6875B7",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  flatlist: {
    borderRadius: 10,
    backgroundColor: "#283663",
    marginTop: 20,
    padding: 10,
  },
  dumbass2: {
    height: "100%",
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
  },
  item: {
    marginTop: 20,
    padding: 10,

    borderRadius: 10,
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  button1: {
    borderRadius: 10,
    marginHorizontal: 23,
    backgroundColor: "#D9D9D9",
    flex: 1,
    alignItems: "center",
    alignContent: "space-between",
    height: 36,
    marginTop: 20,

    flexBasis: "25%",
  },
  button2: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 22,
    marginStart: 5,
    backgroundColor: "red",
  },
});
export default Navigation;
