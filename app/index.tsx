import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useSelector } from "react-redux";

export default function Index() {
    const isLoggedIn = useSelector((state: any) => state?.auth?.value);

    return !isLoggedIn ? (
        <Redirect href="/login" />
    ) : (
        <Redirect href="/dashboard" />
    );
}
