import { apiGetUserNewsReceived } from "@/global/APICalls";
import { useQuery } from "@/global/hooks";
import { getJWT } from "@/global/jwtStorage";
import { UserNewsRx } from "@/global/Types";
import { alert, confirm } from "@/global/UniversalPopups";
import { getJWTIdentity } from "@/global/Utils";
import { useRouter } from "expo-router";
import React, { JSX, useCallback, useEffect, useMemo, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import {
    Appbar,
    Card,
    Text,
    Button,
    Checkbox,
    Portal,
    Dialog,
    Divider,
    TouchableRipple,
} from "react-native-paper";

// ==========================
// Dati di esempio (in cima al file)
// ==========================

/*export type NotificationItem = {
    id: string;
    title: string;
    date: string; // ISO
    senderName: string;
    message: string;
    is_read: boolean;
};*/

// Array di esempio: più recente in alto (ma l'applicazione riordina comunque)
/*const SAMPLE_NOTIFICATIONS: NotificationItem[] = [
    {
        id: "n1",
        title: "Aggiornamento importante",
        date: "2025-10-20T18:30:00Z",
        senderName: "Sistema",
        message:
            "Abbiamo aggiornato i termini di servizio. Leggi i dettagli nella sezione account.",
        is_read: false,
    },
    {
        id: "n2",
        title: "Nuova funzionalità disponibile",
        date: "2025-10-18T09:10:00Z",
        senderName: "Team Prodotto",
        message:
            "Ora puoi salvare i tuoi preferiti per accedervi più rapidamente.",
        is_read: false,
    },
    {
        id: "n3",
        title: "Promemoria evento",
        date: "2025-10-15T12:00:00Z",
        senderName: "Calendario",
        message: "Non dimenticare l'incontro fissato per domani alle 09:00.",
        is_read: true,
    },
    {
        id: "n4",
        title: "Feedback richiesto",
        date: "2025-10-10T08:00:00Z",
        senderName: "Supporto",
        message: "Raccontaci la tua esperienza con l'ultima versione.",
        is_read: true,
    },
    {
        id: "n5",
        title: "Sicurezza account",
        date: "2025-09-30T20:45:00Z",
        senderName: "Sicurezza",
        message:
            "È stata rilevata una nuova attività di accesso. Se non sei stato tu, cambia la password.",
        is_read: false,
    },
    {
        id: "n6",
        title: "Offerta speciale",
        date: "2025-09-25T10:00:00Z",
        senderName: "Marketing",
        message: "Solo per oggi: sconto del 20% su tutti i piani.",
        is_read: true,
    },
    {
        id: "n7",
        title: "Manutenzione pianificata",
        date: "2025-09-20T22:00:00Z",
        senderName: "Infrastruttura",
        message:
            "I servizi saranno temporaneamente non disponibili il 1 ottobre.",
        is_read: true,
    },
    {
        id: "n8",
        title: "Nuovo messaggio",
        date: "2025-09-15T14:00:00Z",
        senderName: "Mario Rossi",
        message: "Ciao! Possiamo sentirci per una breve chiamata domani?",
        is_read: false,
    },
    {
        id: "n9",
        title: "Aggiornamento app",
        date: "2025-09-10T11:30:00Z",
        senderName: "Team Mobile",
        message: "La versione 3.2 è disponibile: migliorie e bugfix.",
        is_read: true,
    },
    {
        id: "n10",
        title: "Conferma iscrizione",
        date: "2025-08-01T07:20:00Z",
        senderName: "Servizio Clienti",
        message: "La tua iscrizione è stata attivata correttamente.",
        is_read: true,
    },
    {
        id: "n11",
        title: "Promemoria pagamento",
        date: "2025-07-25T16:00:00Z",
        senderName: "Fatturazione",
        message: "La fattura è in scadenza il 30 luglio.",
        is_read: false,
    },
    {
        id: "n12",
        title: "Benvenuto",
        date: "2025-06-10T09:00:00Z",
        senderName: "Sistema",
        message:
            "Grazie per esserti registrato! Inizia personalizzando il tuo profilo.",
        is_read: true,
    },
];*/

// ==========================
// Component principale: NotificationsScreen
// ==========================

const ITEMS_PER_PAGE = 5;

export default function NotificationsScreen(): JSX.Element {
    const rxOffset = 0;
    const rxLimit = 10;

    const fetchNews = useCallback(async () => {
        const jwt = await getJWT();
        const idUser = getJWTIdentity(jwt);
        return apiGetUserNewsReceived(idUser, rxOffset, rxLimit, jwt);
    }, [rxOffset, rxLimit]);

    const {
        data: rxNotifications,
        error: rxError,
        isLoading: rxIsLoading,
    } = useQuery<UserNewsRx[]>("userNewsRx", fetchNews);

    // Stato delle notifiche (copiamo i sample)
    const [notifications, setNotifications] = useState<UserNewsRx[]>([]);

    useEffect(() => {
        setNotifications(rxNotifications || []);
    }, [rxNotifications]);
    /*    () => {
            // Ordina per data discendente (più recente prima)
            return [...SAMPLE_NOTIFICATIONS].sort(
                (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
            );
        }*/

    // Stato per la paginazione
    const [currentPage, setCurrentPage] = useState<number>(1);

    // Stato per il dettaglio (modal)
    //const [selected, setSelected] = useState<NotificationItem | null>(null);
    const [selected, setSelected] = useState<UserNewsRx | null>(null);

    //TODO: Calcola il numero massimo di pagine (da ricevere via backend)
    const totalPages = Math.max(
        1,
        Math.ceil(notifications.length / ITEMS_PER_PAGE)
    );

    //TODO: da ricevere via backend
    // Lista delle notifiche visibili nella pagina corrente
    const pageNotifications = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return notifications.slice(start, start + ITEMS_PER_PAGE);
    }, [notifications, currentPage]);

    // ==========================
    // Funzioni di aggiornamento stato
    // ==========================

    //TODO: da inviare via backend
    // Segna tutte le notifiche come lette
    const markAllAsRead = () => {
        setNotifications((prev) =>
            prev.map((n) => ({ ...n, is_read: Number(true) }))
        );
    };

    //TODO: da inviare via backend
    // Toggle read per singola notifica (usato dal modal)
    const toggleReadFor = (id: number) => {
        console.log("notification id toggle read:", id);

        setNotifications((prev) =>
            prev.map((n) =>
                n.id_user_news === id
                    ? { ...n, is_read: Number(!n.is_read) }
                    : n
            )
        );

        console.log("current notification selected:", selected);
        // Aggiorna anche la selezione attiva se presente
        if (selected && selected.id_user_news === id) {
            setSelected((s) => (s ? { ...s, is_read: Number(!s.is_read) } : s));
        }
    };

    const isDetailOpened = () => selected !== null;

    // Apertura dettaglio
    //const openDetail = (item: NotificationItem) => {
    const openDetail = (item: UserNewsRx) => {
        // Assicuriamoci di agganciare la versione più aggiornata della notifica
        const fresh = notifications.find(
            (n) => n.id_user_news === item.id_user_news
        );

        if (!fresh) {
            alert("Errore", "notifica non trovata");
            return;
        }

        setSelected(fresh);
    };

    // Chiusura dettaglio
    const closeDetail = () => {
        setSelected(null);
    };

    // ==========================
    // Render di singolo elemento lista
    // ==========================
    //const renderNotification = ({ item }: { item: NotificationItem }) => {
    const renderNotification = ({ item }: { item: UserNewsRx }) => {
        const dateStr = new Date(item.data_publish).toLocaleString("it-IT", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });

        return (
            <TouchableRipple onPress={() => openDetail(item)}>
                <Card style={styles.card}>
                    <Card.Title
                        title={item.title}
                        subtitle={`${item.sender_name} • ${dateStr}`}
                        right={() => (
                            // Spunta non modificabile nella lista
                            <View style={{ justifyContent: "center" }}>
                                <Checkbox
                                    status={
                                        item.is_read ? "checked" : "unchecked"
                                    }
                                    // Disabilitata: non modificabile qui
                                    disabled
                                />
                            </View>
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
                <Appbar.Content title="Notifiche" />
                <Appbar.Action icon="bell" accessibilityLabel="Notifiche" />
            </Appbar.Header>

            {/* Pulsante segna tutte come lette */}
            <View style={styles.actionsRow}>
                <Button
                    mode="contained"
                    onPress={() =>
                        confirm(
                            "Segna tutte come lette",
                            "Sei sicuro di voler segnare tutte le notifiche come lette ?",
                            () => markAllAsRead()
                        )
                    }
                >
                    Segna tutte come lette
                </Button>
                <Text style={styles.pageInfo}>
                    Pagina {currentPage} / {totalPages}
                </Text>
            </View>

            <Divider />

            {/* Lista paginata */}
            <FlatList
                data={pageNotifications}
                keyExtractor={(item) => item.id_user_news.toString()}
                renderItem={renderNotification}
                contentContainerStyle={styles.list}
            />

            {/* Controlli di paginazione */}
            <View style={styles.paginationRow}>
                <Button
                    disabled={currentPage <= 1}
                    onPress={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                    Precedente
                </Button>
                <Button
                    disabled={currentPage >= totalPages}
                    onPress={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                >
                    Successiva
                </Button>
            </View>

            {/* Dialog dettaglio notifica (modal) */}
            <Portal>
                <Dialog
                    visible={isDetailOpened()}
                    onDismiss={closeDetail}
                    style={styles.detailDialog}
                >
                    <Dialog.Content>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Text style={{ fontSize: 24 }}>
                                {selected?.title}
                            </Text>
                            {/* Sotto titolo con mittente e data */}
                            {selected && (
                                <Text style={styles.detailSub}>
                                    {selected.sender_name} •{" "}
                                    {new Date(
                                        selected.data_publish
                                    ).toLocaleString("it-IT")}
                                </Text>
                            )}
                        </View>
                        <Divider style={{ marginVertical: 2 }} />
                        <Text>{selected?.message}</Text>
                    </Dialog.Content>

                    <Dialog.Actions>
                        {/* Spunta modificabile per la notifica corrente */}
                        {selected && (
                            <View style={styles.detailFooter}>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                    }}
                                >
                                    <Checkbox
                                        status={
                                            selected.is_read
                                                ? "checked"
                                                : "unchecked"
                                        }
                                        onPress={() =>
                                            toggleReadFor(selected.id_user_news)
                                        }
                                    />
                                    <Text>Letta</Text>
                                </View>

                                <Button onPress={closeDetail}>Chiudi</Button>
                            </View>
                        )}
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    banner: {
        margin: 12,
        padding: 10,
        borderRadius: 6,
        elevation: 2,
    },
    actionsRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    pageInfo: {
        marginLeft: 12,
        alignSelf: "center",
    },
    list: {
        paddingHorizontal: 12,
        paddingBottom: 20,
    },
    card: {
        marginVertical: 6,
    },
    paginationRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    detailDialog: {
        // minimale styling
    },
    detailSub: {
        fontSize: 15,
        color: "#666",
    },
    detailFooter: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
});
