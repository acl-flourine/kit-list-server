CREATE TABLE IF NOT EXISTS items (item_id SERIAL PRIMARY KEY, listType VARCHAR(55), item VARCHAR (255),amount VARCHAR (55));

CREATE TABLE IF NOT EXISTS users (user_id SERIAL PRIMARY KEY, household INTEGER, heat BOOLEAN, snow BOOLEAN, infant BOOLEAN, child BOOLEAN, meds BOOLEAN, pets BOOLEAN, numberdays INTEGER);




INSERT INTO items (listType, item, amount) VALUES ('base', 'flashlight', 'per-person');
INSERT INTO items (listType, item, amount) VALUES ('base', 'food', 'per-person');
INSERT INTO items (listType, item, amount) VALUES ('base', 'water', 'per-day');
INSERT INTO items (listType, item, amount) VALUES ('base', 'batteries', 'per-person');
INSERT INTO items (listType, item, amount) VALUES ('base', 'radio', 'per-houshold');
INSERT INTO items (listType, item, amount) VALUES ('base', 'first aid kit', 'per-person');
INSERT INTO items (listType, item, amount) VALUES ('base', 'personal hygiene', 'per-person');
INSERT INTO items (listType, item, amount) VALUES ('base', 'multi tool', 'per-person');
INSERT INTO items (listType, item, amount) VALUES ('base', 'medication', 'per-person');
INSERT INTO items (listType, item, amount) VALUES ('base', 'cell phone charger', 'per-person');
INSERT INTO items (listType, item, amount) VALUES ('base', 'personal documents', 'per-person');
INSERT INTO items (listType, item, amount) VALUES ('base', 'cash', 'per-person');
INSERT INTO items (listType, item, amount) VALUES ('base', 'emergency blankets', 'per-person');
INSERT INTO items (listType, item, amount) VALUES ('base', 'insect repellent', 'per-person');
INSERT INTO items (listType, item, amount) VALUES ('base', 'whistle', 'per-person');
INSERT INTO items (listType, item, amount) VALUES ('base', 'matches or lighter', 'per-person');
INSERT INTO items (listType, item, amount) VALUES ('base', 'propane stove', 'per-houshold');
INSERT INTO items (listType, item, amount) VALUES ('base', 'extra propane', 'per-household');
INSERT INTO items (listType, item, amount) VALUES ('heat', 'light loose clothing', 'per-person');
INSERT INTO items (listType, item, amount) VALUES ('heat', 'light meals', 'per-person');
INSERT INTO items (listType, item, amount) VALUES ('heat', 'extra water', 'per-person');
INSERT INTO items (listType, item, amount) VALUES ('heat', 'hat', 'per-person');
INSERT INTO items (listType, item, amount) VALUES ('cold', 'shovel', 'per-household');
INSERT INTO items (listType, item, amount) VALUES ('cold', 'gloves', 'per-person');
INSERT INTO items (listType, item, amount) VALUES ('cold', 'thermal underwear', 'per-person');
INSERT INTO items (listType, item, amount) VALUES ('cold', 'extra layers', 'per-person');
INSERT INTO items (listType, item, amount) VALUES ('pets', 'pet food', 'per-household');
INSERT INTO items (listType, item, amount) VALUES ('pets', 'pet water', 'per-household');
INSERT INTO items (listType, item, amount) VALUES ('pets', 'poop bags', 'per-household');
INSERT INTO items (listType, item, amount) VALUES ('pets', 'extra collar', 'per-household');
INSERT INTO items (listType, item, amount) VALUES ('pets', 'extra leash', 'per-household');
INSERT INTO items (listType, item, amount) VALUES ('pets', 'extra crate or carrier for pet', 'per-household');
INSERT INTO items (listType, item, amount) VALUES ('pets', 'pet supplies', 'per-household');
INSERT INTO items (listType, item, amount) VALUES ('infant', 'formula', 'per-person');
INSERT INTO items (listType, item, amount) VALUES ('infant', 'diapers', 'per-person');
INSERT INTO items (listType, item, amount) VALUES ('infant', 'baby wipes', 'per-person');
INSERT INTO items (listType, item, amount) VALUES ('base', 'thermometer', 'per-household');
INSERT INTO items (listType, item, amount) VALUES ('base', 'vaccination records for family', 'per-person');
INSERT INTO items (listType, item, amount) VALUES ('base', 'pedialite', 'per-household');
INSERT INTO items (listType, item, amount) VALUES ('infant', 'baby blankets', 'per-household');
INSERT INTO items (listType, item, amount) VALUES ('infant', 'diaper rash cream', 'per-household');
INSERT INTO items (listType, item, amount) VALUES ('infant', 'baby sling', 'per-household');
INSERT INTO items (listType, item, amount) VALUES ('base', 'can opener', 'per-household');
INSERT INTO items (listType, item, amount) VALUES ('base', 'books', 'per-person');
INSERT INTO items (listType, item, amount) VALUES ('child', 'small games', 'per-person');
INSERT INTO items (listType, item, amount) VALUES ('child', 'child hygiene items', 'per-person');
INSERT INTO items (listType, item, amount) VALUES ('child', 'playing cards', 'per-person');
INSERT INTO items (listType, item, amount) VALUES ('base', 'paper and pencils', 'per-household');
INSERT INTO items (listType, item, amount) VALUES ('base', 'local maps', 'per-household');