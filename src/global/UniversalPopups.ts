import { Alert, Platform } from "react-native";

export const alert = (title: string, message?: string) => {
    switch (Platform.OS) {
        case "web":
            return window.alert(`${title}\n\n${message || ""}`);

        case "android":
        case "ios":
            return Alert.alert(title, message);
    }
};

export const confirm = (
    title: string,
    message?: string,
    onOKAction?: () => void
) => {
    switch (Platform.OS) {
        case "web":
            const c = window.confirm(`${title}\n\n${message || ""}`);
            if (c) {
                onOKAction?.();
            }
            break;
        case "android":
        case "ios":
            Alert.alert(
                title,
                message,
                [
                    {
                        text: "OK",
                        onPress: () => {
                            onOKAction?.();
                        },
                    },
                    { text: "Annulla", style: "cancel" },
                ],
                { cancelable: true }
            );
            break;
    }
};
