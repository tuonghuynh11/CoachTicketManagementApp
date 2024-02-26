import { useTranslation } from "react-i18next";
import { Image, StyleSheet, View, Text } from "react-native";

function AboutUsScreen() {
  const { t } = useTranslation();
  return (
    <View style={styles.root}>
      <Image
        style={styles.image}
        source={require("../../../assets/logoText.png")}
      />
      <Text style={styles.content}>
        A revolutionary solution for hassle-free ticketing operations.
        Seamlessly manage coach ticket sales with ease and efficiency. Key
        features include a user-friendly interface, online ticket sales, seat
        reservation system, payment gateway integration, real-time analytics,
        and reporting. Offer customers the convenience of online bookings,
        secure payments, and personalized seat selection. Say goodbye to manual
        cash handling and embrace digital transactions. Monitor sales
        performance, track customer preferences, and make data-driven decisions
        for optimized revenue and customer satisfaction. Enjoy excellent
        customer support through instant notifications for booking confirmations
        and schedule changes. Customize the app to align with your branding and
        specific requirements. It's also scalable, accommodating your growing
        business needs. Embrace a streamlined, digital solution that eliminates
        paperwork, long queues, and administrative headaches. Experience the
        future of coach ticket management and boost your bottom line. Contact us
        today to learn more about our Coach Ticket Management App and start your
        journey towards greater efficiency and profitability.
      </Text>
      <Text style={styles.text}>{t("version")} 1</Text>
    </View>
  );
}
export default AboutUsScreen;
const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: "100%",
    height: "20%",
  },
  text: {
    fontWeight: "bold",
    fontStyle: "italic",
    marginTop: 20,
    opacity: 0.5,
    fontSize: 18,
  },
  content: {
    textAlign: "center",
    fontSize: 14,
  },
});
