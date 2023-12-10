import { Image, View, Text, StyleSheet } from "react-native";

function EmptyTrip({
  title = "There are no trips at your request!",
  message = "Please choose another trip!",
}) {
  return (
    <View style={styles.root}>
      <Image source={require("../../../icon/search_not_found.png")} />
      <Text style={styles.textTop} numberOfLines={2}>
        {title}
      </Text>
      <Text style={styles.textBot} numberOfLines={2}>
        {message}
      </Text>
    </View>
  );
}
export default EmptyTrip;
const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 100,
  },
  textTop: {
    marginTop: 10,
    width: "50%",
    color: "blue",
    fontSize: 16,
    opacity: 0.5,
    fontWeight: "semibold",
    textAlign: "center",
  },
  textBot: {
    marginTop: 10,
    width: "50%",
    fontSize: 12,
    fontWeight: "medium",
    color: "#92929D",
    textAlign: "center",
  },
});
