import { useEffect, useState } from "react";
import { Badge, Button, Modal, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router";
import { createGame, getNetwork } from "../api/game";
import { getOrderedLines } from "../models/network";

const LINE_COLORS = {
    Blue: "#0d6efd",
    Red: "#dc3545",
    Green: "#198754",
    Yellow: "#ffc107",
};

const LINE_VARIANTS = {
    Blue: "primary",
    Red: "danger",
    Green: "success",
    Yellow: "warning",
};

function MetroLine({ lineName, stations, stationLines }) {
    const color = LINE_COLORS[lineName] ?? "#6c757d";
    const variant = LINE_VARIANTS[lineName] ?? "secondary";

    return (
        <div className="mb-4">
            <Badge bg={variant} className="mb-2">
                {lineName} Line
            </Badge>
            <div className="metro-line-col">
                {stations.map((station, i) => {
                    const otherLines = (stationLines.get(station) ?? []).filter(
                        (l) => l !== lineName
                    );
                    return (
                        <div key={station} className="metro-station">
                            <div className="metro-track">
                                {i > 0 && (
                                    <div
                                        className="metro-connector"
                                        style={{ backgroundColor: color }}
                                    />
                                )}
                                <div className="metro-dot" style={{ color }} />
                                {i < stations.length - 1 && (
                                    <div
                                        className="metro-connector"
                                        style={{ backgroundColor: color }}
                                    />
                                )}
                            </div>
                            <div className="metro-label text-muted">
                                {station}
                                {otherLines.map((l) => (
                                    <Badge
                                        key={l}
                                        bg={LINE_VARIANTS[l] ?? "secondary"}
                                        className="ms-1"
                                        style={{ fontSize: "0.75rem" }}
                                    >
                                        {l}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function NetworkDisplay({ network }) {
    const orderedLines = getOrderedLines(network);

    const stationLines = new Map();
    for (const [line, stations] of orderedLines) {
        for (const s of stations) {
            if (!stationLines.has(s)) stationLines.set(s, []);
            stationLines.get(s).push(line);
        }
    }

    return (
        <div className="d-flex gap-4 flex-wrap">
            {[...orderedLines.entries()].map(([line, stations]) => (
                <MetroLine
                    key={line}
                    lineName={line}
                    stations={stations}
                    stationLines={stationLines}
                />
            ))}
        </div>
    );
}

export default function NewGame() {
    const [network, setNetwork] = useState(null);
    const [error, setError] = useState(null);
    const [readyPopup, setReadyPopup] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        getNetwork()
            .then(setNetwork)
            .catch((e) => setError(e.message));
    }, []);

    const handleStart = () =>
        createGame()
            .then((game) => navigate(`/play/${game.id}`))
            .catch((e) => setError(e.message));

    return (
        <div className="container py-4">
            <h2 className="mb-4">Network Map</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {!network && !error && (
                <div className="text-center py-5">
                    <Spinner animation="border" />
                </div>
            )}
            {network && (
                <>
                    <NetworkDisplay network={network} />
                    <Button
                        size="lg"
                        onClick={() => setReadyPopup(true)}
                        className="fab-ready"
                    >
                        Ready
                    </Button>
                    <Modal show={readyPopup} onHide={() => setReadyPopup(false)} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Are you ready?</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Once you start, the <strong>90-second</strong> planning timer begins immediately.
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="link" onClick={() => setReadyPopup(false)} style={{ textDecoration: "none", color: "inherit" }}>Not yet</Button>
                            <Button variant="" className="btn-shine" style={{ backgroundColor: "#6f42c1", borderColor: "#6f42c1", color: "white" }} onClick={handleStart}>Let's go!</Button>
                        </Modal.Footer>
                    </Modal>
                </>
            )}
        </div>
    );
}
