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
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import CoachCard from "./CoachCard";
import ModalRoute from "./ModalRoute";

export default function RouteDetail({navigation}) {
  const pressHandler = () => {
    navigation.goBack();
  }
  const coaches = [
    { id: "1", coachNum: "1234", coachType: "VIP", status: false },
    { id: "2", coachNum: "1232", coachType: "VIP", status: false },
    { id: "3", coachNum: "5435", coachType: "VIP", status: true },
    { id: "4", coachNum: "1567", coachType: "VIP", status: false },
    { id: "5", coachNum: "2354", coachType: "VIP", status: true },
  ];

  const [coachList, setCoachList] = useState(coaches);

  const [visible, setVisible] = useState(false);
  const show = () => {
    setVisible(true);
  };
  const hide = () => {
    setVisible(false);
  };

  const settingHadler = () => {
    show();
  }

  const navigateScreen = 'EditRoute'
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
          <Text style={styles.headerText}>Detail Route</Text>
          <Pressable style={({ pressed }) => [
              styles.settingIconStyle,
              pressed && { opacity: 0.85 },
            ]} onPress={settingHadler}> 

            <Ionicons
              name="settings"
              size={32}
              color="#283663"
              
            />
          </Pressable>
        </View>
        <ModalRoute visible={visible} hide={hide} navigation={navigation} navigateScreen={navigateScreen} />
        <ScrollView
          style={styles.body}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          decelerationRate={"fast"}
        >
          <View style={styles.infoContainer}>
            <Text style={styles.text}>Route Name:</Text>
            <Text style={styles.text}>Departure:</Text>
            <Text style={styles.text}>Destination: </Text>
            <Text style={styles.text}>Distance: </Text>
            <Text style={styles.text}>Duration:</Text>
          </View>
          <View>
            <Text style={styles.title}>Bus on going</Text>
          </View>
          <FlatList
            scrollEnabled={false}
            data={coachList}
            renderItem={({ item }) => <CoachCard item={item} navigation={navigation}/>}
            keyExtractor={(item) => item.id}
          />
          <View>
            <Text style={styles.title}>Route</Text>
          </View>
          <View style={styles.imageContainer}>
            <Image
              style={styles.coachImage}
              source={{
                uri: "https://images.unsplash.com/photo-1494783367193-149034c05e8f?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cm91dGV8ZW58MHx8MHx8fDA%3D",
              }}
            />
          </View>
        </ScrollView>
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
  settingIconStyle: {
    position: "absolute",
    right: 16,
  },
  body: {
    flex: 1,
  },
  infoContainer: {
    borderRadius: 10,
    elevation: 3,
    backgroundColor: "#283663",
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  text: {
    marginLeft: 20,
    color: "#FFFFFF",
    marginVertical: 10,
    fontSize: 18,
  },
  title: {
    fontSize: 20,
    color: "#283663",
    marginLeft: 10,
    marginVertical: 5,
  },
  imageContainer: {
    borderRadius: 10,
    marginHorizontal: 10,
    height: 200,
    marginBottom: 20,
    overflow: "hidden",
  },
  coachImage: {
    width: "100%",
    height: "100%",
  },
  titleContainer: {
    flexDirection: "row",
  },
  addIconStyle : {
    marginLeft: 20,
    marginTop: 5
  }
});
