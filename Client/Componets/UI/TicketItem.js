import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Image,
  Dimensions,
  PixelRatio,
  TouchableOpacity,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { Octicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import GlobalColors from "../../Color/colors";
import { getDate, getTime } from "../../Helper/Date";
import Barcode from "@kichiyaki/react-native-barcode-generator";
import CustomButton from "./CustomButton";
import { captureRef } from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import { Ionicons } from "@expo/vector-icons";
import FlatButton from "../UI/FlatButton";
import * as ImagePicker from "expo-image-picker";
import { Pressable } from "react-native";
function TicketItem({
  tripInfo,
  ticket,
  isHistory,
  paddingClose,
  shuttleHandler,
}) {
  const captureRefHandler = useRef();
  const [galleryPermissionInformation, requestPermission] =
    ImagePicker.useMediaLibraryPermissions();

  async function verifyGalleryPermission() {
    if (
      galleryPermissionInformation.status ===
      ImagePicker.PermissionStatus.UNDETERMINED
    ) {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    }
    if (
      galleryPermissionInformation.status ===
      ImagePicker.PermissionStatus.DENIED
    ) {
      Alert.alert(
        "Insuficient Permission!",
        "You need to grant gallery permissions to change avatar"
      );

      return false;
    }
    return true;
  }
  const captureImage = async () => {
    // const hasPermission = await verifyGalleryPermission();
    // if (!hasPermission) {
    //   return;
    // }
    try {
      const localUri = await captureRef(captureRefHandler, {
        height: 980,
        width: 400,
        quality: 1,
      });

      await MediaLibrary.saveToLibraryAsync(localUri);
      if (localUri) {
        alert("Saved!");
      }
    } catch (e) {
      console.log(e);
    }
  };
  function hasService(serviceName) {
    return tripInfo.services.some((service) => service === serviceName);
  }
  function generateInvoiceCode(lengths = 10) {
    const length = lengths; // Change the length of the OTP as needed
    let code = "";
    const characters = "AWERTYUIPAFDAFSGGJJKG";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
    }

    return code + "E" + ticket.reservationId;
  }
  function Header() {
    return (
      <View style={styles.root1}>
        <View style={styles.header}>
          <Image
            style={styles.image}
            source={require("../../../assets/logo.png")}
          />
          <View style={styles.subHeader}>
            <Text
              style={{
                fontSize: 18,
                color: GlobalColors.price,
                fontWeight: "bold",
                width: 100,
                textAlign: "center",
              }}
            >
              Faster Company
            </Text>
          </View>
        </View>
        <Separator />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingTop: 10,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: "#8C8D89",
              maxWidth: 160,
              textAlign: "left",
            }}
          >
            {tripInfo.departurePlace}
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "#8C8D89",
              maxWidth: 160,
              textAlign: "right",
            }}
          >
            {tripInfo.arrivalPlace}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 10,
          }}
        >
          <View style={styles.dateTime}>
            <Text style={styles.time}>{getTime(tripInfo.departureTime)}</Text>
            <Text style={styles.date}>{getDate(tripInfo.departureTime)}</Text>
          </View>

          <View style={styles.iconActivity}>
            <View style={styles.iconContainer}>
              <Octicons name="dot" size={24} color="#1C6AE4" />
              <View
                style={{
                  height: 1,
                  width: 125,
                  borderTopWidth: 1,
                  borderTopColor: "#1C6AE4",
                  opacity: 0.3,
                }}
              ></View>
              <Octicons name="dot-fill" size={24} color="#1C6AE4" />
            </View>
            <View style={{ marginTop: -33 }}>
              <MaterialCommunityIcons
                name="bus-articulated-front"
                size={24}
                color="#1C6AE4"
              />
            </View>
            <Text style={[styles.date, { marginTop: 0 }]}>
              {" "}
              {tripInfo.duration}{" "}
            </Text>
          </View>

          <View style={styles.dateTime1}>
            <Text style={styles.time}>{getTime(tripInfo.arrivalTime)}</Text>
            <Text style={styles.date}>{getDate(tripInfo.arrivalTime)}</Text>
          </View>
        </View>

        <View style={styles.service}>
          {hasService("Air Conditioner") && (
            <View style={styles.imageIconContainer}>
              <Image
                style={styles.imageIcon}
                source={require("../../../icon/air_conditioner.png")}
              />
            </View>
          )}

          {hasService("Wifi") && (
            <View style={styles.imageIconContainer}>
              <Image
                style={styles.imageIcon}
                source={require("../../../icon/wifi.png")}
              />
            </View>
          )}

          {hasService("TV") && (
            <View style={styles.imageIconContainer}>
              <Image
                style={styles.imageIcon}
                source={require("../../../icon/television.png")}
              />
            </View>
          )}

          {hasService("Blanket") && (
            <View style={styles.imageIconContainer}>
              <Image
                style={styles.imageIcon}
                source={require("../../../icon/blanket.png")}
              />
            </View>
          )}

          {hasService("Charging Socket") && (
            <View style={styles.imageIconContainer}>
              <Image
                style={styles.imageIcon}
                source={require("../../../icon/power_plug.png")}
              />
            </View>
          )}

          {hasService("Mattress") && (
            <View style={styles.imageIconContainer}>
              <Image
                style={styles.imageIcon}
                source={require("../../../icon/air_mattress.png")}
              />
            </View>
          )}

          {hasService("Earphone") && (
            <View style={styles.imageIconContainer}>
              <Image
                style={styles.imageIcon}
                source={require("../../../icon/headphones.png")}
              />
            </View>
          )}

          {hasService("Toilet") && (
            <View style={styles.imageIconContainer}>
              <Image
                style={styles.imageIcon}
                source={require("../../../icon/toilets.png")}
              />
            </View>
          )}
          {hasService("Food") && (
            <View style={styles.imageIconContainer}>
              <Image
                style={styles.imageIcon}
                source={require("../../../icon/food.png")}
              />
            </View>
          )}
          {hasService("Drink") && (
            <View style={styles.imageIconContainer}>
              <Image
                style={styles.imageIcon}
                source={require("../../../icon/drink.png")}
              />
            </View>
          )}
        </View>
      </View>
    );
  }
  function Separator() {
    return (
      <View
        style={{
          overflow: "hidden",
          marginTop: 20,
          width: "100%",
          alignSelf: "center",
        }}
      >
        <View
          style={{
            borderStyle: "dashed",
            borderWidth: 1.5,
            borderColor: "gray",
            margin: -2,
            marginTop: 0,
            opacity: 0.4,
          }}
        ></View>
      </View>
    );
  }
  function SubBody({ title1, subTitle1, title2, subTitle2 }) {
    console.log("title1", title1);
    console.log("subtitle1", subTitle1);
    console.log("title2", title2);
    console.log("subTitle2", subTitle2);
    return (
      <View style={styles.subBody}>
        <View style={{ gap: 5 }}>
          <Text style={[styles.title]}>{title1}</Text>
          <Text style={[styles.subTitle, { maxWidth: 110 }]} numberOfLines={1}>
            {subTitle1}
          </Text>
        </View>
        <View style={{ gap: 5 }}>
          <Text style={styles.title}>{title2}</Text>
          <Text style={styles.subTitle}>{subTitle2}</Text>
        </View>
      </View>
    );
  }
  function cancelTicketHandler() {
    console.log("cancel");
  }
  return (
    <View style={styles.root}>
      {/* {!isHistory && (
        <TouchableOpacity
          style={[
            {
              marginBottom: 0,
              marginTop: -3,
              marginBottom: -18,
              marginRight: -5,
              zIndex: 1,
              alignSelf: "flex-end",
            },
            paddingClose && { marginRight: 0 },
          ]}
          onPress={cancelTicketHandler}
        >
          <Ionicons name="ios-close-circle-outline" size={28} color="red" />
        </TouchableOpacity>
      )} */}
      <View style={styles.subRoot}>
        <View ref={captureRefHandler} style={styles.subRoot1}>
          <View
            style={[
              styles.status,
              ticket.status === 0 && { backgroundColor: "#ea8b8b" },
            ]}
          >
            <Text style={[styles.statusTitle]}>
              {ticket.status === 0 ? "Unpaid" : "Paid"}
            </Text>
          </View>
          <View>
            <Header />
          </View>
          <Separator />
          <View
            style={{
              marginTop: 20,
              gap: 20,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <SubBody
              title1={"ID Number"}
              subTitle1={ticket.reservationId}
              title2={"Full Name"}
              subTitle2={ticket.fullName}
            />
            <SubBody
              title1={"Seat"}
              subTitle1={ticket.seatNumber}
              title2={"Coach Type"}
              subTitle2={ticket.coachType}
            />
            <View>
              <SubBody
                title2={"Shuttle"}
                title1={"Round-Trip"}
                subTitle1={
                  tripInfo?.roundTripDate
                    ? getDate(tripInfo?.roundTripDate)
                    : "None"
                }
              />
              {tripInfo?.shuttleRoute && (
                <Pressable
                  style={({ pressed }) => [pressed && { opacity: 0.6 }]}
                  onPress={shuttleHandler}
                >
                  <Text
                    style={[
                      styles.subTitle,
                      {
                        maxWidth: 110,
                        marginTop: -13,
                        color: tripInfo?.shuttleRoute
                          ? GlobalColors.button
                          : "gray",
                        fontWeight: tripInfo?.shuttleRoute && "bold",
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {tripInfo?.shuttleRoute
                      ? tripInfo?.shuttleRoute.departurePlace
                      : "None"}
                  </Text>
                </Pressable>
              )}
              {!tripInfo?.shuttleRoute && (
                <Pressable
                  disabled
                  style={({ pressed }) => [pressed && { opacity: 0.6 }]}
                >
                  <Text
                    style={[
                      styles.subTitle,
                      {
                        maxWidth: 110,
                        marginTop: -13,
                        color: tripInfo?.shuttleRoute
                          ? GlobalColors.button
                          : "gray",
                        fontWeight: tripInfo?.shuttleRoute && "bold",
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {tripInfo?.shuttleRoute
                      ? tripInfo?.shuttleRoute.departurePlace
                      : "None"}
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
          <Separator />

          <View
            style={{
              width: "100%",
              backgroundColor: "gray",
              marginTop: 10,
              marginBottom: 10,
            }}
          >
            {/* Scan barcode :  number a last is reservationId */}
            <Barcode
              style={{ width: "100%" }}
              format="CODE128A"
              value={generateInvoiceCode()}
              height={45}
              text={generateInvoiceCode(20)}
              maxWidth={300}
            />
          </View>
        </View>
        <View style={{ marginTop: 0, paddingTop: -20, paddingHorizontal: 10 }}>
          <CustomButton
            radius={10}
            color={GlobalColors.validate}
            onPress={captureImage}
          >
            <Text
              style={{
                textAlign: "center",
                color: "white",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Download Ticket
            </Text>
          </CustomButton>
        </View>
      </View>
    </View>
  );
}
export default TicketItem;
const styles = StyleSheet.create({
  root: {
    flex: 1,
    borderRadius: 10,
    // marginHorizontal: 6,
    paddingHorizontal: 5,
  },
  subRoot: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingBottom: 10,
    // paddingHorizontal: 10,
  },
  subRoot1: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 20,
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  root1: {
    borderRadius: 10,
    paddingBottom: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
  },
  image: {
    height: 60,
    width: 100,
    borderRadius: 10,
  },
  subHeader: {
    gap: 5,
    alignItems: "flex-end",
  },
  dateTime: {
    justifyContent: "center",
    gap: 5,
  },
  dateTime1: {
    justifyContent: "center",
    alignItems: "flex-end",
    gap: 5,
  },
  time: {
    fontSize: 18,
    paddingBottom: 5,
  },
  date: {
    fontSize: 13,
    opacity: 0.5,
  },
  iconActivity: {
    alignItems: "center",
    marginHorizontal: 15,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  pressed: {
    opacity: 0.6,
  },
  service: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  imageIcon: {
    height: 25,
    width: 25,
  },
  imageIconContainer: {
    borderWidth: 1,
    borderRadius: 15,
    padding: 4,
    paddingHorizontal: 6,
    marginRight: 5,
  },
  subBody: {
    // flexDirection: "row",
    // justifyContent: "space-between",
    gap: 10,
  },
  title: {
    fontSize: 15,
    opacity: 0.5,
  },
  subTitle: {
    fontSize: 16,
  },
  status: {
    backgroundColor: "#1bea4b",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    padding: 5,
  },
  statusTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
});
