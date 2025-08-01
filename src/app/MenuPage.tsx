//Licensed under the GNU General Public License v3. See LICENSE file for details.

import { getJWT } from "@/global/jwtStorage";
import { getJWTAccountTypes } from "@/global/Utils";
import { useRouter } from "expo-router";
import * as React from "react";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Drawer } from "react-native-paper";

export default function MenuPage() {
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    const [active, setActive] = React.useState("");

    const fetchIsAdmin = async () => {
        const jwt = await getJWT();
        const accountTypes = getJWTAccountTypes(jwt);

        setIsAdmin(accountTypes.some((type) => type === "admin"));
    };

    useEffect(() => {
        fetchIsAdmin();
    }, []);

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
                    {
                        //disabilitato finche non a posto
                    }
                    {false && (
                        <Drawer.Item
                            label="Allenamento del giorno"
                            active={active === "trainingDay"}
                            onPress={() => {
                                setActive("trainingDay");
                                router.push("/TrainingDayPage");
                            }}
                            icon="dumbbell"
                        />
                    )}
                </Drawer.Section>

                {/*TODO abilitare guardando gli account types contenuti nel JWT */}

                {isAdmin && (
                    <Drawer.Section
                        style={styles.sidebar}
                        title="Sezione amministratore"
                    >
                        <Drawer.Item
                            label="Allenamenti atleti"
                            active={active === "athlete_workouts"}
                            onPress={() => {
                                setActive("athlete_workouts");
                                router.push("/admin/WorkoutsPanel");
                            }}
                            icon="view-grid"
                        />
                        {/*
                    disabilitato finche' non a posto 
                    */}
                        {false && (
                            <Drawer.Item
                                label="Programma di allenamento"
                                active={active === "publishProgram"}
                                onPress={() => {
                                    setActive("publishProgram");
                                    router.push("/admin/PublishProgram");
                                }}
                                icon="upload"
                            />
                        )}
                    </Drawer.Section>
                )}
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
