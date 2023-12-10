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
  ActivityIndicator
} from "react-native";
import React, { useState, useEffect } from "react";
import TicketCardHistory from "./TicketCardHistory";
import TicketCard from "./TicketCard";
import { useRoute } from '@react-navigation/native';
import { useIsFocused } from "@react-navigation/native";
import { getAllUserTicketsHistory } from "../../util/userTicketService";

export default function TicketHistoryList() {

  const route = useRoute();
  const itemFromParent = route.params?.id;
  const [ticketList, setTicketList] = useState([
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

  const [currentTicketList, setCurrentTicketList] = useState([]);
  const [ticketListData, setTicketListData] = useState([]);

  const isFocused = useIsFocused();

  const fetchTickets = async () => {
    if (isFocused) {
      try {
        setIndicator(true);
        const data = await getAllUserTicketsHistory(itemFromParent);
        setCurrentTicketList(data.data.history);
        setIndicator(false);
      } catch (error) {
        // Handle error, e.g., redirect to login if unauthorized
        console.error("Error fetching tickets:", error);
      }
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [isFocused]);

  const [indicator, setIndicator] = useState(false);

  return (
    <View>
      <ActivityIndicator style={styles.indicator} size={"large"} animating={indicator}/>
      <FlatList
        data={currentTicketList}
        renderItem={({ item }) => (
          <TouchableWithoutFeedback onPress={() => {}}>
            <TicketCardHistory item={item} />
          </TouchableWithoutFeedback>
        )}
        keyExtractor={(item, index) => index + 1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  indicator: {
    position: "absolute",
    zIndex: 1000,
    right: '46%',
    top: "50%"
  }
});