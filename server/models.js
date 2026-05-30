export function Connection(station1, station2, line) {
  this.station1 = station1;
  this.station2 = station2;
  this.line = line;
}

export function Network(stations, lines, connections) {
  this.stations = stations;
  this.lines = lines;
  this.connections = connections;
}

export function Game(status, startStation, endStation) {
  this.status = status;
  this.startStation = startStation;
  this.endStation = endStation;
}
