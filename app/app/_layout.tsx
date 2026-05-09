import { Stack } from "expo-router";
import { AuthProvider } from "../store/auth-context";

export default function Layout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}
