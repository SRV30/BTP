import { Pressable, Text } from 'react-native';

export default function PrimaryButton({ label, onPress, variant = 'primary' }) {
  const baseClass =
    variant === 'outline'
      ? 'border border-brand-600 bg-transparent'
      : 'bg-brand-600';

  const textClass = variant === 'outline' ? 'text-brand-700 dark:text-brand-100' : 'text-white';

  return (
    <Pressable
      onPress={onPress}
      className={`w-full rounded-2xl px-4 py-3 ${baseClass}`}
      android_ripple={{ color: 'rgba(255,255,255,0.25)' }}
    >
      <Text className={`text-center text-base font-semibold ${textClass}`}>{label}</Text>
    </Pressable>
  );
}
