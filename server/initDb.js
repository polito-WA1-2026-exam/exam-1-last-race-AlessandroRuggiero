import sqlite from "sqlite3";
import crypto from "crypto";
import fs from "node:fs";

const SCHEMA_FILE = "./DBSchema.sql";
const DATABASE_FILE = "gameDB.sqlite";

const lines = {
    Blue: ["Fridhemsplan", "Odenplan", "Rådhuset", "T-Centralen", "Kungsträdgården", "Sofia"],
    Red: [
        "Aspudden",
        "Liljeholmen",
        "Hornstull",
        "Slussen",
        "Gamla stan",
        "T-Centralen",
        "Stadion",
        "Tekniska högskolan",
    ],
    Green: [
        "Alvik",
        //"Thorildplan",
        "Fridhemsplan",
        //"Sankt Eriksplan",
        //"Rådmansgatan",
        "Hötorget",
        "T-Centralen",
        //"Gamla stan",
        //"Slussen",
        //"Medborgarplatsen",
        "Skanstull",
        "Gullmarsplan",
        //"Skärmarbrink",
    ],
    Yellow: [
        "Fridhemsplan",
        "Liljeholmen",
        "Årstaberg",
        "Årstafältet",
        //"Östbergahöjden",
        "Älvsjö",
        "Hagsätra",
        "Gullmarsplan",
    ],
};

if (fs.existsSync(DATABASE_FILE)) {
    fs.unlinkSync(DATABASE_FILE);
    console.log("Existing database file deleted");
}
const db = new sqlite.Database(DATABASE_FILE, (err) => {
    if (err) throw err;
});

// wrappers to avoid callbacks
function run(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve(this.lastID);
        });
    });
}

function exec(sql) {
    return new Promise((resolve, reject) => {
        db.exec(sql, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

async function createUser(email, username, password) {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = await new Promise((resolve, reject) =>
        crypto.scrypt(password, salt, 16, (err, h) => (err ? reject(err) : resolve(h))),
    );
    return run("INSERT INTO users (email, username, salt, hash) VALUES (?, ?, ?, ?)", [
        email,
        username,
        salt,
        hash.toString("hex"),
    ]);
}

async function initDb() {
    let stationsIds = new Map();
    const schema = fs.readFileSync(SCHEMA_FILE, "utf-8");

    await exec(schema);
    console.log("Database initialized");

    await createUser("alessandro.ruggiero.dev@gmail.com", "Alessandro", "ale-password");
    await createUser("s358751@studenti.polito.it", "StudentMaster", "studentMaster-password");
    await createUser("s309582@studenti.polito.it", "Student", "student-password");
    console.log("User initialized");

    for (const [line, stations] of Object.entries(lines)) {
        const lineId = await run("INSERT INTO lines (color) VALUES (?)", [line]);
        const currentStations = stationsIds.size;
        for (const station of stations) {
            if (!stationsIds.has(station)) {
                const id = await run("INSERT INTO stations (name) VALUES (?)", [station]);
                stationsIds.set(station, id);
            } else {
                console.log(`Station ${station} already exists, reusing ID`);
            }
        }
        const addedStations = stationsIds.size - currentStations;
        const reusedStations = stations.length - addedStations;
        console.log(`Line ${line} initialized with ${stations.length} stations (${reusedStations} reused)`);
        for (let i = 0; i < stations.length - 1; i++) {
            await run("INSERT INTO connections (station1_id, station2_id, line_id) VALUES (?, ?, ?)", [
                stationsIds.get(stations[i]),
                stationsIds.get(stations[i + 1]),
                lineId,
            ]);
        }
    }

    // print statistics about the network
    const totalStations = stationsIds.size;
    const totalLines = Object.keys(lines).length;
    const totalPotentialStations = Object.values(lines).reduce((sum, stations) => sum + stations.length, 0);
    const totalInterchangeStations = totalPotentialStations - totalStations;
    console.log(
        `Network initialized with ${totalStations} stations, ${totalLines} lines and ${totalInterchangeStations} interchange stations`,
    );
    if (totalInterchangeStations < 3 || totalStations < 12 || totalLines < 4) {
        console.warn("Warning: network is too small");
    } else {
        console.log("Network size is sufficient");
    }

    const events = [
        { description: "Quiet journey as usual on Tunnelbana", effect: 0 },
        { description: "You stop to admire the station murals", effect: -1 },
        { description: "A pickpocket steals from you on the platform", effect: -4 },
        { description: "You help a lost tourist", effect: 1 },
        { description: "Wrong platform. You miss your train", effect: -2 },
        { description: "You win a scratch card from a promo stand at the station", effect: 4 },
        { description: "You find a forgotten travel card on the seat", effect: 2 },
        { description: "Overcrowded carriage. You wait for the next train", effect: -1 },
        { description: "A busker plays something beautiful", effect: 1 },
        { description: "The station is unusually quiet", effect: 2 },
        { description: "The station is packed. You can't get to your train in time", effect: -1 },
        { description: "Your metro card glitches at the barrier", effect: -1 },
    ];
    for (const event of events) {
        await run("INSERT INTO events (description, effect) VALUES (?, ?)", [event.description, event.effect]);
    }
    console.log(`${events.length} events initialized`);

    db.close((err) => {
        if (err) throw err;
        console.log("Database connection closed");
    });
}
initDb().catch((err) => {
    console.error("Error initializing database:", err);
});
