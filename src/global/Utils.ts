export const decodeJWT = (token: string) => {
    const base64Url = token.split(".")[1]; // Prendi la payload
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
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
