import {
    Button,
    StyleSheet,
    Text,
    View,
    TextInput,
    Image,
    Pressable,
  } from "react-native";
  import React from "react";

  export default function ShuttleCard({item}) {
    return (
        <View style={styles.container}>
          <Text style={styles.text}>{item.place}</Text>
        </View>
      );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      borderRadius: 10,
      elevation: 3,
      backgroundColor: "#FFFFFF",
      shadowOffset: { width: 1, height: 1 },
      shadowColor: "#333333",
      shadowOpacity: 0.3,
      shadowRadius: 2,
      marginHorizontal: 10,
      marginVertical: 10,
      width: 250,
      height: 80,
      alignItems: "center",
      justifyContent: "center",
      padding: 5
    },
    text: {
      fontSize: 16,
    },
  });