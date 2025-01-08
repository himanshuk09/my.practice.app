import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Keyboard,
  Pressable,
  StatusBar,
} from "react-native";
import { Href, useRouter } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/authSlice";
import { i18n } from "@/languageKeys/i18nConfig";
import Logo from "@/components/SVG/Logo";
import { activeLoading, inActiveLoading } from "@/store/navigationSlice";
import { loginUser } from "@/services/auth.services";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const SignIn: React.FC = () => {
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [hidePassword, setHidePassword] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();
  const dispatch = useDispatch();
  const validateInput = (userName: string, password: string): string => {
    if (userName.trim() === "" && password.trim() === "") {
      return "Please_enter_your_username_and_password";
    }
    if (userName.trim() === "") {
      return "Please_enter_your_username";
    }
    if (password.trim() === "") {
      return "Please_enter_your_password";
    }
    if (!validateUserName(userName)) {
      return "Username_should_not_contain_special_characters";
    }
    return ""; // No error
  };
  const validateUserName = (username: string): boolean => {
    const regex = /^[a-zA-Z0-9]+$/;
    return regex.test(username);
  };
  const handleSubmit = async (): Promise<void> => {
    Keyboard.dismiss();
    // Validate input
    const validationError = validateInput(userName, password);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setErrorMessage("");

    try {
      dispatch(activeLoading());
      const payload = {
        email: "john@mail.com",
        password: "changeme",
      };

      // Call the loginUser API function
      const response = await loginUser(payload);
      console.log("response", response);

      if (response?.status === 201) {
        dispatch(setUser());
        router.push("/dashboard" as Href);
        setTimeout(() => {
          Toast.show({
            type: "success", // 'success', 'error', 'info', etc.
            text1: "LoggedIn Successful",

            position: "bottom",
            bottomOffset: 25,
            visibilityTime: 2000,
          });
        }, 2000);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err?.message || "An_error_occurred_Please_try_again");
        setTimeout(() => {
          Toast.show({
            type: "error", // 'success', 'error', 'info', etc.
            text1: err?.message || "An_error_occurred_Please_try_again",
            position: "bottom",
            bottomOffset: 30,
            visibilityTime: 1000,
          });
        }, 1000);
      } else {
        setErrorMessage("An unknown error occurred. Please try again.");
      }
    } finally {
      dispatch(inActiveLoading());
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#ffffff"
        animated
        showHideTransition={"slide"}
        networkActivityIndicatorVisible
      />
      <View className="flex-1 justify-center items-center">
        <View className="w-11/12 max-w-md p-5">
          <View className="items-center mb-5 w-full">
            <Logo />
          </View>
          {/**Error Handler */}

          <View className="mb-5">
            {errorMessage ? (
              <Text className="text-red-500 mb-2 font-semibold text-center">
                {errorMessage == "Login failed. Please try again."
                  ? "Login failed. Please try again."
                  : i18n.t(errorMessage)}
              </Text>
            ) : null}
            {/** Username Feild*/}

            <View className="relative">
              <TextInput
                className={`bg-gray-200 border  placeholder-[#808080] border-gray-300 p-3 focus:outline-none focus:border-blue-500 focus:shadow-sm focus:shadow-blue-500 mb-4 focus:ring-0 rounded-md  text-lg ${
                  errorMessage && "border-red-500 shadow-red-300 shadow-sm"
                }`}
                placeholder={i18n.t("username")}
                textContentType="username"
                placeholderTextColor="#808080"
                value={userName}
                onChangeText={(text) => {
                  setUserName(text);
                  if (errorMessage !== "") setErrorMessage("");
                }}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={{
                  position: "absolute",
                  right: 12,
                  top: 12,
                  zIndex: 100,
                }}
              >
                <FontAwesome name="user" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            {/**Password Feild */}

            <View className="relative">
              <TextInput
                className={`bg-gray-200 border  placeholder-[#808080] border-gray-300 p-3 focus:outline-none focus:border-blue-500 focus:shadow-blue-500 focus:shadow-sm  mb-4 focus:ring-0 rounded-md  text-lg ${
                  errorMessage && "border-red-500 shadow-red-300 shadow-sm"
                }`}
                placeholder={i18n.t("password")}
                placeholderTextColor="#808080"
                secureTextEntry={hidePassword}
                value={password}
                textContentType="password"
                onChangeText={(text) => {
                  setPassword(text);
                  if (errorMessage !== "") setErrorMessage("");
                }}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={{
                  position: "absolute",
                  right: 12,
                  top: 12,
                  zIndex: 100,
                }}
                onPress={() => setHidePassword(!hidePassword)}
              >
                <FontAwesome
                  name={hidePassword ? "lock" : "unlock-alt"}
                  size={24}
                  color="#6b7280"
                />
              </TouchableOpacity>
            </View>
            {/**Login Button */}
            <TouchableOpacity
              className="bg-red-600 p-4 rounded-full items-center"
              onPress={handleSubmit}
            >
              <Text className="text-white font-semibold text-md uppercase">
                {i18n.t("login")}
              </Text>
            </TouchableOpacity>
            {/** Forget password screen redirector */}
            <Pressable
              onPress={() => router.replace(`/login/forgotpassword`)}
              className="mx-auto my-5  p-4"
            >
              <Text className="text-red-600 capitalize underline text-center text-sm">
                {i18n.t("forgotyourpassword")}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;
