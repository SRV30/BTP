import { Text, TextInput, View } from 'react-native';

export default function AuthInput({ label, placeholder, secureTextEntry = false, value, onChangeText }) {
  return (
    <View className="mb-4">
      <Text className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
      />
    </View>
  );
}
