import React, { useEffect, useState } from "react";

import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

const CustomSwitch = ({
  navigation,
  selectionMode,
  roundCorner,
  option1,
  option2,
  onSelectSwitch,
  selectionColor,
  defaultSelectionIndex = 1,
}) => {
  const [getSelectionMode, setSelectionMode] = useState(selectionMode);
  const [getRoundCorner, setRoundCorner] = useState(roundCorner);

  useEffect(() => {
    updatedSwitchData(defaultSelectionIndex);
  }, []);
  const updatedSwitchData = (val) => {
    setSelectionMode(val);
    onSelectSwitch(val);
  };

  return (
    <View>
      <View
        style={{
          height: 34,
          width: 70,
          backgroundColor: "#626060",
          borderRadius: roundCorner ? 25 : 0,
          //   borderWidth: 1,
          borderColor: selectionColor,
          flexDirection: "row",
          justifyContent: "center",
          padding: 2,
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => updatedSwitchData(1)}
          style={{
            width: 25,
            height: 25,

            backgroundColor:
              getSelectionMode == 1 ? selectionColor : "transparent",
            borderRadius: roundCorner ? 25 : 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "700",
              color: getSelectionMode == 1 ? "#626060" : "white",
            }}
          >
            {option1}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          TouchableOpacity
          activeOpacity={1}
          onPress={() => updatedSwitchData(2)}
          style={{
            width: 25,
            height: 25,
            backgroundColor: getSelectionMode == 2 ? selectionColor : "#626060",
            borderRadius: roundCorner ? 30 : 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "700",
              color: getSelectionMode == 2 ? "#626060" : "white",
            }}
          >
            {option2}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default CustomSwitch;
