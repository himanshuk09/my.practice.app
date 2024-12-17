import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Keyboard,
} from "react-native";
import { Href, Link, useRouter } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/authSlice";
import { i18n } from "@/languageKeys/i18nConfig";
import Logo from "@/components/SVG/Logo";
import { activeLoading, inActiveLoading } from "@/store/navigationSlice";
import { loginUser } from "@/services/auth.services";

const SignIn: React.FC = () => {
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [hidePassword, setHidePassword] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();
  const dispatch = useDispatch();
  const validateInput = (userName: string, password: string): string => {
    if (userName.trim() === "" && password.trim() === "") {
      return "Please enter your username and password.";
    }
    if (userName.trim() === "") {
      return "Please enter your username.";
    }
    if (password.trim() === "") {
      return "Please enter your password.";
    }
    if (!validateUserName(userName)) {
      return "Username should not contain special characters.";
    }
    return ""; // No error
  };
  const validateUserName = (username: string): boolean => {
    const regex = /^[a-zA-Z0-9]+$/;
    return regex.test(username);
  };
  let payload = {
    email: "john@mail.com",
    password: "changeme",
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

      if (response) {
        dispatch(setUser(response)); // Assuming 'response' contains user data
        router.push("/dashboard"); // Redirect to dashboard
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "An error occurred. Please try again."); // Display error message
    } finally {
      dispatch(inActiveLoading());
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
          {/**Error Handler */}

          <View className="mb-5">
            {errorMessage ? (
              <Text className="text-red-500 mb-2 font-semibold text-center">
                {errorMessage}
              </Text>
            ) : null}
            {/** Username Feild*/}

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
                  if (errorMessage !== "") setErrorMessage("");
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
            {/**Password Feild */}

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
                  if (errorMessage !== "") setErrorMessage("");
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
// const handleSubmit1 = (): void => {
//   switch (true) {
//     case userName.trim() === "" && password.trim() === "":
//       setErrorMessage("Please enter your username and password.");
//       return;
//     case userName.trim() === "":
//       setErrorMessage("Please enter your username.");
//       return;
//     case password.trim() === "":
//       setErrorMessage("Please enter your password.");
//       return;
//     case !validateUserName(userName):
//       setErrorMessage("Username should not contain special characters.");
//       return;
//     case userName.toLowerCase() === "admin" && password === "enexion1":
//       dispatch(activeLoading());
//       // dispatch(setUser());
//       setTimeout(() => router.push("/dashboard" as Href), 1000);
//       setUserName("");
//       setPassword("");
//       return;
//     default:
//       setErrorMessage("The username or password you entered is incorrect.");
//       return;
//   }
// };
