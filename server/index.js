// import
import express from "express";
import morgan from "morgan";
import cors from "cors";
import {
  getUser,
  getNetwork,
  getStations,
  createGame,
  getGame,
  answerGame,
  getEvents,
  getLeaderboard,
} from "./dao.js";
import { Game } from "./models.js";
import { calculateStops, verifyConnectionPath } from "./graph.js";
import { check, validationResult } from "express-validator";
import dayjs from "dayjs";

import passport from "passport";
import LocalStrategy from "passport-local";
import session from "express-session";

// init express
const app = new express();
const port = 3001;

// middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

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
    if (!errors.isEmpty())
      return res.status(422).json({ error: errors.array()[0].msg });
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
    const network = await getNetwork();
    res.json(network);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/games", isLoggedIn, async (req, res) => {
  const user = req.user;
  try {
    const [network, stationNameToId] = await Promise.all([
      getNetwork(),
      getStations(),
    ]);
    const randomStation = () =>
      network.stations[Math.floor(Math.random() * network.stations.length)];
    const startStation = randomStation();
    let endStation = randomStation();
    console.log("start:", startStation, "end:", endStation);
    while (calculateStops(network, startStation, endStation) < 3) {
      endStation = randomStation();
    }
    const startTime = dayjs().unix();
    const startCoins = 20;
    const gameId = await createGame(
      stationNameToId[startStation],
      stationNameToId[endStation],
      user.id,
      startTime,
      startCoins,
    );
    const game = new Game(
      gameId,
      startStation,
      endStation,
      user.id,
      startTime,
      "active",
      startCoins,
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
    if (!errors.isEmpty())
      return res.status(422).json({ error: errors.array()[0].msg });
    try {
      const game = await getGame(req.params.id, req.user.id);
      if (!game) return res.status(404).json({ error: "Game not found" });
      res.json(game);
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

app.post(
  "/api/games/:id/answer",
  isLoggedIn,
  check("connections").isArray({ min: 1 }).withMessage("Invalid answer"),
  check("connections.*").isInt({ min: 1 }).withMessage("Invalid connection id"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ error: errors.array()[0].msg });
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

      const normalGameDuration = 90; // seconds
      const tollerance = 25; // percentage
      const gameDuration = dayjs().unix() - game.startTime;
      if (gameDuration > normalGameDuration * (1 + tollerance / 100)) {
        console.log(
          `(${game.id}) - Game duration ${gameDuration}s exceeded normal duration ${normalGameDuration}s`,
        );
        //return res.status(409).json({ error: "Time limit exceeded" });
      }

      const correct = verifyConnectionPath(
        network,
        connections,
        game.startStation,
        game.endStation,
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

      await answerGame(req.params.id, req.user.id, connections, status, coins);
      res.json({ status, coins, happenedEvents });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

app.get(
  "/api/leaderboard",
  isLoggedIn,
  check("count")
    .optional()
    .isInt({ min: 1, max: 250 })
    .withMessage("count must be an integer between 1 and 250"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ error: errors.array()[0].msg });
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
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
