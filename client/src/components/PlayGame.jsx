import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useLocation, useParams } from "react-router";
import { getGame, getNetwork, submitAnswer } from "../api/game";
import PickRoute from "./PickRoute";
import DisplayEvents from "./DisplayEvents";
import DisplayFinishedGame from "./DisplayFinishedGame";
import dayjs from "dayjs";

const GAME_DURATION = 90;

export default function PlayGame() {
    const { id } = useParams();
    const { state } = useLocation();

    const [game, setGame] = useState(state?.game ?? null);
    const [network, setNetwork] = useState(state?.network ?? null);
    const [error, setError] = useState(null);

    const [gameStateIndex, setGameStateIndex] = useState(0); //  ["pick_route", "show_events", "show_results"]
    const [result, setResult] = useState(null);

    // this will only run on mount
    // the pourpose of this is to fetch the game and network if we don't have them from the location state (e.g. user refreshes the page or navigates with url)
    // despite this not being esplicitly required by the exam text its still very useful for debugging
    useEffect(() => {
        window.history.replaceState({}, ""); // clear the location state to avoid using stale data if the user navigates back to this page after finishing a game
        console.log(game);
        Promise.all([game ? Promise.resolve(game) : getGame(id), network ? Promise.resolve(network) : getNetwork()])
            .then(([g, n]) => {
                setGame(g);
                setNetwork(n);
                if (g.answer || dayjs().unix() - g.startTime >= GAME_DURATION) {
                    console.log("redirecting to results");
                    setResult({
                        // this is temporary untill the proper animations are done
                        status: g.status,
                        coins: g.coins,
                        happenedEvents: [],
                        answer: g.answer,
                    });
                    setGameStateIndex(2);
                }
            })
            .catch((e) => setError(e.message));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSubmit = (selected) => {
        if (result) return;
        submitAnswer(
            game.id,
            selected.map((c) => c.id),
        )
            .then((res) => {
                setResult(res);
                setGameStateIndex(res.status === "won" ? 1 : 2);
            })
            .catch((e) => setError(e.message));
    };

    if (error) return <div className="container py-4 alert alert-danger">{error}</div>;
    if (!game || !network)
        return (
            <div className="text-center py-5">
                <Spinner animation="border" />
            </div>
        );
    if (gameStateIndex == 0) {
        return (
            <PickRoute
                game={game}
                network={network}
                gameDuration={GAME_DURATION}
                handleSubmit={handleSubmit}
                shuffleConnections={true}
            />
        );
    }

    if (gameStateIndex == 1) {
        return (
            <DisplayEvents
                events={result.happenedEvents}
                connections={result.answer.map((id) => network.connections.find((c) => c.id === id))}
                startCoins={game.coins}
                setStateIndex={setGameStateIndex}
            />
        );
    }
    if (gameStateIndex == 2) {
        return <DisplayFinishedGame result={result} />;
    }

    return null;
}
