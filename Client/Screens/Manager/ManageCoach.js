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
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import CoachCard from "./CoachCard";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { getAllCoaches } from "../../util/coachService";
import { useIsFocused } from "@react-navigation/native";
import ModalSuccess from "./Popup/ModalSuccess";
import ModalFail from "./Popup/ModalFail";
import ModalConfirm from "./Popup/ModalConfirm";
import ModalFilter from "./Popup/ModalFilter";

export default function ManageCoach({ navigation }) {
  const pressHandler = (item) => {
    navigation.navigate("Tracking", item);
  };
  const pressAddHandler = () => {
    navigation.navigate("AddCoach");
  };

  const [coachList, setCoachList] = useState([]);
  const [coachListData, setCoachListData] = useState([]);

  const isFocused = useIsFocused();

  const fetchCoaches = async () => {
    if (isFocused) {
      try {
        setIndicator(true);
        const data = await getAllCoaches();
        setCoachList(data.data.rows);
        setCoachListData(data.data.rows);
        setIndicator(false);
      } catch (error) {
        // Handle error, e.g., redirect to login if unauthorized
        console.error("Error fetching coaches:", error);
      }
    }
  };

  useEffect(() => {
    fetchCoaches();
  }, [isFocused]);

  const handlerFilter = (text) => {
    if (text) {
      let filteredList = coachListData.filter((coach) =>
        coach.coachNumber.toLowerCase().includes(text.toLowerCase())
      );

      setCoachList(filteredList);
    } else {
      setCoachList(coachListData);
    }
  };

  const handlerText = (text) => {
    if (text) {
      let filteredList = coachListData.filter((coach) =>
        coach.CoachTypeData.typeName.toLowerCase().includes(text.toLowerCase())
      );

      setCoachList(filteredList);
    } else {
      setCoachList(coachListData);
    }
  };

  const handlerTextCapa = (text) => {
    if (text) {
      let filteredList = coachListData.filter((coach) =>
        coach.capacity.toLowerCase().includes(text.toLowerCase())
      );

      setCoachList(filteredList);
    } else {
      setCoachList(coachListData);
    }
  };

  const [searchText, setSearchText] = useState("");

  const textHandler = (val) => {
    setSearchText(val);
    handlerFilter(val);
  };

  const openMenu = () => {
    navigation.openDrawer();
  };

  const content = "content";

  const [visible, setVisible] = useState(false);
  const show = () => {
    setVisible(true);
  };
  const hide = () => {
    setVisible(false);
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

  const contentSuccess = "Delete coach successfully!";
  const contentFail = "Delete coach Fail!";
  const [indicator, setIndicator] = useState(false);
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
      <ActivityIndicator style={styles.indicator} size={"large"} animating={indicator}/>
        <ModalSuccess
          visible={visibleSuccess}
          hide={hideSuccess}
          content={contentSuccess}
        />
        <ModalFail
          visible={visibleFail}
          hide={hideFail}
          content={contentFail}
        />
        <View style={styles.header}>
          <Pressable
            style={({ pressed }) => [
              styles.menuIcon,
              pressed && { opacity: 0.85 },
            ]}
            onPress={openMenu}
          >
            <Entypo name="menu" size={30} color="#283663" />
          </Pressable>

          <Text style={styles.headerText}>List Of Coaches</Text>
          <Pressable
            style={({ pressed }) => [
              styles.addIconStyle,
              pressed && { opacity: 0.85 },
            ]}
            onPress={pressAddHandler}
          >
            <AntDesign name="pluscircle" size={30} color="#72C6A1" />
          </Pressable>
        </View>
        <View style={styles.body}>
          <View style={{ flexDirection: "row" }}>
            <View style={styles.bodySearch}>
              <TextInput
                style={styles.textInputSearch}
                placeholder="Search for coach"
                placeholderTextColor="#FFFFFF"
                onChangeText={textHandler}
                value={searchText}
              ></TextInput>
              {searchText !== "" && (
                <View style={styles.iconCancel}>
                  <Pressable
                    onPress={() => {
                      setSearchText("");
                      handlerFilter("");
                    }}
                  >
                    <MaterialIcons name="cancel" size={30} color="white" />
                  </Pressable>
                </View>
              )}
            </View>
            <View style={styles.filter}>
              {/**filter */}
              <Pressable onPress={show}>
                <Ionicons name="md-filter" size={30} color="black" />
              </Pressable>
            </View>
          </View>
          <ModalFilter
            hide={hide}
            visible={visible}
            textHandler={handlerText}
            handlerTextCapa={handlerTextCapa}
          />
          <View style={styles.bodyList}>
            <FlatList
              data={coachList}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => navigation.navigate("Tracking", item)}
                >
                  <TouchableWithoutFeedback onPress={() => {}}>
                    <CoachCard
                      item={item}
                      navigation={navigation}
                      fecth={fetchCoaches}
                      showFail={showFail}
                      showSuccess={showSuccess}
                    />
                  </TouchableWithoutFeedback>
                </Pressable>
              )}
              keyExtractor={(item) => item.id}
            />
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 55,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  menuIcon: {
    position: "absolute",
    left: 16,
  },
  headerText: {
    fontSize: 23,
    color: "#283663",
  },
  addIconStyle: {
    position: "absolute",
    right: 16,
  },
  body: {
    flex: 1,
  },
  bodySearch: {
    flex: 8,
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  textInputSearch: {
    backgroundColor: "#283663",
    flex: 1,
    paddingLeft: 20,
    paddingRight: 40,
    paddingVertical: 8,
    borderRadius: 10,
    height: 54,
    color: "white",
  },
  iconCancel: {
    position: "absolute",
    top: 28,
    right: 20,
  },
  bodyList: {
    flex: 1,
  },
  filter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingEnd: 6,
  },
  indicator: {
    position: "absolute",
    zIndex: 1000,
    right: '46%',
    top: "50%"
  }
});
