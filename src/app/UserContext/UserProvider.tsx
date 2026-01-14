import { ReactNode, useState } from "react";
import { UserContext, UserInfo } from "./UserContext";
import { apiGetUserInfo } from "@/global/APICalls";
import {
    birthdayToFICClassification,
    birthdayToFICSFClassification,
    decodeJWT,
    getJWTAccountTypes,
} from "@/global/Utils";
import { getJWT } from "@/global/jwtStorage";
import { alert } from "@/global/UniversalPopups";

interface UserInfoProviderProps {
    children: ReactNode;
}

export function UserInfoProvider({ children }: UserInfoProviderProps) {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

    const syncUserInfo = async () => {
        const jwt = await getJWT();
        if (!jwt) {
            console.error("jwt not exists");
            return;
        }

        const jwtBody = decodeJWT(jwt);

        const identity = parseInt(jwtBody.sub);

        try {
            const user = await apiGetUserInfo(identity, jwt);

            const birthdayDate = new Date(user.birthday);
            setUserInfo({
                name: user.name,
                birthday: birthdayDate,
                accountTypes: getJWTAccountTypes(jwt),
                FICClassification: birthdayToFICClassification(birthdayDate),
                FICSFClassification:
                    birthdayToFICSFClassification(birthdayDate),
            });
        } catch (error) {
            alert(
                "Info utente non caricate",
                "Non e' stato possibile reperire le informazioni dell' utente"
            );
        }
    };

    return (
        <UserContext.Provider value={{ userInfo, syncUserInfo }}>
            {children}
        </UserContext.Provider>
    );
}
