import sqlite from "sqlite3";
import crypto from "crypto";
import { Network, Connection } from "./models.js";

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

export function getNetwork() {
  return new Promise((resolve, reject) => {
    const sql = `SELECT s1.name AS station1, s2.name AS station2, l.color AS line
      FROM connections c
      JOIN stations s1 ON c.station1_id = s1.id
      JOIN stations s2 ON c.station2_id = s2.id
      JOIN lines l ON c.line_id = l.id`;
    db.all(sql, [], (err, rows) => {
      if (err) reject(err);
      else {
        const connections = rows.map(
          (row) => new Connection(row.station1, row.station2, row.line),
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
