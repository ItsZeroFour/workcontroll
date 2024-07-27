import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Создаем экземпляр axios с базовым URL
const instance = axios.create({
  baseURL: process.env.SERVER_URL, // Используем переменную окружения Expo
});

// Добавляем интерсептор для запросов
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
