//Licensed under the GNU General Public License v3. See LICENSE file for details.

import * as React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

//TODO dati DB
const trainingText = `
Obiettivo: Resistenza aerobica e tecnica di voga

Sessione:

- Riscaldamento (15 min)
  - Vogata leggera a 18 colpi/minuto (SPM)
  - Mobilità spalle e fianchi
  - 3 allunghi da 10 colpi per attivare la potenza

- Allenamento Principale (40 min)
  - 4 x 8 minuti a 22 SPM, recupero 2 minuti tra le serie
  - Concentrarsi su:
    - Fase di aggancio efficace
    - Spinta controllata con le gambe
    - Coordinazione tra trazione e corpo

- Defaticamento (10 min)
  - Vogata molto leggera a 16 SPM
  - Stretching: zona lombare, posteriori delle cosce, spalle

Note Tecniche:
Mantenere la barca in assetto stabile, lavorare sulla simmetria del colpo e ridurre movimenti inutili durante il recupero.
`;

export default function TrainingDayPage() {
    return (
        <>
            <View style={styles.header}>
                <Text variant="titleLarge">Allenamento giornaliero</Text>
            </View>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <Text variant="bodyLarge" style={{ lineHeight: 24 }}>
                    {trainingText}
                </Text>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
});
