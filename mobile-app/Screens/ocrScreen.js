import { View, Text, Image, Dimensions } from "react-native";
import React from "react";

const { width, height } = Dimensions.get("screen");


const OcrScreen = () => {
  return (
    <View style={{flex: 1, height: height, width: width}}>
        <Text>OcrScreen</Text>
    </View>
  )
}

export default OcrScreen;