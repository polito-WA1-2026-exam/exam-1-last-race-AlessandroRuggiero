import baseUrl from "./baseurl";
import { Network } from "../models/network";
import { Game } from "../models/game";
import { SubmitRouteResult } from "../models/submitRouteResult";
import { Event } from "../models/event";
import { LeaderboardEntry } from "../models/leaderboardEntry";

function checkAuth(response) {
    if (response.status === 401) throw new Error("SESSION_EXPIRED");
    return response;
}

export async function getNetwork() {
    const response = await fetch(`${baseUrl}/network`, {
        credentials: "include",
    });

    if (checkAuth(response).ok) {
        const body = await response.json();
        return new Network(body.stations, body.lines, body.connections);
    } else {
        throw new Error("Failed to fetch network data");
    }
}

export async function getGame(id) {
    console.log("Fetching game with id:", id);
    const response = await fetch(`${baseUrl}/games/${id}`, {
        credentials: "include",
    });

    if (checkAuth(response).ok) {
        const d = await response.json();
        return new Game(d.id, d.startStation, d.endStation, d.userId, d.startTime, d.status, d.coins, d.answer);
    } else {
        throw new Error("Failed to fetch game");
    }
}

export async function submitAnswer(gameId, connectionIds) {
    const response = await fetch(`${baseUrl}/games/${gameId}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ connections: connectionIds }),
    });
    if (checkAuth(response).ok) {
        const d = await response.json();
        return new SubmitRouteResult(
            d.status,
            d.coins,
            d.happenedEvents.map((e) => new Event(e.id, e.description, e.effect)),
            d.answer,
        );
    }
    throw new Error("Failed to submit answer");
}

export async function getLeaderboard(count = 10) {
    const response = await fetch(`${baseUrl}/leaderboard?count=${count}`, {
        credentials: "include",
    });
    if (checkAuth(response).ok) {
        const data = await response.json();
        return data.map(
            (d) =>
                new LeaderboardEntry(
                    d.userId,
                    d.username,
                    d.startStation,
                    d.endStation,
                    d.answer,
                    d.startTime,
                    d.endTime,
                    d.coins,
                ),
        );
    }
    throw new Error("Failed to fetch leaderboard");
}

export async function createGame() {
    const response = await fetch(`${baseUrl}/games`, {
        method: "POST",
        credentials: "include",
    });

    if (checkAuth(response).ok) {
        const d = await response.json();
        return new Game(d.id, d.startStation, d.endStation, d.userId, d.startTime, d.status, d.coins, d.answer);
    } else {
        throw new Error("Failed to create game");
    }
}
