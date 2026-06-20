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
