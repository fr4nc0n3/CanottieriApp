//Licensed under the GNU General Public License v3. See LICENSE file for details.

import { apiSendNewsToGroups } from "@/global/APICalls";
import { API_SEND_NEWS_TO_GROUPS } from "@/global/Constants";
import { emptyNewsToSend, NewsToSend } from "@/global/Types";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import {
    Button,
    Card,
    Modal,
    Portal,
    RadioButton,
    Text,
    TextInput,
} from "react-native-paper";

export default function NotifyPage() {
    const router = useRouter();

    const [visibleModal, setVisibleModal] = useState<boolean>(false);
    const [newsToSend, setNewsToSend] = useState<NewsToSend>({
        ...emptyNewsToSend,
        "id-user": 1,
    }); //TODO dinamicizzare idUser

    const openModal = () => {
        setVisibleModal(true);
    };

    const closeModal = () => {
        setVisibleModal(false);
    };

    const checkNews = () => {
        return (
            newsToSend.groups.length > 0 &&
            newsToSend.message.trim() !== "" &&
            newsToSend.title.trim() !== ""
        );
    };

    const handleSend = async () => {
        try {
            await apiSendNewsToGroups(newsToSend);
            Alert.alert("Notifica inviata con successo");
        } catch (error) {
            Alert.alert("Errore durante l' invio");
        }

        setNewsToSend(emptyNewsToSend);
    };

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Card.Content>
                    <Text variant="titleMedium">Titolo</Text>
                    <TextInput
                        mode="outlined"
                        multiline
                        numberOfLines={2}
                        placeholder="Scrivi il titolo qui..."
                        value={newsToSend.title}
                        style={styles.input}
                        onChangeText={(t) => {
                            setNewsToSend((cur) => {
                                return { ...cur, title: t };
                            });
                        }}
                    />
                </Card.Content>
                <Card.Content>
                    <Text variant="titleMedium">Notifica</Text>
                    <TextInput
                        mode="outlined"
                        multiline
                        numberOfLines={5}
                        placeholder="Scrivi la notifica qui..."
                        value={newsToSend.message}
                        style={styles.input}
                        onPressIn={openModal}
                        onChangeText={(_) => {}}
                    />
                </Card.Content>
            </Card>

            <Card style={styles.card}>
                <Card.Content>
                    <Text variant="titleMedium">Categoria destinatari</Text>
                    <RadioButton.Group
                        onValueChange={(v) => {
                            setNewsToSend((cur) => {
                                return { ...cur, groups: [v] };
                            });
                        }}
                        value={newsToSend.groups[0]}
                    >
                        <RadioButton.Item label="Tutti" value="all" />
                        <RadioButton.Item label="Atleti" value="atleta" />
                        <RadioButton.Item label="Genitori" value="parent" />
                        <RadioButton.Item label="Staff" value="staff" />
                    </RadioButton.Group>
                </Card.Content>
            </Card>

            <Button
                mode="contained"
                onPress={handleSend}
                disabled={!checkNews()}
            >
                Invia Notifica
            </Button>

            <View style={styles.historyButtonContainer}>
                <Button
                    mode="contained"
                    onPress={() => {
                        router.push("/HistoryNotifications");
                    }}
                    style={styles.historyButton}
                >
                    Storico notifiche
                </Button>
            </View>
            <Portal>
                <Modal
                    visible={visibleModal}
                    onDismiss={closeModal}
                    dismissable={false}
                    contentContainerStyle={{
                        backgroundColor: "white",
                        margin: 20,
                        padding: 20,
                        borderRadius: 12,
                        maxHeight: "90%",
                    }}
                >
                    <ScrollView style={{ padding: 16 }}>
                        <TextInput
                            label={"Notifica"}
                            value={newsToSend.message}
                            onChangeText={(text) => {
                                setNewsToSend((cur) => {
                                    return { ...cur, message: text };
                                });
                            }}
                            multiline
                            numberOfLines={25}
                            mode="outlined"
                            placeholder="Inserisci qui il testo ..."
                            autoFocus
                        />
                    </ScrollView>
                    <Button onPress={closeModal}>OK</Button>
                </Modal>
            </Portal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 16, flex: 1 },
    card: { marginBottom: 16 },
    input: { marginTop: 8 },
    historyButtonContainer: {
        justifyContent: "center",
        flex: 1,
    },
    historyButton: { width: "50%", alignSelf: "center" },
});
