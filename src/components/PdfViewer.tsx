import { Platform, View, StyleSheet } from "react-native";
import { Portal, Modal, IconButton, Text, Divider } from "react-native-paper";
import { useState } from "react";

type PdfViewerModalProps = {
    pdfUrl: string | null;
    visible: boolean;
    onDismiss: () => void;
};

type PdfLoaderProps = {
    pdfUrl: string;
};

const PdfLoader = ({ pdfUrl }: PdfLoaderProps) => {
    const [loading, setLoading] = useState<boolean>(true);

    return (
        <View
            style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            {loading && <Text variant="titleLarge">Caricamento di PDF...</Text>}
            <iframe
                src={pdfUrl}
                style={styles.iframe}
                onLoad={() => setLoading(false)}
            />
        </View>
    );
};

export default function PdfViewerModal({
    pdfUrl,
    visible,
    onDismiss,
}: PdfViewerModalProps) {
    const renderPdf = () => {
        if (Platform.OS === "web") {
            return pdfUrl ? (
                <PdfLoader pdfUrl={pdfUrl} />
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

    const downloadPdf = () => {
        if (!pdfUrl) return;
        if (Platform.OS !== "web") {
            console.warn("Download non supportato su questa piattaforma");
            return;
        }

        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = "";
        link.click();
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
                    <View style={{ flexDirection: "row", marginHorizontal: 5 }}>
                        <IconButton
                            icon="download"
                            size={24}
                            onPress={downloadPdf}
                        />
                        <IconButton
                            icon="close"
                            size={24}
                            onPress={onDismiss}
                        />
                    </View>
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
