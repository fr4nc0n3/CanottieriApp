//Licensed under the GNU General Public License v3. See LICENSE file for details.

import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, Modal, Portal, Text } from "react-native-paper";

//TODO aggiungere una data pubblicazione per notifica

type NewsItem = {
    id: string;
    title: string;
    content: string;
    publishDate: string;
};

//TODO usare dati recepiti da database
const mockNews: NewsItem[] = [
    {
        id: "1",
        title: "Aggiornamento Servizio",
        content:
            "Il nostro servizio sarà in manutenzione il 10 giugno dalle 22:00 alle 02:00. Questo aggiornamento migliorerà la stabilità del sistema e introdurrà nuove funzionalità future. Grazie per la vostra pazienza.",
        publishDate: "30/10/2025",
    },
    {
        id: "2",
        title: "Nuova funzionalità",
        content:
            "Abbiamo aggiunto una nuova funzionalità per facilitare la gestione del tuo profilo. Puoi trovarla nella sezione Impostazioni. Questa modifica è stata richiesta da molti utenti e speriamo che semplifichi la tua esperienza.",
        publishDate: "25/10/2025",
    },
];

export default function NewsPage() {
    const [visible, setVisible] = useState(false);
    const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

    const openModal = (news: NewsItem) => {
        setSelectedNews(news);
        setVisible(true);
    };

    const closeModal = () => setVisible(false);

    return (
        <>
            <ScrollView style={styles.container}>
                {mockNews.map((news) => (
                    <Card
                        key={news.id}
                        style={styles.card}
                        onPress={() => openModal(news)}
                    >
                        <Card.Content>
                            <View style={styles.headerCard}>
                                <Text variant="titleLarge">{news.title}</Text>
                                <Text>{news.publishDate}</Text>
                            </View>
                            <Text numberOfLines={2}>{news.content}</Text>
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
                                <Text>{selectedNews.content}</Text>
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
