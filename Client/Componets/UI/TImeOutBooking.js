import { useEffect, useState } from "react";
import { Button, Text, View, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
function TimeOutBooking({ time, onTimeChange, isDelete }) {
  const [value, setValue] = useState(time);
  function formatSecond(second) {
    const minutes = Math.floor((second % (60 * 60)) / 60);
    const seconds = second % 60;
    const minutesReplace = minutes < 0 ? 0 : minutes;
    const secondsReplace = seconds < 0 ? 0 : seconds;
    const m =
      minutesReplace < 10
        ? "0" + minutesReplace.toString()
        : minutesReplace.toString();
    const s =
      secondsReplace < 10
        ? "0" + secondsReplace.toString()
        : secondsReplace.toString();
    return `${m}:${s}`;
  }
  useEffect(() => {
    console.log("countDown", isDelete, time);
    let inl;
    if (!isDelete) {
      inl = setInterval(() => {
        if (isDelete) clearInterval(inl);
        if (value > 0) {
          setValue((curr) => curr - 1);
          onTimeChange(value);
        } else {
          onTimeChange(0);
          clearInterval(inl);
        }
      }, 1000);
    }
    return () => {
      clearInterval(inl);
    };
    // countDownHandler();
  }, [isDelete, value]);
  function countDownHandler() {
    const inl = setInterval(() => {
      if (isDelete) clearInterval(inl);
      setValue((curr) => curr - 1);
      onTimeChange(value);
    }, 1000);

    setTimeout(() => {
      onTimeChange(0);
      clearInterval(inl);
    }, time * 1000 + 1000);
  }
  function countDown() {
    setValue((curr) => curr - 1);
    onTimeChange(value);
  }
  return (
    <View style={styles.root}>
      <MaterialIcons name="timer" size={24} color="red" />
      <Text>The remaining time of orders </Text>
      <Text style={styles.time}>{formatSecond(value)}</Text>
      {/* <Button title="count down" onPress={countDownHandler}></Button> */}
    </View>
  );
}
export default TimeOutBooking;
const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    backgroundColor: "#f4c7cd",
    padding: 5,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    marginBottom: 5,
    marginHorizontal: 20,
  },
  time: {
    fontWeight: "bold",
    color: "red",
  },
});
