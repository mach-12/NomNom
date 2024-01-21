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
  }, [removeFromJournal]);

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

    setRecipeData([]);
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

  const removeFromJournal = async (item) => {
    try {
      const docRef = doc(FIREBASE_DB, "users", uid);


      updateDoc(docRef, {
        journal: arrayRemove(item.recipe_id),
      });

      console.log("removed");
    } catch (err) {
      console.log(err);
    }
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
              <View
                style={{
                  backgroundColor: "white",
                  height: height * 0.08,
                  width: width * 0.8,
                  marginBottom: 20,
                  borderRadius: 20,
                  flexDirection: "row",
                  elevation: 1,
                }}
              >
                <Image
                  source={{ uri: item?.url }}
                  style={{ resizeMode: "cover", width: 60 }}
                />
                <View
                  style={{
                    backgroundColor: "white",
                    justifyContent: "space-between",
                    paddingVertical: 10,
                    width: width*0.40
                  }}
                >
                  <Text>{item.recipe_title}</Text>
                  <Text>{item.total_time} Minutes</Text>
                </View>
                <TouchableOpacity
                  onPress={() => removeFromJournal(item)}
                  style={{
                    alignSelf: "center",
                    backgroundColor: "#fb9c32",
                    borderRadius: 20,
                    marginLeft: 10,
                    padding: 5,
                    paddingHorizontal: 15,
                    // width: width*0.15
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "500" }}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}
