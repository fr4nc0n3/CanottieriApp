//Licensed under the GNU General Public License v3. See LICENSE file for details.

import { API_ENDPOINT } from "@/global/Constants";
import ExpoConstants from "expo-constants";
import React from "react";
import { Alert, Linking, Platform, ScrollView } from "react-native";
import { Divider, List, Text } from "react-native-paper";

//TODO magari aggiungere un email di contatto (ancora da creare) per feedback
//e bugs
export default function SettingsPage() {
    const appName = ExpoConstants.expoConfig?.name || "N/D";
    const appVersion = ExpoConstants.expoConfig?.version || "N/D";

    let buildNumber = null;
    if (Platform.OS === "android") {
        buildNumber = ExpoConstants.expoConfig?.android?.versionCode || "N/D";
    } else {
        buildNumber = ExpoConstants.expoConfig?.ios?.buildNumber || "N/D";
    }

    const author = ExpoConstants.expoConfig?.extra?.author || "N/D";
    const privacyPolicyUrl = ExpoConstants.expoConfig?.extra?.privacyPolicyURL;

    const openLink = async (url: string) => {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        }
    };

    return (
        <ScrollView
            style={{
                flex: 1,
                padding: 16,
            }}
        >
            <Text variant="titleLarge" style={{ marginBottom: 16 }}>
                Impostazioni
            </Text>

            <List.Section>
                <List.Subheader>Informazioni App</List.Subheader>
                <List.Item
                    title="Nome App"
                    description={appName}
                    left={() => <List.Icon icon="apps" />}
                />
                <List.Item
                    title="Versione"
                    description={appVersion}
                    left={() => <List.Icon icon="information" />}
                />
                <List.Item
                    title="Build"
                    description={buildNumber}
                    left={() => <List.Icon icon="wrench" />}
                />
                <List.Item
                    title="Autore"
                    description={author}
                    left={() => <List.Icon icon="account" />}
                />
            </List.Section>

            <Divider />

            <List.Section>
                <List.Subheader>Legali</List.Subheader>
                <List.Item
                    title="Privacy Policy"
                    description="Visualizza la nostra policy"
                    left={() => <List.Icon icon="shield-lock" />}
                    onPress={() => {
                        if (privacyPolicyUrl) {
                            openLink(privacyPolicyUrl);
                        } else {
                            Alert.alert("Privacy policy non disponibile");
                        }
                    }}
                />
            </List.Section>

            <Divider />

            <List.Section>
                <List.Subheader>Debug info</List.Subheader>
                <List.Item
                    title="API endpoint"
                    description={API_ENDPOINT}
                    left={() => <List.Icon icon="server" />}
                />
            </List.Section>
        </ScrollView>
    );
}
