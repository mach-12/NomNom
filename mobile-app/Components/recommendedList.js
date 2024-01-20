import {
  View,
  Text,
  Dimensions,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { doc, updateDoc, getDoc, arrayUnion } from "firebase/firestore";
import { FIREBASE_DB } from "../FirebaseConfig.js";
import useUidStore from "../Components/uidStore.js";
import useAuthStore from "../Components/authStore.js";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";

const { width, height } = Dimensions.get("screen");

export default function RecommendedList() {
  const [recipeList, setRecipeList] = useState([]);
  const navigation = useNavigation();
  const uid = useUidStore((state) => state.uid);
  const authToken = useAuthStore((state) => state.authToken);
  const [data, setData] = useState([])
  const [recipeIdList, setRecipeIdList] = useState([]);
  const [finalData, setFinalData] = useState([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    retrieve_data();
  }, []);

  const retrieve_data = async () => {
    const docRef = doc(FIREBASE_DB, "users", uid);

    try {
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const user_data = docSnap.data();

        if (user_data.liked_recipes != null) {
          setRecipeList(user_data.liked_recipes);
          fetchData(user_data.liked_recipes);
        } else {
          setLoading(false);
          console.log("empty list");
        }
      } else {
        setLoading(false);
        console.log("No such document");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error retreving data:", error);
    }
  };

  const fetchData = async (likedRecipes) => {
    var similarRecipeArray = [];

    try {
      for (var i = 0; i < likedRecipes.length; i++) {
        const api_url = `https://cosylab.iiitd.edu.in/api/recipeDB/similarrecipespro/${likedRecipes[i]}`;

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        };

        const response = await axios.get(api_url, { headers });
        const temp = response.data;
        similarRecipeArray.push(temp.simRecipes);
      }

      const idList = similarRecipeArray.flat().map((recipe) => recipe.recipeId);
      setRecipeIdList(idList);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const fetchRecipes = async () => {
    if (recipeIdList.length === 0) {
      console.log("Recipe Id list is empty");
      return;
    }

    const randomRecipeIds = pickRandomEntries(recipeIdList, 20);

    try {
      for (var i = 0; i < 20; i++) {
        const api_url = `https://cosylab.iiitd.edu.in/api/recipeDB/recipeInfo/${randomRecipeIds[i]}`;
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        };

        const response = await axios.get(api_url, { headers });
        setFinalData((prevData) => [...prevData, response.data]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [recipeIdList]);

  function pickRandomEntries(array, n) {
    if (n > array.length) {
      console.error("Cannot pick more entries than available in the array.");
      return [];
    }

    const shuffledArray = array.sort(() => Math.random() - 0.5);

    return shuffledArray.slice(0, n);
  }
  const RenderItem = ({ item }) => {
    return (
      <TouchableOpacity
      activeOpacity={0.9}
        onPress={() => navigation.navigate("RecipeInfo", { recipeData: item })}
      >
        <View
          style={{
            height: height * 0.28,
            width: width * 0.83,
            borderRadius: 15,
            marginBottom: 20,
            // borderWidth: 1,
            backgroundColor: "#f3f3f3",
            elevation: 3,
          }}
        >
          <Image
            source={{ uri: item.img_url }}
            style={{
              height: height * 0.2,
              width: width * 0.83,
              borderRadius: 21,
            
            }}
          />
          <View style={{ padding: 10 }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View>
                <Text
                  style={{ fontSize: 17, fontWeight: "800", color: "black" }}
                >
                  {item?.recipe_title}
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={{ fontSize: 13, fontWeight: "500", color: "grey" }}
                  >
                    {item?.continent}-
                  </Text>
                  <Text
                    style={{ fontSize: 13, fontWeight: "500", color: "grey" }}
                  >
                    {item?.region}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", marginTop: 10 }}>
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
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, marginLeft: width * 0.09, marginTop: 20 }}>
      {loading ? (
        <ActivityIndicator size="large" color="#ecb469" />
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={finalData}
          keyExtractor={(item) => item?._id?.toString()}
          renderItem={({ item }) => <RenderItem item={item} />}
        />
      )}
    </View>
  );
}
