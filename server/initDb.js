import sqlite from "sqlite3";
import crypto from "crypto";
import fs from "node:fs";

const SCHEMA_FILE = "./DBSchema.sql";
const DATABASE_FILE = "gameDB.sqlite";

const db = new sqlite.Database(DATABASE_FILE, (err) => {
  if (err) throw err;
});

const schema = fs.readFileSync(SCHEMA_FILE, "utf-8");

db.serialize(() => {
  db.exec(schema, (err) => {
    if (err) throw err;
    console.log("Database initialized");
  });

  const salt = crypto.randomBytes(16).toString("hex");
  crypto.scrypt("password", salt, 16, (err, hash) => {
    if (err) throw err;
    db.serialize(() => {
      db.run(
        "INSERT INTO users (email, username, salt, hash) VALUES (?, ?, ?, ?)",
        [
          "alessandro.ruggiero.dev@gmail.com",
          "Alessandro Ruggiero",
          salt,
          hash.toString("hex"),
        ],
        (err) => {
          if (err) throw err;
          console.log("User initialized");
        },
      );

      db.close((err) => {
        if (err) throw err;
        console.log("Database connection closed");
      });
    });
  });
});
