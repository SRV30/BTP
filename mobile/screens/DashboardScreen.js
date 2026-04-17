import { ScrollView, Text, View } from 'react-native';
import MoodCard from '../components/MoodCard';
import EmotionBadge from '../components/EmotionBadge';

export default function DashboardScreen() {
  return (
    <ScrollView className="flex-1 bg-slate-50 px-6 pt-16 dark:bg-slate-900" contentContainerStyle={{ paddingBottom: 32 }}>
      <Text className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</Text>
      <Text className="mt-2 text-sm text-slate-500 dark:text-slate-300">Your daily emotional snapshot (static preview).</Text>

      <View className="mt-6">
        <MoodCard />
      </View>

      <View className="mt-6 rounded-3xl bg-white p-5 shadow-sm dark:bg-slate-800 dark:shadow-none">
        <Text className="text-base font-semibold text-slate-900 dark:text-white">Simple Emotion Display</Text>
        <View className="mt-4 flex-row flex-wrap">
          <EmotionBadge label="Primary" value="Calm" />
          <EmotionBadge label="Energy" value="Balanced" />
          <EmotionBadge label="Stress" value="Low" />
        </View>
      </View>
    </ScrollView>
  );
}
