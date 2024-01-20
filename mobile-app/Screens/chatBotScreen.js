import { View, Text, Image, Dimensions } from "react-native";
import React from "react";

const { width, height } = Dimensions.get("screen");

export default function ChatBotScreen() {
  return (
    <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
      <Image
        source={require("../Assets/com_pic.png")}
        style={{
          resizeMode: "contain",
          height: height * 0.25,
          top: -height * 0.2,
        }}
      />
      <Text style={{ fontSize: 42, fontWeight: "600", top: -height * 0.2 }}>
        Our Community
      </Text>
      <Text style={{ fontSize: 20, top: -height * 0.16, color: 'grey', textAlign: 'center' }}>
        Connect with like-minded cooks, chefs, and owners, tap into a treasure
        trove of shared expertise, and explore a universe of endless culinary
        creativity.
      </Text>
      <Text style={{ fontSize: 32, fontWeight: "600", top: -height * 0.13, color: '#fb9c32' }}>
        Coming Soon!
      </Text>
    </View>
  );
}
