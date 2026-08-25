import React from "react";
import { Text } from "react-native-paper";

type HighlightTextProps = {
    text: string;
};

export const HIGHLIGHT_REGEX = /(\*\*.*?\*\*)/gs;
export const HIGHLIGHT_TEXT_HELP = (
    <HighlightText
        text={
            "Per evidenziare il testo in giallo, racchiudere quest' ultimo tra doppi asterischi.\n" +
            "Esempio: ** Testo evidenziato in giallo **"
        }
    />
);

export function HighlightText({ text }: HighlightTextProps) {
    const parts = text.split(HIGHLIGHT_REGEX);

    return (
        <Text>
            {parts.map((part, index) => {
                const highlighted =
                    part.startsWith("**") && part.endsWith("**");

                if (highlighted) {
                    return (
                        <Text
                            key={index}
                            style={{
                                backgroundColor: "yellow",
                                fontWeight: "bold",
                            }}
                        >
                            {part}
                        </Text>
                    );
                }

                return part;
            })}
        </Text>
    );
}
