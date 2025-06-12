//Licensed under the GNU General Public License v3. See LICENSE file for details.

import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Card, Divider, Modal, Portal, Text } from "react-native-paper";

//TODO fare file per i tipi
type NotificationItem = {
    id: string;
    notification: string;
    category: string;
    date: string;
};

const notificationsItems: NotificationItem[] = [
    {
        id: "1",
        notification:
            "What is Lorem Ipsum?Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        category: "tutti",
        date: "04-06-2025",
    },
    {
        id: "2",
        notification:
            "notifica 2, prova 2 " +
            "What is Lorem Ipsum?Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        category: "atleti",
        date: "03-06-2025",
    },
];

const MAX_PREVIEW_LEN = 120;

export default function NotifyPage() {
    const router = useRouter();
    const [visibleModal, setVisibleModal] = useState<boolean>(false);
    const [modalText, setModalText] = useState<string>("");

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
            {notificationsItems.length > 0 && (
                <Card style={{ marginTop: 32 }}>
                    <Card.Content>
                        <Text variant="titleLarge">Storico Notifiche</Text>
                        {notificationsItems.map((item) => (
                            <Pressable
                                key={item.id}
                                onPress={() => {
                                    openModal(item.notification);
                                }}
                            >
                                <View style={{ marginTop: 12 }}>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Text style={{ fontWeight: "bold" }}>
                                            {item.date}
                                        </Text>
                                        <Text style={{ fontWeight: "bold" }}>
                                            Categoria: {item.category}
                                        </Text>
                                    </View>
                                    <Text>
                                        {getPreviewNotification(
                                            item.notification
                                        )}
                                    </Text>
                                    <Divider style={{ marginVertical: 8 }} />
                                </View>
                            </Pressable>
                        ))}
                    </Card.Content>
                </Card>
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
