//Licensed under the GNU General Public License v3. See LICENSE file for details.

import { apiGetPlannings } from "@/global/APICalls";
import { getJWT } from "@/global/jwtStorage";
import { ApiInputGetPlannings, ApiOutputGetPlanning } from "@/global/Types";
import { alert } from "@/global/UniversalPopups";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

type Planning = ApiOutputGetPlanning;
export default function TrainingDayPage() {
    const [monthPlannings, setMonthPlannings] = useState<Planning[]>([]);

    const fetchMonthPlannings = async () => {
        const jwt = await getJWT();
        const today = new Date();

        const filter: ApiInputGetPlannings = {
            year: today.getFullYear(),
            month: today.getMonth(),
        };

        try {
            const plannings = await apiGetPlannings(filter, jwt);
            setMonthPlannings(plannings);
        } catch (error) {
            console.error("Error: ", error);
            alert("Errore", "Errore durante la ricezione della programmazione");
        }
    };

    useEffect(() => {
        fetchMonthPlannings();
    }, []);

    const getPlanningOfToday = () => {
        return monthPlannings.find((planning) => {
            const pDate = new Date(planning.date);
            const today = new Date();

            return (
                pDate.getFullYear() === today.getFullYear() &&
                pDate.getMonth() === today.getMonth() &&
                pDate.getDate() === today.getDate()
            );
        });
    };

    const planningOfTheDay = getPlanningOfToday();

    if (!planningOfTheDay) {
        return (
            <Text>Non e&apos; stato registrato alcun allenamento per oggi</Text>
        );
    }

    return (
        <>
            <View style={styles.header}>
                <Text variant="titleLarge">
                    Allenamento giornaliero del{" "}
                    {planningOfTheDay?.date ?? "<N/A>"}
                </Text>
            </View>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <Text variant="bodyLarge" style={{ lineHeight: 24 }}>
                    {planningOfTheDay?.description ?? ""}
                </Text>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
});
