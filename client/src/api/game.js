import baseUrl from "./baseurl";
import { Network } from "../models/network";

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
        return await response.json();
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
    if (checkAuth(response).ok) return await response.json();
    throw new Error("Failed to submit answer");
}

export async function getLeaderboard(count = 10) {
    const response = await fetch(`${baseUrl}/leaderboard?count=${count}`, {
        credentials: "include",
    });
    if (checkAuth(response).ok) return await response.json();
    throw new Error("Failed to fetch leaderboard");
}

export async function createGame() {
    const response = await fetch(`${baseUrl}/games`, {
        method: "POST",
        credentials: "include",
    });

    if (checkAuth(response).ok) {
        return await response.json();
    } else {
        throw new Error("Failed to create game");
    }
}
