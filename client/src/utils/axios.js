import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const instance = axios.create({
  baseURL: process.env.SERVER_URL,
});

instance.interceptors.request.use(
  async (config) => {
    // Асинхронно получаем токен из AsyncStorage
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Добавляем токен в заголовок
    }
    return config;
  },
  (error) => {
    // Обрабатываем ошибки запроса
    return Promise.reject(error);
  }
);

export default instance;
