/* Licensed under the GNU General Public License v3. See LICENSE file for details. */

import { apiGetUserInfo } from "@/global/APICalls";
import { getJWT } from "@/global/jwtStorage";
import { decodeJWT } from "@/global/Utils";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { Text } from "react-native-paper";

enum LoginStatus {
    loading,
    loggedIn,
    notLoggedIn,
}

export default function Index() {
    const [loginStatus, setLoginStatus] = useState<LoginStatus>(
        LoginStatus.loading
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
            const user = await apiGetUserInfo(identity, jwt);
            setLoginStatus(LoginStatus.loggedIn);
        } catch (error) {
            setLoginStatus(LoginStatus.notLoggedIn);
        }
    };

    useEffect(() => {
        checkLogged();
    }, []);

    switch (loginStatus) {
        case LoginStatus.loading:
            return <Text>Caricamento ...</Text>;
        case LoginStatus.loggedIn:
            return <Redirect href="/MenuPage" />;
        case LoginStatus.notLoggedIn:
            return <Redirect href="/LoginPage" />;
        default:
            return <Text>Stato login non valido</Text>;
    }
}
