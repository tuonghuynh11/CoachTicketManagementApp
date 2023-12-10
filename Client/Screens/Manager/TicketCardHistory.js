import {
    Button,
    StyleSheet,
    Text,
    View,
    TextInput,
    Image,
    Pressable,
    ScrollView,
    TouchableWithoutFeedback,
    SafeAreaView,
    Keyboard,
    FlatList,
  } from "react-native";
  import React, { useState } from "react";
  import { MaterialIcons } from '@expo/vector-icons';

  export default function TicketCardHistory({ item }) {
    return (
      <View style={styles.container}>
        <View style={styles.contentView}>
          <View style={styles.info}>
            {/**coachnum, type */}
            <Text style={styles.text}>From: {item.ScheduleData.RouteData.departurePlace}</Text>
            <Text style={styles.text}>To: {item.ScheduleData.RouteData.arrivalPlace}</Text>
            <Text style={styles.text}>Date: {item.reservationDate.substring(0, item.reservationDate.indexOf('T'))}</Text>
            <Text style={styles.text}>Phone: {item.reservationPhoneNumber}</Text>
            <Text style={styles.text}>Price: {item.totalPrice}</Text>
          </View>
          <View style={styles.edit}>
            <MaterialIcons name="arrow-forward-ios" size={30} color="#283663" />
          </View>
        </View>
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
    },
    statusText: {
      color: "white",
      backgroundColor: "#72C6A1",
      fontSize: 20,
      width: "40%",
      borderRadius: 10,
      textAlign: "center",
      margin: 5,
    },
    contentView: {
      flex: 1,
      flexDirection: "row",
    },
    info: {
      flex: 3,
      paddingTop: 10,
      paddingLeft: 15,
      paddingBottom: 10
    },
    edit: {
      flex: 1,
      paddingEnd: 5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      flex: 1,
      fontSize: 18,
      color: "#283663",
      fontWeight: "600",
      
    },
  });