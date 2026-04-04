import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import {
    getNothingColor,
    getRaceColor,
    getTrainingIntensityColor,
} from "./Utils";

type LegendIntensityTrainingRowProps = {
    intensityPercentage: number;
};

export const LegendIntensityTrainingRow: React.FC<
    LegendIntensityTrainingRowProps
> = ({ intensityPercentage }) => {
    return (
        <View style={styles.row}>
            <View
                style={[
                    styles.colorBox,
                    {
                        backgroundColor:
                            getTrainingIntensityColor(intensityPercentage),
                    },
                ]}
            />
            <Text style={styles.label}>
                Intensit{"a'"} allenamento ({intensityPercentage}%)
            </Text>
        </View>
    );
};

export const LegendRace = () => {
    return (
        <View style={styles.row}>
            <View
                style={[styles.colorBox, { backgroundColor: getRaceColor() }]}
            />
            <Text style={styles.label}>Gara</Text>
        </View>
    );
};

//legenda per segnare un giorno senza caratteristiche particolari
export const LegendNothing = () => {
    return (
        <View style={styles.row}>
            <View
                style={[
                    styles.colorBox,
                    { backgroundColor: getNothingColor() },
                ]}
            />
            <Text style={styles.label}>Programmazione generica</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontWeight: "bold",
        fontSize: 18,
        marginBottom: 12,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 6,
    },
    colorBox: {
        width: 24,
        height: 24,
        borderRadius: 4,
        marginRight: 12,
    },
    label: {
        fontSize: 16,
    },
});
