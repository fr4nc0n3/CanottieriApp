import {
    API_DELETE_NEWS,
    API_GET_USER_INFO,
    API_GET_USER_NEWS_RECEIVED,
    API_GET_USER_NEWS_SENDED,
    API_SEND_NEWS_TO_GROUPS,
} from "./Constants";
import { NewsToSend, User, UserNewsRx, UserNewsTx } from "./Types";

//TODO fare refactoring per standardizzarle (magari provare a mettere anche timeout per fetch con Promise race)
export const apiGetUserNewsSended = async (
    idUser: number
): Promise<UserNewsTx[]> => {
    try {
        const req = API_GET_USER_NEWS_SENDED + "?id-user=" + idUser;
        console.log("fetch: ", req);

        const res = await fetch(req);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const news = await res.json();
        return news;
    } catch (error) {
        console.error(`Error fetch tx news for idUser: ${idUser}`, error);
        throw error;
    }
};

export const apiDeleteNews = async (id: number) => {
    try {
        const req = API_DELETE_NEWS;
        console.log("fetch: ", req);

        const res = await fetch(req, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const jsonRes = await res.json();
        return jsonRes;
    } catch (error) {
        console.error(`Error delete news with id: ${id}`, error);
        throw error;
    }
};

export const apiGetUserNewsReceived = async (
    idUser: number
): Promise<UserNewsRx[]> => {
    try {
        const req = API_GET_USER_NEWS_RECEIVED + "?id-user=" + idUser;
        console.log("fetch: ", req);

        const res = await fetch(req);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const news = await res.json();
        return news;
    } catch (error) {
        console.error(`Error fetch rx news for idUser: ${idUser}`, error);
        throw error;
    }
};

export const apiSendNewsToGroups = async (news: NewsToSend) => {
    try {
        const req = API_SEND_NEWS_TO_GROUPS;
        console.log("fetch: ", req);

        const res = await fetch(req, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(news),
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const resJson = await res.json();
        return resJson;
    } catch (error) {
        console.error(
            `Error sending news to groups: ${JSON.stringify(news)}`,
            error
        );
        throw error;
    }
};

export const apiGetUserInfo = async (idUser: number): Promise<User> => {
    try {
        const req = API_GET_USER_INFO + "?id-user=" + idUser;
        console.log("fetch: ", req);

        const res = await fetch(req);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const user = await res.json();
        return user;
    } catch (error) {
        console.error(`Error fetch user with id: ${idUser}`, error);
        throw error;
    }
};
