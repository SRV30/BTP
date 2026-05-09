import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function ForgotPasswordScreen() {
  const router = useRouter();

  return (
    <>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={["#020617", "#020B2D", "#020617"]}
        style={{
          flex: 1,
          justifyContent: "center",
          paddingHorizontal: 28,
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 38,
              fontWeight: "700",
              textAlign: "center",
            }}
          >
            Forgot Password
          </Text>

          <Text
            style={{
              color: "#9CA3AF",
              fontSize: 17,
              textAlign: "center",
              marginTop: 14,
              marginBottom: 40,
              lineHeight: 28,
            }}
          >
            Enter your email to reset password
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
              style={{
                color: "#FFFFFF",
                fontSize: 17,
                borderBottomWidth: 1,
                borderBottomColor: "rgba(255,255,255,0.08)",
                paddingBottom: 16,
              }}
            />
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
                Send Reset Link
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              marginTop: 32,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#8B5CF6",
                fontSize: 16,
                fontWeight: "700",
              }}
            >
              Back to Login
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </LinearGradient>
    </>
  );
}
