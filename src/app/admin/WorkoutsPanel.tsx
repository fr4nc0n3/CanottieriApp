import Calendar from "@/components/Calendar";
import EditTextModal from "@/components/EditTextModal";
import FullImageGrid, { ImageItemGrid } from "@/components/FullImageGrid";
import FullImageModal from "@/components/FullImageModal";
import {
    apiCreateWorkoutComment,
    apiGetUsers,
    apiGetWorkout,
    apiGetWorkoutImages,
    apiUriImage,
} from "@/global/APICalls";
import { getJWT } from "@/global/jwtStorage";
import { User, Workout, WorkoutComment } from "@/global/Types";
import { alert, confirm } from "@/global/UniversalPopups";
import { getJWTIdentity } from "@/global/Utils";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
    IconButton,
    Text,
    Menu,
    Button,
    Portal,
    Modal,
    Divider,
} from "react-native-paper";

const WorkoutsPanel = () => {
    const router = useRouter();

    const [showMenu, setShowMenu] = useState<boolean>(false);
    const openMenu = () => setShowMenu(true);
    const closeMenu = () => setShowMenu(false);

    const [visibleModal, setVisibleModal] = useState<boolean>(false);
    const hideModal = () => setVisibleModal(false);
    const showModal = () => setVisibleModal(true);

    const [openedWorkout, setOpenedWorkout] = useState<Workout | null>(null);
    const [openedWorkoutComment, setOpenedWorkoutComment] =
        useState<WorkoutComment | null>(null);

    const isOpenedWkComment = () => openedWorkoutComment !== null;
    const closeOpenedWkComment = () => setOpenedWorkoutComment(null);
    const openWorkoutComment = (wkComment: WorkoutComment) =>
        setOpenedWorkoutComment(wkComment);

    const [openedImage, setOpenedImage] = useState<string | null>(null);

    const isImageModalOpen = () => openedImage !== null;
    const closeImageModal = () => setOpenedImage(null);
    const openImageModal = (uri: string) => setOpenedImage(uri);

    const [date, setDate] = useState<Date>(new Date());
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [workoutImages, setWorkoutImages] = useState<ImageItemGrid[]>([]);

    //TODO in teoria dovrebbero essere
    //solo gli utenti di tipo atleta
    const [athletes, setAthletes] = useState<User[]>([]);

    const [selectedAthlete, setSelectedAthlete] = useState<User | null>(null);

    useEffect(() => {
        fetchAthletes();
    }, []);

    //ricezione immagini workout aperto nel modale
    useEffect(() => {
        if (!openedWorkout) return;

        fetchWorkoutImages(openedWorkout.id);
    }, [openedWorkout]);

    //fetch allenamenti al cambiare della data
    //e dell' atleta selezionato
    useEffect(() => {
        if (!selectedAthlete) return;

        fetchWorkouts(selectedAthlete);
    }, [date, selectedAthlete]);

    //log state
    useEffect(() => {
        console.log("workouts:", workouts);
    }, [workouts]);

    const fetchAthletes = () => {
        getJWT()
            .then((jwt) => {
                return apiGetUsers(jwt);
            })
            .then((users) => {
                setAthletes(users);
            })
            .catch((error) => {
                alert("Errore", "errore durante la ricezione atleti: " + error);
            });
    };

    const fetchWorkouts = (athlete: User) => {
        //TODO usare async await
        getJWT()
            .then((jwt) => {
                return apiGetWorkout(
                    {
                        id_user: athlete.id,
                        year: date.getFullYear(),
                        month: date.getMonth(),
                    },
                    jwt
                );
            })
            .then((output) => {
                setWorkouts(output);
            })
            .catch((error) => {
                alert(
                    "Errore",
                    `errore durante la ricezione allenamenti per l' atleta ${athlete.name}: ` +
                        error
                );
            });
    };

    const fetchWorkoutImages = async (workoutId: number) => {
        const jwt = await getJWT();
        const images = await apiGetWorkoutImages(workoutId, jwt);

        setWorkoutImages(
            images.map((img) => {
                return {
                    id: img.name,
                    uri: apiUriImage(img.name),
                };
            })
        );
    };

    //la date in realta' e' gia' contenuta in workout
    const openWorkout = (date: Date, workout: Workout) => {
        //TODO: qui si dovrebbe fare il fetch dei commenti allenamento
        setOpenedWorkout(workout);
        showModal();
    };

    return (
        <>
            <Menu
                visible={showMenu}
                onDismiss={closeMenu}
                anchor={
                    <Button
                        style={{ marginVertical: 5, marginHorizontal: 15 }}
                        mode="outlined"
                        onPress={openMenu}
                    >
                        Cambia atleta
                    </Button>
                }
            >
                {athletes.map((athlete, idx) => (
                    <Menu.Item
                        key={idx}
                        onPress={() => {
                            setSelectedAthlete(athlete);
                            closeMenu();
                        }}
                        title={`${idx + 1}. ${athlete.name}`}
                    />
                ))}
            </Menu>
            <View
                style={{ flexDirection: "row", justifyContent: "space-around" }}
            >
                <IconButton
                    icon="arrow-left"
                    onPress={() =>
                        setDate(
                            (cur) =>
                                new Date(cur.getFullYear(), cur.getMonth() - 1)
                        )
                    }
                />
                <Text variant="titleLarge" style={style.header}>
                    Registro allenamenti
                    {`\natleta: ${selectedAthlete?.name || "N/A"}`}
                </Text>
                <IconButton
                    icon="arrow-right"
                    onPress={() =>
                        setDate(
                            (cur) =>
                                new Date(cur.getFullYear(), cur.getMonth() + 1)
                        )
                    }
                />
            </View>
            <ScrollView style={style.container}>
                <Calendar
                    year={date.getFullYear()}
                    month={date.getMonth()}
                    markedDayIdxs={[
                        ...workouts.map((wk) => {
                            return new Date(wk.date).getDate();
                        }),
                    ]}
                    onPressDayIdx={(pressedDay) => {
                        const pressedDate = new Date(
                            date.getFullYear(),
                            date.getMonth(),
                            pressedDay.dayIdx
                        );

                        console.log("pressed date: ", pressedDate);

                        if (pressedDay.isMarked) {
                            const wkPressed = workouts.find((wk) => {
                                const wkDate = new Date(wk.date);
                                return (
                                    wkDate.getFullYear() ===
                                        pressedDate.getFullYear() &&
                                    wkDate.getMonth() ===
                                        pressedDate.getMonth() &&
                                    wkDate.getDate() === pressedDate.getDate()
                                );
                            });

                            if (!wkPressed) {
                                console.error(
                                    "error workout pressed not found"
                                );
                            } else {
                                openWorkout(pressedDate, wkPressed);
                            }
                        }
                    }}
                />
                <Text variant="titleMedium" style={{ alignSelf: "center" }}>
                    Totale allenamenti del mese: {workouts.length}
                </Text>
            </ScrollView>
            <Portal>
                <Modal
                    visible={visibleModal}
                    onDismiss={hideModal}
                    contentContainerStyle={{
                        backgroundColor: "white",
                        padding: 20,
                        margin: 20,
                        borderRadius: 10,
                    }}
                >
                    <View style={[style.flexRow, { minHeight: 30 }]}>
                        <Text variant="titleMedium">
                            Allenamento del {openedWorkout?.date}
                        </Text>
                        {/* TODO: se commento esistente l' icona deve essere 'comment-text'
                        altrimenti deve essere solo 'comment' (senza le righe) */}
                        <IconButton
                            icon={"comment-text"}
                            size={24}
                            onPress={async () => {
                                if (!openedWorkout) {
                                    return;
                                }

                                router.push({
                                    pathname: "/admin/WorkoutComment",
                                    params: {
                                        wkId: openedWorkout.id.toString(),
                                        wkDate: openedWorkout.date,
                                        wkDescription:
                                            openedWorkout.description,
                                    },
                                });

                                //TODO cambiare nome da visible modal con il collegarlo ad
                                //opened workout (se openedworkout === null allora e' chiuso)
                                setVisibleModal(false);
                            }}
                        />
                    </View>
                    <Divider />
                    <Text>{openedWorkout?.description}</Text>
                    <Divider />
                    <Text>Immagini:</Text>
                    <FullImageGrid
                        images={workoutImages}
                        onPressImage={(imageItem: ImageItemGrid) => {
                            openImageModal(imageItem.uri);
                        }}
                    />
                    <Button onPress={hideModal} style={{ marginTop: 10 }}>
                        Chiudi
                    </Button>
                </Modal>
            </Portal>
            <FullImageModal
                visible={isImageModalOpen()}
                onDismiss={() => closeImageModal()}
                imageUri={openedImage ?? ""}
            />
            <EditTextModal
                initialText={openedWorkoutComment?.description ?? ""}
                title={"Commento"}
                visible={isOpenedWkComment()}
                onDismiss={() => {
                    confirm(
                        "Attenzione",
                        "non verra' salvata alcuna bozza del commento!",
                        () => {
                            closeOpenedWkComment();
                        }
                    );
                }}
                onConfirm={async (newDescription: string) => {
                    //TODO creazione / modifica del commento
                    if (!openedWorkoutComment) {
                        alert("Errore", "riferimento: 0xaa");
                        return;
                    }

                    const jwt = await getJWT();

                    /* TODO, se esiste gia' il commento allora aggiornarlo
                     altrimenti crearlo. Esiste quando il commento aperto fa parte tra quelli fetchati */
                    try {
                        const { id } = await apiCreateWorkoutComment(
                            {
                                id_user_commentator:
                                    openedWorkoutComment.id_user_commentator,
                                id_workout: openedWorkoutComment.id_workout,
                                description: newDescription,
                            },
                            jwt
                        );

                        //TODO sincronizzazione stato locale
                        //dovrebbe aggiungere il commento appena creato a quelli fetchati
                    } catch (error) {
                        alert(
                            "Errore",
                            "Errore durante la creazione del commento: " + error
                        );
                    }

                    closeOpenedWkComment();
                }}
            />
        </>
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
    flexRow: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
});

export default WorkoutsPanel;
