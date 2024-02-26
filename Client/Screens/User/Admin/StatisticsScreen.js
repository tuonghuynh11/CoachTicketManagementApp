import { images } from "../../../../assets/Assets";
import Icon from "react-native-vector-icons/AntDesign";
import { useState } from "react";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";
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
    }
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
      <ScrollView style={{ opacity: 1 }}>
        {/* <Text style={styles.text}>Statistics</Text> */}

        <View>
          <Text style={{marginLeft: 10, fontWeight: 'bold', fontSize: 18, color: '#283663'}}>Tickets Sold By Months </Text>

          <LineChart
            width={Dimensions.get("window").width}
            height={200}
            yAxisLabel=""
            bezier
            chartConfig={{
              backgroundColor: "#e26a00",
              backgroundGradientFrom: "#db8b2a",
              backgroundGradientTo: "#f6b34e",
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
          <Text style={{marginLeft: 10, fontWeight: 'bold', fontSize: 18, color: '#283663'}}>Tickets Sold By Trips </Text>
          <ScrollView>
            <ScrollView horizontal={true}>
              <BarChart
                width={700}
                height={550}
                verticalLabelRotation={60}
                chartConfig={{
                  backgroundColor: "pink",
                  backgroundGradientFrom: "#6e73d3",
                  backgroundGradientTo: "#b3dcf0",
                  color: (opacity = 1) => `rgba(1, 1, 1, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
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
          <Text style={{marginLeft: 10, fontWeight: 'bold', fontSize: 18, color: '#283663'}}>Revenue By Years</Text>
          <View >
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
                paddingBottom: 20
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
