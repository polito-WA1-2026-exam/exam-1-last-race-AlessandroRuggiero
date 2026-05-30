CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL,
  salt TEXT NOT NULL,
  hash TEXT NOT NULL
);

CREATE TABLE lines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  color TEXT NOT NULL
);

CREATE TABLE stations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE connections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  line_id INTEGER NOT NULL,
  station1_id INTEGER NOT NULL,
  station2_id INTEGER NOT NULL,
  FOREIGN KEY (line_id) REFERENCES lines(id),
  FOREIGN KEY (station1_id) REFERENCES stations(id),
  FOREIGN KEY (station2_id) REFERENCES stations(id)
);

CREATE TABLE games (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  status TEXT NOT NULL,
  start_station_id INTEGER NOT NULL,
  end_station_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  start_time TEXT NOT NULL,
  FOREIGN KEY (start_station_id) REFERENCES stations(id),
  FOREIGN KEY (end_station_id) REFERENCES stations(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);