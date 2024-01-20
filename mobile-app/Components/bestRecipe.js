import { View, Text, Dimensions, Image, TouchableOpacity } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
// import Animated, {FadeInLeft,FadeInDown} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

export default function BestRecipe() {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.navigate("TopRecipeScreen")}>
      <View
        className={`bg-[#fef0cc]`}
        style={{
          height: height * 0.2,
          width: width * 0.7,
          borderTopRightRadius: 80,
          borderBottomRightRadius: 80,
        }}
      >
        <View style={{ width: width * 0.5 }}>
          <Text style={{ fontSize: 20, marginLeft: 20, marginTop: 20 }}>
            Dive into the flavor packed adventure with our Recipe of the Day
          </Text>
        </View>

        <View className={`flex-row mt-3`}>
          <Text
            style={{
              marginLeft: 20,
              fontSize: 18,
              fontWeight: "bold",
              color: "#ecb469",
              marginRight: 10,
            }}
          >
            Let's Try
          </Text>
          <AntDesign name="arrowright" size={20} color="#ecb469" />
        </View>

        <Image
          source={require("../Assets/toprecipe.png")}
          style={{
            height: height * 0.2,
            resizeMode: "contain",
            marginLeft: 50,
            position: "absolute",
          }}
        />
      </View>
    </TouchableOpacity>
  );
}
