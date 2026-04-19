import { Text, View } from 'react-native';

export default function MoodCard({ mood = 'Calm', note = 'You are doing great today. Keep checking in with yourself.' }) {
  return (
    <View className="rounded-3xl bg-brand-600 p-5 shadow-sm shadow-blue-200 dark:shadow-none">
      <Text className="text-sm font-medium text-brand-100">Today Mood</Text>
      <Text className="mt-2 text-3xl font-bold text-white">{mood}</Text>
      <Text className="mt-3 text-sm leading-5 text-brand-100">{note}</Text>
    </View>
  );
}
