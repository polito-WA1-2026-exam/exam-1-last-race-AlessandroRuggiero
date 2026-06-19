import { Badge, Card, ListGroup, Button } from "react-bootstrap";
import { MetroMap } from "./MetroMap";
import { useMemo, useState, useEffect } from "react";
import { ConnectionItem } from "./Metro";
import { END_COLOR, START_COLOR } from "../models/colors";
import dayjs from "dayjs";
import { TicketFull } from "./Ticket";

function Countdown({ remaining }) {
    const bg = remaining >= 60 ? "success" : remaining > 30 ? "warning" : "danger";
    return (
        <Badge
            bg={bg}
            text={bg === "warning" ? "dark" : undefined}
            className={remaining <= 5 ? "badge-pulse" : ""}
            style={{
                fontSize: "1.1rem",
                padding: "0.5rem 0.9rem",
                fontVariantNumeric: "tabular-nums",
            }}
        >
            {remaining}s
        </Badge>
    );
}

export default function PickRoute({ game, network, gameDuration, handleSubmit }) {
    const [selected, setSelected] = useState([]);
    const [remaining, setRemaining] = useState(null);

    useEffect(() => {
        if (!game) return;
        const interval = setInterval(() => {
            setRemaining(Math.max(0, gameDuration - (dayjs().unix() - game.startTime)));
        }, 250);
        return () => clearInterval(interval);
    }, [game, gameDuration]);

    useEffect(() => {
        if (remaining === 0) handleSubmit(selected);
    }, [remaining, handleSubmit, selected]);

    const displayConnections = useMemo(() => {
        if (!network) return [];
        // sort connections by station 1 and 2 names
        return [...network.connections].sort(
            (a, b) => a.station1.localeCompare(b.station1) || a.station2.localeCompare(b.station2),
        );
    }, [network]);

    const toggle = (conn) =>
        setSelected((prev) =>
            prev.find((c) => c.id === conn.id) ? prev.filter((c) => c.id !== conn.id) : [...prev, conn],
        );

    const moveItem = (index, direction) =>
        setSelected((prev) => {
            const next = [...prev];
            const target = index + direction;
            if (target < 0 || target >= next.length) return prev;
            [next[index], next[target]] = [next[target], next[index]];
            return next;
        });

    return (
        <div className="px-4 py-4">
            <div className="row g-3" style={{ height: "75vh" }}>
                {/* left: game ticket */}
                <div className="col-5 d-flex flex-column">
                    <TicketFull
                        startStation={game.startStation}
                        endStation={game.endStation}
                        coins={game.coins}
                        fromColor={START_COLOR}
                        toColor={END_COLOR}
                        displayMessage="Quick! Select the connections that you think connect your boarding station to your destination before the timer runs out."
                    >
                        <div className="d-flex justify-content-end align-items-center gap-3 mt-3">
                            <div className="d-flex align-items-center gap-2">
                                {remaining !== null && <Countdown remaining={remaining} />}
                                <Button
                                    variant="success"
                                    size="sm"
                                    onClick={() => handleSubmit(selected)}
                                    //disabled={!!result}
                                    style={{ fontWeight: 700, borderWidth: 2 }}
                                >
                                    Submit
                                </Button>
                            </div>
                        </div>
                    </TicketFull>
                    <div className="mt-4" style={{ background: 'white', borderRadius: 16, boxShadow: '0 6px 28px rgba(0,0,0,0.10)', padding: '12px' }}>
                        <MetroMap hideLines />
                    </div>
                </div>
                {/* Middle: all connections */}
                <div className="col-4 d-flex flex-column">
                    <Card
                        className="flex-grow-1 overflow-hidden d-flex flex-column border-0"
                        style={{ boxShadow: "0 6px 28px rgba(0,0,0,0.10)", borderRadius: 16 }}
                    >
                        <Card.Header
                            className="mono py-2 px-3"
                            style={{
                                background: "white",
                                fontSize: "0.68rem",
                                letterSpacing: "0.12em",
                                color: "#1e1b2e",
                                borderBottom: "2px solid #6f42c1",
                            }}
                        >
                            Connections
                        </Card.Header>
                        <ListGroup variant="flush" className="overflow-auto flex-grow-1">
                            {displayConnections.map((conn) => {
                                const isSelected = !!selected.find((c) => c.id === conn.id);
                                return (
                                    <ConnectionItem
                                        key={conn.id}
                                        conn={conn}
                                        selected={isSelected}
                                        onClick={() => toggle(conn)}
                                        startStation={game.startStation}
                                        endStation={game.endStation}
                                    />
                                );
                            })}
                        </ListGroup>
                    </Card>
                </div>

                {/* Right: selected route */}
                <div className="col-3 d-flex flex-column">
                    <Card
                        className="flex-grow-1 overflow-hidden d-flex flex-column border-0"
                        style={{ boxShadow: "0 6px 28px rgba(0,0,0,0.10)", borderRadius: 16 }}
                    >
                        <Card.Header
                            className="mono py-2 px-3"
                            style={{
                                background: "white",
                                fontSize: "0.68rem",
                                letterSpacing: "0.12em",
                                color: "#1e1b2e",
                                borderBottom: "2px solid #6f42c1",
                            }}
                        >
                            Your Route
                        </Card.Header>
                        <ListGroup variant="flush" className="overflow-auto flex-grow-1">
                            {selected.length === 0 ? (
                                <ListGroup.Item
                                    className="text-center py-4 border-0"
                                    style={{ color: "#adb5bd", fontSize: "0.85rem" }}
                                >
                                    Click connections to add them
                                </ListGroup.Item>
                            ) : (
                                selected.map((conn, i) => (
                                    <ConnectionItem
                                        key={conn.id}
                                        conn={conn}
                                        onRemove={toggle}
                                        onMoveUp={i > 0 ? () => moveItem(i, -1) : null}
                                        onMoveDown={i < selected.length - 1 ? () => moveItem(i, 1) : null}
                                        startStation={game.startStation}
                                        endStation={game.endStation}
                                    />
                                ))
                            )}
                        </ListGroup>
                    </Card>
                </div>
            </div>
        </div>
    );
}
