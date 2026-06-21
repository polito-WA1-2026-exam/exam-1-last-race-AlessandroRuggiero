import { ListGroup } from "react-bootstrap";

import "../styles/metro.css";
import { GREY, BLUE } from "../constants/colors";

export function MetroDot({ color, size }) {
    const cls = size === "lg" ? "metro-dot metro-dot-lg" : "metro-dot";
    return <div className={cls} style={{ color }} />;
}

export function MetroConnector({ color, vertical }) {
    return <div className={vertical ? "metro-connector" : "metro-connector-h"} style={{ backgroundColor: color }} />;
}

export function ConnectionItem({ conn, selected, onClick, onRemove, onMoveUp, onMoveDown }) {
    return (
        <ListGroup.Item
            action={!!onClick}
            onClick={onClick}
            className={`d-flex justify-content-between align-items-center text-dark ${selected ? "connection-selected" : ""}`}
        >
            <div className="d-flex align-items-center text-nowrap flex-shrink-1 metro-label-inner">
                <span className="me-2">{conn.station1}</span>
                <MetroDot color={GREY} />
                <MetroConnector color={GREY} vertical={false} />
                <MetroDot color={GREY} />
                <span className="ms-2">{conn.station2}</span>
            </div>
            {(onMoveUp !== undefined || onMoveDown !== undefined) && (
                <div className="d-flex align-items-center ms-auto gap-1">
                    <button
                        className="btn btn-link btn-sm p-0 lh-1 text-secondary metro-btn-sm"
                        disabled={!onMoveUp}
                        onClick={(e) => {
                            e.stopPropagation();
                            onMoveUp?.();
                        }}
                    >
                        <i className="bi bi-chevron-up" />
                    </button>
                    <button
                        className="btn btn-link btn-sm p-0 lh-1 text-secondary metro-btn-sm"
                        disabled={!onMoveDown}
                        onClick={(e) => {
                            e.stopPropagation();
                            onMoveDown?.();
                        }}
                    >
                        <i className="bi bi-chevron-down" />
                    </button>
                </div>
            )}
            {onRemove && (
                <button
                    className="btn-close ms-1 p-0 lh-1 metro-btn-sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove(conn);
                    }}
                />
            )}
        </ListGroup.Item>
    );
}

export function MetroStop({ num, title, color = BLUE, isLast, children }) {
    return (
        <div className="metro-stop">
            <div className="metro-stop-track">
                <MetroDot color={color} size="lg" />
                {!isLast && <div className="metro-stop-grow" style={{ backgroundColor: color }} />}
            </div>
            <div className="metro-stop-content">
                <div className="mb-1">
                    <span className="metro-stop-num" style={{ color }}>
                        {num}
                    </span>
                    <span className="fw-bold ms-2 metro-stop-title">{title}</span>
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

export function JourneyTrack({ total, current }) {
    return (
        <div className="journey-track">
            {Array.from({ length: total }).map((_, i) => {
                const done = i < current;
                const active = i === current - 1;
                return (
                    <div key={i} className="journey-track-item">
                        <div
                            style={{
                                width: active ? 14 : 10,
                                height: active ? 14 : 10,
                                borderRadius: "50%",
                                border: `2px solid ${done ? "white" : "rgba(255,255,255,0.35)"}`,
                                background: done ? "white" : "transparent",
                                transition: "all 0.3s ease",
                                boxShadow: active ? `0 0 0 3px rgba(255,255,255,0.25)` : "none",
                            }}
                        />
                        {i < total - 1 && (
                            <div
                                style={{
                                    width: 28,
                                    height: 3,
                                    background: i < current - 1 ? "white" : "rgba(255,255,255,0.3)",
                                    transition: "background 0.3s ease",
                                }}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
