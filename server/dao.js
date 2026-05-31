import sqlite from "sqlite3";
import crypto from "crypto";
import { Network, Connection, Game, Event } from "./models.js";

const db = new sqlite.Database("gameDB.sqlite", (err) => {
  if (err) throw err;
});

/* USERS */
export const getUser = (email, password) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    db.get(sql, [email], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        resolve(false);
      } else {
        const user = { id: row.id, email: row.email, name: row.name };

        crypto.scrypt(password, row.salt, 16, function (err, hashedPassword) {
          if (err) reject(err);
          if (
            !crypto.timingSafeEqual(
              Buffer.from(row.hash, "hex"),
              hashedPassword,
            )
          )
            resolve(false);
          else resolve(user);
        });
      }
    });
  });
};

export function getStations() {
  return new Promise((resolve, reject) => {
    const sql = "SELECT name, id FROM stations";
    db.all(sql, [], (err, rows) => {
      if (err) reject(err);
      else resolve(Object.fromEntries(rows.map((row) => [row.name, row.id])));
    });
  });
}

export function getNetwork() {
  return new Promise((resolve, reject) => {
    const sql = `SELECT s1.name AS station1, s2.name AS station2, l.color AS line, c.id AS connectionId
      FROM connections c
      JOIN stations s1 ON c.station1_id = s1.id
      JOIN stations s2 ON c.station2_id = s2.id
      JOIN lines l ON c.line_id = l.id`;
    db.all(sql, [], (err, rows) => {
      if (err) reject(err);
      else {
        const connections = rows.map(
          (row) =>
            new Connection(
              row.station1,
              row.station2,
              row.line,
              row.connectionId,
            ),
        );
        const lines = [...new Set(connections.map((row) => row.line))];
        const stations = [
          ...new Set(
            connections.map((row) => [row.station1, row.station2]).flat(),
          ),
        ];

        resolve(new Network(stations, lines, connections));
      }
    });
  });
}

export function getEvents() {
  return new Promise((resolve, reject) => {
    db.all("SELECT id, description, effect FROM events", [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows.map((r) => new Event(r.id, r.description, r.effect)));
    });
  });
}

export function getGame(gameId, userId) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT g.id, g.status, g.start_time, s1.name AS startStation, s2.name AS endStation, g.coins AS coins
      FROM games g
      JOIN stations s1 ON g.start_station_id = s1.id
      JOIN stations s2 ON g.end_station_id = s2.id
      WHERE g.id = ? AND g.user_id = ?`;
    db.get(sql, [gameId, userId], (err, row) => {
      if (err) reject(err);
      else if (!row) resolve(null);
      else
        resolve(
          new Game(
            row.id,
            row.startStation,
            row.endStation,
            userId,
            row.start_time,
            row.status,
            row.coins,
          ),
        );
    });
  });
}

export function answerGame(gameId, userId, answer, status, coins) {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE games SET status = ?, answer = ?, coins = ? WHERE id = ? AND user_id = ?`;
    db.run(
      sql,
      [status, JSON.stringify(answer), coins, gameId, userId],
      function (err) {
        if (err) reject(err);
        else resolve(this.changes > 0);
      },
    );
  });
}

export function createGame(startStation, endStation, userId, startTime, coins) {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO games (status, start_station_id, end_station_id, user_id, start_time, coins) VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(
      sql,
      ["active", startStation, endStation, userId, startTime, coins],
      function (err) {
        if (err) {
          console.error(err);
          reject(err);
        } else resolve(this.lastID);
      },
    );
  });
}
