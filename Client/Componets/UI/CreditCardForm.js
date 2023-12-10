import { View, StyleSheet } from "react-native";
import IconInput from "./IconInput";

function CreditCardForm({
  cardNumberValidateMessage,
  expireDateValidateMessage,
  secureNumberValidateMessage,
  isCardNumberValid,
  isExpiredDateValid,
  isSecureNumberValid,
  name,
  expireDate,
  cardNumber,
  secureCode,
}) {
  return (
    <View style={styles.root}>
      <IconInput
        label=""
        keyboardType="default"
        //   onUpdateValue={(text) => {
        //     passengers[itemData.index].fullName = text;
        //     setPassengers([...passengers]);
        //   }}
        //   value={passengers[itemData.index].fullName}
        //   isInvalid={!NameValidation(passengers[itemData.index].fullName)}
        placeholder="Name"
        message={"Name is required"}
        icon={"person-outline"}
      />
      <IconInput
        label=""
        keyboardType="default"
        //   onUpdateValue={(text) => {
        //     passengers[itemData.index].address = text;
        //     setPassengers([...passengers]);
        //   }}
        //   value={passengers[itemData.index].address}
        //   isInvalid={!NameValidation(passengers[itemData.index].address)}
        placeholder="Card Number"
        message={
          cardNumberValidateMessage
            ? cardNumberValidateMessage
            : "Card Number is required"
        }
        icon={"card-outline"}
      />
      <View style={{ flexDirection: "row", gap: 10 }}>
        <View style={{ flex: 1 }}>
          <IconInput
            label=""
            keyboardType="default"
            //   onUpdateValue={(text) => {
            //     passengers[itemData.index].phoneNumber = text;
            //     setPassengers([...passengers]);
            //   }}
            //   value={passengers[itemData.index].phoneNumber}
            //   isInvalid={
            //     !PhoneNumberValidation(passengers[itemData.index].phoneNumber)
            //   }
            placeholder="Expiration date"
            message={
              expireDateValidateMessage
                ? expireDateValidateMessage
                : "Expiration date is required."
            }
            icon={"calendar-outline"}
          />
        </View>
        <View style={{ flex: 1 }}>
          <IconInput
            label=""
            keyboardType="default"
            //   onUpdateValue={(text) => {
            //     passengers[itemData.index].phoneNumber = text;
            //     setPassengers([...passengers]);
            //   }}
            //   value={passengers[itemData.index].phoneNumber}
            //   isInvalid={
            //     !PhoneNumberValidation(passengers[itemData.index].phoneNumber)
            //   }
            placeholder="CVV/CVC"
            message={
              secureNumberValidateMessage
                ? secureNumberValidateMessage
                : "Security code is required."
            }
            icon={"code"}
          />
        </View>
      </View>
    </View>
  );
}
export default CreditCardForm;
const styles = StyleSheet.create({
  root: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
  },
});
