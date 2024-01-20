import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Dimensions,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import axios from "axios";
import useAuthStore from "../Components/authStore.js";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("screen");

const capitalizeFirstLetterOfEachWord = (str) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

const replaceSpacesWithComma = (str) => {
  return str.replace(/\s+/g, ",");
};

const fetchData = async (url, authToken, setRecipes, setLoading) => {
  try {
    setLoading(true);
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });
    setRecipes(response.data);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

const SearchScreen = () => {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const authToken = useAuthStore((state) => state.authToken);
  const navigation = useNavigation();

  const searchQuery = () => {
    const capitalQuery = capitalizeFirstLetterOfEachWord(query);
    const commaSeparatedQuery = replaceSpacesWithComma(query);

    fetchData(
      `https://cosylab.iiitd.edu.in/rdbapi/recipeDB/searchRecipeByFullTitle/${capitalQuery}`,
      authToken,
      setRecipes,
      setLoading
    );
    fetchData(
      `https://cosylab.iiitd.edu.in/rdbapi/recipeDB/searchRecipeBySubTitle/${capitalQuery}`,
      authToken,
      setRecipes,
      setLoading
    );
    fetchData(
      `https://cosylab.iiitd.edu.in/rdbapi/recipeDB/search_continent/${capitalQuery}`,
      authToken,
      setRecipes,
      setLoading
    );
    fetchData(
      `https://cosylab.iiitd.edu.in/rdbapi/recipeDB/search_region/${capitalQuery}`,
      authToken,
      setRecipes,
      setLoading
    );
    fetchData(
      `https://cosylab.iiitd.edu.in/rdbapi/recipeDB/search_subregion/${capitalQuery}`,
      authToken,
      setRecipes,
      setLoading
    );
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
    <View style={{ flex: 1 }}>
      <View style={{ alignItems: "center", marginTop: height * 0.08 }}>
        <Text style={{ fontSize: 24, fontWeight: "800" }}>
          Tell us what you're looking For
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderRadius: 40,
            backgroundColor: "#f6f6f6",
            paddingHorizontal: 20,
            marginTop: 30,
          }}
        >
          <TextInput
            value={query}
            style={{ height: 50, width: width * 0.7, paddingHorizontal: 10 }}
            placeholder="Search"
            autoCapitalize="none"
            onChangeText={(text) => setQuery(text)}
          />
          <TouchableOpacity onPress={searchQuery}>
            <Feather name="search" size={24} color="grey" />
          </TouchableOpacity>
        </View>
        <View style={{ alignItems: "center", marginTop: 30 }}>
          {loading ? (
            <ActivityIndicator size="large" color="#ecb469" />
          ) : (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={recipes}
              // style={{elevation: 5}}
              keyExtractor={(item) => item?._id?.toString()}
              renderItem={({ item }) => <RenderItem item={item} />}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default SearchScreen;
