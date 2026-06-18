import { ListGroup } from "react-bootstrap";

import "../styles/metro.css";
import { GREY, PURPLE, START_COLOR, END_COLOR } from "../models/colors";

export function MetroDot({ color, size }) {
    const cls = size === "lg" ? "metro-dot metro-dot-lg" : "metro-dot";
    return <div className={cls} style={{ color }} />;
}

export function MetroConnector({ color, vertical }) {
    return <div className={vertical ? "metro-connector" : "metro-connector-h"} style={{ backgroundColor: color }} />;
}

export function ConnectionItem({ conn, selected, onClick, onRemove, onMoveUp, onMoveDown, startStation, endStation }) {
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
            <div className="d-flex align-items-center text-nowrap flex-shrink-1" style={{ minWidth: 0 }}>
                <span className="me-2 fw-semibold">{conn.station1}</span>
                <MetroDot color={colors[0]} />
                <MetroConnector color={GREY} vertical={false} />
                <MetroDot color={colors[1]} />
                <span className="ms-2 fw-semibold">{conn.station2}</span>
            </div>
            {(onMoveUp !== undefined || onMoveDown !== undefined) && (
                <div className="d-flex align-items-center ms-auto gap-1">
                    <button
                        className="btn btn-link btn-sm p-0 lh-1 text-secondary"
                        disabled={!onMoveUp}
                        onClick={(e) => { e.stopPropagation(); onMoveUp?.(); }}
                        style={{ fontSize: '0.7rem' }}
                    >
                        <i className="bi bi-chevron-up" />
                    </button>
                    <button
                        className="btn btn-link btn-sm p-0 lh-1 text-secondary"
                        disabled={!onMoveDown}
                        onClick={(e) => { e.stopPropagation(); onMoveDown?.(); }}
                        style={{ fontSize: '0.7rem' }}
                    >
                        <i className="bi bi-chevron-down" />
                    </button>
                </div>
            )}
            {onRemove && (
                <button
                    className="btn-close ms-1 p-0 lh-1"
                    style={{ fontSize: '0.7rem' }}
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove(conn);
                    }}
                />
            )}
        </ListGroup.Item>
    );
}

export function MetroStop({ num, title, color = PURPLE, isLast, children }) {
    return (
        <div className="metro-stop">
            <div className="metro-stop-track">
                <MetroDot color={color} size="lg" />
                {!isLast && <div className="metro-stop-grow" style={{ backgroundColor: color }} />}
            </div>
            <div className="metro-stop-content">
                <div className="mb-1">
                    <span style={{ color, fontSize: "1.1rem", fontWeight: 700, letterSpacing: "0.08em" }}>{num}</span>
                    <span className="fw-bold ms-2" style={{ fontSize: "1.05rem" }}>
                        {title}
                    </span>
                </div>
                {children}
            </div>
        </div>
    );
}

export function RoutePreview({ startStation, endStation, colors }) {
    return (
        <div className="d-flex align-items-center">
            <span className="me-2 fw-semibold" style={{ color: colors[0] }}>
                {startStation}
            </span>
            <MetroDot color={colors[0]} />
            <MetroConnector color={GREY} vertical={false} />
            <MetroDot color={GREY} />
            <MetroConnector color={GREY} vertical={false} />
            <MetroDot color={GREY} />
            <MetroConnector color={GREY} vertical={false} />
            <MetroDot color={colors[1]} />
            <span className="ms-2 fw-semibold" style={{ color: colors[1] }}>
                {endStation}
            </span>
        </div>
    );
}
