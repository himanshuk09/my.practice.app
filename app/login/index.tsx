import React, { useEffect, useState } from "react";
import {
    View,
    TextInput,
    Text,
    TouchableOpacity,
    Keyboard,
    Pressable,
    StatusBar,
    Platform,
} from "react-native";
import { Href, Redirect, useRouter } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/authSlice";
import { i18n } from "@/localization/localConfig";
import Logo from "@/components/SVG/Logo";
import { activeLoading, inActiveLoading } from "@/store/navigationSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignIn: React.FC = () => {
    const [userName, setUserName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [hidePassword, setHidePassword] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const router = useRouter();
    const dispatch = useDispatch();
    const [isAuth, setIsAuth] = useState<boolean>();
    const [isUserNameFocused, setIsUserNameFocused] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);

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
        // Validate input
        const validationError = validateInput(userName, password);
        if (validationError) {
            setErrorMessage(validationError);
            return;
        }

        setErrorMessage("");

        try {
            Keyboard.dismiss();
            dispatch(activeLoading());
            const payload = {
                email: "john@mail.com",
                password: "changeme",
            };

            // Call the loginUser API function
            // const response = await loginUser(payload);
            const response = userName === "admin" && password === "enexion1";
            if (response) {
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
            } else {
                setErrorMessage("Login failed. Please try again.");
                Toast.show({
                    type: "error",
                    text1: "Login failed. Please try again.",
                    position: "bottom",
                    bottomOffset: 30,
                    visibilityTime: 3000,
                });
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setErrorMessage(
                    err?.message || "An_error_occurred_Please_try_again"
                );
                setTimeout(() => {
                    Toast.show({
                        type: "error",
                        text1:
                            err?.message || "Login failed. Please try again.",
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
    useEffect(() => {
        const checkAuth = async () => {
            const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
            setIsAuth(isLoggedIn === "true");
        };
        checkAuth();
    }, []);

    return isAuth ? (
        <Redirect href={"/dashboard"} />
    ) : (
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
                                {errorMessage ==
                                "Login failed. Please try again."
                                    ? "Login failed. Please try again."
                                    : i18n.t(errorMessage)}
                            </Text>
                        ) : null}

                        {/** Username Feild*/}
                        <View className="relative">
                            <TextInput
                                key={"username_input"}
                                className={`${Platform.OS === "web" && "bg-gray-200 border  placeholder-[#808080] border-gray-300 p-3 focus:outline-none  rounded-md  text-lg "} `}
                                style={{
                                    paddingLeft: 12,
                                    paddingRight: 12,
                                    paddingVertical: 10,
                                    backgroundColor: "#E5E7EB",
                                    borderColor: errorMessage
                                        ? "#EF4444" // Red border for error
                                        : isUserNameFocused
                                          ? "#3B82F6" // Blue border on focus
                                          : "#D1D5DB", // Default gray border
                                    borderWidth: 1,
                                    borderRadius: 8,
                                    fontSize: 16,
                                    marginBottom: 15,
                                    color: "#808080",
                                    textDecorationLine: "none",

                                    ...(Platform.OS !== "web"
                                        ? {
                                              shadowColor: errorMessage
                                                  ? "#FCA5A5" // Red shadow for error
                                                  : isUserNameFocused
                                                    ? "#3B82F6" // Blue shadow on focus
                                                    : "transparent",
                                              shadowOffset: {
                                                  width: 0,
                                                  height: 1,
                                              },
                                              shadowOpacity:
                                                  errorMessage ||
                                                  isUserNameFocused
                                                      ? 0.8
                                                      : 0,
                                              shadowRadius:
                                                  errorMessage ||
                                                  isUserNameFocused
                                                      ? 10
                                                      : 0,
                                              elevation:
                                                  errorMessage ||
                                                  isUserNameFocused
                                                      ? 4
                                                      : 0, // Android shadow
                                          }
                                        : null),
                                }}
                                onFocus={() => setIsUserNameFocused(true)}
                                onBlur={() => setIsUserNameFocused(false)}
                                placeholderTextColor="#808080"
                                placeholder={i18n.t("username")}
                                textContentType="username"
                                value={userName}
                                onChangeText={(text) => {
                                    setUserName(text);
                                    if (errorMessage !== "")
                                        setErrorMessage("");
                                }}
                                autoCapitalize="none"
                            />

                            <TouchableOpacity
                                style={{
                                    position: "absolute",
                                    right: 13,
                                    top: 11,
                                    zIndex: 100,
                                }}
                            >
                                <FontAwesome
                                    name="user"
                                    size={26}
                                    color="#6b7280"
                                />
                            </TouchableOpacity>
                        </View>

                        {/**Password Feild */}
                        <View className="relative">
                            <TextInput
                                key={"password_input"}
                                className={`${Platform.OS === "web" && "bg-gray-200 border  placeholder-[#808080] border-gray-300 p-3 focus:outline-none  rounded-md  text-lg "} `}
                                style={{
                                    paddingLeft: 12,
                                    paddingRight: 12,
                                    paddingVertical: 10,
                                    backgroundColor: "#E5E7EB",
                                    borderColor: errorMessage
                                        ? "#EF4444" // Red border for error
                                        : isPasswordFocused
                                          ? "#3B82F6" // Blue border on focus
                                          : "#D1D5DB", // Default gray border
                                    borderWidth: 1,
                                    borderRadius: 8,
                                    fontSize: 16,
                                    marginBottom: 15,
                                    color: "#808080",
                                    textDecorationLine: "none",

                                    // Shadow Handling
                                    ...(Platform.OS !== "web"
                                        ? {
                                              shadowColor: errorMessage
                                                  ? "#FCA5A5" // Red shadow for error
                                                  : isPasswordFocused
                                                    ? "#3B82F6" // Blue shadow on focus
                                                    : "transparent",
                                              shadowOffset: {
                                                  width: 0,
                                                  height: 1,
                                              },
                                              shadowOpacity:
                                                  errorMessage ||
                                                  isPasswordFocused
                                                      ? 0.8
                                                      : 0,
                                              shadowRadius:
                                                  errorMessage ||
                                                  isPasswordFocused
                                                      ? 100
                                                      : 0,
                                              elevation:
                                                  errorMessage ||
                                                  isPasswordFocused
                                                      ? 9
                                                      : 0, // Android shadow
                                          }
                                        : null),
                                }}
                                onFocus={() => setIsPasswordFocused(true)}
                                onBlur={() => setIsPasswordFocused(false)}
                                placeholder={i18n.t("password")}
                                placeholderTextColor="#808080"
                                secureTextEntry={hidePassword}
                                value={password}
                                textContentType="password"
                                onChangeText={(text) => {
                                    setPassword(text);
                                    if (errorMessage !== "")
                                        setErrorMessage("");
                                }}
                                autoCapitalize="none"
                            />

                            <TouchableOpacity
                                style={{
                                    position: "absolute",
                                    right: 13,
                                    top: 11,
                                    zIndex: 100,
                                }}
                                onPress={() => setHidePassword(!hidePassword)}
                            >
                                <FontAwesome
                                    name={hidePassword ? "lock" : "unlock-alt"}
                                    size={26}
                                    color="#6b7280"
                                />
                            </TouchableOpacity>
                        </View>

                        {/**Login Button */}
                        <TouchableOpacity
                            className=" p-4 rounded-full items-center bg-primary"
                            onPress={handleSubmit}
                        >
                            <Text className="text-white font-semibold text-md uppercase">
                                {i18n.t("login")}
                            </Text>
                        </TouchableOpacity>
                        {/** Forget password screen redirector */}
                        <Pressable
                            onPress={() =>
                                router.replace(`/login/forgotpassword`)
                            }
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
