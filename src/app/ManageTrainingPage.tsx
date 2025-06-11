//Licensed under the GNU General Public License v3. See LICENSE file for details.

import React, { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import {
    Button,
    Card,
    Dialog,
    IconButton,
    List,
    Portal,
    Text,
    TextInput,
} from "react-native-paper";

interface Workout {
    id: string;
    name: string;
}

const sampleWorkouts: Workout[] = [
    { id: "1", name: "Allenamento A" },
    { id: "2", name: "Allenamento B" },
];

export default function ManageTrainingPage() {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [workouts, setWorkouts] = useState<Workout[]>(sampleWorkouts);
    const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(
        null
    );
    const [visibleDialog, setVisibleDialog] = useState<boolean>(false);
    const [dialogType, setDialogType] = useState<
        "create" | "edit" | "copy" | "delete" | "load" | null
    >(null);

    const openDialog = (
        type: typeof dialogType,
        workout: Workout | null = null
    ) => {
        setDialogType(type);
        setSelectedWorkout(workout);
        setVisibleDialog(true);
    };

    const closeDialog = () => {
        setVisibleDialog(false);
        setSelectedWorkout(null);
        setDialogType(null);
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.header}>
                <Text variant="titleLarge">Gestione Allenamenti</Text>
                <IconButton icon="plus" onPress={() => openDialog("create")} />
            </View>
            <View style={{ padding: 16 }}>
                <TextInput
                    label="Cerca allenamento"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    left={<TextInput.Icon icon="magnify" />}
                />
            </View>

            <FlatList
                data={workouts.filter((w) =>
                    w.name.toLowerCase().includes(searchQuery.toLowerCase())
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 16 }}
                renderItem={({ item }) => (
                    <Card style={{ marginBottom: 12 }}>
                        <Card.Title title={item.name} />
                        <Card.Actions>
                            <IconButton
                                icon="pencil"
                                onPress={() => openDialog("edit", item)}
                            />
                            <IconButton
                                icon="content-copy"
                                onPress={() => openDialog("copy", item)}
                            />
                            <IconButton
                                icon="trash-can"
                                onPress={() => openDialog("delete", item)}
                            />
                            <IconButton
                                icon="calendar"
                                onPress={() => openDialog("load", item)}
                            />
                        </Card.Actions>
                    </Card>
                )}
            />

            <Portal>
                <Dialog visible={visibleDialog} onDismiss={closeDialog}>
                    <Dialog.Title>
                        {dialogType === "create"
                            ? "Crea Allenamento"
                            : dialogType === "edit"
                            ? "Modifica Allenamento"
                            : dialogType === "copy"
                            ? "Copia Allenamento"
                            : dialogType === "delete"
                            ? "Elimina Allenamento"
                            : dialogType === "load"
                            ? "Carica Allenamento"
                            : ""}
                    </Dialog.Title>
                    <Dialog.Content>
                        {dialogType === "load" ? (
                            <List.Section>
                                <List.Subheader>
                                    Seleziona un giorno
                                </List.Subheader>
                                <List.Item
                                    title="Lunedì"
                                    left={() => <List.Icon icon="calendar" />}
                                />
                                <List.Item
                                    title="Martedì"
                                    left={() => <List.Icon icon="calendar" />}
                                />
                                <List.Item
                                    title="Mercoledì"
                                    left={() => <List.Icon icon="calendar" />}
                                />
                            </List.Section>
                        ) : (
                            <TextInput
                                label="Nome allenamento"
                                defaultValue={selectedWorkout?.name || ""}
                            />
                        )}
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={closeDialog}>Annulla</Button>
                        <Button onPress={closeDialog}>Conferma</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
    },
});
