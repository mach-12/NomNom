import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  KeyboardAvoidingView,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { FIREBASE_AUTH } from "../FirebaseConfig.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import useUidStore from "../Components/uidStore.js";
import { Svg, G, Circle } from "react-native-svg";
import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons, AntDesign, Entypo } from "@expo/vector-icons";
import { doc, setDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../FirebaseConfig.js";
import { Dropdown } from "react-native-element-dropdown";
import DropdownComponent from "../Components/dropdown.js";

export default function RegistrationScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [activity, setActivity] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;
  const navigation = useNavigation();
  const size = 400;
  const strokeWidth = 2;
  const center = size / 2;
  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const { width, height } = Dimensions.get("screen");
  const [value, setValue] = useState(null);
  const uid = useUidStore((state) => state.uid);
  const setUid = useUidStore((state) => state.setUid);
  const [gender, setGender] = useState("");
  const [maleCheck, setMaleCheck] = useState(false);
  const [femaleCheck, setFemaleCheck] = useState(false);
  const [age,setAge]=useState('');
  const [tall, setTall]=useState('');
  const [weight, setWeight]=useState('');
  const PROTEIN_PERCENTAGE = 0.2;
  const FAT_PERCENTAGE = 0.3;
  const CARB_PERCENTAGE = 0.5;

  // Constants for activity multipliers
  const ACTIVITY_MULTIPLIERS = {
    'sedentary': 1.2,
    'lightly active': 1.375,
    'moderately active': 1.55,
    'very active': 1.725,
    'extra active': 1.9
  };

  function calculateDRI(inputData) {
    // Extracting values from input data
    const { weight, height, age, sex, activity_level } = inputData;
  
    // Validate weight, height, and age
    if (weight < 0 || height < 0 || age < 0) {
      throw new Error("Weight, height, and age must be non-negative values.");
    }
  
    // BMR Mifflin-St Jeor Equation for Total Calories
    let bmr;
    if (sex === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else if (sex === 'female') {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    } else {
      throw new Error("Invalid sex. Please enter 'male' or 'female'.");
    }
  
    // Adjust for activity level
    if (!ACTIVITY_MULTIPLIERS.hasOwnProperty(activity_level)) {
      throw new Error("Invalid activity level. Please choose from 'sedentary', 'lightly active', 'moderately active', 'very active', or 'extra active'.");
    }
  
    const totalCalories = bmr * ACTIVITY_MULTIPLIERS[activity_level];
  
    // Calculate protein, fat, and carb intake based on percentages
    const proteinCalories = totalCalories * PROTEIN_PERCENTAGE;
    const fatCalories = totalCalories * FAT_PERCENTAGE;
    const carbCalories = totalCalories * CARB_PERCENTAGE;
  
    const proteinGrams = proteinCalories / 4;
    const fatGrams = fatCalories / 9;
    const carbGrams = carbCalories / 4;
  
    return {
      total_calories: totalCalories,
      protein_calories: proteinCalories,
      fat_calories: fatCalories,
      carb_calories: carbCalories,
      protein_grams: proteinGrams,
      fat_grams: fatGrams,
      carb_grams: carbGrams,
    };
  }
  

  const signUp = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      const user = response.user;
      const user_id = user.uid;
  
      setUid(user_id);
      
      // DRI calculation
      const driInput = {
        weight: parseFloat(weight),
        height: parseFloat(tall),
        age: parseInt(age),
        sex: gender,
        activity_level: activity,
      };
      
      const driResult = calculateDRI(driInput);
  
      // Set up user profile with DRI data
      await setUpProfile(user_id, driResult);
  
      alert("Account Created :)");
    } catch (err) {
      console.log(err);
      alert("Sign up failed with error: " + err);
    } finally {
      setLoading(false);
    }
  };
  
  function setUpProfile(user_id, driResult) {
    try {
      // Add DRI data to the user profile
      setDoc(doc(FIREBASE_DB, "users", user_id), {
        name: name,
        email: email,
        gender: gender,
        age: age,
        height: tall,
        weight: weight,
        activityType: activity,
        ...driResult,
      });
    } catch (err) {
      console.log(err);
      alert(err);
    }
  }
  

  const data = [
    { label: "Sedentary", value: "sedentary" },
    { label: "Lightly active", value: "lightly active" },
    { label: "Moderately active", value: "moderately active" },
    { label: "Very active", value: "very active" },
    { label: "Extra active", value: "extra active" },
  ];

  const handleMalePress = () => {
    setMaleCheck(true);
    setFemaleCheck(false);
    setGender("male");
  };

  const handleFemalePress = () => {
    setFemaleCheck(true);
    setMaleCheck(false);
    setGender("female");
  };

  const renderItem = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
        {item.value === value && (
          <AntDesign
            style={styles.icon}
            color="black"
            name="Safety"
            size={20}
          />
        )}
      </View>
    );
  };

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        backgroundColor: "#fbf0e1",
      }}
    >
      <Svg
        width={width}
        height={height * 0.5}
        style={{ position: "absolute", bottom: height * 0.67 }}
      >
        <G rotation="-90" origin={center}>
          <Circle
            cx={center - width / 25}
            cy={center - width / 10}
            r={width / 1.668}
            strokeWidth={strokeWidth}
            stroke="#E6E7E8"
            fill="#ecb469"
          />
          <Circle
            cx={center - width / 10}
            cy={center - width / 7}
            r={width / 2.15}
            strokeWidth={strokeWidth}
            stroke="#edbb78"
            fill="#edbb78"
          />
          <Circle
            cx={center - width / 10}
            cy={center - width / 5}
            r={width / 2.5}
            strokeWidth={strokeWidth}
            stroke="#efc387"
            fill="#efc387"
          />
          <Circle
            cx={center - width / 10}
            cy={center - width / 4}
            r={width / 3.05}
            strokeWidth={strokeWidth}
            stroke="#f1ca96"
            fill="#f1ca96"
          />
        </G>
      </Svg>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          marginTop: height * 0.25,
        }}
      >
        <KeyboardAvoidingView behavior="padding">
          <View style={{ flexDirection: "row", alignItems: "baseline" }}>
            <Text style={{ fontSize: 32, fontWeight: "600" }}>Sign Up</Text>
            <Text
              style={{
                fontSize: 22,
                fontWeight: "600",
                color: "grey",
                marginLeft: width * 0.05,
              }}
            >
              /
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("LoginScreen")}
            >
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "600",
                  color: "grey",
                  marginLeft: 5,
                }}
              >
                Login
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: 10 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialCommunityIcons
                name="badge-account-horizontal-outline"
                size={24}
                color="grey"
              />
              <TextInput
                value={name}
                style={{
                  height: 50,
                  width: width * 0.7,
                  // borderWidth: 1,
                  paddingHorizontal: 10,
                }}
                placeholder="Name"
                autoCapitalize="none"
                onChangeText={(text) => setName(text)}
              />
            </View>
            <View
              style={{
                height: 1,
                width: width * 0.75,
                backgroundColor: "grey",
              }}
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <Feather name="mail" size={24} color="grey" />
              <TextInput
                value={email}
                style={{
                  height: 50,
                  width: width * 0.7,
                  // borderWidth: 1,
                  paddingHorizontal: 10,
                }}
                placeholder="Email"
                autoCapitalize="none"
                onChangeText={(text) => setEmail(text)}
              />
            </View>
            <View
              style={{
                height: 1,
                width: width * 0.75,
                backgroundColor: "grey",
              }}
            />

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <Feather name="lock" size={24} color="grey" />
              <TextInput
                value={password}
                secureTextEntry={true}
                style={{
                  height: 50,
                  width: width * 0.7,
                  // borderWidth: 1,
                  paddingHorizontal: 10,
                  // marginVertical: 20,
                }}
                placeholder="Password"
                autoCapitalize="none"
                onChangeText={(text) => setPassword(text)}
              />
            </View>
            <View
              style={{
                height: 1,
                width: width * 0.75,
                backgroundColor: "grey",
                // marginBottom: 20,
              }}
            />
          </View>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={data}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select your Activity"
            searchPlaceholder="Search..."
            value={activity}
            onChange={(item) => {
              setActivity(item.value);
            }}
            renderLeftIcon={() => (
              <AntDesign
                style={styles.icon}
                color="black"
                name="Safety"
                size={20}
              />
            )}
            renderItem={renderItem}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "baseline",
              marginTop: 10,
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                marginTop: 10,
                fontSize: 17,
                fontWeight: "500",
                color: "grey",
              }}
            >
              Select your Gender
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                onPress={() => {
                  handleMalePress();
                }}
              >
                <Entypo
                  name="circle"
                  size={20}
                  color="gray"
                  style={{
                    borderRadius: 50,
                    backgroundColor: maleCheck ? "#181818" : "transparent",
                  }}
                />
              </TouchableOpacity>
              <Text style={{ marginLeft: 5 }}>Male</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                onPress={() => {
                  handleFemalePress();
                }}
              >
                <Entypo
                  name="circle"
                  size={20}
                  color="gray"
                  style={{
                    borderRadius: 50,
                    backgroundColor: femaleCheck ? "#181818" : "transparent",
                  }}
                />
              </TouchableOpacity>
              <Text style={{ marginLeft: 5 }}>Female</Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "baseline",
              marginTop: 10,
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <AntDesign name="calendar" size={24} color="gray" />
              <TextInput
                value={age}
                style={{
                  height: 50,
                  width: width * 0.15,
                  // borderWidth: 1,
                  paddingHorizontal: 10,
                }}
                placeholder="Age"
                autoCapitalize="none"
                keyboardType="numeric"
                onChangeText={(text) => setAge(text)}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <MaterialCommunityIcons name="weight-kilogram" size={20} color="gray" />
              <TextInput
                value={weight}
                style={{
                  height: 50,
                  width: width * 0.35,
                  // borderWidth: 1,
                  paddingHorizontal: 10,
                }}
                placeholder="Weight (in kg)"
                autoCapitalize="none"
                keyboardType="numeric"
                onChangeText={(text) => setWeight(text)}
              />
            </View>

        
          </View>
          <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <MaterialCommunityIcons name="human-male-height" size={20} color="gray" />
              <TextInput
                value={tall}
                style={{
                  height: 50,
                  width: width * 0.35,
                  // borderWidth: 1,
                  paddingHorizontal: 10,
                }}
                placeholder="Height (in cm)"
                autoCapitalize="none"
                keyboardType="numeric"
                onChangeText={(text) => setTall(text)}
              />
            </View>


          {loading ? (
            <ActivityIndicator size="large" color="grey" />
          ) : (
            <>
              <TouchableOpacity onPress={signUp}>
                <View
                  style={{
                    width: width * 0.6,
                    height: 60,
                    backgroundColor: "#ecb469",
                    alignSelf: "center",
                    borderRadius: 40,
                    alignItems: "center",
                    justifyContent: "center",
                    elevation: 5,
                    marginTop: height*0.03,
                  }}
                >
                  <Text style={{ fontWeight: "600", color: "white" }}>
                    SIGN UP
                  </Text>
                </View>
              </TouchableOpacity>
            </>
          )}
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    marginTop: 20,
    height: 50,
    backgroundColor: "#fbf0e1",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fbf0e1",
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
