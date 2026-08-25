import { Divider, Modal, Portal, Text } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { COLORS } from "@/global/Colors";
import { HIGHLIGHT_TEXT_HELP } from "@/components/HighlightText";

type HelpModalProps = {
    visible: boolean;
    onDismiss: () => void;
};

export const HelpModal = ({ visible, onDismiss }: HelpModalProps) => {
    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={() => onDismiss()}
                contentContainerStyle={styles.modal}
            >
                <View>
                    <Text variant="titleMedium" style={{ marginBottom: 5 }}>
                        Help
                    </Text>
                    <Divider />
                    <Text style={{ fontSize: 16 }}>{HIGHLIGHT_TEXT_HELP}</Text>
                    <Divider style={{ marginVertical: 10 }} />
                    <Text>
                        {
                            "(NOTA: L' evidenziazione non e' mostrata nei pannelli di editing, ma solo nel calendario visibile a tutti)"
                        }
                    </Text>
                </View>
            </Modal>
        </Portal>
    );
};

const styles = StyleSheet.create({
    modal: {
        backgroundColor: COLORS.white100,
        padding: 20,
        margin: 20,
        borderRadius: 8,
    },
});
