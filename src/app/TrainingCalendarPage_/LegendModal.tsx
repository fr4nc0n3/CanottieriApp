import { Divider, Modal, Portal, Text } from "react-native-paper";
import {
    LegendIntensityTrainingRow,
    LegendNothing,
    LegendRace,
} from "./Legend";
import { StyleSheet, View } from "react-native";
import { COLORS } from "@/global/Colors";

type LegendModalProps = {
    visible: boolean;
    onDismiss: () => void;
};

export const LegendModal = ({ visible, onDismiss }: LegendModalProps) => {
    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={() => onDismiss()}
                contentContainerStyle={styles.modal}
            >
                <View>
                    <Text variant="titleMedium" style={{ marginBottom: 5 }}>
                        Legenda
                    </Text>
                    <Divider />
                    <LegendRace />
                    <LegendNothing />
                    <Divider />
                    <LegendIntensityTrainingRow intensityPercentage={25} />
                    <LegendIntensityTrainingRow intensityPercentage={50} />
                    <LegendIntensityTrainingRow intensityPercentage={75} />
                    <LegendIntensityTrainingRow intensityPercentage={100} />
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
