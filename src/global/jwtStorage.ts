import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

//TODO to test

const TOKEN_KEY = "jwt_token";

export async function saveJWT(token: string) {
    if (Platform.OS === "web") {
        localStorage.setItem(TOKEN_KEY, token);
    } else {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
    }
}

export async function getJWT(): Promise<string> {
    let jwt = null;

    if (Platform.OS === "web") {
        jwt = localStorage.getItem(TOKEN_KEY);
    } else {
        jwt = await SecureStore.getItemAsync(TOKEN_KEY);
    }

    return jwt ?? "";
}

export async function deleteJWT() {
    if (Platform.OS === "web") {
        localStorage.removeItem(TOKEN_KEY);
    } else {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
}
