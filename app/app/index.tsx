import { View, Text, Image, StatusBar, Animated, Easing } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";

import logo from "../assets/images/logo.png";

export default function SplashScreen() {
  const router = useRouter();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),

      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 70,
        useNativeDriver: true,
      }),

      Animated.timing(progressAnim, {
        toValue: 100,
        duration: 2500,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ]).start();

    const listener = progressAnim.addListener(({ value }) => {
      setProgress(Math.floor(value));
    });

    const timer = setTimeout(() => {
      router.replace("/login");
    }, 2600);

    return () => {
      clearTimeout(timer);
      progressAnim.removeListener(listener);
    };
  }, [fadeAnim, progressAnim, router, scaleAnim]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={["#010314", "#020B2D", "#010314"]}
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 30,
        }}
      >
        <View
          style={{
            position: "absolute",
            width: 340,
            height: 340,
            borderRadius: 170,
            backgroundColor: "rgba(59,130,246,0.12)",
            top: 140,
          }}
        />

        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
            alignItems: "center",
          }}
        >
          <Image
            source={logo}
            style={{
              width: 250,
              height: 250,
              marginBottom: 10,
            }}
          />

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: -10,
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 38,
                fontWeight: "800",
                letterSpacing: 0.5,
              }}
            >
              MoodSense
            </Text>

            <Text
              style={{
                color: "#A855F7",
                fontSize: 38,
                fontWeight: "800",
                marginLeft: 10,
              }}
            >
              AI
            </Text>
          </View>

          <Text
            style={{
              color: "#CBD5E1",
              fontSize: 18,
              marginTop: 14,
              textAlign: "center",
            }}
          >
            AI-Powered Mental Wellness
          </Text>

          <View
            style={{
              marginTop: 120,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#94A3B8",
                fontSize: 18,
                textAlign: "center",
                lineHeight: 34,
                marginBottom: 28,
              }}
            >
              Understanding You,{"\n"}
              Enhancing Your Tomorrow.
            </Text>

            <View
              style={{
                width: 260,
                height: 7,
                backgroundColor: "rgba(255,255,255,0.08)",
                borderRadius: 20,
                overflow: "hidden",
              }}
            >
              <Animated.View
                style={{
                  width: progressWidth,
                  height: "100%",
                  borderRadius: 20,
                  overflow: "hidden",
                }}
              >
                <LinearGradient
                  colors={["#A855F7", "#3B82F6"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    flex: 1,
                  }}
                />
              </Animated.View>
            </View>

            <Text
              style={{
                color: "#A855F7",
                fontSize: 16,
                fontWeight: "700",
                marginTop: 14,
              }}
            >
              {progress}%
            </Text>
          </View>
        </Animated.View>
      </LinearGradient>
    </>
  );
}
