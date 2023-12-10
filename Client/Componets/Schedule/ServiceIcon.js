import { View, StyleSheet, Image, Text } from "react-native";

function ServiceIcon({ serviceName }) {
  function hasService(service) {
    console.log(service === serviceName);
    return service === serviceName;
  }
  return (
    <View style={styles.service}>
      {hasService("Air Conditioner") && (
        <View style={styles.container}>
          <View style={styles.imageIconContainer}>
            <Image
              style={styles.imageIcon}
              source={require("../../../icon/air_conditioner.png")}
            />
          </View>
          <Text style={styles.textContainer}>Cool Air</Text>
        </View>
      )}

      {hasService("Wifi") && (
        <View style={styles.container}>
          <View style={styles.imageIconContainer}>
            <Image
              style={styles.imageIcon}
              source={require("../../../icon/wifi.png")}
            />
          </View>
          <Text style={styles.textContainer}>Wifi</Text>
        </View>
      )}

      {hasService("TV") && (
        <View style={styles.container}>
          <View style={styles.imageIconContainer}>
            <Image
              style={styles.imageIcon}
              source={require("../../../icon/television.png")}
            />
          </View>
          <Text style={styles.textContainer}>TV</Text>
        </View>
      )}

      {hasService("Blanket") && (
        <View style={styles.container}>
          <View style={styles.imageIconContainer}>
            <Image
              style={styles.imageIcon}
              source={require("../../../icon/blanket.png")}
            />
          </View>
          <Text style={styles.textContainer}>Warm</Text>
        </View>
      )}

      {hasService("Charging Socket") && (
        <View style={styles.container}>
          <View style={styles.imageIconContainer}>
            <Image
              style={styles.imageIcon}
              source={require("../../../icon/power_plug.png")}
            />
          </View>
          <Text style={styles.textContainer}>Charger</Text>
        </View>
      )}

      {hasService("Mattress") && (
        <View style={styles.container}>
          <View style={styles.imageIconContainer}>
            <Image
              style={styles.imageIcon}
              source={require("../../../icon/air_mattress.png")}
            />
          </View>
          <Text style={styles.textContainer}>Smooth</Text>
        </View>
      )}

      {hasService("Earphone") && (
        <View style={styles.container}>
          <View style={styles.imageIconContainer}>
            <Image
              style={styles.imageIcon}
              source={require("../../../icon/headphones.png")}
            />
          </View>
          <Text style={styles.textContainer}>Enjoy</Text>
        </View>
      )}

      {hasService("Toilet") && (
        <View style={styles.container}>
          <View style={styles.imageIconContainer}>
            <Image
              style={styles.imageIcon}
              source={require("../../../icon/toilets.png")}
            />
          </View>
          <Text style={styles.textContainer}>Toilet</Text>
        </View>
      )}
    </View>
  );
}
export default ServiceIcon;

const styles = StyleSheet.create({
  service: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 10,
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  imageIcon: {
    height: 25,
    width: 25,
  },
  imageIconContainer: {
    width: 45,
    borderWidth: 1,
    borderRadius: 15,
    padding: 5,
    paddingHorizontal: 9,
  },
  textContainer: {
    color: "black",
    fontSize: 15,
    fontWeight: "400",
    marginTop: 3,
  },
});
