import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { MetroDot, MetroConnector } from "./Metro";
import { GREY } from "../models/colors";

function SlotStation({ stations, offset = 0 }) {
    const [index, setIndex] = useState(offset % stations.length);
    const [key, setKey] = useState(0); // special prop, same as the one in lists

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((i) => (i + 1) % stations.length);
            setKey((k) => k + 1);
        }, 600);
        return () => clearInterval(timer);
    }, [stations]);

    const curr = stations[index];
    const next = stations[(index + 1) % stations.length];

    return (
        <div className="slot-reel">
            <div key={key} className="slot-strip">
                <div className="slot-item">{curr}</div>
                <div className="slot-item">{next}</div>
            </div>
        </div>
    );
}

export function TicketFull({ stations, fromColor, toColor, coins, onBoard, onClose }) {
    return (
        <div className="ticket-full">
            <div className="ticket-left">
                <div>
                    <div className="mono ticket-boarding-label">Boarding Pass</div>
                    <div className="display-font ticket-brand">Last Race</div>
                    <div className="ticket-edition">Tunnelbana edition</div>
                </div>
                <div className="ticket-info-row">
                    <div>
                        <div className="mono ticket-info-label">Wallet</div>
                        <div className="ticket-coins-value">
                            {coins} <span className="ticket-coins-unit">coins</span>
                        </div>
                    </div>
                    <div>
                        <div className="mono ticket-info-label">City</div>
                        <div className="ticket-seat-value">Stockholm</div>
                    </div>
                </div>
            </div>
            <div className="ticket-right">
                <RouteHeader
                    from={<SlotStation stations={stations} offset={0} />}
                    to={<SlotStation stations={stations} offset={Math.floor(stations.length / 2)} />}
                    fromColor={fromColor}
                    toColor={toColor}
                />
                <div className="d-flex align-items-center my-2">
                    <MetroDot color={fromColor} />
                    <MetroConnector color={GREY} vertical={false} />
                    <MetroDot color={GREY} />
                    <MetroConnector color={GREY} vertical={false} />
                    <MetroDot color={GREY} />
                    <MetroConnector color={GREY} vertical={false} />
                    <MetroDot color={GREY} />
                    <MetroConnector color={GREY} vertical={false} />
                    <MetroDot color={toColor} />
                </div>
                <p className="text-muted mt-2 mb-0" style={{ fontSize: "0.83rem" }}>
                    The 90-second timer starts as soon as you board. The lines disappear and you will need to
                    reconstruct the network from memory and select your route.
                </p>
                <div className="d-flex justify-content-end align-items-center gap-3 mt-3">
                    {onClose && (
                        <Button
                            variant="link"
                            onClick={onClose}
                            className="text-decoration-none"
                            style={{ color: "#aaa", fontSize: "0.88rem", padding: 0 }}
                        >
                            Not yet
                        </Button>
                    )}
                    <button className="btn-lr btn-shine" onClick={onBoard} style={{ width: "auto" }}>
                        {/* not a bootstrap button because it would inject styles */}
                        <i className="bi bi-play-fill me-1" /> Board now
                    </button>
                </div>
            </div>
        </div>
    );
}

export function RouteHeader({ from, to, fromColor, toColor }) {
    return (
        <div className="d-flex justify-content-between mb-3">
            <div>
                <div className="mono text-secondary" style={{ fontSize: ".7rem", letterSpacing: ".1em" }}>
                    FROM
                </div>
                <div className="display-font fs-4" style={{ color: fromColor }}>
                    {from}
                </div>
            </div>

            <i className="bi bi-arrow-right align-self-center fs-3 text-secondary" />

            <div className="text-end">
                <div className="mono text-secondary" style={{ fontSize: ".7rem", letterSpacing: ".1em" }}>
                    TO
                </div>
                <div className="display-font fs-4" style={{ color: toColor }}>
                    {to}
                </div>
            </div>
        </div>
    );
}
