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
import React, { useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import TicketCurrentList from "./TicketCurrentList";
import TicketHistoryList from "./TicketHistoryList";
import { useIsFocused } from "@react-navigation/native";

const Tab = createMaterialTopTabNavigator();

function Tab1() {
  return <Text>tab1</Text>;
}
function Tab2() {
  return <Text>tab2</Text>;
}

function MyTabs({ id }) {
  return (
    <Tab.Navigator
      initialRouteName="Current"
      screenOptions={{
        tabBarStyle: { backgroundColor: "#72C6A1" },
        tabBarLabelStyle: { fontSize: 16 },
        tabBarPressColor: "#60ad8c",
        tabBarActiveTintColor: "#283663",
        tabBarIndicatorStyle: {
          backgroundColor: "#283663",
          height: 2,
        },
        swipeEnabled: false,
      }}
    >
      <Tab.Screen
        name="Current"
        component={TicketCurrentList}
        options={{ tabBarLabel: "Current" }}
        initialParams={{ id }}
      />
      <Tab.Screen
        name="History"
        component={TicketHistoryList}
        options={{ tabBarLabel: "History" }}
        initialParams={{ id }}
      />
    </Tab.Navigator>
  );
}

export default function TicketConfirmList({ route, navigation }) {
  const pressHandler = () => {
    navigation.goBack();
  };

  const { id } = route.params;

  // const [ticketList, setTicketList] = useState([]);
  // const [userListData, setUserListData] = useState([]);

  // const isFocused = useIsFocused();

  // const fetchUsers = async () => {
  //   if (isFocused) {
  //     try {
  //       const data = await getAllUsers();
  //       setUserList(data.data);
  //       setUserListData(data.data);
  //     } catch (error) {
  //       // Handle error, e.g., redirect to login if unauthorized
  //       console.error("Error fetching users:", error);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   fetchUsers();
  // }, [isFocused]);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable
            style={({ pressed }) => [
              styles.backIcon,
              pressed && { opacity: 0.85 },
            ]}
            onPress={pressHandler}
          >
            <Ionicons
              name="ios-arrow-back-circle-sharp"
              size={38}
              color="#283663"
            />
          </Pressable>
          <Text style={styles.headerText}>List Of Tickets</Text>
        </View>
        <View style={styles.body}>
          <MyTabs id={id} />
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
    marginBottom: 5,
  },
  backIcon: {
    position: "absolute",
    left: 16,
  },
  headerText: {
    fontSize: 23,
    color: "#283663",
  },
  body: {
    flex: 1,
  },
});
