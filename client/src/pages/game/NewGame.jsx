import { useEffect, useState } from "react";
import { Modal, Spinner } from "react-bootstrap";
import { MetroMap } from "../../components/MetroMap";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { createGame, getNetwork } from "../../api/game";
import { TicketFull } from "../../components/Ticket";
import { START_COLOR, END_COLOR } from "../../constants/colors";
import { STARTING_COINS } from "../../constants/game";
import "../styles/ticket.css";

export default function NewGame() {
    const [network, setNetwork] = useState(null);
    const [error, setError] = useState(null);
    const [readyPopup, setReadyPopup] = useState(false);
    const navigate = useNavigate();

    const onError = (e) =>
        e.message === "SESSION_EXPIRED" ? navigate("/logout", { state: { returnTo: "/login" } }) : setError(e.message);

    useEffect(() => {
        getNetwork()
            .then(setNetwork)
            .catch((e) =>
                e.message === "SESSION_EXPIRED"
                    ? navigate("/logout", { state: { returnTo: "/login" } })
                    : setError(e.message),
            );
    }, [navigate]);

    const handleBoard = () =>
        createGame()
            .then((game) => navigate(`/play/${game.id}`, { state: { game, network } }))
            .catch(onError);

    return (
        <div className="container py-4">
            <h2 className="mb-4">Network Map</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {!network && !error && (
                <div className="text-center py-5">
                    <Spinner animation="border" />
                </div>
            )}
            {network && (
                <>
                    <div className="mb-4">
                        <MetroMap style={{ maxHeight: "60vh" }} />
                    </div>
                    <div className="d-flex justify-content-center">
                        <button
                            className="btn-lr btn-shine"
                            onClick={() => setReadyPopup(true)}
                            style={{ width: "auto" }}
                        >
                            {/* not a bootstrap button because it would inject styles */}
                            Ready
                        </button>
                    </div>
                    <Modal
                        show={readyPopup}
                        onHide={() => setReadyPopup(false)}
                        centered
                        dialogClassName="modal-ticket"
                        contentClassName="bg-transparent border-0 shadow-none"
                    >
                        <Modal.Body className="p-0">
                            <TicketFull
                                stations={[...new Set(network.connections.flatMap((c) => [c.station1, c.station2]))]}
                                fromColor={START_COLOR}
                                toColor={END_COLOR}
                                coins={STARTING_COINS}
                                displayMessage="The 90-second timer starts as soon as you board. The lines disappear and you will need to reconstruct the network from memory and select your route."
                            >
                                <div className="d-flex justify-content-end align-items-center gap-3 mt-3">
                                    <Button
                                        variant="link"
                                        onClick={() => setReadyPopup(false)}
                                        className="text-decoration-none"
                                        style={{ color: "#aaa", fontSize: "0.88rem", padding: 0 }}
                                    >
                                        Not yet
                                    </Button>
                                    <button
                                        className="btn-lr btn-shine"
                                        onClick={handleBoard}
                                        style={{ width: "auto" }}
                                    >
                                        {/* not a bootstrap button because it would inject styles */}
                                        Board now
                                    </button>
                                </div>
                            </TicketFull>
                        </Modal.Body>
                    </Modal>
                </>
            )}
        </div>
    );
}
