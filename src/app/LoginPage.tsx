import { apiLogin } from "@/global/APICalls";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View, StyleSheet, Image, Alert } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";

export default function LoginPage() {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        if (username.trim() === "" || password.trim() === "") {
            setError("Inserisci username e password.");
        } else {
            setError("");

            try {
                //TODO ottenere token e fare login oppure se fallisce segnalare in error
                const jsonRes = await apiLogin(username, password);
                console.log("response login:", jsonRes);
                router.dismissTo("/MenuPage");
            } catch (error) {
                Alert.alert("Errore durante il login");
            }
        }
    };

    return (
        <View style={styles.container}>
            <Image
                source={require("@/assets/images/icon_app.png")}
                style={styles.logo}
            />
            <Text variant="titleLarge" style={styles.title}>
                Accedi
            </Text>

            <TextInput
                label="Nome utente"
                value={username}
                onChangeText={setUsername}
                mode="outlined"
                style={styles.input}
                autoCapitalize="none"
            />

            <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                mode="outlined"
                style={styles.input}
                autoCapitalize="none"
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Button
                mode="contained"
                onPress={handleLogin}
                style={styles.button}
            >
                Accedi
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        padding: 24,
        backgroundColor: "white",
    },
    title: {
        marginBottom: 24,
        textAlign: "center",
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 8,
        paddingVertical: 6,
    },
    error: {
        color: "red",
        marginBottom: 8,
        textAlign: "center",
    },
    logo: {
        alignSelf: "center",
        resizeMode: "contain",
        maxHeight: "30%",
        maxWidth: "50%",
    },
});
