export function Event(id, description, effect) {
    this.id = id;
    this.description = description;
    this.effect = effect;
}

export function Connection(station1, station2, line, id) {
    this.station1 = station1;
    this.station2 = station2;
    this.line = line;
    this.id = id;
}

export function Station(name, id) {
    this.name = name;
    this.id = id;
}

// line is currently not used in the Network class, but the model is here for completeness and future use
export function Line(color, id) {
    this.color = color;
    this.id = id;
}

export function Game(id, startStation, endStation, userId, startTime, status, coins, answer) {
    this.id = id;
    this.startStation = startStation;
    this.endStation = endStation;
    this.userId = userId;
    this.startTime = startTime;
    this.status = status;
    this.coins = coins;
    this.answer = answer;
}
