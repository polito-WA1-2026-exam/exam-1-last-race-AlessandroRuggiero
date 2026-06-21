import { useEffect, useState } from "react";
import { Container, Table, Badge, Spinner, Alert, OverlayTrigger, Popover } from "react-bootstrap";
import dayjs from "dayjs";
import { getLeaderboard, getNetwork } from "../api/game";
import { useNavigate } from "react-router";
import { RoutePreview, MetroDot, MetroConnector } from "../components/Metro";
import { START_COLOR, END_COLOR, GREY, BLUE } from "../constants/colors";

const MEDAL = [
    <i className="bi bi-trophy-fill" style={{ color: "#FFD700", fontSize: "1.1rem" }} />,
    <i className="bi bi-trophy-fill" style={{ color: "#C0C0C0", fontSize: "1.1rem" }} />,
    <i className="bi bi-trophy-fill" style={{ color: "#CD7F32", fontSize: "1.1rem" }} />,
];

const formatDate = (unixSeconds) => dayjs.unix(unixSeconds).format("DD/MM/YYYY");

function buildStops(connectionIds, network) {
    const byId = Object.fromEntries(network.connections.map((c) => [c.id, c]));
    const conns = connectionIds?.map((id) => byId[id]).filter((c) => c != null) ?? [];
    if (!conns.length) return [];

    let stations;
    if (conns.length === 1) {
        stations = [conns[0].station1, conns[0].station2];
    } else {
        const [c0, c1] = conns;
        // connections are bidirectional, check c1 to determine which end of c0 is the entry point
        stations =
            c0.station2 === c1.station1 || c0.station2 === c1.station2
                ? [c0.station1, c0.station2] // travelling station1 -> station2
                : [c0.station2, c0.station1]; // travelling station2 -> station1
    }
    // once we know the direction of the first connection we can just walk forward and add the next station at each step
    // because the connections are guaranteed to be valid and in the correct order
    for (let i = 1; i < conns.length; i++) {
        const c = conns[i];
        const last = stations[stations.length - 1];
        stations.push(c.station1 === last ? c.station2 : c.station1); // walk forward regardless of stored direction
    }
    return stations;
}

function StopsPopover({ entry, network, ...props }) {
    const stops = network ? buildStops(entry.answer, network) : [];
    const dotColor = (i) => {
        if (i === 0) return START_COLOR;
        if (i === stops.length - 1) return END_COLOR;
        return GREY;
    };

    return (
        <Popover {...props} style={{ ...props.style, maxWidth: 320 }}>
            <Popover.Header className="fw-semibold">
                {entry.username}'s route &mdash; {formatDate(entry.startTime)}
            </Popover.Header>
            <Popover.Body className="py-2 px-3">
                <div className="metro-line-col">
                    {stops.map((station, i) => (
                        <div key={i} className="metro-station">
                            <div className="metro-track">
                                <MetroConnector color={i > 0 ? GREY : "transparent"} vertical={true} />
                                <MetroDot color={dotColor(i)} />
                                <MetroConnector color={i < stops.length - 1 ? GREY : "transparent"} vertical={true} />
                            </div>
                            <span
                                className="metro-label fw-semibold"
                                style={{ color: dotColor(i) !== GREY ? dotColor(i) : undefined }}
                            >
                                {station}
                            </span>
                        </div>
                    ))}
                </div>
            </Popover.Body>
        </Popover>
    );
}

export default function LeaderBoard() {
    const [entries, setEntries] = useState([]);
    const [network, setNetwork] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        Promise.all([getLeaderboard(10), getNetwork()])
            .then(([lb, net]) => {
                setEntries(lb);
                setNetwork(net);
            })
            .catch((e) =>
                e.message === "SESSION_EXPIRED"
                    ? navigate("/logout", { state: { returnTo: "/login" } })
                    : setError("Failed to load leaderboard."),
            )
            .finally(() => setLoading(false));
    }, [navigate]);

    if (loading)
        return (
            <div className="text-center py-5">
                <Spinner animation="border" style={{ color: BLUE }} />
            </div>
        );

    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <Container className="py-5">
            <div className="d-flex align-items-center mb-3">
                <MetroDot color={BLUE} size="lg" />
                <MetroConnector color={BLUE} vertical={false} />
                <MetroDot color={BLUE} size="lg" />
                <MetroConnector color={BLUE} vertical={false} />
                <MetroDot color={BLUE} size="lg" />
                <MetroConnector color={BLUE} vertical={false} />
                <MetroDot color={BLUE} size="lg" />
            </div>
            <h1 className="fw-bold mb-4" style={{ letterSpacing: "-0.02em" }}>
                Leaderboard
            </h1>
            <div style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 6px 28px rgba(0,0,0,0.10)" }}>
                <Table hover responsive className="mb-0">
                    <thead
                        style={{
                            "--bs-table-bg": "white",
                            "--bs-table-cell-padding-x": "1rem",
                            "--bs-table-cell-padding-y": "0.5rem",
                            borderBottom: `2px solid ${BLUE}`,
                            color: "#1e1b2e",
                        }}
                    >
                        <tr>
                            <th>#</th>
                            <th>Player</th>
                            <th>Best Route</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th className="text-end">Coins</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.map((entry, i) => (
                            <tr key={entry.userId}>
                                <td className="fw-bold align-middle">{MEDAL[i] ?? i + 1}</td>
                                <td className="fw-semibold align-middle">{entry.username}</td>
                                <td className="align-middle">
                                    <OverlayTrigger
                                        trigger={["hover", "focus"]}
                                        placement="right"
                                        overlay={<StopsPopover entry={entry} network={network} />}
                                    >
                                        <span style={{ cursor: "default", display: "inline-flex" }}>
                                            <RoutePreview
                                                startStation={entry.startStation}
                                                endStation={entry.endStation}
                                                colors={[START_COLOR, END_COLOR]}
                                            />
                                        </span>
                                    </OverlayTrigger>
                                </td>
                                <td className="text-muted small align-middle">{formatDate(entry.startTime)}</td>
                                <td className="text-muted small align-middle">
                                    {Math.floor(entry.endTime - entry.startTime)}s
                                </td>
                                <td className="text-end align-middle">
                                    <Badge bg="warning" text="dark" pill>
                                        {entry.coins}
                                    </Badge>
                                </td>
                            </tr>
                        ))}
                        {entries.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center text-muted py-4">
                                    No completed games yet. Claim your place by winning a game!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </Container>
    );
}
