import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { FlatList } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";
import useAuthStore from "../Components/authStore.js";

export default function Continental() {
  const [selectedFilter, setSelectedFilter] = useState("Asian");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { width, height } = Dimensions.get("window");
  const authToken = useAuthStore((state) => state.authToken);

  useEffect(() => {
    fetchData();
  }, [selectedFilter]);

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
  };

  const fetchData = async () => {
    setLoading(true);
    const api_url = `https://cosylab.iiitd.edu.in/rdbapi/recipeDB/search_continent/${selectedFilter}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    };

    try {
      const response = await axios.get(api_url, { headers });

      const allRecipes = response.data;
      const shuffledRecipes = allRecipes.sort(() => Math.random() - 0.5);
      const selectedRecipes = shuffledRecipes.slice(0, 10);

      setData(selectedRecipes);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className={`ml-10 mr-5`}>
      <Text
        style={{
          fontSize: 25,
          fontWeight: "bold",
          color: "#525252",
        }}
      >
        Explore Global Recipes
      </Text>
      <View className={`flex-row mt-6`}>
        <TouchableOpacity
          style={{
            backgroundColor: selectedFilter === "Asian" ? "#ecb469" : "#ddd",
            padding: 10,
            borderRadius: 20,
            marginRight: 15,
          }}
          onPress={() => handleFilterClick("Asian")}
        >
          <Text>Asian</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: selectedFilter === "European" ? "#ecb469" : "#ddd",
            padding: 10,
            marginRight: 15,
            borderRadius: 20,
          }}
          onPress={() => handleFilterClick("European")}
        >
          <Text>European</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: selectedFilter === "African" ? "#ecb469" : "#ddd",
            padding: 10,
            marginRight: 15,
            borderRadius: 20,
          }}
          onPress={() => handleFilterClick("African")}
        >
          <Text>African</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor:
              selectedFilter === "North American" ? "#ecb469" : "#ddd",
            padding: 10,
            marginRight: 15,
            borderRadius: 20,
          }}
          onPress={() => handleFilterClick("North American")}
        >
          <Text>North American</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {loading ? (
          <ActivityIndicator size="large" color="#ecb469" />
        ) : (
          <FlatList
            horizontal
            data={data}
            style={{ marginTop: 20 }}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("RecipeInfo", { recipeData: item })
                }
              >
                <View
                  className={`my-2 bg-[#fef0cc] mx-3 rounded-3xl items-center`}
                  style={{
                    height: height * 0.3,
                    width: width * 0.4,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    source={{ uri: item.img_url }}
                    style={{
                      height: height * 0.3,
                      width: width * 0.4,
                      borderRadius: 20,
                      // borderTopLeftRadius: 20,
                      // borderTopRightRadius: 20,
                    }}
                  />
                  <View
                    style={{
                      opacity: 1,
                      position: "absolute",
                      bottom: 0, 
                      left: 0,
                      width: "100%", 
                      padding: 7,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "bold",
                        marginTop: 30,
                        marginLeft: 7,
                        color: 'white'
                      }}
                    >
                      {item.recipe_title}
                    </Text>
                    <View className={`flex-row items-center mt-2`}>
                      <Entypo
                        name="clock"
                        size={20}
                        color="white"
                        style={{ marginLeft: 7 }}
                      />
                      <Text className={`ml-2`} style={{color: 'white'}}>{item.total_time} Minutes</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}
