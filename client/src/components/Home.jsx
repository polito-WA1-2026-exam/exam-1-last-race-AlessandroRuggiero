import { useContext } from 'react';
import { useNavigate } from 'react-router';
import UserContext from '../contexts/UserContext';

function PlayButton() {
    const navigate = useNavigate()
    const user = useContext(UserContext)

    if (!user.id)
        return (
            <button className="btn btn-warning fw-bold" onClick={() => navigate('/login')}>
                Log in to Play
            </button>
        );

    return (
        <button className="btn btn-primary" onClick={() => navigate('/play')}>
            Play
        </button>
    );
}


export default function Home() {
    return (
        <div className="container py-4">
            <h2>How to play</h2>
            <h5 className="mt-3">1. Setup</h5>
            <p>View the full network map — all stations, connections, and lines. When ready, proceed to the next phase.</p>
            <h5>2. Planning</h5>
            <p>You'll see:</p>
            <ul>
                <li>The network map showing station names only (no lines).</li>
                <li>A randomly assigned start and destination (at least 3 stops apart).</li>
                <li>The full list of segments, e.g. <em>Porta Velaria — Fontana Oscura</em>.</li>
            </ul>
            <p>You have <strong>90 seconds</strong> to scroll the segment list, reconstruct the network, and select segments in order to build your route from start to destination. Submit before time runs out — otherwise the route is submitted as-is.</p>
            <p>A route is valid if it starts and ends at the assigned stations and each segment follows a line (line changes only at interchange stations).</p>

            <h5>3. Execution</h5>
            <p>Each segment of your route triggers a random event that adds or removes coins. Steps are revealed one at a time. An invalid or incomplete route skips this phase and costs you all 20 coins (score: 0).</p>

            <h5>4. Result</h5>
            <p>Your final score is your remaining coins (minimum 0). You can then start a new game.</p>
            <div className="text-center mt-4">
                <PlayButton />
            </div>
        </div>
    );
}