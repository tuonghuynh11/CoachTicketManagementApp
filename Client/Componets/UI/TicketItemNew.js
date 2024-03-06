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
import { useTranslation } from "react-i18next";
function TicketItemNew({
  tripInfo,
  ticket,
  isHistory,
  paddingClose,
  shuttleHandler,
  onCancelTicket,
}) {
  const { t } = useTranslation();
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
        `${t("insufficient-permission")}!`,
        t("grant-gallery-permissions-to-change-avatar")
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
      const { width, height } = Dimensions.get("screen");
      const padding = 20;
      const localUri = await captureRef(captureRefHandler, {
        height: 220,
        width: 150,
        quality: 1,
      });

      await MediaLibrary.saveToLibraryAsync(localUri);
      if (localUri) {
        alert(`${t("saved")}!`);
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
  useEffect(() => {
    console.log(ticket.status);
  }, []);
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
          <Text style={[styles.subTitle, { maxWidth: 80 }]}>{subTitle2}</Text>
        </View>
      </View>
    );
  }
  function cancelTicketHandler() {
    console.log("cancel");
  }
  return (
    <>
      {ticket.status != 0 && ticket.status != 1 && (
        <View
          style={[
            {
              height: "100%",
              width: "100%",
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              alignSelf: "center",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0.2,
            },
            { zIndex: 1 },
          ]}
        >
          {ticket.status == 4 && (
            <Image
              style={{
                height: "80%",
                width: "80%",
                transform: [{ rotate: "45deg" }],
              }}
              source={require("../../../icon/confirmTicket.png")}
            />
          )}
          {ticket.status == 2 && (
            <Image
              style={{
                height: 300,
                width: 330,
                transform: [{ rotate: "45deg" }],
              }}
              source={require("../../../icon/cancelTicket.png")}
            />
          )}
        </View>
      )}

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
            onPress={onCancelTicket}
          >
            <Ionicons name="ios-close-circle-outline" size={28} color="red" />
          </TouchableOpacity>
        )} */}
        <View style={styles.subRoot}>
          <View ref={captureRefHandler} style={styles.subRoot1}>
            <View
              style={[
                styles.status,
                ticket.status == 0 && { backgroundColor: "#ea8b8b" },
              ]}
            >
              <Text style={[styles.statusTitle]}>
                {ticket.status == 0 ? t("unpaid") : t("paid")}
              </Text>
            </View>
            <View style={{ gap: 5, alignSelf: "center", alignItems: "center" }}>
              <Text
                style={[
                  {
                    fontSize: 20,
                    opacity: 0.5,
                  },
                ]}
              >
                {t("s-seat")}
              </Text>
              <Text
                style={[styles.subTitle, { fontSize: 40, fontWeight: "bold" }]}
                numberOfLines={1}
              >
                {ticket.seatNumber}
              </Text>
            </View>
            <View
              style={{
                marginTop: 20,
                gap: 20,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <SubBody
                title1={t("id-number")}
                subTitle1={ticket.reservationId}
                title2={t("full-name")}
                subTitle2={ticket.fullName}
              />
              <SubBody
                title1={t("s-seat")}
                subTitle1={ticket.seatNumber}
                title2={t("coach-type")}
                subTitle2={ticket.coachType}
              />
              <View>
                <SubBody
                  title2={t("shuttle")}
                  title1={t("s-round-trip")}
                  subTitle1={
                    tripInfo?.roundTripDate
                      ? tripInfo?.roundTripDate
                      : t("none")
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
                          maxWidth: 100,
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
                        : t("none")}
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
                        : t("none")}
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
                marginTop: 20,
                marginBottom: 10,
              }}
            >
              {/* Scan barcode :  number a last is reservationId */}
              <Barcode
                style={{ width: "100%" }}
                format="CODE128A"
                value={generateInvoiceCode()}
                height={70}
                text={generateInvoiceCode(20)}
                maxWidth={300}
              />
            </View>
          </View>
          <View
            style={{ marginTop: 0, paddingTop: -20, paddingHorizontal: 10 }}
          >
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
                {t("download-ticket")}
              </Text>
            </CustomButton>
          </View>
        </View>
      </View>
    </>
  );
}
export default TicketItemNew;
const styles = StyleSheet.create({
  root: {
    flex: 1,
    borderRadius: 10,
    // marginHorizontal: 6,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: "black",
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
