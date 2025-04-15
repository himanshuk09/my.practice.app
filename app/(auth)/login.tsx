import React, { useState } from "react";
import {
      View,
      TextInput,
      Text,
      TouchableOpacity,
      Keyboard,
      Pressable,
      StatusBar,
      Platform,
      KeyboardAvoidingView,
      ScrollView,
      TouchableWithoutFeedback,
      ActivityIndicator,
} from "react-native";
import { Href, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { i18n } from "@/localization/config";
import Logo from "@/components/SVG/Logo";
import { loginUser } from "@/services/auth.services";
import useNetworkStatus from "@/hooks/useNetworkStatus";
import { useAuth } from "@/hooks/useAuth";

const SignIn: React.FC = () => {
      const router = useRouter();
      const isOnline = useNetworkStatus();
      const { setSessionValue } = useAuth();
      const [ loading, setLoading ] = useState<boolean>( false )
      const [ userName, setUserName ] = useState<string>( "" );
      const [ password, setPassword ] = useState<string>( "" );
      const [ errorMessage, setErrorMessage ] = useState<string>( "" );
      const [ hidePassword, setHidePassword ] = useState<boolean>( true );
      const [ isUserNameFocused, setIsUserNameFocused ] = useState( false );
      const [ isPasswordFocused, setIsPasswordFocused ] = useState( false );
      const validateInput = ( userName: string, password: string ): string => {
            if ( userName.trim() === "" && password.trim() === "" ) {
                  return "Please_enter_your_username_and_password";
            }
            if ( userName.trim() === "" ) {
                  return "Please_enter_your_username";
            }
            if ( password.trim() === "" ) {
                  return "Please_enter_your_password";
            }
            if ( !validateUserName( userName ) ) {
                  return "Username_should_not_contain_special_characters";
            }
            return ""; // No error
      };

      const validateUserName = ( username: string ): boolean => {
            const regex = /^[a-zA-Z0-9]+$/;
            return regex.test( username );
      };

      const handleSubmit = async (): Promise<void> => {
            // Validate input
            const validationError = validateInput( userName, password );
            if ( validationError ) {
                  setErrorMessage( validationError );
                  return;
            }
            setErrorMessage( "" );
            try {
                  Keyboard.dismiss();
                  setLoading( true )
                  if ( !isOnline ) {
                        setErrorMessage( "No_Internet_Connection" );
                        return;
                  }
                  const payload = {
                        username: userName,
                        password: password,
                  };
                  // Call the loginUser API function
                  const response = await loginUser( payload );

                  if ( response?.success ) {
                        setSessionValue( true );
                        router.push( "/dashboard" as Href );
                        setTimeout( () => {
                              Toast.show( {
                                    type: "success",
                                    text1: "LoggedIn Successful",
                                    position: "bottom",
                                    bottomOffset: 25,
                                    visibilityTime: 2000,
                              } );
                        }, 1000 );
                  } else {
                        setErrorMessage(
                              "Login_failed_Please_check_your_credentials"
                        );
                        Toast.show( {
                              type: "error",
                              text1: "Login failed. Please try again.",
                              position: "bottom",
                              bottomOffset: 30,
                              visibilityTime: 3000,
                        } );
                  }
            } catch ( err: unknown ) {
                  if ( err instanceof Error ) {
                        setErrorMessage(
                              err?.message || "An_error_occurred_Please_try_again"
                        );
                        setTimeout( () => {
                              Toast.show( {
                                    type: "error",
                                    text1:
                                          err?.message ||
                                          "Login failed. Please try again.",
                                    position: "bottom",
                                    bottomOffset: 30,
                                    visibilityTime: 1000,
                              } );
                        }, 1000 );
                  } else {
                        setErrorMessage(
                              "An unknown error occurred. Please try again."
                        );
                  }
            } finally {
                  setLoading( false )
            }
      };

      return (
            <SafeAreaView style={ { flex: 1 } }>
                  <StatusBar
                        barStyle="dark-content"
                        backgroundColor="#ffffff"
                        animated
                        showHideTransition={ "slide" }
                        networkActivityIndicatorVisible
                  />
                  <KeyboardAvoidingView
                        style={ { flex: 1 } }
                        behavior={ Platform.OS === "ios" ? "padding" : "height" }
                        keyboardVerticalOffset={ Platform.OS === "ios" ? 60 : 0 }
                  >
                        <TouchableWithoutFeedback
                              onPress={ () => {
                                    if ( Platform.OS !== "web" ) {
                                          Keyboard.dismiss();
                                    }
                              } }
                        >
                              <ScrollView
                                    contentContainerStyle={ { flexGrow: 1 } }
                                    keyboardShouldPersistTaps="handled"
                              >
                                    <View className="flex-1 justify-center items-center">
                                          <View className="w-11/12 max-w-md p-5">
                                                <View className="items-center mb-10 w-full">
                                                      <Logo />
                                                </View>
                                                {/**Error Handler */ }
                                                <View className="mb-5">
                                                      {/** Username Feild*/ }
                                                      <View className="relative">
                                                            <TextInput
                                                                  id="username" // ✅ Useful for form autofill
                                                                  value={ userName }
                                                                  key={ "username_input" }
                                                                  autoCapitalize="none"
                                                                  autoComplete="username" // ✅ Enables username autofill
                                                                  placeholderTextColor="#808080"
                                                                  placeholder={ i18n.t(
                                                                        "username"
                                                                  ) }
                                                                  textContentType="username"
                                                                  onFocus={ () =>
                                                                        setIsUserNameFocused(
                                                                              true
                                                                        )
                                                                  }
                                                                  onBlur={ () =>
                                                                        setIsUserNameFocused(
                                                                              false
                                                                        )
                                                                  }
                                                                  onChangeText={ ( text ) => {
                                                                        setUserName( text );
                                                                        if (
                                                                              errorMessage !==
                                                                              ""
                                                                        )
                                                                              setErrorMessage(
                                                                                    ""
                                                                              );
                                                                  } }
                                                                  className={ `pr-10 pl-3 py-3 w-full rounded-sm text-lg ${ Platform.OS === "web" && " placeholder-[#808080]  p-3 outline-none  rounded-md  text-lg " }` }
                                                                  style={ {
                                                                        backgroundColor:
                                                                              "#E5E7EB",
                                                                        borderColor:
                                                                              errorMessage
                                                                                    ? "#EF4444" // Red border for error
                                                                                    : isUserNameFocused
                                                                                          ? "#3B82F6" // Blue border on focus
                                                                                          : "#D1D5DB", // Default gray border
                                                                        borderWidth: 1,
                                                                        marginBottom: 15,
                                                                        color: "#808080",
                                                                        textDecorationLine:
                                                                              "none",

                                                                        ...( Platform.OS !==
                                                                              "web"
                                                                              ? {
                                                                                    shadowColor:
                                                                                          errorMessage
                                                                                                ? "#FCA5A5" // Red shadow for error
                                                                                                : isUserNameFocused
                                                                                                      ? "#3B82F6" // Blue shadow on focus
                                                                                                      : "transparent",
                                                                                    shadowOffset:
                                                                                    {
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
                                                                              : null ),
                                                                  } }
                                                            />

                                                            <TouchableOpacity
                                                                  style={ {
                                                                        position:
                                                                              "absolute",
                                                                        right: 13,
                                                                        top:
                                                                              Platform.OS ===
                                                                                    "web"
                                                                                    ? 15
                                                                                    : 11,
                                                                        zIndex: 100,
                                                                  } }
                                                                  activeOpacity={ 0.8 }
                                                            >
                                                                  <FontAwesome
                                                                        name="user"
                                                                        size={ 26 }
                                                                        color="#6b7280"
                                                                        style={ {
                                                                              zIndex: 100,
                                                                        } }
                                                                  />
                                                            </TouchableOpacity>
                                                      </View>

                                                      {/**Password Feild */ }
                                                      <View className="relative">
                                                            <TextInput
                                                                  id="password"
                                                                  value={ password }
                                                                  autoCapitalize="none"
                                                                  key={ "password_input" }
                                                                  textContentType="password"
                                                                  placeholderTextColor="#808080"
                                                                  placeholder={ i18n.t(
                                                                        "password"
                                                                  ) }
                                                                  secureTextEntry={
                                                                        hidePassword
                                                                  }
                                                                  autoComplete="current-password" // ✅ Enables password autofill
                                                                  onChangeText={ ( text ) => {
                                                                        setPassword( text );
                                                                        if (
                                                                              errorMessage !==
                                                                              ""
                                                                        )
                                                                              setErrorMessage(
                                                                                    ""
                                                                              );
                                                                  } }
                                                                  onFocus={ () =>
                                                                        setIsPasswordFocused(
                                                                              true
                                                                        )
                                                                  }
                                                                  onBlur={ () =>
                                                                        setIsPasswordFocused(
                                                                              false
                                                                        )
                                                                  }
                                                                  className={ `pr-10 pl-3 py-3 w-full rounded-sm text-lg ${ Platform.OS === "web" && "p-3 outline-none  rounded-md  text-lg " }` }
                                                                  style={ {
                                                                        backgroundColor:
                                                                              "#E5E7EB",
                                                                        borderColor:
                                                                              errorMessage
                                                                                    ? "#EF4444" // Red border for error
                                                                                    : isPasswordFocused
                                                                                          ? "#3B82F6" // Blue border on focus
                                                                                          : "#D1D5DB", // Default gray border
                                                                        borderWidth: 1,
                                                                        borderRadius: 2,
                                                                        marginBottom: 5,
                                                                        color: "#808080",
                                                                        textDecorationLine:
                                                                              "none",
                                                                        zIndex: 0,
                                                                        // Shadow Handling
                                                                        ...( Platform.OS !==
                                                                              "web"
                                                                              ? {
                                                                                    shadowColor:
                                                                                          errorMessage
                                                                                                ? "#FCA5A5" // Red shadow for error
                                                                                                : isPasswordFocused
                                                                                                      ? "#3B82F6" // Blue shadow on focus
                                                                                                      : "transparent",
                                                                                    shadowOffset:
                                                                                    {
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
                                                                              : null ),
                                                                  } }
                                                            />

                                                            <TouchableOpacity
                                                                  activeOpacity={ 0.5 }
                                                                  style={ {
                                                                        position:
                                                                              "absolute",
                                                                        right: 13,
                                                                        top:
                                                                              Platform.OS ===
                                                                                    "web"
                                                                                    ? 15
                                                                                    : 11,
                                                                        zIndex: 100,
                                                                  } }
                                                                  onPress={ () =>
                                                                        setHidePassword(
                                                                              !hidePassword
                                                                        )
                                                                  }
                                                            >
                                                                  <FontAwesome
                                                                        name={
                                                                              hidePassword
                                                                                    ? "lock"
                                                                                    : "unlock-alt"
                                                                        }
                                                                        size={ 26 }
                                                                        color="#6b7280"
                                                                  />
                                                            </TouchableOpacity>
                                                      </View>
                                                      { errorMessage ? (
                                                            <Text className="text-red-500  font-normal text-left text-sm">
                                                                  { i18n.t( errorMessage ) }
                                                            </Text>
                                                      ) : null }

                                                      {/**Login Button */ }
                                                      <TouchableOpacity
                                                            className="mt-9 p-3 rounded-full items-center bg-primary"
                                                            onPress={ handleSubmit } disabled={ loading }
                                                      >
                                                            { loading
                                                                  ?
                                                                  ( <ActivityIndicator size={ 25 } color={ "white" } /> ) :
                                                                  (
                                                                        <Text className="text-white font-medium text-xl uppercase">
                                                                              { i18n.t( "login" ) }
                                                                        </Text>
                                                                  ) }
                                                      </TouchableOpacity>
                                                      {/** Forget password screen redirector */ }
                                                      <Pressable
                                                            onPress={ () => {
                                                                  if (
                                                                        Keyboard.isVisible()
                                                                  ) {
                                                                        Keyboard.dismiss();
                                                                  }
                                                                  router.replace(
                                                                        `/(auth)/forgot-password`
                                                                  );
                                                            } }
                                                            className="mx-auto my-5  p-4"
                                                      >
                                                            <Text className="text-red-600 capitalize underline text-center text-sm">
                                                                  { i18n.t(
                                                                        "forgotyourpassword"
                                                                  ) }
                                                            </Text>
                                                      </Pressable>
                                                </View>
                                          </View>
                                    </View>
                              </ScrollView>
                        </TouchableWithoutFeedback>
                  </KeyboardAvoidingView>
            </SafeAreaView>
      );
};

export default SignIn;
