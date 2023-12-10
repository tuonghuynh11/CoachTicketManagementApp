import { TextInput, View, StyleSheet, Alert, Keyboard } from "react-native";
import GlobalColors from "../../Color/colors";
import { Ionicons } from "@expo/vector-icons";
import IconButton from "./IconButton";
import { useEffect, useState } from "react";
import { Pressable } from "react-native";
function SearchBox({ searchFunc, initValue = "", onChangeTextFunc }) {
  const [textInput, setTextInput] = useState(initValue);
  useEffect(() => {
    setTextInput(initValue);
  }, [initValue]);
  function onTextHandler(enteredText) {
    onChangeTextFunc(enteredText);
    setTextInput(enteredText);
  }

  function searchHandler() {
    searchFunc(textInput);
    // if (textInput.trim() === "") {
    //   Alert.alert("Warning", "You need to enter a movie name");
    //   return;
    // }
    // try {
    //   Keyboard.dismiss();
    //   await searchMovies(textInput)
    //     .then((response) => {
    //       searchFunc(response, textInput);
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // } catch (error) {
    //   console.log(error);
    // }
  }
  return (
    <View style={styles.container}>
      <View style={styles.searchIcon}>
        <IconButton
          icon={"search-outline"}
          size={20}
          color={GlobalColors.icon_non_active}
          onPress={searchHandler}
        />
      </View>
      <TextInput
        style={styles.searchBox}
        placeholder="Enter an movie name"
        keyboardType="default"
        placeholderTextColor="#c8c0c0"
        onChangeText={onTextHandler}
        value={textInput}
        onSubmitEditing={searchHandler}
      />
    </View>
  );
}

export default SearchBox;
const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  searchBox: {
    fontSize: 16,
    color: "black",
    marginRight: 5,
    width: "90%",
    fontWeight: "normal",
    paddingBottom: 10,
  },
  searchIcon: {
    marginRight: 5,
    marginTop: -8,
    zIndex: 10,
  },
  button: {
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  pressed: {
    opacity: 0.7,
  },
});
