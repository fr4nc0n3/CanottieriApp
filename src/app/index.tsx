/* Licensed under the GNU General Public License v3. See LICENSE file for details. */

import { apiGetUserInfo } from "@/global/APICalls";
import { getJWT } from "@/global/jwtStorage";
import { decodeJWT } from "@/global/Utils";
import { Redirect } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Text } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";
import { alert } from "@/global/UniversalPopups";
import { UserContext } from "./UserContext/UserContext";

enum LoginStatus {
    loading,
    loggedIn,
    notLoggedIn,
}

export default function Index() {
    const userContext = useContext(UserContext);

    const [loginStatus, setLoginStatus] = useState<LoginStatus>(
        LoginStatus.loading,
    );

    const checkLogged = async () => {
        const jwt = await getJWT();
        if (!jwt) {
            setLoginStatus(LoginStatus.notLoggedIn);
            return;
        }

        const jwtBody = decodeJWT(jwt);
        console.log("jwt body", jwtBody);

        const identity = parseInt(jwtBody.sub);

        try {
            //TODO: fare controllo per vedere se jwt e' scaduto
            const user = await apiGetUserInfo(identity, jwt);
            setLoginStatus(LoginStatus.loggedIn);
        } catch (error) {
            setLoginStatus(LoginStatus.notLoggedIn);
        }
    };

    const askMediaLibraryPermission = async () => {
        if (Platform.OS !== "android") return;

        const permission =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permission.status !== "granted") {
            alert("Permesso negato per accedere alla galleria!");
            return;
        }
    };

    useEffect(() => {
        checkLogged();
        askMediaLibraryPermission();
    }, []);

    switch (loginStatus) {
        case LoginStatus.loading:
            return <Text>Caricamento ...</Text>;
        case LoginStatus.loggedIn:
            userContext?.syncUserInfo();
            return <Redirect href="/MenuPage" />;
        case LoginStatus.notLoggedIn:
            return <Redirect href="/LoginPage" />;
        default:
            return <Text>Stato login non valido</Text>;
    }
}
