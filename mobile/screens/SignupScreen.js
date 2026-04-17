import { useState } from 'react';
import { Text, View } from 'react-native';
import AuthInput from '../components/AuthInput';
import PrimaryButton from '../components/PrimaryButton';

export default function SignupScreen({ onSignup, onNavigateLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View className="flex-1 justify-center bg-slate-50 px-6 dark:bg-slate-900">
      <View className="rounded-3xl bg-white p-6 shadow-sm dark:bg-slate-900 dark:shadow-none">
        <Text className="text-3xl font-bold text-slate-900 dark:text-white">Create account</Text>
        <Text className="mt-2 text-sm text-slate-500 dark:text-slate-300">Start your MoodSense AI wellness journey.</Text>

        <View className="mt-6">
          <AuthInput label="Full Name" placeholder="Your name" value={name} onChangeText={setName} />
          <AuthInput label="Email" placeholder="you@email.com" value={email} onChangeText={setEmail} />
          <AuthInput
            label="Password"
            placeholder="Create password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <PrimaryButton label="Signup" onPress={onSignup} />
        <View className="mt-3">
          <PrimaryButton label="Back to login" variant="outline" onPress={onNavigateLogin} />
        </View>
      </View>
    </View>
  );
}
