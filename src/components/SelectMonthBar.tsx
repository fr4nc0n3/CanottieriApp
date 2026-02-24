import { View, StyleSheet } from "react-native";
import { Text, IconButton } from "react-native-paper";

interface SelectMonthBarProps {
    onChangeMonth: (event: "next" | "back") => void;
    middleTitle: string;
}

export default function SelectMonthBar({
    onChangeMonth,
    middleTitle,
}: SelectMonthBarProps) {
    return (
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
            <IconButton
                icon="arrow-left"
                onPress={() => onChangeMonth("back")}
            />
            <Text variant="titleLarge" style={style.header}>
                {middleTitle}
            </Text>
            <IconButton
                icon="arrow-right"
                onPress={() => onChangeMonth("next")}
            />
        </View>
    );
}

const style = StyleSheet.create({
    header: {
        padding: 8,
        textAlign: "center",
    },
});
