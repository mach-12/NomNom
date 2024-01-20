import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";

const OcrScreen = () => {
  const navigation = useNavigation();
  const { width, height } = Dimensions.get("screen");

  return (
    <View style={{ marginHorizontal: 30, marginTop: 15 }}>
      <View style={{ marginVertical: 20, marginTop: 40 }}>
        <Text
          style={{
            fontSize: 32,
            color: "black",
            fontWeight: "bold",
          }}
        >
          Scan menu from Resturants
        </Text>
      </View>
      <View style={{ width: 0.8 * width, marginBottom: 30 }}>
        <Text style={{ fontSize: 18, fontWeight: "400", color: "gray" }}>
          Take a pic of the menu, and our tool shows how healthy your meal is.
          Easy eats, no confusion.
        </Text>
      </View>
      <View style={{ width: 0.8 * width, marginBottom: 30 }}>
        <Text style={{ fontSize: 25, fontWeight: "500", marginBottom: 15 }}>
          Steps:{" "}
        </Text>
        <Text
          style={{
            fontSize: 15,
            fontWeight: "400",
            color: "gray",
            marginBottom: 5,
          }}
        >
          1. Click on the Open Camera Button
        </Text>
        <Text
          style={{
            fontSize: 15,
            fontWeight: "400",
            color: "gray",
            marginBottom: 5,
          }}
        >
          2. Take a quick photo of the menu
        </Text>
        <Text
          style={{
            fontSize: 15,
            fontWeight: "400",
            color: "gray",
            marginBottom: 5,
          }}
        >
          3. Let our OCR magic do its thing
        </Text>
        <Text
          style={{
            fontSize: 15,
            fontWeight: "400",
            color: "gray",
            marginBottom: 5,
          }}
        >
          5. Instantly see how healthy each dish is, making it easy to choose
          wisely.
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate("ScannerScreen")}
        style={{
          alignItems: "center",
          marginTop: height * 0.05,
          backgroundColor: "#fb9c32",
          padding: 20,
          marginHorizontal: width * 0.2,
          borderRadius: 25,
          elevation: 3,
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>
          Scan Menu
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default OcrScreen;
