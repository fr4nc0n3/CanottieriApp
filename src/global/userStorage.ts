import { UserInfo } from "@/app/UserContext/UserContext";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { isValidDate } from "./Utils";

const CACHE_KEY = "user_info_cache";

export async function saveUserInfoCache(userInfo: UserInfo) {
    if (Platform.OS === "web") {
        localStorage.setItem(CACHE_KEY, JSON.stringify(userInfo));
    } else {
        await SecureStore.setItemAsync(CACHE_KEY, JSON.stringify(userInfo));
    }
}

export async function getUserInfoCache(): Promise<UserInfo | null> {
    let userInfoStr = null;

    if (Platform.OS === "web") {
        userInfoStr = localStorage.getItem(CACHE_KEY);
    } else {
        userInfoStr = await SecureStore.getItemAsync(CACHE_KEY);
    }

    if (!userInfoStr) {
        return null;
    }

    const userInfo = JSON.parse(userInfoStr);

    //dopo aver fatto il parse la variabile birthday dovrebbe essere una stringa
    //rappresentante la data con cui si puo' creare usando il costruttore new Date
    const birthday = new Date(userInfo.birthday);
    userInfo.birthday = isValidDate(birthday) ? birthday : null;

    return userInfo ?? null;
}

export async function deleteUserInfoCache() {
    if (Platform.OS === "web") {
        localStorage.removeItem(CACHE_KEY);
    } else {
        await SecureStore.deleteItemAsync(CACHE_KEY);
    }
}
