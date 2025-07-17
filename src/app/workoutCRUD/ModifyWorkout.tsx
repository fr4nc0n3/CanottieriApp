import React, { useState } from "react";
import { View, StyleSheet, Image, Dimensions } from "react-native";
import {
    TextInput,
    Button,
    Card,
    Text,
    Divider,
    Portal,
    Modal,
    IconButton,
} from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { confirm, alert } from "@/global/UniversalPopups";
import { apiDeleteWorkout, apiUpdateWorkout } from "@/global/APICalls";
import { getJWT } from "@/global/jwtStorage";
import { getJWTIdentity } from "@/global/Utils";
import ImageGrid, { ImageItemGrid } from "@/components/FullImageGrid";
import * as ImagePicker from "expo-image-picker";

//TODO fare il fetch delle immagini dal backend
const ModifyWorkout = () => {
    const router = useRouter();
    const { height: winHeight, width: winWidth } = Dimensions.get("window");

    const { wkYear, wkMonth, wkDate, wkId, wkDescr } = useLocalSearchParams();
    const [desc, setDesc] = useState(wkDescr?.toString() ?? "");

    //controllo di cio' che e' stato ricevuto in searchparams
    const workoutDate = new Date(
        Date.UTC(
            parseInt(wkYear?.toString()),
            parseInt(wkMonth?.toString()),
            parseInt(wkDate?.toString())
        )
    );

    const [images, setImages] = useState<ImageItemGrid[]>([]);
    const [imageModal, setImageModal] = useState<ImageItemGrid | null>(null);
    const openModal = (image: ImageItemGrid) => {
        setImageModal(image);
    };
    const closeModal = () => {
        setImageModal(null);
    };

    if (isNaN(workoutDate.getTime()) || wkId == null || wkDescr == null) {
        return null;
    }

    const handleApply = async () => {
        const jwt = await getJWT();
        const id = parseInt(wkId.toString());

        try {
            await apiUpdateWorkout({ id, description: desc }, jwt);
        } catch (error) {
            alert("Errore", "Errore durante la modifica");
            return;
        }

        alert("Modifica", "Modifica effettuata");
        router.back();
    };

    const handleDelete = () => {
        confirm(
            "Eliminazione allenamento",
            "Sei sicuro di voler eliminare l' allenamento in data " +
                workoutDate.toLocaleDateString(),
            async () => {
                const jwt = await getJWT();
                const id = parseInt(wkId.toString());

                try {
                    await apiDeleteWorkout({ id }, jwt);
                } catch (error) {
                    alert("Errore", "Errore durante la eliminazione");
                    return;
                }

                alert("Eliminato", "L' allenamento e' stato eliminato");
                router.back();
            }
        );
    };

    const uploadImageOnline = async (asset: ImagePicker.ImagePickerAsset) => {
        /*    console.log("upload asset:", asset);

        // ImagePicker saves the taken photo to disk and returns a local URI to it
        let localUri = asset.uri;
        let filename = localUri.split("/").pop();

        // Infer the type of the image
        let match = /\.(\w+)$/.exec(asset.fileName ?? "");
        let type = match ? `image/${match[1]}` : `image`;

        // Upload the image using the fetch and FormData APIs
        let formData = new FormData();
        // Assume "photo" is the name of the form field the server expects
        formData.append("image", {
            uri: localUri,
            name: filename,
            type,
        } as any);

        try {
            const jwt = await getJWT();
            const response = await fetch(
                "http://192.168.1.100:5000/api/img_workout",
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            const data = await response.json();
            if (!response.ok)
                throw new Error(data.error || "Errore durante l’upload");

            alert("Successo", "Immagine caricata!");
        } catch (error) {
            console.error("Errore upload:", error);
            alert("Errore", "Impossibile caricare l’immagine");
        }*/
    };

    const deleteImageOnline = (imageName: string) => {};

    const addImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            quality: 1,
        });

        if (!result.canceled && result.assets.length > 0) {
            const asset = result.assets[0];
            setImages((cur) => [
                ...cur,
                {
                    uri: asset.uri,
                    id: asset.assetId ?? (cur.length + 10).toString(),
                },
            ]);

            uploadImageOnline(asset);
        }
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
                                Modifica allenamento
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

                        <Text style={styles.dateText}>
                            Data:{" "}
                            {workoutDate
                                ? workoutDate.toLocaleDateString()
                                : "Invalid date"}
                        </Text>

                        <TextInput
                            label="Descrizione allenamento"
                            value={desc}
                            onChangeText={setDesc}
                            mode="outlined"
                            multiline
                            numberOfLines={6}
                            style={styles.textInput}
                        />

                        <Button
                            mode="contained"
                            onPress={handleApply}
                            style={styles.saveButton}
                        >
                            Applica modifiche
                        </Button>

                        <Button
                            mode="outlined"
                            onPress={handleDelete}
                            style={styles.deleteButton}
                            textColor="red"
                        >
                            Elimina allenamento
                        </Button>
                    </Card.Content>
                </Card>
                <Divider style={{ marginTop: 10 }} />
                <Text variant="titleMedium" style={{ alignSelf: "center" }}>
                    Immagini allegate:{" "}
                </Text>
                <ImageGrid
                    images={images}
                    onPressImage={(imageItem: ImageItemGrid) => {
                        openModal(imageItem);
                    }}
                />
            </View>
            <Portal>
                <Modal
                    visible={!!imageModal}
                    onDismiss={() => closeModal()}
                    contentContainerStyle={{
                        backgroundColor: "white",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 20,
                        margin: 20,
                        borderRadius: 10,
                    }}
                >
                    <IconButton
                        style={{ alignSelf: "flex-end" }}
                        icon="close"
                        onPress={() => closeModal()}
                    />
                    <Image
                        source={{ uri: imageModal?.uri }}
                        style={{
                            resizeMode: "contain",
                            width: winWidth * 0.8,
                            height: winHeight * 0.8,
                            marginBottom: 10,
                        }}
                    />
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-around",
                        }}
                    >
                        <IconButton
                            icon="trash-can"
                            iconColor="red"
                            size={48}
                            onPress={() => {
                                console.log("remove image:", imageModal?.id);

                                setImages((cur) => {
                                    return cur.filter(
                                        (image) => image.id !== imageModal?.id
                                    );
                                });

                                //TODO: deleteImageOnline();

                                closeModal();
                            }}
                        />
                    </View>
                </Modal>
            </Portal>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: "center",
        backgroundColor: "#fff",
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
    deleteButton: {
        marginTop: 16,
        borderColor: "red",
    },
});

export default ModifyWorkout;
