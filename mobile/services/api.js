import { Platform } from 'react-native';
import axios from 'axios';

const resolveDefaultBaseUrl = () => {
  if (Platform.OS === 'android') {
    // Android emulator loopback to host machine
    return 'http://10.0.2.2:8000';
  }
  return 'http://127.0.0.1:8000';
};

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL || resolveDefaultBaseUrl(),
  timeout: 10000,
});

export default api;
