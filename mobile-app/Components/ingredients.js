import { View, Text } from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuthStore from "../Components/authStore.js";

export default function Ingredients({ recipeid }) {
  const [ingredients, setIngredients] = useState(null);
  const authToken = useAuthStore((state) => state.authToken);
  const [ingredientItem, setIngredientItem] = useState([""]);

  useEffect(() => {
    const fetchIngredients = async () => {
      if (recipeid) {
        console.log(recipeid);
        const api_url = `https://cosylab.iiitd.edu.in/api/recipeDB/getingredientsbyrecipe/${recipeid}`;
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        };

        try {
          const response = await axios.get(api_url, { headers });
          const data = response.data;
          setIngredients(data);

          if (data && data.length > 0) {
            const items = data.map(
              (ingredient) => ingredient.ingredient_Phrase
            );
            setIngredientItem(items);
          }
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchIngredients();
  }, [recipeid, authToken]);

  return (
    <View className={`ml-10 mr-2 my-2`}>
      <Text
        style={{
          fontSize: 25,
          fontWeight: "bold",
          color: "#525252",
          marginBottom: 10,
        }}
      >
        Ingredients
      </Text>
      {ingredientItem.map((item, index) => (
        <View key={index}>
          <Text
            style={{
              fontWeight: "300",
              flex: 1,
              marginBottom: 10,
              fontSize: 14,
              textTransform: "capitalize",
            }}
          >
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
}
