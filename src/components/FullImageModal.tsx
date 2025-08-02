import React, { useState } from "react";
import {
    View,
    Image,
    StyleSheet,
    TouchableWithoutFeedback,
    Dimensions,
} from "react-native";
import { IconButton, Modal, Portal } from "react-native-paper";

interface FullImageModalProps {
    visible: boolean;
    onDismiss: () => void;
    imageUri: string;
}

const FullImageModal: React.FC<FullImageModalProps> = ({
    visible,
    onDismiss,
    imageUri,
}) => {
    const [rotationDegree, setRotationDegree] = useState<number>(0);
    const rotate = () => setRotationDegree((cur) => (cur + 90) % 360);
    const reset = () => setRotationDegree(0);

    const closeModal = () => {
        reset();
        onDismiss();
    };

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={closeModal}
                contentContainerStyle={styles.modalContainer}
                dismissable={true}
            >
                <IconButton
                    icon="rotate-right"
                    size={32}
                    onPress={() => rotate()}
                />
                <TouchableWithoutFeedback onPress={closeModal}>
                    <View style={styles.imageWrapper}>
                        <Image
                            source={{ uri: imageUri }}
                            resizeMode="contain"
                            style={[
                                styles.image,
                                {
                                    transform: [
                                        { rotate: `${rotationDegree}deg` },
                                    ],
                                },
                            ]}
                        />
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </Portal>
    );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        margin: 0,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
    },
    imageWrapper: {
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: width * 0.9,
        height: height * 0.9,
    },
});

export default FullImageModal;
