export default function Network(stations, connections) {
    // this.lines = lines; lines are not needed for the Network because they are never used
    this.stations = new Map(stations.map((s) => [s.id, s]));
    this.connections = new Map(connections.map((c) => [c.id, c]));

    this.bfs = function bfs(startStation, endStation) {
        const adj = {};
        for (const [_, { station1, station2 }] of this.connections) {
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
    };

    this.verifyPath = function verifyPath(path) {
        for (const station of path) {
            if (!this.stations.has(station)) return false;
        }
        for (let i = 0; i < path.length - 1; i++) {
            const station1 = path[i];
            const station2 = path[i + 1];
            if (
                !this.connections
                    .values()
                    .some(
                        (c) =>
                            (c.station1 === station1 && c.station2 === station2) ||
                            (c.station1 === station2 && c.station2 === station1),
                    )
            ) {
                return false;
            }
        }
        return true;
    };

    this.verifyConnectionPath = function (connectionIds, startStation, endStation) {
        let current = startStation;
        for (const id of connectionIds) {
            const connection = this.connections.get(id);
            if (!connection) return false;
            if (connection.station1 === current) current = connection.station2;
            else if (connection.station2 === current) current = connection.station1;
            else return false;
        }
        return current === endStation;
    };

    this.calculateSegments = function (startStation, endStation) {
        // from the requirements document:
        // Centrale -> Porta Velaria -> Crocevia del Falco -> Piazza delle Lanterne counts as 3
        const path = this.bfs(startStation, endStation);
        return path ? path.length - 1 : -1;
    };

    this.getRandomStation = function (excludedStations) {
        const stationsArray = Array.from(this.stations.keys()).filter((s) => !excludedStations.has(s));
        if (stationsArray.length === 0) throw new Error("No stations available");
        return stationsArray[Math.floor(Math.random() * stationsArray.length)];
    };

    this.stationNameToId = function (name) {
        for (const [id, station] of this.stations) {
            if (station.name === name) return id;
        }
        return null;
    };

    this.stationIdToName = function (id) {
        const station = this.stations.get(id);
        return station ? station.name : null;
    };

    this.toClientNetwork = function () {
        const connections = [...this.connections.values()]
            .map((c) => ({
                station1: this.stationIdToName(c.station1),
                station2: this.stationIdToName(c.station2),
                line: c.line,
                id: c.id,
            }))
            .sort((a, b) => a.station1.localeCompare(b.station1) || a.station2.localeCompare(b.station2));
        const lines = [...new Set(connections.map((c) => c.line))];
        const stations = [...new Set(connections.flatMap((c) => [c.station1, c.station2]))];
        return { connections, lines, stations };
    };
}
