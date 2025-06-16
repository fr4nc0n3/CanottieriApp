-- Table: User
CREATE TABLE User (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    birthday DATE DEFAULT NULL,
    last_sub_date DATE DEFAULT NULL,
    expiration_sub_date DATE DEFAULT NULL,
    enable INTEGER NOT NULL DEFAULT 1,
    phone TEXT DEFAULT NULL,
    email TEXT DEFAULT NULL,
    profile_img_url TEXT DEFAULT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    password_hash TEXT NOT NULL,
    email_verified INTEGER NOT NULL DEFAULT 0
);

-- Table: AccountType
CREATE TABLE AccountType (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);

-- Table: UserAccountType
CREATE TABLE UserAccountType (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_user INTEGER NOT NULL,
    id_account_type INTEGER NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (id_user) REFERENCES User(id),
    FOREIGN KEY (id_account_type) REFERENCES AccountType(id)
);

-- Table: News
CREATE TABLE News (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_user_sender INTEGER DEFAULT NULL,
    message TEXT NOT NULL,
    title TEXT NOT NULL,
    data_publish DATE NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    deleted_at DATETIME DEFAULT NULL,
    is_deleted INTEGER NOT NULL,
    target_name TEXT DEFAULT NULL,
    FOREIGN KEY (id_user_sender) REFERENCES User(id) ON DELETE SET NULL
);

-- Table: UserNews
CREATE TABLE UserNews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_news INTEGER NOT NULL,
    id_user INTEGER DEFAULT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (id_news) REFERENCES News(id),
    FOREIGN KEY (id_user) REFERENCES User(id) ON DELETE SET NULL
)

