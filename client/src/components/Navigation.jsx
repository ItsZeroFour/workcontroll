import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Login from "../screens/Login/Login";
import Orders from "../screens/Orders/Orders";
import Loading from "../screens/Loading/Loading";
import Order from "../screens/Order/Order";
import NewOrder from "../screens/NewOrder/NewOrder";
import Gallery from "../screens/Gallery/Gallery";

const Stack = createNativeStackNavigator();

export const Navigation = ({ isAuth, isLoadingMe }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoadingMe === "loading" ? (
          <Stack.Screen
            name="loading"
            component={Loading}
            options={{ title: "Загрузка..." }}
          />
        ) : isLoadingMe === "loaded" && !isAuth ? (
          <Stack.Screen
            name="login"
            component={Login}
            options={{ title: "Авторизация" }}
          />
        ) : (
          <>
            <Stack.Screen
              name="orders"
              component={Orders}
              options={{ title: "Все заказы" }}
            />

            <Stack.Screen
              name="order"
              component={Order}
              options={{ title: "Заказ" }}
            />

            <Stack.Screen
              name="new-order"
              component={NewOrder}
              options={{ title: "Новый заказ" }}
            />

            <Stack.Screen
              name="gallery"
              component={Gallery}
              options={{ title: "Галерея" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
