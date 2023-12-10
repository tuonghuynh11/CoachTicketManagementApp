import { Image, Pressable, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
function CircleImage({ image, size, isEdit, onPress }) {
  return (
    <View>
      <Pressable
        style={({ pressed }) => [
          {
            borderRadius: size,
            borderWidth: 0.5,
            borderColor: "black",
          },
          pressed && { opacity: 0.7 },
        ]}
        onPress={onPress}
        disabled={!isEdit}
      >
        <Image
          defaultSource={require("../../../icon/default_avatar.png")}
          style={{
            width: size,
            height: size,
            borderRadius: size,
            borderWidth: 0.5,
            borderColor: "black",
          }}
          source={{ uri: image }}
        />
        {/* <MaterialIcons name="edit" size={24} color="#72C6A1" /> */}
      </Pressable>
    </View>
  );
}
export default CircleImage;
