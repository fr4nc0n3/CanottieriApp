import {
    apiGetCountUserNews,
    apiGetUserNewsReceived,
    apiSetUserNewsRead,
} from "@/global/APICalls";
import { useQuery } from "@/global/hooks";
import { getJWT } from "@/global/jwtStorage";
import { UserNewsRx } from "@/global/Types";
import { alert, confirm } from "@/global/UniversalPopups";
import { getJWTIdentity, universalDateStringFormat } from "@/global/Utils";
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
// Component principale: NotificationsScreen
// ==========================

const ITEMS_PER_PAGE = 5;

export default function NotificationsScreen(): JSX.Element {
    const [rxOffset, setRxOffset] = useState<number>(0);
    const rxLimit = 5;

    const fetchNews = async () => {
        const jwt = await getJWT();
        const idUser = getJWTIdentity(jwt);
        return apiGetUserNewsReceived(idUser, rxOffset, rxLimit, jwt);
    };

    const fetchTotalCountNews = async () => {
        const jwt = await getJWT();
        const idUser = getJWTIdentity(jwt);
        return apiGetCountUserNews(idUser, false, jwt);
    };

    const {
        data: rxNotifications,
        error: rxError,
        isLoading: rxIsLoading,
    } = useQuery<UserNewsRx[]>(["userNewsRx", rxOffset], fetchNews);

    const { data: rxTotalCountRaw } = useQuery<number>(
        ["userNewsRxTotalCount"],
        fetchTotalCountNews
    );

    const rxTotalCount = rxTotalCountRaw ?? 0;

    const [notifications, setNotifications] = useState<UserNewsRx[]>([]);

    useEffect(() => {
        setNotifications(rxNotifications || []);
    }, [rxNotifications]);

    // Stato per la paginazione
    const [currentPage, setCurrentPage] = useState<number>(1);

    useEffect(() => {
        setRxOffset((currentPage - 1) * rxLimit);
    }, [currentPage]);

    const [selected, setSelected] = useState<UserNewsRx | null>(null);

    const totalPages = Math.max(1, Math.ceil(rxTotalCount / ITEMS_PER_PAGE));

    // ==========================
    // Funzioni di aggiornamento stato
    // ==========================

    // Segna tutte le notifiche come lette
    const markAllAsRead = async () => {
        const jwt = await getJWT();
        const identity = getJWTIdentity(jwt);

        try {
            await apiSetUserNewsRead(
                { id_user: Number(identity), all_readed: true },
                jwt
            );
        } catch (error) {
            alert(
                "Si e' verificato un errore durante l' operazione:",
                "Error: " + error
            );
            return;
        }

        setNotifications((prev) =>
            prev.map((n) => ({ ...n, is_read: Number(true) }))
        );
    };

    // Toggle read per singola notifica (usato dal modal)
    const setReadFor = //async (id: number, isRead: boolean) => {
        async (userNews: UserNewsRx, isRead: boolean) => {
            const id = userNews.id_user_news;

            console.log("notification id toggle read:", id);

            const jwt = await getJWT();
            const identity = getJWTIdentity(jwt);

            try {
                await apiSetUserNewsRead(
                    {
                        id_user: Number(identity),
                        id_news: userNews.id_news,
                        read: isRead,
                    },
                    jwt
                );
            } catch (error) {
                alert(
                    "Si e' verificato un errore durante l' operazione:",
                    "Error: " + error
                );
                return;
            }

            setNotifications((prev) =>
                prev.map((n) =>
                    n.id_user_news === id
                        ? { ...n, is_read: Number(isRead) }
                        : n
                )
            );

            console.log("current notification selected:", selected);
            // Aggiorna anche la selezione attiva se presente
            if (selected && selected.id_user_news === id) {
                setSelected((s) =>
                    s ? { ...s, is_read: Number(!s.is_read) } : s
                );
            }
        };

    const isDetailOpened = () => selected !== null;

    // Apertura dettaglio
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
    const renderNotification = ({ item }: { item: UserNewsRx }) => {
        const dateStr = universalDateStringFormat(new Date(item.data_publish));

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
                data={notifications}
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
                                    {universalDateStringFormat(
                                        new Date(selected.data_publish)
                                    )}
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
                                            setReadFor(
                                                selected,
                                                !selected.is_read
                                                //    selected.id_user_news,
                                                //   !selected.is_read
                                            )
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
