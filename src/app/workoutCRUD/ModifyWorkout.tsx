import React, { useEffect, useState } from "react";
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
import {
    apiCreateWorkoutImage,
    apiDeleteImage,
    apiDeleteWorkout,
    apiGetWorkoutImages,
    apiUpdateWorkout,
    apiUriImage,
} from "@/global/APICalls";
import { getJWT } from "@/global/jwtStorage";
import ImageGrid, { ImageItemGrid } from "@/components/FullImageGrid";
import * as ImagePicker from "expo-image-picker";
import LoadingModal from "@/components/LoadingModal";
import {
    apiGetDateStringFormat,
    universalDateStringFormat,
} from "@/global/Utils";

const ModifyWorkout = () => {
    const router = useRouter();

    //TODO qui dovrei forzare i le variabili a tipi e dati coerenti
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

    const [visibleLoading, setVisibleLoading] = useState<boolean>(false);

    if (isNaN(workoutDate.getTime()) || wkId == null || wkDescr == null) {
        return null;
    }

    const fetchWorkoutImages = async () => {
        const jwt = await getJWT();
        const id = parseInt(wkId.toString());

        await apiGetWorkoutImages(id, jwt).then(async (imgs) => {
            console.log("images backend: ", imgs);

            setImages(
                imgs.map((imgBackend) => {
                    return {
                        uri: apiUriImage(imgBackend.name),
                        id: imgBackend.name,
                    };
                })
            );
        });
    };

    useEffect(() => {
        fetchWorkoutImages();
    }, []);

    //log images grid
    useEffect(() => {
        console.log("images of the grid:", images);
    }, [images]);

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
                universalDateStringFormat(workoutDate),
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

    const uploadImageOnline = async (
        asset: ImagePicker.ImagePickerAsset
    ): Promise<string> => {
        console.log("upload asset:", asset);

        if (!asset.file) {
            alert("Errore, file non reperibile");
            throw new Error("file not available");
        }

        try {
            const id = parseInt(wkId.toString());
            const jwt = await getJWT();

            return await apiCreateWorkoutImage(id, asset.file, jwt);
        } catch (error) {
            alert("Errore", "Impossibile caricare l’immagine");
            throw error;
        }
    };

    const deleteImageOnline = async (imageName: string) => {
        const jwt = await getJWT();

        await apiDeleteImage(jwt, imageName);
    };

    //TODO problema id locale rispetto a name online
    //fare refetch?
    const addImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            quality: 1,
        });

        if (!result.canceled && result.assets.length > 0) {
            const asset = result.assets[0];

            setVisibleLoading(true);
            try {
                const imgName = await uploadImageOnline(asset);

                setImages((cur) => [
                    ...cur,
                    {
                        uri: asset.uri,
                        id: imgName,
                    },
                ]);
            } catch (error) {
                console.error(error);
            } finally {
                setVisibleLoading(false);
            }
        }
    };

    const deleteImage = async (imageName: string) => {
        console.log("remove image:", imageName);

        setImages((cur) => {
            return cur.filter((image) => image.id !== imageName);
        });

        deleteImageOnline(imageName);
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
                                ? universalDateStringFormat(workoutDate)
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
            <ImageModal
                visible={!!imageModal}
                onDismiss={() => closeModal()}
                imageModal={imageModal}
                onDelete={(imageId) => deleteImage(imageId)}
            />
            <LoadingModal
                visible={visibleLoading}
                message={"Caricamento immagine online..."}
            />
        </>
    );
};

interface ImageModalProps {
    visible: boolean;
    onDismiss: () => void;
    imageModal: { id: string; uri: string } | null;
    onDelete: (imageId: string) => void;
}

/* Componente per visualizzare un immagine e poterla eliminare */
const ImageModal: React.FC<ImageModalProps> = ({
    visible,
    onDismiss,
    imageModal,
    onDelete,
}) => {
    const { height: winHeight, width: winWidth } = Dimensions.get("window");
    const [rotationDegree, setRotationDegree] = useState<number>(0);

    const closeModal = () => {
        setRotationDegree(0);
        onDismiss();
    };

    return (
        <Portal>
            <Modal
                visible={visible}
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
                <IconButton
                    icon="rotate-right"
                    onPress={() => {
                        setRotationDegree((cur) => (cur + 90) % 360);
                    }}
                />
                <Image
                    source={{ uri: imageModal?.uri }}
                    style={{
                        resizeMode: "contain",
                        width: winWidth * 0.8,
                        height: winHeight * 0.8,
                        marginBottom: 10,
                        transform: [{ rotate: `${rotationDegree}deg` }],
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
                            confirm(
                                "Eliminazione",
                                "Sei sicuro di voler eliminare l' immagine?",
                                () => {
                                    if (imageModal) {
                                        onDelete(imageModal.id);
                                    }

                                    closeModal();
                                }
                            );
                        }}
                    />
                </View>
            </Modal>
        </Portal>
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
