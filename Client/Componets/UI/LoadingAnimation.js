import LottieView from "lottie-react-native";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import GlobalColors from "../../Color/colors";
import { Button } from "react-native";
import { useEffect, useLayoutEffect, useRef } from "react";
import { Image } from "react-native";
function LoadingAnimation({ message, run }) {
  const animation = useRef(null);
  const animation1 = useRef(null);
  useEffect(() => {
    setTimeout(() => {
      animation.current?.play();
      animation1.current?.play();
    });
    return () => {
      animation.current?.reset();
      animation1.current?.reset();
    };
  }, []);
  return (
    <View style={styles.root}>
      <View style={styles.rootContainer}>
        <LottieView
          autoPlay={false}
          ref={animation}
          source={require("../../../assets/loading.json")}
          style={styles.animation}
          loop={true}
        />
        {/* <Image
          style={styles.animation}
          source={require("../../../assets/logo.png")}
        ></Image> */}
      </View>
      <View
        style={{
          width: 200,
          height: 200,
          marginTop: -50,
        }}
      >
        <LottieView
          autoPlay
          ref={animation1}
          source={require("../../../assets/loading2.json")}
          style={{
            width: 200,
            height: 200,
          }}
          loop
        />
      </View>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

export default LoadingAnimation;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // padding: 32,
    backgroundColor: GlobalColors.background,
  },
  rootContainer: {
    // justifyContent: "center",
    // alignItems: "center",
    // padding: 32,
    width: 300,
    height: 300,
  },
  message: {
    fontSize: 16,
    marginBottom: 12,
    color: "white",
  },
  animation: {
    width: 300,
    height: 300,
  },
});
