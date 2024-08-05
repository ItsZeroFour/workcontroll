import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchGetAllOrders } from "../../redux/slices/order";
import styled from "styled-components/native";
import ControllPanel from "./ControllPanel";
import Logo from "../../components/Logo";

const screenWidth = Dimensions.get("window").width;

const OrderContainer = styled.View`
  padding: 20px;
  margin-top: 20px;
`;

const OrderItem = styled.TouchableOpacity`
  flex-direction: column;
  gap: 10px;
  width: ${screenWidth > 430 ? "370px" : "100%"};
  height: ${screenWidth > 430 ? "220px" : "auto"};
  background: #d9d9d9;
  margin-right: ${screenWidth > 430 ? "20px" : "0"};
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 10px;
`;

const OrderItemTop = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const OrderClient = styled.View``;

const OrderItemName = styled.View``;

const OrderDates = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: auto;
`;

const TextBold = styled.Text`
  font-weight: 700;
  font-size: 18px;
`;

const LogoWrapper = styled.View`
  justify-content: flex-end;
  align-items: flex-end;
`;

const Order = ({ navigation }) => {
  const [searchPrompt, setSearchPrompt] = useState("");
  const [searchType, setSearchType] = useState("client");
  const [orderType, setOrderType] = useState("inWork");

  const dispatch = useDispatch();

  const { data } = useSelector((state) => state.order);

  const fetchOrders = () => {
    dispatch(fetchGetAllOrders());
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filterData = () => {
    if (!searchPrompt) return data;

    return data.filter((item) => {
      switch (searchType) {
        case "client":
          return item.client.toLowerCase().includes(searchPrompt.toLowerCase());
        case "worker":
          return item.cutter.toLowerCase().includes(searchPrompt.toLowerCase());
        case "number":
          return item.number.toString().includes(searchPrompt);
        default:
          return false;
      }
    });
  };

  const filteredData = filterData();

  return (
    <OrderContainer>
      {data && (
        <ScrollView refreshControl={<RefreshControl onRefresh={fetchOrders} />}>
          <LogoWrapper>
            <Logo width={80} height={60} />
          </LogoWrapper>

          <ControllPanel
            setSearchPrompt={setSearchPrompt}
            setSearchType={setSearchType}
            setOrderType={setOrderType}
            searchPrompt={searchPrompt}
            searchType={searchType}
            orderType={orderType}
            navigation={navigation}
          />

          <FlatList
            data={filteredData}
            keyExtractor={(item) => item._id}
            horizontal={screenWidth > 430 ? true : false}
            renderItem={({ item }) => (
              <OrderItem
                onPress={() => navigation.navigate("order", { data: item })}
              >
                <OrderItemTop>
                  <Text>№ {item.number}</Text>
                  <Text>
                    {item.status === "work"
                      ? "В работе"
                      : item.status === "pending"
                      ? "В ожидании"
                      : "Сдан"}
                  </Text>
                </OrderItemTop>

                <OrderClient>
                  <Text>Клиент</Text>
                  <TextBold>{item.client}</TextBold>
                </OrderClient>

                <OrderItemName>
                  <Text>Наименование изделия</Text>
                  <TextBold>{item.itemName}</TextBold>
                </OrderItemName>

                <OrderDates>
                  <View>
                    <Text>Дата приемки заказа</Text>
                    <Text>
                      {item.receiptDate
                        ? new Date(item.receiptDate).toLocaleDateString()
                        : "-"}
                    </Text>
                  </View>

                  <View>
                    <Text>Дата сдачи заказа</Text>
                    <Text>
                      {item.dueDate
                        ? new Date(item.dueDate).toLocaleDateString()
                        : "-"}
                    </Text>
                  </View>
                </OrderDates>
              </OrderItem>
            )}
          />
        </ScrollView>
      )}
    </OrderContainer>
  );
};

export default Order;
