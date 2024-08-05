import React, { useEffect, useState } from "react";
import {
  Button,
  ScrollView,
  Text,
  View,
  Platform,
  Dimensions,
  Image,
  FlatList,
} from "react-native";
import styled from "styled-components/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import InputMask from "react-input-mask";
import axios from "axios";
import * as DocumentPicker from "expo-document-picker";
import * as MediaLibrary from "expo-media-library";
import mime from "mime";

const screenWidth = Dimensions.get("window").width;

const OrderContainer = styled.View`
  padding: 20px;
`;

const OrderInputsContainer = styled.View`
  gap: 20px;
  width: ${screenWidth > 430 ? "60%" : "100%"};
`;

const OrderInput = styled.TextInput`
  border-color: #000;
  border-style: solid;
  border-width: 1px;
  padding: 5px;
  border-radius: 5px;
`;

const OrderInputMask = styled(InputMask)`
  border-color: #000;
  border-style: solid;
  border-width: 1px;
  padding: 5px;
  border-radius: 5px;
  width: 100%;
`;

const SelectDateButton = styled.TouchableOpacity`
  border-color: #000;
  border-style: solid;
  border-width: 1px;
  padding: 5px;
  border-radius: 5px;
`;

const ScrollViewWrapper = styled.View`
  flex-direction: ${screenWidth > 430 ? "row" : "column"};
  justify-content: space-between;
  justify-content: start;
  align-items: start;
  gap: 30px;
`;

const OrderImageButton = styled.TouchableOpacity`
  width: 150px;
  height: 150px;
  background: #d9d9d9;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
`;

const GalleryImage = styled.Image`
  width: 150px;
  height: 150px;
  border-radius: 10px;
  /* margin-left: ${screenWidth > 430 ? "10px" : "0px"}; */
`;

const GalleryWrapper = styled.View`
  flex-direction: ${screenWidth > 430 ? "row" : "column"};
  justify-content: end;
  align-items: end;
`;

const GalleryWrapperMore = styled.View`
  flex-direction: row;
  justify-content: end;
  align-items: end;
  margin-top: ${screenWidth > 430 ? "0px" : "10px"};
`;

const OrderImageText = styled.Text`
  font-size: 20px;
  font-weight: 700;
  text-align: center;
`;

const Order = ({ route, navigation }) => {
  const [client, setClient] = useState("");
  const [itemName, setItemName] = useState("");
  const [materials, setMaterials] = useState("");
  const [receiptDate, setReceiptDate] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [comment, setComment] = useState("");
  const [cutter, setCutter] = useState("");
  const [openDate, setOpenDate] = useState(false);
  const [openFittingDate, setOpenFittingDate] = useState(false);
  const [dueDateString, setDueDateString] = useState("");
  const [fittingDate, setFittingDate] = useState(null);
  const [fittingDateString, setFittingDateString] = useState("");
  const [fittingTime, setFittingTime] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [gallery, setGallery] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const { data } = route.params;

  useEffect(() => {
    setClient(data.client);
    setItemName(data.itemName);
    setMaterials(data.materials);
    setReceiptDate(data.receiptDate);
    setDueDate(new Date(data.dueDate) || null);
    setDueDateString(
      data.dueDate ? new Date(data.dueDate).toLocaleDateString("ru") : ""
    );
    setComment(data.comment);
    setCutter(data.cutter);
    setFittingDate(new Date(data.fittingDate) || null);
    setFittingDateString(
      data.fittingDate
        ? new Date(data.fittingDate).toLocaleDateString("ru")
        : ""
    );
    setFittingTime(data.fittingTime);

    // const reversedGallery = [...data.gallery].reverse();

    setGallery(data.gallery);
  }, [data]);

  const updateGallery = async () => {
    try {
      const newData = {
        ...data,
        gallery: gallery,
      };

      await axios.patch(`${process.env.SERVER_URL}/order/update`, newData);
    } catch (err) {
      console.log(err);
      alert("Ошибка обновления");
    }
  };

  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false);
    } else {
      updateGallery();
    }
  }, [gallery]);

  const onChange = (event, selectedDate) => {
    setOpenDate(false);
    setDueDate(selectedDate);
    setDueDateString(selectedDate ? selectedDate.toLocaleDateString("ru") : "");
  };

  const handleDateChange = (e) => {
    const { value } = e.target;
    setDueDateString(value);

    if (value === "__.__.____") {
      setDueDate("");
      return;
    }
    const [day, month, year] = value.split(".");
    const date = new Date(`${year}-${month}-${day}`);
    if (!isNaN(date.getTime())) {
      setDueDate(date);
    }
  };

  const onChangeFittingDate = (event, selectedDate) => {
    setOpenFittingDate(false);
    setFittingDate(selectedDate);
    setFittingDateString(
      selectedDate ? selectedDate.toLocaleDateString("ru") : ""
    );
  };

  const handleFittingDateChange = (e) => {
    const { value } = e.target;
    setFittingDateString(value);

    if (value === "__.__.____") {
      setFittingDate("");
      return;
    }
    const [day, month, year] = value.split(".");
    const date = new Date(`${year}-${month}-${day}`);
    if (!isNaN(date.getTime())) {
      setFittingDate(date);
    }
  };

  const handleFittingTimeChange = (e) => {
    const { value } = e.target;
    setFittingTime(value);

    if (value === "__:__") {
      setFittingDate("");
      return;
    }
  };

  const handleTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || fittingTime;
    setShowPicker(Platform.OS === "ios"); // Для iOS оставляем picker открытым
    setFittingTime(
      currentDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    );
  };

  const pickFile = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (Platform.OS !== "web" && status !== "granted") {
        return alert("Нам нужно разрешение для доступа к вашей медиатеке!");
      }

      const result = await DocumentPicker.getDocumentAsync({});

      if (!result.canceled) {
        const formData = new FormData();

        /* if Platform is Android or IOS - we do this */
        if (Platform.OS !== "web") {
          const fileData = {
            uri: result.assets[0].uri,
            name: result.assets[0].name,
            type: mime.getType(result.assets[0].uri),
            size: result.assets[0].size,
          };

          formData.append("file", fileData);

          const response = await axios.post(
            `${process.env.SERVER_URL}/upload`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (response.status === 200) {
            setGallery((prevGallery) => [response.data.url, ...prevGallery]);

            alert("Файл успешно загружен");
          }
          /* If platform is web - we do this */
        } else {
          const fileData = {
            uri: result.assets[0].uri,
            name: result.assets[0].name,
            type: mime.getType(result.assets[0].uri),
            size: result.assets[0].size,
          };

          const responseUri = await fetch(fileData.uri);
          const blob = await responseUri.blob();

          formData.append("file", blob, fileData.name);

          const response = await axios.post(
            `${process.env.SERVER_URL}/upload`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (response.status === 200) {
            setGallery((prevGallery) => [response.data.url, ...prevGallery]);

            alert("Файл успешно загружен");
          }
        }
      }
    } catch (error) {
      console.error("Ошибка при загрузке файла: ", error);
    }
  };

  const handleViewMore = () => {
    navigation.navigate("gallery", { gallery: gallery, data: data });
  };

  const updateOrder = async () => {
    try {
      const newData = {
        ...data,
        client: client,
        itemName: itemName,
        materials: materials,
        receiptDate: receiptDate,
        dueDate: dueDate,
        comment: comment,
        cutter: cutter,
        fittingDate: fittingDate,
        fittingTime: fittingTime,
        gallery: gallery,
      };

      await axios.patch(`${process.env.SERVER_URL}/order/update`, newData);

      alert("Успешно!");
    } catch (err) {
      console.log(err);
      alert("Не удалось обновить заказ");
    }
  };

  return (
    <OrderContainer>
      <ScrollView>
        <ScrollViewWrapper>
          <OrderInputsContainer>
            <View>
              <Text>Клиент</Text>
              <OrderInput
                onChangeText={(prompt) => setClient(prompt)}
                value={client}
              />
            </View>

            <View>
              <Text>Наименование изделия</Text>
              <OrderInput
                onChangeText={(prompt) => setItemName(prompt)}
                value={itemName}
              />
            </View>

            <View>
              <Text>Материалы</Text>
              <OrderInput
                multiline={true}
                numberOfLines={4}
                onChangeText={(prompt) => setMaterials(prompt)}
                value={materials}
              />
            </View>

            <View>
              <Text>Дата приёмки заказа</Text>
              <OrderInput
                value={new Date(receiptDate).toLocaleDateString("ru")}
                editable={false}
                selectTextOnFocus={false}
              />
            </View>

            <View>
              <Text>Дата сдачи заказа</Text>
              {Platform.OS === "web" ? (
                <OrderInputMask
                  mask="99.99.9999"
                  value={dueDateString !== "01.01.1970" ? dueDateString : ""}
                  onChange={handleDateChange}
                />
              ) : (
                <SelectDateButton onPress={() => setOpenDate(true)}>
                  <Text>{dueDateString || "Выбрать дату"}</Text>
                </SelectDateButton>
              )}

              {openDate && Platform.OS !== "web" && (
                <DateTimePicker
                  value={dueDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={onChange}
                />
              )}
            </View>

            <View>
              <Text>Комментарии к изделию</Text>
              <OrderInput
                multiline={true}
                numberOfLines={4}
                onChangeText={(prompt) => setComment(prompt)}
                value={comment}
              />
            </View>

            <View>
              <Text>Закройщик</Text>
              <OrderInput
                onChangeText={(prompt) => setCutter(prompt)}
                value={cutter}
              />
            </View>

            <Button title="Сохранить" onPress={updateOrder} />
          </OrderInputsContainer>

          <View>
            <GalleryWrapper>
              <View>
                <Text>Галерея</Text>

                <OrderImageButton onPress={pickFile}>
                  <Image
                    source={require("../../../assets/icons/Plus.png")}
                    width={80}
                    height={80}
                  />
                </OrderImageButton>
              </View>

              {gallery.length > 2 ? (
                <GalleryWrapperMore>
                  <GalleryImage
                    source={{ uri: `${process.env.SERVER_URL}${gallery[0]}` }}
                    style={
                      screenWidth > 430 ? { marginLeft: 10 } : { marginLeft: 0 }
                    }
                  />
                  <OrderImageButton
                    onPress={handleViewMore}
                    style={{ marginLeft: 10 }}
                  >
                    <OrderImageText>Еще {gallery.length} файла</OrderImageText>
                  </OrderImageButton>
                </GalleryWrapperMore>
              ) : (
                <FlatList
                  data={gallery}
                  keyExtractor={(item) => item}
                  horizontal={true}
                  renderItem={({ item, index }) => (
                    <GalleryImage
                      source={{ uri: `${process.env.SERVER_URL}${item}` }}
                      style={
                        screenWidth > 430
                          ? { marginLeft: 10 }
                          : index > 0 && screenWidth < 430
                          ? { marginLeft: 10 }
                          : { marginLeft: 0 }
                      }
                    />
                  )}
                />
              )}
            </GalleryWrapper>

            <View>
              <Text>Дата примерки</Text>
              {Platform.OS === "web" ? (
                <OrderInputMask
                  mask="99.99.9999"
                  value={
                    fittingDateString !== "01.01.1970" ? fittingDateString : ""
                  }
                  onChange={handleFittingDateChange}
                />
              ) : (
                <SelectDateButton onPress={() => setOpenFittingDate(true)}>
                  <Text>
                    {fittingDateString !== "01.01.1970"
                      ? fittingDateString
                      : "Выбрать дату"}
                  </Text>
                </SelectDateButton>
              )}

              {openFittingDate && Platform.OS !== "web" && (
                <DateTimePicker
                  value={fittingDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={onChangeFittingDate}
                />
              )}
            </View>

            <View>
              <Text>Время примерки</Text>
              {Platform.OS === "web" ? (
                <OrderInputMask
                  mask="99:99"
                  value={fittingTime}
                  onChange={handleFittingTimeChange}
                />
              ) : (
                <View>
                  <OrderInput
                    value={fittingTime}
                    onFocus={() => setShowPicker(true)}
                    // editable={false}
                    placeholder="Выберите время"
                  />
                  {showPicker && (
                    <DateTimePicker
                      value={new Date()}
                      mode="time"
                      display="default"
                      onChange={handleTimeChange}
                    />
                  )}
                </View>
              )}
            </View>
          </View>
        </ScrollViewWrapper>
      </ScrollView>
    </OrderContainer>
  );
};

export default Order;
