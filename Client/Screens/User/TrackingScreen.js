import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Text, Alert, Pressable } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import axios from "axios";
import IconButton from "../../Componets/UI/IconButton";
import Loading from "../../Componets/UI/Loading";
import { decode } from "../../Helper/PolyLineDecode";
import { getCurrentPositionAsync } from "expo-location";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import MyModal from "../../Componets/UI/MyModal";
import GlobalColors from "../../Color/colors";
import { getLocationInfo } from "../../util/apiServices";
import { Image } from "react-native";
import { useTranslation } from "react-i18next";
function TrackingScreen({ navigation, route }) {
  const [directionsData, setDirectionsData] = useState();
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [myPosition, setMyPosition] = useState();
  const [myPositionInfo, setMyPositionInfo] = useState();
  const [coach, setCoach] = useState();
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);

  const [isSimulator, setIsSimulator] = useState(false);
  const [positionIndex, setPositionIndex] = useState(0);

  const [selectedMaker, setSelectedMarker] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const { t } = useTranslation();
  useEffect(() => {
    async function getPosition() {
      const location = await getCurrentPositionAsync();
      const myLocationInfo = await getLocationInfo(
        location.coords.latitude,
        location.coords.longitude
      );
      setMyPositionInfo({
        id: "myLocation",
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        name: myLocationInfo[0].name,
      });
      setMyPosition({
        id: "coachLocation",
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      setCoach({
        id: "myLocation",
        latitude: route?.params?.start?.lat,
        longitude: route?.params?.start?.lng,
      });
    }
    getPosition();
  }, []);

  useEffect(() => {
    const getDirections = async (apiKey, origin, destination) => {
      const baseUrl = "https://dev.virtualearth.net/REST/V1/Routes/Driving";

      try {
        const response = await axios
          .get(
            `${baseUrl}?o=json&wp.0=${origin}&wp.1=${destination}&avoid=minimizeTolls&key=${apiKey}`
          )
          .then((response) => {
            const data =
              response.data.resourceSets[0].resources[0].routeLegs[0];
            // setStartLocation(data.startLocation);
            // setEndLocation(data.endLocation);

            setStartLocation({
              point: {
                coordinates: [
                  route?.params?.start?.lat,
                  route?.params?.start?.lng,
                ],
              },
            });
            setEndLocation({
              point: {
                coordinates: [
                  route?.params?.destination?.lat,
                  route?.params?.destination?.lng,
                ],
              },
            });

            setDistance(data.travelDistance.toFixed(1));
            setDuration((data.travelDuration / 60 / 60).toFixed(1));

            console.log(data.endLocation);
            // setDirectionsData(data.itineraryItems);

            // fetchData(
            //   `${data.startLocation.point.coordinates[0]},${data.startLocation.point.coordinates[1]}`,
            //   `${data.endLocation.point.coordinates[0]},${data.endLocation.point.coordinates[1]}`
            // );
            fetchData(origin, destination);
          });
      } catch (error) {
        console.error("Error fetching directions:", error);
        throw error;
      }
    };
    // const origin = "Hồ chí Minh";
    // const destination = "Long An";
    const origin = `${route?.params?.start?.lat},${route?.params?.start?.lng}`;
    const destination = `${route?.params?.destination?.lat},${route?.params?.destination?.lng}`;
    getDirections(
      "bL87M940PHGHkEzNpKCT~7l6e1ifOuzSkJb-SYq0aRA~AoJ-HOVsGdYPvQ2MvQKdhdzyQ-Gxxp_3ZfsE7O6_Ec0L1xosfPF27i7jAOEAlk2M",
      origin,
      destination
    );
  }, []);

  const fetchData = async (start, end) => {
    const apiKey = "RWJ4rLcF0h3PULL6G-Dh3yonCzwLSWmhcEaiEIdbmlQ";

    try {
      const response = await axios.get(
        `https://router.hereapi.com/v8/routes?transportMode=bus&origin=${start}&destination=${end}&return=polyline&apikey=${apiKey}`
      );

      const line = decode(response.data.routes[0].sections[0].polyline);

      setDirectionsData(
        line.polyline.map((path) => ({
          latitude: path[0],
          longitude: path[1],
        }))
      );
    } catch (error) {
      console.error(error);
    }
  };

  ///Move Simulator
  useEffect(() => {
    let interval;
    if (isSimulator) {
      var i = 0;
      interval = setInterval(() => {
        // Increment the position index or reset to 0 when reaching the end of the path
        if (i >= directionsData.length - 1) {
          return;
        }
        setMyPosition(directionsData[i]);
        setCoach(directionsData[i]);
        i += 1;
        setPositionIndex(directionsData.length - i);
      }, 100); // Adjust the interval as needed (milliseconds)
    }
    return () => {
      clearInterval(interval); // Cleanup when the component unmounts
    };
  }, [isSimulator]);
  useEffect(() => {
    if (directionsData && positionIndex === 1) {
      Alert.alert(t("finished"));
      setMyPosition({
        latitude: endLocation?.point?.coordinates[0],
        longitude: endLocation?.point?.coordinates[1],
      });
      setCoach({
        latitude: endLocation?.point?.coordinates[0],
        longitude: endLocation?.point?.coordinates[1],
      });

      setPositionIndex(0);
      return;
    }
  }, [positionIndex]);

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
    <View style={styles.container}>
      {!directionsData && <Loading />}
      {directionsData && (
        <MapView
          style={styles.map}
          ref={mapRef}
          initialRegion={{
            latitude: startLocation.point.coordinates[0],
            longitude: startLocation.point.coordinates[1],
            latitudeDelta: 0.005, // Adjust the zoom level as needed
            longitudeDelta: 0.005,
          }}
          showsMyLocationButton={true}
          loadingEnabled={true}
          showsUserLocation={true}
          showsTraffic={true}
          showsBuildings={true}
          shouldRasterizeIOS={true}
          showsCompass={true}
          onPress={() => {
            setIsVisible((curr) => !curr);
          }}
          // provider="google"

          //   onUserLocationChange={(value) => console.log(value)}
        >
          {/* <MapViewDirections
                origin={{
                  latitude: startLocation.point.coordinates[0],
                  longitude: startLocation.point.coordinates[1],
                }}
                destination={{
                  latitude: endLocation.point.coordinates[0],
                  longitude: endLocation.point.coordinates[1],
                }}
                apikey={"AIzaSyDNI_ZWPqvdS6r6gPVO50I4TlYkfkZdXh8"}
              /> */}
          <Polyline
            coordinates={directionsData}
            strokeWidth={6}
            strokeColor="green"
            lineDashPhase={50}
            lineJoin="bevel"
          />

          <Marker
            coordinate={{
              latitude: startLocation?.point?.coordinates[0],
              longitude: startLocation?.point?.coordinates[1],
            }}
            title={t("start")}
            description={route?.params?.startPlace}
            onPress={(event) => {
              event.stopPropagation();
              setSelectedMarker({
                id: "myLocation",

                duration: "",
                distance: "",
                location: route?.params?.startPlace,
              });
              setIsVisible(true);
            }}
          />
          <Marker
            coordinate={{
              latitude: endLocation?.point?.coordinates[0],
              longitude: endLocation?.point?.coordinates[1],
            }}
            title={t("destination")}
            description={route?.params?.arrivalPlace}
            onPress={(event) => {
              event.stopPropagation();
              setSelectedMarker({
                id: "myLocation",

                duration: duration,
                distance: distance,
                location: route?.params?.arrivalPlace,
              });
              setIsVisible(true);
            }}
          />
          <Marker
            coordinate={myPosition}
            title={t("my-position")}
            description={myPositionInfo?.name}
            icon={require("../../../icon/busSchool.png")}
            image={require("../../../icon/myLocation.png")}
            onPress={(event) => {
              event.stopPropagation();
              setSelectedMarker({
                id: "myLocation",
                duration: "",
                distance: "",
                location: myPositionInfo?.name,
              });
              setIsVisible(true);
            }}
          />
          <Marker
            coordinate={coach}
            title={t("coach")}
            image={require("../../../icon/busSchool.png")}
            onPress={(event) => {
              event.stopPropagation();
              setSelectedMarker({
                id: "coach",
                duration: "",
                distance: "",
                location: myPositionInfo?.name,
              });
              setIsVisible(true);
            }}
          />
        </MapView>
      )}
      <View
        style={{
          position: "absolute",
          left: 0,
          top: 30,
          flexDirection: "row",
          gap: -10,
        }}
      >
        <IconButton
          icon={"ios-chevron-back-outline"}
          color={"blue"}
          size={40}
          onPress={() => {
            navigation.goBack();
          }}
        />
      </View>
      <Pressable
        style={({ pressed }) => [
          {
            position: "absolute",
            right: 10,
            bottom: 210,
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
          setIsSimulator((curr) => !curr);
        }}
      >
        <FontAwesome name="car" size={30} color="blue" />
      </Pressable>
      <Pressable
        style={({ pressed }) => [
          {
            position: "absolute",
            bottom: 0,
            right: 10,
            top: 500,

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
      <View style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
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
          {selectedMaker && selectedMaker?.id == "coach" && (
            <View
              style={{
                gap: 15,
                alignItems: "center",
                // marginLeft: 40,
                backgroundColor: "white",
                borderRadius: 10,
                padding: 5,
                marginTop: 10,
              }}
            >
              <View
                style={{
                  gap: 10,
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  width: "100%",
                  alignSelf: "center",
                }}
              >
                <View
                  style={[
                    {
                      flexDirection: "row",
                      gap: 10,
                      alignItems: "center",
                      justifyContent: "center",
                    },
                  ]}
                >
                  <Image
                    style={{
                      width: 40,
                      height: 40,
                    }}
                    source={require("../../../icon/driver.png")}
                  />
                  <View style={{ gap: 5 }}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "600",
                      }}
                    >
                      {route?.params?.trackingInfo?.members?.driver?.fullName}
                    </Text>
                    <Text
                      style={{
                        color: GlobalColors.price,
                      }}
                    >
                      {
                        route?.params?.trackingInfo?.members?.driver
                          ?.phoneNumber
                      }
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    // width: 190,
                  }}
                >
                  <Image
                    style={{
                      width: 40,
                      height: 40,
                      marginRight: 20,
                      marginLeft: -5,
                    }}
                    source={require("../../../icon/businesswoman.png")}
                  />
                  <View style={{ gap: 5, marginLeft: -5 }}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "600",
                      }}
                    >
                      {
                        route?.params?.trackingInfo?.members?.assistant
                          ?.fullName
                      }
                    </Text>
                    <Text
                      style={{
                        color: GlobalColors.price,
                      }}
                    >
                      {
                        route?.params?.trackingInfo?.members?.assistant
                          ?.phoneNumber
                      }
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  gap: 30,
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  marginLeft: -20,
                }}
              >
                <View style={styles.rowStyle}>
                  <Image
                    style={styles.image}
                    source={require("../../../icon/licensePlate.png")}
                  />
                  <View style={{ gap: 5 }}>
                    <Text
                      style={[
                        styles.phoneNumber,
                        {
                          fontSize: 15,
                        },
                      ]}
                    >
                      {route?.params?.trackingInfo?.coachNumber}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    // width: 190,
                    alignItems: "center",
                  }}
                >
                  <Image
                    style={{
                      width: 40,
                      height: 40,
                      marginRight: 20,
                      marginLeft: -5,
                    }}
                    source={require("../../../icon/seatsQuantity.png")}
                  />
                  <View style={{ gap: 5, marginLeft: -5 }}>
                    <Text
                      style={[
                        styles.phoneNumber,
                        {
                          fontSize: 15,
                        },
                      ]}
                    >
                      {route?.params?.trackingInfo?.coachCapacity} {t("seats")}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}
          {selectedMaker && selectedMaker?.id !== "coach" && (
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
                {`${t("location")}: `}
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    alignSelf: "center",
                    color: GlobalColors.price,
                  }}
                >
                  {selectedMaker && selectedMaker?.location}
                </Text>
              </Text>
              {selectedMaker && selectedMaker.id !== "myLocation" && (
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "bold",
                    color: "gray",
                    marginRight: 10,
                  }}
                >
                  {`${t("distance")}: `}

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

              {selectedMaker && selectedMaker.id !== "myLocation" && (
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "bold",
                    color: "gray",
                    marginRight: 10,
                    marginVertical: 10,
                  }}
                >
                  {`${t("duration")}: `}

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
            </View>
          )}
        </MyModal>
      </View>
      <View
        style={{
          position: "absolute",
          top: 50,
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
          {`${t("distance")}: `}
          <Text
            style={{
              fontSize: 13,
              fontWeight: "bold",
              color: "orange",
            }}
          >
            {distance} km
          </Text>
        </Text>
        <Text
          style={{
            fontSize: 13,
            fontWeight: "bold",
            color: "white",
          }}
        >
          {`${t("duration")}: `}
          <Text
            style={{
              fontSize: 13,
              fontWeight: "bold",
              color: "orange",
            }}
          >
            {duration} {t("hours")}
          </Text>
        </Text>
      </View>
    </View>
  );
}
export default TrackingScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  image: {
    width: 40,
    height: 40,
  },
  rowStyle: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
  },
  phoneNumber: {
    color: GlobalColors.price,
  },
});
