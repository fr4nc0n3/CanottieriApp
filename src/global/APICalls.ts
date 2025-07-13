import {
    API_DELETE_NEWS,
    API_GET_USER_INFO,
    API_GET_USER_NEWS_RECEIVED,
    API_GET_USER_NEWS_SENDED,
    API_GET_USERS,
    API_LOGIN,
    API_SEND_NEWS_TO_GROUPS,
    API_WORKOUT,
} from "./Constants";
import {
    ApiInputCreateWorkout,
    ApiInputDeleteWorkout,
    ApiInputGetWorkout,
    ApiInputUpdateWorkout,
    ApiOutputCreateWorkout,
    NewsToSend,
    User,
    UserNewsRx,
    UserNewsTx,
} from "./Types";

export const apiGetUsers = async (jwt: string): Promise<User[]> => {
    try {
        const req = API_GET_USERS;
        return await apiFetchJWTAuth(jwt, req);
    } catch (error) {
        console.error(`Error fetch users:`, error);
        throw error;
    }
};

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

//TODO Da provare
//CRUD allenamento utente
export const apiCreateWorkout = async (
    workout: ApiInputCreateWorkout,
    jwt: string
) => {
    try {
        const req = API_WORKOUT;
        return await apiFetchJWTAuth(jwt, req, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(workout),
        });
    } catch (error) {
        console.error(
            `Error creating workout: ${JSON.stringify(workout)}`,
            error
        );
        throw error;
    }
};

export const apiGetWorkout = async (
    filter: ApiInputGetWorkout,
    jwt: string
): Promise<ApiOutputCreateWorkout> => {
    try {
        const req = `${API_WORKOUT}?id_user=${filter.id_user}&year=${filter.year}&month=${filter.month}`;
        return await apiFetchJWTAuth(jwt, req, { method: "GET" });
    } catch (error) {
        console.error(`Error fetch workout with filter: ${filter}`, error);
        throw error;
    }
};

export const apiUpdateWorkout = async (
    update: ApiInputUpdateWorkout,
    jwt: string
) => {
    try {
        const req = API_WORKOUT + "/" + update.id;
        return await apiFetchJWTAuth(jwt, req, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(update),
        });
    } catch (error) {
        console.error(
            `Error updating workout by update with: ${JSON.stringify(update)}`,
            error
        );
        throw error;
    }
};

export const apiDeleteWorkout = async (
    filter: ApiInputDeleteWorkout,
    jwt: string
) => {
    try {
        const req = API_WORKOUT + "/" + filter.id;
        return await apiFetchJWTAuth(jwt, req, {
            method: "DELETE",
        });
    } catch (error) {
        console.error(
            `Error deleting workout with filter: ${JSON.stringify(filter)}`,
            error
        );
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

        const res = await Promise.race([
            fetch(input, init),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error("fetch timeout")), 5000)
            ),
        ]);

        if (!(res instanceof Response)) {
            throw new Error("Error during fetch");
        }

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const json = await res.json();
        return json;
    } catch (error) {
        throw error;
    }
};
