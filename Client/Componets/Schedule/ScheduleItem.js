import { View, StyleSheet, Image, Text, Pressable } from "react-native";
import GlobalColors from "../../Color/colors";
import { Octicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
function ScheduleItem({
  price,
  numberOfAvailableSeat,
  departurePlace,
  arrivalPlace,
  departureTime,
  arrivalTime,
  duration,
  services,
  onPressed,
}) {
  function addDotsToNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  function getDate(rawDate) {
    try {
      let date = new Date(rawDate);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();

      month = month < 10 ? `0${month}` : month;
      day = day < 10 ? `0${day}` : day;
      return `${day}-${month}-${year}`;
    } catch (error) {
      return;
    }
  }
  function getTime(rawDate) {
    try {
      let date = new Date(rawDate);
      let hour = date.getHours();
      let minutes = date.getMinutes();

      let season = hour < 12 ? "AM" : "PM";
      hour = hour < 10 ? `0${hour}` : hour;
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      return `${hour}:${minutes} ${season}`;
    } catch (error) {
      return;
    }
  }

  function hasService(serviceName) {
    return services.some((service) => service === serviceName);
  }
  return (
    <Pressable
      onPress={onPressed}
      style={({ pressed }) => [pressed && styles.pressed]}
    >
      <View style={styles.root}>
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
              }}
            >
              {addDotsToNumber(price)} VND
            </Text>

            {/* If seat available < 10 , color is red, else green */}
            <Text
              style={[
                {
                  fontSize: 12,
                },
                numberOfAvailableSeat >= 10
                  ? { color: "#28C584" }
                  : { color: "red" },
              ]}
            >
              {numberOfAvailableSeat < 10
                ? numberOfAvailableSeat + " Left"
                : "Available"}
            </Text>
          </View>
        </View>

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
              maxWidth: 150,
              textAlign: "left",
            }}
          >
            {departurePlace}
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "#8C8D89",
              maxWidth: 150,
              textAlign: "right",
            }}
          >
            {arrivalPlace}
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
            <Text style={styles.time}>{getTime(departureTime)}</Text>
            <Text style={styles.date}>{getDate(departureTime)}</Text>
          </View>

          <View style={styles.iconActivity}>
            <View style={styles.iconContainer}>
              <Octicons name="dot" size={24} color="#1C6AE4" />
              <View
                style={{
                  height: 1,
                  width: 100,
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
            <Text style={[styles.date, { marginTop: 15 }]}>
              {" "}
              {/* {getTime(duration)}{" "} */}
              {duration}{" "}
            </Text>
          </View>

          <View style={styles.dateTime1}>
            <Text style={styles.time}>{getTime(arrivalTime)}</Text>
            <Text style={styles.date}>{getDate(arrivalTime)}</Text>
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
    </Pressable>
  );
}
export default ScheduleItem;

const styles = StyleSheet.create({
  root: {
    borderRadius: 10,
    margin: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 0.2,
    borderColor: "gray",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF0EB",
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
    justifyContent: "flex-start",
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
});
