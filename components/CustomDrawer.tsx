import React, { useRef, useState } from "react";
import {
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
  Easing,
  View,
  Alert,
  Platform,
} from "react-native";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome,
  Ionicons,
  Feather,
  FontAwesome6,
  Entypo,
} from "@expo/vector-icons";
import { Href, usePathname, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { i18n } from "@/languageKeys/i18nConfig";
import { useDispatch } from "react-redux";
import { logout, setInitialState } from "@/store/authSlice";

// Helper Components
const Submenu = ({
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
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();

    Animated.timing(opacityAnim, {
      toValue: isVisible ? 1 : 0,
      duration: 200,
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
};
const CustomDrawer = (props: any) => {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null); // Track the active submenu
  const [isPressed, setIsPressed] = useState(false);
  const dispatch = useDispatch();
  const pathnames = usePathname();
  const router = useRouter();
  const { startLoader } = props;
  const toggleSubmenu = (key: string) => {
    setActiveSubmenu((prev) => (prev === key ? null : key)); // Toggle or close the current submenu
  };

  const getTextAndIconStyle = (routeName: any) => ({
    color:
      routeName.replace(/\(.*\)/g, "").replace(/\/\//g, "/") === pathnames
        ? "white"
        : "gray",
  });

  const menuItems = [
    {
      label: "start",
      route: "/dashboard",
      icon: <FontAwesome name="home" size={23} />,
    },
    {
      label: "portfolio",
      route: "/dashboard/portfolio",
      icon: <Ionicons name="briefcase-sharp" size={20} color="gray" />,
    },
    {
      label: "settings",
      route: "/dashboard/setting",
      icon: <MaterialIcons name="settings-suggest" size={25} color="gray" />,
    },
  ];

  const submenus = [
    {
      label: "marketinfo",
      key: "marketInfo",
      icon: <FontAwesome name="bar-chart-o" size={20} color="gray" />,
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
      icon: <Ionicons name="speedometer-sharp" size={24} color="gray" />,
      items: [{ label: "loaddata", route: "/dashboard/load" }],
      height: 50,
    },
    {
      label: "feedback",
      key: "feedback",
      icon: <MaterialIcons name="message" size={24} color="gray" />,
      items: [
        { label: "rateus", route: "/dashboard/feedback/rate" },
        { label: "contactus", route: "/dashboard/feedback/contact" },
        { label: "visitwebsite", route: "https://www.google.com/" },
      ],
      height: 130,
    },
    {
      label: "imprintLegalNotes",
      key: "legalNotes",
      icon: <FontAwesome6 name="scale-balanced" size={24} color="gray" />,
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
    if (typeof window !== "undefined" && Platform.OS === "web") {
      const isConfirmed = window.confirm("Are you sure you want to logout?");
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

  return (
    <ScrollView
      className="flex-1 bg-[#fff]"
      style={{ paddingTop: (StatusBar.currentHeight || 0) + 25 }}
      showsVerticalScrollIndicator={false}
    >
      {menuItems.map((item, index) => (
        <View key={index}>
          <TouchableOpacity
            key={index}
            activeOpacity={0.7}
            className={`flex-row items-center  rounded-md p-5 mx-3  ${
              item.route.replace(/\/\([^)]*\)\//g, "/") === pathnames
                ? "bg-[#e31837]"
                : "bg-transparent"
            }`}
            onPress={() => {
              startLoader();
              router.push(item?.route as Href);
            }}
          >
            {React.cloneElement(item.icon, getTextAndIconStyle(item.route))}
            <Text
              className={`text-lg font-semibold ml-4 capitalize text-gray-500 `}
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
            activeOpacity={0.7}
            className={`flex-row items-center rounded-md p-5 mx-3 active:bg-[#e87777c7]`}
            onPress={() => toggleSubmenu(submenu.key)}
          >
            {submenu.icon}
            <Text className="text-lg font-semibold ml-4 text-gray-500 capitalize flex-1 break-words">
              {i18n.t(submenu.label)}
            </Text>
            <Feather
              className="ml-auto"
              name={
                activeSubmenu === submenu.key ? "chevron-up" : "chevron-down"
              }
              size={24}
              color="gray"
            />
          </TouchableOpacity>

          <Submenu
            isVisible={activeSubmenu === submenu.key}
            height={submenu?.height}
          >
            {submenu.items.map((item, subIndex) => (
              <TouchableOpacity
                key={subIndex}
                className={`pl-3 ml-12 rounded-md py-3 mr-3  ${
                  item.route.replace(/\/\([^)]*\)\//g, "/") === pathnames
                    ? "bg-[#e31837]"
                    : "bg-transparent"
                }`}
                onPress={() => {
                  startLoader();
                  router.push(item?.route as Href);
                }}
              >
                <Text
                  className="text-md capitalize font-semibold text-gray-500"
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
          isPressed && "bg-[#e31837]"
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
          className={`text-xl font-bold  ml-4 ${
            isPressed ? "text-white" : "text-[#e31837]"
          } `}
        >
          {i18n.t("logout")}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
export default CustomDrawer;
// const CustomDrawer = (props: any) => {
//   const [submenuVisibility, setSubmenuVisibility] = useState<any>({
//     marketInfo: false,
//     consumption: false,
//     feedback: false,
//     legalNotes: false,
//   });
//   const [isPressed, setIsPressed] = useState(false);
//   const pathnames = usePathname();
//   const router = useRouter();
//   const toggleSubmenu = (key: string) => {
//     setSubmenuVisibility((prev: any) => ({
//       ...prev,
//       [key]: !prev[key],
//     }));
//   };
//   const getTextAndIconStyle = (routeName: any) => ({
//     color:
//       routeName.replace(/\(.*\)/g, "").replace(/\/\//g, "/") === pathnames
//         ? "white"
//         : "gray",
//   });

//   const clearStorageAndNavigate = async (router: any) => {
//     try {
//       await AsyncStorage.clear();
//       router.push("/");
//     } catch (error) {
//       console.error("Error clearing AsyncStorage or navigating:", error);
//     }
//   };
//   const handleLogout = () => {
//     Alert.alert(
//       "Logout",
//       "Are you sure you want to logout?",
//       [
//         {
//           text: "Cancel",
//           onPress: () => console.log("Logout canceled"),
//           style: "cancel",
//         },
//         {
//           text: "OK",
//           onPress: () => clearStorageAndNavigate(router),
//           style: "destructive",
//         },
//       ],
//       { cancelable: true }
//     );
//   };
//   const menuItems = [
//     {
//       label: "start",
//       route: "/dashboard",
//       icon: <FontAwesome name="home" size={23} />,
//     },
//     {
//       label: "portfolio",
//       route: "/dashboard/portfolio",
//       icon: <Ionicons name="briefcase-sharp" size={20} color="gray" />,
//     },
//     {
//       label: "settings",
//       route: "/dashboard/setting",
//       icon: <MaterialIcons name="settings-suggest" size={25} color="gray" />,
//     },
//   ];

//   const submenus = [
//     {
//       label: "marketinfo",
//       key: "marketInfo",
//       icon: <FontAwesome name="bar-chart-o" size={20} color="gray" />,
//       items: [
//         { label: "prices", route: "/dashboard/prices" },
//         { label: "pfc", route: "/dashboard/pfc" },
//         { label: "signals", route: "/dashboard/signals" },
//       ],
//       height: 130,
//     },
//     {
//       label: "consumption",
//       key: "consumption",
//       icon: <Ionicons name="speedometer-sharp" size={24} color="gray" />,
//       items: [{ label: "loaddata", route: "/dashboard/load" }],
//       height: 50,
//     },
//     {
//       label: "feedback",
//       key: "feedback",
//       icon: <MaterialIcons name="message" size={24} color="gray" />,
//       items: [
//         { label: "rateus", route: "/dashboard/feedback/rate" },
//         { label: "contactus", route: "/dashboard/feedback/contact" },
//         { label: "visitwebsite", route: "/dashboard/feedback/website" },
//       ],
//       height: 130,
//     },
//     {
//       label: "imprintLegalNotes",
//       key: "legalNotes",
//       icon: <FontAwesome6 name="scale-balanced" size={24} color="gray" />,
//       items: [
//         { label: "imprint", route: "/dashboard/legalnotes/imprint" },
//         { label: "termsConditions", route: "/dashboard/legalnotes/tc" },
//         {
//           label: "privacypolicy",
//           route: "/dashboard/legalnotes/privacypolicy",
//         },
//       ],
//       height: 130,
//     },
//   ];
//   return (
//     <ScrollView
//       className="flex-1 bg-[#fff]"
//       style={{ paddingTop: (StatusBar.currentHeight || 0) + 25 }}
//       showsVerticalScrollIndicator={false}
//     >
//       {menuItems.map((item, index) => (
//         <View key={index}>
//           <TouchableOpacity
//             key={index}
//             activeOpacity={0.7}
//             className={`flex-row items-center  rounded-md p-5 mx-3  ${
//               item.route.replace(/\/\([^)]*\)\//g, "/") === pathnames
//                 ? "bg-[#e31837]"
//                 : "bg-transparent"
//             }`}
//             onPress={() => router.push(item?.route as Href)}
//           >
//             {React.cloneElement(item.icon, getTextAndIconStyle(item.route))}
//             <Text
//               className={`text-lg font-semibold ml-4 capitalize text-gray-500 `}
//               style={getTextAndIconStyle(item.route)}
//             >
//               {i18n.t(item.label)}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       ))}

//       {submenus.map((submenu, index) => (
//         <View key={index}>
//           <TouchableOpacity
//             activeOpacity={0.7}
//             className={`flex-row items-center rounded-md p-5 mx-3 active:bg-[#e87777c7]`}
//             onPress={() => toggleSubmenu(submenu.key)}
//           >
//             {submenu.icon}
//             <Text className="text-lg font-semibold ml-4 text-gray-500 capitalize">
//               {i18n.t(submenu.label)}
//             </Text>
//             <Feather
//               className="ml-auto"
//               name={
//                 submenuVisibility[submenu.key] ? "chevron-up" : "chevron-down"
//               }
//               size={24}
//               color="gray"
//             />
//           </TouchableOpacity>

//           <Submenu
//             isVisible={submenuVisibility[submenu.key]}
//             height={submenu?.height}
//           >
//             {submenu.items.map((item, subIndex) => (
//               <TouchableOpacity
//                 key={subIndex}
//                 className={`pl-3 ml-12 rounded-md py-3 mr-3  ${
//                   item.route.replace(/\/\([^)]*\)\//g, "/") === pathnames
//                     ? "bg-[#e31837]"
//                     : "bg-transparent"
//                 }`}
//                 onPress={() => router.push(item?.route as Href)}
//               >
//                 <Text
//                   className="text-md capitalize font-semibold text-gray-500"
//                   style={getTextAndIconStyle(item.route)}
//                 >
//                   {i18n.t(item.label)}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </Submenu>
//         </View>
//       ))}
//       <View className="w-full h-px bg-gray-300 my-4 mx-3" />

//       {/* Logout */}
//       <TouchableOpacity
//         className={`flex-row items-center rounded-md p-5 mx-3 mt-4 ${
//           isPressed && "bg-[#e31837]"
//         }`}
//         activeOpacity={0.9}
//         onPress={handleLogout}
//         onPressIn={() => setIsPressed(true)}
//         onPressOut={() => setIsPressed(false)}
//       >
//         <MaterialIcons
//           name="logout"
//           size={27}
//           color={isPressed ? "white" : "#e31837"}
//           style={{ transform: [{ scaleX: -1 }] }}
//         />
//         <Text
//           className={`text-xl font-bold  ml-4 ${
//             isPressed ? "text-white" : "text-[#e31837]"
//           } `}
//         >
//           {i18n.t("logout")}
//         </Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };
