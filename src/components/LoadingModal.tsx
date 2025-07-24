import { StyleSheet } from "react-native";
import { ActivityIndicator, Modal, Portal, Text } from "react-native-paper";

interface LoadingModalProps {
    visible: boolean;
    message: string;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ visible, message }) => (
    <Portal>
        <Modal
            visible={visible}
            dismissable={false}
            contentContainerStyle={styles.modalContainer}
        >
            <ActivityIndicator animating={true} size="large" />
            {message && <Text style={styles.message}>{message}</Text>}
        </Modal>
    </Portal>
);

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: "white",
        padding: 20,
        margin: 40,
        borderRadius: 8,
        alignItems: "center",
    },
    message: {
        marginTop: 10,
    },
});

export default LoadingModal;
