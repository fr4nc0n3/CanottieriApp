import { apiLogin } from "@/global/APICalls";
import { saveJWT } from "@/global/jwtStorage";
import { alert } from "@/global/UniversalPopups";
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { UserContext } from "./UserContext/UserContext";
import { COLORS } from "@/global/Colors";

export default function LoginPage() {
    const router = useRouter();
    const userContext = useContext(UserContext);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        if (username.trim() === "" || password.trim() === "") {
            setError("Inserisci username e password.");
        } else {
            setError("");

            //ricezione jwt login
            try {
                const jsonRes = await apiLogin(username, password);
                console.log("response login:", jsonRes);

                if (jsonRes.token) {
                    await saveJWT(jsonRes.token);

                    userContext?.syncUserInfo();
                    router.dismissTo("/MenuPage");
                } else {
                    setError("Credenziali errate");
                }
            } catch (error) {
                alert("Errore durante il login");
            }
        }
    };

    return (
        <View style={styles.container}>
            <Image
                source={require("@/assets/images/icon_app_2.jpeg")}
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
        backgroundColor: COLORS.white100,
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
        color: COLORS.red100,
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
