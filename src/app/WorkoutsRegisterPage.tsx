import Calendar from "@/components/Calendar";
import { apiGetWorkout } from "@/global/APICalls";
import { getJWT } from "@/global/jwtStorage";
import { Workout } from "@/global/Types";
import { alert } from "@/global/UniversalPopups";
import { getJWTIdentity } from "@/global/Utils";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { IconButton, Text } from "react-native-paper";

const WorkoutsRegisterPage = () => {
    const router = useRouter();

    const firstFocusRef = useRef(true);
    const [date, setDate] = useState<Date>(new Date());
    const [workouts, setWorkouts] = useState<Workout[]>([]);

    //fetch allenamenti al cambiare della data
    useEffect(() => {
        fetchWorkouts();
    }, [date]);

    //fetch allenamenti ogni volta che va in focus la pagina
    useFocusEffect(
        useCallback(() => {
            if (!firstFocusRef.current) {
                fetchWorkouts();
            } else {
                firstFocusRef.current = false;
            }
            return () => {};
        }, [])
    );

    //log state
    useEffect(() => {
        console.log("workouts:", workouts);
    }, [workouts]);

    const fetchWorkouts = () => {
        getJWT()
            .then((jwt) => {
                const identity = getJWTIdentity(jwt);
                return apiGetWorkout(
                    {
                        id_user: identity,
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
                    "errore durante la ricezione allenamenti: " + error
                );
            });
    };

    const openCreateWorkout = (date: Date) => {
        router.push({
            pathname: "/workoutCRUD/CreateWorkout",
            params: {
                wkYear: date.getFullYear(),
                wkMonth: date.getMonth(),
                wkDate: date.getDate(),
            },
        });
    };
    const openModifyWorkout = (date: Date, workout: Workout) => {
        router.push({
            pathname: "/workoutCRUD/ModifyWorkout",
            params: {
                wkYear: date.getFullYear(),
                wkMonth: date.getMonth(),
                wkDate: date.getDate(),
                wkId: workout.id,
                wkDescr: workout.description,
            },
        });
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
                                new Date(cur.getFullYear(), cur.getMonth() - 1)
                        )
                    }
                />
                <Text variant="titleLarge" style={style.header}>
                    Registro allenamenti
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
                                openModifyWorkout(pressedDate, wkPressed);
                            }
                        } else {
                            openCreateWorkout(pressedDate);
                        }
                    }}
                />
            </ScrollView>
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

export default WorkoutsRegisterPage;
