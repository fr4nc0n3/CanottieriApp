// NewWorkoutScreen.jsx

import FullImageGrid, { ImageItemGrid } from "@/components/FullImageGrid";
import ImageViewModal from "@/components/ImageViewModal";
import { apiCreateWorkout, apiCreateWorkoutImage } from "@/global/APICalls";
import { getJWT } from "@/global/jwtStorage";
import { alert } from "@/global/UniversalPopups";
import {
    apiGetDateStringFormat,
    getJWTIdentity,
    sleep,
    universalDateStringFormat,
} from "@/global/Utils";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Card, Text } from "react-native-paper";

// Il componente accetta una data tramite props
const CreateWorkout = () => {
    const router = useRouter();
    const [description, setDescription] = useState("");
    const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([]);
    const [imageUriModal, setImageUriModal] = useState<string | null>(null);

    const isImageOpen = () => !!imageUriModal;
    const openImage = (uri: string) => setImageUriModal(uri);
    const closeImage = () => setImageUriModal(null);

    //TODO: fare controllo singolo sui parametri di navigazione
    const { wkYear, wkMonth, wkDate } = useLocalSearchParams();
    const workoutDate = new Date(
        Date.UTC(
            parseInt(wkYear?.toString()),
            parseInt(wkMonth?.toString()),
            parseInt(wkDate?.toString())
        )
    );

    if (isNaN(workoutDate.getTime())) return null; //se la data non e' valida non mostra nulla

    const addImage = async () => {
        // Richiedi permesso
        const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            alert("Hai bisogno dei permessi per accedere alla libreria!");
            return;
        }

        // Apri selettore immagini
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled) {
            setImages((cur) => {
                return [...cur, result.assets[0]];
            });
        }
    };

    const handleSave = async () => {
        const jwt = await getJWT();
        const identity = getJWTIdentity(jwt);

        try {
            const json = await apiCreateWorkout(
                {
                    date: apiGetDateStringFormat(workoutDate),
                    description: description,
                    id_user: identity,
                },
                jwt
            );

            const newWorkoutId = json.id;

            //TODO: gestione errori
            //TODO: (mettere warning se una o piu' immagini non riescono ad essere caricate)
            //aggiunta immagini
            images.forEach((image) => {
                if (image.file) {
                    apiCreateWorkoutImage(newWorkoutId, image.file, jwt);
                    sleep(100);
                }
            });
        } catch (error) {
            alert("Errore", "creazione allenamento fallita: " + error);
            return;
        }

        alert("Creato", "Allenamento creato");
        router.back();
    };

    return (
        <>
            <View style={styles.container}>
                <Card>
                    <Card.Content>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}
                        >
                            <Text variant="titleLarge">
                                Crea nuovo allenamento
                            </Text>
                            <Button
                                icon="image"
                                mode="contained"
                                onPress={() => {
                                    addImage();
                                }}
                            >
                                +
                            </Button>
                        </View>

                        {/* Mostra la data dell'allenamento */}
                        <Text style={styles.dateText}>
                            Data: {universalDateStringFormat(workoutDate)}
                        </Text>

                        {/* Campo per il testo descrittivo dell'allenamento */}
                        <TextInput
                            label="Descrizione allenamento"
                            value={description}
                            onChangeText={setDescription}
                            mode="outlined"
                            multiline
                            numberOfLines={6}
                            style={styles.textInput}
                        />
                        <FullImageGrid
                            images={images.map((image) => {
                                return { id: image.uri, uri: image.uri };
                            })}
                            onPressImage={(imageItem: ImageItemGrid) => {
                                openImage(imageItem.uri);
                            }}
                        />

                        {/* Pulsante per il salvataggio */}
                        <Button
                            mode="contained"
                            onPress={handleSave}
                            style={styles.saveButton}
                        >
                            Crea
                        </Button>
                    </Card.Content>
                </Card>
            </View>
            <ImageViewModal
                visible={isImageOpen()}
                onDismiss={() => {
                    closeImage();
                }}
                imageUri={imageUriModal}
                onDelete={() => {
                    //rimuove un immagine dalla lista
                    setImages((cur) => {
                        return cur.filter(
                            (image) => image.uri !== imageUriModal
                        );
                    });
                }}
            />
        </>
    );
};

// Stili per la pagina
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
        justifyContent: "center",
    },
    dateText: {
        marginBottom: 12,
        fontSize: 16,
    },
    textInput: {
        marginBottom: 16,
    },
    saveButton: {
        marginTop: 8,
    },
});

export default CreateWorkout;
