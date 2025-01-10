import React, { memo, useMemo, useRef, useState } from "react";
import {
    Text,
    TouchableOpacity,
    ScrollView,
    Animated,
    Easing,
    View,
    Alert,
    Platform,
} from "react-native";
import {
    MaterialIcons,
    FontAwesome,
    Ionicons,
    Feather,
    FontAwesome6,
} from "@expo/vector-icons";
import { Href, usePathname, useRouter, useSegments } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { i18n } from "@/languageKeys/i18nConfig";
import { useDispatch, useSelector } from "react-redux";
import { logout, setInitialState } from "@/store/authSlice";
import * as Linking from "expo-linking";
import { closeDrawer } from "@/store/drawerSlice";
// Helper Components

const Submenu = memo(
    ({
        isVisible,
        children,
        height,
    }: {
        isVisible: boolean;
        children: React.ReactNode;
        height: number | any;
    }) => {
        const heightAnim = useRef(new Animated.Value(0)).current;
        const opacityAnim = useRef(new Animated.Value(0)).current;

        React.useEffect(() => {
            Animated.timing(heightAnim, {
                toValue: isVisible ? height : 0,
                duration: 50,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: false,
            }).start();

            Animated.timing(opacityAnim, {
                toValue: isVisible ? 1 : 0,
                duration: 100,
                useNativeDriver: false,
            }).start();
        }, [isVisible]);

        return (
            <Animated.View
                style={{
                    height: heightAnim,
                    opacity: opacityAnim,
                    overflow: "hidden",
                }}
            >
                {children}
            </Animated.View>
        );
    }
);
const CustomDrawer = memo((props: any) => {
    const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null); // Track the active submenu
    const [isPressed, setIsPressed] = useState(false);
    const [pressedItemIndex, setPressedItemIndex] = useState(null);
    const dispatch = useDispatch();
    const pathnames = usePathname();
    const router = useRouter();
    const { startLoader } = props;
    const segments = useSegments();
    const pathname = usePathname();

    const toggleSubmenu = (key: string) => {
        setActiveSubmenu((prev) => (prev === key ? null : key)); // Toggle or close the current submenu
    };

    const getTextAndIconStyle = useMemo(
        () => (routeName: string) => ({
            color:
                routeName.replace(/\(.*\)/g, "").replace(/\/\//g, "/") ===
                pathnames
                    ? "white"
                    : "#9a9b9f",
        }),
        [pathnames]
    );

    const menuItems = [
        {
            label: "start",
            route: "/dashboard",
            icon: <FontAwesome name="home" size={23} />,
        },
        {
            label: "portfolio",
            route: "/dashboard/portfolio",
            icon: <Ionicons name="briefcase-sharp" size={20} color="#9a9b9f" />,
        },
        {
            label: "settings",
            route: "/dashboard/settings",
            icon: (
                <MaterialIcons
                    name="settings-suggest"
                    size={25}
                    color="#9a9b9f"
                />
            ),
        },
    ];

    const submenus = [
        {
            label: "marketinfo",
            key: "marketInfo",
            icon: <FontAwesome name="bar-chart-o" size={20} color="#9a9b9f" />,
            items: [
                { label: "prices", route: "/dashboard/prices" },
                { label: "pfc", route: "/dashboard/pfc" },
                { label: "signals", route: "/dashboard/signals" },
            ],
            height: 130,
        },
        {
            label: "consumption",
            key: "consumption",
            icon: (
                <Ionicons name="speedometer-sharp" size={24} color="#9a9b9f" />
            ),
            items: [{ label: "loaddata", route: "/dashboard/loaddata" }],
            height: 50,
        },
        {
            label: "feedback",
            key: "feedback",
            icon: <MaterialIcons name="message" size={24} color="#9a9b9f" />,
            items: [
                { label: "rateus", route: "/dashboard/feedback/rate" },
                { label: "contactus", route: "/dashboard/feedback/contact" },
                {
                    label: "visitwebsite",
                    route: "http://test-eec.enexion-sys.de/Cockpit.aspx",
                },
            ],
            height: 130,
        },
        {
            label: "imprintLegalNotes",
            key: "legalNotes",
            icon: (
                <FontAwesome6 name="scale-balanced" size={24} color="#9a9b9f" />
            ),
            items: [
                { label: "imprint", route: "/dashboard/legalnotes/imprint" },
                { label: "termsConditions", route: "/dashboard/legalnotes/tc" },
                {
                    label: "privacypolicy",
                    route: "/dashboard/legalnotes/privacypolicy",
                },
            ],
            height: 130,
        },
    ];

    const clearStorageAndNavigate = async (router: any) => {
        try {
            await AsyncStorage.clear();
            router.push("/");
            dispatch(logout());
            dispatch(setInitialState(false));
        } catch (error) {
            console.error("Error clearing AsyncStorage or navigating:", error);
        }
    };
    const handleLogout = () => {
        dispatch(closeDrawer());
        if (typeof window !== "undefined" && Platform.OS === "web") {
            const isConfirmed = window.confirm(
                "Are you sure you want to logout?"
            );
            if (isConfirmed) {
                clearStorageAndNavigate(router);
            }
        } else {
            Alert.alert(
                "Logout",
                "Are you sure you want to logout?",
                [
                    {
                        text: "Cancel",
                        onPress: () => console.log("Logout canceled"),
                        style: "cancel",
                    },
                    {
                        text: "OK",
                        onPress: () => clearStorageAndNavigate(router),
                        style: "destructive",
                    },
                ],
                { cancelable: true }
            );
        }
    };
    const navigationToRoute = (item: any) => {
        if (item?.route && !item?.route.startsWith("http")) {
            router.push(item?.route as Href);
            dispatch(closeDrawer());
            if (pathname !== item?.route) {
                startLoader();
            }
        } else if (item?.route?.startsWith("http")) {
            if (Platform.OS === "web") {
                window.open(item.route, "_blank");
            } else {
                Linking.openURL(item.route);
            }
        }
    };
    return (
        <ScrollView
            className="flex-1 bg-[#fff] "
            showsVerticalScrollIndicator={false}
        >
            {menuItems.map((item, index) => (
                <View key={index} className="mt-3">
                    <TouchableOpacity
                        key={index}
                        activeOpacity={0.7}
                        className={`flex-row items-center  rounded-md p-5 mx-3  ${
                            item.route.replace(/\/\([^)]*\)\//g, "/") ===
                            pathnames
                                ? "bg-primary"
                                : "bg-transparent"
                        }`}
                        onPress={() => navigationToRoute(item)}
                    >
                        {React.cloneElement(
                            item.icon,
                            getTextAndIconStyle(item.route)
                        )}
                        <Text
                            className={`text-lg font-semibold ml-4 capitalize text-chartText`}
                            style={getTextAndIconStyle(item.route)}
                        >
                            {i18n.t(item.label)}
                        </Text>
                    </TouchableOpacity>
                </View>
            ))}

            {submenus.map((submenu, index) => (
                <View key={index}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        className={`flex-row items-center rounded-md p-5 mx-3 `}
                        onPress={() => toggleSubmenu(submenu.key)}
                    >
                        {submenu.icon}
                        <Text
                            className="text-lg font-semibold  ml-4 text-chartText capitalize flex-1 break-words"
                            onPress={() => toggleSubmenu(submenu.key)}
                        >
                            {i18n.t(submenu.label)}
                        </Text>
                        <Feather
                            className="ml-auto"
                            name={
                                activeSubmenu === submenu.key
                                    ? "chevron-up"
                                    : "chevron-down"
                            }
                            size={24}
                            color="#9a9b9f"
                            onPress={() => toggleSubmenu(submenu.key)}
                        />
                    </TouchableOpacity>

                    <Submenu
                        isVisible={activeSubmenu === submenu.key}
                        height={submenu?.height}
                    >
                        {submenu.items.map((item, subIndex) => (
                            <TouchableOpacity
                                key={subIndex}
                                className={`pl-3 ml-16 rounded-md py-3 mr-3  ${
                                    item.route.replace(
                                        /\/\([^)]*\)\//g,
                                        "/"
                                    ) === pathnames
                                        ? "bg-primary"
                                        : "bg-transparent"
                                }`}
                                onPress={() => navigationToRoute(item)}
                            >
                                <Text
                                    className="text-md  font-medium text-chartText"
                                    style={getTextAndIconStyle(item.route)}
                                >
                                    {i18n.t(item.label)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </Submenu>
                </View>
            ))}

            <View className="w-full h-px bg-gray-300 my-4 mx-3" />

            {/* Logout */}
            <TouchableOpacity
                className={`flex-row items-center rounded-md p-5 mx-3 mt-4 ${
                    isPressed && "bg-primary"
                }`}
                activeOpacity={0.9}
                onPress={handleLogout}
                onPressIn={() => setIsPressed(true)}
                onPressOut={() => setIsPressed(false)}
            >
                <MaterialIcons
                    name="logout"
                    size={27}
                    color={isPressed ? "white" : "#e31837"}
                    style={{ transform: [{ scaleX: -1 }] }}
                />
                <Text
                    className={`text-xl font-bold capitalize ml-4 ${
                        isPressed ? "text-white" : "text-primary"
                    } `}
                >
                    {i18n.t("logout")}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
});
const areEqual = (prevProps: any, nextProps: any) =>
    prevProps.pathnames === nextProps.pathnames;

export default React.memo(CustomDrawer, areEqual);
