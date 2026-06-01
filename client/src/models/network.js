export function Connection(station1, station2, line, id) {
    this.station1 = station1;
    this.station2 = station2;
    this.line = line;
    this.id = id;
}

export function Network(stations, lines, connections) {
    this.stations = stations; // list of stations as strings
    this.lines = lines; // list of lines as strings
    this.connections = connections.map((c) => new Connection(c.station1, c.station2, c.line, c.id));
}

//  This function is here because we cannot assume the order of the stations in the connections list.
export function getOrderedLines(network) {
    let orderedLines = new Map();
    for (const line of network.lines) {
        let stations = [];
        let lineConnections = network.connections.filter((c) => c.line === line);
        if (lineConnections.length === 0) {
            orderedLines.set(line, stations);
            continue;
        }
        const popNextStation = () => {
            const idx = lineConnections.findIndex((c) => c.station1 === stations[stations.length - 1]);
            if (idx === -1) return null;
            return lineConnections.splice(idx, 1)[0].station2;
        };
        const popPrevStation = () => {
            const idx = lineConnections.findIndex((c) => c.station2 === stations[0]);
            if (idx === -1) return null;
            return lineConnections.splice(idx, 1)[0].station1;
        };
        const initialConnection = lineConnections.pop(0);
        stations.push(initialConnection.station1);
        stations.push(initialConnection.station2);
        let currentStation = stations[0];
        while (currentStation) {
            currentStation = popPrevStation();
            if (currentStation) stations.unshift(currentStation);
        }
        currentStation = stations[stations.length - 1];
        while (currentStation) {
            currentStation = popNextStation();
            if (currentStation) stations.push(currentStation);
        }
        orderedLines.set(line, stations);
    }
    return orderedLines;
}
