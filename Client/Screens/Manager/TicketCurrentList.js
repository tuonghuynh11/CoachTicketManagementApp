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
  Modal,
  ActivityIndicator
} from "react-native";
import React, { useState, useEffect } from "react";
import TicketCard from "./TicketCard";
import { useRoute } from '@react-navigation/native';
import { useIsFocused } from "@react-navigation/native";
import { getAllUserTickets } from "../../util/userTicketService";
import ModalSuccess from "./Popup/ModalSuccess";
import ModalFail from "./Popup/ModalFail";
import ModalConfirm from "./Popup/ModalConfirm";

export default function TicketCurrentList() {
  const route = useRoute();
  const itemFromParent = route.params?.id;
  //console.log(itemFromParent);

  const [currentTicketList, setCurrentTicketList] = useState([]);
  const [ticketListData, setTicketListData] = useState([]);

  const [visibleC, setVisibleC] = useState(false);
  const showC = () => {
    setVisibleC(true);
  };
  const hideC = () => {
    setVisibleC(false);
  };

  const [visibleSuccess, setVisibleSuccess] = useState(false);
  const showSuccess = () => {
    setVisibleSuccess(true);
  };
  const hideSuccess = () => {
    setVisibleSuccess(false);
  };

  const [visibleFail, setVisibleFail] = useState(false);
  const showFail = () => {
    setVisibleFail(true);
  };
  const hideFail = () => {
    setVisibleFail(false);
  };

  const contentS = "Success!";
  const contentF = "Fail!";

  const isFocused = useIsFocused();

  const fetchTickets = async () => {
    if (isFocused) {
      try {
        setIndicator(true);
        const data = await getAllUserTickets(itemFromParent);
        setCurrentTicketList(data.data.current);
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
        <ModalSuccess visible={visibleSuccess} hide={hideSuccess} content={contentS}/>
        <ModalFail visible={visibleFail} hide={hideFail} content={contentF} />
        <ModalConfirm visible={visibleC} hide={hideC} />
        <FlatList
          data={currentTicketList}
          renderItem={({ item }) => (
            <TouchableWithoutFeedback onPress={() => {}}>
              <TicketCard item={item} fecth={fetchTickets} showSuccess={showSuccess} showFail={showFail} />
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
