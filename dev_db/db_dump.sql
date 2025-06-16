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
INSERT INTO User VALUES(1,'Mario Rossi','1985-07-12','2024-12-01','2025-12-01',1,'+39 345 1234567','mario.rossi@example.com','https://example.com/profiles/mario.jpg','2025-06-15 13:42:02','2025-06-15 13:42:02','hashed_password_1',1);
INSERT INTO User VALUES(2,'Luisa Bianchi','1992-03-05',NULL,NULL,0,NULL,'luisa.bianchi@example.com',NULL,'2025-06-15 13:42:02','2025-06-15 13:42:02','hashed_password_2',0);
CREATE TABLE AccountType (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);
INSERT INTO AccountType VALUES(1,'atleta','2025-06-15 13:42:02','2025-06-15 13:42:02');
INSERT INTO AccountType VALUES(2,'staff','2025-06-15 13:42:02','2025-06-15 13:42:02');
CREATE TABLE UserAccountType (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_user INTEGER NOT NULL,
    id_account_type INTEGER NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (id_user) REFERENCES User(id),
    FOREIGN KEY (id_account_type) REFERENCES AccountType(id)
);
INSERT INTO UserAccountType VALUES(1,1,2,'2025-06-15 13:42:02','2025-06-15 13:42:02');
INSERT INTO UserAccountType VALUES(2,2,1,'2025-06-15 13:42:02','2025-06-15 13:42:02');
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
INSERT INTO News VALUES(1,2,'Benvenuto su piattaforma!','Saluti','2025-06-12','2025-06-15 13:42:02','2025-06-15 13:42:02',NULL,0,'user 1');
INSERT INTO News VALUES(2,1,'La tua sottoscrizione è scaduta.','Avviso sottoscrizione','2025-06-10','2025-06-15 13:42:02','2025-06-15 13:42:02',NULL,0,'user 2');
INSERT INTO News VALUES(3,1,'ciao','title','2025-06-15','2025-06-15 20:10:16','2025-06-15 20:10:16',NULL,0,'atleta');
INSERT INTO News VALUES(4,1,'ciao','title','2025-06-16','2025-06-16 19:12:16','2025-06-16 19:12:16',NULL,0,'all');
INSERT INTO News VALUES(5,1,'ciao','title','2025-06-16','2025-06-16 19:12:41','2025-06-16 19:12:41',NULL,0,'atleta');
CREATE TABLE UserNews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_news INTEGER NOT NULL,
    id_user INTEGER DEFAULT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (id_news) REFERENCES News(id),
    FOREIGN KEY (id_user) REFERENCES User(id) ON DELETE SET NULL
);
INSERT INTO UserNews VALUES(1,1,1,'2025-06-15 13:42:02');
INSERT INTO UserNews VALUES(2,4,1,'2025-06-16 19:12:16');
INSERT INTO UserNews VALUES(3,4,2,'2025-06-16 19:12:16');
INSERT INTO UserNews VALUES(4,5,2,'2025-06-16 19:12:41');
DELETE FROM sqlite_sequence;
INSERT INTO sqlite_sequence VALUES('User',2);
INSERT INTO sqlite_sequence VALUES('AccountType',2);
INSERT INTO sqlite_sequence VALUES('UserAccountType',2);
INSERT INTO sqlite_sequence VALUES('News',5);
INSERT INTO sqlite_sequence VALUES('UserNews',4);
COMMIT;
