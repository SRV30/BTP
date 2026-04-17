import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, View, Pressable, Text } from 'react-native';
import { useState } from 'react';
import { AuthProvider, useAuth } from './store/authStore';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import DashboardScreen from './screens/DashboardScreen';

function AppNavigator() {
  const { isAuthenticated, login, signup, logout } = useAuth();
  const [authScreen, setAuthScreen] = useState('login');

  if (isAuthenticated) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900">
        <DashboardScreen />
        <View className="px-6 pb-6">
          <Pressable onPress={logout} className="rounded-2xl border border-brand-600 px-4 py-3">
            <Text className="text-center font-semibold text-brand-700 dark:text-brand-100">Logout</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return authScreen === 'login' ? (
    <LoginScreen onLogin={login} onNavigateSignup={() => setAuthScreen('signup')} />
  ) : (
    <SignupScreen onSignup={signup} onNavigateLogin={() => setAuthScreen('login')} />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <AppNavigator />
    </AuthProvider>
  );
}
