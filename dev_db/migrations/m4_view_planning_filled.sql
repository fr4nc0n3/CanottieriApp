CREATE VIEW PlanningFilled AS
SELECT 
    p.*,
    (pr.planning_id IS NOT NULL) AS is_race,
    (pt.planning_id IS NOT NULL) AS is_training,
    pt.intensity_percentage AS training_intensity_perc
FROM Planning p
LEFT JOIN PlanningRace pr ON pr.planning_id = p.id
LEFT JOIN PlanningTraining pt ON pt.planning_id = p.id;

INSERT INTO db_schema_version (version, description) 
VALUES 
('m4', 'Migrazione 4: Aggiunta vista per visualizzare tutte le caratteristiche di un planning');
