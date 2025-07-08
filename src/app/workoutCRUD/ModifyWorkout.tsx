import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Card, Text } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { confirm, alert } from "@/global/UniversalPopups";

const ModifyWorkout = () => {
    const router = useRouter();

    const [desc, setDesc] = useState("");

    const {
        wkYear,
        wkMonth,
        wkDate,
        workout /*passato dal chiamante per poi fare la modifica sul db */,
    } = useLocalSearchParams();

    //controllo di cio' che e' stato ricevuto in searchparams
    const workoutDate = new Date(
        Date.UTC(
            parseInt(wkYear?.toString()),
            parseInt(wkMonth?.toString()),
            parseInt(wkDate?.toString())
        )
    );

    if (isNaN(workoutDate.getTime()) || !workout) {
        return null;
    }

    const handleApply = () => {
        // Logica di salvataggio (simulata)
        console.log("Updated workout:", { workoutDate, desc });
        alert("Saved", "Workout updated successfully.");
        router.back(); // Torna indietro
    };

    const handleDelete = () => {
        confirm(
            "Eliminazione allenamento",
            "Sei sicuro di voler eliminare l' allenamento in data " +
                workoutDate.toLocaleDateString(),
            () => {
                console.log("Workout deleted:", { workoutDate });
                alert("Deleted", "Workout has been deleted.");
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
