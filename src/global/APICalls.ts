import {
    API_DELETE_NEWS,
    API_GET_USER_INFO,
    API_GET_USER_NEWS_RECEIVED,
    API_GET_USER_NEWS_SENDED,
    API_GET_USERS,
    API_GET_WORKOUT_COMMENTS,
    API_IMAGE,
    API_IMG_WORKOUT,
    API_LOGIN,
    API_PLANNINGS,
    API_SEND_NEWS_TO_GROUPS,
    API_WORKOUT,
    API_WORKOUT_COMMENT,
} from "./Constants";
import {
    ApiInputCreatePlanning,
    ApiInputCreateWorkout,
    ApiInputCreateWorkoutComment,
    ApiInputDeletePlanning,
    ApiInputDeleteWorkout,
    ApiInputGetPlannings,
    ApiInputGetWorkout,
    ApiInputGetWorkoutComment,
    ApiInputUpdatePlanning,
    ApiInputUpdateWorkout,
    ApiInputUpdateWorkoutComment,
    ApiOutputCreatePlanning,
    ApiOutputCreateWorkoutComment,
    ApiOutputGetPlannings,
    ApiOutputGetWorkout,
    ApiOutputGetWorkoutComment,
    ApiOutputWorkoutImage,
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

//CRUD allenamento utente
export const apiCreateWorkout = async (
    workout: ApiInputCreateWorkout,
    jwt: string
): Promise<{ id: number }> => {
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
): Promise<ApiOutputGetWorkout> => {
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

//CRUD Plannings
export const apiCreatePlanning = async (
    planning: ApiInputCreatePlanning,
    jwt: string
): Promise<ApiOutputCreatePlanning> => {
    try {
        const req = API_PLANNINGS;
        return await apiFetchJWTAuth(jwt, req, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(planning),
        });
    } catch (error) {
        console.error(
            `Error creating planning: ${JSON.stringify(planning)}`,
            error
        );
        throw error;
    }
};

export const apiGetPlannings = async (
    filter: ApiInputGetPlannings,
    jwt: string
): Promise<ApiOutputGetPlannings> => {
    try {
        const req = `${API_PLANNINGS}?year=${filter.year}&month=${filter.month}`;
        return await apiFetchJWTAuth(jwt, req, { method: "GET" });
    } catch (error) {
        console.error(`Error fetch plannings with filter: ${filter}`, error);
        throw error;
    }
};

export const apiUpdatePlanning = async (
    update: ApiInputUpdatePlanning,
    jwt: string
) => {
    try {
        const req = API_PLANNINGS + "/" + update.id;
        return await apiFetchJWTAuth(jwt, req, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(update),
        });
    } catch (error) {
        console.error(
            `Error updating planning by update with: ${JSON.stringify(update)}`,
            error
        );
        throw error;
    }
};

export const apiDeletePlanning = async (
    filter: ApiInputDeletePlanning,
    jwt: string
) => {
    try {
        const req = API_PLANNINGS + "/" + filter.id;
        return await apiFetchJWTAuth(jwt, req, {
            method: "DELETE",
        });
    } catch (error) {
        console.error(
            `Error deleting planning with filter: ${JSON.stringify(filter)}`,
            error
        );
        throw error;
    }
};

//CRUD Workout comment
export const apiCreateWorkoutComment = async (
    wkComment: ApiInputCreateWorkoutComment,
    jwt: string
): Promise<ApiOutputCreateWorkoutComment> => {
    try {
        const req = API_WORKOUT_COMMENT;
        return await apiFetchJWTAuth(jwt, req, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(wkComment),
        });
    } catch (error) {
        console.error(
            `Error creating workout comment: ${JSON.stringify(wkComment)}`,
            error
        );
        throw error;
    }
};

export const apiGetWorkoutComments = async (
    filter: ApiInputGetWorkoutComment,
    jwt: string
): Promise<ApiOutputGetWorkoutComment> => {
    try {
        const req = `${API_GET_WORKOUT_COMMENTS}/${filter.id_workout}`;
        return await apiFetchJWTAuth(jwt, req, { method: "GET" });
    } catch (error) {
        console.error(
            `Error fetching workout comments of workout id: ${filter.id_workout}`,
            error
        );
        throw error;
    }
};

export const apiUpdateWorkoutComment = async (
    update: ApiInputUpdateWorkoutComment,
    jwt: string
) => {
    try {
        const req = API_WORKOUT_COMMENT + "/" + update.id;
        return await apiFetchJWTAuth(jwt, req, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(update),
        });
    } catch (error) {
        console.error(
            `Error updating workout comment by update with: ${JSON.stringify(
                update
            )}`,
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

export const apiGetWorkoutImages = async (
    workoutId: number,
    jwt: string
): Promise<ApiOutputWorkoutImage[]> => {
    try {
        const images = await apiFetchJWTAuth(
            jwt,
            API_IMG_WORKOUT + "?id=" + workoutId
        );

        return images;
    } catch (error) {
        console.error(`Error get images for workout id: ${workoutId}`, error);
        throw error;
    }
};

//ritorna nome immagine appena creata
export const apiCreateWorkoutImage = async (
    workoutId: number,
    image: File,
    jwt: string
): Promise<string> => {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("id_workout", workoutId.toString());

    try {
        const res = await apiFetchJWTAuth(jwt, API_IMG_WORKOUT, {
            method: "POST",
            body: formData,
        });

        return res.img_name;
    } catch (error) {
        console.error(
            `Error creating image for workout id: ${workoutId}`,
            error
        );
        throw error;
    }
};

export const apiDeleteImage = async (jwt: string, imageName: string) => {
    try {
        return await apiFetchJWTAuth(jwt, API_IMG_WORKOUT + "/" + imageName, {
            method: "DELETE",
        });
    } catch (error) {
        console.error(`Error deleting image with name: ${imageName}`, error);
        throw error;
    }
};

//ritorna una stringa che puo' essere messa in campi uri
//in modo da caricare le immagini online
export const apiUriImage = (imageName: string) => {
    return `${API_IMAGE}/${imageName}`;
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
                setTimeout(() => reject(new Error("fetch timeout")), 20000)
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
