import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Link } from "expo-router";

import Logo from "@/components/SVG/Logo";
import Foundation from "@expo/vector-icons/Foundation";
const Forgotpassword = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const validateEmail = (text: string) => {
    if (emailRegex.test(text)) {
      setErrorMessage("");
    } else {
      setErrorMessage("Please enter a valid email address");
    }
  };
  useEffect(() => {
    if (email) {
      const interval = setInterval(() => {
        validateEmail(email);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [email]);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
      <View className="flex-1 justify-center items-center bg-white">
        <View className="w-11/12 max-w-md p-5">
          <View className="items-center mb-10 w-full">
            <Logo />
          </View>

          <View className="mb-5">
            <Text className="text-[15px] mb-5 text-gray-400 font-bold">
              Enter your registered email address to reset your password
            </Text>
            {errorMessage ? (
              <Text className="text-red-500 mb-2 font-semibold text-center">
                {errorMessage}
              </Text>
            ) : null}
            <View className="relative">
              <TextInput
                className={`bg-gray-200 border  placeholder-[#808080] border-gray-300 p-3 focus:outline-none focus:border-blue-500 focus:shadow-sm focus:shadow-blue-500 mb-10 focus:ring-0 rounded-md  text-lg ${
                  errorMessage && "border-red-500 shadow-red-500 shadow-sm"
                }`}
                placeholder="Email"
                textContentType="emailAddress"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                }}
                keyboardAppearance="default"
                autoCapitalize="none"
              />
              <Foundation
                style={{ position: "absolute", right: 13, top: 14 }}
                name="mail"
                size={26}
                color="#6b7280"
              />
            </View>

            <TouchableOpacity className="bg-red-600 p-4 rounded-full items-center">
              <Text className="text-white text-lg font-semibold text-md">
                Send
              </Text>
            </TouchableOpacity>
            <Link href="/" className="mx-auto mt-5">
              <Text className="text-red-600 underline text-center text-sm">
                Login
              </Text>
            </Link>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default Forgotpassword;
