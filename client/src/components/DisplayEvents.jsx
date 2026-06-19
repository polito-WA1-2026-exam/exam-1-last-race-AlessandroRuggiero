import { useState } from "react";
import { PURPLE, GREY } from "../models/colors";
import { JourneyTrack } from "./Metro";

const RED = "#dc3545";
const GREEN = "#198754";

function CoinDelta({ effect }) {
    const positive = effect >= 0;
    return (
        <div
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                background: positive ? "rgba(25,135,84,0.12)" : "rgba(220,53,69,0.12)",
                border: `2px solid ${positive ? GREEN : RED}`,
                borderRadius: 12,
                padding: "0.45rem 1.1rem",
                color: positive ? GREEN : RED,
                fontWeight: 800,
                fontSize: "1.5rem",
                letterSpacing: "-0.01em",
            }}
        >
            {positive ? "+" : ""}
            {effect}
            <span style={{ fontSize: "0.75rem", fontWeight: 600, opacity: 0.8 }}>coins</span>
        </div>
    );
}

export default function DisplayEvents({ events, connections, startCoins, setStateIndex }) {
    const [eventIndex, setEventIndex] = useState(0);
    const event = events[eventIndex];
    const conn = connections[eventIndex];
    const isLast = eventIndex === events.length - 1;
    const positive = event.effect >= 0;

    const coinsNow = startCoins + events.slice(0, eventIndex + 1).reduce((acc, e) => acc + e.effect, 0);
    const coinsBefore = startCoins + events.slice(0, eventIndex).reduce((acc, e) => acc + e.effect, 0);

    const handleNext = () => {
        if (!isLast) setEventIndex((prev) => prev + 1);
        else setStateIndex(2);
    };

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "3rem 1rem",
            }}
        >
            <div style={{ width: "100%", maxWidth: 520 }}>
                {/* Header bar */}
                <div
                    style={{
                        background: "#1e1b2e",
                        color: "white",
                        borderRadius: "16px 16px 0 0",
                        padding: "1.1rem 1.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <div>
                        <div
                            className="mono"
                            style={{ color: "#f59e0b", fontSize: "0.6rem", letterSpacing: "0.16em", marginBottom: 2 }}
                        >
                            Journey Update
                        </div>
                        <div style={{ fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.01em" }}>
                            Segment {eventIndex + 1} of {events.length}
                        </div>
                    </div>
                    <JourneyTrack total={events.length + 1} current={eventIndex + 2} />
                </div>

                {/* Main card */}
                <div
                    style={{
                        background: "white",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                        padding: "1.75rem 1.75rem 1.5rem",
                    }}
                >
                    {/* Connection segment */}
                    <div
                        style={{
                            background: "#f8f6ff",
                            border: `2px solid ${PURPLE}22`,
                            borderRadius: 12,
                            padding: "0.9rem 1.2rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            marginBottom: "1.5rem",
                        }}
                    >
                        <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "#1e1b2e", whiteSpace: "nowrap" }}>
                            {conn.station1}
                        </span>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                flex: 1,
                                justifyContent: "center",
                                color: PURPLE,
                            }}
                        >
                            <i className="bi bi-arrow-right" style={{ fontSize: "1.3rem" }} />
                        </div>
                        <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "#1e1b2e", whiteSpace: "nowrap" }}>
                            {conn.station2}
                        </span>
                    </div>

                    {/* Event announcement */}
                    <div
                        style={{
                            borderLeft: `4px solid ${positive ? "#198754" : "#dc3545"}`,
                            paddingLeft: "1rem",
                            marginBottom: "1.5rem",
                        }}
                    >
                        <div
                            className="mono"
                            style={{
                                fontSize: "0.58rem",
                                color: positive ? GREEN : RED,
                                letterSpacing: "0.14em",
                                marginBottom: "0.4rem",
                            }}
                        >
                            {positive ? "Bonus event" : "Incident"}
                        </div>
                        <p style={{ fontWeight: 600, fontSize: "1rem", color: "#1e1b2e", margin: 0, lineHeight: 1.45 }}>
                            {event.description}
                        </p>
                    </div>

                    {/* Coin effect + running total */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "1rem",
                            flexWrap: "wrap",
                        }}
                    >
                        <CoinDelta effect={event.effect} />

                        <div style={{ textAlign: "right" }}>
                            <div
                                className="mono"
                                style={{ fontSize: "0.58rem", color: "#adb5bd", letterSpacing: "0.12em" }}
                            >
                                Balance
                            </div>
                            <div style={{ display: "flex", alignItems: "baseline", gap: "0.3rem" }}>
                                <span
                                    style={{
                                        fontSize: "0.85rem",
                                        color: GREY,
                                        textDecoration: "line-through",
                                        fontWeight: 500,
                                    }}
                                >
                                    {coinsBefore}
                                </span>
                                <i className="bi bi-arrow-right" style={{ fontSize: "0.9rem", color: GREY }} />
                                <span
                                    style={{
                                        fontSize: "1.4rem",
                                        fontWeight: 800,
                                        color: "#f59e0b",
                                        letterSpacing: "-0.01em",
                                    }}
                                >
                                    {coinsNow}
                                </span>
                                <span style={{ fontSize: "0.7rem", color: GREY, fontWeight: 600 }}>coins</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer action */}
                <div
                    style={{
                        background: "white",
                        borderRadius: "0 0 16px 16px",
                        borderTop: "1px solid #f0edf8",
                        padding: "1rem 1.75rem",
                        display: "flex",
                        justifyContent: "flex-end",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                    }}
                >
                    <button className="btn-lr" onClick={handleNext}>
                        {isLast ? "See result" : "Next stop"}
                    </button>
                </div>
            </div>
        </div>
    );
}
