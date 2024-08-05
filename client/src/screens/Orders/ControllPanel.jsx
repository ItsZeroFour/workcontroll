import React, { useState } from "react";
import {
  Button,
  Dimensions,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import styled from "styled-components/native";

const screenWidth = Dimensions.get("window").width;

const ControllPanelContainer = styled.View`
  margin-bottom: 20px;
  margin-top: 20px;
  flex-direction: ${screenWidth > 430 ? "row" : "column"};
  align-items: end;
  justify-content: space-between;
  gap: 20px;
`;
const ControllPanelSearchContainer = styled.View``;
const ControllPanelSearchButtons = styled.View`
  flex-direction: row;
  gap: 10px;
  color: red;
`;
const ControllPanelSearchButton = styled.Button`
  width: auto;
`;
const ControllPanelSearchInput = styled.TextInput`
  border-width: 1px;
  border-style: solid;
  border-color: #000;
  padding: 5px;
  border-radius: 5px;
  margin-bottom: 10px;
`;

const OrderTypeContainer = styled.View`
  gap: ${screenWidth > 430 ? "10px" : "20px"};
  margin-top: 20px;
`;

const TouchableOpacityButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;

const OrderLinks = styled.View`
  gap: 10px;
`;

const ControllPanel = ({
  navigation,
  setSearchPrompt,
  setSearchType,
  searchPrompt,
  searchType,
  orderType,
  setOrderType,
}) => {
  console.log(navigation);

  return (
    <ControllPanelContainer>
      <ControllPanelSearchContainer>
        <ControllPanelSearchInput
          onChangeText={(prompt) => setSearchPrompt(prompt)}
          value={searchPrompt}
          placeholder="Поиск..."
        />

        <ControllPanelSearchButtons>
          <ControllPanelSearchButton
            title="по клиенту"
            onPress={() => setSearchType("client")}
            color={searchType === "client" && "#d9d9d9"}
          />
          <ControllPanelSearchButton
            title="по работнику"
            onPress={() => setSearchType("worker")}
            color={searchType === "worker" && "#d9d9d9"}
          />
          <ControllPanelSearchButton
            title="по номеру"
            onPress={() => setSearchType("number")}
            color={searchType === "number" && "#d9d9d9"}
          />
        </ControllPanelSearchButtons>
      </ControllPanelSearchContainer>

      <OrderTypeContainer>
        <TouchableOpacityButton onPress={() => setOrderType("idea")}>
          <Text
            style={
              orderType === "idea"
                ? {
                    borderBottomWidth: 1,
                    borderBottomColor: "black",
                    borderStyle: "solid",
                  }
                : { borderBottomWidth: 0 }
            }
          >
            Идеи заказов
          </Text>

          <Text>20шт.</Text>
        </TouchableOpacityButton>

        <TouchableOpacityButton onPress={() => setOrderType("pending")}>
          <Text
            style={
              orderType === "pending"
                ? {
                    borderBottomWidth: 1,
                    borderBottomColor: "black",
                    borderStyle: "solid",
                  }
                : { borderBottomWidth: 0 }
            }
          >
            Заказы в ожидании
          </Text>

          <Text>20шт.</Text>
        </TouchableOpacityButton>

        <TouchableOpacityButton onPress={() => setOrderType("inWork")}>
          <Text
            style={
              orderType === "inWork"
                ? {
                    borderBottomWidth: 1,
                    borderBottomColor: "black",
                    borderStyle: "solid",
                  }
                : { borderBottomWidth: 0 }
            }
          >
            Заказы в работе
          </Text>

          <Text>20шт.</Text>
        </TouchableOpacityButton>

        <TouchableOpacityButton onPress={() => setOrderType("archive")}>
          <Text
            style={
              orderType === "archive"
                ? {
                    borderBottomWidth: 1,
                    borderBottomColor: "black",
                    borderStyle: "solid",
                  }
                : { borderBottomWidth: 0 }
            }
          >
            Архив заказов
          </Text>

          <Text>20шт.</Text>
        </TouchableOpacityButton>
      </OrderTypeContainer>

      <OrderLinks>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 5,
            backgroundColor: "#DDDDDD",
            borderRadius: 5,
            width: screenWidth > 430 ? 370 : "100%",
          }}
          onPress={() => navigation.navigate("new-order")}
        >
          <Image
            source={require("../../../assets/icons/Plus.png")}
            width={20}
            height={20}
          />
          <Text style={{ fontSize: 18 }}>новый заказ</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 5,
            backgroundColor: "#DDDDDD",
            borderRadius: 5,
            width: screenWidth > 430 ? 370 : "100%",
          }}
          onPress={() => navigation.navigate("")}
        >
          <Image
            source={require("../../../assets/icons/Plus.png")}
            width={20}
            height={20}
          />
          <Text style={{ fontSize: 18 }}>новая идея</Text>
        </TouchableOpacity>
      </OrderLinks>
    </ControllPanelContainer>
  );
};

export default ControllPanel;
