// import
import express from "express";
import morgan from "morgan";
import cors from "cors";
import {
    getUser,
    getStations,
    createGame,
    getGame,
    answerGame,
    getEvents,
    getLeaderboard,
    getConnections,
} from "./dao.js";
import { Game } from "./models.js";
import Network from "./network.js";
import { check, validationResult } from "express-validator";
import dayjs from "dayjs";

import passport from "passport";
import LocalStrategy from "passport-local";
import session from "express-session";

// init express
const app = new express();
const port = 3001;

// game duration settings
const normalGameDuration = 90; // seconds
const tollerance = 10; // percentage

// network caching
// in case we dont expect the network to change during the server execution, we can cache it to avoid reading from the database multiple times.
const CACHE_NETWORK = true;
let cachedNetwork = null;

async function getNetwork() {
    if (!CACHE_NETWORK || !cachedNetwork) {
        const [connections, stations] = await Promise.all([getConnections(), getStations()]);
        const network = new Network(stations, connections);
        if (CACHE_NETWORK) cachedNetwork = network;
        return network;
    }
    return cachedNetwork;
}

// middlewares
app.use(express.json());
app.use(morgan("dev"));

const corsOptions = {
    origin: "http://localhost:5173",
    optionsSuccessStatus: 200,
    credentials: true,
};
app.use(cors(corsOptions));

passport.use(
    new LocalStrategy(async function verify(username, password, cb) {
        const user = await getUser(username, password);

        if (!user)
            //null -> no error, invalid credetials, message
            return cb(null, false, "Incorrect username or password."); // error message in the WWW-Authenticated header of the response

        return cb(null, user);
    }),
);

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (user, cb) {
    return cb(null, user);
});

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({ error: "Not authorized" });
};

app.use(
    session({
        secret: "s358751",
        resave: false,
        saveUninitialized: false,
    }),
);
app.use(passport.authenticate("session"));

/* ROUTES */

// POST /api/sessions
app.post(
    "/api/sessions",
    check("username").isString().notEmpty().withMessage("Username is required"),
    check("password").isString().notEmpty().withMessage("Password is required"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(422).json({ error: errors.array()[0].msg });
        next();
    },
    passport.authenticate("local"),
    function (req, res) {
        return res.status(201).json(req.user);
    },
);

// GET /api/sessions/current
app.get("/api/sessions/current", (req, res) => {
    if (req.isAuthenticated()) {
        res.json(req.user);
    } else res.status(401).json({ error: "Not authenticated" });
});

// DELETE /api/session/current
app.delete("/api/sessions/current", (req, res) => {
    req.logout(() => {
        res.end();
    });
});

// DAO functions
app.get("/api/network", isLoggedIn, async (req, res) => {
    try {
        let network = await getNetwork();
        res.json(network.toClientNetwork());
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/api/games", isLoggedIn, async (req, res) => {
    const user = req.user;
    try {
        const network = await getNetwork();
        const excludedStations = new Set();
        const startStation = network.getRandomStation(excludedStations);
        excludedStations.add(startStation);
        let endStation = network.getRandomStation(excludedStations);
        while (network.calculateStops(startStation, endStation) < 3) {
            excludedStations.add(endStation);
            endStation = network.getRandomStation(excludedStations);
        }
        const startTime = dayjs().unix();
        const gameId = await createGame(startStation, endStation, user.id, startTime, 0); // i initialize the database object with 0 coins so if the user never delivers an answer, the coins will be 0. The 20 initial coins are handled in the post.
        const game = new Game(
            gameId,
            network.stationIdToName(startStation),
            network.stationIdToName(endStation),
            user.id,
            startTime,
            "active",
            0,
            null,
        );
        res.status(201).json(game);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get(
    "/api/games/:id",
    isLoggedIn,
    check("id").isInt({ min: 1 }).withMessage("Invalid game id"),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(422).json({ error: errors.array()[0].msg });
        try {
            const game = await getGame(req.params.id, req.user.id);
            if (!game) return res.status(404).json({ error: "Game not found" });

            // if the game is active but the duration exceeded the limit, we consider it lost
            // the update to the db is not done here because this is a get route and it should not update the database
            // in a production environment we should have a cron job running periodically to update games that where never answered and exceeded the time limit

            const currentTime = dayjs().unix();
            const gameDuration = currentTime - game.startTime;
            if (game.status === "active" && gameDuration > normalGameDuration * (1 + tollerance / 100)) {
                game.status = "lost";
            }
            res.json(game);
        } catch (err) {
            res.status(500).json({ error: "Internal server error" });
        }
    },
);

app.post(
    "/api/games/:id/answer",
    isLoggedIn,
    check("connections").isArray().withMessage("Invalid answer"),
    check("connections.*").isInt({ min: 1 }).withMessage("Invalid connection id"),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(422).json({ error: errors.array()[0].msg });
        const currentTime = dayjs().unix();
        const { connections } = req.body;
        try {
            const [game, network, events] = await Promise.all([
                getGame(req.params.id, req.user.id),
                getNetwork(),
                getEvents(),
            ]);
            if (!game) return res.status(404).json({ error: "Game not found" });
            if (game.status !== "active") {
                return res.status(409).json({ error: "Game already completed" });
            }

            const gameDuration = currentTime - game.startTime;
            if (gameDuration > normalGameDuration * (1 + tollerance / 100)) {
                console.log(
                    `(${game.id}) - Game duration ${gameDuration}s exceeded normal duration ${normalGameDuration}s`,
                );
                return res.status(409).json({ error: "Time limit exceeded" });
            }
            const correct = network.verifyConnectionPath(
                connections,
                network.stationNameToId(game.startStation),
                network.stationNameToId(game.endStation),
            );

            const status = correct ? "won" : "lost";
            let coins = game.coins;
            let happenedEvents = [];
            if (status === "won") {
                for (const station of connections) {
                    let randomEvent = events[Math.floor(Math.random() * events.length)];
                    coins += randomEvent.effect;
                    happenedEvents.push(randomEvent);
                }
            } else {
                coins = 0;
            }

            coins = Math.max(coins, 0);

            await answerGame(req.params.id, req.user.id, connections, status, coins, currentTime);
            res.json({ status, coins, happenedEvents, answer: connections });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Internal server error" });
        }
    },
);

app.get(
    "/api/leaderboard",
    isLoggedIn,
    check("count").optional().isInt({ min: 1, max: 250 }).withMessage("count must be an integer between 1 and 250"),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(422).json({ error: errors.array()[0].msg });
        try {
            const count = req.query.count ? parseInt(req.query.count) : 10;
            const leaderboard = await getLeaderboard(count);
            res.json(leaderboard);
        } catch (err) {
            res.status(500).json({ error: "Internal server error" });
        }
    },
);

// activate the server
app.listen(port, "0.0.0.0", () => {
    console.log(`Server listening at http://localhost:${port}`);
});
