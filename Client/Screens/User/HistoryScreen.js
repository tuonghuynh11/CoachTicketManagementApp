import {
  Alert,
  Button,
  Text,
  View,
  StyleSheet,
  FlatList,
  SectionList,
  Dimensions,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { useContext, useEffect, useState } from "react";
import GlobalColors from "../../Color/colors";
import { MaterialIcons } from "@expo/vector-icons";
import HistoryTicketNextTripItem from "../../Componets/UI/HistoryTicketNextTripItem";
import HistoryTicketItem from "../../Componets/UI/HistoryTicketItem";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../../Store/authContex";
import { getAllTicketsOfUser } from "../../util/databaseAPI";
import { TicketHistoryModel } from "../../Models/TicketHistoryModel";
import Loading from "../../Componets/UI/Loading";
import IconButton from "../../Componets/UI/IconButton";
import EmptyTrip from "../../Componets/UI/EmptyTrip";
import { useIsFocused } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
function HistoryScreen({ navigation }) {
  const { t } = useTranslation();
  const authCtx = useContext(AuthContext);
  const { width: screenWidth } = Dimensions.get("window");
  function calculateTimeDifference(date1, date2) {
    // Calculate the time difference in milliseconds
    const timeDifferenceMillis = date2 - date1;

    // Calculate hours, minutes, and seconds from milliseconds
    const hours = Math.floor(timeDifferenceMillis / (1000 * 60 * 60));
    const minutes = Math.floor(
      (timeDifferenceMillis % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeDifferenceMillis % (1000 * 60)) / 1000);

    // Return the time difference as an object
    if (minutes === 0) return `${hours}h`;
    return `${hours}h${minutes}m`;
  }

  const [groupCurrentTickets, setGroupCurrentTickets] = useState([]);
  const [initCurrentTickets, setInitCurrentTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortSelectedIndex, setSortSelectedIndex] = useState(0);
  const [isSortVisible, setIsSortVisible] = useState(false);
  //Sort
  const sortOptions = [
    { id: 0, value: t("earliest-departure-time") },
    { id: 1, value: t("latest-departure-time") },
    { id: 2, value: t("one-way") },
    { id: 3, value: t("two-way") },
  ];
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity
            style={{ marginRight: 10 }}
            onPress={() => setIsSortVisible((curr) => !curr)}
          >
            <MaterialIcons name="sort" size={24} color="white" />
          </TouchableOpacity>
        );
      },
    });
  }, []);
  const isFocused = useIsFocused();
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
      const temp = history.data.current.sort(
        (trip1, trip2) =>
          new Date(trip1.ScheduleData.departureTime) -
          new Date(trip2.ScheduleData.departureTime)
      );
      setGroupCurrentTickets(temp);
      setInitCurrentTickets(temp);
      setIsLoading(false);
    }
    if (isFocused) {
      getHistory();
      sortHandler(0);
    }
  }, [isFocused]);

  function nextTripHandler(ticketInfo) {
    navigation.navigate("TicketDetailScreen", {
      ticketInfo: ticketInfo,
      isHistory: false,
    });
  }
  function renderCurrentTickets(itemData) {
    return (
      <HistoryTicketNextTripItem
        ticket={itemData.item}
        // tripInfo={tripInfos[itemData.item.idTrip - 1]}
        tripInfo={itemData.item}
        onPress={nextTripHandler.bind(this, itemData.item)}
      />
    );
  }

  function Separator() {
    return (
      <View
        style={{
          width: "100%",
          height: 2,
          borderBottomColor: "black",
          borderBottomWidth: 0.3,
        }}
      ></View>
    );
  }
  function SortItem({ item, isChecked, onSelect }) {
    return (
      <Pressable
        style={({ pressed }) => [
          {
            margin: 10,
            padding: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: 10,
          },
          pressed && { opacity: 0.6 },
          isChecked && { borderWidth: 2, borderColor: GlobalColors.button },
        ]}
        onPress={onSelect}
      >
        <Text
          style={[
            { fontWeight: "bold", fontSize: 16 },
            isChecked && { fontWeight: "normal" },
          ]}
        >
          {item.value}
        </Text>
        {isChecked && (
          <Ionicons
            name="ios-checkmark"
            size={24}
            color={GlobalColors.button}
          />
        )}
      </Pressable>
    );
  }

  function sortHandler(option) {
    //0 : Price increase
    //1: Earliest Departure Time

    //2: Latest Departure Time
    //3 : Price decrease
    switch (option) {
      case 0:
        setGroupCurrentTickets((curr) =>
          initCurrentTickets.sort(
            (trip1, trip2) =>
              new Date(trip1.ScheduleData.departureTime) -
              new Date(trip2.ScheduleData.departureTime)
          )
        );

        break;
      case 1:
        setGroupCurrentTickets((curr) =>
          initCurrentTickets.sort(
            (trip1, trip2) =>
              new Date(trip2.ScheduleData.departureTime) -
              new Date(trip1.ScheduleData.departureTime)
          )
        );
        break;
      case 2:
        setGroupCurrentTickets((curr) =>
          // initCurrentTickets.filter((trip) => !trip.isRoundTrip)
          initCurrentTickets.filter(
            (trip) => trip?.RoundTripTicketData?.length === 0
          )
        );
        break;
      case 3:
        setGroupCurrentTickets((curr) =>
          initCurrentTickets.filter(
            (trip) => trip?.RoundTripTicketData?.length !== 0
          )
        );
        break;

      default:
        break;
    }
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      {groupCurrentTickets.length === 0 && (
        <EmptyTrip title={t("not-have-any-reservations")} message="" />
      )}
      <Modal
        visible={isSortVisible}
        backdropOpacity={0.7}
        transparent={true}
        animationType="slide"
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "flex-end",
            backgroundColor: "'rgba(0,0,0,0.5)'",
            borderRadius: 30,
            width: 350,
            zIndex: 1,
            width: "100%",
            flex: 1,
          }}
        >
          <View
            style={{
              width: "100%",
              backgroundColor: "white",
              paddingVertical: 20,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
          >
            <View
              style={{
                alignItems: "center",
                width: "100%",
                justifyContent: "space-between",
                borderBottomColor: "black",
                borderBottomWidth: 0.3,
                paddingBottom: 10,
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                {t("sort-by")}
              </Text>
              <TouchableOpacity
                style={{
                  alignSelf: "flex-end",
                  marginTop: -30,
                  marginRight: 10,
                }}
                onPress={() => setIsSortVisible((curr) => !curr)}
              >
                <Ionicons name="close-circle-outline" size={30} color="black" />
              </TouchableOpacity>
            </View>
            <SortItem
              item={sortOptions[0]}
              isChecked={sortSelectedIndex === 0}
              onSelect={() => {
                setSortSelectedIndex(0);
                setIsSortVisible((curr) => !curr);
                sortHandler(0);
              }}
            />
            <Separator />
            <SortItem
              item={sortOptions[1]}
              isChecked={sortSelectedIndex === 1}
              onSelect={() => {
                setSortSelectedIndex(1);
                setIsSortVisible((curr) => !curr);
                sortHandler(1);
              }}
            />
            <Separator />
            <SortItem
              item={sortOptions[2]}
              isChecked={sortSelectedIndex === 2}
              onSelect={() => {
                setSortSelectedIndex(2);
                setIsSortVisible((curr) => !curr);
                sortHandler(2);
              }}
            />
            <Separator />
            <SortItem
              item={sortOptions[3]}
              isChecked={sortSelectedIndex === 3}
              onSelect={() => {
                setSortSelectedIndex(3);
                setIsSortVisible((curr) => !curr);
                sortHandler(3);
              }}
            />
          </View>
        </View>
      </Modal>
      {groupCurrentTickets.length !== 0 && (
        <View style={styles.root}>
          {groupCurrentTickets.length > 0 && (
            <FlatList
              // pagingEnabled
              keyExtractor={(item, index) => index}
              data={groupCurrentTickets}
              renderItem={renderCurrentTickets}
              showsHorizontalScrollIndicator={false}
              // snapToInterval={screenWidth + 10}
              // decelerationRate="fast"
            />
          )}
        </View>
      )}
    </>
  );
}

export default HistoryScreen;
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: GlobalColors.contentBackground,
    paddingBottom: 95,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});
