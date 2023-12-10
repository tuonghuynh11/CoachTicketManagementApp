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
import PlaceCard from "./PlaceCard";

export default function EditShuttle({navigation}) {
  const pressHandler = () => {
    navigation.goBack();
  }
  const [validateShuttle, setValidateShuttle] = useState(true);
  const [Shuttle, setShuttle] = useState("");
  const ShuttleHandler = (val) => {
    setShuttle(val);
    setValidateShuttle(true);
  };
  const addShuttleHandler = () => {
    if (DeparturePlace == "") {
      setValidateShuttle(false);
    } else {
      setValidateShuttle(true);
    }
  };

  const places = [
    {id: 1, placeName:'abcd'},
    {id: 2, placeName:'abcd'},
    {id: 3, placeName:'abcd'},
    {id: 4, placeName:'abcd'},
    {id: 5, placeName:'abcd'},
  ];

  const [shuttlePlace, setShuttlePlace] = useState(places);

  const saveHadler = () => {};
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
          <Text style={styles.headerText}>Edit Shuttle</Text>
          <Pressable
            style={({ pressed }) => [
              styles.resetIconStyle,
              pressed && { opacity: 0.85 },
            ]}
            onPress={reloadHandler}
          >
            <Ionicons name="reload-circle" size={38} color="#EB3223" />
          </Pressable>
        </View>
        <ScrollView
          style={styles.body}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.infoContainer}>
            <Text style={styles.text}>Route Name:</Text>
            <Text style={styles.text}>Departure:</Text>
            <Text style={styles.text}>Destination: </Text>
            <Text style={styles.text}>Distance: </Text>
            <Text style={styles.text}>Duration:</Text>
          </View>
          <Text style={styles.titleText}>Shuttle Places</Text>
          <View>
            {/* 2 textinput, row flatlist */}
            <Text style={styles.textLabel}>Shuttle Place</Text>
            <TextInput
              style={
                validateShuttle == true
                  ? styles.textInput
                  : styles.textInputWrong
              }
              placeholder="Enter Service Name"
              value={Shuttle}
              onChangeText={ShuttleHandler}
            ></TextInput>
            {!validateShuttle && (
              <Text style={styles.validateText}>This field can't be empty</Text>
            )}
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.addButton,
              pressed && { opacity: 0.85 },
            ]}
            onPress={addShuttleHandler}
          >
            <Text style={styles.addText}>Add Service</Text>
          </Pressable>
          <View style={styles.listPlaces}>
            <FlatList
              showsHorizontalScrollIndicator={false}
              nestedScrollEnabled={true}
              horizontal={true}
              data={shuttlePlace}
              renderItem={({ item }) => <PlaceCard item={item}/>}
              keyExtractor={(item) => item.id}
            />
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.saveButton,
              pressed && { opacity: 0.85 },
            ]}
            onPress={saveHadler}
          >
            <Text style={styles.saveText}>SAVE</Text>
          </Pressable>
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
  resetIconStyle: {
    position: "absolute",
    right: 16,
  },
  body: {
    flex: 1,
  },
  text: {
    marginLeft: 20,
    color: "#FFFFFF",
    marginVertical: 10,
    fontSize: 18,
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
  routeImage: {
    width: 100,
    height: 120,
  },
  editIcon: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  titleText: {
    color: "#283663",
    fontSize: 20,
    marginLeft: 10,
    marginBottom: 5,
    marginTop: 10,
  },
  textInput: {
    backgroundColor: "white",
    fontSize: 16,
    marginEnd: 20,
    marginStart: 20,
    height: 50,
    paddingLeft: 20,
    paddingRight: 40,
    borderRadius: 10,
    borderColor: "#283663",
    borderWidth: 1,
    color: "#283663",
  },
  textInputWrong: {
    backgroundColor: "white",
    fontSize: 16,
    marginEnd: 20,
    marginStart: 20,
    height: 50,
    paddingLeft: 20,
    paddingRight: 40,
    borderRadius: 10,
    borderColor: "#EB3223",
    borderWidth: 1,
    color: "#283663",
  },
  textLabel: {
    color: "#283663",
    marginLeft: 34,
    marginBottom: 5,
    marginTop: 10,
  },
  addButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#72C6A1",
    marginHorizontal: "30%",
    height: 50,
    marginBottom: 10,
    borderRadius: 20,
    marginTop: 20,
  },
  addText: {
    fontSize: 16,
    color: "white",
  },
  listPlaces: {
    marginHorizontal: 20,
    marginVertical: 10,
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 10,
    height: 120,
    paddingTop: 18,
    borderColor: "#283663",
    borderWidth: 1,
  },
  saveButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#283663",
    marginHorizontal: "10%",
    height: 50,
    marginBottom: 10,
    borderRadius: 20,
  },
  saveText: {
    fontSize: 16,
    color: "white",
  },
  validateText: {
    color: "#EB3223",
    marginLeft: 40,
  },
});
