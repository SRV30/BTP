import { Text, View } from 'react-native';

export default function EmotionBadge({ label, value }) {
  return (
    <View className="mr-3 rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
      <Text className="text-xs text-slate-500 dark:text-slate-400">{label}</Text>
      <Text className="mt-1 text-base font-semibold text-slate-800 dark:text-white">{value}</Text>
    </View>
  );
}
