import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";

const MyModal = ({ children, isVisible }) => {
  const [modalVisible, setModalVisible] = useState(isVisible);
  const slideAnimation = new Animated.Value(0);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    Animated.timing(slideAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start(() => {
      setModalVisible(false);
    });
  };

  useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      closeModal();
    }
  }, [modalVisible, slideAnimation]);

  //   if (!modalVisible) {
  //     return (
  //       <TouchableOpacity onPress={openModal} style={styles.openModalButton}>
  //         <Text>Open Modal</Text>
  //       </TouchableOpacity>
  //     );
  //   }

  const modalStyle = {
    transform: [
      {
        translateY: slideAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [300, 0],
        }),
      },
    ],
  };

  return (
    <Animated.View style={[styles.modalContent, modalStyle]}>
      {/* <Text>This is a modal</Text>

      <TouchableOpacity onPress={closeModal} style={styles.closeModalButton}>
        <Text>Close Modal</Text>
      </TouchableOpacity> */}

      {children}
    </Animated.View>
  );
};
export default MyModal;
const styles = StyleSheet.create({
  openModalButton: {
    alignItems: "center",
    backgroundColor: "lightblue",
    padding: 10,
    margin: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  closeModalButton: {
    alignItems: "center",
    marginTop: 10,
  },
});
