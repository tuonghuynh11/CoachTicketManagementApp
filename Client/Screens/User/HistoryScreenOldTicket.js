import {
  Alert,
  Button,
  Text,
  View,
  StyleSheet,
  FlatList,
  SectionList,
  Dimensions,
} from "react-native";
import { useContext, useEffect, useState } from "react";
import GlobalColors from "../../Color/colors";
import HistoryTicketNextTripItem from "../../Componets/UI/HistoryTicketNextTripItem";
import HistoryTicketItem from "../../Componets/UI/HistoryTicketItem";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../../Store/authContex";
import { getAllTicketsOfUser } from "../../util/databaseAPI";
import { TicketHistoryModel } from "../../Models/TicketHistoryModel";
import Loading from "../../Componets/UI/Loading";
import EmptyTrip from "../../Componets/UI/EmptyTrip";
function HistoryScreenOldTicket({ navigation }) {
  const authCtx = useContext(AuthContext);
  const [historyTicket, setHistoryTicket] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    async function getHistory() {
      setIsLoading(true);
      const data = await getAllTicketsOfUser(authCtx.token, authCtx.idUser);
      if (data === null) return;
      const history = new TicketHistoryModel(
        data.data.error,
        data.data.code,
        data.data.message,
        data.data.data
      );

      const temp1 = history.data.history.sort(
        (trip1, trip2) =>
          new Date(trip2.ScheduleData.departureTime) -
          new Date(trip1.ScheduleData.departureTime)
      );

      // Convert array to map (key:year, value:list of tickets)
      let mapTicket = new Map();
      for (const ticket of temp1) {
        if (
          !mapTicket.has(
            new Date(ticket.ScheduleData.departureTime).getFullYear()
          )
        ) {
          mapTicket.set(
            new Date(ticket.ScheduleData.departureTime).getFullYear(),
            [ticket]
          );
        } else {
          const tp = mapTicket.get(
            new Date(ticket.ScheduleData.departureTime).getFullYear()
          );
          tp.push(ticket);
          mapTicket.set(
            new Date(ticket.ScheduleData.departureTime).getFullYear(),
            tp
          );
        }
      }

      // format array
      const temp2 = [];

      mapTicket.forEach((value, key) => {
        temp2.push({
          title: key,
          data: value,
        });
      });
      setHistoryTicket(temp2);
      setIsLoading(false);
      // console.log(JSON.stringify(history.data.current));
    }
    getHistory();
  }, []);

  function historyTicketHandler(ticketInfo) {
    navigation.navigate("TicketDetailScreen", {
      ticketInfo: ticketInfo,
      isHistory: true,
    });
  }
  function renderPreviousTickets(item) {
    return (
      <HistoryTicketItem
        ticket={item}
        tripInfo={item}
        onPress={historyTicketHandler.bind(this, item)}
      />
    );
  }
  function renderHeaderPreviousTickets(title) {
    return (
      <View
        style={{
          flexDirection: "row",
          gap: 5,
          alignItems: "center",
          backgroundColor: GlobalColors.lightBackground,
          borderRadius: 10,
          padding: 5,
          width: 90,
          marginLeft: 10,
        }}
      >
        <Ionicons name="time-outline" size={24} color="white" />
        <Text style={styles.title}>{title}</Text>
      </View>
    );
  }
  if (isLoading) {
    return <Loading />;
  }
  return (
    <>
      {historyTicket.length === 0 && (
        <EmptyTrip title="You don't have any reservations" message="" />
      )}
      {historyTicket.length !== 0 && (
        <View style={styles.root}>
          <SectionList
            stickySectionHeadersEnabled={true}
            sections={historyTicket}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => renderPreviousTickets(item)}
            renderSectionHeader={({ section: { title } }) =>
              renderHeaderPreviousTickets(title)
            }
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </>
  );
}

export default HistoryScreenOldTicket;
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: GlobalColors.contentBackground,
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});
