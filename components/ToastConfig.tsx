import { Text, View } from "react-native";

import { AntDesign, MaterialIcons } from "@expo/vector-icons";

const toastConfig: any = {
  success: ({ text1, text2, ...rest }: any) => (
    <View className="flex-row justify-center items-center py-3 px-5   bg-[#ebebeb] rounded-full">
      {/* <MaterialIcons name="done-all" size={24} color="green" className="mr-2" /> */}

      <View>
        <Text className="text-lg justify-center items-center font-semibold text-gray-600">
          {text1}
        </Text>
        {text2 ? <Text className="text-sm text-gray-600">{text2}</Text> : null}
      </View>
    </View>
  ),

  // success: ({ text1, text2, ...rest }: any) => (
  //   <View className="flex-row items-center p-4 mx-10 bg-green-100 rounded-lg">
  //     <MaterialIcons name="done-all" size={24} color="green" className="mr-2" />
  //     <View className="flex-1">
  //       <Text className="text-lg font-semibold text-green-800">{text1}</Text>
  //       {text2 ? <Text className="text-sm text-green-700">{text2}</Text> : null}
  //     </View>
  //   </View>
  // ),
  error: ({ text1, text2, ...rest }: any) => (
    <View className="flex-row justify-center items-center py-3 px-5 bg-red-100 rounded-full">
      <AntDesign
        name="closecircleo"
        size={24}
        color="#ef4444"
        className="mr-2"
      />
      <View>
        <Text className="text-lg justify-center items-center font-semibold text-red-500">
          {text1}
        </Text>
        {text2 ? <Text className="text-sm text-red-700">{text2}</Text> : null}
      </View>
    </View>
  ),
  info: ({ text1, text2, ...rest }: any) => (
    <View className="flex-row items-center p-4 mx-10 bg-blue-100 rounded-lg">
      <MaterialIcons name="info" size={24} color="blue" className="mr-2" />
      <View className="flex-1">
        <Text className="text-lg font-semibold text-blue-800">{text1}</Text>
        {text2 ? <Text className="text-sm text-blue-700">{text2}</Text> : null}
      </View>
    </View>
  ),
};
export default toastConfig;
