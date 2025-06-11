//Licensed under the GNU General Public License v3. See LICENSE file for details.

import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
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
                        //onChangeText={setNotification}
                        style={styles.input}
                        onPress={openModal}
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
                    onPress={() => {}}
                    style={styles.historyButton}
                >
                    Storico notifiche
                </Button>
            </View>
            {/*sentNotifications.length > 0 && (
                <Card style={{ marginTop: 32 }}>
                    <Card.Content>
                        <Text variant="titleLarge">Storico Notifiche</Text>
                        {sentNotifications.map((item) => (
                            <View key={item.id} style={{ marginTop: 12 }}>
                                <Text style={{ fontWeight: "bold" }}>
                                    {item.date}
                                </Text>
                                <Text>Categoria: {item.category}</Text>
                                <Text>{item.notification}</Text>
                                <Divider style={{ marginVertical: 8 }} />
                            </View>
                        ))}
                    </Card.Content>
                </Card>
            )*/}
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
                    {/**TODO deve essere un area input text che cambia notification */}
                    <Text>
                        Example Modal. Click outside this area to dismiss.
                    </Text>
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
        justifyContent: "flex-end",
        flex: 1,
    },
    historyButton: { width: "50%", alignSelf: "center" },
});
