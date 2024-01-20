import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import Instructions from "../Components/instructions";
import useAuthStore from "../Components/authStore.js";
import { FIREBASE_DB } from "../FirebaseConfig.js";
import {
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
  arrayRemove,
} from "firebase/firestore";
import useUidStore from "../Components/uidStore.js";
import Ingredients from "../Components/ingredients.js";

export default function TopDishScreen() {
  const [data, setData] = useState([null]);
  const [utensils, setUtensils] = useState([]);
  const [process, setProcess] = useState([]);
  const [recipeid, setRecipeid] = useState();
  const [liked, setLiked] = useState(false);
  const navigation = useNavigation();
  const { width, height } = Dimensions.get("window");
  const authToken = useAuthStore((state) => state.authToken);
  const uid = useUidStore((state) => state.uid);

  useEffect(() => {
    const fetchData = async () => {
      const api_url =
        "https://cosylab.iiitd.edu.in/api/recipeDB/recipeoftheday";
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      };

      try {
        const response = await axios.get(api_url, { headers });

        setData(response.data);
        setRecipeid(response.data.recipe_id);
        printingData();
        checkLikedStatus();
      } catch (error) {
        console.log(error);
      }
    };

    function printingData() {
      console.log(data);
      console.log(recipeid);
    }

    const checkLikedStatus = async () => {
      const docRef = doc(FIREBASE_DB, "users", uid);

      try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          user_data = docSnap.data();
          setLiked(user_data.liked_recipes.includes(recipeid));
        } else {
          console.log("No such document");
        }
      } catch (error) {
        console.error("Error retrieving data:", error);
      }
    };

    fetchData();
  }, [recipeid]);

  useEffect(() => {
    if (data && data.utensils && data.processes) {
      const utensilsArray = data.utensils.split("||");
      const processArray = data.processes.split("||");
      setUtensils(utensilsArray);
      setProcess(processArray);
      console.log(utensilsArray);
      console.log(processArray);
    }
  }, [data]);

  const addToLiked = () => {
    updateDoc(doc(FIREBASE_DB, "users", uid), {
      liked_recipes: arrayUnion(recipeid),
    });
    console.log("added");
  };
  const removeFromLiked = () => {
    try {
      const docRef = doc(FIREBASE_DB, "users", uid);

      updateDoc(docRef, {
        liked_recipes: arrayRemove(recipeid),
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
            {data.recipe_title}
          </Text>
        </View>

        <View className={`flex-row justify-between mx-20 mt-3`}>
          <View className={`flex-row items-center`}>
            <Entypo name="back-in-time" size={24} color="black" />
            <Text style={{ marginLeft: 5, fontWeight: "300" }}>
              {data.total_time} Minutes
            </Text>
          </View>

          <View className={`flex-row items-center`}>
            <Ionicons name="fast-food-outline" size={24} color="black" />
            <Text style={{ marginLeft: 5, fontWeight: "300" }}>
              Serves {data.servings}
            </Text>
          </View>
        </View>
        <View className={`items-center mt-10`}>
          <Image
            source={{ uri: data.img_url }}
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
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
                <Text
                  style={{ marginTop: 5, fontWeight: "bold", marginTop: 15 }}
                >
                  {data.region}
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
                  {data.calories}
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
                  {data.calories}
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
                  {data.calories}
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
          </ScrollView>
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
            Utensils Used
          </Text>
          {utensils.map((step, index) => (
            <View
              key={index}
              style={{ marginVertical: 5, flexDirection: "row" }}
              className={`items-center`}
            >
              <Octicons name="dot" size={24} color="black" />
              <Text style={{ fontWeight: "300" }}>{`   ${step
                .charAt(0)
                .toUpperCase()}${step.slice(1)}`}</Text>
            </View>
          ))}
        </View>
        <Ingredients recipeid={recipeid} />

        <View style={{ marginBottom: 20 }}>
          <Instructions recipeid={recipeid} />
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
