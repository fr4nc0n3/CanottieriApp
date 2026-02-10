BEGIN TRANSACTION;

ALTER TABLE PlanningTraining RENAME TO PlanningTraining_old;

CREATE TABLE PlanningTraining (
    planning_id INTEGER PRIMARY KEY,
    intensity_percentage INTEGER CHECK (intensity_percentage BETWEEN 0 AND 100),
    FOREIGN KEY (planning_id) REFERENCES Planning(id) ON DELETE CASCADE
);

INSERT INTO PlanningTraining (planning_id, intensity_percentage)
SELECT planning_id, intensity_percentage
FROM PlanningTraining_old;

DROP TABLE PlanningTraining_old;

INSERT INTO PlanningTraining (planning_id)
SELECT id
FROM Planning;

INSERT INTO db_schema_version (version, description) 
VALUES 
('m5', 'Migrazione 5: Il campo intensity_percentage di PlanningTraining puo'' essere ora nullable, inoltre
tutti i plannings gia'' esistenti sono compilati come allenamenti');

COMMIT;