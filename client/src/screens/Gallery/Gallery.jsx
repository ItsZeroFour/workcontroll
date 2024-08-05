import {
  View,
  Image,
  Platform,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Modal,
  Text,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import axios from "axios";
import mime from "mime";
import * as DocumentPicker from "expo-document-picker";
import * as MediaLibrary from "expo-media-library";
import Grid from "react-native-grid-component";

const GalleryContainer = styled.View`
  padding: 10px;
  flex: 1;
`;

const GalleryImage = styled.Image`
  width: ${Platform.OS === "web" ? "300px" : "150px"};
  height: ${Platform.OS === "web" ? "300px" : "150px"};
  border-radius: 10px;
  margin-top: 10px;
`;

const OrderImageButton = styled.TouchableOpacity`
  width: ${Platform.OS === "web" ? "300px" : "150px"};
  height: ${Platform.OS === "web" ? "300px" : "150px"};
  background: #d9d9d9;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  margin-right: 10px;
`;

const GalleryItem = styled.View`
  position: relative;
`;

const DeleteImageButton = styled.TouchableOpacity`
  position: absolute;
  z-index: 9;
  right: 0;
  top: 10px;
`;

const Gallery = ({ route }) => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const { gallery, data } = route.params;

  const screenWidth = Dimensions.get("window").width;
  const itemWidth = Platform.OS === "web" ? 300 : 150;
  const itemMargin = 10;

  const numColumns = Math.floor(screenWidth / (itemWidth + itemMargin));

  useEffect(() => {
    if (gallery && gallery.length !== 0) {
      setGalleryItems(gallery);
    }
  }, [gallery]);

  const updateOrder = async () => {
    try {
      const newData = {
        ...data,
        gallery: galleryItems,
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
      updateOrder();
    }
  }, [galleryItems]);

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
            setGalleryItems((prevGallery) => [
              response.data.url,
              ...prevGallery,
            ]);

            const newData = {
              ...data,
              gallery: galleryItems,
            };

            await axios.patch(
              `${process.env.SERVER_URL}/order/update`,
              newData
            );

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
            setGalleryItems((prevGallery) => [
              response.data.url,
              ...prevGallery,
            ]);

            alert("Файл успешно загружен");
          }
        }
      }
    } catch (error) {
      console.error("Ошибка при загрузке файла: ", error);
    }
  };

  const deleteImage = (imagePath) => {
    const updatedImages = galleryItems.filter((image) => image !== imagePath);
    setGalleryItems(updatedImages);
  };

  const confirmDelete = (imagePath) => {
    Alert.alert(
      "Подтвердите удаление",
      "Вы уверены, что хотите удалить этот файл?",
      [
        {
          text: "Нет",
          style: "cancel",
        },
        {
          text: "Да",
          onPress: () => deleteImage(imagePath),
        },
      ],
      { cancelable: false }
    );
  };

  const openModal = (index) => {
    setSelectedImage(`${process.env.SERVER_URL}${galleryItems[index]}`);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  return (
    <GalleryContainer>
      <ScrollView>
        <OrderImageButton onPress={pickFile}>
          <Image
            source={require("../../../assets/icons/Plus.png")}
            width={80}
            height={80}
          />
        </OrderImageButton>

        <Grid
          data={galleryItems}
          numColumns={numColumns}
          renderItem={(item, index) => (
            <GalleryItem>
              <DeleteImageButton onPress={() => confirmDelete(item)}>
                <Image
                  source={require("../../../assets/icons/Cross.png")}
                  style={{ width: 30, height: 30 }}
                />
              </DeleteImageButton>

              <TouchableOpacity
                onPress={() => openModal(index)}
                style={{
                  width: itemWidth,
                  marginLeft: index % numColumns !== 0 ? 10 : 0,
                  marginBottom: 10,
                }}
              >
                <GalleryImage
                  source={{ uri: `${process.env.SERVER_URL}${item}` }}
                  // style={index !== 0 ? { marginLeft: 10 } : { marginLeft: 0 }}
                />
              </TouchableOpacity>
            </GalleryItem>
          )}
        />
      </ScrollView>

      <Modal
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000",
          height: "100vh",
          width: "100vw",
        }}
        visible={modalVisible}
        // transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={closeModal}
            style={{
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {selectedImage && (
              <Image
                style={{
                  width: "90%",
                  height: "90%",
                  objectFit: "contain",
                }}
                source={{ uri: selectedImage }}
                resizeMode="contain"
              />
            )}
          </TouchableOpacity>
        </View>
      </Modal>
    </GalleryContainer>
  );
};

export default Gallery;
