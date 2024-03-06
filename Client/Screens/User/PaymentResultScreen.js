import { useContext, useEffect, useState } from "react";
import { Image, Text } from "react-native";
import { View, StyleSheet } from "react-native";
import GlobalColors from "../../Color/colors";
import CustomButton from "../../Componets/UI/CustomButton";
import { getDate, getTime } from "../../Helper/Date";
import { BookingContext } from "../../Store/bookingContext";
import { useTranslation } from "react-i18next";
function PaymentResultScreen({ navigation, route }) {
  const { t } = useTranslation();
  const [paymentInfo, setPaymentInfo] = useState({});
  const bookingCtx = useContext(BookingContext);
  useEffect(() => {
    bookingCtx.IsTimeout(false);
    setPaymentInfo({
      status: route.params.status,
      paymentMethod: route.params.paymentMethod,
      dateTime: route.params.dateTime,
      cost: route.params.cost,
      tickets: route.params.tickets,
      invoiceCode: generateInvoiceCode(),
    });
    console.log(route.params.cost);
  }, []);
  function generateInvoiceCode() {
    const length = 10; // Change the length of the OTP as needed
    let code = "";
    const characters = "0123456789AHFKEXEWQ";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
    }

    return code;
  }
  // const paymentInfo = {
  //   status: 0,
  //   paymentMethod: "Credit Cart",
  //   dateTime: new Date(),
  //   cost: 100000,
  //   tickets: [],
  //   invoiceCode: generateInvoiceCode(),
  // };
  function addDotsToNumber(number) {
    try {
      if (number.toString() === "0") return "0";
      if (number)
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    } catch (error) {
      console.log(error);
    }
  }
  function SubBody({ title1, subTitle1, title2, subTitle2 }) {
    return (
      <View style={styles.subBody}>
        <View style={{ gap: 5 }}>
          <Text style={styles.title}>{title1}</Text>
          <Text style={styles.subTitle}>{subTitle1}</Text>
        </View>
        <View style={{ gap: 5, alignItems: "flex-end" }}>
          <Text style={styles.title}>{title2}</Text>
          <Text style={styles.subTitle}>{subTitle2}</Text>
        </View>
      </View>
    );
  }
  function returnHomeHandler() {
    navigation.reset({
      index: 0,
      routes: [{ name: "HomeScreen" }],
    });
    bookingCtx.clearBookingInfo();
    bookingCtx.clearBookingInfoTemp();
  }
  function ViewTickets() {
    navigation.navigate("ElectronicTicketScreen", {
      departurePlace: route?.params?.departurePlace,
      arrivalPlace: route?.params?.arrivalPlace,
      departureTime: route?.params?.departureTime,
      arrivalTime: route?.params?.arrivalTime,
      duration: route?.params?.duration,
      services: route?.params?.services,
      idTrip: route?.params?.idTrip,
      passengers: route?.params?.passengers,
      tickets: route.params.tickets,
      roundTripDate: route?.params?.roundTripDate,
      shuttleRoute: route?.params?.shuttleRoute,
      reservationIds: route?.params?.reservationIds,
      reservationsRoundTrip: route?.params?.reservationsRoundTrip,
      paymentStatus: route?.params?.status,
    });
  }
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.root}>
        <View style={styles.header}>
          <Image
            style={styles.image}
            source={
              paymentInfo.status === 1
                ? require("../../../icon/Success.png")
                : require("../../../icon/Warning.png")
            }
          />
          <Text style={styles.headerTitle}>
            {paymentInfo.status === 1
              ? `${t("payment-was-successful")}!`
              : t("invoice-not-paid")}
          </Text>
          <View style={{ overflow: "hidden", marginTop: 15, width: "100%" }}>
            <View
              style={{
                borderStyle: "dashed",
                borderWidth: 2,
                borderColor: "gray",
                margin: -2,
                marginTop: 0,
                opacity: 0.4,
              }}
            ></View>
          </View>
        </View>
        <View style={styles.body}>
          <SubBody
            title1={t("invoice-number")}
            subTitle1={paymentInfo.invoiceCode}
            title2={t("payment-method")}
            subTitle2={paymentInfo.paymentMethod}
          />
          <SubBody
            title1={t("date")}
            subTitle1={getDate(paymentInfo.dateTime)}
            title2={t("time")}
            subTitle2={getTime(paymentInfo.dateTime)}
          />
          <SubBody
            title1={t("amount-paid")}
            subTitle1={addDotsToNumber(paymentInfo.cost) + " VND"}
            title2={"Status"}
            subTitle2={paymentInfo.status === 1 ? t("successful") : t("unpaid")}
          />
        </View>
        <View style={{ margin: 10 }}>
          <CustomButton
            radius={10}
            color={GlobalColors.validate}
            onPress={ViewTickets}
          >
            <Text
              style={{
                textAlign: "center",
                color: "white",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              {t("view-ticket")}
            </Text>
          </CustomButton>
        </View>
      </View>

      <View
        style={{
          margin: 10,
          position: "absolute",
          bottom: 20,
          left: 0,
          right: 0,
          marginHorizontal: 20,
        }}
      >
        <CustomButton
          radius={10}
          color={GlobalColors.lightBackground}
          onPress={returnHomeHandler}
        >
          <Text
            style={{
              textAlign: "center",
              color: "white",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            {t("return-to-home")}
          </Text>
        </CustomButton>
      </View>
    </View>
  );
}
export default PaymentResultScreen;
const styles = StyleSheet.create({
  root: {
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 30,
    backgroundColor: "white",
    borderRadius: 10,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    borderBottomColor: "black",
    paddingBottom: 10,
    borderStyle: "solid",
  },
  image: {
    height: 150,
    width: 170,
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "400",
    textAlign: "center",
  },
  body: {
    padding: 20,
    gap: 30,
  },
  subBody: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 15,
    opacity: 0.5,
  },
  subTitle: {
    fontSize: 16,
  },
});
