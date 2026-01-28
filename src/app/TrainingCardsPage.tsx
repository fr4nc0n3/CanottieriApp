import { universalDateStringFormat } from "@/global/Utils";
import React, { JSX, useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Platform } from "react-native";
import {
    Appbar,
    Avatar,
    Button,
    Card,
    Checkbox,
    Icon,
    IconButton,
    TouchableRipple,
} from "react-native-paper";
import * as DocumentPicker from "expo-document-picker";
import {
    apiCreateTrainingCard,
    apiDeleteImage,
    apiDeleteTrainingCards,
    apiGetTrainingCards,
    apiUriFile,
} from "@/global/APICalls";
import { getJWT } from "@/global/jwtStorage";
import { ApiOutputGetTrainingCard } from "@/global/Types";
import { useLocalSearchParams } from "expo-router";
import { alert, confirm } from "@/global/UniversalPopups";

const getFileTypeChar = (mime_type: string): string => {
    switch (mime_type) {
        case "application/pdf":
            return "📕";
        default:
            return "";
    }
};

export default function TrainingCardsPage(): JSX.Element {
    const { userType } = useLocalSearchParams();

    const isAdmin = userType === "admin";

    const [trainingCards, setTrainingCards] = useState<
        ApiOutputGetTrainingCard[]
    >([]);

    const syncTrainingCards = async () => {
        const jwt = await getJWT();
        const res = await apiGetTrainingCards(jwt);

        setTrainingCards(res);
    };

    useEffect(() => {
        syncTrainingCards();
    }, []);

    const renderNotification = ({
        item,
    }: {
        item: ApiOutputGetTrainingCard;
    }) => {
        const deleteCard = async () => {
            const jwt = await getJWT();
            try {
                await apiDeleteTrainingCards(item.id, jwt);
                alert("Operazione eseguita con successo");
                syncTrainingCards();
            } catch (error) {
                alert("Errore durante la eliminazione", String(error));
            }
        };

        const onDelete = () => {
            confirm(
                "Eliminazione",
                `Sei sicuro di voler eliminare: ${item.name_card} ?`,
                () => {
                    deleteCard();
                },
            );
        };

        return (
            <TouchableRipple onPress={() => {}}>
                <Card style={styles.card}>
                    <Card.Title
                        title={`${item.name_card}`}
                        subtitle={`${getFileTypeChar(item.mime_type)} ${item.mime_type.toUpperCase()} - Creato: ${universalDateStringFormat(new Date(item.created_at))}`}
                        right={() => (
                            <View style={{ flexDirection: "row" }}>
                                <IconButton
                                    icon={"download"}
                                    onPress={() => {
                                        //solo per web
                                        if (Platform.OS !== "web") {
                                            console.log(
                                                "Non e' possibile aprire uri file: ambiente non web",
                                            );
                                            return;
                                        }

                                        window.open(
                                            apiUriFile(item.file_name),
                                            "_blank",
                                        );
                                    }}
                                    size={32}
                                />
                                {isAdmin && (
                                    <IconButton
                                        icon={"delete"}
                                        iconColor="red"
                                        style={{ marginHorizontal: 20 }}
                                        size={32}
                                        onPress={() => {
                                            onDelete();
                                        }}
                                    />
                                )}
                            </View>
                        )}
                    />
                </Card>
            </TouchableRipple>
        );
    };

    const addTrainingCard = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "application/pdf",
            });

            if (result.canceled) {
                console.log("Selezione annullata");
                return null;
            }

            const asset = result.assets?.[0];

            if (!asset?.file) {
                return;
            }

            //solo web
            const name = prompt(
                "Inserisci un nome per la scheda (se non inserisci nulla l' operazione sara' cancellata):",
            );

            if (!name || name.trim() === "") {
                return;
            }

            const jwt = await getJWT();
            await apiCreateTrainingCard(name, "", asset.file, jwt);

            syncTrainingCards();
        } catch (err) {
            console.error("Errore durante l' aggiunta scheda:", err);
        }
    };

    return (
        <View style={styles.container}>
            {/* Appbar / Header */}
            <Appbar.Header>
                <Appbar.Content title="Schede" />
                <Appbar.Action icon="cards" accessibilityLabel="Schede" />
            </Appbar.Header>

            {isAdmin && (
                <IconButton
                    style={{
                        alignSelf: "center",
                        backgroundColor: "blue",
                        margin: 10,
                    }}
                    onPress={() => {
                        addTrainingCard();
                    }}
                    icon={"plus"}
                    iconColor="white"
                    size={32}
                />
            )}

            {/* Lista paginata */}
            <FlatList
                data={trainingCards}
                keyExtractor={(card) => card.id.toString()}
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
