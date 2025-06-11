//Licensed under the GNU General Public License v3. See LICENSE file for details.

import React from "react";
import { StyleSheet, View } from "react-native";
import { Avatar, Card, Chip, Text } from "react-native-paper";

//TODO change with database info
const user = {
    photoUrl: "https://randomuser.me/api/portraits/men/99.jpg",
    nome: "Francesco",
    cognome: "Mariotti",
    dataNascita: "13/11/2001",
    categoria: "Amministratore", //spunti tipi di account: amministratore, allenatore, staff, atleta, genitore
    scadenzaIscrizione: "25/10/2025",
};

export default function ProfiloPage() {
    return (
        <View style={styles.container}>
            <Text variant="titleLarge" style={styles.header}>
                Profilo
            </Text>
            <Card style={styles.card}>
                <Card.Content style={styles.cardContent}>
                    <Avatar.Image size={100} source={{ uri: user.photoUrl }} />
                    <View style={styles.infoContainer}>
                        <Text variant="titleMedium">{`${user.nome} ${user.cognome}`}</Text>
                        <Text style={styles.label}>Data di nascita</Text>
                        <Text variant="bodyMedium">{user.dataNascita}</Text>

                        <Text style={styles.label}>Tipo Account</Text>
                        <Chip icon="account" style={styles.chip}>
                            {user.categoria}
                        </Chip>

                        <Text style={styles.label}>Scadenza iscrizione</Text>
                        <Text variant="bodyMedium">
                            {user.scadenzaIscrizione}
                        </Text>
                    </View>
                </Card.Content>
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    card: {
        //TODO commentando questo diventa un pelo rosa, invece dovrebbe essere comunque bianco
        //utilizzando il theme custom AppThemePaper.tsx
        //backgroundColor: "#fff",
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
