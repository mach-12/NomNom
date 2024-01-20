import {
  Ionicons,
  MaterialCommunityIcons,
  AntDesign,
} from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, View } from "react-native";
import { FIREBASE_AUTH } from "../FirebaseConfig.js";
import AccountScreen from "../Screens/accountScreen.js";
import ChatbotScreen from "../Screens/chatBotScreen.js";
import CustomizeScreen from "../Screens/customizeScreen.js";
import HomeScreen from "../Screens/homeScreen.js";
import InventoryScreen from "../Screens/inventoryScreen.js";
import LoginScreen from "../Screens/loginScreen.js";
import RegistrationScreen from "../Screens/registrationScreen.js";
import SearchScreen from "../Screens/searchScreen.js";
import SplashScreen from "../Screens/splashScreen.js";
import topDishScreen from "../Screens/topDishScreen.js";
import Onboarding from "./onboarding.js";
import RecipeInfo from "./recipeInfo.js";
import OcrScreen from "../Screens/ocrScreen.js";
// import { MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();

export default function AppNavigation() {
  const [user, setUser] = useState(null);
  const showLine = useRef(true);

  const TabNavigator = () => (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "white",
            position: "absolute",
            bottom: 30,
            marginHorizontal: 20,
            height: 60,
            borderRadius: 10,
            paddingHorizontal: 20,
          },
        }}
      >
        {}
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  position: "absolute",
                }}
              >
                {focused ? (
                  <Ionicons name="ios-home" size={20} color="#fb9c32" />
                ) : (
                  <Ionicons name="ios-home-outline" size={20} color="gray" />
                )}
              </View>
            ),
          }}
          listeners={({ navigation, route }) => ({
            tabPress: (e) => {
              showLine.current = true;
              Animated.spring(tabOffsetValue, {
                toValue: 0,
                useNativeDriver: true,
              }).start();
            },
          })}
        ></Tab.Screen>

        <Tab.Screen
          name="Search"
          component={SearchScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  position: "absolute",
                }}
              >
                {focused ? (
                  <Ionicons name="ios-search-sharp" size={20} color="#fb9c32" />
                ) : (
                  <Ionicons name="ios-search-sharp" size={20} color="gray" />
                )}
              </View>
            ),
          }}
          listeners={({ navigation, route }) => ({
            tabPress: (e) => {
              showLine.current = true;
              Animated.spring(tabOffsetValue, {
                toValue: getWidth(),
                useNativeDriver: true,
              }).start();
            },
          })}
        ></Tab.Screen>

        <Tab.Screen
          name="Ocr"
          component={OcrScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  position: "absolute",
                  // borderWidth: 1,
                  // borderColor: focused ? '#fb9c32' : 'gray',
                  padding: 10,
                  borderRadius: 50,
                  backgroundColor: "#fb9c32",
                  bottom: 20,
                  elevation: 3,
                  zIndex: 20,
                }}
              >
                <AntDesign name="scan1" size={40} color="white" />
              </View>
            ),
          }}
          listeners={({ navigation, route }) => ({
            tabPress: (e) => {
              showLine.current = false;
              Animated.spring(tabOffsetValue, {
                toValue: getWidth() * 2,
                useNativeDriver: true,
              }).start();
            },
          })}
        ></Tab.Screen>

        <Tab.Screen
          name="Chatbot"
          component={ChatbotScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  position: "absolute",
                }}
              >
                {focused ? (
                  <MaterialCommunityIcons
                    name="robot-excited"
                    size={20}
                    color="#fb9c32"
                  />
                ) : (
                  <MaterialCommunityIcons
                    name="robot-excited-outline"
                    size={20}
                    color="gray"
                  />
                )}
              </View>
            ),
          }}
          listeners={({ navigation, route }) => ({
            tabPress: (e) => {
              showLine.current = true;
              Animated.spring(tabOffsetValue, {
                toValue: getWidth() * 3,
                useNativeDriver: true,
              }).start();
            },
          })}
        ></Tab.Screen>
        <Tab.Screen
          name="Settings"
          component={AccountScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  position: "absolute",
                }}
              >
                {focused ? (
                  <Ionicons name="settings" size={20} color="#fb9c32" />
                ) : (
                  <Ionicons name="settings-outline" size={20} color="gray" />
                )}
              </View>
            ),
          }}
          listeners={({ navigation, route }) => ({
            tabPress: (e) => {
              showLine.current = true;
              Animated.spring(tabOffsetValue, {
                toValue: getWidth() * 4,
                useNativeDriver: true,
              }).start();
            },
          })}
        ></Tab.Screen>
      </Tab.Navigator>

      {showLine.current && (
        <Animated.View
          style={{
            width: getWidth() - 20,
            height: 2,
            backgroundColor: "#fb9c32",
            position: "absolute",
            bottom: 88,
            left: 49,
            borderRadius: 20,
            zIndex: 10,
            transform: [{ translateX: tabOffsetValue }],
          }}
        ></Animated.View>
      )}
    </>
  );

  function InsideLayout() {
    return (
      <InsideStack.Navigator initialRouteName="Tabs">
        <InsideStack.Screen
          name="Tabs"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <InsideStack.Screen
          name="Details"
          component={HomeScreen}
          options={{
            title: "Home Screen",
            headerShown: false,
            animation: "slide_from_right",
          }}
        />
        <InsideStack.Screen
          name="TopRecipeScreen"
          component={topDishScreen}
          options={{
            title: "Top Recipe Screen",
            headerShown: false,
            animation: "slide_from_right",
          }}
        />
        <InsideStack.Screen
          name="RecipeInfo"
          component={RecipeInfo}
          options={{
            title: "Recipe Info",
            headerShown: false,
            animation: "slide_from_right",
          }}
        />
        <InsideStack.Screen
          name="CustomizeScreen"
          component={CustomizeScreen}
          options={{
            title: "Customize Screen",
            headerShown: false,
            animation: "slide_from_right",
          }}
        />
        <InsideStack.Screen
          name="InventorySearchScreen"
          component={InventoryScreen}
          options={{
            title: "Inventory Search Screen",
            headerShown: false,
            animation: "slide_from_right",
          }}
        />
      </InsideStack.Navigator>
    );
  }
  const tabOffsetValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log("user: " + user);
      setUser(user);
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        {user ? (
          <Stack.Screen
            name="InsideScreens"
            component={InsideLayout}
            options={{
              title: "Login Screen",
              headerShown: false,
              animation: "slide_from_right",
            }}
          />
        ) : (
          <>
            <Stack.Screen
              name="SplashScreen"
              component={SplashScreen}
              options={{
                title: "Splash Screen",
                headerShown: false,
                animation: "slide_from_right",
              }}
            />
            <Stack.Screen
              name="OnboardingScreen"
              component={Onboarding}
              options={{
                title: "Onboarding Screen",
                headerShown: false,
                animation: "slide_from_right",
              }}
            />
            <Stack.Screen
              name="LoginScreen"
              component={LoginScreen}
              options={{
                title: "Login Screen",
                headerShown: false,
                animation: "slide_from_right",
              }}
            />
            <Stack.Screen
              name="RegistrationScreen"
              component={RegistrationScreen}
              options={{
                title: "Login Screen",
                headerShown: false,
                animation: "slide_from_right",
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function getWidth() {
  let width = Dimensions.get("window").width;

  width = width - 80;

  return width / 5;
}
