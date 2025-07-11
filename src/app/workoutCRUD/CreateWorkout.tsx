// NewWorkoutScreen.jsx

import { apiCreateWorkout } from "@/global/APICalls";
import { getJWT } from "@/global/jwtStorage";
import { alert } from "@/global/UniversalPopups";
import { getJWTIdentity } from "@/global/Utils";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Card, Text } from "react-native-paper";

// Il componente accetta una data tramite props
const CreateWorkout = () => {
    const router = useRouter();
    const [description, setDescription] = useState("");

    const { wkYear, wkMonth, wkDate } = useLocalSearchParams();
    const workoutDate = new Date(
        Date.UTC(
            parseInt(wkYear?.toString()),
            parseInt(wkMonth?.toString()),
            parseInt(wkDate?.toString())
        )
    );

    if (isNaN(workoutDate.getTime())) return null; //se la data non e' valida non mostra nulla

    const handleSave = async () => {
        const jwt = await getJWT();
        const identity = getJWTIdentity(jwt);

        try {
            await apiCreateWorkout(
                {
                    date: workoutDate.toISOString().split("T")[0],
                    description: description,
                    id_user: identity,
                },
                jwt
            );
        } catch (error) {
            alert("Errore", "creazione allenamento fallita: " + error);
            return;
        }

        alert("Creato", "Allenamento creato");
        router.back();
    };

    return (
        <View style={styles.container}>
            <Card>
                <Card.Content>
                    <Text variant="titleLarge">Crea nuovo allenamento</Text>

                    {/* Mostra la data dell'allenamento */}
                    <Text style={styles.dateText}>
                        Data: {workoutDate.toISOString().split("T")[0]}
                    </Text>

                    {/* Campo per il testo descrittivo dell'allenamento */}
                    <TextInput
                        label="Descrizione allenamento"
                        value={description}
                        onChangeText={setDescription}
                        mode="outlined"
                        multiline
                        numberOfLines={6}
                        style={styles.textInput}
                    />

                    {/* Pulsante per il salvataggio */}
                    <Button
                        mode="contained"
                        onPress={handleSave}
                        style={styles.saveButton}
                    >
                        Crea
                    </Button>
                </Card.Content>
            </Card>
        </View>
    );
};

// Stili per la pagina
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
        justifyContent: "center",
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
});

export default CreateWorkout;
