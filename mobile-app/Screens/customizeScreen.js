import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState, useCallback } from "react";
import Slider from "@react-native-community/slider";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import BackButton from "../Components/backButton";
import axios from "axios";
import useAuthStore from "../Components/authStore.js";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("screen");

export default function CustomizeScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [energy, setEnergy] = useState(0);
  const [protien, setProtien] = useState(0);
  const [calories, setCalories] = useState(0);
  const [data, setData] = useState([]);
  const authToken = useAuthStore((state) => state.authToken);

  const getRecipe = async () => {
    setLoading(true);
    api_url = `https://cosylab.iiitd.edu.in/rdbapi/recipeDB/searchRecipeByNutrients?energy=${energy}:${
      energy + 10
    }&protien=${protien}:${protien + 10}&calories=${calories}:${calories + 10}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    };
    try {
      const respone = await axios.get(api_url, { headers });
      setData(respone.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const RenderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("RecipeInfo", { recipeData: item })}
      >
        <View
          style={{
            marginLeft: 10,
            height: height * 0.08,
            width: width * 0.9,
            // backgroundColor: "#f5f5f5",
            padding: 10,
            borderRadius: 15,
            marginBottom: 20,
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Image
              source={{ uri: item.img_url }}
              style={{
                height: height * 0.08,
                width: height * 0.07,
                borderRadius: 20,
              }}
            />
            <View style={{ marginLeft: 10, marginTop: 5 }}>
              <Text style={{ fontSize: 13, fontWeight: "800", color: "black" }}>
                {item?.recipe_title}
              </Text>

              <View style={{ marginTop: 25, flexDirection: "row" }}>
                <View style={{ flexDirection: "row" }}>
                  <MaterialCommunityIcons
                    name="food-outline"
                    size={15}
                    color="grey"
                  />
                  <Text style={{ color: "grey", fontSize: 13, marginLeft: 5 }}>
                    {item.total_time} Minutes
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, marginHorizontal: 30, marginTop: 15 }}>
      <BackButton />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ marginVertical: 20 }}>
          <Text
            style={{
              fontSize: 32,
              color: "black",
              fontWeight: "bold",
            }}
          >
            Design Your Nutrient Balance
          </Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "baseline" }}>
          <Text style={{ fontSize: 24, fontWeight: "500", color: "black" }}>
            Energy:{" "}
          </Text>
          <Text style={{ fontSize: 15, fontWeight: "500", color: "#fb9c32" }}>
            {energy} kcal
          </Text>
        </View>

        <Slider
          style={{ width: width * 0.9, height: 40 }}
          minimumValue={0}
          maximumValue={1000}
          minimumTrackTintColor="#fb9c32"
          maximumTrackTintColor="black"
          thumbTintColor="#fb9c32"
          onValueChange={(text) => setEnergy(text)}
          step={1}
        />

        <View style={{ flexDirection: "row", alignItems: "baseline" }}>
          <Text style={{ fontSize: 24, fontWeight: "500", color: "black" }}>
            Protein:{" "}
          </Text>
          <Text style={{ fontSize: 15, fontWeight: "500", color: "#fb9c32" }}>
            {protien} gm
          </Text>
        </View>
        <Slider
          style={{ width: width * 0.9, height: 40 }}
          minimumValue={0}
          maximumValue={300}
          minimumTrackTintColor="#fb9c32"
          maximumTrackTintColor="black"
          thumbTintColor="#fb9c32"
          step={1}
          onValueChange={(text) => setProtien(text)}
        />
        <View style={{ flexDirection: "row", alignItems: "baseline" }}>
          <Text style={{ fontSize: 24, fontWeight: "500", color: "black" }}>
            Calories:{" "}
          </Text>
          <Text style={{ fontSize: 15, fontWeight: "500", color: "#fb9c32" }}>
            {calories} kcal
          </Text>
        </View>
        <Slider
          style={{ width: width * 0.9, height: 40 }}
          minimumValue={0}
          maximumValue={700}
          minimumTrackTintColor="#fb9c32"
          maximumTrackTintColor="black"
          step={1}
          thumbTintColor="#fb9c32"
          onValueChange={(text) => setCalories(text)}
        />

        <TouchableOpacity
          activeOpacity={0.9}
          style={{ marginVertical: 20, alignItems: "center" }}
          onPress={() => getRecipe()}
        >
          <View
            style={{
              height: height * 0.06,
              width: width * 0.6,
              backgroundColor: "#fb9c32",
              borderRadius: 15,
              elevation: 5,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 20 }}>
              Search Recipe
            </Text>
          </View>
        </TouchableOpacity>
        {loading ? (
          <ActivityIndicator size="large" color="#ecb469" />
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={data}
            // style={{elevation: 5}}
            keyExtractor={(item) => item?._id?.toString()}
            renderItem={({ item }) => <RenderItem item={item} />}
          />
        )}
      </ScrollView>
    </View>
  );
}
