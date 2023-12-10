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
import RouteCard from "./RouteCard";
import { getAllRoutes } from "../../util/routeService";
import { useIsFocused } from "@react-navigation/native";

export default function ManageRoute({navigation}) {
  const pressAddHandler = () => {
    navigation.navigate("AddRoute");
  };
  const openMenu = () => {
    navigation.openDrawer();
  };


  const routes = [
    { id: "1", departure: "HCM", arrival: "AG", name: "route1" },
    { id: "2", departure: "HCM", arrival: "LA", name: "route2" },
    { id: "3", departure: "HCM", arrival: "TG", name: "route3" },
    { id: "4", departure: "HCm", arrival: "DT", name: "route4" },
    { id: "5", departure: "HCM", arrival: "VL", name: "route5" },
  ];
  const [routeList, setRouteList] = useState([]);
  const [routeListData, setRouteListData] = useState([]);

  const isFocused = useIsFocused();
  const fetchRoutes = async () => {
    if (isFocused) {

      try {
        setIndicator(true)
        const data = await getAllRoutes();
        setRouteList(data.data.rows);
        setRouteListData(data.data.rows);
        setIndicator(false);
      } catch (error) {
        // Handle error, e.g., redirect to login if unauthorized
        console.error("Error fetching routes:", error);
        
      }
    }
  };

  useEffect(() => {
    

    fetchRoutes();
  }, [isFocused]);

  const deleteHandler = (idroute) => {
    
    const updatedItems = routeListData.filter(item => item.id !== idroute);
    setRouteList(updatedItems);
    setRouteListData(updatedItems);
  }

  const handlerFilter = (text) => {
    if(text){
      let filteredList = routeListData.filter((route) => route.routeName.toLowerCase().includes(text.toLowerCase()));

      setRouteList(filteredList);
    }
    else{
      setRouteList(routeListData);
    }
  }

  const [searchText, setSearchText] = useState("");

  const textHandler = (val) => {
    setSearchText(val);
    handlerFilter(val);
  };
  const [indicator, setIndicator] = useState(false);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
      <ActivityIndicator style={styles.indicator} size={"large"} animating={indicator}/>
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

          <Text style={styles.headerText}>List Of Routes</Text>
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
                placeholder="Search for route"
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
              {/* <Pressable>
                <Ionicons name="md-filter" size={30} color="black" />
              </Pressable> */}
            </View>
          </View>

          <View style={styles.bodyList}>
            <FlatList
              data={routeList}
              renderItem={({ item }) => (
                <Pressable onPress={() => navigation.navigate("ManageSchedule", item)}>

                  <TouchableWithoutFeedback onPress={() => {}}>
                    <RouteCard item={item} navigation={navigation} deleteHandler={deleteHandler}/>
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
    // flex: 1,
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
