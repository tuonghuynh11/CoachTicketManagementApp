import { useIsFocused } from "@react-navigation/native";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
function BookingTimeLine({ position }) {
  const [scrollViewRef, setScrollViewRef] = useState(null);
  const [inState, setInState] = useState(false);

  const [dataSourceCords, setDataSourceCords] = useState([[0, 0, 0, 0, 0]]);

  const scrollHandler = (position) => {
    try {
      if (dataSourceCords.length >= position) {
        scrollViewRef.scrollTo({
          x: dataSourceCords[position],
          y: 0,
          animated: true,
        });
      } else {
        //   alert("Out of Max Index");
      }
    } catch (error) {
      console.log("Booking Time Line", error);
    }
  };

  useEffect(() => {
    // console.log(scrollViewRef);
    if (!!scrollViewRef) scrollHandler(position);
  }, []);

  return (
    <ScrollView
      // scrollEnabled={false}
      showsHorizontalScrollIndicator={false}
      horizontal
      style={styles.scrollView}
      ref={(ref) => {
        setScrollViewRef(ref);
      }}
    >
      <View style={styles.subRoot}>
        {/* <View
          style={{
            height: 1,
            width: 214,
            justifyContent: "center",
          }}
        /> */}
        <View
          style={[styles.timeLineContainer]}
          onLayout={(event) => {
            const layout = event.nativeEvent.layout;
            dataSourceCords[0] = layout.x;
            setDataSourceCords(dataSourceCords);
          }}
        >
          <View
            style={
              position == 0
                ? styles.timeLineBoxSelect
                : styles.timeLineBoxUnSelect
            }
          >
            <Text
              style={
                position == 0 ? styles.timeLineTextSelect : styles.timeLineText
              }
            >
              1
            </Text>
          </View>
          <Text
            style={
              position == 0 ? styles.timeLineTitleSelect : styles.timeLineTitle
            }
          >
            Booking
          </Text>
        </View>

        <View
          style={{
            height: 1,
            width: 30,
            borderTopColor: "white",
            borderTopWidth: 3,
            justifyContent: "center",
          }}
        />
        <View
          style={styles.timeLineContainer}
          onLayout={(event) => {
            const layout = event.nativeEvent.layout;
            dataSourceCords[1] = layout.x;
            setDataSourceCords(dataSourceCords);
          }}
        >
          <View
            style={
              position == 1
                ? styles.timeLineBoxSelect
                : styles.timeLineBoxUnSelect
            }
          >
            <Text
              style={
                position == 1 ? styles.timeLineTextSelect : styles.timeLineText
              }
            >
              2
            </Text>
          </View>
          <Text
            style={
              position == 1 ? styles.timeLineTitleSelect : styles.timeLineTitle
            }
          >
            Information
          </Text>
        </View>
        <View
          style={{
            height: 1,
            width: 30,
            borderTopColor: "white",
            borderTopWidth: 3,
            justifyContent: "center",
          }}
        />
        <View
          style={styles.timeLineContainer}
          onLayout={(event) => {
            const layout = event.nativeEvent.layout;
            dataSourceCords[2] = layout.x;
            setDataSourceCords(dataSourceCords);
          }}
        >
          <View
            style={
              position == 2
                ? styles.timeLineBoxSelect
                : styles.timeLineBoxUnSelect
            }
          >
            <Text
              style={
                position == 2 ? styles.timeLineTextSelect : styles.timeLineText
              }
            >
              3
            </Text>
          </View>
          <Text
            style={
              position == 2 ? styles.timeLineTitleSelect : styles.timeLineTitle
            }
          >
            Recheck and Payment
          </Text>
        </View>
        {/* <View
          style={{
            height: 1,
            width: 30,
            borderTopColor: "white",
            borderTopWidth: 3,
            justifyContent: "center",
          }}
        />
        <View
          style={styles.timeLineContainer}
          onLayout={(event) => {
            const layout = event.nativeEvent.layout;
            dataSourceCords[3] = layout.x;
            setDataSourceCords(dataSourceCords);
          }}
        >
          <View
            style={
              position == 3
                ? styles.timeLineBoxSelect
                : styles.timeLineBoxUnSelect
            }
          >
            <Text
              style={
                position == 3 ? styles.timeLineTextSelect : styles.timeLineText
              }
            >
              4
            </Text>
          </View>
          <Text
            style={
              position == 3 ? styles.timeLineTitleSelect : styles.timeLineTitle
            }
          >
            Payment
          </Text>
        </View> */}
        {/* <View
          style={{
            height: 1,
            width: 30,
            borderTopColor: "white",
            borderTopWidth: 3,
            justifyContent: "center",
          }}
        />
        <View
          style={styles.timeLineContainer}
          onLayout={(event) => {
            const layout = event.nativeEvent.layout;
            dataSourceCords[3] = layout.x;
            setDataSourceCords(dataSourceCords);
            setInState(true);
          }}
        >
          <View
            style={
              position == 3
                ? styles.timeLineBoxSelect
                : styles.timeLineBoxUnSelect
            }
          >
            <Text
              style={
                position == 3 ? styles.timeLineTextSelect : styles.timeLineText
              }
            >
              4
            </Text>
          </View>
          <Text
            style={
              position == 3 ? styles.timeLineTitleSelect : styles.timeLineTitle
            }
          >
            Electric Ticket
          </Text>
        </View> */}
        <View
          style={{
            height: 1,
            width: 235,

            justifyContent: "center",
          }}
        />
      </View>
    </ScrollView>
  );
}
export default BookingTimeLine;
const styles = StyleSheet.create({
  root: {
    // flex: 1,
  },
  scrollView: {
    padding: 20,
    backgroundColor: GlobalColors.headerColor,
    borderWidth: 0,
    paddingLeft: 1,
    paddingHorizontal: 0,
  },
  timeLineContainer: {
    flexDirection: "row",
    gap: 5,
    justifyContent: "center",
  },
  timeLineBoxSelect: {
    width: 20,
    height: 20,
    borderRadius: 10,
    padding: 5,
    marginTop: -2,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  timeLineBoxUnSelect: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginTop: -2,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "white",
  },
  timeLineText: {
    fontSize: 10,
    color: "white",
  },
  timeLineTextSelect: {
    fontSize: 10,
    color: "black",
  },
  timeLineTitle: {
    color: "white",
  },
  timeLineTitleSelect: {
    color: "white",
    fontWeight: "bold",
  },
  subRoot: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
});
