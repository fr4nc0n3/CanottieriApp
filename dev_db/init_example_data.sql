-- Abilita i vincoli delle foreign key
PRAGMA foreign_keys = ON;

-- Esempio per la tabella User
INSERT INTO User (
    name, birthday, last_sub_date, expiration_sub_date,
    enable, phone, email, profile_img_url,
    created_at, updated_at, password_hash, email_verified
) VALUES
(
    'Mario Rossi',
    '1985-07-12',
    '2024-12-01',
    '2025-12-01',
    1,
    '+39 345 1234567',
    'mario.rossi@example.com',
    'https://example.com/profiles/mario.jpg',
    datetime('now'), datetime('now'),
    'hashed_password_1',
    1
),
(
    'Luisa Bianchi',
    '1992-03-05',
    NULL,
    NULL,
    0,
    NULL,
    'luisa.bianchi@example.com',
    NULL,
    datetime('now'), datetime('now'),
    'hashed_password_2',
    0
);

-- Esempio per AccountType
INSERT INTO AccountType (
    type, created_at, updated_at
) VALUES
(
    'atleta',
    datetime('now'), datetime('now')
),
(
    'staff',
    datetime('now'), datetime('now')
);

-- Esempio per UserAccountType
INSERT INTO UserAccountType (
    id_user, id_account_type, created_at, updated_at
) VALUES
(
    1, 2,
    datetime('now'), datetime('now')
),
(
    2, 1,
    datetime('now'), datetime('now')
);

-- Esempio per News
INSERT INTO News (
    id_user_sender,
    message, title, data_publish,
    created_at, updated_at, deleted_at, is_deleted,
    target_name
) VALUES
(
    2,
    'Benvenuto su piattaforma!',
    'Saluti',
    date('2025-06-12'),
    datetime('now'), datetime('now'),
    NULL, 0, 'user 1'
),
(
    1,
    'La tua sottoscrizione è scaduta.',
    'Avviso sottoscrizione',
    date('2025-06-10'),
    datetime('now'), datetime('now'),
    NULL, 0, 'user 2' 
);

-- Esempio per UserNews
INSERT INTO UserNews (
    id_news, id_user, created_at
) VALUES (
    1,
    1,
    datetime('now')
)

