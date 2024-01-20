import { View, Text, Image, Dimensions } from "react-native";
import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

export default function SplashScreen() {
  const navigation = useNavigation();
  const { width, height } = Dimensions.get("screen");
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      navigation.navigate("OnboardingScreen");
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [navigation]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fbf0e1",
      }}
    >
      <Image source={require("../Assets/app_logo3.png")} style={{width: width, resizeMode: 'contain',marginBottom : height*0.13}} />
    </View>
  );
}
