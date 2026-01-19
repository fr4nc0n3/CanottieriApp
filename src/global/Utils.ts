export const decodeJWT = (token: string) => {
    const base64Url = token.split(".")[1]; // Prendi la payload
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join(""),
    );
    return JSON.parse(jsonPayload);
};

export const getJWTIdentity = (token: string) => {
    const jwt = decodeJWT(token);
    const identity = jwt.sub;

    return identity;
};

export const getJWTAccountTypes = (token: string): string[] => {
    const jwt = decodeJWT(token);
    const accountTypes = jwt.accountTypes;

    return accountTypes;
};

export const universalDateStringFormat = (date: Date) => {
    return date.toLocaleDateString();
};

//es. "2025-07-31" in UTC
export const apiGetDateStringFormat = (date: Date) => {
    return date.toISOString().split("T")[0];
};

export const sleep = (millis: number) => {
    return new Promise((resolve) => setTimeout(resolve, millis));
};

//il 29 febbraio risulta solo negli anni bisestili
export const isSameDayOfYear = (date: Date) => {
    const today = new Date();
    return (
        today.getMonth() === date.getMonth() &&
        today.getDate() === date.getDate()
    );
};

export const isValidDate = (date: Date) => {
    return !isNaN(date.getTime());
};

export enum FICAgeGroup {
    UNDER_10 = "Under 10",
    ALLIEVI_A = "Allievi A",
    ALLIEVI_B = "Allievi B",
    ALLIEVI_C = "Allievi C",
    CADETTI = "Cadetti",
    UNDER_17 = "Under 17",
    UNDER_19 = "Under 19",
    UNDER_23 = "Under 23",
    SENIOR = "Senior",
    MASTER_A = "Master A",
    MASTER_B = "Master B",
    MASTER_C = "Master C",
    MASTER_D = "Master D",
    MASTER_E = "Master E",
    MASTER_F = "Master F",
    MASTER_G = "Master G",
    MASTER_H = "Master H",
    MASTER_I = "Master I",
    MASTER_J = "Master J",
    MASTER_UNDER_43 = "Master under 43",
    MASTER_43_54 = "Master 43-54",
    MASTER_55_64 = "Master 55-64",
    MASTER_OVER_64 = "Master over 64",
}

export type AthleteFICClassification = {
    first: FICAgeGroup | null;
    secondary: FICAgeGroup | null;
    absolute: FICAgeGroup | null;
};

// Tabella categoria specifica per fascia di eta'
const FIC_AGE_RANGES: { min: number; max: number; group: FICAgeGroup }[] = [
    // Giovanili
    { min: 0, max: 9, group: FICAgeGroup.UNDER_10 },
    { min: 10, max: 10, group: FICAgeGroup.ALLIEVI_A },
    { min: 11, max: 11, group: FICAgeGroup.ALLIEVI_B },
    { min: 12, max: 12, group: FICAgeGroup.ALLIEVI_C },
    { min: 13, max: 14, group: FICAgeGroup.CADETTI },
    { min: 15, max: 16, group: FICAgeGroup.UNDER_17 },
    { min: 17, max: 18, group: FICAgeGroup.UNDER_19 },
    { min: 19, max: 22, group: FICAgeGroup.UNDER_23 },

    // Master
    { min: 27, max: 35, group: FICAgeGroup.MASTER_A },
    { min: 36, max: 42, group: FICAgeGroup.MASTER_B },
    { min: 43, max: 49, group: FICAgeGroup.MASTER_C },
    { min: 50, max: 54, group: FICAgeGroup.MASTER_D },
    { min: 55, max: 59, group: FICAgeGroup.MASTER_E },
    { min: 60, max: 64, group: FICAgeGroup.MASTER_F },
    { min: 65, max: 69, group: FICAgeGroup.MASTER_G },
    { min: 70, max: 74, group: FICAgeGroup.MASTER_H },
    { min: 75, max: 79, group: FICAgeGroup.MASTER_I },
    { min: 80, max: Infinity, group: FICAgeGroup.MASTER_J },
];

// Mappa per la seconda classificazione Master
const FIC_MASTER_SECOND_CLASSIFICATION: { [key in FICAgeGroup]?: FICAgeGroup } =
    {
        [FICAgeGroup.MASTER_A]: FICAgeGroup.MASTER_UNDER_43,
        [FICAgeGroup.MASTER_B]: FICAgeGroup.MASTER_UNDER_43,
        [FICAgeGroup.MASTER_C]: FICAgeGroup.MASTER_43_54,
        [FICAgeGroup.MASTER_D]: FICAgeGroup.MASTER_43_54,
        [FICAgeGroup.MASTER_E]: FICAgeGroup.MASTER_55_64,
        [FICAgeGroup.MASTER_F]: FICAgeGroup.MASTER_55_64,
        [FICAgeGroup.MASTER_G]: FICAgeGroup.MASTER_OVER_64,
        [FICAgeGroup.MASTER_H]: FICAgeGroup.MASTER_OVER_64,
        [FICAgeGroup.MASTER_I]: FICAgeGroup.MASTER_OVER_64,
        [FICAgeGroup.MASTER_J]: FICAgeGroup.MASTER_OVER_64,
    };

const getFICAbsoluteCategory = (age: number): FICAgeGroup | null => {
    return age >= 19 ? FICAgeGroup.SENIOR : null;
};

export const birthdayToFICClassification = (
    birthday: Date,
): AthleteFICClassification => {
    const age = birthdayToSolarYearAge(birthday);

    const range = FIC_AGE_RANGES.find((r) => age >= r.min && age <= r.max);

    const first = range ? range.group : null;

    // Solo se è Master, calcoliamo la secondary
    let secondary = null;
    if (first) {
        secondary = FIC_MASTER_SECOND_CLASSIFICATION[first] || null;
    }

    // Categoria assoluta
    const absolute = getFICAbsoluteCategory(age);

    return { first, secondary, absolute };
};

export enum FICSFAgeGroup {
    ESORDIENTI_M_F = "Esordienti M/F",
    ALLIEVI_M_F = "Allievi M/F",
    CADETTI_M_F = "Cadetti M/F",
    RAGAZZI_M_F = "Ragazzi M/F",
    JUNIORES_M_F = "Juniores M/F",
    SENIORES_M_F = "Seniores M/F",
    MASTER_M_F = "Master M/F",
}

export type AthleteFICSFClassification = {
    first: FICSFAgeGroup | null;
    absolute: FICSFAgeGroup | null;
};

// Tabella categoria specifica per fascia di eta'
const FICSF_AGE_RANGES: { min: number; max: number; group: FICSFAgeGroup }[] = [
    { min: 9, max: 11, group: FICSFAgeGroup.ESORDIENTI_M_F },
    { min: 12, max: 13, group: FICSFAgeGroup.ALLIEVI_M_F },
    { min: 14, max: 15, group: FICSFAgeGroup.CADETTI_M_F },
    { min: 16, max: 17, group: FICSFAgeGroup.RAGAZZI_M_F },
    { min: 18, max: 20, group: FICSFAgeGroup.JUNIORES_M_F },
    { min: 40, max: Infinity, group: FICSFAgeGroup.MASTER_M_F },
];

const getFICSFAbsoluteCategory = (age: number): FICSFAgeGroup | null => {
    return age >= 21 ? FICSFAgeGroup.SENIORES_M_F : null;
};

export const birthdayToFICSFClassification = (
    birthday: Date,
): AthleteFICSFClassification => {
    const age = birthdayToSolarYearAge(birthday);

    const range = FICSF_AGE_RANGES.find((r) => age >= r.min && age <= r.max);

    const first = range ? range.group : null;

    // Categoria assoluta
    const absolute = getFICSFAbsoluteCategory(age);

    return { first, absolute };
};

//ritorna l' eta' in base a quanti anni si compiono nell' anno attuale
export const birthdayToSolarYearAge = (birthday: Date) => {
    const today = new Date();

    return today.getFullYear() - birthday.getFullYear();
};
