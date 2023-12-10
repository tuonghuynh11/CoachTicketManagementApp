import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

function Loading({ message }) {
  return (
    <View style={styles.rootContainer}>
      <ActivityIndicator size="large" />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

export default Loading;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  message: {
    fontSize: 16,
    marginBottom: 12,
    color: "white",
  },
});
