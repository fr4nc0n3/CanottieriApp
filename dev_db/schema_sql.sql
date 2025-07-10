BEGIN TRANSACTION;

-- Table: User
CREATE TABLE User (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    birthday DATE DEFAULT NULL,
    last_sub_date DATE DEFAULT NULL,
    expiration_sub_date DATE DEFAULT NULL,
    enable INTEGER NOT NULL DEFAULT 1,
    phone TEXT DEFAULT NULL,
    email TEXT DEFAULT NULL,
    profile_img_url TEXT DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    password_hash TEXT NOT NULL,
    email_verified INTEGER NOT NULL DEFAULT 0
);

CREATE TRIGGER trg_User_updated_at
AFTER UPDATE ON User
FOR EACH ROW
BEGIN  
    UPDATE User
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = OLD.id;
END;

-- Table: AccountType
CREATE TABLE AccountType (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL UNIQUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_AccountType_updated_at
AFTER UPDATE ON AccountType
FOR EACH ROW
BEGIN  
    UPDATE AccountType
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = OLD.id;
END;

-- Table: UserAccountType
CREATE TABLE UserAccountType (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_user INTEGER NOT NULL,
    id_account_type INTEGER NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (id_account_type) REFERENCES AccountType(id),
    UNIQUE (id_user, id_account_type)
);

CREATE TRIGGER trg_UserAccountType_updated_at
AFTER UPDATE ON UserAccountType
FOR EACH ROW
BEGIN  
    UPDATE UserAccountType
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = OLD.id;
END;

-- Table: News
CREATE TABLE News (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_user_sender INTEGER,
    message TEXT NOT NULL,
    title TEXT NOT NULL,
    data_publish DATE NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME DEFAULT NULL,
    is_deleted INTEGER NOT NULL DEFAULT 0,
    target_name TEXT DEFAULT NULL,
    FOREIGN KEY (id_user_sender) REFERENCES User(id) ON DELETE CASCADE
);

CREATE TRIGGER trg_News_updated_at
AFTER UPDATE ON News
FOR EACH ROW
BEGIN  
    UPDATE News
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = OLD.id;
END;

-- Table: UserNews
CREATE TABLE UserNews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_news INTEGER NOT NULL,
    id_user INTEGER NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_news) REFERENCES News(id) ON DELETE CASCADE,
    FOREIGN KEY (id_user) REFERENCES User(id) ON DELETE CASCADE,
    UNIQUE (id_news, id_user)
);

CREATE TRIGGER trg_UserNews_updated_at
AFTER UPDATE ON UserNews
FOR EACH ROW
BEGIN  
    UPDATE UserNews
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = OLD.id;
END;

-- Table: Workout
CREATE TABLE Workout (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_user INTEGER NOT NULL,
    date DATE NOT NULL,
    description TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES User(id) ON DELETE CASCADE,
    UNIQUE (id_user, date)    
);

CREATE TRIGGER trg_Workout_updated_at
AFTER UPDATE ON Workout
FOR EACH ROW
BEGIN  
    UPDATE Workout
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = OLD.id;
END;

COMMIT;