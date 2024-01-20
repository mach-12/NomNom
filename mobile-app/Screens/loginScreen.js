import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  KeyboardAvoidingView,
  Dimensions,
  TouchableOpacity,
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

export default function LoginScreen() {
  const [email, setEmail] = useState("");
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

  const uid = useUidStore((state) => state.uid);
  const setUid = useUidStore((state) => state.setUid);

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
      const user = response.user;
      const user_id = user.uid;
      setUid(user_id);
    } catch (err) {
      console.log(err);
      alert("Sign in failed with error: " + err);
    } finally {
      setLoading(false);
    }
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
          marginTop: 120,
        }}
      >
        <KeyboardAvoidingView behavior="padding">
          <View style={{ flexDirection: "row", alignItems: "baseline" }}>
            <Text style={{ fontSize: 32, fontWeight: "600" }}>Login</Text>
            <Text
                style={{
                  fontSize: 22,
                  fontWeight: "600",
                  color: "grey",
                  marginLeft: width * 0.05,
                }}
              >/
              </Text>
            <TouchableOpacity onPress={()=>navigation.navigate('RegistrationScreen')}>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "600",
                  color: "grey",
                  marginLeft: 5,
                }}
              >Sign Up
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: 30 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
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
                marginTop: 20,
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
                marginBottom: 20,
              }}
            />
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="grey" />
          ) : (
            <>
              {/* <Button title="Login" onPress={signIn} /> */}
              <TouchableOpacity onPress={signIn}>
                <View style={{width: width*0.6, height: 60, backgroundColor: '#ecb469', alignSelf: 'center', borderRadius :40, alignItems: 'center', justifyContent: 'center', elevation :5, marginTop: 80}}>
                  <Text style={{fontWeight: '600', color: 'white'}}>LOGIN</Text>
                </View>
              </TouchableOpacity>
            </>
          )}
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}
