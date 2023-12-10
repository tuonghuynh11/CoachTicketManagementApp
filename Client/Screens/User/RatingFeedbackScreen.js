import { useEffect } from "react";
import { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Keyboard,
} from "react-native";
import { Rating, AirbnbRating } from "react-native-ratings";
import { SelectList } from "react-native-dropdown-select-list";

import Modal from "react-native-modal";
import IconButton from "../../Componets/UI/IconButton";
import GlobalColors from "../../Color/colors";
import { TouchableWithoutFeedback } from "react-native";
import { Alert } from "react-native";
import { sendRatingEmail } from "../../util/apiServices";
function RatingFeedbackScreen({
  isVisible,
  isRating,
  onSubmit,
  onCancel,
  image,
  coachMember,
  idTrip,
  coachNumber,
  userName,
}) {
  const [ratingValue, setRatingValue] = useState(3);
  const [content, setContent] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);
  const [reportMember, setReportMember] = useState("");
  const listOfMember = isRating
    ? [
        {
          key: coachMember.assistant.id,
          value: `Assistant: ${coachMember.assistant.fullName}`,
        },
        {
          key: coachMember.driver.id,
          value: `Driver: ${coachMember.driver.fullName}`,
        },
        {
          key: idTrip + "Trip",
          value: `Coach: ${coachNumber}`,
        },
      ]
    : [
        {
          key: coachMember.assistant.id,
          value: `Assistant: ${coachMember.assistant.fullName}`,
        },
        {
          key: coachMember.driver.id,
          value: `Driver: ${coachMember.driver.fullName}`,
        },
      ];

  async function submitHandler() {
    // onSubmit(ratingValue, content);
    console.log(ratingValue, content, reportMember);
    if (!content || content === "") {
      setIsInvalid((curr) => !curr);
      return;
    }
    if (isRating) {
      //code submit rating with API
      const ratingObject = reportMember.includes("Trip")
        ? listOfMember[2]
        : coachMember.assistant.id === reportMember
        ? coachMember.assistant
        : coachMember.driver;
      const typeOfRating = reportMember.includes("Trip")
        ? "Coach Quality"
        : "Staff Attitude";
      try {
        await sendRatingEmail(
          `${userName}@gmail.com`,
          content,
          userName,
          typeOfRating
        );
        Alert.alert("Success", "Send rating successfully");
      } catch (error) {
        Alert.alert(error);
      } finally {
        if (isInvalid === true) {
          setIsInvalid((curr) => !curr);
        }
      }
    } else {
      //code submit report with API
      const reportPerson =
        coachMember.assistant.id === reportMember
          ? coachMember.assistant
          : coachMember.driver;
      try {
        await sendRatingEmail(
          `${userName}@gmail.com`,
          content,
          userName,
          "Staff Attitude"
        );
        Alert.alert("Success", "Send report successfully");
      } catch (error) {
        Alert.alert(error);
      } finally {
        if (isInvalid === true) {
          setIsInvalid((curr) => !curr);
        }
      }
    }
  }
  return (
    <Modal isVisible={isVisible} backdropOpacity={0.7}>
      <TouchableWithoutFeedback
        style={styles.root}
        onPress={() => Keyboard.dismiss()}
      >
        <View style={styles.subRoot}>
          {/* <View
            style={{ alignSelf: "flex-end", marginTop: -20, marginRight: -20 }}
          >
            <IconButton
              icon={"ios-close-circle-outline"}
              size={40}
              color={"red"}
            />
          </View> */}
          <View
            style={{
              marginTop: -10,
              borderBottomColor: "#c0c0c0ff",
              borderBottomWidth: 2,
              paddingBottom: 10,
              width: "100%",
            }}
          >
            <Text
              style={[
                styles.title,
                { color: GlobalColors.headerColor, fontSize: 25 },
              ]}
            >
              {isRating ? "Rating" : "Report"}
            </Text>
          </View>
          <Image style={styles.image} source={{ uri: image }} />

          <SelectList
            boxStyles={styles.selectList1}
            setSelected={(val) => setReportMember(val)}
            data={listOfMember}
            save="key"
            search={false}
            defaultOption={listOfMember[0]}
            inputStyles={{ fontSize: 15, fontWeight: "bold" }}
            dropdownStyles={{
              backgroundColor: "white",
              borderWidth: 1,
              marginHorizontal: 5,
              zIndex: 999,
              position: "absolute",
              top: 50,
              right: 0,
              left: 0,
            }}
            dropdownItemStyles={{
              borderBottomWidth: 0.17,
              borderColor: "gray",
              opacity: 0.6,
              width: "100%",
              zIndex: 999,
            }}
          />
          <View style={{ width: "100%", zIndex: -1 }}>
            {isRating && (
              <AirbnbRating
                ratingCount={5}
                size={40}
                showRating
                onFinishRating={(value) => setRatingValue(value)}
              />
            )}
            <View>
              <TextInput
                placeholder="Content"
                style={styles.content}
                value={content}
                multiline={true}
                onChangeText={(value) => setContent(value)}
              />
              {isInvalid && (
                <Text style={styles.invalidLabel}>*{"Field is required"}</Text>
              )}
            </View>

            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableOpacity
                onPress={() => {
                  setContent("");
                  setRatingValue("3");
                  onCancel();
                }}
                style={[
                  styles.closeButton,
                  { backgroundColor: "#f1aca9", flex: 1 },
                ]}
              >
                <Text style={styles.closeButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                // onPress={callback}
                style={[
                  styles.closeButton,
                  { backgroundColor: "#69d129", flex: 1 },
                ]}
                onPress={submitHandler}
              >
                <Text style={styles.closeButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
export default RatingFeedbackScreen;
const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  subRoot: {
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 30,
    width: 350,
    // height: 560,
    zIndex: 1,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  message: {
    marginTop: 10,
    textAlign: "center",
  },
  closeButton: {
    marginTop: 20,
    alignSelf: "center",
    backgroundColor: "#96e047",
    width: "100%",
    padding: 10,
    borderRadius: 30,
  },
  closeButtonText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },

  image: {
    height: 100,
    width: 100,
    borderRadius: 100,
    borderColor: "gray",
    borderWidth: 2,
    marginTop: 10,
  },
  content: {
    marginTop: 10,
    padding: 15,
    borderRadius: 10,
    width: "100%",
    fontSize: 15,
    // height: 100,
    borderColor: "black",
    borderWidth: 1,
    textAlignVertical: "top",
    paddingTop: 15,

    minHeight: 150,
  },
  selectList1: {
    borderWidth: 0.5,
    borderColor: GlobalColors.headerColor,
    zIndex: 999,
    marginTop: 10,
  },
  invalidLabel: {
    color: "#FF4E00",
  },
});
