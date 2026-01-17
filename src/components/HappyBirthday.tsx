import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

const happyMessages: string[] = [
    "Buon compleanno! 🎉\n Oggi solo per te 10x10000m... \nScherzone :)",
    "Tanti auguri di buon compleanno! 🎂\n Ti auguro un anno ricco di successi",
    "Buon compleanno dall' App! 🥳 ",
    "Buon compleanno di cuore! 💖\n Qui l' IBAN per pagarci la cena:\n IT00 X00A HAHA HA0H AHA0 H0AH AHA :)",
    "Tanti auguri! 🎁\n Hai ricevuto un buono allenamento 🎫:\n Si', come no 🤣",
    "Buon compleanno! 🌟\n Salute, amore e felicità oggi e sempre",
];

//numero casuale nell' intervallo [0, max) (max escluso)
const randomInt = (max: number): number => {
    return Math.floor(Math.random() * max);
};

const getRandomHappyBirthday = () => {
    return happyMessages[randomInt(happyMessages.length)];
};

const HappyBirthday = () => {
    return (
        <View style={styles.wrapper}>
            <View style={styles.happyBirthdayContainer}>
                <Text variant="titleMedium" style={styles.happyBirthdayText}>
                    {getRandomHappyBirthday()}
                </Text>
            </View>
        </View>
    );
};

export default HappyBirthday;

const styles = StyleSheet.create({
    wrapper: {
        alignItems: "center",
        marginVertical: 16,
    },
    happyBirthdayContainer: {
        borderWidth: 1,
        borderColor: "#FFD700", // oro ✨
        borderRadius: 24,
        backgroundColor: "#1d51a7",
        paddingHorizontal: 18,
        paddingVertical: 12,

        // Ombra iOS
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,

        // Ombra Android
        elevation: 4,
    },
    happyBirthdayText: {
        color: "#f5c907",
        fontWeight: "bold",
        textAlign: "center",
        letterSpacing: 0.5,
    },
});
