import Calendar from "@/components/Calendar";
import {
    apiDeletePlanning,
    apiGetPlannings,
    apiUpdatePlanning,
} from "@/global/APICalls";
import { COLORS } from "@/global/Colors";
import { getJWT } from "@/global/jwtStorage";
import { ApiOutputGetPlanning } from "@/global/Types";
import { alert, confirm } from "@/global/UniversalPopups";
import { universalDateStringFormat } from "@/global/Utils";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
    IconButton,
    Portal,
    Text,
    Button,
    TextInput,
    Modal,
} from "react-native-paper";
import { createPlanning } from "./TrainingCalendarPage_/CRUD";
import { useLocalSearchParams, useRouter } from "expo-router";

type Planning = ApiOutputGetPlanning;

const TrainingCalendarPage = () => {
    const router = useRouter();
    const { userType } = useLocalSearchParams();

    const isAdmin = userType === "admin";

    const [plannings, setPlannings] = useState<Planning[]>([]);

    const [date, setDate] = useState<Date>(new Date()); //data del mese di riferimento
    const [planningCreation, setPlanningCreation] = useState<Date | null>(null);

    const isPlanningCreationOpen = () => planningCreation !== null;
    const openPlanningCreation = (date: Date) => setPlanningCreation(date);
    const closePlanningCreation = () => setPlanningCreation(null);

    const [planningUpdate, setPlanningUpdate] = useState<{
        id: number;
        description: string;
        date: Date;
    } | null>(null);

    const isPlanningUpdateOpen = () => planningUpdate !== null;
    const openPlanningUpdate = (id: number, description: string, date: Date) =>
        setPlanningUpdate({ id, description, date });
    const closePlanningUpdate = () => setPlanningUpdate(null);

    const fetchMonthPlannings = async (date: Date) => {
        const jwt = await getJWT();

        const plannings = await apiGetPlannings(
            { year: date.getFullYear(), month: date.getMonth() },
            jwt,
        );

        setPlannings(plannings);
    };

    useEffect(() => {
        fetchMonthPlannings(date);
    }, [date]);

    const addPlanning = async (date: Date, description: string) => {
        try {
            const newPlanning = await createPlanning({
                date: date,
                description: description,
            });

            setPlannings((cur) => {
                return [...cur, newPlanning];
            });
        } catch (error) {
            console.error("Error create planning:", error);
            alert("Errore", "Creazione fallita");
        }
    };

    //elimina planning
    const deletePlanning = async (id: number) => {
        console.log(`delete planning with id=${id}`);

        const jwt = await getJWT();

        try {
            await apiDeletePlanning({ id }, jwt);

            //modifica dello stato locale
            setPlannings((cur) => cur.filter((planning) => planning.id !== id));
        } catch (error) {
            console.error("Error deleting planning:", error);
            alert(
                "Non e' stato possibile effettuare l' eliminazione: " + error,
            );
        }
    };

    const updatePlanning = async (id: number, description: string) => {
        console.log(
            `update planning with id=${id}: description=${description}`,
        );

        const jwt = await getJWT();

        try {
            await apiUpdatePlanning({ id, description }, jwt);

            //modifica dello stato locale
            setPlannings((cur) =>
                cur.map((planning) =>
                    planning.id === id
                        ? { ...planning, description }
                        : planning,
                ),
            );
        } catch (error) {
            console.error("Error updating planning:", error);
            alert("Non e' stato possibile effettuare la modifica: " + error);
        }
    };

    const handlePressDate = (pressedDate: Date) => {
        //prendo planning in base alla data selezionata
        const planningPressed = plannings.find((planning) => {
            const pDate = new Date(planning.date);
            return pDate.getTime() === pressedDate.getTime();
        });

        //TODO: refactoring della gestione
        //TODO: es. se admin -> handlePressedAdmin(pressed)
        if (planningPressed && isAdmin) {
            openPlanningUpdate(
                planningPressed?.id,
                planningPressed?.description,
                new Date(planningPressed?.date ?? ""),
            );
        } else if (!planningPressed && isAdmin) {
            openPlanningCreation(pressedDate);
        } else if (planningPressed && !isAdmin) {
            router.push({
                pathname: "/TrainingDayPage",
                params: {
                    date: planningPressed.date,
                    description: planningPressed.description,
                },
            });
        }
    };

    return (
        <>
            <View
                style={{ flexDirection: "row", justifyContent: "space-around" }}
            >
                <IconButton
                    icon="arrow-left"
                    onPress={() =>
                        setDate(
                            (cur) =>
                                new Date(cur.getFullYear(), cur.getMonth() - 1),
                        )
                    }
                />
                <Text variant="titleLarge" style={style.header}>
                    Programma
                </Text>
                <IconButton
                    icon="arrow-right"
                    onPress={() =>
                        setDate(
                            (cur) =>
                                new Date(cur.getFullYear(), cur.getMonth() + 1),
                        )
                    }
                />
            </View>
            <ScrollView style={style.container}>
                <Calendar
                    year={date.getFullYear()}
                    month={date.getMonth()}
                    calendarDays={plannings.map((planning) => {
                        const date = new Date(planning.date);
                        return {
                            monthDate: date.getDate(),
                            color: COLORS.purple100,
                        };
                    })}
                    onPressDay={(monthDate, month, year) => {
                        const pressedDate = new Date(
                            Date.UTC(year, month, monthDate),
                        );
                        handlePressDate(pressedDate);
                    }}
                />
            </ScrollView>
            <CreatePlanningModal
                visible={isPlanningCreationOpen()}
                onDismiss={() => closePlanningCreation()}
                planningDate={planningCreation ?? new Date("")}
                onCreateClick={(description) => {
                    if (!planningCreation) {
                        alert("Errore data programmazione");
                        return;
                    }

                    addPlanning(planningCreation, description);
                }}
            />
            <ModifyPlanningModal
                visible={isPlanningUpdateOpen()}
                onDismiss={() => closePlanningUpdate()}
                planningDate={planningUpdate?.date ?? new Date("")}
                onUpdateClick={(description) => {
                    if (!planningUpdate) {
                        alert("Errore data programmazione");
                        return;
                    }

                    updatePlanning(planningUpdate.id, description);
                }}
                initialDescription={planningUpdate?.description ?? ""}
                onDeleteClick={() => {
                    planningUpdate && deletePlanning(planningUpdate.id);
                }}
            />
        </>
    );
};

interface CreatePlanningModalProps {
    visible: boolean;
    onDismiss: () => void;
    planningDate: Date;
    onCreateClick: (description: string) => void;
}

const CreatePlanningModal: React.FC<CreatePlanningModalProps> = ({
    visible,
    onDismiss,
    planningDate,
    onCreateClick,
}) => {
    const [description, setDescription] = useState<string>("");

    return (
        <Portal>
            <Modal
                visible={visible}
                dismissable={false}
                contentContainerStyle={style.modal}
            >
                <Text variant="titleLarge">
                    Programmazione del {planningDate.toLocaleDateString()}
                </Text>
                <Text variant="titleMedium" style={{ marginBottom: 5 }}>
                    Inserisci descrizione:
                </Text>

                <View style={style.row}>
                    <TextInput
                        style={style.input}
                        value={description}
                        onChangeText={setDescription}
                        mode="outlined"
                        placeholder="Scrivi qui..."
                        multiline
                        numberOfLines={15}
                    />
                </View>

                <View style={style.actions}>
                    <Button onPress={onDismiss}>Annulla</Button>
                    <Button
                        mode="contained"
                        onPress={() => {
                            onCreateClick(description);
                            setDescription("");
                            onDismiss();
                        }}
                    >
                        Crea
                    </Button>
                </View>
            </Modal>
        </Portal>
    );
};

interface ModifyPlanningModalProps {
    visible: boolean;
    onDismiss: () => void;
    planningDate: Date;
    initialDescription: string;
    onUpdateClick: (description: string) => void;
    onDeleteClick: () => void;
}

const ModifyPlanningModal: React.FC<ModifyPlanningModalProps> = ({
    visible,
    onDismiss,
    planningDate,
    initialDescription,
    onUpdateClick,
    onDeleteClick,
}) => {
    const [description, setDescription] = useState<string>("");

    useEffect(() => {
        setDescription(initialDescription);
    }, [initialDescription]);

    return (
        <Portal>
            <Modal
                visible={visible}
                dismissable={false}
                contentContainerStyle={style.modal}
            >
                <Text variant="titleLarge">
                    Programmazione del {planningDate.toLocaleDateString()}
                </Text>
                <Text variant="titleMedium" style={{ marginBottom: 5 }}>
                    Modifica descrizione:
                </Text>

                <View style={style.row}>
                    <TextInput
                        style={style.input}
                        value={description}
                        onChangeText={setDescription}
                        mode="outlined"
                        placeholder="Scrivi qui..."
                        multiline
                        numberOfLines={15}
                    />
                </View>

                <View style={style.actions}>
                    <Button onPress={onDismiss}>Annulla</Button>
                    <Button
                        mode="contained"
                        onPress={() => {
                            onUpdateClick(description);
                            onDismiss();
                        }}
                    >
                        Modifica
                    </Button>
                    <IconButton
                        icon="delete"
                        containerColor={COLORS.red100}
                        iconColor="white"
                        mode="contained"
                        onPress={() => {
                            confirm(
                                "Eliminazione",
                                "Sei sicuro di voler eliminare questa programmazione in data " +
                                    universalDateStringFormat(planningDate) +
                                    " ?",
                                () => {
                                    onDeleteClick();
                                    onDismiss();
                                },
                            );
                        }}
                    />
                </View>
            </Modal>
        </Portal>
    );
};

const style = StyleSheet.create({
    header: {
        padding: 8,
        textAlign: "center",
    },
    container: {
        padding: 5,
    },
    modal: {
        backgroundColor: COLORS.white100,
        padding: 20,
        margin: 20,
        borderRadius: 8,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
    },
    label: {
        width: 90,
        fontSize: 16,
    },
    input: {
        flex: 1,
    },
    actions: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
        gap: 10,
    },
});

export default TrainingCalendarPage;
