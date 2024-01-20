import { View, Text, Image, Dimensions } from "react-native";
import React,{useState} from "react";
import { SafeAreaView } from "react-native";
import useAuthStore from "../Components/authStore.js";
import { FIREBASE_DB } from "../FirebaseConfig.js";
import {doc,setDoc,updateDoc,getDoc, arrayUnion} from 'firebase/firestore';
import useUidStore from '../Components/uidStore.js';

const { width, height } = Dimensions.get("window");

export default function Header() {

  const authToken=useAuthStore((state)=>state.authToken); 
  const uid=useUidStore((state)=>state.uid);
  const [name,setName]=useState();


  const retrieve_data = async () => {
    const docRef = doc(FIREBASE_DB, 'users', uid);
    
    try {
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        user_data=docSnap.data();
        // console.log(user_data.name);
        setName(user_data.name);
      } else {
        console.log('No such document');
      }
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  }

  retrieve_data()

  return (
    <SafeAreaView className={`flex-row  justify-between mx-10 mt-16`}>
      <View>
        <View className={`flex-row `}>
          <Text style={{ fontSize: 25, color: "#525252", fontWeight: "400" }}>
            Hi,
          </Text>
          <Text style={{ fontSize: 25, color: "#525252", fontWeight: "bold" }}>
            {" "}
            {name}
          </Text>
        </View>
        <Text style={{color: "#525252"}}>UI designer & Cook</Text>
      </View>
      <Image
        source={require("../Assets/disha_pfp.jpg")}
        style={{ width: width * 0.106, height: height * 0.051, borderRadius: 50 }}
      />
    </SafeAreaView>
  );
}
