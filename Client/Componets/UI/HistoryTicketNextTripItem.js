import {
  View,
  StyleSheet,
  ImageBackground,
  Text,
  Pressable,
} from "react-native";
import { Octicons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { getDate, getTime } from "../../Helper/Date";
import { useTranslation } from "react-i18next";
function HistoryTicketNextTripItem({ ticket, tripInfo, onPress }) {
  const { t } = useTranslation();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.root, pressed && styles.pressed]}
    >
      <ImageBackground
        style={styles.image}
        resizeMode="cover"
        source={require("../../../icon/ticket.png")}
      >
        <View style={styles.subRoot}>
          <View style={{ flexDirection: "row", gap: 15 }}>
            <View style={{ gap: 15, alignItems: "flex-end", marginTop: 10 }}>
              <Text style={styles.time}>
                {getTime(tripInfo.ScheduleData.departureTime)}
              </Text>
              <Text style={styles.time}>
                {getTime(tripInfo.ScheduleData.arrivalTime)}
              </Text>
            </View>
            <View style={{ marginTop: 4, alignItems: "center" }}>
              <Octicons name="dot" size={24} color="black" />
              <View
                style={{
                  height: 35,
                  borderLeftWidth: 1,
                  borderLeftColor: "black",
                  marginVertical: -9,
                }}
              ></View>
              <Octicons name="dot" size={24} color="black" />
            </View>
            <View style={{ marginTop: 2 }}>
              <View>
                <Text style={styles.place}>
                  {
                    tripInfo.ScheduleData.StartPlaceData.placeName.split(", ")[
                      tripInfo.ScheduleData.StartPlaceData.placeName.split(", ")
                        .length - 2
                    ]
                  }
                </Text>
                <Text style={styles.station}>
                  {tripInfo.ScheduleData.RouteData.departurePlace}
                </Text>
              </View>
              <View>
                <Text style={styles.place}>
                  {
                    tripInfo.ScheduleData.ArrivalPlaceData.placeName.split(
                      ", "
                    )[
                      tripInfo.ScheduleData.ArrivalPlaceData.placeName.split(
                        ", "
                      ).length - 2
                    ]
                  }
                </Text>
                <Text style={styles.station}>
                  {tripInfo.ScheduleData.RouteData.arrivalPlace}
                </Text>
              </View>
            </View>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Octicons name="calendar" size={24} color="black" />
            <Text style={styles.date}>
              {getDate(tripInfo.ScheduleData.departureTime)}
            </Text>
          </View>
          <View style={[styles.rowStyle, { gap: 15 }]}>
            <View style={styles.rowStyle}>
              <Ionicons name="person-outline" size={24} color="red" />
              <Text
                style={{
                  color: "red",
                  fontSize: 18,
                }}
              >
                {ticket.reservationId.length +
                  (ticket.reservationId.length > 1
                    ? ` ${t("passengers")}`
                    : ` ${t("passenger")}`)}
              </Text>
            </View>
            <View style={[styles.rowStyle, { gap: 5 }]}>
              {ticket.RoundTripTicketData.length === 0 && (
                <Text style={{ fontSize: 15 }}>{t("one-way")}</Text>
              )}
              {ticket.RoundTripTicketData.length === 0 && (
                <Ionicons name="arrow-up-outline" size={24} color="black" />
              )}

              {ticket.RoundTripTicketData.length !== 0 && (
                <Octicons
                  style={{ transform: [{ rotate: "90deg" }] }}
                  name="arrow-switch"
                  size={24}
                  color="black"
                />
              )}
              {ticket.RoundTripTicketData.length !== 0 && (
                <Text style={{ fontSize: 15 }}>{t("two-way")}</Text>
              )}
            </View>
          </View>
        </View>
      </ImageBackground>
    </Pressable>
  );
}
export default HistoryTicketNextTripItem;
const styles = StyleSheet.create({
  root: {
    flex: 1,
    marginRight: 10,
    padding: 10,
  },
  image: {
    width: 370,
    height: 215,
  },
  subRoot: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
    paddingLeft: 40,
    gap: 10,
  },
  time: {
    fontWeight: "bold",
    fontSize: 17,
  },
  place: {
    fontWeight: "bold",
    fontSize: 16,
  },
  station: {
    fontWeight: "400",
    opacity: 0.4,
  },
  date: {
    fontSize: 17,
    fontWeight: "400",
  },
  rowStyle: { flexDirection: "row", alignItems: "center", gap: 10 },
  pressed: {
    opacity: 0.6,
  },
});
