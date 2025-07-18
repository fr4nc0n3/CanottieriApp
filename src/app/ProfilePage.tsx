//Licensed under the GNU General Public License v3. See LICENSE file for details.

import { apiGetUserInfo } from "@/global/APICalls";
import { API_GET_USER_INFO } from "@/global/Constants";
import { deleteJWT, getJWT } from "@/global/jwtStorage";
import { emptyUser, User } from "@/global/Types";
import { confirm } from "@/global/UniversalPopups";
import { getJWTIdentity } from "@/global/Utils";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Avatar, Button, Card, Chip, Text } from "react-native-paper";

export default function ProfiloPage() {
    const [user, setUser] = useState<User>(emptyUser);
    const [loading, setLoading] = useState<boolean>(true);
    const [isImageUrl, setIsImageUrl] = useState<boolean>(false);

    const fetchUser = async () => {
        setLoading(true);
        try {
            const jwt = await getJWT();
            const userId = getJWTIdentity(jwt);
            const user = await apiGetUserInfo(userId, jwt);
            setUser(user);

            /*const resImg = await fetch(user.profile_img_url, {
                method: "HEAD",
            });

            setIsImageUrl(resImg.ok);*/
        } catch (error) {
            alert("Errore ricezione dati");
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        await deleteJWT();

        if (router.canDismiss()) {
            router.dismissAll();
            router.replace("/");
        } else {
            router.replace("/");
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    if (loading) {
        return <Text>Caricamento ...</Text>;
    }

    return (
        <View style={styles.container}>
            <Text variant="titleLarge" style={styles.header}>
                Profilo
            </Text>
            <Card style={styles.card}>
                <Card.Content style={styles.cardContent}>
                    {isImageUrl ? (
                        <Avatar.Image
                            size={100}
                            source={{ uri: user.profile_img_url }}
                        />
                    ) : (
                        <Avatar.Text size={100} label="N/A" />
                    )}
                    <View style={styles.infoContainer}>
                        <Text variant="titleMedium">{`${user.name}`}</Text>
                        <Text style={styles.label}>Data di nascita</Text>
                        <Text variant="bodyMedium">{user.birthday}</Text>

                        <Text style={styles.label}>Tipo Account</Text>
                        <Chip icon="account" style={styles.chip}>
                            {/*TODO*/}TODO
                        </Chip>

                        <Text style={styles.label}>Scadenza iscrizione</Text>
                        <Text variant="bodyMedium">
                            {user.expiration_sub_date}
                        </Text>
                    </View>
                </Card.Content>
            </Card>
            <View
                style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Button
                    mode="contained"
                    onPress={() => {
                        confirm(
                            "LOGOUT",
                            "Sei sicuro di voler eseguire il logout?",
                            logout
                        );
                    }}
                >
                    LOGOUT
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    card: {
        padding: 16,
    },
    cardContent: {
        alignItems: "center",
        flexDirection: "row",
        gap: 16,
    },
    infoContainer: {
        flex: 1,
        justifyContent: "space-around",
    },
    label: {
        marginTop: 8,
        fontWeight: "bold",
        color: "#555",
    },
    chip: {
        backgroundColor: "lightblue",
    },
    header: {
        marginBottom: 8,
    },
});
