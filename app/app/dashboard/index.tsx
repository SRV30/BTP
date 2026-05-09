import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  ActivityIndicator,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";

import { LineChart } from "react-native-chart-kit";

import { useEffect, useState } from "react";

import {
  moodApi,
  profileApi,
} from "../../services/api";

import { useRouter } from "expo-router";

const screenWidth =
  Dimensions.get("window").width;

export default function DashboardScreen() {
  const router = useRouter();

  const [profile, setProfile] =
    useState<any>(null);

  const [todayMood, setTodayMood] =
    useState<any>(null);

  const [weeklyMood, setWeeklyMood] =
    useState<any>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData =
    async () => {
      try {
        setLoading(true);

        const profileRes =
          await profileApi.get();

        const todayRes =
          await moodApi.today();

        const weekRes =
          await moodApi.mood7();

        setProfile(profileRes.data);

        setTodayMood(todayRes.data);

        setWeeklyMood(
          weekRes.data.data || []
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  if (loading) {
    return (
      <LinearGradient
        colors={[
          "#020617",
          "#050B2C",
          "#020617",
        ]}
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator
          size="large"
          color="#8B5CF6"
        />

        <Text
          style={{
            color: "#FFFFFF",
            marginTop: 20,
            fontSize: 16,
          }}
        >
          Loading Dashboard...
        </Text>
      </LinearGradient>
    );
  }

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
            paddingTop: 55,
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
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 14,
                  backgroundColor:
                    "rgba(255,255,255,0.05)",
                  justifyContent:
                    "center",
                  alignItems: "center",
                  marginRight: 14,
                }}
              >
                <Feather
                  name="menu"
                  size={22}
                  color="#FFFFFF"
                />
              </TouchableOpacity>

              <View>
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 22,
                    fontWeight: "700",
                  }}
                >
                  Hello,{" "}
                  {profile?.name ||
                    "User"}{" "}
                  👋
                </Text>

                <Text
                  style={{
                    color: "#94A3B8",
                    marginTop: 3,
                    fontSize: 13,
                  }}
                >
                  Track your mood,
                  improve your life
                </Text>
              </View>
            </View>

            <TouchableOpacity>
              <Ionicons
                name="notifications-outline"
                size={26}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>

          <LinearGradient
            colors={[
              "rgba(20,25,65,0.95)",
              "rgba(10,15,45,0.95)",
            ]}
            style={{
              borderRadius: 28,
              padding: 22,
              borderWidth: 1,
              borderColor:
                "rgba(255,255,255,0.06)",
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
                  fontWeight: "600",
                }}
              >
                Today&apos;s Mood
              </Text>

              <Ionicons
                name="settings-outline"
                size={22}
                color="#A5B4FC"
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 18,
              }}
            >
              <View
                style={{
                  width: 115,
                  height: 115,
                  borderRadius: 60,
                  borderWidth: 8,
                  borderColor:
                    "#8B5CF6",
                  justifyContent:
                    "center",
                  alignItems: "center",
                  shadowColor:
                    "#8B5CF6",
                  shadowOpacity: 0.5,
                  shadowRadius: 20,
                  elevation: 15,
                }}
              >
                <Text
                  style={{
                    fontSize: 44,
                  }}
                >
                  😊
                </Text>
              </View>

              <View
                style={{
                  marginLeft: 24,
                  flex: 1,
                }}
              >
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 58,
                    fontWeight: "700",
                  }}
                >
                  {todayMood
                    ?.top_emotions?.[0]
                    ?.percentage || 0}
                </Text>

                <Text
                  style={{
                    color: "#22C55E",
                    fontSize: 28,
                    fontWeight: "700",
                    marginTop: -4,
                  }}
                >
                  {todayMood?.mood ||
                    "Neutral"}
                </Text>

                <Text
                  style={{
                    color: "#94A3B8",
                    fontSize: 15,
                    marginTop: 10,
                    lineHeight: 22,
                  }}
                >
                  Keep going!
                  You&apos;re doing
                  great.
                </Text>
              </View>
            </View>
          </LinearGradient>

          <View
            style={{
              flexDirection: "row",
              justifyContent:
                "space-between",
              alignItems: "center",
              marginTop: 28,
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 22,
                fontWeight: "700",
              }}
            >
              Overview
            </Text>

            <TouchableOpacity>
              <Text
                style={{
                  color: "#A5B4FC",
                  fontSize: 14,
                }}
              >
                View All
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent:
                "space-between",
              marginBottom: 16,
            }}
          >
            <OverviewCard
              title="Top Emotion"
              value={
                todayMood
                  ?.top_emotions?.[0]
                  ?.emotion || "N/A"
              }
              subtitle={`${todayMood?.top_emotions?.[0]?.percentage || 0}%`}
              icon={
                <MaterialCommunityIcons
                  name="brain"
                  size={24}
                  color="#06B6D4"
                />
              }
            />

            <OverviewCard
              title="Second Emotion"
              value={
                todayMood
                  ?.top_emotions?.[1]
                  ?.emotion || "N/A"
              }
              subtitle={`${todayMood?.top_emotions?.[1]?.percentage || 0}%`}
              icon={
                <Ionicons
                  name="happy"
                  size={24}
                  color="#8B5CF6"
                />
              }
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent:
                "space-between",
            }}
          >
            <OverviewCard
              title="Third Emotion"
              value={
                todayMood
                  ?.top_emotions?.[2]
                  ?.emotion || "N/A"
              }
              subtitle={`${todayMood?.top_emotions?.[2]?.percentage || 0}%`}
              icon={
                <FontAwesome5
                  name="chart-line"
                  size={20}
                  color="#10B981"
                />
              }
            />

            <OverviewCard
              title="Mood Status"
              value={
                todayMood?.mood ||
                "Neutral"
              }
              subtitle="Today"
              icon={
                <MaterialCommunityIcons
                  name="emoticon-outline"
                  size={24}
                  color="#F59E0B"
                />
              }
            />
          </View>

          <LinearGradient
            colors={[
              "rgba(25,18,70,0.98)",
              "rgba(12,18,45,0.98)",
            ]}
            style={{
              borderRadius: 24,
              padding: 20,
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
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 22,
                    fontWeight: "700",
                    marginBottom: 8,
                  }}
                >
                  AI Insight
                </Text>

                <Text
                  style={{
                    color: "#A855F7",
                    fontSize: 18,
                    fontWeight: "600",
                  }}
                >
                  Your dominant emotion
                  is{" "}
                  {todayMood
                    ?.top_emotions?.[0]
                    ?.emotion || "Neutral"}
                </Text>

                <Text
                  style={{
                    color: "#CBD5E1",
                    fontSize: 14,
                    marginTop: 8,
                    lineHeight: 21,
                  }}
                >
                  Emotional balance is
                  currently stable based
                  on recent activity.
                </Text>
              </View>

              <Text
                style={{
                  fontSize: 60,
                }}
              >
                🧠
              </Text>
            </View>
          </LinearGradient>

          <LinearGradient
            colors={[
              "rgba(20,25,65,0.95)",
              "rgba(10,15,45,0.95)",
            ]}
            style={{
              borderRadius: 28,
              paddingVertical: 24,
              marginTop: 24,
              borderWidth: 1,
              borderColor:
                "rgba(255,255,255,0.06)",
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
              Weekly Mood Trend
            </Text>

            <LineChart
              data={{
                labels:
                  weeklyMood?.map(
                    (item: any) =>
                      new Date(
                        item.date
                      ).toLocaleDateString(
                        "en-US",
                        {
                          weekday:
                            "short",
                        }
                      )
                  ) || [],
                datasets: [
                  {
                    data:
                      weeklyMood?.map(
                        (item: any) =>
                          item
                            ?.emotion_percentages
                            ?.Neutral ||
                          0
                      ) || [0],
                  },
                ],
              }}
              width={screenWidth - 56}
              height={220}
              withDots
              withShadow={false}
              withInnerLines
              withOuterLines={false}
              yAxisInterval={1}
              chartConfig={{
                backgroundGradientFrom:
                  "transparent",
                backgroundGradientTo:
                  "transparent",
                decimalPlaces: 0,
                color: (
                  opacity = 1
                ) =>
                  `rgba(139,92,246,${opacity})`,
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
            active
            onPress={() =>
              router.push(
                "/dashboard"
              )
            }
          />

          <BottomItem
            icon="bar-chart-2"
            label="Analytics"
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

function OverviewCard({
  title,
  value,
  subtitle,
  icon,
}: any) {
  return (
    <LinearGradient
      colors={[
        "rgba(20,25,65,0.95)",
        "rgba(10,15,45,0.95)",
      ]}
      style={{
        width: "48%",
        borderRadius: 22,
        padding: 18,
        borderWidth: 1,
        borderColor:
          "rgba(255,255,255,0.05)",
      }}
    >
      <View
        style={{
          marginBottom: 14,
        }}
      >
        {icon}
      </View>

      <Text
        style={{
          color: "#94A3B8",
          fontSize: 14,
        }}
      >
        {title}
      </Text>

      <Text
        numberOfLines={1}
        style={{
          color: "#FFFFFF",
          fontSize: 24,
          fontWeight: "700",
          marginTop: 8,
        }}
      >
        {value}
      </Text>

      <Text
        style={{
          color: "#22C55E",
          fontSize: 14,
          marginTop: 4,
        }}
      >
        {subtitle}
      </Text>
    </LinearGradient>
  );
}

function BottomItem({
  icon,
  label,
  active,
  onPress,
}: any) {
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