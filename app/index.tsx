import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Link, useRouter } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/authSlice";
import { i18n } from "@/languageKeys/i18nConfig";
import Logo from "@/components/SVG/Logo";

const SignIn: React.FC = () => {
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [hidePassword, setHidePassword] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();
  const dispatch = useDispatch();
  const validateUserName = (username: string): boolean => {
    const regex = /^[a-zA-Z0-9]+$/;
    return regex.test(username);
  };
  const handleSubmit = (): void => {
    switch (true) {
      case userName.trim() === "" && password.trim() === "":
        setErrorMessage("Please enter your username and password.");
        return;
      case userName.trim() === "":
        setErrorMessage("Please enter your username.");
        return;
      case password.trim() === "":
        setErrorMessage("Please enter your password.");
        return;
      case !validateUserName(userName):
        setErrorMessage("Username should not contain special characters.");
        return;
      case userName.toLowerCase() === "admin" && password === "enexion1":
        router.push("/dashboard" as any);
        dispatch(setUser());
        setUserName("");
        setPassword("");
        return;
      default:
        setErrorMessage("The username or password you entered is incorrect.");
        return;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
      <View className="flex-1 justify-center items-center">
        <View className="w-11/12 max-w-md p-5">
          <View className="items-center mb-5 w-full">
            <Logo />
          </View>

          <View className="mb-5">
            {errorMessage ? (
              <Text className="text-red-500 mb-2 font-semibold text-center">
                {errorMessage}
              </Text>
            ) : null}

            <View className="relative">
              <TextInput
                className={`bg-gray-200 border  placeholder-[#808080] border-gray-300 p-3 focus:outline-none focus:border-blue-500 focus:shadow-sm focus:shadow-blue-500 mb-4 focus:ring-0 rounded-md  text-lg ${
                  errorMessage && "border-red-500 shadow-red-300 shadow-sm"
                }`}
                placeholder="Username"
                textContentType="username"
                value={userName}
                onChangeText={(text) => {
                  setUserName(text);
                  errorMessage !== "" ? setErrorMessage("") : null;
                }}
                autoCapitalize="none"
              />
              <FontAwesome
                style={{ position: "absolute", right: 12, top: 12 }}
                name="user"
                size={24}
                color="#6b7280"
              />
            </View>

            <View className="relative">
              <TextInput
                className={`bg-gray-200 border  placeholder-[#808080] border-gray-300 p-3 focus:outline-none focus:border-blue-500 focus:shadow-blue-500 focus:shadow-sm  mb-4 focus:ring-0 rounded-md  text-lg ${
                  errorMessage && "border-red-500 shadow-red-300 shadow-sm"
                }`}
                placeholder="Password"
                placeholderTextColor="#808080"
                secureTextEntry={hidePassword}
                value={password}
                textContentType="password"
                onChangeText={(text) => {
                  setPassword(text);
                  errorMessage !== "" ? setErrorMessage("") : null;
                }}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={{ position: "absolute", right: 12, top: 12 }}
                onPress={() => setHidePassword(!hidePassword)}
              >
                <FontAwesome
                  name={hidePassword ? "lock" : "unlock-alt"}
                  size={24}
                  color="#6b7280"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              className="bg-red-600 p-4 rounded-full items-center"
              onPress={handleSubmit}
            >
              <Text className="text-white font-semibold text-md uppercase">
                {i18n.t("login")}
              </Text>
            </TouchableOpacity>
            <Link href={`/login/forgotpassword`} className="mx-auto mt-5">
              <Text className="text-red-600 capitalize underline text-center text-sm">
                {i18n.t("forgotyourpassword")}
              </Text>
            </Link>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;
