import { images } from "../../../../assets/Assets";
import Icon from "react-native-vector-icons/AntDesign";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";
import { useIsFocused } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  FlatList,
  SafeAreaView,
  useWindowDimensions,
  Dimensions,
  Pressable,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import GlobalColors from "../../../Color/colors";
import { getAllCoaches } from "../../../util/coachService";

const ticketsSOLD = {
  January: 379,

  February: 312,
  March: 339,
  April: 311,
  May: 392,
  June: 349,
  July: 412,
  August: 427,
  September: 500,
  October: 387,
  November: 321,
  December: 440,
};
import { ScrollView } from "react-native-gesture-handler";
const StatisticsScreen = function ({ navigation }) {
  const isFocused = useIsFocused();
  const [coachFalse, setCoachFalse] = useState(0);
  const [coachNum, setCoachNum] = useState(0);
  const fetchCoaches = async () => {
    if (isFocused) {
      try {
        const data = await getAllCoaches();
        const coaches = data.data.rows;
        const falseCoach = coaches.filter((coahc) => coahc.status == false);
        setCoachNum(data.data.count);
        setCoachFalse(falseCoach.length);
      } catch (error) {
        // Handle error, e.g., redirect to login if unauthorized
        console.error("Error fetching coaches:", error);
      }
    }
  };

  useEffect(() => {
    fetchCoaches();
  }, [isFocused]);

  const barchartcolors = [
    "#cf9dff",
    "#FF4500",
    "#32CD32",
    "#FFD700",
    "#1E90FF",
    "#FF69B4",
    "#ADFF2F",
    "#9400D3",
    "#FF6347",
    "#00FFFF",
    "#FF1493",
    "#00FF7F",
  ];
  const data = {
    labels: [
      "Da Nang - TPHCM",
      "Da Nang - Hanoi",
      "Quang Nam - Hanoi",
      "Ninh Binh - TPHCM",
      "Hanoi - TPHCM",
      "Hanoi - TPHCM",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        data: [
          ticketsSOLD.January,
          ticketsSOLD.February,
          ticketsSOLD.March,
          ticketsSOLD.April,
          ticketsSOLD.May,
          ticketsSOLD.June,
          ticketsSOLD.July,
          ticketsSOLD.August,
          ticketsSOLD.September,
          ticketsSOLD.October,
          ticketsSOLD.November,
          ticketsSOLD.December,
        ],
        colors: [
          (opacity = 1) => barchartcolors[0],
          (opacity = 1) => barchartcolors[1],
          (opacity = 1) => barchartcolors[2],
          (opacity = 1) => barchartcolors[3],
          (opacity = 1) => barchartcolors[4],
          (opacity = 1) => barchartcolors[5],
          (opacity = 1) => barchartcolors[6],
          (opacity = 1) => barchartcolors[7],
          (opacity = 1) => barchartcolors[8],
          (opacity = 1) => barchartcolors[9],
          (opacity = 1) => barchartcolors[10],
          (opacity = 1) => barchartcolors[11],
        ],
      },
    ],
  };
  const piedata = [
    {
      name: "2022",
      population: 2150000000,
      color: "rgba(131, 167, 234, 1)",
      legendFontColor: "black",
      legendFontSize: 14,
    },
    {
      name: "2023",
      population: 3150000000,
      color: "#1be866",
      legendFontColor: "black",
      legendFontSize: 14,
    },
    {
      name: "2024",
      population: 15000000,
      color: "#e8a01b",
      legendFontColor: "black",
      legendFontSize: 14,
    },
  ];
  const coachNumberData = [
    {
      name: "Available",
      population: coachFalse,
      color: "rgba(131, 167, 234, 1)",
      legendFontColor: "black",
      legendFontSize: 14,
      maxWidth: 100,
      marginStart: 20,
    },
    {
      name: "Running",
      population: coachNum - coachFalse,
      color: "#1be866",
      legendFontColor: "black",
      legendFontSize: 14,
      maxWidth: 100,
      marginStart: 20,
    },
  ];
  return (
    <>
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [
            styles.menuIcon,
            pressed && { opacity: 0.85 },
          ]}
          onPress={() => {
            navigation.openDrawer();
          }}
        >
          <Entypo name="menu" size={30} color="#283663" />
        </Pressable>

        <Text style={styles.headerText}>Statistics</Text>
      </View>

      <ScrollView style={{ opacity: 0.7 }}>
        {/* <Text style={styles.text}>Statistics</Text> */}
        <View>
          <Text style={{ marginLeft: 10, fontWeight: "bold", fontSize: 18 }}>
            Coach quantity statistics
          </Text>
          <Text style={{ fontSize: 13, marginLeft: 10 }}>
            Total coaches: {coachNum}
          </Text>
          <View style={{ flexDirection: "row" }}>
            <PieChart
              hasLegend={false}
              data={coachNumberData}
              width={Dimensions.get("window").width - 80}
              //width={100}
              height={300}
              chartConfig={{
                backgroundGradientFrom: "white",
                backgroundGradientTo: "white",
                color: (opacity = 1) => `rgba(1, 1, 1, ${opacity})`,

                propsForLabels: {
                  maxWidth: 50,
                  fontSize: 8,
                  markerStart: 12,
                  marginStart: 20,
                },
              }}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"50"}
              center={[10, 20]}
              absolute
              style={{
                marginVertical: 8,
                borderRadius: 16,
                marginLeft: 8,

                //marginRight: 13,
                paddingBottom: 20,
              }}
            />
            <View style={{ width: 70, marginLeft: -40, marginTop: 50 }}>
              <View
                style={{ flexDirection: "row", gap: 5, paddingVertical: 10 }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 20,
                    backgroundColor: "rgba(131, 167, 234, 1)",
                  }}
                ></View>
                <Text>{coachFalse} Available</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  gap: 5,
                  paddingVertical: 10,
                }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 20,
                    backgroundColor: "#1be866",
                  }}
                ></View>
                <Text>{coachNum - coachFalse} Running</Text>
              </View>
            </View>
          </View>
        </View>
        <View>
          <Text style={{ marginLeft: 10, fontWeight: "bold", fontSize: 18 }}>
            TICKETS SOLD BY MONTHS{" "}
          </Text>

          <LineChart
            width={Dimensions.get("window").width}
            height={200}
            yAxisLabel=""
            bezier
            chartConfig={{
              backgroundColor: "#e26a00",
              backgroundGradientFrom: "#fb8c00",
              backgroundGradientTo: "#ffa726",
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726",
              },
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
              marginHorizontal: 8,
              marginRight: 13,
            }}
            data={{
              labels: [
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
                "10",
                "11",
                "12",
              ],
              datasets: [
                {
                  data: [
                    ticketsSOLD.January,
                    ticketsSOLD.February,
                    ticketsSOLD.March,
                    ticketsSOLD.April,
                    ticketsSOLD.May,
                    ticketsSOLD.June,
                    ticketsSOLD.July,
                    ticketsSOLD.August,
                    ticketsSOLD.September,
                    ticketsSOLD.October,
                    ticketsSOLD.November,
                    ticketsSOLD.December,
                  ],
                },
              ],
            }}
          ></LineChart>
        </View>
        <View>
          <Text style={{ marginLeft: 10, fontWeight: "bold", fontSize: 18 }}>
            TICKETS SOLD BY TRIPS{" "}
          </Text>
          <ScrollView>
            <ScrollView horizontal={true}>
              <BarChart
                width={700}
                height={550}
                verticalLabelRotation={60}
                chartConfig={{
                  backgroundColor: "pink",
                  backgroundGradientFrom: "#9b00fb",
                  backgroundGradientTo: "#ff74f3",
                  color: (opacity = 1) => `rgba(1, 1, 1, ${opacity})`,
                  labelColor: (opacity = 1) =>
                    `rgba(255, 255, 255, ${opacity})`,
                }}
                flatColor={true}
                withCustomBarColorFromData={true}
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                  marginHorizontal: 8,
                  marginRight: 13,
                }}
                data={data}
              ></BarChart>
            </ScrollView>
          </ScrollView>
        </View>
        <View>
          <Text style={{ marginLeft: 10, fontWeight: "bold", fontSize: 18 }}>
            PIE CHART
          </Text>
          <View>
            <PieChart
              data={piedata}
              width={Dimensions.get("window").width - 20}
              //width={100}
              height={300}
              chartConfig={{
                backgroundGradientFrom: "white",
                backgroundGradientTo: "white",
                color: (opacity = 1) => `rgba(1, 1, 1, ${opacity})`,
              }}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"20"}
              center={[10, 20]}
              absolute
              style={{
                marginVertical: 8,
                borderRadius: 16,
                marginHorizontal: 8,
                //marginRight: 13,
                paddingBottom: 20,
              }}
            />
          </View>
        </View>
        {/* <View>
        <Text>Bezier Line Chart</Text>
        <LineChart
          data={{
            labels: [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "June",
              "June",
              "June",
              "June",
              "June",
              "June",
            ],
            datasets: [
              {
                data: [
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                ],
              },
            ],
          }}
          width={Dimensions.get("window").width} // from react-native
          height={220}
          yAxisLabel="$"
          yAxisSuffix="k"
          yAxisInterval={1} // optional, defaults to 1
          verticalLabelRotation={30}
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#fb8c00",
            backgroundGradientTo: "#ffa726",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffa726",
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View> */}

        {/* <View>
        <Text>TICKETS SOLD BY MONTHS </Text>

        <PieChart
          data={{
            labels: [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ],
          }}
        ></PieChart>
      </View>
      <View>
        <Text>TICKETS SOLD BY MONTHS </Text>

        <LineChart
          data={{
            labels: [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ],
          }}
        ></LineChart>
      </View> */}
      </ScrollView>
    </>
  );
};
const styles = StyleSheet.create({
  text: {
    paddingTop: 30,
    fontWeight: "bold",
    fontSize: 30,
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
    marginBottom: 15,
  },
  menuIcon: {
    position: "absolute",
    left: 16,
    top: 50,
  },
  headerText: {
    fontSize: 23,
    color: "#283663",
  },
  addIconStyle: {
    position: "absolute",
    right: 16,
  },
});
export default StatisticsScreen;
