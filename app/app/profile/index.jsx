import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Image,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import { useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useRouter } from "expo-router";

import { profileApi } from "../../services/api";

export default function ProfileScreen() {
  const router = useRouter();

  const [profile, setProfile] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile =
    async () => {
      try {
        const response =
          await profileApi.get();

        setProfile(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  const handleLogout =
    async () => {
      await AsyncStorage.removeItem(
        "moodsense_token"
      );

      router.replace("/login");
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
            marginTop: 18,
          }}
        >
          Loading Profile...
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
            paddingHorizontal: 20,
            paddingTop: 60,
            paddingBottom: 140,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent:
                "space-between",
              alignItems: "center",
              marginBottom: 34,
            }}
          >
            <View>
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 34,
                  fontWeight: "800",
                }}
              >
                My Profile
              </Text>

              <Text
                style={{
                  color: "#94A3B8",
                  marginTop: 6,
                  fontSize: 15,
                }}
              >
                Manage your wellness
                identity
              </Text>
            </View>

            <TouchableOpacity
              style={{
                width: 52,
                height: 52,
                borderRadius: 18,
                backgroundColor:
                  "rgba(255,255,255,0.05)",
                justifyContent:
                  "center",
                alignItems: "center",
                borderWidth: 1,
                borderColor:
                  "rgba(255,255,255,0.05)",
              }}
            >
              <Ionicons
                name="settings-outline"
                size={26}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>

          <LinearGradient
            colors={[
              "#111C44",
              "#0B122E",
              "#0A1028",
            ]}
            style={{
              borderRadius: 36,
              paddingTop: 36,
              paddingBottom: 30,
              alignItems: "center",
              borderWidth: 1,
              borderColor:
                "rgba(255,255,255,0.06)",
              overflow: "hidden",
            }}
          >
            <View
              style={{
                position: "absolute",
                width: 260,
                height: 260,
                borderRadius: 130,
                backgroundColor:
                  "rgba(139,92,246,0.12)",
                top: -120,
              }}
            />

            <View
              style={{
                width: 132,
                height: 132,
                borderRadius: 66,
                backgroundColor:
                  "rgba(139,92,246,0.18)",
                justifyContent:
                  "center",
                alignItems: "center",
                borderWidth: 3,
                borderColor:
                  "rgba(139,92,246,0.55)",
                shadowColor: "#8B5CF6",
                shadowOpacity: 0.8,
                shadowRadius: 30,
                elevation: 20,
              }}
            >
              <Image
                source={{
                  uri: `https://ui-avatars.com/api/?name=${profile?.name}&background=8B5CF6&color=fff`,
                }}
                style={{
                  width: 122,
                  height: 122,
                  borderRadius: 61,
                }}
              />
            </View>

            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 32,
                fontWeight: "800",
                marginTop: 22,
              }}
            >
              {profile?.name ||
                "User"}
            </Text>

            <Text
              style={{
                color: "#94A3B8",
                fontSize: 16,
                marginTop: 8,
              }}
            >
              {profile?.email}
            </Text>

            <View
              style={{
                flexDirection: "row",
                marginTop: 28,
                justifyContent:
                  "space-between",
                width: "88%",
              }}
            >
              <StatCard
                value={
                  profile?.age || "21"
                }
                label="Age"
              />

              <StatCard
                value={
                  profile?.gender ||
                  "Male"
                }
                label="Gender"
              />

              <StatCard
                value={
                  profile?.disability
                    ? "Yes"
                    : "No"
                }
                label="Disability"
              />
            </View>
          </LinearGradient>

          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 24,
              fontWeight: "700",
              marginTop: 34,
              marginBottom: 18,
            }}
          >
            Personal Information
          </Text>

          <ProfileCard
            icon={
              <Feather
                name="mail"
                size={22}
                color="#8B5CF6"
              />
            }
            label="Email"
            value={profile?.email}
          />

          <ProfileCard
            icon={
              <Feather
                name="phone"
                size={22}
                color="#06B6D4"
              />
            }
            label="Phone"
            value={
              profile?.phone_number ||
              "N/A"
            }
          />

          <ProfileCard
            icon={
              <Ionicons
                name="location-outline"
                size={22}
                color="#F59E0B"
              />
            }
            label="Address"
            value={
              profile?.address ||
              "N/A"
            }
          />

          <ProfileCard
            icon={
              <MaterialCommunityIcons
                name="account-outline"
                size={22}
                color="#10B981"
              />
            }
            label="Gender"
            value={
              profile?.gender ||
              "N/A"
            }
          />

          <ProfileCard
            icon={
              <MaterialCommunityIcons
                name="calendar"
                size={22}
                color="#EC4899"
              />
            }
            label="Age"
            value={
              profile?.age?.toString() ||
              "N/A"
            }
          />

          <ProfileCard
            icon={
              <MaterialCommunityIcons
                name="human-wheelchair"
                size={22}
                color="#22C55E"
              />
            }
            label="Disability"
            value={
              profile?.disability
                ? "Yes"
                : "No"
            }
          />

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleLogout}
            style={{
              marginTop: 42,
              borderRadius: 26,
              overflow: "hidden",
              marginBottom: 40,
            }}
          >
            <LinearGradient
              colors={[
                "#7F1D1D",
                "#DC2626",
                "#EF4444",
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                paddingVertical: 20,
                flexDirection: "row",
                justifyContent:
                  "center",
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons
                name="logout"
                size={24}
                color="#FFFFFF"
              />

              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 19,
                  fontWeight: "800",
                  marginLeft: 12,
                }}
              >
                Logout
              </Text>
            </LinearGradient>
          </TouchableOpacity>
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
              router.push("/dashboard")
            }
          />

          <BottomItem
            icon="bar-chart-2"
            label="Analytics"
            onPress={() =>
              router.push("/analytics")
            }
          />

          <BottomItem
            icon="cpu"
            label="Insights"
            onPress={() =>
              router.push("/insights")
            }
          />

          <BottomItem
            icon="user"
            label="Profile"
            active
            onPress={() =>
              router.push("/profile")
            }
          />
        </View>
      </LinearGradient>
    </>
  );
}

function ProfileCard({
  icon,
  label,
  value,
}) {
  return (
    <LinearGradient
      colors={[
        "rgba(20,25,65,0.95)",
        "rgba(10,15,45,0.95)",
      ]}
      style={{
        borderRadius: 24,
        padding: 18,
        marginBottom: 16,
        borderWidth: 1,
        borderColor:
          "rgba(255,255,255,0.05)",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: 54,
          height: 54,
          borderRadius: 18,
          backgroundColor:
            "rgba(255,255,255,0.05)",
          justifyContent:
            "center",
          alignItems: "center",
          marginRight: 16,
        }}
      >
        {icon}
      </View>

      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: "#94A3B8",
            fontSize: 14,
          }}
        >
          {label}
        </Text>

        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 18,
            fontWeight: "700",
            marginTop: 6,
          }}
        >
          {value}
        </Text>
      </View>
    </LinearGradient>
  );
}

function StatCard({
  value,
  label,
}) {
  return (
    <LinearGradient
      colors={[
        "rgba(255,255,255,0.08)",
        "rgba(255,255,255,0.03)",
      ]}
      style={{
        width: 92,
        borderRadius: 22,
        paddingVertical: 18,
        alignItems: "center",
        borderWidth: 1,
        borderColor:
          "rgba(255,255,255,0.05)",
      }}
    >
      <Text
        style={{
          color: "#FFFFFF",
          fontSize: 24,
          fontWeight: "800",
        }}
      >
        {value}
      </Text>

      <Text
        style={{
          color: "#94A3B8",
          marginTop: 6,
          fontSize: 13,
        }}
      >
        {label}
      </Text>
    </LinearGradient>
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