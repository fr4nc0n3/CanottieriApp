-- Abilita i vincoli delle foreign key
PRAGMA foreign_keys = ON;

BEGIN TRANSACTION;

INSERT INTO AccountType (type) VALUES 
  ('admin'),
  ('atleta'),
  ('allenatore');

INSERT INTO User (name, birthday, last_sub_date, expiration_sub_date, phone, email, password_hash, email_verified)
VALUES
  ('Admin.App', '', '', '', '', '', 'scrypt:32768:8:1$tFSrqLzArVIfcZt9$de3f1b854a3e49c9fa966dd02a4f151b0af08feb8415647b0b2ea7ee609306abfbfc6850095db363fed017b355b1bd48ab964d74e462fbc1a5c9f033ffc3907e', 0),
  ('Alessandro.Sola', '', '', '', '', '', 'scrypt:32768:8:1$tFSrqLzArVIfcZt9$de3f1b854a3e49c9fa966dd02a4f151b0af08feb8415647b0b2ea7ee609306abfbfc6850095db363fed017b355b1bd48ab964d74e462fbc1a5c9f033ffc3907e', 0),
  ('Tommaso.Di.Lernia', '', '', '', '', '', 'scrypt:32768:8:1$tFSrqLzArVIfcZt9$de3f1b854a3e49c9fa966dd02a4f151b0af08feb8415647b0b2ea7ee609306abfbfc6850095db363fed017b355b1bd48ab964d74e462fbc1a5c9f033ffc3907e', 0),
  ('Francesco.Mariotti', '', '', '', '', '', 'scrypt:32768:8:1$tFSrqLzArVIfcZt9$de3f1b854a3e49c9fa966dd02a4f151b0af08feb8415647b0b2ea7ee609306abfbfc6850095db363fed017b355b1bd48ab964d74e462fbc1a5c9f033ffc3907e', 0);

-- Recupera gli ID AccountType
-- supponendo id: admin=1, atleta=2, allenatore=3

INSERT INTO UserAccountType (id_user, id_account_type) VALUES
  (1, 1), -- Admin.App: admin
  (2, 1), -- Alessandro Sola: admin
  (3, 2), -- Tommaso Di Lernia: atleta
  (4, 2); -- Francesco Mariotti: atleta

/*
INSERT INTO News (id_user_sender, message, title, data_publish, target_name)
VALUES
  (1, 'Benvenuti nel nuovo sistema di allenamento!', 'Sistema aggiornato', '2025-07-01', NULL),
  (2, 'Allenamento speciale questo venerdì!', 'Evento speciale', '2025-07-03', 'atleta'),
  (1, 'Ricordati di rinnovare l’abbonamento.', 'Abbonamento in scadenza', '2025-07-05', NULL);

-- Supponendo che gli ID News siano 1, 2, 3 e gli utenti 1-4

INSERT INTO UserNews (id_news, id_user) VALUES
  (1, 1), (1, 2), (1, 3), (1, 4),        -- Tutti ricevono la notizia 1
  (2, 3), (2, 4),                        -- Solo gli atleti ricevono la notizia 2
  (3, 3);                                -- Solo Gianni (abbonamento scaduto) riceve la notizia 3
*/

-- Workouts
/*INSERT INTO Workout (id_user, date, description)
VALUES
  (3, '2025-07-01', 'Corsa 5km e stretching'),
  (3, '2025-07-03', 'Palestra: pettorali e spalle'),
  (4, '2025-07-02', 'Yoga e mobilità articolare'),
  (4, '2025-07-05', 'HIIT + addominali');

INSERT INTO Workout (id_user, date, description) VALUES
  (3, '2024-07-05', 'Corsa su strada 10km'),
  (3, '2024-12-10', 'Palestra: dorso e gambe'),
  (3, '2025-01-20', 'Allenamento funzionale'),
  (3, '2025-06-15', 'Nuoto 45 minuti'),
  (3, '2025-07-07', 'HIIT full body');

INSERT INTO Workout (id_user, date, description) VALUES
  (4, '2024-08-02', 'Pilates + stretching'),
  (4, '2024-11-18', 'Cardio e core stability'),
  (4, '2025-02-05', 'Trekking leggero'),
  (4, '2025-05-12', 'Allenamento pesi'),
  (4, '2025-07-08', 'CrossFit base');*/

  INSERT INTO News (id_user_sender, message, title, data_publish, target_name)
  VALUES 
  (1, 'Benvenuti nel nuovo portale aziendale! Qui troverai tutte le novità interne.', 'Nuovo Portale Aziendale', '2025-10-01', 'Tutti'),
  (1, 'Da lunedì prossimo gli uffici resteranno chiusi per manutenzione straordinaria.', 'Chiusura Uffici per Manutenzione', '2025-10-05', 'Dipendenti'),
  (1, 'È disponibile la nuova policy aziendale per lo smart working.', 'Aggiornamento Policy Smart Working', '2025-10-10', 'Tutti'),
  (1, 'Sono aperte le iscrizioni al corso di formazione sulla sicurezza informatica.', 'Corso Sicurezza Informatica', '2025-10-15', 'Tutti'),
  (1, 'Il meeting trimestrale si terrà online tramite Microsoft Teams.', 'Meeting Trimestrale Online', '2025-10-20', 'Manager'),
  (1, 'Nuovi benefit per i dipendenti attivi da oltre 5 anni.', 'Nuovi Benefit Aziendali', '2025-10-25', 'Dipendenti'),
  (1, 'Aggiornamento dei sistemi informatici previsto per domenica prossima.', 'Aggiornamento Sistemi IT', '2025-10-27', 'IT Department'),
  (1, 'È stato pubblicato il calendario eventi aziendali del 2026.', 'Calendario Eventi 2026', '2025-10-30', 'Tutti');

  INSERT INTO UserNews (id_news, id_user, is_read)
  VALUES
  (1, 12, 0),
  (2, 12, 1),
  (3, 12, 0),
  (4, 12, 1),
  (5, 12, 0),
  (6, 12, 0),
  (7, 12, 1),
  (8, 12, 0);

COMMIT;