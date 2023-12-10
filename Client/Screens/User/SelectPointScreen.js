import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Pressable,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useWindowDimensions } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import GlobalColors from "../../Color/colors";
import { Ionicons } from "@expo/vector-icons";
import { getTime } from "../../Helper/Date";
import CustomButton from "../../Componets/UI/CustomButton";
import BookingTimeLine from "../../Componets/BookingTicket/BookingTimeLine";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useContext, useEffect, useRef, useState } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import axios from "axios";

import Loading from "../../Componets/UI/Loading";
import { decode } from "../../Helper/PolyLineDecode";
import { getCurrentPositionAsync } from "expo-location";

import { getDate } from "../../Helper/Date";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import MyModal from "../../Componets/UI/MyModal";
import { getDirection, getLocationInfo } from "../../util/apiServices";
import { getShuttleRouteOfSchedule } from "../../util/databaseAPI";
import { AuthContext } from "../../Store/authContex";
import { BookingContext } from "../../Store/bookingContext";
import IconButton from "../../Componets/UI/IconButton";

function SelectPointScreen({ navigation, route }) {
  const authCtx = useContext(AuthContext);
  const [pickUpPlaces, setPickUpPlaces] = useState();
  const [pickUpSelectedIndex, setPickUpSelectedIndex] = useState();

  const [directionsData, setDirectionsData] = useState();
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [myPosition, setMyPosition] = useState();
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [isSimulator, setIsSimulator] = useState(false);
  const [positionIndex, setPositionIndex] = useState(0);

  const bookingCtx = useContext(BookingContext);
  ///MapView
  useEffect(() => {
    // async function getPosition() {
    //   const location = await getCurrentPositionAsync();
    //   setMyPosition({
    //     latitude: location.coords.latitude,
    //     longitude: location.coords.longitude,
    //   });
    // }
    // getPosition();
  }, []);

  // const getDirections = async (apiKey, origin, destination) => {
  //   const baseUrl = "https://dev.virtualearth.net/REST/V1/Routes/Driving";

  //   try {
  //     const response = await axios
  //       .get(
  //         `${baseUrl}?o=json&wp.0=${origin}&wp.1=${destination}&avoid=minimizeTolls&key=${apiKey}`
  //       )
  //       .then((response) => {
  //         const data = response.data.resourceSets[0].resources[0].routeLegs[0];
  //         const obj = {
  //           travelDistance: data.travelDistance,
  //           travelDuration: data.travelDuration,
  //         };
  //         setStartLocation(data.startLocation);
  //         setEndLocation(data.endLocation);
  //         setDistance(data.travelDistance);
  //         setDuration(data.travelDuration);
  //         // setDirectionsData(data.itineraryItems);

  //         fetchData(
  //           `${data.startLocation.point.coordinates[0]},${data.startLocation.point.coordinates[1]}`,
  //           `${data.endLocation.point.coordinates[0]},${data.endLocation.point.coordinates[1]}`
  //         );
  //       });
  //   } catch (error) {
  //     console.error("Error fetching directions:", error);
  //     throw error;
  //   }
  // };
  // useEffect(() => {
  //   const origin = "Hồ chí Minh";
  //   const destination = "Long An";
  //   getDirections(
  //     "bL87M940PHGHkEzNpKCT~7l6e1ifOuzSkJb-SYq0aRA~AoJ-HOVsGdYPvQ2MvQKdhdzyQ-Gxxp_3ZfsE7O6_Ec0L1xosfPF27i7jAOEAlk2M",
  //     origin,
  //     destination
  //   );
  // }, []);

  const fetchData = async (start, end) => {
    const apiKey = "RWJ4rLcF0h3PULL6G-Dh3yonCzwLSWmhcEaiEIdbmlQ";

    try {
      const response = await axios.get(
        `https://router.hereapi.com/v8/routes?transportMode=bus&origin=${start}&destination=${end}&return=polyline&apikey=${apiKey}`
      );
      // console.log();
      const line = decode(response.data.routes[0].sections[0].polyline);

      const directions = line.polyline.map((path) => ({
        latitude: path[0],
        longitude: path[1],
      }));
      return directions;
    } catch (error) {
      console.error("Error get route direction: ", error);
      return null;
    }
  };
  ///MapView
  useEffect(() => {
    navigation.setOptions({
      headerBackVisible: false,
      headerRight: () => {
        return (
          <TouchableOpacity
            style={{ marginRight: 10 }}
            onPress={GoPassengerDetail}
          >
            <Text
              style={{
                color: GlobalColors.button,
                fontSize: 17,
                fontWeight: 500,
              }}
            >
              Skip
            </Text>
          </TouchableOpacity>
        );
      },
      headerLeft: () => {
        return (
          <IconButton
            color={"white"}
            icon={"arrow-back-outline"}
            size={30}
            onPress={clearShuttle}
          />
        );
      },
    });
  }, []);

  function clearShuttle() {
    if (route?.params?.isSelectForRoundTrip) {
      let temp = bookingCtx?.bookingInfo;
      temp.roundTripShuttleRoute = null;
      bookingCtx.setBookingInfo(temp);
    } else {
      let temp1 = bookingCtx?.bookingInfo;
      temp1.mainTripShuttleRoute = null;
      bookingCtx.setBookingInfo(temp1);
    }

    navigation.goBack();
  }
  useEffect(() => {
    function generateRandomColor() {
      // Generate a random percentage between 0.2 and 0.8
      const percentage = 0.2 + Math.random() * 0.6;

      // Generate random RGB values between 0 and 255
      const r = Math.floor(Math.random() * 128);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);

      // Calculate the darkened RGB values
      const darkenedR = Math.max(0, Math.round(r * (1 - percentage)));
      const darkenedG = Math.max(0, Math.round(g * (1 - percentage)));
      const darkenedB = Math.max(0, Math.round(b * (1 - percentage)));

      // Calculate a slight lightness adjustment
      const lightnessAdjustment = Math.round((1 - percentage) * 50);

      // Increase the darkened RGB values with the lightness adjustment
      const lightenedR = Math.min(255, darkenedR + lightnessAdjustment);
      const lightenedG = Math.min(255, darkenedG + lightnessAdjustment);
      const lightenedB = Math.min(255, darkenedB + lightnessAdjustment);

      // Convert the lightened RGB values back to a color string
      const lightColor = `rgb(${lightenedR}, ${lightenedG}, ${lightenedB})`;

      return lightColor;
    }
    async function getDirections() {
      setIsLoading((curr) => !curr);
      const location = await getCurrentPositionAsync();
      const myLocationInfo = await getLocationInfo(
        location.coords.latitude,
        location.coords.longitude
      );
      setMyPosition({
        shuttleId: "myLocation",
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        name: myLocationInfo[0].name,
      });

      const pickUpPlacesTemp = await getShuttleRouteOfSchedule(
        authCtx.token,
        route?.params?.idTrip
      );
      if (!pickUpPlacesTemp) {
        Alert.alert("Error", "Something went wrong");
        return;
      }
      let pickUpPlaces = pickUpPlacesTemp.rows.map((item) => {
        return {
          shuttleId: item.id,
          shuttleRouteId: item.ShuttleRouteData[0].id,
          departureTime: new Date(item.ShuttleRouteData[0].departureTime),
          departurePlace: item.ShuttleRouteData[0].departurePlace,
          distance: 20,
          duration: 2,
          lat: item.ShuttleRouteData[0].departurePlaceLat,
          lng: item.ShuttleRouteData[0].departurePlaceLng,
          directions: [],
          stroke: generateRandomColor(),
        };
      });

      pickUpPlaces.push({
        shuttleId: "coachHouse",
        shuttleRouteId: "coachHouse",
        departureTime: null,
        departurePlace: route?.params?.trip?.departurePlace,
        distance: 20,
        duration: 2,
        lat: route?.params?.trip?.departurePlacePosition?.placeLat,
        lng: route?.params?.trip?.departurePlacePosition?.placeLng,
        directions: [],
        stroke: generateRandomColor(),
      });
      // const pickUpPlaces = [
      //   {
      //     shuttleId: 1,
      //     departureTime: new Date(),
      //     departurePlace: "Trường Đại học Công nghệ Thông tin - ĐHQG TP.HCM",
      //     distance: 20,
      //     duration: 2,
      //     lat: 10.870261761210841,
      //     lng: 106.80304336657203,
      //     directions: [],
      //     stroke: generateRandomColor(),
      //   },
      //   {
      //     shuttleId: 2,
      //     departureTime: new Date(2023, 11, 11, 11, 11, 11),
      //     departurePlace: "Trường Đại học FPT TP. HCM - Khu công nghệ cao ",
      //     distance: 12,
      //     duration: 2,
      //     lat: 10.841359410994436,
      //     lng: 106.80990445307846,
      //     directions: [],
      //     stroke: generateRandomColor(),
      //   },
      //   {
      //     shuttleId: 3,
      //     departureTime: new Date(2023, 11, 11, 13, 13, 13),
      //     departurePlace:
      //       "702 Đ. Nguyễn Văn Linh, Tân Hưng, Quận 7, Thành phố Hồ Chí Minh",
      //     distance: 10,
      //     duration: 2,
      //     lat: 10.729099467394565,
      //     lng: 106.69580723773598,
      //     directions: [],
      //     stroke: generateRandomColor(),
      //   },
      //   {
      //     shuttleId: 4,
      //     departureTime: new Date(2023, 11, 11, 17, 11, 11),
      //     departurePlace:
      //       "720A Đ. Điện Biên Phủ, Vinhomes Tân Cảng, Bình Thạnh, Thành phố Hồ Chí Minh",
      //     distance: 30,
      //     duration: 2,
      //     lat: 10.795119657029218,
      //     lng: 106.72187513958467,
      //     directions: [],
      //     stroke: generateRandomColor(),
      //   },

      //   {
      //     shuttleId: 5,
      //     departureTime: new Date(2023, 11, 11, 23, 11, 11),
      //     departurePlace:
      //       "Novaland The Sun Avenue, Tòa nhà Số 28, Đường Đ. Mai Chí Thọ, Thủ Đức, Thành phố Hồ Chí Minh",
      //     distance: 8,
      //     duration: 2,
      //     lat: 10.784620354897896,
      //     lng: 106.74617288006432,
      //     directions: [],
      //     stroke: generateRandomColor(),
      //   },
      // ];

      for (const item of pickUpPlaces) {
        const temp = await fetchData(
          `${location.coords.latitude},${location.coords.longitude}`,
          `${item.lat},${item.lng}`
        );
        item.directions = [...temp];
        const timeAndDistance = await getDirection(
          `${location.coords.latitude},${location.coords.longitude}`,
          `${item.lat},${item.lng}`
        );
        item.distance = timeAndDistance.travelDistance;
        item.duration = timeAndDistance.travelDuration;
      }
      setPickUpPlaces(pickUpPlaces);
      setIsLoading((curr) => !curr);
    }
    try {
      getDirections();
    } catch (error) {
      Alert.alert(
        "Connection Error: ",
        "Please check your internet connection"
      );
    }
  }, []);
  function ShuttleItem(itemData) {
    return (
      <Pressable
        style={({ pressed }) => [
          {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 10,
          },
          pressed && { opacity: 0.5 },
          pickUpSelectedIndex === itemData.index && {
            borderColor: "#95c9f0",
            borderWidth: 1.5,
            borderRadius: 10,
          },
        ]}
        onPress={() => setPickUpSelectedIndex(itemData.index)}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          {pickUpSelectedIndex === itemData.index && (
            <Ionicons
              name="radio-button-on"
              size={24}
              color={GlobalColors.headerColor}
            />
          )}
          {pickUpSelectedIndex !== itemData.index && (
            <Ionicons name="radio-button-off" size={24} color="black" />
          )}
          <Text style={{ width: 120, fontWeight: "400", fontSize: 15 }}>
            {itemData.item.departurePlace}
          </Text>
        </View>
        <Text style={{ fontWeight: "bold", fontSize: 18 }}>
          {getTime(itemData.item.departureTime)}
        </Text>
      </Pressable>
    );
  }
  function Separator() {
    return (
      <View
        style={{
          flex: 1,
          width: "100%",
          height: 10,
          borderBottomColor: "black",
          borderBottomWidth: 1,
          opacity: 0.1,
        }}
      />
    );
  }
  const PickUpRoute = () => (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <FlatList
        keyExtractor={(item, index) => index}
        style={{ marginTop: 10 }}
        data={pickUpPlaces}
        renderItem={ShuttleItem}
        ItemSeparatorComponent={Separator}
      />
    </View>
  );

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      renderLabel={renderTabTitle}
      indicatorStyle={{ backgroundColor: GlobalColors.headerColor }}
      style={{ backgroundColor: "transparent", marginTop: -10 }}
    />
  );
  const renderTabTitle = ({ route, focused }) => {
    // const titleColor = focused ? "blue" : "black"; // Change the color based on focus
    return (
      <Text
        style={[
          { color: "black", fontSize: 18, width: 75, textAlign: "center" },
          focused && { fontWeight: "bold" },
        ]}
      >
        {route.title}
      </Text>
    );
  };
  const renderScene = SceneMap({
    first: PickUpRoute,
  });

  const [index, setIndex] = useState(0);
  const [routes] = useState([{ key: "first", title: "Pick Up" }]);

  function GoPassengerDetail() {
    if (!route?.params?.isSelectForRoundTrip) {
      let temp = bookingCtx.bookingInfo;
      temp.mainTripShuttleRoute = selectedMaker;
      bookingCtx.setBookingInfo(temp);

      navigation.navigate("PassengerDetailsScreen", {
        selectedSeats: route?.params?.selectedSeats,
        price: route?.params?.price,
        departurePlace: route?.params?.departurePlace,
        arrivalPlace: route?.params?.arrivalPlace,
        departureTime: route?.params?.departureTime,
        arrivalTime: route?.params?.arrivalTime,
        duration: route?.params?.duration,
        services: route?.params?.services,
        idTrip: route?.params?.idTrip,
        shuttleRoute: selectedMaker,
        roundTripDate: route?.params?.roundTripDate,
        trip: route?.params?.trip,
        isSelectForRoundTrip: route?.params?.isSelectForRoundTrip,
      });
    } else {
      let temp = bookingCtx.bookingInfo;
      temp.roundTripShuttleRoute = selectedMaker;
      bookingCtx.setBookingInfo(temp);

      navigation.push("PassengerDetailsScreen", {
        selectedSeats: route?.params?.selectedSeats,
        price: route?.params?.price,
        departurePlace: route?.params?.departurePlace,
        arrivalPlace: route?.params?.arrivalPlace,
        departureTime: route?.params?.departureTime,
        arrivalTime: route?.params?.arrivalTime,
        duration: route?.params?.duration,
        services: route?.params?.services,
        idTrip: route?.params?.idTrip,
        shuttleRoute: selectedMaker,
        roundTripDate: route?.params?.roundTripDate,
        trip: route?.params?.trip,
        isSelectForRoundTrip: route?.params?.isSelectForRoundTrip,
      });
    }
  }

  const [selectedMaker, setSelectedMarker] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleMarkerPress = (marker) => {
    // Calculate the position of the tooltip based on the tapped polyline's coordinates
    console.log("maker Handler");
    setSelectedMarker(marker);
    setIsVisible(true);
  };

  ///Zoom to location
  const mapRef = useRef(null);

  const handleZoomToLocation = (lat, lng) => {
    const newRegion = {
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };

    mapRef.current?.animateToRegion(newRegion, 1000);
  };

  return (
    <>
      <View style={styles.root}>
        <View
          style={{
            paddingHorizontal: 10,
            backgroundColor: GlobalColors.headerColor,
          }}
        >
          <BookingTimeLine position={1} />
        </View>

        {/* <View style={styles.subRoot}>
        <TabView
          renderTabBar={renderTabBar}
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: "100%", height: "100%" }}
        />
      </View> */}

        <View style={[styles.container]}>
          {isLoading && (
            <View style={{ height: "100%" }}>
              <Loading />
            </View>
          )}

          {pickUpPlaces && (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: myPosition.latitude,
                longitude: myPosition.longitude,
                latitudeDelta: 0.05, // Adjust the zoom level as needed
                longitudeDelta: 0.05,
              }}
              ref={mapRef}
              showsMyLocationButton={true}
              loadingEnabled={true}
              showsUserLocation={true}
              followsUserLocation={true}
              showsTraffic={true}
              showsBuildings={true}
              shouldRasterizeIOS={true}
              showsCompass={true}
              onPress={() => {
                console.log("map Handler");
                if (selectedMaker) {
                  setIsVisible((curr) => !curr);
                }
              }}
              // provider="google"

              //   onUserLocationChange={(value) => console.log(value)}
            >
              {/* <Polyline
                coordinates={directionsData}
                strokeWidth={6}
                strokeColor="green"
                lineDashPhase={50}
                lineJoin="bevel"
              /> */}

              {pickUpPlaces.map((item, index) => {
                if (item.shuttleId == "coachHouse") {
                  // console.log(item);
                  return (
                    <Marker
                      key={"HeadQuarter"}
                      coordinate={{
                        latitude: item.lat,
                        longitude: item.lng,
                      }}
                      title={"Coach Station"}
                      description={item.departurePlace}
                      image={require("../../../icon/headquarter.png")}
                      onPress={(event) => {
                        event.stopPropagation();
                        handleMarkerPress(item);
                      }}
                    />
                  );
                }
                return (
                  <Marker
                    key={item.shuttleId}
                    coordinate={{
                      latitude: item.lat,
                      longitude: item.lng,
                    }}
                    title={item.departurePlace}
                    image={require("../../../icon/busSchool.png")}
                    onPress={(event) => {
                      event.stopPropagation();
                      handleMarkerPress(item);
                    }}
                  />
                );
              })}
              {pickUpPlaces.map((item, index) => {
                if (item.shuttleId == "coachHouse") {
                  return;
                }
                return (
                  <Polyline
                    key={item.shuttleId}
                    coordinates={item.directions}
                    strokeWidth={6}
                    strokeColor={item.stroke}
                    lineDashPhase={50}
                    lineJoin="bevel"
                  />
                );
              })}
              <Marker
                coordinate={{
                  latitude: myPosition.latitude,
                  longitude: myPosition.longitude,
                }}
                title="My Position"
                description={myPosition.name}
                // icon={require("../../../icon/busSchool.png")}
                image={require("../../../icon/myLocation.png")}
                onPress={(event) => {
                  event.stopPropagation();
                  handleMarkerPress(myPosition);
                }}
              />
            </MapView>
          )}

          <View
            style={{
              position: "absolute",
              top: 10,
              width: "auto",
              alignItems: "center",
              alignSelf: "center",
              backgroundColor: GlobalColors.headerColor,
              padding: 10,
              borderRadius: 15,
              gap: 5,
            }}
          >
            {/* <Text
              style={{
                fontSize: 15,
                fontWeight: "bold",
                color: "white",
              }}
            >
              Start Place: {route?.params?.startPlace}
            </Text> */}
            <Text
              style={{
                fontSize: 13,
                fontWeight: "bold",
                color: "white",
              }}
            >
              {" Departure Date: "}
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "bold",
                  color: "orange",
                }}
              >
                {getDate(route?.params?.departureTime)}
              </Text>
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontWeight: "bold",
                color: "white",
              }}
            >
              {"Departure Time: "}
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "bold",
                  color: "orange",
                }}
              >
                {getTime(route?.params?.departureTime)}
              </Text>
            </Text>
          </View>
        </View>

        {/* <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "white",
            padding: 30,
          }}
        >
          {isVisible && (
            <CustomButton
              color={GlobalColors.lightBackground}
              onPress={GoPassengerDetail}
              radius={10}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "white",
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                Continue
              </Text>
            </CustomButton>
          )}
        </View> */}
      </View>
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "transparent",
        }}
      >
        <MyModal isVisible={isVisible}>
          <View
            style={{
              width: 60,
              height: 1,
              borderColor: "gray",
              borderWidth: 2,
              radius: 10,
              alignSelf: "center",
              marginTop: 10,
              marginBottom: 20,
              opacity: 0.5,
            }}
          />
          <View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "black",
                marginRight: 10,
                marginBottom: 10,
              }}
            >
              {"Location: "}
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  alignSelf: "center",
                  color: GlobalColors.price,
                }}
              >
                {selectedMaker &&
                  (selectedMaker.departurePlace
                    ? selectedMaker.departurePlace
                    : selectedMaker.name)}
              </Text>
            </Text>
            {selectedMaker && selectedMaker.shuttleId !== "myLocation" && (
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                  color: "gray",
                  marginRight: 10,
                }}
              >
                {"Distance: "}
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "bold",
                    color: "red",
                    alignSelf: "center",
                  }}
                >
                  {selectedMaker && selectedMaker.distance} km
                </Text>
              </Text>
            )}

            {selectedMaker && selectedMaker.shuttleId !== "myLocation" && (
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                  color: "gray",
                  marginRight: 10,
                  marginVertical: 10,
                }}
              >
                {"Duration: "}
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "bold",
                    color: "red",
                    alignSelf: "center",
                  }}
                >
                  {selectedMaker && selectedMaker.duration} hours
                </Text>
              </Text>
            )}
            {selectedMaker &&
              selectedMaker.shuttleId !== "myLocation" &&
              selectedMaker.shuttleId !== "coachHouse" && (
                <CustomButton
                  color={GlobalColors.lightBackground}
                  onPress={GoPassengerDetail}
                  radius={10}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: "white",
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    Select This Point
                  </Text>
                </CustomButton>
              )}
          </View>
        </MyModal>
      </View>
      <Pressable
        style={({ pressed }) => [
          {
            position: "absolute",
            bottom: 0,
            right: 10,
            top: 400,

            flexDirection: "row",
            gap: -10,
            width: 60,
            height: 60,
            borderRadius: 60,
            backgroundColor: "white",
            justifyContent: "center",
            alignItems: "center",
          },
          pressed && { opacity: 0.5 },
        ]}
        onPress={() => {
          setSelectedMarker(myPosition);
          handleZoomToLocation(myPosition.latitude, myPosition.longitude);
        }}
      >
        <MaterialIcons name="my-location" size={30} color="blue" />
      </Pressable>

      <Pressable
        disabled={!pickUpPlaces || pickUpPlaces.length === 0}
        style={({ pressed }) => [
          {
            position: "absolute",
            bottom: 0,
            right: 10,
            top: 320,

            flexDirection: "row",
            gap: -10,
            width: 60,
            height: 60,
            borderRadius: 60,
            backgroundColor: "white",
            justifyContent: "center",
            alignItems: "center",
          },
          pressed && { opacity: 0.5 },
        ]}
        onPress={() => {
          const temp1 = [...pickUpPlaces];
          temp1.pop();
          if (!temp1 || temp1.length === 0) {
            return;
          }
          const temp = temp1.sort((t1, t2) => t1.distance - t2.distance);
          pickUpPlaces.forEach((element) => {
            console.log(element.distance);
          });

          handleZoomToLocation(temp[0].lat, temp[0].lng);
          setSelectedMarker(temp[0]);
          setIsVisible(true);
        }}
      >
        <MaterialCommunityIcons
          name="arrow-decision-auto"
          size={30}
          color="green"
        />
      </Pressable>
    </>
  );
}
export default SelectPointScreen;
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  subRoot: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    height: "70%",
    margin: 10,
    paddingHorizontal: 10,
    marginTop: 60,
  },
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
