import sqlite from "sqlite3";
import crypto from "crypto";

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
