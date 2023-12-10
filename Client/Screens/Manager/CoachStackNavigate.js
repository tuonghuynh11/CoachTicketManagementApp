import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ManageCoach from "./ManageCoach";
import Tracking from "./Tracking";
import AddCoach from "./AddCoach";
import CoachCard from "./CoachCard";
import EditCoach from "./EditCoach";

const Stack = createNativeStackNavigator();

export default function CoachStackNavigate() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ManageCoach" component={ManageCoach} />
      <Stack.Screen name="Tracking" component={Tracking} />
      <Stack.Screen name="AddCoach" component={AddCoach} />
      <Stack.Screen name="EditCoach" component={EditCoach} />
      <Stack.Screen name="CoachCard" component={CoachCard} />
    </Stack.Navigator>
  );
}
