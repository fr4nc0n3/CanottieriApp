import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { COLORS } from "@/global/Colors";

const HeaderApp = () => {
    const router = useRouter();

    return (
        <SafeAreaView>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-around",
                    minHeight: 50,
                    backgroundColor: COLORS.white100,
                }}
            >
                <TouchableOpacity
                    onPress={() => {
                        router.dismissTo("/MenuPage");
                    }}
                >
                    <Ionicons name="menu" size={32} color="black" />
                </TouchableOpacity>
                <Image
                    source={require("@/assets/images/icon_app_2.jpeg")}
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
                    MY TRAINING
                </Text>
                <TouchableOpacity
                    onPress={() => {
                        router.dismissTo("/SettingsPage");
                    }}
                >
                    <Ionicons name="settings-outline" size={32} color="black" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default HeaderApp;
