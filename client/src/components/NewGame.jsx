import { useEffect, useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router";
import { createGame, getNetwork } from "../api/game";
import { LINE_COLORS, LINE_VARIANTS } from "../models/colors";
import { MetroDot, MetroConnector } from "./Metro";
import { getOrderedLines } from "../models/network";
import { Badge } from "react-bootstrap";
import { TicketFull } from "./Ticket";
import { START_COLOR, END_COLOR } from "../models/colors";
import "../styles/ticket.css";

export function MetroLine({ lineName, stations, stationLines }) {
    const color = LINE_COLORS[lineName] ?? "#6c757d";
    const variant = LINE_VARIANTS[lineName] ?? "secondary";

    return (
        <div className="mb-4">
            <Badge bg={variant} className="mb-2">
                {lineName} Line
            </Badge>
            <div className="metro-line-col">
                {stations.map((station, i) => {
                    const otherLines = (stationLines.get(station) ?? []).filter((l) => l !== lineName);
                    return (
                        <div key={station} className="metro-station">
                            <div className="metro-track">
                                {i > 0 && <MetroConnector color={color} vertical={true} />}
                                <MetroDot color={color} />
                                {i < stations.length - 1 && <MetroConnector color={color} vertical={true} />}
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

export function NetworkDisplay({ network }) {
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
                <MetroLine key={line} lineName={line} stations={stations} stationLines={stationLines} />
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

    const handleBoard = () =>
        createGame()
            .then((game) => navigate(`/play/${game.id}`, { state: { game, network } }))
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
                    <Button size="lg" onClick={() => setReadyPopup(true)} className="fab-ready">
                        Ready
                    </Button>
                    <Modal
                        show={readyPopup}
                        onHide={() => setReadyPopup(false)}
                        centered
                        dialogClassName="modal-ticket"
                        contentClassName="bg-transparent border-0 shadow-none"
                    >
                        <Modal.Body className="p-0">
                            <TicketFull
                                stations={[...new Set(network.connections.flatMap((c) => [c.station1, c.station2]))]}
                                fromColor={START_COLOR}
                                toColor={END_COLOR}
                                coins={20}
                                onBoard={handleBoard}
                                onClose={() => setReadyPopup(false)}
                            />
                        </Modal.Body>
                    </Modal>
                </>
            )}
        </div>
    );
}
