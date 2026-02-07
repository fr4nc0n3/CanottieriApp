//Licensed under the GNU General Public License v3. See LICENSE file for details.

import Calendar from "@/components/Calendar";
import { apiGetPlannings } from "@/global/APICalls";
import { COLORS } from "@/global/Colors";
import { getJWT } from "@/global/jwtStorage";
import { ApiOutputGetPlanning } from "@/global/Types";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { IconButton, Text } from "react-native-paper";

type Planning = ApiOutputGetPlanning;

const TrainingCalendarPage = () => {
    const router = useRouter();
    const [plannings, setPlannings] = useState<Planning[]>([]);
    const [date, setDate] = useState<Date>(new Date()); //data del mese di riferimento

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
                        //TODO gestione colore
                        return {
                            monthDate: date.getDate(),
                            color: COLORS.purple100,
                        };
                    })}
                    onPressDay={(monthDate, month, year) => {
                        const pressedDate = new Date(
                            Date.UTC(year, month, monthDate),
                        );

                        console.log("pressed date: ", pressedDate);

                        //if (pressedDay.isMarked) {
                        //prendo planning in base alla data selezionata
                        const planningPressed = plannings.find((planning) => {
                            const pDate = new Date(planning.date);
                            return pDate.getTime() === pressedDate.getTime();
                        });

                        /*if (!planningPressed) {
                            console.error("errore di programmazione cod. 22");
                            alert("Qualcosa e' andato storto cod. 22");
                            return;
                        }*/

                        if (planningPressed) {
                            router.push({
                                pathname: "/TrainingDayPage",
                                params: {
                                    date: planningPressed.date,
                                    description: planningPressed.description,
                                },
                            });
                        }
                        //}
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

export default TrainingCalendarPage;
