import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Card, Text } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { confirm, alert } from "@/global/UniversalPopups";
import { apiDeleteWorkout, apiUpdateWorkout } from "@/global/APICalls";
import { getJWT } from "@/global/jwtStorage";
import { getJWTIdentity } from "@/global/Utils";

const ModifyWorkout = () => {
    const router = useRouter();

    const { wkYear, wkMonth, wkDate, wkId, wkDescr } = useLocalSearchParams();
    const [desc, setDesc] = useState(wkDescr?.toString() ?? "");

    //controllo di cio' che e' stato ricevuto in searchparams
    const workoutDate = new Date(
        Date.UTC(
            parseInt(wkYear?.toString()),
            parseInt(wkMonth?.toString()),
            parseInt(wkDate?.toString())
        )
    );

    if (isNaN(workoutDate.getTime()) || wkId == null || wkDescr == null) {
        return null;
    }

    const handleApply = async () => {
        const jwt = await getJWT();
        const id = parseInt(wkId.toString());

        try {
            await apiUpdateWorkout({ id, description: desc }, jwt);
        } catch (error) {
            alert("Errore", "Errore durante la modifica");
            return;
        }

        alert("Modifica", "Modifica effettuata");
        router.back();
    };

    const handleDelete = () => {
        confirm(
            "Eliminazione allenamento",
            "Sei sicuro di voler eliminare l' allenamento in data " +
                workoutDate.toLocaleDateString(),
            async () => {
                const jwt = await getJWT();
                const id = parseInt(wkId.toString());

                try {
                    await apiDeleteWorkout({ id }, jwt);
                } catch (error) {
                    alert("Errore", "Errore durante la eliminazione");
                    return;
                }

                alert("Eliminato", "L' allenamento e' stato eliminato");
                router.back();
            }
        );
    };

    return (
        <View style={styles.container}>
            <Card>
                <Card.Content>
                    <Text variant="titleLarge">Modifica allenamento</Text>

                    <Text style={styles.dateText}>
                        Data:{" "}
                        {workoutDate
                            ? workoutDate.toLocaleDateString()
                            : "Invalid date"}
                    </Text>

                    <TextInput
                        label="Descrizione allenamento"
                        value={desc}
                        onChangeText={setDesc}
                        mode="outlined"
                        multiline
                        numberOfLines={6}
                        style={styles.textInput}
                    />

                    <Button
                        mode="contained"
                        onPress={handleApply}
                        style={styles.saveButton}
                    >
                        Applica modifiche
                    </Button>

                    <Button
                        mode="outlined"
                        onPress={handleDelete}
                        style={styles.deleteButton}
                        textColor="red"
                    >
                        Elimina allenamento
                    </Button>
                </Card.Content>
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: "center",
        backgroundColor: "#fff",
    },
    dateText: {
        marginBottom: 12,
        fontSize: 16,
    },
    textInput: {
        marginBottom: 16,
    },
    saveButton: {
        marginTop: 8,
    },
    deleteButton: {
        marginTop: 16,
        borderColor: "red",
    },
});

export default ModifyWorkout;
