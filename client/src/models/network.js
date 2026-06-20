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
