import {
  View,
  Text,
  TextInput,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Image,
} from "react-native";
import React, { useState } from "react";
import BackButton from "../Components/backButton";
import { Feather } from "@expo/vector-icons";
import axios from "axios";
import useAuthStore from "../Components/authStore.js";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("screen");

export default function InventoryScreen() {
  const [query1, setQuery1] = useState("");
  const [query2, setQuery2] = useState("");
  const [data1, setData1] = useState();
  const [data2, setData2] = useState();
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const authToken = useAuthStore((state) => state.authToken);
  const navigation = useNavigation();

  const replaceSpacesWithComma = (str) => {
    return str.replace(/\s+/g, ",");
  };

  const searchQuery = async () => {
    setLoading(true);
    const searchQuery1 = replaceSpacesWithComma(query1);
    const searchQuery2=replaceSpacesWithComma(query2);

    api_url = `https://cosylab.iiitd.edu.in/rdbapi/recipeDB/searchRecipeByIng?ingUsed=${searchQuery1}&ingNotUsed=${searchQuery2}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    };

    try {
      const respone = await axios.get(api_url, { headers });
      setData1(respone.data);
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
      <View>
        <Text
          style={{
            fontSize: 25,
            fontWeight: "bold",
            color: "#525252",
            marginTop: 20,
          }}
        >
          Choose Your Kitchen Arsenal
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
            value={query1}
            style={{ height: 50, width: width * 0.7, paddingHorizontal: 10 }}
            placeholder="Ingredients to be used"
            autoCapitalize="none"
            onChangeText={(text) => setQuery1(text)}
          />

          <Feather name="search" size={24} color="grey" />
        </View>
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
            value={query2}
            style={{ height: 50, width: width * 0.7, paddingHorizontal: 10 }}
            placeholder="Ingredients to not be used"
            autoCapitalize="none"
            onChangeText={(text) => setQuery2(text)}
          />

          <Feather name="search" size={24} color="grey" />
        </View>
        <TouchableOpacity
          activeOpacity={0.9}
          style={{ marginVertical: 20, alignItems: "center" }}
          onPress={() => searchQuery()}
        >
          <View
            style={{
              height: height * 0.06,
              width: width * 0.5,
              backgroundColor: "#fb9c32",
              borderRadius: 15,
              elevation: 5,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 20 }}>
              Find your Recipe
            </Text>
          </View>
        </TouchableOpacity>
        {loading ? (
          <ActivityIndicator size="large" color="#ecb469" />
        ) : (
          <FlatList
            vertical
            showsVerticalScrollIndicator={false}
            // showsHorizontalScrollIndicator={false}
            data={data1}
            // style={{elevation: 5}}
            keyExtractor={(item) => item?._id?.toString()}
            renderItem={({ item }) => <RenderItem item={item} />}
          />
        )}
      </View>
    </View>
  );
}
