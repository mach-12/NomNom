import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Instructions from "./instructions";
import Ingredients from "./ingredients";
import { useNavigation } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { FIREBASE_DB } from "../FirebaseConfig.js";
import {
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
  arrayRemove,
} from "firebase/firestore";
import useUidStore from "../Components/uidStore.js";

export default function RecipeInfo({ route }) {
  const { recipeData } = route.params;
  const navigation = useNavigation();
  const { width, height } = Dimensions.get("window");
  const [liked, setLiked] = useState(false);
  const uid = useUidStore((state) => state.uid);

  useEffect(() => {
    const checkLikedStatus = async () => {
      const docRef = doc(FIREBASE_DB, "users", uid);

      try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          user_data = docSnap.data();
          setLiked(user_data.liked_recipes.includes(recipeData.recipe_id));
        } else {
          console.log("No such document");
        }
      } catch (error) {
        console.error("Error retrieving data:", error);
      }
    };

    checkLikedStatus();
  }, []);

  const addToLiked = () => {
    updateDoc(doc(FIREBASE_DB, "users", uid), {
      liked_recipes: arrayUnion(recipeData.recipe_id),
    });
    console.log("added");
  };

  const removeFromLiked = () => {
    try {
      const docRef = doc(FIREBASE_DB, "users", uid);

      updateDoc(docRef, {
        liked_recipes: arrayRemove(recipeData.recipe_id),
      });

      console.log("removed");
    } catch (err) {
      console.log(err);
    }
  };

  const updateLikedRecipes = () => {
    if (!liked) {
      setLiked(true);
      addToLiked();
    } else {
      setLiked(false);
      removeFromLiked();
    }
  };

  return (
    <View className={`flex-1`}>
      <View
        className={`flex-row justify-between mx-10 `}
        style={{ marginTop: 50 }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="leftcircleo" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => updateLikedRecipes()}>
          {liked ? (
            <AntDesign name="heart" size={24} color="red" />
          ) : (
            <AntDesign name="hearto" size={24} color="black" />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView className={`mt-2`}>
        <View className={` items-center mt-3`}>
          <Text style={{ fontSize: 35, fontWeight: "bold" }}>
            {recipeData.recipe_title}
          </Text>
        </View>

        <View className={`flex-row justify-between mx-20 mt-3`}>
          <View className={`flex-row items-center`}>
            <Entypo name="back-in-time" size={24} color="black" />
            <Text style={{ marginLeft: 5, fontWeight: "300" }}>
              {recipeData.total_time} Minutes
            </Text>
          </View>

          <View className={`flex-row items-center`}>
            <Ionicons name="fast-food-outline" size={24} color="black" />
            <Text style={{ marginLeft: 5, fontWeight: "300" }}>
              Serves {recipeData.servings}
            </Text>
          </View>
        </View>
        <View className={`items-center mt-10`}>
          <Image
            source={{ uri: recipeData.img_url }}
            style={{ height: 250, width: 350, borderRadius: 30 }}
          />
        </View>

        <View className={`ml-10 mt-10`}>
          <Text
            style={{
              fontSize: 25,
              fontWeight: "bold",
              color: "#525252",
              marginBottom: 20,
            }}
          >
            Details
          </Text>
          <View className={`flex-row items-center`}>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                height: height * 0.13,
                width: width * 0.25,
                backgroundColor: "#fee498",
                borderRadius: 10,
              }}
            >
              <Entypo name="globe" size={35} color="#ed6433" />
              <Text style={{ marginTop: 5, fontWeight: "bold", marginTop: 15 }}>
                {recipeData.region}
              </Text>
            </View>

            <View
              className={`items-center bg-[#dde993] ml-5 rounded-xl`}
              style={{
                justifyContent: "center",
                alignItems: "center",
                height: height * 0.13,
                width: width * 0.25,
              }}
            >
              <MaterialCommunityIcons
                name="food-apple"
                size={45}
                color="#c81837"
              />
              <Text style={{ fontWeight: "300", marginTop: 0 }}>
                {recipeData.calories}
              </Text>
              <Text
                style={{
                  fontWeight: "bold",
                  color: "#525252",
                  marginBottom: 5,
                }}
              >
                Calories
              </Text>
            </View>

            <View
              className={`items-center bg-[#fce3e2] ml-5 rounded-xl`}
              style={{
                justifyContent: "center",
                alignItems: "center",
                height: height * 0.13,
                width: width * 0.25,
              }}
            >
              <MaterialCommunityIcons
                name="food-drumstick"
                size={43}
                color="brown"
              />
              <Text style={{ fontWeight: "300", marginTop: 0 }}>
                {recipeData.protein}
              </Text>
              <Text
                style={{
                  fontWeight: "bold",
                  color: "#525252",
                  marginBottom: 5,
                }}
              >
                Protein
              </Text>
            </View>
          </View>
        </View>
        <Ingredients recipeid={recipeData.recipe_id} />
        <View style={{ marginBottom: 0 }}>
          <Instructions recipeid={recipeData.recipe_id} />
        </View>
      </ScrollView>

      {/* <View style={{ backgroundColor: "#fff", padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", textAlign: "center" }}>
          Fixed Content at the Bottom
        </Text>
      </View> */}
    </View>
  );
}
