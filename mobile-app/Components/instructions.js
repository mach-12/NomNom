import { View, Text } from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuthStore from "../Components/authStore.js";

export default function Instructions({ recipeid }) {
  const [instructions, setInstructions] = useState(null);
  const authToken = useAuthStore((state) => state.authToken);

  useEffect(() => {
    const fetchInstructions = async () => {
      if (recipeid) {
        // console.log(recipeid)
        const api_url = `https://cosylab.iiitd.edu.in/api/instructions/${recipeid}`;
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        };

        try {
          const response = await axios.get(api_url, { headers });
          setInstructions(response.data);
          // console.log(instructions)
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchInstructions();
  }, [recipeid]);

  return (
    <View className={`ml-10 mr-2 my-2`}>
      <Text
        style={{
          fontSize: 25,
          fontWeight: "bold",
          color: "#525252",
          marginBottom: 20,
        }}
      >
        Instructions
      </Text>
      {instructions ? (
        <Text
          style={{
            fontWeight: "300",
            flex: 1,
            marginBottom: 10,
            fontSize: 14,
            textTransform: "capitalize",
          }}
        >
          {instructions.split(". ").map((sentence, index, array) => (
            <React.Fragment key={index}>
              {`${index + 1}. ${sentence}`}
              {index < array.length - 1 && <Text>{"\n\n"}</Text>}
            </React.Fragment>
          ))}
        </Text>
      ) : (
        <Text>Loading instructions...</Text>
      )}
    </View>
  );
  
}
