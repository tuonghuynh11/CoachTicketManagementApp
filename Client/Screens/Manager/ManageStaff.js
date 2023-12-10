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
import StaffCard from "./StaffCard";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import ModalFilterStaff from "./Popup/ModalFilterStaff";
import { useIsFocused } from "@react-navigation/native";
import { getAllStaffs } from "../../util/staffService";

export default function ManageStaff({navigation}) {

  const openMenu = () => {
    navigation.openDrawer()
  }
  const pressAddHandler = () => {
    navigation.navigate("AddStaff");
  };

  const isFocused = useIsFocused();

  const [staffList, setStaffList] = useState([]);
  const [staffListData, setStaffListData] = useState([]);

  const fetchStaffs = async () => {
    if (isFocused) {
      try {
        setIndicator(true);
        const data = await getAllStaffs();
        setStaffList(data.data.rows);
        setStaffListData(data.data.rows);
        setIndicator(false);
      } catch (error) {
        // Handle error, e.g., redirect to login if unauthorized
        console.error("Error fetching staffs:", error);
      }
    }
  };

  useEffect(() => {
    fetchStaffs();
  }, [isFocused]);

  

  const [searchText, setSearchText] = useState("");

  const handlerFilter = (text) => {
    if(text){
      let filteredList = staffListData.filter((staff) => staff.fullName.toLowerCase().includes(text.toLowerCase()));
      setStaffList(filteredList);
    }
    else{
      setStaffList(staffListData);
    }
  }

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

  const handleSort = (type) => {
    if(type == '1'){
      let sortedList = staffListData.slice().sort((a, b) => a.fullName.toLowerCase().localeCompare(b.fullName.toLowerCase()));
      
      setStaffList(sortedList);
    }
    else if(type == '2'){
      let sortedList = staffListData.slice().sort((a, b) => b.fullName.toLowerCase().localeCompare(a.fullName.toLowerCase()));

      setStaffList(sortedList);
    }
    else if(type == '3'){
      let filteredList = staffListData.filter((staff) => staff.positionId.toLowerCase().includes('2'));
      setStaffList(filteredList);
    }
    else if(type == '4'){
      let filteredList = staffListData.filter((staff) => staff.positionId.toLowerCase().includes('3'));
      setStaffList(filteredList);
    }
    else if(type == '5'){
      let filteredList = staffListData.filter((staff) => staff.positionId.toLowerCase().includes('4'));
      setStaffList(filteredList);
    }
    else{
      setStaffList(staffListData);
    }
  }

  const [indicator, setIndicator] = useState(false);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
      <ActivityIndicator style={styles.indicator} size={"large"} animating={indicator}/>
        <ModalFilterStaff hide={hide} visible={visible} handlerSort={handleSort}/>
        <View style={styles.header}>
        <Pressable style={styles.menuIcon} onPress={openMenu}>
            <Entypo name="menu" size={30} color="#283663" />
          </Pressable>
          <Text style={styles.headerText}>List Of Staff</Text>
          <Pressable style={({ pressed }) => [
              styles.addIconStyle,
              pressed && { opacity: 0.85 },
            ]}
            onPress={pressAddHandler}>

            <AntDesign
              name="pluscircle"
              size={30}
              color="#72C6A1"
            />
          </Pressable>
        </View>
        <View style={styles.body}>
          <View style={{ flexDirection: "row" }}>
            <View style={styles.bodySearch}>
              <TextInput
                style={styles.textInputSearch}
                placeholder="Search for staff"
                placeholderTextColor="#FFFFFF"
                onChangeText={textHandler}
                value={searchText}
              ></TextInput>
              {searchText !== "" && (
                <View style={styles.iconCancel}>
                  <Pressable onPress={() => {setSearchText(""); handlerFilter("");}}>
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
              data={staffList}
              renderItem={({ item }) => (
                <Pressable onPress={() => navigation.navigate("StaffWorkingList", item)}>

                  <TouchableWithoutFeedback onPress={() => {}}>
                    <StaffCard item={item} navigation={navigation}/>
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
