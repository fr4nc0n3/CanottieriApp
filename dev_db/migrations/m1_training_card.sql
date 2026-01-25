-- tables
CREATE TABLE MimeType (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mime_type TEXT NOT NULL UNIQUE
);

CREATE TABLE File (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    file_name TEXT NOT NULL UNIQUE,
    id_mime_type INTEGER NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_mime_type) REFERENCES MimeType(id)
);

CREATE TABLE TrainingCard (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_file INTEGER NOT NULL UNIQUE,
    name_card TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL DEFAULT '',
    deleted_at DATETIME NULL DEFAULT NULL,

    FOREIGN KEY (id_file) REFERENCES File(id)
);

CREATE TABLE db_schema_version (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    version TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    installed_on DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- data
INSERT INTO MimeType (mime_type) VALUES ('application/pdf');

INSERT INTO db_schema_version (version, description) 
VALUES ('m1', 'Migrazione 1: Creazione tabelle -> TrainingCard, File, MimeType, db_schema_version');

