import { useState } from "react";
import { BLUE, GREY, RED, GREEN } from "../../constants/colors";
import { JourneyTrack } from "../../components/Metro";
import "../../styles/display-events.css";

export default function DisplayEvents({ events, connections, departureStation, startCoins, setStateIndex }) {
    const [eventIndex, setEventIndex] = useState(0);
    const [lastStation, setLastStation] = useState(departureStation);

    const event = events[eventIndex];
    const isLast = eventIndex === events.length - 1;
    const positive = event.effect >= 0;

    const c = connections[eventIndex];
    const conn = c.station1 === lastStation ? c : { station1: c.station2, station2: c.station1 };

    const coinsNow = startCoins + events.slice(0, eventIndex + 1).reduce((acc, e) => acc + e.effect, 0);
    const coinsBefore = startCoins + events.slice(0, eventIndex).reduce((acc, e) => acc + e.effect, 0);

    const handleNext = () => {
        if (!isLast) {
            setLastStation(conn.station2);
            setEventIndex((prev) => prev + 1);
        } else {
            setStateIndex(2);
        }
    };

    return (
        <div className="de-wrapper">
            <div className="de-container">
                {/* Header bar */}
                <div className="de-header">
                    <div>
                        <div className="mono de-header-label">Journey Update</div>
                        <div className="de-header-title">
                            Segment {eventIndex + 1} of {events.length}
                        </div>
                    </div>
                    <JourneyTrack total={events.length + 1} current={eventIndex + 2} />
                </div>

                {/* Main card */}
                <div className="de-card">
                    {/* Connection segment */}
                    <div className="de-conn" style={{ border: `2px solid ${BLUE}22` }}>
                        <span className="de-station">{conn.station1}</span>
                        <div className="de-conn-arrow" style={{ color: BLUE }}>
                            <i className="bi bi-arrow-right" />
                        </div>
                        <span className="de-station">{conn.station2}</span>
                    </div>

                    {/* Event announcement */}
                    <div className="de-event" style={{ borderLeft: `4px solid ${positive ? "#198754" : "#dc3545"}` }}>
                        <div className="mono de-event-label" style={{ color: positive ? GREEN : RED }}>
                            {positive ? "+" : ""}
                            {event.effect} coins
                        </div>
                        <p className="de-event-desc">{event.description}</p>
                    </div>

                    {/* Running total */}
                    <div className="de-balance">
                        <div className="mono de-balance-label">Balance</div>
                        <div className="de-balance-values">
                            <span className="de-coins-before" style={{ color: GREY }}>
                                {coinsBefore}
                            </span>
                            <i className="bi bi-arrow-right de-coins-arrow" style={{ color: GREY }} />
                            <span className="de-coins-now">{coinsNow}</span>
                            <span className="de-coins-unit" style={{ color: GREY }}>
                                coins
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer action */}
                <div className="de-footer">
                    <button className="btn-lr" onClick={handleNext}>
                        {isLast ? "See result" : "Next stop"}
                    </button>
                </div>
            </div>
        </div>
    );
}
