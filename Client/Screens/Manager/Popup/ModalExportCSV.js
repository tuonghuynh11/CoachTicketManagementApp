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
  Modal,
} from "react-native";
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

export default function ModalExportCSV({
  visible,
  hide,
  textHandler,
  handlerTextCapa,
}) {
  const { t } = useTranslation();
  const [flag, setFlag] = useState(0);
  const [flagCapa, setFlagCapa] = useState(0);
  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={hide}
      transparent
    >
      <Pressable style={styles.upper} onPress={hide}></Pressable>
      <View style={styles.lower}>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.title}>{t("export-csv")}</Text>
        </View>
        <Pressable
          style={styles.choose}
          onPress={() => {
            textHandler("ticket_sold_by_month"), setFlag(1);
          }}
        >
          <Text style={styles.text}>{t("statistic-ticket-sold-by-month")}</Text>
        </Pressable>
        <Pressable
          style={styles.choose}
          onPress={() => {
            textHandler("ticket_sold_by_trips"), setFlag(2);
          }}
        >
          <Text style={styles.text}>{t("statistic-ticket-sold-by-trips")}</Text>
        </Pressable>
        <Pressable
          style={styles.choose}
          onPress={() => {
            textHandler("revenue_by_years"), setFlag(0);
          }}
        >
          <Text style={styles.text}>{t("statistic-revenue-by-years")}</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  upper: {
    height: "60%",
    backgroundColor: "#DDD",
    opacity: 0.4,
  },
  lower: {
    flex: 1,
    backgroundColor: "#DDD",
    backgroundColor: "white",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 10,
    paddingBottom: 50,
  },
  choose: {
    flex: 1,
    backgroundColor: "#283663",
    marginHorizontal: 30,
    flexDirection: "row",
    borderRadius: 20,
    alignItems: "center",
    marginTop: 20,
    justifyContent: "center",
  },
  text: {
    fontWeight: "bold",
    color: "white",
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 10,
  },
  pressedButton: {
    flex: 1,
    backgroundColor: "#72C6A1",
    marginHorizontal: 30,
    flexDirection: "row",
    borderRadius: 20,
    alignItems: "center",
    marginTop: 20,
    justifyContent: "center",
  },
});
