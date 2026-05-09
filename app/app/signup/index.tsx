import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";

export default function SignupScreen() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

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
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              paddingHorizontal: 28,
              paddingVertical: 60,
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 40,
                fontWeight: "700",
                textAlign: "center",
              }}
            >
              Create Account
            </Text>

            <Text
              style={{
                color: "#9CA3AF",
                fontSize: 18,
                marginTop: 10,
                textAlign: "center",
                marginBottom: 40,
              }}
            >
              Start your wellness journey
            </Text>

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
              <View
                style={{
                  marginBottom: 28,
                }}
              >
                <Text
                  style={{
                    color: "#BFC7D5",
                    fontSize: 15,
                    marginBottom: 14,
                  }}
                >
                  Full Name
                </Text>

                <TextInput
                  placeholder="Enter Full Name"
                  placeholderTextColor="#6B7280"
                  style={{
                    color: "#FFFFFF",
                    fontSize: 17,
                    borderBottomWidth: 1,
                    borderBottomColor: "rgba(255,255,255,0.08)",
                    paddingBottom: 16,
                  }}
                />
              </View>

              <View
                style={{
                  marginBottom: 28,
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
                  placeholder="Enter Email"
                  placeholderTextColor="#6B7280"
                  style={{
                    color: "#FFFFFF",
                    fontSize: 17,
                    borderBottomWidth: 1,
                    borderBottomColor: "rgba(255,255,255,0.08)",
                    paddingBottom: 16,
                  }}
                />
              </View>

              <View>
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
                    style={{
                      flex: 1,
                      color: "#FFFFFF",
                      fontSize: 17,
                    }}
                  />

                  <TouchableOpacity
                    onPress={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    <FontAwesome
                      name={
                        showPassword
                          ? "eye-slash"
                          : "eye"
                      }
                      size={21}
                      color="#9CA3AF"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              style={{
                marginTop: 28,
                borderRadius: 18,
                overflow: "hidden",
              }}
            >
              <LinearGradient
                colors={["#9333EA", "#3B82F6"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  paddingVertical: 18,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 21,
                    fontWeight: "700",
                  }}
                >
                  Create Account
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginTop: 40,
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  color: "#9CA3AF",
                  fontSize: 16,
                }}
              >
                Already have an account?
              </Text>

              <TouchableOpacity
                onPress={() => router.back()}
              >
                <Text
                  style={{
                    color: "#8B5CF6",
                    fontSize: 16,
                    fontWeight: "700",
                    marginLeft: 6,
                  }}
                >
                  Login
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </>
  );
}