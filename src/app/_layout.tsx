/* Licensed under the GNU General Public License v3. See LICENSE file for details. */

import AppThemePaper from "@/global/AppThemePaper";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import * as React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
    const router = useRouter();

    return (
        <SafeAreaProvider>
            <PaperProvider theme={AppThemePaper}>
                <Stack
                    screenOptions={{
                        headerBackVisible: false,
                        header: () => (
                            <SafeAreaView>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-around",
                                        minHeight: 50,
                                        backgroundColor: "#fff",
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={() => {
                                            router.dismissTo("/MenuPage");
                                        }}
                                    >
                                        <Ionicons
                                            name="menu"
                                            size={32}
                                            color="black"
                                        />
                                    </TouchableOpacity>
                                    <Image
                                        source={require("@/assets/images/logo_canottieri_pallanza.png")}
                                        style={{
                                            height: 50,
                                            width: 50,
                                            resizeMode: "contain",
                                        }}
                                    />
                                    <Text
                                        style={{
                                            fontWeight: "bold",
                                            fontSize: 16,
                                        }}
                                    >
                                        Canottieri Pallanza
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            router.dismissTo("/SettingsPage");
                                        }}
                                    >
                                        <Ionicons
                                            name="settings-outline"
                                            size={32}
                                            color="black"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </SafeAreaView>
                        ),
                        headerStyle: { backgroundColor: "#fff" },
                    }}
                >
                    <Stack.Screen
                        name="LoginPage"
                        options={{ headerShown: false }}
                    />
                </Stack>
            </PaperProvider>
        </SafeAreaProvider>
    );
}
