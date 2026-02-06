//Licensed under the GNU General Public License v3. See LICENSE file for details.

import { deleteJWT } from "@/global/jwtStorage";
import { confirm } from "@/global/UniversalPopups";
import { universalDateStringFormat } from "@/global/Utils";
import { router } from "expo-router";
import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { Avatar, Button, Card, Chip, Text } from "react-native-paper";
import { UserContext } from "./UserContext/UserContext";
import { COLORS } from "@/global/Colors";

//TODO: usare l' useContext per l' utente (esiste gia')

export default function ProfiloPage() {
    const userContext = useContext(UserContext);

    const logout = async () => {
        await deleteJWT();

        if (router.canDismiss()) {
            router.dismissAll();
            router.replace("/");
        } else {
            router.replace("/");
        }
    };

    const user = userContext?.userInfo;

    return (
        <View style={styles.container}>
            <Text variant="titleLarge" style={styles.header}>
                Profilo
            </Text>
            <Card style={styles.card}>
                <Card.Content style={styles.cardContent}>
                    <Avatar.Text size={100} label="N/A" />

                    <View style={styles.infoContainer}>
                        <Text variant="titleMedium">{`${
                            user?.name ?? "N/A"
                        }`}</Text>
                        <Text style={styles.label}>Data di nascita</Text>
                        <Text variant="bodyMedium">
                            {user?.birthday
                                ? universalDateStringFormat(user.birthday)
                                : "N/A"}
                        </Text>

                        <Text style={styles.label}>Tipo Account</Text>
                        <Chip icon="account" style={styles.chip}>
                            {user?.accountTypes.join(", ")}
                        </Chip>

                        <Text style={styles.label}>Categoria FIC</Text>
                        <Text variant="bodyMedium">
                            {user?.FICClassification.first
                                ? "primaria: " +
                                  user.FICClassification.first +
                                  ", "
                                : ""}
                            {user?.FICClassification.secondary
                                ? "secondaria: " +
                                  user.FICClassification.secondary +
                                  ", "
                                : ""}
                            {user?.FICClassification.absolute
                                ? "assoluta: " + user.FICClassification.absolute
                                : ""}
                        </Text>
                        <Text style={styles.label}>Categoria FICSF</Text>
                        <Text variant="bodyMedium">
                            {user?.FICSFClassification.first
                                ? "primaria: " +
                                  user.FICSFClassification.first +
                                  ", "
                                : ""}
                            {user?.FICSFClassification.absolute
                                ? "assoluta: " +
                                  user.FICSFClassification.absolute
                                : ""}
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
                            logout,
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
        color: COLORS.gray200,
    },
    chip: {
        backgroundColor: COLORS.lightblue100,
    },
    header: {
        marginBottom: 8,
    },
});
