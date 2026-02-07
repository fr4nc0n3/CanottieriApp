/* Licensed under the GNU General Public License v3. See LICENSE file for details. */

import HeaderApp from "@/components/HeaderApp";
import AppThemePaper from "@/global/AppThemePaper";
import { Stack } from "expo-router";
import * as React from "react";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { UserInfoProvider } from "./UserContext/UserProvider";
import { COLORS } from "@/global/Colors";

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <PaperProvider theme={AppThemePaper}>
                <UserInfoProvider>
                    <Stack
                        screenOptions={{
                            headerBackVisible: false,
                            header: () => <HeaderApp />,
                            headerStyle: { backgroundColor: COLORS.white100 },
                        }}
                    >
                        <Stack.Screen
                            name="LoginPage"
                            options={{ headerShown: false }}
                        />
                    </Stack>
                </UserInfoProvider>
            </PaperProvider>
        </SafeAreaProvider>
    );
}
