import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
  ActivityIndicator,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { authApi } from "../../services/api";

import logo from "../../assets/images/logo.png";

export default function LoginScreen() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),

      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),

      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 70,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        alert("Please enter email and password");
        return;
      }

      setLoading(true);

      const response = await authApi.login({
        email,
        password,
      });

      const token = response.data.access_token;

      await AsyncStorage.setItem("moodsense_token", token);

      alert("Login Successful");

      router.replace("/dashboard");
    } catch (error: any) {
      console.log(error?.response?.data);

      alert(error?.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={["#020617", "#020B2D", "#020617"]}
        style={{
          flex: 1,
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              paddingHorizontal: 28,
              paddingVertical: 40,
            }}
          >
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  marginBottom: 30,
                }}
              >
                <View
                  style={{
                    width: 90,
                    height: 90,
                    borderRadius: 28,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(139,92,246,0.18)",
                    borderWidth: 1.5,
                    borderColor: "rgba(139,92,246,0.45)",
                    shadowColor: "#8B5CF6",
                    shadowOpacity: 0.45,
                    shadowRadius: 20,
                    elevation: 15,
                    marginBottom: 24,
                  }}
                >
                  <Image
                    source={logo}
                    style={{
                      width: 52,
                      height: 52,
                      resizeMode: "contain",
                    }}
                  />
                </View>

                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 40,
                    fontWeight: "700",
                  }}
                >
                  Welcome Back
                </Text>

                <Text
                  style={{
                    color: "#9CA3AF",
                    fontSize: 18,
                    marginTop: 8,
                  }}
                >
                  Glad to see you again!
                </Text>
              </View>

              <View
                style={{
                  backgroundColor: "rgba(10,18,45,0.88)",
                  borderRadius: 28,
                  paddingHorizontal: 22,
                  paddingVertical: 24,
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.06)",
                }}
              >
                <Text
                  style={{
                    color: "#BFC7D5",
                    fontSize: 15,
                    marginBottom: 14,
                  }}
                >
                  Email
                </Text>

                <TextInput
                  placeholder="example@email.com"
                  placeholderTextColor="#6B7280"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={{
                    color: "#FFFFFF",
                    fontSize: 17,
                    borderBottomWidth: 1,
                    borderBottomColor: "rgba(255,255,255,0.08)",
                    paddingBottom: 16,
                    marginBottom: 30,
                  }}
                />

                <Text
                  style={{
                    color: "#BFC7D5",
                    fontSize: 15,
                    marginBottom: 14,
                  }}
                >
                  Password
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    borderBottomWidth: 1,
                    borderBottomColor: "rgba(255,255,255,0.08)",
                    paddingBottom: 16,
                  }}
                >
                  <TextInput
                    placeholder="••••••••"
                    placeholderTextColor="#6B7280"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    style={{
                      flex: 1,
                      color: "#FFFFFF",
                      fontSize: 17,
                    }}
                  />

                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <FontAwesome
                      name={showPassword ? "eye-slash" : "eye"}
                      size={21}
                      color="#9CA3AF"
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={{
                    alignSelf: "flex-end",
                    marginTop: 18,
                  }}
                  onPress={() => router.push("/forgot-password")}
                >
                  <Text
                    style={{
                      color: "#8B5CF6",
                      fontSize: 15,
                      fontWeight: "500",
                    }}
                  >
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={handleLogin}
                disabled={loading}
                style={{
                  marginTop: 28,
                  borderRadius: 18,
                  overflow: "hidden",
                  shadowColor: "#3B82F6",
                  shadowOpacity: 0.4,
                  shadowRadius: 16,
                  elevation: 12,
                }}
              >
                <LinearGradient
                  colors={["#9333EA", "#3B82F6"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    paddingVertical: 18,
                    alignItems: "center",
                    borderRadius: 18,
                  }}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text
                      style={{
                        color: "#FFFFFF",
                        fontSize: 21,
                        fontWeight: "700",
                      }}
                    >
                      Sign In
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 42,
                  marginBottom: 32,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: "rgba(255,255,255,0.08)",
                  }}
                />

                <Text
                  style={{
                    color: "#9CA3AF",
                    marginHorizontal: 14,
                    fontSize: 14,
                  }}
                >
                  or continue with
                </Text>

                <View
                  style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: "rgba(255,255,255,0.08)",
                  }}
                />
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 22,
                }}
              >
                {["google", "github", "facebook"].map((icon, index) => (
                  <TouchableOpacity
                    key={index}
                    style={{
                      width: 74,
                      height: 74,
                      borderRadius: 37,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "rgba(10,18,45,0.85)",
                      borderWidth: 1,
                      borderColor: "rgba(255,255,255,0.08)",
                    }}
                  >
                    <FontAwesome name={icon as any} size={30} color="#FFFFFF" />
                  </TouchableOpacity>
                ))}
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  marginTop: 60,
                }}
              >
                <Text
                  style={{
                    color: "#9CA3AF",
                    fontSize: 16,
                  }}
                >
                  Don&apos;t have an account?
                </Text>

                <TouchableOpacity onPress={() => router.push("/signup")}>
                  <Text
                    style={{
                      color: "#8B5CF6",
                      fontSize: 16,
                      fontWeight: "700",
                      marginLeft: 6,
                    }}
                  >
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </>
  );
}
