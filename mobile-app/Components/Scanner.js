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
      // Run this effect when the screen is focused
      setupCamera();

      return () => {
        // Clean up resources, if necessary, when the screen is unfocused
      };
    }, [])
  );

  const handleButtonClick = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      // Handle the captured photo as needed
      console.log(photo);
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
            justifyContent: "space-between", // Align items at the ends of the container
            paddingHorizontal: 15, // Add padding for the flip button
            paddingTop: 15, // Add padding for the flip button
          }}
        >
          {/* <TouchableOpacity
            style={{
              alignSelf: "flex-start", // Align to the top left
            }}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}
          >
            <Text style={{ fontSize: 18, color: "white" }}>Flip</Text>
          </TouchableOpacity> */}
        </View>
      </Camera>

      <TouchableOpacity
        style={{
          justifyContent: "center", // Center content vertically
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
