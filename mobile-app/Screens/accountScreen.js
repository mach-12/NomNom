import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Button,
  TouchableOpacityBase,
} from "react-native";
import React, { useState,useEffect } from 'react'
import { FIREBASE_AUTH } from "../FirebaseConfig.js";
import { FIREBASE_DB } from "../FirebaseConfig.js";
import {doc,setDoc,updateDoc,getDoc, arrayUnion} from 'firebase/firestore';
import useUidStore from '../Components/uidStore.js';
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";

export default function AccountScreen() {

  const [username,setUsername]=useState('');
  const uid=useUidStore((state)=>state.uid);

  useEffect(()=>{
    retrieve_data();
  },[])
  

  const retrieve_data = async () => {
    const docRef = doc(FIREBASE_DB, 'users', uid);
    
    try {
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        user_data=docSnap.data();
        console.log(user_data.name);
        setUsername(user_data.name)
      } else {
        console.log('No such document');
      }
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  }



  const {width, height}=Dimensions.get('screen');

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      
      <View style={{ height: height, width: width, alignItems: "center" }}>
      <SafeAreaView
        style={{
          backgroundColor: "#ffd571",
          height: height * 0.5,
          width: width,
          borderBottomRightRadius: 50,
          borderBottomLeftRadius: 50,
          elevation: 10,
        }}
      >
        <View style={{ marginHorizontal: 30, marginTop: 10 }}>
          <View
            // entering={FadeInLeft.duration(400).delay(300)}
            style={{
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                fontSize: 30,
                fontWeight: "800",
                color: "black",
                marginTop: 40,
              }}
            >
              My Profile
            </Text>
            <Ionicons
              name="notifications-outline"
              size={24}
              color="black"
              style={{ marginTop: 40 }}
            />
          </View>
          <View style={{ alignItems: "center", marginTop: 50 }}>
            <Image
              // entering={FadeIn.duration(400).delay(450)}
              source={require('../Assets/disha_pfp.jpg')}
              style={{ height: 150, width: 150, borderRadius: 150 }}
            />
            <Text
              // entering={FadeInUp.duration(400).delay(550)}
              style={{
                marginTop: 10,
                fontSize: 30,
                fontWeight: "700",
                color: "black",
              }}
            >
              {username}
            </Text>
            <View
              style={{ flexDirection: "row", alignItems: "center" }}
              // entering={FadeInUp.duration(400).delay(650)}
            >
              <FontAwesome5 name="quote-left" size={24} color="black" />
              <Text
                style={{
                  marginTop: 10,
                  fontSize: 15,
                  fontWeight: "500",
                  color: "black",
                  opacity: 0.5,
                  marginHorizontal: 10,
                }}
              >
                UI Designer and Cook
              </Text>
              <FontAwesome5 name="quote-right" size={24} color="black" />
            </View>
          </View>
        </View>
      </SafeAreaView>
      <View
        // entering={FadeInUp.duration(400).delay(750)}
        style={{
          height: height * 0.20,
          width: width * 0.8,
          backgroundColor: "white",
          top: -70,
          borderRadius: 40,
        }}
      >
        {/* <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            margin: 20,
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 25, fontWeight: "500" }}>5</Text>
            <Text style={{ fontSize: 18, fontWeight: "400", opacity: 0.4 }}>
              Posts
            </Text>
          </View>
          <View
            style={{
              height: 50,
              width: 1,
              backgroundColor: "black",
              marginTop: 10,
            }}
          />

          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 25, fontWeight: "500" }}>105</Text>
            <Text style={{ fontSize: 18, fontWeight: "400", opacity: 0.4 }}>
              Followers
            </Text>
          </View>
          <View
            style={{
              height: 50,
              width: 1,
              backgroundColor: "black",
              marginTop: 10,
            }}
          />

          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 25, fontWeight: "500" }}>37</Text>
            <Text style={{ fontSize: 18, fontWeight: "400", opacity: 0.4 }}>
              Following
            </Text>
          </View>
        </View> */}
        <View style={{ marginHorizontal: 20, marginTop: 30 }}>
          <Text style={{ fontSize: 20, fontWeight: "700" }}>About Me</Text>
          <Text style={{ lineHeight: 16 * 1.5, marginTop: 10 }}>
            A code wizard who turns caffeine into code. Passionate
            about programming, she crafts digital wonders with keystrokes and
            coffee.
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => FIREBASE_AUTH.signOut()}>
        <Text style={{backgroundColor: '#ffd571', padding: 10, borderRadius: 20, paddingHorizontal: 40, top: -30}}>Logout</Text>
      </TouchableOpacity>

    </View>

      {/* <TextInput value={username} onChangeText={(text)=>setUsername(text)} style={{height: 60, width: 250, borderWidth: 1, marginVertical:20}} placeholder='Data 1:'/>
      <TextInput value={password} onChangeText={(text)=>setPassword(text)} style={{height: 60, width: 250, borderWidth: 1, marginVertical:20}} placeholder='Data 2:'/>
      <Button title="Submit Data" onPress={create}/>
      <Button title="Update Data" onPress={update}/> */}
      {/* <Button title="Retrieve Data" onPress={retrieve_data}/>  */}
      
    </View>
  )
}