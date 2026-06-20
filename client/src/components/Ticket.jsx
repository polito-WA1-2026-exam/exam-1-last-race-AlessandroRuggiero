import { useEffect, useState } from "react";
import { MetroDot, MetroConnector } from "./Metro";
import { GREY } from "../constants/colors";

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

export function TicketFull({
    children,
    stations,
    fromColor,
    toColor,
    coins,
    startStation,
    endStation,
    displayMessage,
}) {
    const showStaticStations = startStation != null && endStation != null;

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
                    from={showStaticStations ? startStation : <SlotStation stations={stations} offset={0} />}
                    to={
                        showStaticStations ? (
                            endStation
                        ) : (
                            <SlotStation stations={stations} offset={Math.floor(stations.length / 2)} />
                        )
                    }
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
                    {displayMessage}
                </p>
                {children}
            </div>
        </div>
    );
}

function RouteHeader({ from, to, fromColor, toColor }) {
    return (
        <div className="d-flex align-items-center mb-3">
            <div style={{ flex: 1 }}>
                <div className="mono text-secondary" style={{ fontSize: ".7rem", letterSpacing: ".1em" }}>
                    FROM
                </div>
                <div className="display-font fs-4" style={{ color: fromColor }}>
                    {from}
                </div>
            </div>

            <i className="bi bi-arrow-right flex-shrink-0 mx-2 fs-3 text-secondary" />

            <div className="text-end" style={{ flex: 1 }}>
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
