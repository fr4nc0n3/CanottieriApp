//Licensed under the GNU General Public License v3. See LICENSE file for details.

import { apiGetUserNewsReceived } from "@/global/APICalls";
import { API_GET_USER_NEWS_RECEIVED } from "@/global/Constants";
import { getJWT } from "@/global/jwtStorage";
import { emptyUserNewsRx, UserNewsRx } from "@/global/Types";
import { alert } from "@/global/UniversalPopups";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, Modal, Portal, Text } from "react-native-paper";

export default function NewsPage() {
    const [visible, setVisible] = useState(false);
    const [selectedNews, setSelectedNews] =
        useState<UserNewsRx>(emptyUserNewsRx);

    const [news, setNews] = useState<UserNewsRx[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchNews = async () => {
        setLoading(true);
        try {
            const news = await apiGetUserNewsReceived(1, await getJWT()); //TODO dinamicizzare id user
            setNews(news);
        } catch (error) {
            alert("Errore ricezione dati");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    if (loading) {
        return <Text>Caricamento ...</Text>;
    }

    const openModal = (news: UserNewsRx) => {
        setSelectedNews(news);
        setVisible(true);
    };

    const closeModal = () => setVisible(false);

    return (
        <>
            <ScrollView style={styles.container}>
                {news.map((n, idx) => (
                    <Card
                        key={idx}
                        style={styles.card}
                        onPress={() => openModal(n)}
                    >
                        <Card.Content>
                            <View style={styles.headerCard}>
                                <Text variant="titleLarge">{n.title}</Text>
                                <Text>{n.data_publish}</Text>
                            </View>
                            <Text numberOfLines={2}>{n.message}</Text>
                        </Card.Content>
                    </Card>
                ))}
            </ScrollView>

            <Portal>
                <Modal
                    visible={visible}
                    onDismiss={closeModal}
                    contentContainerStyle={styles.modal}
                >
                    {selectedNews && (
                        <>
                            <Text variant="titleLarge">
                                {selectedNews.title}
                            </Text>
                            <ScrollView style={{ maxHeight: "90%" }}>
                                <Text>{selectedNews.message}</Text>
                            </ScrollView>
                            <Button
                                onPress={closeModal}
                                style={{ marginTop: 16 }}
                            >
                                Chiudi
                            </Button>
                        </>
                    )}
                </Modal>
            </Portal>
        </>
    );
}

const styles = StyleSheet.create({
    container: { padding: 16 },
    card: { marginBottom: 16 },
    modal: {
        backgroundColor: "white",
        margin: 20,
        padding: 20,
        borderRadius: 12,
        maxHeight: "90%",
    },
    headerCard: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
});
