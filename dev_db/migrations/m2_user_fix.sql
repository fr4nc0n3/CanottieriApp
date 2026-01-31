-- CORREZIONI DATE TABELLA User
UPDATE User
SET birthday = NULL
WHERE birthday = '';

UPDATE User
SET last_sub_date = NULL
WHERE last_sub_date = '';

UPDATE User
SET expiration_sub_date = NULL
WHERE expiration_sub_date = '';

INSERT INTO db_schema_version (version, description) 
VALUES 
('m2', 'Migrazione 2: Correzioni tabella User -> birthday, last_sub_date, expiration_sub_date impostate a NULL dove sono stringhe vuote');