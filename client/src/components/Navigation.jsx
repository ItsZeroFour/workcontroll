import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Login from "../screens/Login/Login";
import Orders from "../screens/Orders/Orders";

const Stack = createNativeStackNavigator();

export const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="login"
          component={Login}
          options={{ title: "Авторизация" }}
        />

        <Stack.Screen
          name="orders"
          component={Orders}
          options={{ title: "Все заказы" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
