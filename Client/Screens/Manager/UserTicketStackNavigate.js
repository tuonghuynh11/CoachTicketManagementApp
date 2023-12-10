import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ManageUserTicket from "./ManageUserTicket";
import TicketConfirmList from "./TicketConfirmList";

const Stack = createNativeStackNavigator();

export default function UserTicketStackNavigate(){
    return(
        <Stack.Navigator
        screenOptions={{
            headerShown: false,
          }}
        >
            <Stack.Screen name="ManageUserTicket" component={ManageUserTicket} />
            <Stack.Screen name="TicketConfirmList" component={TicketConfirmList} />
        </Stack.Navigator>
    )
}