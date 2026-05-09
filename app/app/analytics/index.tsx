import {
  View,
  Text,
  ScrollView,
  StatusBar,
  Dimensions,
  TouchableOpacity,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import {
  Ionicons,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";

import { LineChart } from "react-native-chart-kit";

import { useRouter } from "expo-router";

const screenWidth =
  Dimensions.get("window").width;

export default function AnalyticsScreen() {
  const router = useRouter();

  return (
    <>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={[
          "#020617",
          "#050B2C",
          "#020617",
        ]}
        style={{
          flex: 1,
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={{
            paddingHorizontal: 18,
            paddingTop: 60,
            paddingBottom: 120,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent:
                "space-between",
              alignItems: "center",
              marginBottom: 28,
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 30,
                fontWeight: "700",
              }}
            >
              Analytics
            </Text>

            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor:
                  "rgba(255,255,255,0.05)",
                paddingHorizontal: 14,
                paddingVertical: 10,
                borderRadius: 16,
              }}
            >
              <Ionicons
                name="calendar-outline"
                size={18}
                color="#FFFFFF"
              />

              <Text
                style={{
                  color: "#FFFFFF",
                  marginLeft: 8,
                  fontSize: 13,
                }}
              >
                May 13 - May 19
              </Text>
            </TouchableOpacity>
          </View>

          <LinearGradient
            colors={[
              "rgba(20,25,65,0.95)",
              "rgba(10,15,45,0.95)",
            ]}
            style={{
              borderRadius: 26,
              paddingVertical: 22,
              borderWidth: 1,
              borderColor:
                "rgba(255,255,255,0.05)",
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 22,
                fontWeight: "700",
                marginLeft: 22,
                marginBottom: 18,
              }}
            >
              Mood Trend
            </Text>

            <LineChart
              data={{
                labels: [
                  "Mon",
                  "Tue",
                  "Wed",
                  "Thu",
                  "Fri",
                  "Sat",
                  "Sun",
                ],
                datasets: [
                  {
                    data: [
                      55, 58, 72, 48,
                      63, 91, 100,
                    ],
                  },
                ],
              }}
              width={screenWidth - 56}
              height={220}
              withDots
              withShadow={false}
              withInnerLines
              withOuterLines={false}
              chartConfig={{
                backgroundGradientFrom:
                  "transparent",
                backgroundGradientTo:
                  "transparent",
                decimalPlaces: 0,
                color: (
                  opacity = 1
                ) =>
                  `rgba(168,85,247,${opacity})`,
                labelColor: (
                  opacity = 1
                ) =>
                  `rgba(255,255,255,${opacity})`,
                propsForDots: {
                  r: "5",
                  strokeWidth: "3",
                  stroke: "#A855F7",
                },
                propsForBackgroundLines:
                  {
                    stroke:
                      "rgba(255,255,255,0.08)",
                  },
              }}
              bezier
              style={{
                borderRadius: 20,
              }}
            />
          </LinearGradient>

          <LinearGradient
            colors={[
              "rgba(20,25,65,0.95)",
              "rgba(10,15,45,0.95)",
            ]}
            style={{
              borderRadius: 26,
              padding: 22,
              marginTop: 22,
              borderWidth: 1,
              borderColor:
                "rgba(255,255,255,0.05)",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent:
                  "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 22,
                  fontWeight: "700",
                }}
              >
                Emotion Distribution
              </Text>

              <Text
                style={{
                  color: "#8B5CF6",
                  fontSize: 14,
                }}
              >
                View Details
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                marginTop: 24,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 140,
                  height: 140,
                  borderRadius: 70,
                  borderWidth: 14,
                  borderColor:
                    "#3B82F6",
                  justifyContent:
                    "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 34,
                    fontWeight: "700",
                  }}
                >
                  72%
                </Text>

                <Text
                  style={{
                    color: "#22C55E",
                    marginTop: 2,
                  }}
                >
                  Positive
                </Text>
              </View>

              <View
                style={{
                  marginLeft: 28,
                  flex: 1,
                }}
              >
                <EmotionRow
                  color="#3B82F6"
                  label="Joy"
                  value="45%"
                />

                <EmotionRow
                  color="#8B5CF6"
                  label="Calm"
                  value="27%"
                />

                <EmotionRow
                  color="#818CF8"
                  label="Neutral"
                  value="15%"
                />

                <EmotionRow
                  color="#6366F1"
                  label="Sad"
                  value="8%"
                />

                <EmotionRow
                  color="#F97316"
                  label="Anxious"
                  value="5%"
                />
              </View>
            </View>
          </LinearGradient>

          <View
            style={{
              flexDirection: "row",
              justifyContent:
                "space-between",
              marginTop: 22,
            }}
          >
            <LinearGradient
              colors={[
                "rgba(20,25,65,0.95)",
                "rgba(10,15,45,0.95)",
              ]}
              style={{
                width: "48%",
                borderRadius: 24,
                padding: 20,
                borderWidth: 1,
                borderColor:
                  "rgba(255,255,255,0.05)",
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 20,
                  fontWeight: "700",
                }}
              >
                Sleep Analysis
              </Text>

              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 38,
                  fontWeight: "700",
                  marginTop: 18,
                }}
              >
                7h 45m
              </Text>

              <Text
                style={{
                  color: "#94A3B8",
                  marginTop: 4,
                }}
              >
                Avg. Sleep
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-end",
                  marginTop: 20,
                  justifyContent:
                    "space-between",
                }}
              >
                {[35, 20, 50, 30, 60]
                  .map((h, i) => (
                    <View
                      key={i}
                      style={{
                        width: 10,
                        height: h,
                        borderRadius: 10,
                        backgroundColor:
                          "#6366F1",
                      }}
                    />
                  ))}
              </View>
            </LinearGradient>

            <LinearGradient
              colors={[
                "rgba(20,25,65,0.95)",
                "rgba(10,15,45,0.95)",
              ]}
              style={{
                width: "48%",
                borderRadius: 24,
                padding: 20,
                borderWidth: 1,
                borderColor:
                  "rgba(255,255,255,0.05)",
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 20,
                  fontWeight: "700",
                }}
              >
                Stress Heatmap
              </Text>

              <Text
                style={{
                  color: "#22C55E",
                  fontSize: 38,
                  fontWeight: "700",
                  marginTop: 18,
                }}
              >
                Low
              </Text>

              <Text
                style={{
                  color: "#94A3B8",
                  marginTop: 4,
                }}
              >
                Most of the week
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  marginTop: 18,
                  gap: 6,
                }}
              >
                {Array.from({
                  length: 21,
                }).map((_, i) => (
                  <View
                    key={i}
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 4,
                      backgroundColor:
                        i % 5 === 0
                          ? "#22C55E"
                          : "rgba(59,130,246,0.4)",
                    }}
                  />
                ))}
              </View>
            </LinearGradient>
          </View>

          <LinearGradient
            colors={[
              "rgba(20,25,65,0.95)",
              "rgba(10,15,45,0.95)",
            ]}
            style={{
              borderRadius: 26,
              padding: 22,
              marginTop: 22,
              borderWidth: 1,
              borderColor:
                "rgba(255,255,255,0.05)",
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 22,
                fontWeight: "700",
              }}
            >
              Productivity Score
            </Text>

            <Text
              style={{
                color: "#22C55E",
                fontSize: 44,
                fontWeight: "700",
                marginTop: 18,
              }}
            >
              78/100
            </Text>

            <Text
              style={{
                color: "#22C55E",
                marginTop: 4,
                fontSize: 16,
              }}
            >
              Good Job!
            </Text>

            <LinearGradient
              colors={[
                "#8B5CF6",
                "#22D3EE",
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                height: 10,
                borderRadius: 20,
                marginTop: 24,
                width: "78%",
              }}
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent:
                  "flex-end",
                marginTop: 16,
              }}
            >
              <Feather
                name="trending-up"
                size={28}
                color="#60A5FA"
              />
            </View>
          </LinearGradient>
        </ScrollView>

        <View
          style={{
            position: "absolute",
            bottom: 25,
            left: 18,
            right: 18,
            height: 82,
            borderRadius: 28,
            backgroundColor:
              "rgba(10,15,40,0.96)",
            flexDirection: "row",
            justifyContent:
              "space-around",
            alignItems: "center",
            borderWidth: 1,
            borderColor:
              "rgba(255,255,255,0.05)",
          }}
        >
          <BottomItem
            icon="home"
            label="Home"
            onPress={() =>
              router.push(
                "/dashboard"
              )
            }
          />

          <BottomItem
            icon="bar-chart-2"
            label="Analytics"
            active
            onPress={() =>
              router.push(
                "/analytics"
              )
            }
          />

          <BottomItem
            icon="cpu"
            label="Insights"
            onPress={() =>
              router.push(
                "/insights"
              )
            }
          />

          <BottomItem
            icon="user"
            label="Profile"
            onPress={() =>
              router.push(
                "/profile"
              )
            }
          />
        </View>
      </LinearGradient>
    </>
  );
}

function EmotionRow({
  color,
  label,
  value,
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent:
          "space-between",
        alignItems: "center",
        marginBottom: 14,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: color,
            marginRight: 10,
          }}
        />

        <Text
          style={{
            color: "#CBD5E1",
            fontSize: 16,
          }}
        >
          {label}
        </Text>
      </View>

      <Text
        style={{
          color: "#FFFFFF",
          fontSize: 16,
          fontWeight: "600",
        }}
      >
        {value}
      </Text>
    </View>
  );
}

function BottomItem({
  icon,
  label,
  active,
  onPress,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        alignItems: "center",
      }}
    >
      <Feather
        name={icon}
        size={22}
        color={
          active
            ? "#8B5CF6"
            : "#94A3B8"
        }
      />

      <Text
        style={{
          color: active
            ? "#8B5CF6"
            : "#94A3B8",
          fontSize: 12,
          marginTop: 6,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}