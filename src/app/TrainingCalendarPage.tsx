import Calendar from "@/components/Calendar";
import {
    apiDeletePlanning,
    apiGetPlannings,
    apiUpdatePlanning,
} from "@/global/APICalls";
import { COLORS } from "@/global/Colors";
import { getJWT } from "@/global/jwtStorage";
import { ApiOutputGetPlanning, PlanningType } from "@/global/Types";
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
    Checkbox,
    Menu,
} from "react-native-paper";
import { createPlanning } from "./TrainingCalendarPage_/CRUD";
import { useLocalSearchParams, useRouter } from "expo-router";
import SelectMonthBar from "@/components/SelectMonthBar";
import {
    getNothingColor,
    getRaceColor,
    getTrainingIntensityColor,
} from "./TrainingCalendarPage_/Utils";
import { LegendModal } from "./TrainingCalendarPage_/LegendModal";

type Planning = ApiOutputGetPlanning;

const getPlanningColor = (planning: Planning): React.CSSProperties["color"] => {
    if (planning.is_race) return getRaceColor();
    if (planning.is_training && planning.training_intensity_perc)
        return getTrainingIntensityColor(planning.training_intensity_perc);

    return getNothingColor();
};

const TrainingCalendarPage = () => {
    const router = useRouter();
    const { userType } = useLocalSearchParams();

    const isAdmin = userType === "admin";

    const [plannings, setPlannings] = useState<Planning[]>([]);

    const [date, setDate] = useState<Date>(new Date()); //data del mese di riferimento
    const [planningCreation, setPlanningCreation] = useState<Date | null>(null);
    const [isLegendVisible, setIsLegendVisible] = useState<boolean>(false);
    const showLegend = () => setIsLegendVisible(true);
    const hideLegend = () => setIsLegendVisible(false);

    const isPlanningCreationOpen = () => planningCreation !== null;
    const openPlanningCreation = (date: Date) => setPlanningCreation(date);
    const closePlanningCreation = () => setPlanningCreation(null);

    const [planningUpdate, setPlanningUpdate] = useState<{
        id: number;
        description: string;
        date: Date;
        type: PlanningType;
    } | null>(null);

    const isPlanningUpdateOpen = () => planningUpdate !== null;
    const openPlanningUpdate = (
        id: number,
        description: string,
        date: Date,
        type: PlanningType,
    ) => setPlanningUpdate({ id, description, date, type });
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

    const addPlanning = async (
        date: Date,
        description: string,
        type: PlanningType,
    ) => {
        try {
            const newPlanning = await createPlanning({
                date: date,
                description: description,
                type: type,
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

    const updatePlanning = async (
        id: number,
        description: string,
        type: PlanningType,
    ) => {
        console.log(
            `update planning with id=${id}: description=${description}`,
        );

        const jwt = await getJWT();

        try {
            await apiUpdatePlanning({ id, description, type }, jwt);

            //modifica dello stato locale
            setPlannings((cur) =>
                cur.map((planning) =>
                    planning.id === id
                        ? {
                              ...planning,
                              description,
                              is_race: type.isRace ? 1 : 0,
                              is_training: type.isTraining ? 1 : 0,
                              training_intensity_perc:
                                  type.trainingIntensityPerc ?? 0,
                          }
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
                {
                    isRace: planningPressed.is_race === 1,
                    isTraining: planningPressed.is_training === 1,
                    trainingIntensityPerc:
                        planningPressed.training_intensity_perc,
                },
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

    const nextMonth = () => {
        setDate((cur) => new Date(cur.getFullYear(), cur.getMonth() + 1));
    };

    const prevMonth = () => {
        setDate((cur) => new Date(cur.getFullYear(), cur.getMonth() - 1));
    };

    return (
        <>
            <SelectMonthBar
                middleTitle="Programma"
                onChangeMonth={(event) => {
                    if (event === "back") prevMonth();
                    else nextMonth();
                }}
            />
            <Button
                mode="contained"
                style={{ width: "35%", alignSelf: "center" }}
                onPress={() => showLegend()}
            >
                Legenda
            </Button>
            <ScrollView style={style.container}>
                <Calendar
                    year={date.getFullYear()}
                    month={date.getMonth()}
                    calendarDays={plannings.map((planning) => {
                        const date = new Date(planning.date);
                        return {
                            monthDate: date.getDate(),
                            color: getPlanningColor(planning),
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
                onCreateClick={(description, planningType) => {
                    if (!planningCreation) {
                        alert("Errore data programmazione");
                        return;
                    }

                    addPlanning(planningCreation, description, planningType);
                }}
            />
            <ModifyPlanningModal
                visible={isPlanningUpdateOpen()}
                onDismiss={() => closePlanningUpdate()}
                planningDate={planningUpdate?.date ?? new Date("")}
                onUpdateClick={(description, planningType) => {
                    if (!planningUpdate) {
                        alert("Errore data programmazione");
                        return;
                    }

                    updatePlanning(
                        planningUpdate.id,
                        description,
                        planningType,
                    );
                }}
                initialDescription={planningUpdate?.description ?? ""}
                initialPlanningType={
                    planningUpdate?.type ?? {
                        isRace: false,
                        isTraining: false,
                        trainingIntensityPerc: null,
                    }
                }
                onDeleteClick={() => {
                    planningUpdate && deletePlanning(planningUpdate.id);
                }}
            />
            <LegendModal
                visible={isLegendVisible}
                onDismiss={() => {
                    hideLegend();
                }}
            />
        </>
    );
};

interface CreatePlanningModalProps {
    visible: boolean;
    onDismiss: () => void;
    planningDate: Date;
    onCreateClick: (description: string, type: PlanningType) => void;
}

const CreatePlanningModal: React.FC<CreatePlanningModalProps> = ({
    visible,
    onDismiss,
    planningDate,
    onCreateClick,
}) => {
    const [description, setDescription] = useState<string>("");
    const [planningType, setPlanningType] = useState<PlanningType>({
        isRace: false,
        isTraining: true,
        trainingIntensityPerc: null,
    });

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
                <PlanningTypeHeader
                    planningType={planningType}
                    onChange={(newPlanningType: PlanningType) => {
                        setPlanningType(newPlanningType);
                    }}
                />
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
                            onCreateClick(description, planningType);
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

type PlanningTypeHeaderProps = {
    planningType: PlanningType;
    onChange: (newPlanningType: PlanningType) => void;
};

const PlanningTypeHeader = ({
    planningType,
    onChange,
}: PlanningTypeHeaderProps) => {
    const [menuVisible, setMenuVisible] = useState<boolean>(false);

    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
            }}
        >
            <Text>Allenamento: </Text>
            <Checkbox
                status={planningType.isTraining ? "checked" : "unchecked"}
                onPress={() =>
                    onChange({
                        ...planningType,
                        isRace: false,
                        isTraining: true,
                    })
                }
            />
            {planningType.isTraining && (
                <>
                    <Text>Intensita{"'"} allenamento: </Text>
                    <Menu
                        visible={menuVisible}
                        onDismiss={() => setMenuVisible(false)}
                        anchor={
                            <Button
                                mode="outlined"
                                onPress={() => setMenuVisible(true)}
                            >
                                {planningType.trainingIntensityPerc
                                    ? `${planningType.trainingIntensityPerc}%`
                                    : "Seleziona"}
                            </Button>
                        }
                    >
                        {[null, 25, 50, 75, 100].map((percentage) => (
                            <Menu.Item
                                key={percentage}
                                onPress={() => {
                                    setMenuVisible(false);
                                    onChange({
                                        ...planningType,
                                        trainingIntensityPerc: percentage,
                                    });
                                }}
                                title={percentage ? `${percentage}%` : ""}
                            />
                        ))}
                    </Menu>
                </>
            )}
            <Text style={{ marginLeft: 8 }}>Gara: </Text>
            <Checkbox
                status={planningType.isRace ? "checked" : "unchecked"}
                onPress={() =>
                    onChange({
                        ...planningType,
                        isRace: true,
                        isTraining: false,
                        trainingIntensityPerc: null,
                    })
                }
            />
        </View>
    );
};

interface ModifyPlanningModalProps {
    visible: boolean;
    onDismiss: () => void;
    planningDate: Date;
    initialDescription: string;
    initialPlanningType: PlanningType;
    onUpdateClick: (description: string, planningType: PlanningType) => void;
    onDeleteClick: () => void;
}

const ModifyPlanningModal = ({
    visible,
    onDismiss,
    planningDate,
    initialDescription,
    initialPlanningType,
    onUpdateClick,
    onDeleteClick,
}: ModifyPlanningModalProps) => {
    const [description, setDescription] = useState<string>("");
    const [planningType, setPlanningType] = useState<PlanningType>({});

    useEffect(() => {
        setDescription(initialDescription);
    }, [initialDescription]);

    useEffect(() => {
        setPlanningType(initialPlanningType);
    }, [initialPlanningType]);

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
                <PlanningTypeHeader
                    planningType={planningType}
                    onChange={(newPlanningType) => {
                        setPlanningType(newPlanningType);
                    }}
                />
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
                            onUpdateClick(description, planningType);
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
