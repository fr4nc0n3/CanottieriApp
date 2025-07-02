import {
    API_DELETE_NEWS,
    API_GET_USER_INFO,
    API_GET_USER_NEWS_RECEIVED,
    API_GET_USER_NEWS_SENDED,
    API_LOGIN,
    API_SEND_NEWS_TO_GROUPS,
} from "./Constants";
import { NewsToSend, User, UserNewsRx, UserNewsTx } from "./Types";

//TODO fare refactoring per standardizzarle (magari provare a mettere anche timeout per fetch con Promise race)
export const apiGetUserNewsSended = async (
    idUser: number,
    jwt: string
): Promise<UserNewsTx[]> => {
    try {
        const req = API_GET_USER_NEWS_SENDED + "?id-user=" + idUser;
        return await apiFetchJWTAuth(jwt, req);
    } catch (error) {
        console.error(`Error fetch tx news for idUser: ${idUser}`, error);
        throw error;
    }
};

export const apiDeleteNews = async (id: number, jwt: string) => {
    try {
        const req = API_DELETE_NEWS;
        return await apiFetchJWTAuth(jwt, req, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
    } catch (error) {
        console.error(`Error delete news with id: ${id}`, error);
        throw error;
    }
};

export const apiGetUserNewsReceived = async (
    idUser: number,
    jwt: string
): Promise<UserNewsRx[]> => {
    try {
        const req = API_GET_USER_NEWS_RECEIVED + "?id-user=" + idUser;
        return await apiFetchJWTAuth(jwt, req);
    } catch (error) {
        console.error(`Error fetch rx news for idUser: ${idUser}`, error);
        throw error;
    }
};

export const apiSendNewsToGroups = async (news: NewsToSend, jwt: string) => {
    try {
        const req = API_SEND_NEWS_TO_GROUPS;
        return await apiFetchJWTAuth(jwt, req, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(news),
        });
    } catch (error) {
        console.error(
            `Error sending news to groups: ${JSON.stringify(news)}`,
            error
        );
        throw error;
    }
};

export const apiGetUserInfo = async (
    idUser: number,
    jwt: string
): Promise<User> => {
    try {
        const req = API_GET_USER_INFO + "?id-user=" + idUser;
        return await apiFetchJWTAuth(jwt, req, { method: "GET" });
    } catch (error) {
        console.error(`Error fetch user with id: ${idUser}`, error);
        throw error;
    }
};

export const apiLogin = async (username: string, psw: string) => {
    try {
        const req = API_LOGIN;
        return await apiFetch(req, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password: psw }),
        });
    } catch (error) {
        console.error(`Error login for user: ${username}`, error);
        throw error;
    }
};

//fa una chiamata di fetch con il token salvato in precedenza
const apiFetchJWTAuth = async (
    jwt: string,
    input: RequestInfo,
    init?: RequestInit
) => {
    if (!init) {
        init = {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        };
    } else {
        init.headers = init.headers
            ? { ...init.headers, Authorization: `Bearer ${jwt}` }
            : { Authorization: `Bearer ${jwt}` };
    }

    return apiFetch(input, init);
};

const apiFetch = async (input: RequestInfo, init?: RequestInit) => {
    try {
        console.log("fetch: ", input);

        const res = await fetch(input, init);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const json = await res.json();
        return json;
    } catch (error) {
        throw error;
    }
};
