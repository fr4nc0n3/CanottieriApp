//----------- tipi ricevuti e da inviare all' API --------------

export type User = {
    birthday: string;
    created_at: string;
    email: string;
    email_verified: number;
    enable: number;
    expiration_sub_date: string;
    id: string;
    last_sub_date: string;
    name: string;
    //password_hash: string; //TODO il backend non deve inviarla
    phone: string;
    profile_img_url: string;
    updated_at: string;
};

export const emptyUser: User = {
    birthday: "",
    created_at: "",
    email: "",
    email_verified: 0,
    enable: 0,
    expiration_sub_date: "",
    id: "0",
    last_sub_date: "",
    name: "",
    phone: "",
    profile_img_url: "",
    updated_at: "",
};

export type UserNewsRx = {
    title: string;
    message: string;
    data_publish: string;
    target_name: string;
};

export const emptyUserNewsRx: UserNewsRx = {
    title: "",
    message: "",
    data_publish: "",
    target_name: "",
};

export type UserNewsTx = {
    id: number;
    id_user_sender: number;
    message: string;
    title: string;
    data_publish: string;
    created_at: string;
    updated_at: string;
    deleted_at: string;
    is_deleted: string;
    target_name: string;
};

export const emptyUserNewsTx: UserNewsTx = {
    id: 0,
    id_user_sender: 0,
    message: "",
    title: "",
    data_publish: "",
    created_at: "",
    updated_at: "",
    deleted_at: "",
    is_deleted: "",
    target_name: "",
};

export type NewsToSend = {
    groups: string[];
    "id-user": number;
    title: string;
    message: string;
};

export const emptyNewsToSend: NewsToSend = {
    groups: [],
    "id-user": 0,
    title: "",
    message: "",
};

// CRUD allenamento utente
export type Workout = {
    id: number;
    id_user: string;
    date: string;
    description: string;
    created_at: string;
    updated_at: string;
};

export type ApiInputCreateWorkout = {
    id_user: string;
    date: string;
    description: string;
};

export type ApiOutputCreateWorkout = Workout[];

export type ApiInputGetWorkout = {
    id_user: string;
    year: number;
    month: number;
};

export type ApiInputUpdateWorkout = {
    id: number;
    description: string;
};

export type ApiInputDeleteWorkout = {
    id: number;
};

export type ApiOutputWorkoutImage = {
    id: number;
    name: string;
    created_at: string;
};
