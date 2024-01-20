import {
  View,
  Text,
  Dimensions,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../Components/header";
import BestRecipe from "../Components/bestRecipe";
import Continental from "../Components/continental";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { doc, setDoc, updateDoc, getDoc, arrayUnion } from "firebase/firestore";
import { FIREBASE_DB } from "../FirebaseConfig.js";
import useUidStore from "../Components/uidStore.js";
import useAuthStore from "../Components/authStore.js";
import RecommendedList from "../Components/recommendedList.js";

const { width, height } = Dimensions.get("window");

export default function HomeScreen() {
  const authToken = useAuthStore((state) => state.authToken);
  const setAuthToken = useAuthStore((state) => state.setAuthToken);
  const navigation = useNavigation();
  const uid = useUidStore((state) => state.uid);
  const [likedStatus, setLikedStatus] = useState(true);

  useEffect(() => {
    const token =
      "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI1N1R4M2FWRzR0N0Q5YW00TDlod1VHR2tPVVlvOUpwVFd1VTNmTWxrY1lBIn0.eyJleHAiOjE3MDU3NDg1NTgsImlhdCI6MTcwNTc0ODI1OCwianRpIjoiN2YwZThkYjMtMzg2Ny00ZmIxLThhYjUtMzkzMzExOTc2ZDc4IiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL2F1dGgvcmVhbG1zL2Jvb3RhZG1pbiIsImF1ZCI6WyJhcHAtYWRtaW4iLCJhcHAtdG9kbyIsImFjY291bnQiXSwic3ViIjoiMzkwYWRhOGEtM2I1ZS00NTk2LTkwNmYtMjg3YzcyMGY2NGZhIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiYXBwLWltcyIsInNlc3Npb25fc3RhdGUiOiJiNzEzMzMzOC1mMjkxLTQyOTAtOTg0Ny1mY2JlMTYwZDY0OWUiLCJhY3IiOiIxIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhcHAtYWRtaW4iOnsicm9sZXMiOlsiYWRtaW4iXX0sImFwcC10b2RvIjp7InJvbGVzIjpbImFkbWluIiwidXNlciJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgZW1haWwgcHJvZmlsZSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwicHJlZmVycmVkX3VzZXJuYW1lIjoiZm9ya2l0LWhhY2thdGhvbiJ9.eSeCcL4BCaqmX11FDk6u6-F1qfLWIt6CEQ-lLwsCs_-Ug5JhMDdZP6bfkx_VlVX4GpqSHG8Q9CKWrJcNXKUUdID7pw9rNjLpluiJI3dnPCm9t7ow10E8ehMCplRryg-mNYdh0lkMQ2Rce_DitTJqRkmhC2eGUBGV1BIn6FbLATwTrBdh9-yIK0XCk3xEOP2To0awF7ejkLSg8hCsVtg88OiDQfeAKKo26JhHs6koCtnAim99Z8CiASaObgAed78SBy-kt7mDX92k3ZO7Vzy2jpuFRfVmP2r3ew5EhS1DNwvs4LI9RmZSE28sMV1y7rpbezwwQc4ndY1rfPuITi8lpQ";
    setAuthToken(token);
    retrieve_data();
    console.log(likedStatus);
  }, []);

  const retrieve_data = async () => {
    const docRef = doc(FIREBASE_DB, "users", uid);

    try {
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        user_data = docSnap.data();
        console.log(user_data.liked_recipes);
        if (user_data.liked_recipes != null) {
          setLikedStatus(true);
        } else {
          setLikedStatus(false);
        }
      } else {
        setLikedStatus(false);
        console.log("No such document");
      }
    } catch (error) {
      setLikedStatus(false);
      console.error("Error retrieving data:", error);
    }
  };

  return (
    <View className={`flex-1`} style={{ height: height, width: width }}>
      <ScrollView>
        <Header />
        <View className={`mt-10`}>
          <BestRecipe />
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("InventorySearchScreen")}
        >
          <View
            style={{
              backgroundColor: "#cdecff",
              height: height * 0.1,
              width: width * 0.85, // Set width to 'auto'
              marginTop: 60,
              marginLeft: width * 0.09,
              borderRadius: 10,
              // flexDirection: "row", // Add flexDirection to make Check Out text align horizontally
              // alignItems: "center", // Align items vertically in the center
            }}
          >
            <Text
              style={{
                fontSize: 14,
                marginRight: height * 0.16,
                fontWeight: "700",
                color: "#525252",
                margin: 10,
              }}
            >
              Get Creative in the Kitchen with What You've Got
            </Text>

            <View
              style={{
                // backgroundColor: "#fb9c32",
                paddingHorizontal: 10,
                borderRadius: 10,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#fb9c32",
                  fontWeight: "bold",
                  fontSize: 14,
                  marginRight: 5,
                }}
              >
                Check Out
              </Text>

              <AntDesign name="arrowright" size={15} color="#fb9c32" />
            </View>

            <Image
              source={require("../Assets/bg1.png")}
              style={{
                height: height * 0.15,
                resizeMode: "contain",
                position: "absolute",
                top: -height * 0.06,
                left: 40,
              }}
            />
          </View>
        </TouchableOpacity>
        <View className={`mt-10`}>
          <Continental />
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("CustomizeScreen")}
          activeOpacity={0.9}
        >
          <View
            className={`mt-6 ml-10`}
            style={{
              elevation: 5,
              width: width * 0.85,
              borderRadius: 30,
              height: height * 0.2,
              justifyContent: "center",
            }}
          >
            <Image
              source={require("../Assets/build_image.jpg")}
              style={{
                resizeMode: "cover",
                width: width * 0.85,
                height: height * 0.2,
                borderRadius: 30,
              }}
            />

            <Text
              style={{
                position: "absolute",
                marginHorizontal: width * 0.2,
                top: height * 0.05,
                left: width * 0.3,
                fontSize: 34,
                color: "#525252",
                fontWeight: "700",
                textAlign: "right",
              }}
            >
              Your Nutrient Quest
            </Text>
          </View>
        </TouchableOpacity>

        {likedStatus ? (
          <View>
            <View
              style={{
                flexDirection: "row",
                marginTop: 40,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  height: 1,
                  width: width * 0.38,
                  backgroundColor: "#525252",
                }}
              />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "800",
                  opacity: 0.5,
                  color: "#525252",
                  marginHorizontal: 10,
                }}
              >
              Personalized Flavor Picks
              </Text>
              <View
                style={{
                  height: 1,
                  width: width * 0.38,
                  backgroundColor: "grey",
                }}
              />
            </View>
            <RecommendedList />
          </View>
        ) : null}

        <View style={{ marginBottom: 200 }}></View>
      </ScrollView>
    </View>
  );
}
