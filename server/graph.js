import { Network } from "./models.js";

function bfs(network, startStation, endStation) {
    const adj = {};
    for (const { station1, station2 } of network.connections) {
        (adj[station1] ??= []).push(station2);
        (adj[station2] ??= []).push(station1);
    }

    const visited = new Set([startStation]);
    const queue = [[startStation]];
    while (queue.length > 0) {
        const path = queue.shift();
        const station = path[path.length - 1];
        if (station === endStation) return path;
        for (const neighbor of adj[station] ?? []) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push([...path, neighbor]);
            }
        }
    }
    return null;
}

export function verifyPath(network, path) {
    const stationSet = new Set(network.stations);
    for (const station of path) {
        if (!stationSet.has(station)) return false;
    }
    for (let i = 0; i < path.length - 1; i++) {
        const station1 = path[i];
        const station2 = path[i + 1];
        if (
            !network.connections.some(
                (c) =>
                    (c.station1 === station1 && c.station2 === station2) ||
                    (c.station1 === station2 && c.station2 === station1),
            )
        ) {
            return false;
        }
    }
    return true;
}

export function verifyConnectionPath(network, connectionIds, startStation, endStation) {
    const connMap = new Map(network.connections.map((c) => [c.id, c]));
    let current = startStation;
    for (const id of connectionIds) {
        const connection = connMap.get(id);
        if (!connection) return false;
        if (connection.station1 === current) current = connection.station2;
        else if (connection.station2 === current) current = connection.station1;
        else return false;
    }
    return current === endStation;
}

export function calculateStops(network, startStation, endStation) {
    // A - B - C => 1 stop
    // A - B => 0 stops
    const path = bfs(network, startStation, endStation);
    return path ? path.length - 2 : -1;
}
