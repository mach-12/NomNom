import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";


const OcrScreen = () => {
  const navigation=useNavigation();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity onPress={()=>navigation.navigate('ScannerScreen')}>
        <Text>OPEN CAMERA</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OcrScreen;
