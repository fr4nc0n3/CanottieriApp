import Calendar from "@/components/Calendar";
import FullImageGrid, { ImageItemGrid } from "@/components/FullImageGrid";
import FullImageModal from "@/components/FullImageModal";
import {
    apiGetUsers,
    apiGetWorkout,
    apiGetWorkoutImages,
    apiUriImage,
} from "@/global/APICalls";
import { getJWT } from "@/global/jwtStorage";
import { User, Workout } from "@/global/Types";
import { alert } from "@/global/UniversalPopups";
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
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const openMenu = () => setShowMenu(true);
    const closeMenu = () => setShowMenu(false);

    const [visibleModal, setVisibleModal] = useState<boolean>(false);
    const hideModal = () => setVisibleModal(false);
    const showModal = () => setVisibleModal(true);

    const [openedWorkout, setOpenedWorkout] = useState<Workout | null>(null);
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
                    <Text variant="titleMedium">
                        Allenamento del {openedWorkout?.date}
                    </Text>
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
});

export default WorkoutsPanel;
