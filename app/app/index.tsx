import {
  View,
  Text,
  Image,
  StatusBar,
  Animated,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useRouter } from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";

import logo from "../assets/images/logo.png";

export default function SplashScreen() {
  const router = useRouter();

  const progressAnim = useRef(
    new Animated.Value(0)
  ).current;

  const [progress, setProgress] =
    useState(0);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 100,
      duration: 2500,
      useNativeDriver: false,
    }).start();

    const listener =
      progressAnim.addListener(
        ({ value }) => {
          setProgress(
            Math.floor(value)
          );
        }
      );

    checkAuth();

    return () => {
      progressAnim.removeListener(
        listener
      );
    };
  }, []);

  const checkAuth = async () => {
    try {
      const token =
        await AsyncStorage.getItem(
          "moodsense_token"
        );

      setTimeout(() => {
        if (token) {
          router.replace(
            "/dashboard"
          );
        } else {
          router.replace("/login");
        }
      }, 2500);
    } catch (error) {
      console.log(error);

      router.replace("/login");
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={[
          "#020617",
          "#0f172a",
          "#111827",
        ]}
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 24,
        }}
      >
        <View
          style={{
            position: "absolute",
            width: 320,
            height: 320,
            borderRadius: 160,
            backgroundColor:
              "rgba(59,130,246,0.15)",
            top: 140,
          }}
        />

        <View
          style={{
            width: 190,
            height: 190,
            borderRadius: 95,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor:
              "rgba(255,255,255,0.05)",
            borderWidth: 1,
            borderColor:
              "rgba(255,255,255,0.08)",
            shadowColor: "#3B82F6",
            shadowOpacity: 0.5,
            shadowRadius: 30,
            elevation: 20,
            marginBottom: 40,
          }}
        >
          <Image
            source={logo}
            style={{
              width: 120,
              height: 120,
              resizeMode: "contain",
            }}
          />
        </View>

        <Text
          style={{
            fontSize: 40,
            fontWeight: "800",
            color: "#FFFFFF",
            letterSpacing: 1,
          }}
        >
          MoodSense
        </Text>

        <Text
          style={{
            fontSize: 40,
            fontWeight: "800",
            color: "#8B5CF6",
            marginBottom: 18,
          }}
        >
          AI
        </Text>

        <Text
          style={{
            color: "#CBD5E1",
            fontSize: 18,
            textAlign: "center",
            lineHeight: 26,
            paddingHorizontal: 20,
          }}
        >
          AI-Powered Mental Wellness
        </Text>

        <Text
          style={{
            color: "#64748B",
            fontSize: 15,
            textAlign: "center",
            marginTop: 12,
          }}
        >
          Understanding You,
          Enhancing Your Tomorrow
        </Text>

        <View
          style={{
            width: "72%",
            height: 6,
            backgroundColor:
              "rgba(255,255,255,0.08)",
            borderRadius: 20,
            overflow: "hidden",
            marginTop: 75,
          }}
        >
          <Animated.View
            style={{
              width:
                progressAnim.interpolate(
                  {
                    inputRange: [
                      0,
                      100,
                    ],
                    outputRange: [
                      "0%",
                      "100%",
                    ],
                  }
                ),
              height: "100%",
            }}
          >
            <LinearGradient
              colors={[
                "#8B5CF6",
                "#3B82F6",
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                flex: 1,
                borderRadius: 20,
              }}
            />
          </Animated.View>
        </View>

        <Text
          style={{
            color: "#94A3B8",
            marginTop: 14,
            fontSize: 16,
            fontWeight: "600",
          }}
        >
          {progress}%
        </Text>
      </LinearGradient>
    </>
  );
}