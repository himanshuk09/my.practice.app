import { RootState } from "@/store/store";
import { Redirect } from "expo-router";
import { useSelector } from "react-redux";

export default function Index() {
    const isLoggedIn = useSelector((state: RootState) => state?.auth?.value);

    return !isLoggedIn ? (
        <Redirect href="/login" />
    ) : (
        <Redirect href="/dashboard" />
    );
}
