import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  ActivityIndicator,
} from "react-native";
import {
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
  arrayRemove,
} from "firebase/firestore";
import { FIREBASE_DB } from "../FirebaseConfig.js";
import useUidStore from "../Components/uidStore.js";
import axios from "axios";
import useAuthStore from "../Components/authStore.js";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

const { height, width } = Dimensions.get("screen");

export default function FoodJournal() {
  const uid = useUidStore((state) => state.uid);
  const authToken = useAuthStore((state) => state.authToken);
  const [recipeID, setRecipeID] = useState([]);
  const [recipeData, setRecipeData] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    // This function will be called once when the component mounts
    getJournalData();
  }, []); 

  const getJournalData = async () => {
    setLoading(false);
    const docRef = doc(FIREBASE_DB, "users", uid);

    try {
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const user_data = docSnap.data();
        setRecipeID(user_data.journal);
      } else {
        console.log("No such document");
      }
    } catch (error) {
      console.error("Error retrieving data:", error);
    }

    fetchAllData();
  };

  const fetchData = async (recipeID) => {
    const api_url = `https://cosylab.iiitd.edu.in/api/recipeDB/recipeInfo/${recipeID}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    };

    try {
      const response = await axios.get(api_url, { headers });
      const newRecipeData = response.data;

      console.log(newRecipeData);

      setRecipeData((prevData) => [...prevData, newRecipeData]);

      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAllData = async () => {
    for (let i = 0; i < recipeID.length; i++) {
      fetchData(recipeID[i]);
    }
  };

  const RenderItem = (item) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("RecipeInfo", { recipeData: item })}
      >
        <View
          style={{
            marginLeft: 10,
            height: height * 0.08,
            width: width * 0.9,
            padding: 10,
            borderRadius: 15,
            marginBottom: 20,
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Image
              source={{ uri: item?.url }}
              style={{
                height: height * 0.08,
                width: height * 0.07,
                borderRadius: 20,
              }}
            />
            <View style={{ marginLeft: 10, marginTop: 5, width: width * 0.5 }}>
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
                    {item?.total_time} Minutes
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
      <View style={{ marginVertical: 20 }}>
        <Text
          style={{
            fontSize: 32,
            color: "black",
            fontWeight: "bold",
          }}
        >
          Tell us what you ate?
        </Text>
      </View>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={{ marginVertical: 20, alignItems: "center" }}
          onPress={() => getJournalData()}
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
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: 20,
                justifyContent: "center",
                alignSelf: "center",
                alignContent: "center",
              }}
            >
              Check your Logged Recipes
            </Text>
          </View>
        </TouchableOpacity>
        {loading ? (
          <ActivityIndicator size="large" color="#ecb469" />
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={recipeData}
            renderItem={({ item }) => (
              <Text>{item.url}</Text>
            )}
          />
        )}
      </View>
    </View>
  );
}
