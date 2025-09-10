import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Card, Text, TextInput, Button, Divider } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    apiCreateWorkoutComment,
    apiGetWorkoutComments,
    apiUpdateWorkoutComment,
} from "@/global/APICalls";
import type { WorkoutComment } from "@/global/Types";
import { getJWT } from "@/global/jwtStorage";
import {
    apiGetDateStringFormat,
    getJWTIdentity,
    universalDateStringFormat,
} from "@/global/Utils";
import { alert } from "@/global/UniversalPopups";
import LoadingModal from "@/components/LoadingModal";

const WorkoutCommentPage = () => {
    const { wkId, wkDate, wkDescription } = useLocalSearchParams();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState<WorkoutComment | null>(null);
    const [text, setText] = useState("");
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        const fetchComments = async () => {
            const jwt = await getJWT();
            try {
                setLoading(true);
                const comments = await apiGetWorkoutComments(
                    { id_workout: Number(wkId) },
                    String(jwt)
                );

                if (comments && comments.length > 0) {
                    const lastComment = comments[comments.length - 1];
                    setComment(lastComment);
                    setText(lastComment.description);
                }
            } catch (error) {
                console.error("Errore caricamento commenti:", error);
            } finally {
                setLoading(false);
            }
        };

        if (wkId) {
            fetchComments();
        }
    }, [wkId]);

    const handleCreate = async () => {
        //TODO: conviene usare un react context per avere accesso
        // globale al jwt senza dover chiamare la funzione ogni volta?
        const jwt = await getJWT();
        const identity = getJWTIdentity(jwt);
        try {
            const { id } = await apiCreateWorkoutComment(
                {
                    id_user_commentator: Number(identity),
                    id_workout: Number(wkId),
                    description: text,
                },
                jwt
            );

            setComment({
                id,
                id_user_commentator: Number(identity),
                id_workout: Number(wkId),
                description: text,
                created_at: universalDateStringFormat(new Date()),
                updated_at: "",
            });
        } catch (error) {
            alert(
                "Errore",
                "errore durante la creazione del commento: " + error
            );
        }
    };

    const handleUpdate = async () => {
        if (!comment) {
            alert(
                "Errore",
                "si sta provando a modificare un commento non esistente"
            );
            return;
        }

        const jwt = await getJWT();
        try {
            await apiUpdateWorkoutComment(
                {
                    id: comment.id,
                    description: text,
                },
                jwt
            );

            setComment((cur) => {
                return cur ? { ...cur, description: text } : null;
            });
            setEditMode(false);
        } catch (error) {
            alert(
                "Errore",
                "errore durante la modifica del commento: " + error
            );
        }
    };

    /*const handleDelete = async () => {
        const jwt = await getJWT();
        try {
            await apiDeleteWorkoutComment(
                {
                    id: idComment,
                },
                jwt
            );

            setComment(null);
            setText("");
        } catch (error) {
            alert(
                "Errore",
                "errore durante l' eliminazione del commento: " + error
            );
        }
    };*/

    return (
        <>
            {
                //TODO freccienttina per tornare indietro alla pagina del workout
            }
            <View style={{ flex: 1, padding: 16 }}>
                <Card>
                    <Card.Content>
                        <Text
                            style={{
                                fontWeight: "bold",
                            }}
                        >
                            {`Commento allenamento del ${wkDate}`}
                        </Text>
                        <Text style={{ fontWeight: "bold" }}>
                            Descrizione allenamento:{" "}
                        </Text>
                        <Text>{wkDescription}</Text>

                        <Divider style={{ margin: 5 }} />

                        {comment ? (
                            <>
                                {!editMode ? (
                                    <>
                                        <Text style={{ marginBottom: 8 }}>
                                            Commento: {comment.description}
                                        </Text>
                                        <Button
                                            onPress={() => setEditMode(true)}
                                            mode="outlined"
                                            style={{ marginBottom: 8 }}
                                        >
                                            Modifica
                                        </Button>
                                        {/*<Button
                                        onPress={handleDelete}
                                        mode="contained"
                                        buttonColor="red"
                                    >
                                        Elimina
                                    </Button>*/}
                                    </>
                                ) : (
                                    <>
                                        <TextInput
                                            label="Modifica commento"
                                            value={text}
                                            onChangeText={setText}
                                            mode="outlined"
                                            style={{ marginBottom: 8 }}
                                        />
                                        <Button
                                            onPress={handleUpdate}
                                            mode="contained"
                                            style={{ marginBottom: 8 }}
                                        >
                                            Salva
                                        </Button>
                                        <Button
                                            onPress={() => setEditMode(false)}
                                            mode="outlined"
                                        >
                                            Annulla
                                        </Button>
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                <TextInput
                                    label="Nuovo commento"
                                    value={text}
                                    onChangeText={setText}
                                    mode="outlined"
                                    style={{ marginBottom: 8 }}
                                />
                                <Button onPress={handleCreate} mode="contained">
                                    Crea commento
                                </Button>
                            </>
                        )}
                    </Card.Content>
                </Card>
            </View>
            <LoadingModal
                visible={loading}
                message={"Ricezione dati commento allenamento ..."}
            />
        </>
    );
};

export default WorkoutCommentPage;
