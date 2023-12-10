import { Image, Text, View, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
function RouteItem({ route, onPress }) {
  function addDotsToNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [pressed && styles.pressed]}
    >
      <View style={styles.root}>
        <Image style={styles.image} source={{ uri: route.image }} />
        <View style={styles.details}>
          <View style={styles.headerTitle}>
            <Text style={styles.place}>{route.departurePlace}</Text>
            <Ionicons name={"arrow-forward-outline"} size={24} color="black" />
            <Text style={styles.place}>{route.arrivalPlace}</Text>
          </View>
          <Text style={{ fontSize: 14, color: "#02b623" }}>from</Text>
          <Text>{addDotsToNumber(route.Price)} VND</Text>
        </View>
      </View>
    </Pressable>
  );
}
export default RouteItem;
const styles = StyleSheet.create({
  root: {
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    borderWidth: 0.5,
    borderColor: "gray",
    marginRight: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  place: {
    color: "black",
    fontSize: 15,
    fontWeight: "bold",
  },
  headerTitle: {
    flexDirection: "row",
    gap: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  details: {
    justifyContent: "space-around",
    marginLeft: 10,
  },
  pressed: {
    opacity: 0.6,
  },
});
