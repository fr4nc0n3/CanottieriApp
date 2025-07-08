import Calendar from "@/components/Calendar";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { IconButton, Text } from "react-native-paper";

const WorkoutsRegisterPage = () => {
    const router = useRouter();

    const [date, setDate] = useState<Date>(new Date());

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
    const openModifyWorkout = (date: Date) => {
        router.push({
            pathname: "/workoutCRUD/ModifyWorkout",
            params: {
                wkYear: date.getFullYear(),
                wkMonth: date.getMonth(),
                wkDate: date.getDate(),
                workout: "--TODO--", //TODO
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
                    markedDayIdxs={[5, 7]}
                    onPressDayIdx={(pressedDay) => {
                        console.log("pressed day: ", pressedDay);

                        pressedDay.isMarked
                            ? openModifyWorkout(
                                  new Date(
                                      date.getFullYear(),
                                      date.getMonth(),
                                      pressedDay.dayIdx
                                  )
                              )
                            : openCreateWorkout(
                                  new Date(
                                      date.getFullYear(),
                                      date.getMonth(),
                                      pressedDay.dayIdx
                                  )
                              );
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
