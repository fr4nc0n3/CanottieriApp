import React from "react";
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
    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={onDismiss}
                contentContainerStyle={styles.modalContainer}
                dismissable={true}
            >
                <TouchableWithoutFeedback onPress={onDismiss}>
                    <View style={styles.imageWrapper}>
                        <Image
                            source={{ uri: imageUri }}
                            resizeMode="contain"
                            style={styles.image}
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
    },
    imageWrapper: {
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: width,
        height: height,
    },
});

export default FullImageModal;
