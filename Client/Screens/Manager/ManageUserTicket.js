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
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import UserCard from "./UserCard";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { getAllUsers } from "../../util/userService";
import { useIsFocused } from "@react-navigation/native";
import ModalFilterUser from "./Popup/ModalFilterUser";
import i18next from "../../Services/i18next";
import { useTranslation } from "react-i18next";

export default function ManageUserTicket({ navigation }) {
  const { t } = useTranslation();

  const openMenu = () => {
    navigation.openDrawer();
  };

  const users = [
    {
      id: "1",
      name: "Alan",
      phone: "092323232323",
      email: "abc@gmail.com",
      status: "Working",
      idTicket: "12345",
    },
    {
      id: "2",
      name: "John",
      phone: "092323232323",
      email: "abc@gmail.com",
      status: "Available",
      idTicket: "12345",
    },
    {
      id: "3",
      name: "Josh",
      phone: "092323232323",
      email: "abc@gmail.com",
      status: "Working",
      idTicket: "12345",
    },
    {
      id: "4",
      name: "James",
      phone: "092323232323",
      email: "abc@gmail.com",
      status: "Working",
      idTicket: "12345",
    },
    {
      id: "5",
      name: "Kevin",
      phone: "092323232323",
      email: "abc@gmail.com",
      status: "Available",
      idTicket: "12345",
    },
  ];

  const [userList, setUserList] = useState([]);
  const [userListData, setUserListData] = useState([]);

  const isFocused = useIsFocused();

  const fetchUsers = async () => {
    if (isFocused) {
      try {
        setIndicator(true);
        const data = await getAllUsers();
        setUserList(data.data);
        setUserListData(data.data);
        setIndicator(false);
      } catch (error) {
        // Handle error, e.g., redirect to login if unauthorized
        console.error("Error fetching users:", error.response.data);
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [isFocused]);

  const [searchText, setSearchText] = useState("");

  const handlerFilter = (text) => {
    if (text) {
      let filteredList = userListData.filter((user) =>
        user.fullName.toLowerCase().includes(text.toLowerCase())
      );

      setUserList(filteredList);
    } else {
      setUserList(userListData);
    }
  };

  const textHandler = (val) => {
    setSearchText(val);
    handlerFilter(val);
  };

  const [visible, setVisible] = useState(false);
  const show = () => {
    setVisible(true);
  };
  const hide = () => {
    setVisible(false);
  };

  const hadlerSort = (type) => {
    if (type == "1") {
      let sortedList = userListData
        .slice()
        .sort((a, b) =>
          a.fullName.toLowerCase().localeCompare(b.fullName.toLowerCase())
        );

      setUserList(sortedList);
    } else if (type == "2") {
      let sortedList = userListData
        .slice()
        .sort((a, b) =>
          b.fullName.toLowerCase().localeCompare(a.fullName.toLowerCase())
        );

      setUserList(sortedList);
    } else {
      setUserList(userListData);
    }
  };

  const handlerSortPoint = (type) => {
    if (type == "1") {
      let sortedList = userListData
        .slice()
        .sort(
          (a, b) =>
            a.UserAccountData.rewardPoint - b.UserAccountData.rewardPoint
        );

      setUserList(sortedList);
    } else if (type == "2") {
      let sortedList = userListData
        .slice()
        .sort(
          (a, b) =>
            b.UserAccountData.rewardPoint - a.UserAccountData.rewardPoint
        );

      setUserList(sortedList);
    } else {
      setUserList(userListData);
    }
  };

  const [indicator, setIndicator] = useState(false);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <ActivityIndicator
          style={styles.indicator}
          size={"large"}
          animating={indicator}
        />
        <ModalFilterUser
          hide={hide}
          visible={visible}
          handlerSort={hadlerSort}
          handlerSortPoint={handlerSortPoint}
        />
        <View style={styles.header}>
          <Pressable style={styles.menuIcon} onPress={openMenu}>
            <Entypo name="menu" size={30} color="#283663" />
          </Pressable>
          <Text style={styles.headerText}>{t("list-user")}</Text>
        </View>
        <View style={styles.body}>
          <View style={{ flexDirection: "row" }}>
            <View style={styles.bodySearch}>
              <TextInput
                style={styles.textInputSearch}
                placeholder={t("search-for-user")}
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

          <View style={styles.bodyList}>
            <FlatList
              data={userList}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => navigation.navigate("TicketConfirmList", item)}
                >
                  <TouchableWithoutFeedback onPress={() => {}}>
                    <UserCard item={item} navigation={navigation} />
                  </TouchableWithoutFeedback>
                </Pressable>
              )}
              keyExtractor={(item) => item.userId}
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
    right: "46%",
    top: "50%",
  },
});
