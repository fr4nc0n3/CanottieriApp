//Licensed under the GNU General Public License v3. See LICENSE file for details.

import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
    Button,
    Card,
    Modal,
    Portal,
    RadioButton,
    Text,
    TextInput,
} from "react-native-paper";

//TODO Quando vado a scrivere il messaggio deve comparirmi un grosso modale
//TODO Lo storico delle notifiche inviate dovrebbe essere mostrato in una nuova pagina
//con magari in futuro dei filtri

//TODO fare file per i tipi
type NotificationItem = {
    id: string;
    notification: string;
    category: string;
    date: string;
};

export default function NotifyPage() {
    const router = useRouter();

    const [notification, setNotification] = useState("");
    const [category, setCategory] = useState("tutti");
    const [sentNotifications, setSentNotifications] = useState<
        NotificationItem[]
    >([]);
    const [visibleModal, setVisibleModal] = useState<boolean>(false);

    const openModal = () => {
        setVisibleModal(true);
    };

    const closeModal = () => {
        setVisibleModal(false);
    };

    const handleSend = () => {
        const newNotification: NotificationItem = {
            id: Date.now().toString(),
            notification,
            category,
            date: new Date().toLocaleString(),
        };

        setSentNotifications([newNotification, ...sentNotifications]);
        setNotification("");
    };

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Card.Content>
                    <Text variant="titleMedium">Notifica</Text>
                    <TextInput
                        mode="outlined"
                        multiline
                        numberOfLines={5}
                        placeholder="Scrivi la notifica qui..."
                        value={notification}
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
                        onValueChange={setCategory}
                        value={category}
                    >
                        <RadioButton.Item label="Tutti" value="tutti" />
                        <RadioButton.Item label="Atleti" value="clienti" />
                        <RadioButton.Item label="Genitori" value="genitori" />
                        <RadioButton.Item label="Staff" value="staff" />
                    </RadioButton.Group>
                </Card.Content>
            </Card>

            <Button
                mode="contained"
                onPress={handleSend}
                disabled={!notification.trim()}
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
                            value={notification}
                            onChangeText={(text) => {
                                setNotification(text);
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
