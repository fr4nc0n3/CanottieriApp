//Licensed under the GNU General Public License v3. See LICENSE file for details.

import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { IconButton, Text } from "react-native-paper";

export default function TrainingDayPage() {
    const router = useRouter();
    const { date: d, description: descr } = useLocalSearchParams();
    const date = d?.toString();
    const description = descr?.toString();

    return (
        <>
            <View style={styles.header}>
                <IconButton
                    icon="arrow-left"
                    size={24}
                    onPress={() => router.back()}
                />
                <Text variant="titleLarge">
                    Allenamento giornaliero del {date ?? "<N/A>"}
                </Text>
            </View>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <Text variant="bodyLarge" style={{ lineHeight: 24 }}>
                    {description ?? ""}
                </Text>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
});
