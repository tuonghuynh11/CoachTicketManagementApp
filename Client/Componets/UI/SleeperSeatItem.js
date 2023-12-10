import { View, StyleSheet, Image, Text, Pressable } from "react-native";

function SleeperSeatItem({ type, number, label, width, height, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <View style={styles.root}>
        {type === "empty" && (
          <Image
            style={[
              styles.image,
              width && { width: width },
              height && { height: height },
            ]}
            source={require("../../../icon/sleeper_seat_empty.png")}
          />
        )}
        {type === "reserved" && (
          <Image
            style={[
              styles.image,
              ,
              width && { width: width },
              height && { height: height },
            ]}
            source={require("../../../icon/sleeper_seat_busy.png")}
          />
        )}
        {type === "yourChoice" && (
          <Image
            style={[
              styles.image,
              ,
              width && { width: width },
              height && { height: height },
            ]}
            source={require("../../../icon/sleeper_seat_choice.png")}
          />
        )}
        {type === "reject" && (
          <Image
            style={[
              styles.image,
              ,
              width && { width: width },
              height && { height: height },
            ]}
            source={require("../../../icon/seat_reject.png")}
          />
        )}
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.number}>{number}</Text>
      </View>
    </Pressable>
  );
}
export default SleeperSeatItem;
const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  image: {
    width: 30,
    height: 50,
  },
  label: {
    fontSize: 16,
    fontWeight: "400",
  },
  number: {
    position: "absolute",
    left: -10,
    right: 0,
    color: "white",
    fontWeight: "600",
    textAlign: "center",
    alignSelf: "center",
  },
  button: {
    // elevation: 2,
    // shadowOffset: { width: 1, height: 1 },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
  },
  pressed: {
    opacity: 0.7,
  },
});
