//Licensed under the GNU General Public License v3. See LICENSE file for details.

import {
    apiDeleteNews,
    apiGetUserNewsReceived,
    apiGetUserNewsSended,
} from "@/global/APICalls";
import { API_DELETE_NEWS, API_GET_USER_NEWS_SENDED } from "@/global/Constants";
import { UserNewsTx } from "@/global/Types";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, View } from "react-native";
import {
    Button,
    Card,
    Divider,
    IconButton,
    Modal,
    Portal,
    Text,
} from "react-native-paper";

const MAX_PREVIEW_LEN = 120;

export default function HistoryNotification() {
    const router = useRouter();
    const [visibleModal, setVisibleModal] = useState<boolean>(false);
    const [modalText, setModalText] = useState<string>("");

    const [news, setNews] = useState<UserNewsTx[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [deletion, setDeletion] = useState<boolean>(false);

    const fetchNews = async () => {
        setLoading(true);

        try {
            const news = await apiGetUserNewsSended(1); //TODO da dinamicizzare userid
            setNews(news);
        } catch (error) {
            Alert.alert("Errore ricezione dati");
        } finally {
            setLoading(false);
        }
    };

    const deleteNews = async (id: number) => {
        try {
            await apiDeleteNews(id);
            Alert.alert("Eliminazione avvenuta con successo");
        } catch (error) {
            Alert.alert("Qualcosa e' andato storto durante l' eliminazione.");
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    useEffect(() => {
        if (deletion) {
            fetchNews();
            setDeletion(false);
        }
    }, [deletion]);

    if (loading) {
        return <Text>Caricamento ...</Text>;
    }

    const openModal = (notification: string) => {
        setModalText(notification);
        setVisibleModal(true);
    };

    const closeModal = () => {
        setVisibleModal(false);
    };

    const getPreviewNotification = (notification: string) => {
        if (notification.length > MAX_PREVIEW_LEN) {
            return notification.slice(0, MAX_PREVIEW_LEN) + "...";
        } else {
            return notification;
        }
    };

    return (
        <View style={styles.container}>
            {news.length > 0 ? (
                <Card style={{ marginTop: 32 }}>
                    <Card.Content>
                        <Text variant="titleLarge">Storico Notifiche</Text>
                        {news.map((item) => (
                            <Pressable
                                key={item.id}
                                onPress={() => {
                                    openModal(item.message);
                                }}
                            >
                                <View style={{ marginTop: 12 }}>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                            alignItems: "baseline",
                                        }}
                                    >
                                        <Text style={{ fontWeight: "bold" }}>
                                            {item.data_publish}
                                        </Text>
                                        <Text style={{ fontWeight: "bold" }}>
                                            Categoria: {item.target_name}
                                        </Text>
                                        <IconButton
                                            icon="delete"
                                            iconColor="red"
                                            size={24}
                                            onPress={() => {
                                                //richiesta conferma eliminazione della news
                                                Alert.alert(
                                                    "Conferma eliminazione",
                                                    "Sei sicuro di voler eliminare la richiesta con data: " +
                                                        item.data_publish +
                                                        "?",
                                                    [
                                                        {
                                                            text: "Annulla",
                                                            style: "cancel",
                                                        },
                                                        {
                                                            text: "OK",
                                                            onPress: () => {
                                                                deleteNews(
                                                                    item.id
                                                                );
                                                            },
                                                        },
                                                    ]
                                                );
                                            }}
                                        />
                                    </View>
                                    <Text>
                                        {getPreviewNotification(item.message)}
                                    </Text>
                                    <Divider style={{ marginVertical: 8 }} />
                                </View>
                            </Pressable>
                        ))}
                    </Card.Content>
                </Card>
            ) : (
                <Text>Nessuna notifica inviata</Text>
            )}
            <Portal>
                <Modal
                    visible={visibleModal}
                    onDismiss={closeModal}
                    contentContainerStyle={{
                        backgroundColor: "white",
                        margin: 20,
                        padding: 20,
                        borderRadius: 12,
                        maxHeight: "90%",
                    }}
                >
                    <ScrollView>
                        <Text>{modalText}</Text>
                    </ScrollView>
                </Modal>
            </Portal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 16, flex: 1 },
    card: { marginBottom: 16 },
});
