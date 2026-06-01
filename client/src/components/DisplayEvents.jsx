import { useState } from "react";
import { Badge, Button } from "react-bootstrap";
import { ConnectionItem } from "./Metro";

export default function DisplayEvents({ events, connections, startCoins, setStateIndex }) {
    const [eventIndex, setEventIndex] = useState(0);
    const event = events[eventIndex];
    const isLast = eventIndex === events.length - 1;

    const coinsNow = startCoins + events.slice(0, eventIndex + 1).reduce((acc, e) => acc + e.effect, 0);

    const handleNext = () => {
        if (!isLast) setEventIndex((prev) => prev + 1);
        else setStateIndex(2);
    };

    return (
        <div className="container py-4 text-center">
            <ConnectionItem conn={connections[eventIndex]} />
            <p className="text-muted">
                Event {eventIndex + 1} / {events.length}
            </p>
            <h5>{event.description}</h5>
            <Badge bg={event.effect >= 0 ? "success" : "danger"} className="fs-6 my-2">
                {event.effect >= 0 ? "+" : ""}
                {event.effect} coins
            </Badge>
            <p className="mt-2">Coins: {coinsNow}</p>
            <Button onClick={handleNext}>{isLast ? "See result" : "Next"}</Button>
        </div>
    );
}
