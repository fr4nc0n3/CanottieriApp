import { Platform, View, StyleSheet } from "react-native";
import { Portal, Modal, IconButton, Text, Divider } from "react-native-paper";

type PdfViewerModalProps = {
    pdfUrl: string | null;
    visible: boolean;
    onDismiss: () => void;
};

export default function PdfViewerModal({
    pdfUrl,
    visible,
    onDismiss,
}: PdfViewerModalProps) {
    const renderPdf = () => {
        if (Platform.OS === "web") {
            return pdfUrl ? (
                <embed
                    src={pdfUrl}
                    type="application/pdf"
                    style={styles.iframe}
                />
            ) : (
                <Text>Nessun URL da mostrare</Text>
            );
        }

        return (
            <View>
                <Text>Piattaforma non supportata per rendering PDF</Text>
            </View>
        );
    };

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={onDismiss}
                contentContainerStyle={styles.modal}
            >
                <View style={styles.header}>
                    <Text variant="titleMedium">Visualizzatore PDF</Text>
                    <IconButton icon="close" size={24} onPress={onDismiss} />
                </View>
                <Divider />

                <View style={styles.content}>{renderPdf()}</View>
                <Divider />
            </Modal>
        </Portal>
    );
}

const styles = StyleSheet.create({
    modal: {
        flex: 1,
        margin: 5,
        backgroundColor: "white",
        borderRadius: 12,
        overflow: "hidden",
    },
    header: {
        paddingHorizontal: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    content: {
        flex: 1,
    },
    iframe: {
        width: "100%",
        height: "100%",
    },
});
