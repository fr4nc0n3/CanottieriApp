//Licensed under the GNU General Public License v3. See LICENSE file for details.

import { useRouter } from "expo-router";
import * as React from "react";
import { StyleSheet, View } from "react-native";
import { Drawer } from "react-native-paper";

export default function MenuPage() {
    const router = useRouter();

    const [active, setActive] = React.useState("");

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Drawer.Section style={styles.sidebar}>
                    <Drawer.Item
                        label="Profilo"
                        active={active === "profile"}
                        onPress={() => {
                            setActive("profile");
                            router.push("/ProfilePage");
                        }}
                        icon="account"
                    />
                    <Drawer.Item
                        label="News"
                        active={active === "news"}
                        onPress={() => {
                            setActive("news");
                            router.push("/NewsPage");
                        }}
                        icon="bell"
                    />
                </Drawer.Section>

                <Drawer.Section style={styles.sidebar} title="Sezione Atleta">
                    <Drawer.Item
                        label="Registro allenamenti"
                        active={active === "workoutsRegister"}
                        onPress={() => {
                            setActive("workoutsRegister");
                            router.push("/WorkoutsRegisterPage");
                        }}
                        icon="calendar"
                    />
                </Drawer.Section>

                {/*Al momento non viene mostrato */}
                {false && (
                    <Drawer.Section
                        style={styles.sidebar}
                        title="Sezione Allenatore"
                    >
                        <Drawer.Item
                            label="Gestione allenamenti"
                            active={active === "manageTraining"}
                            onPress={() => {
                                setActive("manageTraining");
                                router.push("/ManageTrainingPage");
                            }}
                            icon="view-grid"
                        />
                    </Drawer.Section>
                )}

                {/*TODO abilitare guardando gli account types contenuti nel JWT */}
                <Drawer.Section
                    style={styles.sidebar}
                    title="Sezione amministratore"
                >
                    <Drawer.Item
                        label="Notifica utenti"
                        active={active === "notify"}
                        onPress={() => {
                            setActive("notify");
                            router.push("/NotifyPage");
                        }}
                        icon="view-grid"
                    />
                </Drawer.Section>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    sidebar: {
        width: "100%",
        paddingTop: 16,
    },
});
