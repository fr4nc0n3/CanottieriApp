PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
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
INSERT INTO User VALUES(1,'Mario Rossi','1985-07-12','2024-12-01','2025-12-01',1,'+39 345 1234567','mario.rossi@example.com','https://example.com/profiles/mario.jpg','2025-06-13 13:43:58','2025-06-13 13:43:58','hashed_password_1',1);
INSERT INTO User VALUES(2,'Luisa Bianchi','1992-03-05',NULL,NULL,0,NULL,'luisa.bianchi@example.com',NULL,'2025-06-13 13:43:58','2025-06-13 13:43:58','hashed_password_2',0);
CREATE TABLE AccountType (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);
INSERT INTO AccountType VALUES(1,'Free','2025-06-13 13:43:58','2025-06-13 13:43:58');
INSERT INTO AccountType VALUES(2,'Premium','2025-06-13 13:43:58','2025-06-13 13:43:58');
CREATE TABLE UserAccountType (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_user INTEGER NOT NULL,
    id_account_type INTEGER NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (id_user) REFERENCES User(id),
    FOREIGN KEY (id_account_type) REFERENCES AccountType(id)
);
INSERT INTO UserAccountType VALUES(1,1,2,'2025-06-13 13:43:58','2025-06-13 13:43:58');
INSERT INTO UserAccountType VALUES(2,2,1,'2025-06-13 13:43:58','2025-06-13 13:43:58');
CREATE TABLE News (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_user_recipient INTEGER DEFAULT NULL,
    id_user_sender INTEGER DEFAULT NULL,
    message TEXT NOT NULL,
    title TEXT NOT NULL,
    data_publish DATE NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    deleted_at DATETIME DEFAULT NULL,
    is_deleted INTEGER NOT NULL,
    FOREIGN KEY (id_user_recipient) REFERENCES User(id) ON DELETE SET NULL,
    FOREIGN KEY (id_user_sender) REFERENCES User(id) ON DELETE SET NULL
);
INSERT INTO News VALUES(1,1,2,'Benvenuto su piattaforma!','Saluti','2025-06-12','2025-06-13 13:52:37','2025-06-13 13:52:37',NULL,0);
INSERT INTO News VALUES(2,2,1,'La tua sottoscrizione è scaduta.','Avviso sottoscrizione','2025-06-10','2025-06-13 13:52:37','2025-06-13 13:52:37',NULL,0);
DELETE FROM sqlite_sequence;
INSERT INTO sqlite_sequence VALUES('User',2);
INSERT INTO sqlite_sequence VALUES('AccountType',2);
INSERT INTO sqlite_sequence VALUES('UserAccountType',2);
INSERT INTO sqlite_sequence VALUES('News',2);
COMMIT;
