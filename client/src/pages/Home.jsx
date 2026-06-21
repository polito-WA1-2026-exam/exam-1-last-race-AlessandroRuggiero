import { useContext } from "react";
import { useNavigate } from "react-router";
import { Button, Container, Row, Col } from "react-bootstrap";
import UserContext from "../contexts/UserContext";
import { MetroDot, MetroConnector, MetroStop } from "../components/Metro";
import { BLUE } from "../constants/colors";
import "../styles/panels.css";

function PlayButton() {
    const navigate = useNavigate();
    const user = useContext(UserContext);

    if (!user.id)
        return (
            <Button
                className="fw-bold w-100"
                style={{ backgroundColor: BLUE, borderColor: BLUE }}
                onClick={() => navigate("/login")}
            >
                Log in to Play
            </Button>
        );

    return (
        <Button
            className="fw-bold w-100"
            style={{ backgroundColor: BLUE, borderColor: BLUE }}
            onClick={() => navigate("/play")}
        >
            Start a game
        </Button>
    );
}

export default function Home() {
    return (
        <Container className="py-5">
            <Row className="g-5 align-items-start">
                <Col md={5}>
                    <div className="sticky-top" style={{ top: "5rem" }}>
                        <div className="d-flex align-items-center mb-3">
                            <MetroDot color={BLUE} size="lg" />
                            <MetroConnector color={BLUE} vertical={false} />
                            <MetroDot color={BLUE} size="lg" />
                            <MetroConnector color={BLUE} vertical={false} />
                            <MetroDot color={BLUE} size="lg" />
                            <MetroConnector color={BLUE} vertical={false} />
                            <MetroDot color={BLUE} size="lg" />
                        </div>
                        <h1 className="lr-title mb-1">
                            LastRace
                        </h1>
                        <p className="mb-4" style={{ color: BLUE, fontSize: "0.95rem", letterSpacing: "0.04em" }}>
                            Tunnelbana edition
                        </p>
                        <p className="text-muted mb-4">
                            A memory game set on Stockholm's Tunnelbana. Study the network, plan your route, then
                            navigate it blind under time pressure. Random events will push your coins up or down at
                            every station.
                        </p>
                        <PlayButton />
                    </div>
                </Col>

                <Col md={7}>
                    <p
                        className="fw-semibold mb-4"
                        style={{ color: BLUE, fontSize: "0.75rem", letterSpacing: "0.14em" }}
                    >
                        HOW TO PLAY
                    </p>

                    <MetroStop num="1" title="Study the network" isLast={false}>
                        <p className="text-muted">
                            The full Tunnelbana network is displayed. Every line, every station, every connection.
                            Memorise it and then, when you feel ready, move to the next phase.
                        </p>
                    </MetroStop>

                    <MetroStop num="2" title="Plan your route" isLast={false}>
                        <p className="text-muted">
                            The lines disappear. You see only station names, a randomly assigned <strong>start</strong>{" "}
                            and <strong>destination</strong> (at least 3 stops apart), and a shuffled list of connected
                            station pairs.
                        </p>
                        <p className="text-muted">
                            You have <strong>90 seconds</strong> to mentally reconstruct the network and select the
                            segments that form your route in order, from start to destination. When the time is up
                            whatever you've built so far gets submitted.
                        </p>
                        <p className="text-muted">
                            A valid route follows real lines and only switches lines at interchange stations.
                        </p>
                    </MetroStop>

                    <MetroStop num="3" title="Ride your Route" isLast={false}>
                        <p className="text-muted">If your route is invalid or incomplete, you lose all 20 coins.</p>
                        <p className="text-muted">
                            Otherwise, each segment triggers a random event: a bonus, a delay, a surprise. Coins are
                            added or deducted, revealed one stop at a time.
                        </p>
                    </MetroStop>

                    <MetroStop num="4" title="See your score" isLast={true}>
                        <p className="text-muted">
                            Your final score is the coins you have left (never below zero). Compete with other players
                            for a spot on the leaderboard, or just try to outdo yourself.
                        </p>
                    </MetroStop>
                </Col>
            </Row>
        </Container>
    );
}
