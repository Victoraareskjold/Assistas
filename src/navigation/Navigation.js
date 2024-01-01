import React, { useState, useEffect } from "react";
import { Image, TouchableOpacity } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";

import Ionicons from "react-native-vector-icons/Ionicons";

/* Screens */
import DinSide from "../screens/DinSide";
import CreateAd from "../screens/CreateAd";
import AllCategories from "../screens/AllCategories";

import Ads from "../screens/Ads";

import Onboarding from "../screens/onboarding/Onboarding";

import Login from "../screens/onboarding/Login";
import SetupName from "../screens/onboarding/SetupName";
import SignUp from "../screens/onboarding/SignUp";
import AdView from "../screens/AdView";
import YourAdView from "../screens/YourAdView";
import AdChat from "../screens/AdChat";

import AllMessages from "../screens/AllMessages";

import Profile from "../screens/Profile";
import ChatScreen from "../screens/ChatScreen";
import ChatChannels from "../screens/ChatChannels";

/* Tab bottom */
const Tab = createBottomTabNavigator();

function TabGroup() {
  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        headerShown: false,
        tabBarStyle: {},
        tabBarIcon: ({ color, focused, size }) => {
          let iconName;
          if (route.name === "DinSideTab") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Ads") {
            iconName = focused ? "receipt" : "receipt-outline";
          } else if (route.name === "ChatChannels") {
            iconName = focused ? "chatbox" : "chatbox-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#2984FF",
      })}
    >
      <Tab.Screen
        name="DinSideTab"
        component={DinSide}
        options={{ tabBarLabel: "Hjem" }}
      />
      <Tab.Screen
        name="Ads"
        component={Ads}
        options={{ tabBarLabel: "Annonser" }}
      />
      <Tab.Screen
        name="ChatChannels"
        component={ChatChannels}
        options={{ tabBarLabel: "Meldinger" }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{ tabBarLabel: "Din profil" }}
      />
    </Tab.Navigator>
  );
}

/* LoginStack view receipt */
const LoginStack = createNativeStackNavigator();

function LoginStackGroup() {
  return (
    <LoginStack.Navigator>
      <LoginStack.Screen
        options={{ headerShown: false }}
        name="Onboarding"
        component={Onboarding}
      />
      <LoginStack.Screen
        options={{ headerShown: false }}
        name="Login"
        component={Login}
      />
      <LoginStack.Screen
        options={{ headerShown: false }}
        name="SetupName"
        component={SetupName}
      />
      <LoginStack.Screen
        options={{ headerShown: false }}
        name="SignUp"
        component={SignUp}
      />

      <LoginStack.Screen
        options={{ headerShown: false }}
        name="DinSideStack"
        component={DinSideStackGroup}
      />
    </LoginStack.Navigator>
  );
}

const DinSideStack = createNativeStackNavigator();

function DinSideStackGroup() {
  return (
    <DinSideStack.Navigator>
      <DinSideStack.Screen
        options={{ headerShown: false }}
        name="DinSide"
        component={TabGroup}
      />
      <DinSideStack.Screen
        name="CreateAd"
        component={CreateAd}
        options={({ navigation }) => ({
          headerShown: false,
          gestureEnabled: false,
        })}
      />
      <DinSideStack.Screen
        options={{ headerShown: true, headerTitle: "Alle kategorier" }}
        name="AllCategories"
        component={AllCategories}
      />
      <DinSideStack.Screen
        options={{ headerShown: true, headerTitle: " " }}
        name="AdView"
        component={AdView}
      />
      <DinSideStack.Screen
        options={{ headerShown: true, headerTitle: " " }}
        name="YourAdView"
        component={YourAdView}
      />
      <DinSideStack.Screen
        options={{ headerShown: true, headerTitle: " " }}
        name="ChatScreen"
        component={ChatScreen}
      />
      <DinSideStack.Screen
        options={{ headerShown: true, headerTitle: " " }}
        name="ChatChannels"
        component={ChatChannels}
      />
    </DinSideStack.Navigator>
  );
}

const AdsStack = createNativeStackNavigator();

function AdsStackGroup() {
  return (
    <AdsStack.Navigator>
      <AdsStack.Screen
        options={{ headerShown: false }}
        name="Ads"
        component={Ads}
      />
    </AdsStack.Navigator>
  );
}

/* Main Navigation Container */
export default function Navigation() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsUserLoggedIn(!!user);
    });

    return () => unsubscribe(); // Rengjøringsfunksjon for å avbryte lytteren
  }, []);

  return (
    <NavigationContainer>
      {isUserLoggedIn ? <DinSideStackGroup /> : <LoginStackGroup />}
    </NavigationContainer>
  );
}
