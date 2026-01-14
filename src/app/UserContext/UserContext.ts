// UserContext.js
import {
    AthleteFICClassification,
    AthleteFICSFClassification,
} from "@/global/Utils";
import { createContext } from "react";

export type UserInfo = {
    name: string;
    birthday: Date;
    accountTypes: string[];
    FICClassification: AthleteFICClassification;
    FICSFClassification: AthleteFICSFClassification;
};

export interface UserInfoContext {
    userInfo: UserInfo | null;
    syncUserInfo: () => void;
}

export const UserContext = createContext<UserInfoContext | null>(null);
