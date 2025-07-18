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
