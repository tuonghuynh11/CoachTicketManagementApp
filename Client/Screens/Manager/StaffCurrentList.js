import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  SafeAreaView,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import StaffWorkingCard from "./StaffWorkingCard";

export default function StaffCurrentList() {
  const [staffWorkingList, setStaffWorkingtList] = useState([
    {
      id: "1",
      from: "HCM",
      to: "LA",
      date: "1/1/2021",
      staffs: "2",
      roundTrip: "Yes",
    },
    {
      id: "2",
      from: "HCM",
      to: "BT",
      date: "1/1/2021",
      staffs: "2",
      roundTrip: "Yes",
    },
    {
      id: "3",
      from: "HCM",
      to: "TG",
      date: "1/1/2021",
      staffs: "2",
      roundTrip: "Yes",
    },
    {
      id: "4",
      from: "HCM",
      to: "VL",
      date: "1/1/2021",
      staffs: "2",
      roundTrip: "Yes",
    },
    {
      id: "5",
      from: "HCM",
      to: "KG",
      date: "1/1/2021",
      staffs: "2",
      roundTrip: "Yes",
    },
  ]);

  return (
    <FlatList
      data={staffWorkingList}
      renderItem={({ item }) => (
        <TouchableWithoutFeedback onPress={() => {}}>
          <StaffWorkingCard item={item} />
        </TouchableWithoutFeedback>
      )}
      keyExtractor={(item) => item.id}
    />
  );
}
