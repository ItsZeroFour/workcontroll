import React, { useState } from "react";
import { Button, Image } from "react-native";
import { useDispatch } from "react-redux";
import { fetchLogin } from "../../redux/slices/auth";
import styled from "styled-components/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Logo from "../../components/Logo";

const LoginContainer = styled.View`
  padding: 20px;

  flex: 1;
  justify-content: center;
  align-items: center;
`;

const LoginWrapper = styled.View`
  margin-top: 40px;
`;

const Form = styled.View`
  gap: 10px;
`;

const Input = styled.TextInput`
  border: 1px solid #000;
  padding: 5px;
  width: 300px;
`;

const Login = ({ navigation }) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const loginUser = async () => {
    const data = await dispatch(fetchLogin({ login, password }));

    if (!data.payload) {
      alert("Не удалось войти");
    }

    if ("token" in data.payload) {
      await AsyncStorage.setItem("token", data.payload.token);
      alert("Успешно!");
    }
  };

  return (
    <LoginContainer>
      <Logo width={120} height={100} />

      <LoginWrapper>
        <Form>
          <Input
            onChangeText={(value) => setLogin(value)}
            value={login}
            placeholder="Логин"
          />
          <Input
            onChangeText={(pass) => setPassword(pass)}
            value={password}
            placeholder="Пароль"
            secureTextEntry
          />
          <Button title="Войти" onPress={loginUser} color="#9B9B9B" />
        </Form>
      </LoginWrapper>
    </LoginContainer>
  );
};

export default Login;
