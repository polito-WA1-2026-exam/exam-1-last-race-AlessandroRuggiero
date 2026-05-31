import baseUrl from "./baseurl";
import { Network } from "../models/network";

export async function getNetwork() {
  const response = await fetch(`${baseUrl}/network`, {
    credentials: "include",
  });

  if (response.ok) {
    const body = await response.json();
    return new Network(body.stations, body.lines, body.connections);
  } else {
    throw new Error("Failed to fetch network data");
  }
}

export async function getGame(id) {
  const response = await fetch(`${baseUrl}/games/${id}`, {
    credentials: "include",
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw new Error("Failed to fetch game");
  }
}

export async function createGame() {
  const response = await fetch(`${baseUrl}/games`, {
    method: "POST",
    credentials: "include",
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw new Error("Failed to create game");
  }
}
