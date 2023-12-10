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
    Modal,
    Image
  } from "react-native";
  import React, { useState, useEffect } from "react";
  import { AntDesign } from '@expo/vector-icons';
  

  export default function ModalSuccess({visible, hide, content}){
    
    return(
        <Modal transparent visible={visible}>
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <Pressable onPress={hide}>

                            <AntDesign name="close" size={24} color="black" style={styles.close}/>  
                        </Pressable>
                    </View>
                    <View style={{alignItems: 'center'}}>
                        <Image source={require("../../../../assets/successIcon.png")} style={styles.image}/>
                    </View>
                    <Text style={styles.text}>{content}</Text>
                </View>
            </View>
        </Modal>
    )
  }

  const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContainer: {
        width: '80%',
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 30,
        borderRadius: 20,
        elevation: 20
    },
    header: {
        width: '100%',
        height: 20,
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    image: {
        height: 150,
        width: 150,
        marginVertical: 10
    },
    text: {
        marginVertical: 30,
        fontSize: 20,
        textAlign: 'center',
        color: '#72C6A1'
    }
  });