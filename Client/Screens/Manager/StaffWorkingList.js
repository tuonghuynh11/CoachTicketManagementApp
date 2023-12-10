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
  ActivityIndicator
} from "react-native";
import React, { useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import StaffCurrentList from "./StaffCurrentList";
import StaffHistorytList from "./StaffHistoryList";
import StaffWorkingCard from "./StaffWorkingCard";
import { getAllStaffsWorking } from "../../util/staffService";
import { useIsFocused } from "@react-navigation/native";

const Tab = createMaterialTopTabNavigator();

function Tab1() {
  return <Text>tab1</Text>;
}
function Tab2() {
  return <Text>tab2</Text>;
}

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Working"
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
        name="Working"
        component={StaffCurrentList}
        options={{ tabBarLabel: "Working" }}
      />
      <Tab.Screen
        name="History"
        component={StaffHistorytList}
        options={{ tabBarLabel: "History" }}
      />
    </Tab.Navigator>
  );
}

export default function StaffWorkingList({ navigation, route }) {
  const pressHandler = () => {
    navigation.goBack();
  };

  const {id} = route.params;

  const isFocused = useIsFocused();

  const [workingList, setWorkingList] = useState([]);
  const [workingListData, setWorkingListData] = useState([]);

  const fetchStaffsWorking = async () => {
    if (isFocused) {
      try {
        setIndicator(true);
        const data = await getAllStaffsWorking();
        const current = data.data.filter(item => item.staff == id)[0].currentTrips;
        const history = data.data.filter(item => item.staff == id)[0].historyTrips;
        setWorkingList(curr => [...current, ...history]);
        setIndicator(false);
      } catch (error) {
        // Handle error, e.g., redirect to login if unauthorized
        console.error("Error fetching staffs:", error);
      }
    }
  };

  useEffect(() => {
    fetchStaffsWorking();
  }, [isFocused]);

  //console.log(workingList);

  const [indicator, setIndicator] = useState(false);

  const [staffWorkingList, setStaffWorkingtList] = useState([]);
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
      <ActivityIndicator style={styles.indicator} size={"large"} animating={indicator}/>
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
          <Text style={styles.headerText}>Working Information</Text>
        </View>
        <View style={styles.body}>
          {/* <MyTabs /> */}
          <FlatList
            data={workingList}
            renderItem={({ item }) => (
              <TouchableWithoutFeedback onPress={() => {}}>
                <Pressable onPress={() => navigation.navigate('TripInformation', item)}>

                  <StaffWorkingCard item={item} />  
                </Pressable>
              </TouchableWithoutFeedback>
            )}
            keyExtractor={(item) => item.id}
          />
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
  indicator: {
    position: "absolute",
    zIndex: 1000,
    right: '46%',
    top: "50%"
  }
});
