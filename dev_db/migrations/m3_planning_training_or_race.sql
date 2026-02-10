-- indica che un certo planning e' una gara
CREATE TABLE PlanningRace (
    planning_id INTEGER PRIMARY KEY,
    FOREIGN KEY (planning_id) REFERENCES Planning(id) ON DELETE CASCADE
);

-- indica che un certo planning e' un allenamento
-- con una certa percentuale di intensita'
CREATE TABLE PlanningTraining (
    planning_id INTEGER PRIMARY KEY,
    intensity_percentage INTEGER NOT NULL CHECK (intensity_percentage BETWEEN 0 AND 100),
    FOREIGN KEY (planning_id) REFERENCES Planning(id) ON DELETE CASCADE
);

INSERT INTO db_schema_version (version, description) 
VALUES 
('m3', 'Migrazione 3: Aggiunte tabelle PlanningRace e PlanningTraining in modo da capire se un giorno del planning e'' un allenamento oppure una gara');

