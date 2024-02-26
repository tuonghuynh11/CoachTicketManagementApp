import { View, StyleSheet, FlatList, Image, Text } from "react-native";
import GlobalColors from "../../Color/colors";
import { useContext, useEffect, useState } from "react";
import { getDate } from "../../Helper/Date";
import { getDiscountOfUser } from "../../util/databaseAPI";
import { AuthContext } from "../../Store/authContex";
import Loading from "../../Componets/UI/Loading";
import { useTranslation } from "react-i18next";
function MyOfferingScreen() {
  const { t } = useTranslation();
  const [newDiscountList, setNewDiscountList] = useState([]);
  const [prepareExpiredDiscountList, setPrepareExpiredDiscountList] = useState(
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  const authCtx = useContext(AuthContext);
  useEffect(() => {
    // const discounts = [
    //   {
    //     id: 1,
    //     title: "Discount 50%",
    //     expireDate: new Date(2023, 11, 11),
    //     value: 50,
    //   },
    //   {
    //     id: 2,
    //     title: "Discount 45%",
    //     expireDate: new Date(2023, 11, 12),
    //     value: 45,
    //   },
    //   {
    //     id: 3,
    //     title: "Discount 55%",
    //     expireDate: new Date(2023, 11, 12),
    //     value: 55,
    //   },
    //   {
    //     id: 4,
    //     title: "Discount 90%",
    //     expireDate: new Date(2023, 11, 12),
    //     value: 90,
    //   },
    //   {
    //     id: 5,
    //     title: "Discount 100%",
    //     expireDate: new Date(2023, 11, 12),
    //     value: 100,
    //   },
    //   {
    //     id: 6,
    //     title: "Discount 30%",
    //     expireDate: new Date(2023, 9, 11),
    //     value: 30,
    //   },
    //   {
    //     id: 7,
    //     title: "Discount 20%",
    //     expireDate: new Date(2023, 9, 13),
    //     value: 20,
    //   },
    //   {
    //     id: 8,
    //     title: "Discount 10%",
    //     expireDate: new Date(2023, 9, 14),
    //     value: 10,
    //   },
    //   {
    //     id: 9,
    //     title: "Discount 5%",
    //     expireDate: new Date(2023, 9, 15),
    //     value: 5,
    //   },
    // ];
    async function getUserDiscount() {
      setIsLoading((curr) => !curr);
      const discountList = await getDiscountOfUser(
        authCtx.token,
        authCtx.idUser
      );
      if (!discountList) {
        setIsLoading((curr) => !curr);

        return;
      }
      let discountTemp = discountList.rows.map((item) => {
        return {
          id: item.discountId,
          title: `${t("discount")} ${item.DiscountData.value * 100}%`,
          expireDate: new Date(item.DiscountData.expireDate),
          value: item.DiscountData.value * 100,
          minimumPriceToApply: item.DiscountData.minimumpricetoapply,
          maximumDiscountPrice: item.DiscountData.maximumdiscountprice,
          status: item.status,
        };
      });
      discountTemp = discountTemp.filter(
        (item) => item.expireDate > Date.now()
      );

      const newDis = [];
      const odlDis = [];
      discountTemp.forEach((discount) => {
        if (numberDaysBetweenTwoDays(new Date(), discount.expireDate) < 0) {
          return;
        }
        if (numberDaysBetweenTwoDays(new Date(), discount.expireDate) < 3) {
          odlDis.push(discount);
        } else {
          newDis.push(discount);
        }
      });
      setPrepareExpiredDiscountList(
        odlDis.sort((d1, d2) => d1.expireDate - d2.expireDate)
      );
      setNewDiscountList(
        newDis.sort((d1, d2) => d1.expireDate - d2.expireDate)
      );
      setIsLoading((curr) => !curr);
    }
    getUserDiscount();
  }, []);
  function numberDaysBetweenTwoDays(date1, date2) {
    // To calculate the time difference of two dates
    var Difference_In_Time = date2.getTime() - date1.getTime();

    // To calculate the no. of days between two dates
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    return Difference_In_Days;
  }
  function addDotsToNumber(number) {
    if (number.toString() === "0") return "0";
    if (number) return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  function renderDiscountItem(itemData, type) {
    const numberOfDays = numberDaysBetweenTwoDays(
      new Date(),
      new Date(itemData.item.expireDate)
    );
    return (
      // <View style={styles.discountItem}>
      //   <View style={{ gap: 10 }}>
      //     <Text style={styles.discountTitle}>{itemData.item.title}</Text>
      //     <Text>Expire date : {getDate(itemData.item.expireDate)}</Text>
      //   </View>
      //   <Image
      //     style={{ width: 40, height: 40 }}
      //     source={
      //       type === "new"
      //         ? require("../../../icon/newDiscount.png")
      //         : require("../../../icon/oldDiscount.png")
      //     }
      //   />
      // </View>
      <View style={styles.discountItem}>
        <Image
          style={{ width: 52, height: 52 }}
          source={
            numberDaysBetweenTwoDays(new Date(), itemData.item.expireDate) >= 3
              ? require("../../../icon/newDiscount.png")
              : require("../../../icon/oldDiscount.png")
          }
        />
        <View style={{ gap: 10 }}>
          <Text style={styles.discountTitle}>{itemData.item.title}</Text>
          <Text style={{ fontSize: 16, fontWeight: 400 }}>
            {t("minimum-invoice")}{" "}
            <Text
              style={{
                color: "red",
                fontWeight: 600,
              }}
            >
              {addDotsToNumber(itemData.item.minimumPriceToApply)}VND
            </Text>
          </Text>
          <View
            style={{
              padding: 2,
              borderWidth: 1,
              borderColor: "#f70010c5",
              alignItems: "flex-start",
              alignSelf: "flex-start",
            }}
          >
            <Text
              style={{
                color: "#f70010c5",
                fontSize: 13,
              }}
            >
              {t("maximum")}{" "}
              {addDotsToNumber(itemData.item.maximumDiscountPrice)}VND
            </Text>
          </View>
          {numberOfDays <= 4 && (
            <Text
              style={[
                numberOfDays < 2 && { color: "red" },
                {
                  fontSize: 13,
                },
              ]}
            >
              {t("expire-date")} : {getDate(itemData.item.expireDate)}
              {" ("}
              {numberOfDays.toFixed(0)}
              {numberOfDays >= 2 ? " days)" : " day)"}
            </Text>
          )}
          {numberOfDays > 4 && (
            <Text
              style={[
                numberOfDays < 2 && { color: "red" },
                {
                  fontSize: 13,
                },
              ]}
            >
              {t("expire-date")} : {getDate(itemData.item.expireDate)}
            </Text>
          )}
        </View>
      </View>
    );
  }
  return (
    <View style={styles.root}>
      {isLoading && <Loading />}
      {!isLoading && (
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>
            {t("new-discount")} ({newDiscountList.length})
          </Text>
          <FlatList
            data={newDiscountList}
            renderItem={(itemData) => renderDiscountItem(itemData, "new")}
            ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}

      {!isLoading && (
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: GlobalColors.validate }]}>
            {t("prepare-to-expire")} ({prepareExpiredDiscountList.length})
          </Text>
          <FlatList
            data={prepareExpiredDiscountList}
            renderItem={(itemData) => renderDiscountItem(itemData, "old")}
            ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </View>
  );
}
export default MyOfferingScreen;
const styles = StyleSheet.create({
  root: {
    flex: 1,
    margin: 20,
    backgroundColor: "#72C6A1",
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 30,
    padding: 20,
    gap: 10,
  },
  discountItem: {
    padding: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: GlobalColors.price,
    marginBottom: 10,
  },
  discountTitle: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
  },
});
