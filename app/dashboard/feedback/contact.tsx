import React, { useEffect, useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    StatusBar,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { i18n } from "@/languageKeys/i18nConfig";
import { useDispatch } from "react-redux";
import { inActiveLoading } from "@/store/navigationSlice";
import { useIsFocused } from "@react-navigation/native";
const ContactUs = () => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const router = useRouter();
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    useEffect(() => {
        setTimeout(() => dispatch(inActiveLoading()), 100);
    }, [isFocused]);
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <StatusBar
                barStyle="dark-content"
                backgroundColor="#C3C3C3"
                animated
                showHideTransition={"slide"}
                networkActivityIndicatorVisible
            />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView className="flex-1 bg-white">
                    {/* Header */}
                    <View className="top-0 w-full z-50 p-3 bg-[#e31837] h-20">
                        <Text className="text-xl font-semibold text-white capitalize">
                            {i18n.t("contactus")}
                        </Text>
                    </View>

                    {/* Input Fields */}
                    <ScrollView
                        className="flex-1"
                        contentContainerStyle={{ padding: 15 }}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* Name Field */}
                        <View className="w-full p-2 relative mb-1">
                            <TextInput
                                className="pr-10 pl-3 py-3 bg-gray-200 border w-full placeholder-[#808080] border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-0 rounded-md text-lg"
                                placeholder={i18n.t("name")}
                                value={name}
                                onChangeText={setName}
                                autoCapitalize="words"
                            />
                            <FontAwesome
                                style={{
                                    position: "absolute",
                                    right: 20,
                                    top: 20,
                                }}
                                name="user"
                                size={20}
                                color="#6b7280"
                            />
                        </View>

                        {/* Phone Field */}
                        <View className="w-full p-2 relative mb-1">
                            <TextInput
                                className="pr-10 pl-3 py-3 bg-gray-200 border w-full placeholder-[#808080] border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-0 rounded-md text-lg"
                                placeholder={i18n.t("phone")}
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                            />
                            <FontAwesome
                                style={{
                                    position: "absolute",
                                    right: 20,
                                    top: 20,
                                }}
                                name="phone"
                                size={20}
                                color="#6b7280"
                            />
                        </View>

                        {/* Email Field */}
                        <View className="w-full p-2 relative mb-1">
                            <TextInput
                                className="pr-10 pl-3 py-3 bg-gray-200 border w-full placeholder-[#808080] border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-0 rounded-md text-lg"
                                placeholder={i18n.t("email")}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            <FontAwesome
                                style={{
                                    position: "absolute",
                                    right: 20,
                                    top: 20,
                                }}
                                name="envelope"
                                size={20}
                                color="#6b7280"
                            />
                        </View>

                        {/* Message Field */}
                        <View className="w-full p-2 relative">
                            <TextInput
                                className="pr-10 pl-3 py-3 bg-gray-200 border h-40 w-full placeholder-[#808080] border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-0 rounded-md text-lg align-top"
                                placeholder={i18n.t("message")}
                                value={message}
                                onChangeText={setMessage}
                                multiline={true}
                                numberOfLines={6}
                            />
                            <FontAwesome
                                style={{
                                    position: "absolute",
                                    right: 20,
                                    top: 20,
                                }}
                                name="pencil"
                                size={20}
                                color="#6b7280"
                            />
                        </View>
                    </ScrollView>

                    {/* Footer Buttons */}
                    <View className="w-full flex flex-row justify-evenly border-t-2 border-[#e31837]">
                        <TouchableOpacity
                            className="items-center p-5 w-[50%] bg-white"
                            onPress={() => {
                                router.back();
                            }}
                        >
                            <Text className="text-center text-[#e31837] font-normal uppercase bg-white">
                                {i18n.t("cancel")}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="items-center p-5 w-[50%] bg-[#e31837]"
                            onPress={() => {
                                console.log("Message sent:", {
                                    name,
                                    phone,
                                    email,
                                    message,
                                });
                                alert("Message sent successfully!");
                            }}
                        >
                            <Text className="text-center text-white uppercase font-normal">
                                {i18n.t("send")}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};
export default ContactUs;
