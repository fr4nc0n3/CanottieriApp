import Calendar from "@/components/Calendar";
import { apiGetPlannings } from "@/global/APICalls";
import { getJWT } from "@/global/jwtStorage";
import { ApiOutputGetPlannings } from "@/global/Types";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { IconButton, Text } from "react-native-paper";

const PublishProgram = () => {
    const [plannings, setPlannings] = useState<ApiOutputGetPlannings>([]);

    const [date, setDate] = useState<Date>(new Date()); //data del mese di riferimento

    const fetchMonthPlannings = async (date: Date) => {
        const jwt = await getJWT();

        const plannings = await apiGetPlannings(
            { year: date.getFullYear(), month: date.getMonth() },
            jwt
        );

        setPlannings(plannings);
    };

    useEffect(() => {
        fetchMonthPlannings(date);
    }, [date]);

    //TODO crea planning

    //TODO elimina planning

    //TODO aggiorna planning

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
                    Programma allenamenti
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
                    markedDayIdxs={plannings.map((planning) => {
                        const date = new Date(planning.date);
                        return date.getDate();
                    })}
                    onPressDayIdx={(pressedDay) => {
                        const pressedDate = new Date(
                            date.getFullYear(),
                            date.getMonth(),
                            pressedDay.dayIdx
                        );

                        console.log("pressed date: ", pressedDate);

                        if (pressedDay.isMarked) {
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

export default PublishProgram;
