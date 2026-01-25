import { universalDateStringFormat } from "@/global/Utils";
import React, { JSX } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import {
    Appbar,
    Avatar,
    Card,
    Checkbox,
    Icon,
    IconButton,
    TouchableRipple,
} from "react-native-paper";

type FileType = "pdf" | "file";

type TrainingCardItem = {
    name: string;
    url: string;
    type: FileType;
    lastUpdate: Date;
};

const getFileTypeChar = (type: FileType): string => {
    switch (type) {
        case "pdf":
            return "📕";
        case "file":
            return "🗎";
        default:
            return "";
    }
};

const MOCK: TrainingCardItem[] = [
    { name: "scheda1", url: "", type: "pdf", lastUpdate: new Date() },
    {
        name: "file2",
        url: "",
        type: "file",
        lastUpdate: new Date(),
    },
];

export default function NotificationsScreen(): JSX.Element {
    const renderNotification = ({ item }: { item: TrainingCardItem }) => {
        return (
            <TouchableRipple onPress={() => {}}>
                <Card style={styles.card}>
                    <Card.Title
                        title={`${item.name}`}
                        subtitle={`${getFileTypeChar(item.type)} ${item.type.toUpperCase()} - Aggiornato: ${universalDateStringFormat(item.lastUpdate)}`}
                        right={() => (
                            <IconButton
                                icon={"download"}
                                onPress={() => {}}
                                size={32}
                            />
                        )}
                    />
                </Card>
            </TouchableRipple>
        );
    };

    return (
        <View style={styles.container}>
            {/* Appbar / Header */}
            <Appbar.Header>
                <Appbar.Content title="Schede" />
                <Appbar.Action icon="cards" accessibilityLabel="Schede" />
            </Appbar.Header>

            {/* Lista paginata */}
            <FlatList
                data={MOCK}
                keyExtractor={(item) => item.name}
                renderItem={renderNotification}
                contentContainerStyle={styles.list}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    list: {
        paddingHorizontal: 12,
        paddingBottom: 20,
    },
    card: {
        marginVertical: 6,
        marginHorizontal: 10,
    },
});
