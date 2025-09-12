import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { Modal, Portal, Card, TextInput, Button } from "react-native-paper";

type TextModalProps = {
    visible: boolean;
    title: string;
    text: string;
    onDismiss: () => void;
};

const TextModal: React.FC<TextModalProps> = ({
    visible,
    title,
    text = "",
    onDismiss,
}) => {
    return (
        <Portal>
            <Modal visible={visible} onDismiss={onDismiss}>
                <Card style={styles.card}>
                    <Card.Title title={title} />
                    <Card.Content>
                        <TextInput
                            mode="outlined"
                            multiline
                            numberOfLines={13}
                            value={text}
                            style={styles.textArea}
                        />
                    </Card.Content>
                    <Card.Actions style={{ justifyContent: "center" }}>
                        <Button onPress={onDismiss}>Chiudi</Button>
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
    textArea: {
        minHeight: 150,
        marginTop: 10,
    },
});

export default TextModal;
