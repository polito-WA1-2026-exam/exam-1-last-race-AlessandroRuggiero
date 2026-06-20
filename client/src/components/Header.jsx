import { useContext } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import UserContext from "../contexts/UserContext";
import { BLUE } from "../constants/colors";

const PILL = {
    backgroundColor: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.22)",
    borderRadius: "999px",
    fontSize: "0.85rem",
    color: "white",
};

function Header() {
    const user = useContext(UserContext);

    return (
        <Navbar style={{ backgroundColor: BLUE }} expand="sm" className="py-3" variant="dark">
            <Container>
                <Navbar.Brand as={Link} to="/" className="fw-bold fs-5 text-white">
                    LastRace
                </Navbar.Brand>
                <Nav className="ms-auto align-items-center gap-2">
                    {user.username ? <LoggedInNav name={user.username} /> : <LoginButton />}
                </Nav>
            </Container>
        </Navbar>
    );
}

function LoggedInNav({ name }) {
    return (
        <div className="d-flex align-items-center gap-2">
            <Link to="/leaderboard" className="px-3 py-1 text-decoration-none fw-medium" style={PILL}>
                Leaderboard
            </Link>
            <div className="d-flex align-items-center px-3 py-1 gap-2" style={PILL}>
                {/* <span className="fw-bold" style={{ color: RANK_COLOR(rank), fontSize: "0.8rem" }}>#{rank}</span> */}
                <span className="fw-medium">{name}</span>
                <span style={{ opacity: 0.25 }}>|</span>
                <Link
                    to="/logout"
                    className="text-decoration-none"
                    style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.82rem" }}
                >
                    Sign out
                </Link>
            </div>
        </div>
    );
}

function LoginButton() {
    const navigate = useNavigate();
    return (
        <button
            className="fw-semibold px-3 py-1"
            style={{
                ...PILL,
                backgroundColor: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.35)",
                cursor: "pointer",
            }}
            onClick={() => navigate("/login")}
        >
            Log In
        </button>
    );
}

export default Header;
