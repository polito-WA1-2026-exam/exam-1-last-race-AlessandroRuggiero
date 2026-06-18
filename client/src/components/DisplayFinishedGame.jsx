import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router";
import { MetroDot, MetroConnector } from "./Metro";
import { PURPLE } from "../models/colors";

export default function DisplayFinishedGame({ result }) {
    const navigate = useNavigate();
    const won = result.status === "won";

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={5}>
                    <div className="d-flex align-items-center mb-4">
                        <MetroDot color={PURPLE} size="lg" />
                        <MetroConnector color={PURPLE} vertical={false} />
                        <MetroDot color={PURPLE} size="lg" />
                        <MetroConnector color={PURPLE} vertical={false} />
                        <MetroDot color={PURPLE} size="lg" />
                        <MetroConnector color={PURPLE} vertical={false} />
                        <MetroDot color={PURPLE} size="lg" />
                    </div>

                    <h1 className="fw-bold mb-1" style={{ letterSpacing: "-0.02em" }}>
                        {won ? "You won!" : "You lost"}
                    </h1>
                    <p className="text-muted mb-4">
                        {won ? "Congratulations!" : "Your route did not connect the departure and the destination."}
                    </p>

                    <Card className="mb-4 border-0 bg-light">
                        <Card.Body>
                            <div className="text-muted small mb-1">Final score</div>
                            <div className="fs-3 fw-bold">{result.coins} coins</div>
                        </Card.Body>
                    </Card>

                    <Row className="g-2">
                        <Col>
                            <Button variant="outline-secondary" className="fw-bold w-100" onClick={() => navigate("/")}>
                                Back to home
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                className="fw-bold w-100"
                                style={{ backgroundColor: PURPLE, borderColor: PURPLE }}
                                onClick={() => navigate("/play")}
                            >
                                Try again
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}
