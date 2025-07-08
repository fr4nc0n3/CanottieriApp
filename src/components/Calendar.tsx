import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Text, Card } from "react-native-paper";

// Nomi dei giorni e mesi in italiano
const weekDayNames = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
const monthNames = [
    "Gennaio",
    "Febbraio",
    "Marzo",
    "Aprile",
    "Maggio",
    "Giugno",
    "Luglio",
    "Agosto",
    "Settembre",
    "Ottobre",
    "Novembre",
    "Dicembre",
];

export type CalendarDay = {
    dayIdx: number;
    isMarked: boolean;
};

interface CalendarProps {
    year: number;
    month: number;
    markedDayIdxs: number[];
    onPressDayIdx: (calendarDay: CalendarDay) => void;
}

const Calendar: React.FC<CalendarProps> = (props) => {
    const year = props.year;
    const month = props.month;
    const markedDayIdxs = props.markedDayIdxs;

    // Prendi il giorno della settimana del 1° del mese (0=Dom, 1=Lun, ...)
    const firstWeekDay: number = new Date(year, month, 1).getDay();
    // Conta i giorni nel mese corrente
    const nDayMonth: number = new Date(year, month + 1, 0).getDate();

    // la settimana inizia da lunedi' in italia ed i valori di firstWeekDay: Dom = 0, Lun = 1 ...
    const firstWeekDayIta = firstWeekDay === 0 ? 6 : firstWeekDay - 1;

    // Genera l'array con i giorni da mostrare
    const daysArray: (CalendarDay | null)[] = [];

    // Aggiunge spazi vuoti per allineare il primo giorno nel calendario
    for (let i = 0; i < firstWeekDayIta; i++) {
        daysArray.push(null);
    }

    // Aggiunge i numeri dei giorni
    for (let i = 1; i <= nDayMonth; i++) {
        daysArray.push({
            dayIdx: i,
            isMarked: markedDayIdxs.some((idx) => idx === i),
        });
    }

    return (
        <Card style={{ margin: 16, borderRadius: 12 }}>
            <Card.Content>
                <Text
                    variant="titleLarge"
                    style={{ textAlign: "center", marginBottom: 8 }}
                >
                    {monthNames[month]} {year}
                </Text>

                {/* Header giorni della settimana */}
                <View style={styles.row}>
                    {weekDayNames.map((dayName, i) => (
                        <Text
                            key={i}
                            style={[styles.cell, styles.giornoSettimana]}
                        >
                            {dayName}
                        </Text>
                    ))}
                </View>

                {/* Giorni */}
                <View style={styles.grid}>
                    {daysArray.map((day, index) => {
                        const isSelected = day?.isMarked;
                        return (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.cell,
                                    isSelected ? styles.selected : {},
                                ]}
                                disabled={!day}
                                onPress={
                                    day
                                        ? () => props.onPressDayIdx(day)
                                        : () => {}
                                }
                            >
                                <Text
                                    style={
                                        isSelected ? styles.selectedText : {}
                                    }
                                >
                                    {day?.dayIdx || ""}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </Card.Content>
        </Card>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 4,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    cell: {
        width: "14.28%", // 100% diviso 7 giorni
        paddingVertical: 10,
        paddingHorizontal: 5,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 4,
        textAlign: "center",
    },
    giornoSettimana: {
        fontWeight: "bold",
        color: "#6200ee",
    },
    selected: {
        backgroundColor: "#6200ee",
        borderRadius: 20,
    },
    selectedText: {
        color: "white",
        fontWeight: "bold",
    },
});

export default Calendar;
