import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useLocation, useParams } from "react-router";
import { getGame, getNetwork } from "../api/game";

export default function PlayGame() {
    const { id } = useParams();
    const { state } = useLocation();

    const [game, setGame] = useState(state?.game ?? null);
    const [network, setNetwork] = useState(state?.network ?? null);
    const [error, setError] = useState(null);

    // this will only run on mount, its dependencies are guaranteed to be stable
    // the pourpose of this is to fetch the game and network if we don't have them from the location state (e.g. user refreshes the page or navigates with url)
    // despite this not being esplicitly required by the exam text its still very useful for debugging
    useEffect(() => {
        Promise.all([
            game ? Promise.resolve(game) : getGame(id),
            network ? Promise.resolve(network) : getNetwork(),
        ])
            .then(([g, n]) => { setGame(g); setNetwork(n); })
            .catch((e) => setError(e.message));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (error) return <div className="container py-4 alert alert-danger">{error}</div>;
    if (!game || !network) return <div className="text-center py-5"><Spinner animation="border" /></div>;

    return (
        <div className="container py-4">
            <h2>Game #{game.id}</h2>
            <p><strong>From:</strong> {game.startStation}</p>
            <p><strong>To:</strong> {game.endStation}</p>
            <p><strong>Coins:</strong> {game.coins}</p>
        </div>
    );
}
