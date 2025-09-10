import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { Modal, Portal, Card, TextInput, Button } from "react-native-paper";

type EditTextModalProps = {
    visible: boolean;
    title: string;
    initialText: string;
    onDismiss: () => void;
    onConfirm: (text: string) => void;
};

const EditTextModal: React.FC<EditTextModalProps> = ({
    visible,
    title,
    initialText,
    onDismiss,
    onConfirm,
}) => {
    const [text, setText] = useState<string>(initialText);

    //lascio visible tra le dipendenze siccome, voglio che ogni
    //volta che il modale si mostra, questo mostri il testo iniziale e non l' ultimo
    //rimasto in memoria in text
    useEffect(() => {
        setText(initialText);
    }, [initialText, visible]);

    return (
        <Portal>
            <Modal visible={visible} onDismiss={() => {}} dismissable={false}>
                <Card style={styles.card}>
                    <Card.Title title={title} />
                    <Card.Content>
                        <TextInput
                            mode="outlined"
                            multiline
                            numberOfLines={13}
                            value={text}
                            onChangeText={setText}
                            style={styles.input}
                        />
                    </Card.Content>
                    <Card.Actions style={styles.actions}>
                        <Button onPress={onDismiss}>Chiudi</Button>
                        <Button onPress={() => onConfirm(text)}>
                            Conferma
                        </Button>
                    </Card.Actions>
                </Card>
            </Modal>
        </Portal>
    );
};

const styles = StyleSheet.create({
    card: {
        margin: 20,
        flex: 1,
        justifyContent: "space-between",
    },
    input: {
        minHeight: 150,
        marginTop: 10,
    },
    actions: {
        justifyContent: "flex-end",
        marginTop: 20,
    },
});

export default EditTextModal;
