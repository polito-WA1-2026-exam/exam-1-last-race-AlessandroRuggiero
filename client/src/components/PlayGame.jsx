import { useEffect, useMemo, useState } from "react";
import { Badge, Card, ListGroup, Spinner } from "react-bootstrap";
import { useLocation, useParams } from "react-router";
import { getGame, getNetwork } from "../api/game";
import { ConnectionItem, RoutePreview } from "./Metro";
import { END_COLOR, START_COLOR } from "../models/colors";

const SHUFFLE_CONNECTIONS = true;

function fisherYates(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export default function PlayGame() {
    const { id } = useParams();
    const { state } = useLocation();

    const [game, setGame] = useState(state?.game ?? null);
    const [network, setNetwork] = useState(state?.network ?? null);
    const [error, setError] = useState(null);
    const [selected, setSelected] = useState([]);

    // this will only run on mount, its dependencies are guaranteed to be stable
    // the pourpose of this is to fetch the game and network if we don't have them from the location state (e.g. user refreshes the page or navigates with url)
    // despite this not being esplicitly required by the exam text its still very useful for debugging
    useEffect(() => {
        Promise.all([
            game ? Promise.resolve(game) : getGame(id),
            network ? Promise.resolve(network) : getNetwork(),
        ])
            .then(([g, n]) => { setGame(g); setNetwork(n); })
            .catch((e) => setError(e.message));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const displayConnections = useMemo(() => {
        if (!network) return [];
        return SHUFFLE_CONNECTIONS ? fisherYates(network.connections) : network.connections;
    }, [network]);

    if (error) return <div className="container py-4 alert alert-danger">{error}</div>;
    if (!game || !network) return <div className="text-center py-5"><Spinner animation="border" /></div>;

    const toggle = (conn) =>
        setSelected((prev) =>
            prev.find((c) => c.id === conn.id)
                ? prev.filter((c) => c.id !== conn.id)
                : [...prev, conn]
        );

    return (
        <div className="container-fluid py-4">
            <div className="d-flex align-items-center gap-3 mb-3">
                <h4 className="mb-0">Game #{game.id}</h4>
                <RoutePreview startStation={game.startStation} endStation={game.endStation} colors={[START_COLOR, END_COLOR]}/>
                <Badge bg="warning" text="dark">Coins: {game.coins}</Badge>
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
                                selected.map((conn) => 
                                    <ConnectionItem key={conn.id} conn={conn} onRemove={toggle} startStation={game.startStation} endStation={game.endStation} />
                                ))
                            }
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
                                    <ConnectionItem key={conn.id} conn={conn} selected={isSelected} onClick={() => toggle(conn)} startStation={game.startStation} endStation={game.endStation} />
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
                                    <span className={station === game.startStation || station === game.endStation ? "fw-semibold" : ""}
                                          style={station === game.startStation ? { color: "#fd7e14" } : station === game.endStation ? { color: "#6f42c1" } : {}}
                                    >
                                        {station}
                                    </span>
                                    {station === game.startStation && <Badge bg="" style={{ backgroundColor: "#fd7e14" }}>Start</Badge>}
                                    {station === game.endStation && <Badge bg="" style={{ backgroundColor: "#6f42c1" }}>End</Badge>}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Card>
                </div>
            </div>
        </div>
    );
}
