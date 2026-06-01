import { Alert } from "react-bootstrap";
import { useNavigate } from "react-router";

export default function DisplayFinishedGame({ result }) {
    const navigate = useNavigate();
    const won = result.status === "won";

    return (
        <div className="container py-5 text-center">
            <Alert variant={won ? "success" : "danger"}>
                <Alert.Heading>{won ? "You won!" : "You lost!"}</Alert.Heading>
                <p>Final coins: {result.coins}</p>
            </Alert>
            <button className="btn btn-primary" onClick={() => navigate("/")}>
                Back to home
            </button>
        </div>
    );
}
