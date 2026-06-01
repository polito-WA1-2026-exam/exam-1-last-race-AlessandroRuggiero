import { Badge, Card, ListGroup, Button } from "react-bootstrap";
import { useMemo, useState, useEffect } from "react";
import { ConnectionItem, RoutePreview } from "./Metro";
import { END_COLOR, START_COLOR } from "../models/colors";
import dayjs from "dayjs";

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

// ijmplementations from https://medium.com/@modos.m98/creating-a-seeded-random-string-generator-in-javascript-3165aae1c2d5
function mulberry32(seed) {
    return function () {
        let t = (seed += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
function fisherYates(arr, seed) {
    const rand = mulberry32(seed);
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export default function PickRoute({ game, network, gameDuration, handleSubmit, shuffleConnections = true }) {
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
        return shuffleConnections ? fisherYates(network.connections, game.id) : network.connections;
    }, [network, shuffleConnections, game.id]);

    const toggle = (conn) =>
        setSelected((prev) =>
            prev.find((c) => c.id === conn.id) ? prev.filter((c) => c.id !== conn.id) : [...prev, conn],
        );

    return (
        <div className="container-fluid py-4">
            <div className="d-flex align-items-center gap-3 mb-3 sticky-top bg-white py-2 shadow-sm">
                <h4 className="mb-0">Game #{game.id}</h4>
                <RoutePreview
                    startStation={game.startStation}
                    endStation={game.endStation}
                    colors={[START_COLOR, END_COLOR]}
                />
                <div className="ms-auto d-flex align-items-center gap-2">
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => handleSubmit(selected)}
                        //disabled={!!result}
                        style={{ fontWeight: 700, borderWidth: 2 }}
                    >
                        Submit
                    </Button>
                    {remaining !== null && <Countdown remaining={remaining} />}
                </div>
            </div>
            <div className="row g-3" style={{ height: "75vh" }}>
                {/* Left: selected route */}
                <div className="col-4 d-flex flex-column">
                    <Card className="flex-grow-1 overflow-hidden d-flex flex-column">
                        <Card.Header className="fw-bold">Your Route</Card.Header>
                        <ListGroup variant="flush" className="overflow-auto flex-grow-1">
                            {selected.length === 0 ? (
                                <ListGroup.Item className="text-muted fst-italic">
                                    Click connections to add them
                                </ListGroup.Item>
                            ) : (
                                selected.map((conn) => (
                                    <ConnectionItem
                                        key={conn.id}
                                        conn={conn}
                                        onRemove={toggle}
                                        startStation={game.startStation}
                                        endStation={game.endStation}
                                    />
                                ))
                            )}
                        </ListGroup>
                    </Card>
                </div>

                {/* Middle: all connections */}
                <div className="col-5 d-flex flex-column">
                    <Card className="flex-grow-1 overflow-hidden d-flex flex-column">
                        <Card.Header className="fw-bold">Connections</Card.Header>
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

                {/* Right: all stations */}
                <div className="col-3 d-flex flex-column">
                    <Card className="flex-grow-1 overflow-hidden d-flex flex-column">
                        <Card.Header className="fw-bold">Stations</Card.Header>
                        <ListGroup variant="flush" className="overflow-auto flex-grow-1">
                            {network.stations.sort().map((station) => (
                                <ListGroup.Item key={station} className="d-flex align-items-center gap-2">
                                    <span
                                        className={
                                            station === game.startStation || station === game.endStation
                                                ? "fw-semibold"
                                                : ""
                                        }
                                        style={
                                            station === game.startStation
                                                ? { color: "#fd7e14" }
                                                : station === game.endStation
                                                  ? { color: "#6f42c1" }
                                                  : {}
                                        }
                                    >
                                        {station}
                                    </span>
                                    {station === game.startStation && (
                                        <Badge
                                            bg=""
                                            style={{
                                                backgroundColor: "#fd7e14",
                                            }}
                                        >
                                            Start
                                        </Badge>
                                    )}
                                    {station === game.endStation && (
                                        <Badge
                                            bg=""
                                            style={{
                                                backgroundColor: "#6f42c1",
                                            }}
                                        >
                                            End
                                        </Badge>
                                    )}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Card>
                </div>
            </div>
        </div>
    );
}
