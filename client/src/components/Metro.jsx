import { Button, ListGroup } from "react-bootstrap";

import "../styles/metro.css";
import { GREY, START_COLOR, END_COLOR } from "../models/colors";


export function MetroDot({ color }) {
    return <div className="metro-dot" style={{ color }} />;
}

export function MetroConnector({ color, vertical }) {
    return <div className={vertical ? "metro-connector" : "metro-connector-h"} style={{ backgroundColor: color }} />;
}


export function ConnectionItem({ conn, selected, onClick, onRemove, startStation, endStation }) {
    const colors = [
        conn.station1 === startStation ? START_COLOR : conn.station1 === endStation ? END_COLOR : GREY,
        conn.station2 === startStation ? START_COLOR : conn.station2 === endStation ? END_COLOR : GREY,
    ];
    return (
        <ListGroup.Item
            action={!!onClick}
            onClick={onClick}
            className={`d-flex justify-content-between align-items-center text-dark ${selected ? "connection-selected" : ""}`}
        >
            <div className="d-flex align-items-center">
                <span className="me-2 fw-semibold">{conn.station1}</span>
                <MetroDot color={colors[0]} />
                <MetroConnector color={GREY} vertical={false} />
                <MetroDot color={colors[1]} />
                <span className="ms-2 fw-semibold">{conn.station2}</span>
            </div>
            {onRemove && (
                <Button variant="outline-danger" size="sm" onClick={(e) => { e.stopPropagation(); onRemove(conn); }}>×</Button>
            )}
        </ListGroup.Item>
    );
}

export function RoutePreview({ startStation, endStation, colors }) {
    return (
        <div className="d-flex align-items-center">
            <span className="me-2 fw-semibold" style={{ color: colors[0] }}>{startStation}</span>
            <MetroDot color={colors[0]} />
            <MetroConnector color={GREY} vertical={false} />
            <MetroDot color={GREY} />
            <MetroConnector color={GREY} vertical={false} />
            <MetroDot color={GREY} />
            <MetroConnector color={GREY} vertical={false} />
            <MetroDot color={colors[1]} />
            <span className="ms-2 fw-semibold" style={{ color: colors[1] }}>{endStation}</span>
        </div>
    );
}
