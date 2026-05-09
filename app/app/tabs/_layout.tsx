import { Tabs } from "expo-router";

import {
  Ionicons,
  Feather,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarStyle: {
          position: "absolute",
          bottom: 18,
          left: 16,
          right: 16,
          height: 78,
          borderRadius: 26,
          backgroundColor:
            "rgba(10,15,40,0.97)",
          borderTopWidth: 0,
          paddingTop: 10,
          paddingBottom: 12,
          elevation: 0,
        },

        tabBarActiveTintColor:
          "#8B5CF6",

        tabBarInactiveTintColor:
          "#94A3B8",

        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 4,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Home",

          tabBarIcon: ({
            color,
            size,
          }) => (
            <Feather
              name="home"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="analytics"
        options={{
          title: "Analytics",

          tabBarIcon: ({
            color,
            size,
          }) => (
            <MaterialCommunityIcons
              name="chart-line"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="insights"
        options={{
          title: "Insights",

          tabBarIcon: ({
            color,
            size,
          }) => (
            <Ionicons
              name="sparkles-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",

          tabBarIcon: ({
            color,
            size,
          }) => (
            <Ionicons
              name="person-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}