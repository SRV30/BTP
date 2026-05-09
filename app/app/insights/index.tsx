import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import { useRouter } from "expo-router";

export default function InsightsScreen() {
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
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 32,
              fontWeight: "700",
              marginBottom: 28,
            }}
          >
            AI Insights
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent:
                "space-between",
              marginBottom: 26,
            }}
          >
            <TabButton
              title="Insights"
              active
            />

            <TabButton
              title="Recommendations"
            />

            <TabButton
              title="Summary"
            />
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
                "rgba(255,255,255,0.05)",
              marginBottom: 22,
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 22,
                fontWeight: "700",
              }}
            >
              Today&apos;s Insight
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent:
                  "space-between",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: "#22D3EE",
                    fontSize: 30,
                    fontWeight: "700",
                    lineHeight: 40,
                  }}
                >
                  Your mood is elevated
                </Text>

                <Text
                  style={{
                    color: "#CBD5E1",
                    fontSize: 16,
                    lineHeight: 26,
                    marginTop: 12,
                  }}
                >
                  You&apos;ve been more
                  positive than 82% of
                  users today.
                </Text>
              </View>

              <Text
                style={{
                  fontSize: 74,
                  marginLeft: 14,
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
              padding: 22,
              borderWidth: 1,
              borderColor:
                "rgba(255,255,255,0.05)",
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 24,
                fontWeight: "700",
                marginBottom: 20,
              }}
            >
              Personalized
              Recommendations
            </Text>

            <RecommendationCard
              icon={
                <MaterialCommunityIcons
                  name="meditation"
                  size={28}
                  color="#22D3EE"
                />
              }
              title="Take a 10-min mindfulness break"
              subtitle="Reduce stress and improve focus"
            />

            <RecommendationCard
              icon={
                <Ionicons
                  name="walk"
                  size={28}
                  color="#FBBF24"
                />
              }
              title="Go for a short walk"
              subtitle="You didn&apos;t meet your step goal today"
            />

            <RecommendationCard
              icon={
                <Ionicons
                  name="moon"
                  size={28}
                  color="#A855F7"
                />
              }
              title="Dim your screen before bed"
              subtitle="Improve your sleep quality"
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
            active
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

function TabButton({
  title,
  active,
}) {
  return (
    <TouchableOpacity
      style={{
        flex: 1,
        marginHorizontal: 4,
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      {active ? (
        <LinearGradient
          colors={[
            "#8B5CF6",
            "#6366F1",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            paddingVertical: 14,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontWeight: "700",
              fontSize: 15,
            }}
          >
            {title}
          </Text>
        </LinearGradient>
      ) : (
        <View
          style={{
            paddingVertical: 14,
            alignItems: "center",
            backgroundColor:
              "rgba(255,255,255,0.03)",
          }}
        >
          <Text
            style={{
              color: "#94A3B8",
              fontWeight: "600",
              fontSize: 15,
            }}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

function RecommendationCard({
  icon,
  title,
  subtitle,
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor:
          "rgba(255,255,255,0.03)",
        borderRadius: 22,
        padding: 18,
        marginBottom: 16,
      }}
    >
      <View
        style={{
          width: 58,
          height: 58,
          borderRadius: 18,
          backgroundColor:
            "rgba(255,255,255,0.05)",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 16,
        }}
      >
        {icon}
      </View>

      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 17,
            fontWeight: "700",
            lineHeight: 24,
          }}
        >
          {title}
        </Text>

        <Text
          style={{
            color: "#94A3B8",
            fontSize: 14,
            marginTop: 6,
            lineHeight: 22,
          }}
        >
          {subtitle}
        </Text>
      </View>

      <Feather
        name="chevron-right"
        size={24}
        color="#FFFFFF"
      />
    </TouchableOpacity>
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