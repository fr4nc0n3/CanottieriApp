import { useState } from "react";
import { Dimensions, View, Image } from "react-native";
import { IconButton, Modal, Portal } from "react-native-paper";
import { confirm } from "@/global/UniversalPopups";

interface ImageViewModalProps {
    visible: boolean;
    onDismiss: () => void;
    imageUri: string | null;
    onDelete: () => void;
}

/* Componente per visualizzare un immagine e poterla eliminare */
const ImageViewModal: React.FC<ImageViewModalProps> = ({
    visible,
    onDismiss,
    imageUri,
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
                {imageUri && (
                    <Image
                        source={{ uri: imageUri }}
                        style={{
                            resizeMode: "contain",
                            width: winWidth * 0.8,
                            height: winHeight * 0.8,
                            marginBottom: 10,
                            transform: [{ rotate: `${rotationDegree}deg` }],
                        }}
                    />
                )}
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
                            //TODO: qui andrebbe messo solo onDelete()
                            //la richiesta di conferma deve essere delegata al chiamante
                            confirm(
                                "Eliminazione",
                                "Sei sicuro di voler eliminare l' immagine?",
                                () => {
                                    onDelete();
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

export default ImageViewModal;
