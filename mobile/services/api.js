import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.moodsense.local',
  timeout: 10000
});

export default api;
