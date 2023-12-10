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
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { acceptTicket, cancelTicket, updateTicket } from "../../util/userTicketService";
import ModalConfirm from "./Popup/ModalConfirm";

export default function TicketCard({ item, fecth, showSuccess, showFail}) {
  
  const [visibleC, setVisibleC] = useState(false);
  const showC = () => {
    setVisibleC(true);
  };
  const hideC = () => {
    setVisibleC(false);
  };
  const [content, setContent] = useState('');
  const [type, setType] = useState('');

  const confirm = () => {
    if(type == '1'){

      hideC();
      acceptHandler();
    }
    else if(type == '2'){
      hideC();
      cancelHandler();
    }
  }

  const acceptHandler = async () =>{
    try{
      setIndicator(true)
      let roundtrip = []
      if(item.RoundTripTicketData.length != undefined){
        roundtrip = item.RoundTripTicketData[0].reservationId;
      }
      let data = {}
      if(roundtrip.length != 0){
        data = {
          reservations: item.reservationId,
          reservationsRoundTrip: roundtrip
        }
      }
      else{
        data = {
          reservations: item.reservationId,
        }
      }
      console.log(data);
      const accept = await acceptTicket(data);
      console.log(accept);
      fecth();
      setIndicator(false);
      showSuccess();
    
    }catch(error){
      console.log(error);
      showFail();
    }
  }

  const cancelHandler = async () => {
    try{
     
      setIndicator(true)
      let roundtrip = [];
      if(item.RoundTripTicketData.length != 0){
        roundtrip = item.RoundTripTicketData[0].reservationId;
      }
      let shuttlePassenger = [];
      let shuttlePassengerRound = [];
      if(item.ShuttleTicketData.length != 0){
        shuttlePassenger = item.ShuttleTicketData.map((item) => (item.id));
        if(item.RoundTripTicketData.ShuttleTicketData.length != 0){
          if(item.RoundTripTicketData.ShuttleTicketData[0].length != 0){
            shuttlePassengerRound = item.RoundTripTicketData.ShuttleTicketData[0].map((item) => (item.id));
          }
        }
      }

      
      let data = {}
      if(roundtrip.length != 0 && shuttlePassenger.length != 0 && shuttlePassengerRound.length != 0){
        data = {
          reservations: item.reservationId,
          reservationsRoundTrip: roundtrip,
          shuttlePassenger: shuttlePassenger,
          shuttlePassengerRoundTrip: shuttlePassengerRound
        }
      }
      else if(roundtrip.length == 0 && shuttlePassenger.length != 0 && shuttlePassengerRound.length != 0){
        data = {
          reservations: item.reservationId,
          shuttlePassenger: shuttlePassenger,
          shuttlePassengerRoundTrip: shuttlePassengerRound
        }
      }
      else if(roundtrip.length == 0 && shuttlePassenger.length == 0 && shuttlePassengerRound.length != 0){
        data = {
          reservations: item.reservationId,
          shuttlePassengerRoundTrip: shuttlePassengerRound
        }
      }
      else if(roundtrip.length == 0 && shuttlePassenger.length == 0 && shuttlePassengerRound.length == 0){
        data = {
          reservations: item.reservationId,
        }
      }
      else if(roundtrip.length != 0 && shuttlePassenger.length == 0 && shuttlePassengerRound.length != 0){
        data = {
          reservations: item.reservationId,
          reservationsRoundTrip: roundtrip,
          shuttlePassengerRoundTrip: shuttlePassengerRound
        }
      }
      else if(roundtrip.length != 0 && shuttlePassenger.length == 0 && shuttlePassengerRound.length == 0){
        data = {
          reservations: item.reservationId,
          reservationsRoundTrip: roundtrip,
        }
      }
      else if(roundtrip.length != 0 && shuttlePassenger.length != 0 && shuttlePassengerRound.length == 0){
        data = {
          reservations: item.reservationId,
          reservationsRoundTrip: roundtrip,
          shuttlePassenger: shuttlePassenger,
        }
      }
      else if(roundtrip.length == 0 && shuttlePassenger.length != 0 && shuttlePassengerRound.length == 0){
        data = {
          reservations: item.reservationId,
          shuttlePassenger: shuttlePassenger,
        }
      }
      
      console.log(data);
      const cancel = await cancelTicket(data);
      console.log(cancel);
      fecth();
      setIndicator(false);
      showSuccess()
      
    
    }catch(error){
      console.log(error);
      showFail()
    }
  }

  const [indicator, setIndicator] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.contentView}>
      <ActivityIndicator style={styles.indicator} size={"large"} animating={indicator}/>
      <ModalConfirm visible={visibleC} hide={hideC} content={content} confirm={confirm}/>
        <View style={styles.info}>
          {/**coachnum, type */}
          <Text style={styles.text}>From: {item.ScheduleData.RouteData.departurePlace}</Text>
          <Text style={styles.text}>To: {item.ScheduleData.RouteData.arrivalPlace}</Text>
          <Text style={styles.text}>Date: {item.reservationDate.substring(0, item.reservationDate.indexOf('T'))}</Text>
          <Text style={styles.text}>Phone: {item.reservationPhoneNumber}</Text>
          <Text style={styles.text}>Price: {item.totalPrice} VND</Text>
        </View>
        <View style={styles.edit}>
          <Pressable
            style={({ pressed }) => [styles.icon, pressed && { opacity: 0.6 }]}
            onPress={() => {showC(); setContent('Are you sure to accept?'); setType('1');}}
          >
            <View style={styles.buttonTextAccept}>
              <Text style={styles.textButton}>Accept</Text>
            </View>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.icon, pressed && { opacity: 0.6 }]}
            onPress={() => {showC(); setContent('Are you sure to cancel?'); setType('2');}}
          >
            <View style={styles.buttonTextCancel}>
              <Text style={styles.textButton}>Cancel</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: "#FFFFFF",
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  statusText: {
    color: "white",
    backgroundColor: "#72C6A1",
    fontSize: 20,
    width: "40%",
    borderRadius: 10,
    textAlign: "center",
    margin: 5,
  },
  contentView: {
    flex: 1,
    flexDirection: "row",
  },
  imageCoach: {
    flex: 3,
    width: 100,
    height: 120,
    resizeMode: "contain",
  },
  info: {
    flex: 3,
    paddingTop: 10,
    paddingLeft: 15,
    paddingBottom: 10
  },
  edit: {
    flex: 1,
    paddingEnd: 5,
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    flex: 1,
    fontSize: 18,
    color: "#283663",
    fontWeight: "600",
    
  },
  icon: {
    flex: 1,
    paddingTop: 5,
    paddingEnd: 10
  },
  buttonTextAccept: {
    borderRadius: 20,
    backgroundColor: '#72C6A1',
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40
  },
  buttonTextCancel: {
    borderRadius: 20,
    backgroundColor: '#da4b4b',
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40
  },
  textButton: {
    color: '#283663'
  },
  indicator: {
    position: "absolute",
    zIndex: 1000,
    right: '46%',
    top: "50%"
  }
});
