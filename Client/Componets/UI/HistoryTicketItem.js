import {
  View,
  StyleSheet,
  ImageBackground,
  Text,
  Pressable,
  Button,
  Image,
} from "react-native";
import { Octicons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { getDate, getTime } from "../../Helper/Date";
import GlobalColors from "../../Color/colors";
import { AntDesign } from "@expo/vector-icons";
function HistoryTicketItem({ ticket, tripInfo, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.root, pressed && styles.pressed]}
    >
      <View style={styles.subRoot}>
        <View style={{ flex: 2, gap: 10 }}>
          <View
            style={[
              { flexDirection: "row" },
              { justifyContent: "space-between" },
            ]}
          >
            <View>
              <View style={styles.rowStyle}>
                <Image
                  style={styles.iconSize}
                  source={require("../../../icon/From.png")}
                />
                <View>
                  <Text style={styles.time}>
                    {tripInfo.ScheduleData.StartPlaceData.placeName}
                  </Text>
                  <Text style={styles.station}>
                    {tripInfo.ScheduleData.RouteData.departurePlace}
                  </Text>
                </View>
              </View>
              <View style={styles.rowStyle}>
                <Image
                  style={styles.iconSize}
                  source={require("../../../icon/To.png")}
                />
                <View>
                  <Text style={styles.time}>
                    {tripInfo.ScheduleData.ArrivalPlaceData.placeName}
                  </Text>
                  <Text style={styles.station}>
                    {tripInfo.ScheduleData.RouteData.arrivalPlace}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[{ flexDirection: "row", gap: 10 }, { marginTop: 5 }]}>
              <View style={{ marginTop: 4, alignItems: "center" }}>
                <Octicons name="dot" size={24} color={GlobalColors.price} />
                <View
                  style={{
                    height: 35,
                    borderLeftWidth: 1,
                    borderLeftColor: GlobalColors.price,
                    marginVertical: -9,
                  }}
                ></View>
                <Octicons name="dot" size={24} color={"red"} />
              </View>
              <View style={{ gap: 15, alignItems: "flex-end", marginTop: 10 }}>
                <Text style={styles.time}>
                  {getTime(tripInfo.ScheduleData.departureTime)}
                </Text>
                <Text style={styles.time}>
                  {getTime(tripInfo.ScheduleData.arrivalTime)}
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
          <View style={[styles.rowStyle, { justifyContent: "space-between" }]}>
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
                    ? " passengers"
                    : " passenger")}
              </Text>
            </View>
            <View style={[styles.rowStyle, { gap: 5 }]}>
              {!ticket.isRoundTrip && (
                <Text style={{ fontSize: 15 }}>One Way</Text>
              )}
              {!ticket.isRoundTrip && (
                <Ionicons name="arrow-up-outline" size={24} color="black" />
              )}

              {ticket.isRoundTrip && (
                <Octicons
                  style={{ transform: [{ rotate: "90deg" }] }}
                  name="arrow-switch"
                  size={24}
                  color="black"
                />
              )}
              {ticket.isRoundTrip && (
                <Text style={{ fontSize: 15 }}>Two Way</Text>
              )}
            </View>
          </View>
        </View>
        <View
          style={{
            justifyContent: "center",
            backgroundColor: GlobalColors.button,
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
            margin: -10,
            marginLeft: 10,
          }}
        >
          <AntDesign name="caretright" size={30} color="white" />
        </View>
      </View>
    </Pressable>
  );
}
export default HistoryTicketItem;
const styles = StyleSheet.create({
  root: {
    flex: 1,
    margin: 10,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
  },
  image: {
    width: 370,
    height: 215,
  },
  subRoot: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
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
  rowStyle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  pressed: {
    opacity: 0.6,
  },
  iconSize: {
    width: 40,
    height: 40,
  },
  station: {
    fontWeight: "400",
    opacity: 0.4,
  },
});
