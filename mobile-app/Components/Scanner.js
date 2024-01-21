import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { Camera } from "expo-camera";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";

const Scanner = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const cameraRef = useRef(null);
  const { width, height } = Dimensions.get("screen");

  const setupCamera = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    setHasPermission(status === "granted");
  };

  useFocusEffect(
    React.useCallback(() => {
      setupCamera();

      return () => {};
    }, [])
  );

  const handleButtonClick = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      console.log(photo);
      console.log(photo.uri);

      const imgURL = photo.uri;

      fetch(imgURL)
        .then((response) => response.blob())
        .then((blob) => {
          // Convert the blob to base64
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        })
        .then((base64String) => {
          // Now you have the image in base64 format
          console.log("Base64 image:", base64String);
        })
        .catch((error) => {
          console.error("Error:", error);
        });

      const base64Image = `${base64String}`;

      // console.log(base64Image);
      // console.log(photo.uri);

      try {
        const response = await axios.post(
          "https://3e14-182-79-102-194.ngrok-free.app/api/menu_ocr_trigger",
          {
            img: base64Image,
          }
        );
        console.log(response.data);
      } catch (error) {
        console.error("Error sending image to API:", error);
      }
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <Camera style={{ flex: 1, zIndex: 2 }} type={type} ref={cameraRef}>
        <View
          style={{
            flex: 1,
            backgroundColor: "transparent",
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 15,
            paddingTop: 15,
          }}
        />
      </Camera>

      <TouchableOpacity
        style={{
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "transparent",
          position: "absolute",
          zIndex: 10,
        }}
        onPress={handleButtonClick}
      >
        <Text
          style={{
            fontSize: 20,
            color: "black",
            top: height * 0.8,
            backgroundColor: "white",
            padding: 13,
            borderRadius: 30,
            fontWeight: "bold",
            left: width * 0.34,
          }}
        >
          Scan Menu
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Scanner;
