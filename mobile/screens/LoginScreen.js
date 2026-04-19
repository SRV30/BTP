import { useState } from 'react';
import { Text, View } from 'react-native';
import AuthInput from '../components/AuthInput';
import PrimaryButton from '../components/PrimaryButton';

export default function LoginScreen({ onLogin, onNavigateSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View className="flex-1 justify-center bg-slate-50 px-6 dark:bg-slate-900">
      <View className="rounded-3xl bg-white p-6 shadow-sm dark:bg-slate-900 dark:shadow-none">
        <Text className="text-3xl font-bold text-slate-900 dark:text-white">Welcome back</Text>
        <Text className="mt-2 text-sm text-slate-500 dark:text-slate-300">Login to continue tracking your mood.</Text>

        <View className="mt-6">
          <AuthInput label="Email" placeholder="you@email.com" value={email} onChangeText={setEmail} />
          <AuthInput
            label="Password"
            placeholder="Enter password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <PrimaryButton label="Login" onPress={onLogin} />
        <View className="mt-3">
          <PrimaryButton label="Create an account" variant="outline" onPress={onNavigateSignup} />
        </View>
      </View>
    </View>
  );
}
