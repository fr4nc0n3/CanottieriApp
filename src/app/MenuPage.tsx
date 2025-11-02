//Licensed under the GNU General Public License v3. See LICENSE file for details.

import { apiGetCountUserNews } from "@/global/APICalls";
import { useQuery } from "@/global/hooks";
import { getJWT } from "@/global/jwtStorage";
import { getJWTAccountTypes, getJWTIdentity } from "@/global/Utils";
import { useFocusEffect, useRouter } from "expo-router";
import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Drawer, Text } from "react-native-paper";

export default function MenuPage() {
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    const [active, setActive] = React.useState("");

    const fetchIsAdmin = async () => {
        const jwt = await getJWT();
        const accountTypes = getJWTAccountTypes(jwt);

        setIsAdmin(accountTypes.some((type) => type === "admin"));
    };

    const [notReadCountNews, setNotReadCountNews] = useState(0);

    const fetchNotReadCountNews = async () => {
        const jwt = await getJWT();
        const idUser = getJWTIdentity(jwt);
        const count = await apiGetCountUserNews(idUser, true, jwt);

        setNotReadCountNews(count);
    };

    useFocusEffect(() => {
        fetchNotReadCountNews();
    });

    useEffect(() => {
        fetchIsAdmin();
    }, []);

    return (
        <View style={styles.container}>
            {notReadCountNews > 0 && (
                <View style={styles.notificationBannerContainer}>
                    <Text
                        style={styles.notificationBannerText}
                        variant="titleMedium"
                    >
                        !! ATTENZIONE !!
                        {"\n"}
                        Hai delle notifiche non lette, controlla la sezione.
                    </Text>
                </View>
            )}

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
                        label="Notifiche"
                        active={active === "notifications"}
                        onPress={() => {
                            setActive("notifications");
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

                    <Drawer.Item
                        label="Calendario allenamenti"
                        active={active === "trainingCalendar"}
                        onPress={() => {
                            setActive("trainingCalendar");
                            router.push("/TrainingCalendarPage");
                        }}
                        icon="dumbbell"
                    />
                </Drawer.Section>

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
                        {
                            <Drawer.Item
                                label="Programma allenamento"
                                active={active === "publishProgram"}
                                onPress={() => {
                                    setActive("publishProgram");
                                    router.push("/admin/PublishProgram");
                                }}
                                icon="upload"
                            />
                        }
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
    notificationBannerContainer: {
        margin: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    notificationBannerText: {
        borderRadius: 30,
        backgroundColor: "#FF8C00",
        paddingVertical: 10,
        paddingHorizontal: 10,
        color: "#2E2E2E",
        fontWeight: "bold",
        textAlign: "center",
    },
});
